import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { prompt, isCoalMode } = await request.json();

    // Create system message based on mode
    const systemMessage = isCoalMode
      ? "You are a sarcastic gift advisor with a witty, roast-like sense of humor. Give a funny, slightly mean (but not cruel) gift suggestion with a snarky explanation. Use emojis. Keep responses short and punchy. Make it funny enough to share on social media."
      : "You are a helpful gift advisor. Suggest thoughtful, personalized gifts with a brief explanation. Use emojis. Keep responses short and sweet.";

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: `Suggest a gift for: ${prompt}` }
      ],
      temperature: isCoalMode ? 1 : 0.7,
      max_tokens: 150,
    });

    return Response.json({ 
      suggestion: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json(
      { error: 'Ho ho NO! Something went wrong!' }, 
      { status: 500 }
    );
  }
}