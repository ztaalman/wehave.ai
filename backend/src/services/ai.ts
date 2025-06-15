import OpenAI from 'openai';

/**
 * ---------------------------------------------------------------------------
 * Safe OpenAI client initialisation
 * ---------------------------------------------------------------------------
 * During local or Render mock-mode testing an API key may not be available.
 * We therefore:
 *   1.  Detect the presence of `OPENAI_API_KEY`
 *   2.  Only instantiate the SDK when a key is present
 *   3.  Fall back to mock responses when it is not
 */

const apiKey = process.env.OPENAI_API_KEY;
export const hasApiKey: boolean = !!apiKey && apiKey.trim() !== '';

let openai: OpenAI | null = null;

if (hasApiKey) {
  openai = new OpenAI({ apiKey: apiKey! });
} else {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  OPENAI_API_KEY is not set – AI endpoints will return mock responses'
  );
}

interface ProfileData {
  name: string;
  skills: string[];
  experience: string;
  education: string;
  interests: string[];
}

export class AIService {
  async generateProfile(data: ProfileData): Promise<string> {
    // Mock response when API key is missing
    if (!hasApiKey || !openai) {
      return `[Mock Profile]\n${data.name} is a skilled professional with experience in ${data.skills.join(
        ', '
      )}.`;
    }

    const prompt = `Create a professional profile for ${data.name} with the following information:
    Skills: ${data.skills.join(', ')}
    Experience: ${data.experience}
    Education: ${data.education}
    Interests: ${data.interests.join(', ')}

    Please write a compelling professional profile that highlights their strengths and experience.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content || '';
  }

  async generateChatbotResponse(userId: number, question: string, context: any): Promise<string> {
    if (!hasApiKey || !openai) {
      return `[Mock Chatbot Response] This is a placeholder answer to: "${question}"`;
    }

    const prompt = `You are an AI assistant representing a professional. 
    Context about the person: ${JSON.stringify(context)}
    
    Question: ${question}
    
    Please provide a helpful and professional response.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0].message.content || '';
  }

  async generateBusinessCard(data: any): Promise<string> {
    if (!hasApiKey || !openai) {
      return `[Mock Business Card]\n${data.name} • ${data.title} @ ${data.company}\nContact: ${data.contact}`;
    }

    const prompt = `Create a professional business card design description for:
    Name: ${data.name}
    Title: ${data.title}
    Company: ${data.company}
    Contact: ${data.contact}
    
    Please provide a modern and professional design suggestion.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0].message.content || '';
  }
}

export default new AIService(); 