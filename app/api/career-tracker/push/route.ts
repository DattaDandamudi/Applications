import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const pushSchema = z.object({
  jobResumeId: z.string(),
  stage: z.string().optional().default('applied'),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jobResumeId, stage } = pushSchema.parse(body);

    // Get the job resume
    const jobResume = await prisma.jobResume.findFirst({
      where: {
        id: jobResumeId,
        resume: {
          userId: user.id,
        },
      },
      include: {
        job: true,
        resume: true,
      },
    });

    if (!jobResume) {
      return NextResponse.json({ error: 'Job resume not found' }, { status: 404 });
    }

    // Update job stage and applied date
    const updatedJob = await prisma.job.update({
      where: { id: jobResume.jobId },
      data: {
        stage,
        appliedDate: stage === 'applied' ? new Date() : jobResume.job.appliedDate,
      },
    });

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        resumeId: jobResume.resumeId,
        action: 'CAREER_TRACKER_PUSH',
        section: 'Job Application',
        metadata: {
          jobId: jobResume.jobId,
          stage,
          matchScore: jobResume.matchScore,
        },
      },
    });

    return NextResponse.json({
      success: true,
      job: updatedJob,
      message: 'Resume successfully pushed to Career Tracker',
    });

  } catch (error) {
    console.error('Career tracker push error:', error);
    return NextResponse.json(
      { error: 'Failed to push to career tracker' },
      { status: 500 }
    );
  }
}