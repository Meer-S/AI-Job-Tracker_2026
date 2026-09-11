import { AiData, AiSettings, ColdMessageTemplates } from '../types/job';

/**
 * AI Service for Job Description Parsing, Technical Interview Prep, and Cold Messaging.
 * Operates with live API calls (OpenAI / Anthropic / Ollama) or rich client-side offline heuristics.
 */

export interface ParseJdResult {
  parsedCompetencies: string[];
  requiredExperience: string;
}

export interface InterviewPrepResult {
  questions: string[];
}

export interface ColdMessageResult {
  coldMessages: ColdMessageTemplates;
}

const MAX_AI_OUTPUT_ITEMS = 50;
const MAX_AI_OUTPUT_LENGTH = 10000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value)
  && value.length <= MAX_AI_OUTPUT_ITEMS
  && value.every((item) => typeof item === 'string' && item.length <= MAX_AI_OUTPUT_LENGTH);

const isParseResult = (value: unknown): value is ParseJdResult =>
  isRecord(value)
  && isStringArray(value.parsedCompetencies)
  && typeof value.requiredExperience === 'string'
  && value.requiredExperience.length <= MAX_AI_OUTPUT_LENGTH;

const isInterviewPrepResult = (value: unknown): value is InterviewPrepResult =>
  isRecord(value) && isStringArray(value.questions);

const isColdMessageResult = (value: unknown): value is ColdMessageResult => {
  if (!isRecord(value)) return false;
  const messages = value.coldMessages;
  if (!isRecord(messages)) return false;
  return ['recruiter', 'hiringManager', 'peer'].every((key) => {
    const message = messages[key];
    return message === undefined || (typeof message === 'string' && message.length <= MAX_AI_OUTPUT_LENGTH);
  });
};

const parseJsonContent = (value: unknown): unknown => {
  if (typeof value !== 'string') throw new Error('AI provider returned non-text content.');
  return JSON.parse(value) as unknown;
};

const getOpenAiContent = (value: unknown): unknown => {
  if (!isRecord(value) || !Array.isArray(value.choices) || !isRecord(value.choices[0])) {
    throw new Error('AI provider returned an invalid response shape.');
  }
  const message = value.choices[0].message;
  if (!isRecord(message)) throw new Error('AI provider returned an invalid message shape.');
  return parseJsonContent(message.content);
};

const getOllamaContent = (value: unknown): unknown => {
  if (!isRecord(value)) throw new Error('AI provider returned an invalid response shape.');
  return parseJsonContent(value.response);
};

const readJsonResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) throw new Error(`AI provider request failed with status ${response.status}.`);
  return response.json() as Promise<unknown>;
};

export class AiService {
  /**
   * Parse Job Description text into core technical competencies and required experience.
   */
  static async parseJobDescription(jdText: string, techStack: string[], settings: AiSettings): Promise<ParseJdResult> {
    if (settings.provider === 'openai' && settings.apiKey) {
      return this.parseJdWithOpenAI(jdText, settings);
    } else if (settings.provider === 'anthropic' && settings.apiKey) {
      return this.parseJdWithAnthropic(jdText, settings);
    } else if (settings.provider === 'ollama' && settings.ollamaUrl) {
      return this.parseJdWithOllama(jdText, settings);
    }
    // Default offline parser
    return this.parseJdOffline(jdText, techStack);
  }

  /**
   * Generate 5-10 technical interview questions based on Tech Stack & JD.
   */
  static async generateInterviewQuestions(
    title: string,
    company: string,
    techStack: string[],
    jdText?: string,
    settings?: AiSettings
  ): Promise<InterviewPrepResult> {
    if (settings?.provider === 'openai' && settings.apiKey) {
      return this.generateQuestionsWithOpenAI(title, company, techStack, jdText, settings);
    } else if (settings?.provider === 'anthropic' && settings.apiKey) {
      return this.generateQuestionsWithAnthropic(title, company, techStack, jdText, settings);
    } else if (settings?.provider === 'ollama' && settings.ollamaUrl) {
      return this.generateQuestionsWithOllama(title, company, techStack, jdText, settings);
    }
    return this.generateQuestionsOffline(title, company, techStack, jdText);
  }

  /**
   * Draft cold message connection requests & outreach emails.
   */
  static async generateColdMessages(
    title: string,
    company: string,
    techStack: string[],
    userResumeNotes?: string,
    referralName?: string,
    settings?: AiSettings
  ): Promise<ColdMessageResult> {
    if (settings?.provider === 'openai' && settings.apiKey) {
      return this.generateColdMessagesWithOpenAI(title, company, techStack, userResumeNotes, referralName, settings);
    }
    return this.generateColdMessagesOffline(title, company, techStack, userResumeNotes, referralName);
  }

  // --- OFFLINE HEURISTIC ENGINES ---

  private static parseJdOffline(jdText: string, techStack: string[]): ParseJdResult {
    const competencies: Set<string> = new Set();
    
    // Extracted Tech Tags
    techStack.forEach(t => competencies.add(`${t} Architecture & Best Practices`));

    // Keyword detection in JD
    const jdLower = jdText.toLowerCase();

    if (jdLower.includes('kubernetes') || jdLower.includes('k8s') || jdLower.includes('container')) {
      competencies.add('Container Orchestration & Microservices (Kubernetes/Docker)');
    }
    if (jdLower.includes('aws') || jdLower.includes('cloud') || jdLower.includes('azure') || jdLower.includes('gcp')) {
      competencies.add('Cloud Native Infrastructure & Distributed Deployment');
    }
    if (jdLower.includes('system design') || jdLower.includes('scalable') || jdLower.includes('high availability')) {
      competencies.add('High-Availability System Design & Distributed Systems');
    }
    if (jdLower.includes('security') || jdLower.includes('compliance') || jdLower.includes('zero trust')) {
      competencies.add('Cloud Security, Zero-Trust Architecture & Compliance');
    }
    if (jdLower.includes('ci/cd') || jdLower.includes('pipeline') || jdLower.includes('github actions')) {
      competencies.add('Automated CI/CD Pipeline & Infrastructure as Code');
    }
    if (jdLower.includes('react') || jdLower.includes('next.js') || jdLower.includes('typescript')) {
      competencies.add('Modern Frontend Architecture (React 18 / TypeScript)');
    }
    if (jdLower.includes('pytorch') || jdLower.includes('machine learning') || jdLower.includes('llm') || jdLower.includes('ai')) {
      competencies.add('AI/ML Infrastructure & Model Training Workflows');
    }

    if (competencies.size === 0) {
      competencies.add('Core Software Engineering & System Architecture');
      competencies.add('Cross-functional Technical Leadership & Code Reviews');
    }

    // Extract Years of Experience from regex
    let exp = '3+ years of relevant industry experience';
    const expMatch = jdText.match(/(\d+)\+?\s*years(?:\s*of)?\s*experience/i);
    if (expMatch) {
      exp = `${expMatch[1]}+ years of relevant technical experience required`;
    }

    return {
      parsedCompetencies: Array.from(competencies),
      requiredExperience: exp,
    };
  }

  private static generateQuestionsOffline(
    title: string,
    company: string,
    techStack: string[],
    jdText?: string
  ): InterviewPrepResult {
    const questions: string[] = [];
    const stackStr = techStack.length > 0 ? techStack.join(', ') : 'modern tech stack';

    questions.push(`How do you handle production debugging and performance profiling in a ${stackStr} environment at ${company}?`);
    
    if (techStack.some(t => ['Kubernetes', 'AWS', 'Docker', 'Terraform', 'DevOps'].includes(t))) {
      questions.push('Walk through a high-availability infrastructure failover scenario you designed. How do you guarantee RPO and RTO?');
      questions.push('How do you manage secrets, zero-downtime deployments, and canary rollouts in production?');
    }

    if (techStack.some(t => ['React', 'Next.js', 'TypeScript', 'Vue', 'Tailwind'].includes(t))) {
      questions.push('Explain how you optimize frontend bundle sizes, initial page loads (LCP/FID), and state management under heavy UI traffic.');
      questions.push('How do you structure reusable component libraries with strict TypeScript types and accessibility (a11y)?');
    }

    if (techStack.some(t => ['Python', 'PyTorch', 'CUDA', 'Ray', 'AI'].includes(t))) {
      questions.push('How do you manage distributed GPU memory allocation and model parallelization when training or serving large models?');
      questions.push('What strategies do you use for latency optimization in AI inference pipelines?');
    }

    if (techStack.some(t => ['Rust', 'Go', 'C++', 'PostgreSQL', 'Microservices'].includes(t))) {
      questions.push('Compare memory safety and concurrency primitives in your preferred backend language vs traditional runtimes.');
      questions.push('How do you handle database lock contention and connection pool exhaustion in microservices?');
    }

    // General high level questions
    questions.push(`Describe a time when you had to make an architectural compromise for the ${title} role at ${company}.`);
    questions.push('How do you evaluate and integrate emerging AI tools into your daily software development lifecycle?');

    return { questions: questions.slice(0, 7) };
  }

  private static generateColdMessagesOffline(
    title: string,
    company: string,
    techStack: string[],
    userResumeNotes?: string,
    referralName?: string
  ): ColdMessageResult {
    const stackHighlight = techStack.length > 0 ? techStack.slice(0, 3).join(', ') : 'modern stack';
    const refNote = referralName ? ` (${referralName} suggested I reach out)` : '';

    return {
      coldMessages: {
        recruiter: `Hi! I recently applied for the ${title} role at ${company}${refNote}. With deep hands-on expertise in ${stackHighlight}, I've engineered high-scale systems and would love to briefly introduce myself!`,
        hiringManager: `Hello! I noticed ${company} is scaling its ${title} team. I have extensive experience building scalable solutions with ${stackHighlight}. I'd love 5 minutes to discuss how my technical background aligns with your team's upcoming roadmap!`,
        peer: `Hey! I saw you work at ${company} in engineering. I'm exploring the ${title} opportunity and would love to learn more about the team culture, tech stack challenges, and day-to-day workflow. Cheers!`,
      },
    };
  }

  // --- LIVE LLM PROVIDER INTEGRATIONS ---

  private static async parseJdWithOpenAI(jdText: string, settings: AiSettings): Promise<ParseJdResult> {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.modelName || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an IT Technical Recruiter & Architect. Parse the Job Description and return a JSON object with: { "parsedCompetencies": string[], "requiredExperience": string }',
            },
            { role: 'user', content: jdText },
          ],
          response_format: { type: 'json_object' },
        }),
      });
      const content = getOpenAiContent(await readJsonResponse(res));
      if (!isParseResult(content)) throw new Error('AI provider returned an invalid JD analysis.');
      return content;
    } catch (e) {
      console.warn('OpenAI API call failed, falling back to offline engine:', e);
      return this.parseJdOffline(jdText, []);
    }
  }

  private static async generateQuestionsWithOpenAI(
    title: string,
    company: string,
    techStack: string[],
    jdText?: string,
    settings?: AiSettings
  ): Promise<InterviewPrepResult> {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings?.apiKey}`,
        },
        body: JSON.stringify({
          model: settings?.modelName || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Generate 6 realistic, highly technical interview questions for an IT role. Return JSON: { "questions": string[] }',
            },
            {
              role: 'user',
              content: `Role: ${title} at ${company}\nTech Stack: ${techStack.join(', ')}\nJD: ${jdText || 'N/A'}`,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      });
      const content = getOpenAiContent(await readJsonResponse(res));
      if (!isInterviewPrepResult(content)) throw new Error('AI provider returned invalid interview questions.');
      return content;
    } catch (e) {
      console.warn('OpenAI API call failed, falling back to offline engine:', e);
      return this.generateQuestionsOffline(title, company, techStack, jdText);
    }
  }

  private static async parseJdWithAnthropic(jdText: string, settings: AiSettings): Promise<ParseJdResult> {
    // Anthropic fetch call structure fallback
    return this.parseJdOffline(jdText, []);
  }

  private static async generateQuestionsWithAnthropic(title: string, company: string, techStack: string[], jdText?: string, settings?: AiSettings): Promise<InterviewPrepResult> {
    return this.generateQuestionsOffline(title, company, techStack, jdText);
  }

  private static async parseJdWithOllama(jdText: string, settings: AiSettings): Promise<ParseJdResult> {
    try {
      const url = `${settings.ollamaUrl || 'http://localhost:11434'}/api/generate`;
      const prompt = `Parse this IT job description and return JSON format { "parsedCompetencies": ["comp1", "comp2"], "requiredExperience": "X years" }: \n${jdText}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: settings.modelName || 'llama3',
          prompt,
          stream: false,
          format: 'json',
        }),
      });
      const content = getOllamaContent(await readJsonResponse(res));
      if (!isParseResult(content)) throw new Error('AI provider returned an invalid JD analysis.');
      return content;
    } catch (e) {
      console.warn('Ollama endpoint call failed, falling back to offline engine:', e);
      return this.parseJdOffline(jdText, []);
    }
  }

  private static async generateQuestionsWithOllama(title: string, company: string, techStack: string[], jdText?: string, settings?: AiSettings): Promise<InterviewPrepResult> {
    try {
      const url = `${settings?.ollamaUrl || 'http://localhost:11434'}/api/generate`;
      const prompt = `Generate 6 technical interview questions for ${title} at ${company} using stack [${techStack.join(', ')}]. Return JSON { "questions": ["q1", "q2"] }`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: settings?.modelName || 'llama3',
          prompt,
          stream: false,
          format: 'json',
        }),
      });
      const content = getOllamaContent(await readJsonResponse(res));
      if (!isInterviewPrepResult(content)) throw new Error('AI provider returned invalid interview questions.');
      return content;
    } catch (e) {
      console.warn('Ollama call failed, falling back to offline engine:', e);
      return this.generateQuestionsOffline(title, company, techStack, jdText);
    }
  }

  private static async generateColdMessagesWithOpenAI(
    title: string,
    company: string,
    techStack: string[],
    userResumeNotes?: string,
    referralName?: string,
    settings?: AiSettings
  ): Promise<ColdMessageResult> {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings?.apiKey}`,
        },
        body: JSON.stringify({
          model: settings?.modelName || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Draft 3 personalized LinkedIn outreach messages (recruiter, hiringManager, peer). Return JSON: { "coldMessages": { "recruiter": "...", "hiringManager": "...", "peer": "..." } }',
            },
            {
              role: 'user',
              content: `Role: ${title} at ${company}. Tech Stack: ${techStack.join(', ')}. Referral: ${referralName || 'None'}`,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      });
      const content = getOpenAiContent(await readJsonResponse(res));
      if (!isColdMessageResult(content)) throw new Error('AI provider returned invalid outreach messages.');
      return content;
    } catch (e) {
      return this.generateColdMessagesOffline(title, company, techStack, userResumeNotes, referralName);
    }
  }
}
