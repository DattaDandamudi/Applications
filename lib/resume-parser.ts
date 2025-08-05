import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export interface ParsedResume {
  sections: {
    summary?: string;
    experience: ProjectCard[];
    education?: string;
    skills?: string;
    projects?: ProjectCard[];
  };
  rawText: string;
}

export interface ProjectCard {
  id: string;
  company: string;
  role: string;
  project: string;
  original: string;
  optimized?: string;
  customPrompt?: string;
  startDate?: string;
  endDate?: string;
}

export async function parseResumeFile(buffer: Buffer, mimeType: string): Promise<ParsedResume> {
  let text: string;

  if (mimeType === 'application/pdf') {
    const data = await pdf(buffer);
    text = data.text;
  } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else {
    throw new Error('Unsupported file type');
  }

  return parseResumeText(text);
}

export function parseResumeText(text: string): ParsedResume {
  const sections = extractSections(text);
  const experience = extractExperienceProjects(sections.experience || '');
  const projects = extractProjects(sections.projects || '');

  return {
    sections: {
      summary: sections.summary,
      experience,
      education: sections.education,
      skills: sections.skills,
      projects,
    },
    rawText: text,
  };
}

function extractSections(text: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  let currentSection = '';
  let currentContent: string[] = [];

  const sectionHeaders = [
    'summary', 'objective', 'profile',
    'experience', 'work experience', 'employment',
    'education', 'academic background',
    'skills', 'technical skills', 'core competencies',
    'projects', 'personal projects', 'key projects'
  ];

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    const matchedHeader = sectionHeaders.find(header => 
      lowerLine.includes(header) && line.length < 50
    );

    if (matchedHeader) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n');
      }

      // Start new section
      currentSection = matchedHeader.includes('experience') ? 'experience' :
                      matchedHeader.includes('education') ? 'education' :
                      matchedHeader.includes('skill') ? 'skills' :
                      matchedHeader.includes('project') ? 'projects' :
                      matchedHeader.includes('summary') || matchedHeader.includes('objective') || matchedHeader.includes('profile') ? 'summary' :
                      matchedHeader;
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }

  // Save last section
  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n');
  }

  return sections;
}

function extractExperienceProjects(experienceText: string): ProjectCard[] {
  const projects: ProjectCard[] = [];
  const entries = experienceText.split(/(?=\n[A-Z])/g).filter(entry => entry.trim());

  entries.forEach((entry, index) => {
    const lines = entry.split('\n').filter(line => line.trim());
    if (lines.length < 2) return;

    const firstLine = lines[0].trim();
    const secondLine = lines[1]?.trim() || '';

    // Try to extract company and role
    let company = '';
    let role = '';

    if (firstLine.includes('|') || firstLine.includes('-')) {
      const parts = firstLine.split(/[|\-]/).map(p => p.trim());
      role = parts[0] || '';
      company = parts[1] || '';
    } else {
      role = firstLine;
      company = secondLine.split(/[|\-,]/)[0]?.trim() || 'Unknown Company';
    }

    const description = lines.slice(2).join('\n').trim() || lines.slice(1).join('\n').trim();

    if (description) {
      projects.push({
        id: `exp-${index}`,
        company,
        role,
        project: `${role} at ${company}`,
        original: description,
      });
    }
  });

  return projects;
}

function extractProjects(projectsText: string): ProjectCard[] {
  const projects: ProjectCard[] = [];
  const entries = projectsText.split(/(?=\n[A-Z])/g).filter(entry => entry.trim());

  entries.forEach((entry, index) => {
    const lines = entry.split('\n').filter(line => line.trim());
    if (lines.length < 2) return;

    const projectName = lines[0].trim();
    const description = lines.slice(1).join('\n').trim();

    if (description) {
      projects.push({
        id: `proj-${index}`,
        company: 'Personal Project',
        role: 'Developer',
        project: projectName,
        original: description,
      });
    }
  });

  return projects;
}

// PII Detection and Redaction
export function redactPII(text: string): string {
  // Email addresses
  text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]');
  
  // Phone numbers (various formats)
  text = text.replace(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g, '[PHONE_REDACTED]');
  
  // Social Security Numbers
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]');
  
  // Addresses (basic pattern)
  text = text.replace(/\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/gi, '[ADDRESS_REDACTED]');

  return text;
}