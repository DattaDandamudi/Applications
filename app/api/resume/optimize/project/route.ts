import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { optimizeResumeSection } from '@/lib/openai';
import { z } from 'zod';

const optimizeProjectSchema = z.object({
  jobResumeId: z.string(),
  projectId: z.string(),
  customPrompt: z.string().optional(),
  jobDescription: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobResumeId, projectId, customPrompt, jobDescription } = optimizeProjectSchema.parse(body);

    // Get the job resume
    const jobResume = await prisma.jobResume.findFirst({
      where: {
        id: jobResumeId,
        resume: {
          userId: user.id,
        },
      },
      include: {
        resume: true,
        job: true,
      },
    });

    if (!jobResume) {
      return NextResponse.json({ error: 'Job resume not found' }, { status: 404 });
    }

    const optimizedContent = jobResume.optimizedContent as any;
    const projectCards = optimizedContent.sections.experience;

    // Find the specific project
    const projectIndex = projectCards.findIndex((p: any) => p.id === projectId);
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = projectCards[projectIndex];

    // Optimize the project with custom prompt
    const optimizedText = await optimizeResumeSection(
      project.original,
      jobDescription,
      'Project',
      customPrompt
    );

    // Update the project
    projectCards[projectIndex] = {
      ...project,
      optimized: optimizedText,
      customPrompt,
    };

    // Update the job resume
    await prisma.jobResume.update({
      where: { id: jobResumeId },
      data: {
        optimizedContent,
        projectCards,
      },
    });

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        resumeId: jobResume.resumeId,
        action: 'CUSTOM_OPTIMIZATION',
        section: `Project: ${project.project}`,
        original: project.optimized || project.original,
        modified: optimizedText,
        metadata: {
          jobId: jobResume.jobId,
          customPrompt,
          projectId,
        },
      },
    });

    return NextResponse.json({
      project: projectCards[projectIndex],
      success: true,
    });

  } catch (error) {
    console.error('Project optimization error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize project' },
      { status: 500 }
    );
  }
}