import OpenAI from "openai";

interface AIConfig {
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
}

// Get AI configuration from localStorage
const getAIConfig = (): AIConfig => {
  const saved = localStorage.getItem('ai_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse AI config');
    }
  }
  // Default configuration
  return {
    apiEndpoint: 'https://ark.cn-beijing.volces.com/api/v3',
    apiKey: '',
    modelName: 'deepseek-v3-250324',
  };
};

export const getFocusInsights = async (history: any[]) => {
  try {
    const config = getAIConfig();

    if (!config.apiKey) {
      return "Please configure your API key in Settings to get AI insights.";
    }

    // Initialize client with user configuration
    const client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.apiEndpoint,
      dangerouslyAllowBrowser: true, // Enable browser usage for Tauri
    });

    const completion = await client.chat.completions.create({
      model: config.modelName,
      messages: [
        {
          role: "system",
          content: "You are a productivity expert. Keep it minimalist and encouraging.",
        },
        {
          role: "user",
          content: `Based on this work history: ${JSON.stringify(history)}. Provide a short, 2-sentence advice for improving productivity.`,
        },
      ],
      // Enable application layer encryption for inference sessions
      extra_headers: { 'x-is-encrypted': 'true' } as any,
    });
    return completion.choices[0]?.message?.content || "Keep up the momentum! Your focus blocks are becoming more consistent.";
  } catch (error) {
    console.error("Ark API Error:", error);
    return "Keep up the momentum! Your focus blocks are becoming more consistent.";
  }
};
