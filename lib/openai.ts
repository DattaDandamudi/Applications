import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });

  return response.data[0].embedding;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  return dotProduct / (magnitudeA * magnitudeB);
}

export async function optimizeResumeSection(
  section: string,
  jobDescription: string,
  sectionType: string,
  customPrompt?: string
): Promise<string> {
  const systemPrompt = `You are an expert resume optimizer. Your task is to rewrite resume sections to maximize ATS compatibility and job description matching while preserving truthfulness.

Rules:
1. NEVER fabricate experience, skills, or achievements
2. Only enhance existing content with better keywords and phrasing
3. Maintain factual accuracy of all claims
4. Optimize for ATS scanning with relevant keywords from the job description
5. Use action verbs and quantifiable results where possible
6. Keep the same general structure and length`;

  const userPrompt = `
Job Description:
${jobDescription}

Original ${sectionType} Section:
${section}

${customPrompt ? `Additional Instructions: ${customPrompt}` : ''}

Please rewrite this section to better match the job description while following all rules above.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  return response.choices[0].message.content || section;
}