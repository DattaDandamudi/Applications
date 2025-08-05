import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getEmbedding, cosineSimilarity, optimizeResumeSection } from '@/lib/openai';
import { z } from 'zod';

const optimizeSchema = z.object({
  resumeId: z.string(),
  jobDescription: z.string(),
  jobTitle: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, jobDescription, jobTitle } = optimizeSchema.parse(body);

    // Get the resume
    const resume = await prisma.resume.findFirst({
      where: {
        id: resumeId,
        userId: user.id,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const resumeContent = resume.content as any;

    // Create or find job entry
    let job = await prisma.job.findFirst({
      where: {
        userId: user.id,
        title: jobTitle || 'Untitled Position',
        description: jobDescription,
      },
    });

    if (!job) {
      job = await prisma.job.create({
        data: {
          title: jobTitle || 'Untitled Position',
          company: 'Unknown Company',
          description: jobDescription,
          userId: user.id,
        },
      });
    }

    // Step 1: Parse (already done during upload)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

    // Step 2: Match - Calculate similarity scores
    const jdEmbedding = await getEmbedding(jobDescription);
    
    let totalScore = 0;
    let sectionCount = 0;

    // Calculate match scores for each section
    const sectionScores: Record<string, number> = {};

    if (resumeContent.sections.summary) {
      const summaryEmbedding = await getEmbedding(resumeContent.sections.summary);
      sectionScores.summary = cosineSimilarity(jdEmbedding, summaryEmbedding);
      totalScore += sectionScores.summary;
      sectionCount++;
    }

    if (resumeContent.sections.skills) {
      const skillsEmbedding = await getEmbedding(resumeContent.sections.skills);
      sectionScores.skills = cosineSimilarity(jdEmbedding, skillsEmbedding);
      totalScore += sectionScores.skills;
      sectionCount++;
    }

    // Calculate scores for experience projects
    for (const project of resumeContent.sections.experience) {
      const projectEmbedding = await getEmbedding(project.original);
      const score = cosineSimilarity(jdEmbedding, projectEmbedding);
      sectionScores[project.id] = score;
      totalScore += score;
      sectionCount++;
    }

    const initialMatchScore = sectionCount > 0 ? (totalScore / sectionCount) * 100 : 0;

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing

    // Step 3: Refine - Optimize sections with AI
    const optimizedContent = { ...resumeContent };

    // Optimize summary
    if (optimizedContent.sections.summary) {
      optimizedContent.sections.summary = await optimizeResumeSection(
        optimizedContent.sections.summary,
        jobDescription,
        'Summary'
      );
    }

    // Optimize skills
    if (optimizedContent.sections.skills) {
      optimizedContent.sections.skills = await optimizeResumeSection(
        optimizedContent.sections.skills,
        jobDescription,
        'Skills'
      );
    }

    // Optimize experience projects
    for (let i = 0; i < optimizedContent.sections.experience.length; i++) {
      const project = optimizedContent.sections.experience[i];
      const optimized = await optimizeResumeSection(
        project.original,
        jobDescription,
        'Experience'
      );
      
      optimizedContent.sections.experience[i] = {
        ...project,
        optimized,
      };

      // Create audit log entry
      await prisma.auditLog.create({
        data: {
          resumeId: resume.id,
          action: 'AI_OPTIMIZATION',
          section: `Experience: ${project.project}`,
          original: project.original,
          modified: optimized,
          metadata: {
            jobId: job.id,
            sectionType: 'experience',
            projectId: project.id,
          },
        },
      });
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing

    // Step 4: Finalize - Calculate final match score
    let finalTotalScore = 0;
    let finalSectionCount = 0;

    if (optimizedContent.sections.summary) {
      const summaryEmbedding = await getEmbedding(optimizedContent.sections.summary);
      finalTotalScore += cosineSimilarity(jdEmbedding, summaryEmbedding);
      finalSectionCount++;
    }

    if (optimizedContent.sections.skills) {
      const skillsEmbedding = await getEmbedding(optimizedContent.sections.skills);
      finalTotalScore += cosineSimilarity(jdEmbedding, skillsEmbedding);
      finalSectionCount++;
    }

    for (const project of optimizedContent.sections.experience) {
      if (project.optimized) {
        const projectEmbedding = await getEmbedding(project.optimized);
        finalTotalScore += cosineSimilarity(jdEmbedding, projectEmbedding);
        finalSectionCount++;
      }
    }

    const finalMatchScore = Math.min(95, finalSectionCount > 0 ? (finalTotalScore / finalSectionCount) * 100 : 0);

    // Save optimized version
    const jobResume = await prisma.jobResume.upsert({
      where: {
        jobId_resumeId: {
          jobId: job.id,
          resumeId: resume.id,
        },
      },
      update: {
        optimizedContent,
        matchScore: finalMatchScore,
        projectCards: optimizedContent.sections.experience,
      },
      create: {
        jobId: job.id,
        resumeId: resume.id,
        optimizedContent,
        matchScore: finalMatchScore,
        projectCards: optimizedContent.sections.experience,
      },
    });

    return NextResponse.json({
      jobResumeId: jobResume.id,
      matchScore: finalMatchScore,
      optimizedContent,
      projectCards: optimizedContent.sections.experience,
      analysis: {
        initialScore: initialMatchScore,
        finalScore: finalMatchScore,
        improvement: finalMatchScore - initialMatchScore,
        sectionsOptimized: finalSectionCount,
      },
    });

  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize resume' },
      { status: 500 }
    );
  }
}