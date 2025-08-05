import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const revertSchema = z.object({
  auditLogId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { auditLogId } = revertSchema.parse(body);

    // Get the audit log entry
    const auditLog = await prisma.auditLog.findFirst({
      where: {
        id: auditLogId,
        resume: {
          userId: user.id,
        },
      },
      include: {
        resume: true,
      },
    });

    if (!auditLog) {
      return NextResponse.json({ error: 'Audit log not found' }, { status: 404 });
    }

    if (!auditLog.original) {
      return NextResponse.json({ error: 'No original content to revert to' }, { status: 400 });
    }

    // Find the job resume that contains this change
    const metadata = auditLog.metadata as any;
    if (metadata?.jobId) {
      const jobResume = await prisma.jobResume.findFirst({
        where: {
          jobId: metadata.jobId,
          resumeId: auditLog.resumeId,
        },
      });

      if (jobResume) {
        const optimizedContent = jobResume.optimizedContent as any;
        
        // Revert the specific project if it's a project-level change
        if (metadata.projectId) {
          const projectIndex = optimizedContent.sections.experience.findIndex(
            (p: any) => p.id === metadata.projectId
          );
          
          if (projectIndex !== -1) {
            optimizedContent.sections.experience[projectIndex].optimized = auditLog.original;
            
            // Update the job resume
            await prisma.jobResume.update({
              where: { id: jobResume.id },
              data: {
                optimizedContent,
                projectCards: optimizedContent.sections.experience,
              },
            });
          }
        }
      }
    }

    // Create a new audit log entry for the revert
    await prisma.auditLog.create({
      data: {
        resumeId: auditLog.resumeId,
        action: 'REVERT',
        section: auditLog.section,
        original: auditLog.modified,
        modified: auditLog.original,
        metadata: {
          revertedFromId: auditLogId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully reverted changes',
    });

  } catch (error) {
    console.error('Revert error:', error);
    return NextResponse.json(
      { error: 'Failed to revert changes' },
      { status: 500 }
    );
  }
}