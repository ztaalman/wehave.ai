import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ProfileData {
  name: string;
  skills: string[];
  experience: string;
  education: string;
  interests: string[];
}

export class AIService {
  async generateProfile(data: ProfileData): Promise<string> {
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