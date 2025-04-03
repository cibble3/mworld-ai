import { Configuration, OpenAIApi } from 'openai';

// Configure OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Simple in-memory cache to reduce API calls
const translationCache = {};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { text, targetLang } = req.body;
  
  if (!text || !targetLang) {
    return res.status(400).json({ error: 'Text and targetLang are required' });
  }
  
  // Skip translation for English or very short strings
  if (targetLang === 'en' || text.length < 3) {
    return res.status(200).json({ translatedText: text });
  }
  
  // Check cache first
  const cacheKey = `${text}|${targetLang}`;
  if (translationCache[cacheKey]) {
    return res.status(200).json({ 
      translatedText: translationCache[cacheKey],
      cached: true
    });
  }
  
  try {
    // Use OpenAI to translate
    const response = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || "gpt-4",
      messages: [
        { 
          role: "system", 
          content: `You are a translator. Translate the text to ${targetLang}. Preserve HTML formatting if present.` 
        },
        { role: "user", content: text }
      ],
      temperature: 0.3,
    });
    
    const translatedText = response.data.choices[0].message.content.trim();
    
    // Cache the result
    translationCache[cacheKey] = translatedText;
    
    // Keep the cache size manageable - remove oldest entries if cache too large
    const MAX_CACHE_ENTRIES = 1000;
    if (Object.keys(translationCache).length > MAX_CACHE_ENTRIES) {
      const cacheKeys = Object.keys(translationCache);
      for (let i = 0; i < 100; i++) {
        delete translationCache[cacheKeys[i]];
      }
    }
    
    return res.status(200).json({ translatedText });
  } catch (error) {
    console.error('Translation error:', error);
    return res.status(500).json({ 
      error: 'Translation failed', 
      message: error.message 
    });
  }
} 