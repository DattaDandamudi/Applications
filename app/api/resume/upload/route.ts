import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { parseResumeFile, redactPII } from '@/lib/resume-parser';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string || 'Untitled Resume';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    // Parse the resume
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsedResume = await parseResumeFile(buffer, file.type);

    // Redact PII from the parsed content
    const redactedContent = {
      ...parsedResume,
      rawText: redactPII(parsedResume.rawText),
      sections: {
        ...parsedResume.sections,
        summary: parsedResume.sections.summary ? redactPII(parsedResume.sections.summary) : undefined,
        experience: parsedResume.sections.experience.map(exp => ({
          ...exp,
          original: redactPII(exp.original)
        })),
        projects: parsedResume.sections.projects?.map(proj => ({
          ...proj,
          original: redactPII(proj.original)
        })) || [],
      }
    };

    // Save to database
    const resume = await prisma.resume.create({
      data: {
        title,
        content: redactedContent,
        userId: user.id,
      },
    });

    // Transform to match frontend interface
    const sections = [
      ...(redactedContent.sections.summary ? [{
        id: 'summary',
        type: 'summary',
        title: 'Professional Summary',
        content: redactedContent.sections.summary,
        confidence: 0.9,
        wordCount: redactedContent.sections.summary.split(' ').length
      }] : []),
      ...redactedContent.sections.experience.map((exp, index) => ({
        id: `experience-${index}`,
        type: 'experience',
        title: `${exp.role} - ${exp.company}`,
        content: exp.original,
        confidence: 0.8,
        wordCount: exp.original.split(' ').length
      })),
      ...(redactedContent.sections.education ? [{
        id: 'education',
        type: 'education',
        title: 'Education',
        content: redactedContent.sections.education,
        confidence: 0.85,
        wordCount: redactedContent.sections.education.split(' ').length
      }] : []),
      ...(redactedContent.sections.skills ? [{
        id: 'skills',
        type: 'skills',
        title: 'Skills',
        content: redactedContent.sections.skills,
        confidence: 0.75,
        wordCount: redactedContent.sections.skills.split(' ').length
      }] : []),
      ...(redactedContent.sections.projects || []).map((proj, index) => ({
        id: `project-${index}`,
        type: 'projects',
        title: proj.project,
        content: proj.original,
        confidence: 0.8,
        wordCount: proj.original.split(' ').length
      }))
    ];

    // Extract technologies (simple keyword matching)
    const techKeywords = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'C#',
      'AWS', 'Azure', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'MySQL',
      'Git', 'Jenkins', 'CI/CD', 'Agile', 'Scrum', 'REST', 'GraphQL', 'HTML', 'CSS'
    ];
    
    const technologiesFound = techKeywords.filter(tech => 
      redactedContent.rawText.toLowerCase().includes(tech.toLowerCase())
    );

    const response = {
      id: resume.id,
      title: resume.title,
      sections,
      metadata: {
        confidence: 0.85, // Overall parsing confidence
        parsingMethod: 'header-based', // Could be dynamic based on actual parsing
        wordCount: redactedContent.rawText.split(' ').length,
        technologiesFound,
        warnings: [] // Could include parsing warnings
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}