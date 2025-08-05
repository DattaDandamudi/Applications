import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const format = request.nextUrl.searchParams.get('format') || 'docx';

    // Get the job resume
    const jobResume = await prisma.jobResume.findFirst({
      where: {
        id,
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
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const optimizedContent = jobResume.optimizedContent as any;

    if (format === 'docx') {
      // Generate DOCX
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Title
            new Paragraph({
              text: jobResume.resume.title,
              heading: HeadingLevel.TITLE,
            }),

            // Summary
            ...(optimizedContent.sections.summary ? [
              new Paragraph({
                text: "Professional Summary",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [new TextRun(optimizedContent.sections.summary)],
              }),
            ] : []),

            // Skills
            ...(optimizedContent.sections.skills ? [
              new Paragraph({
                text: "Skills",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [new TextRun(optimizedContent.sections.skills)],
              }),
            ] : []),

            // Experience
            new Paragraph({
              text: "Professional Experience",
              heading: HeadingLevel.HEADING_1,
            }),
            ...optimizedContent.sections.experience.flatMap((exp: any) => [
              new Paragraph({
                text: `${exp.role} - ${exp.company}`,
                heading: HeadingLevel.HEADING_2,
              }),
              new Paragraph({
                children: [new TextRun(exp.optimized || exp.original)],
              }),
            ]),

            // Education
            ...(optimizedContent.sections.education ? [
              new Paragraph({
                text: "Education",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [new TextRun(optimizedContent.sections.education)],
              }),
            ] : []),
          ],
        }],
      });

      const buffer = await Packer.toBuffer(doc);

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${jobResume.resume.title}_optimized.docx"`,
        },
      });
    }

    // For other formats, return JSON for now
    return NextResponse.json({
      title: jobResume.resume.title,
      content: optimizedContent,
      matchScore: jobResume.matchScore,
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    );
  }
}