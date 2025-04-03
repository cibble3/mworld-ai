const OpenAI = require("openai");
const path = require('path');
// Use absolute path based on process.cwd() which should be the project root
const config = require(path.join(process.cwd(), 'src/config'));

// Ensure the API key is available from the config
if (!config.openai?.apiKey) {
  throw new Error('OPENAI_API_KEY is missing in the configuration. Check config.js and .env');
}

// Initialize the OpenAI API client with the API key from the central configuration
const openai = new OpenAI({
  apiKey: config.openai.apiKey // Use key from config
});

/**
 * Generate content using OpenAI
 * @param {string} prompt - The prompt to generate content from
 * @param {Object} options - Additional options for the API call
 * @returns {Object} - The generated content in JSON format
 */
async function generateAIContent(prompt, options = {}) {
  const defaultOptions = {
    model: "gpt-4",
    temperature: 0.7,
    max_tokens: 1500,
  };

  const requestOptions = { ...defaultOptions, ...options };
  
  try {
    console.log(`🧠 Generating AI content with ${requestOptions.model}...`);
    
    const completion = await openai.chat.completions.create({
      model: requestOptions.model,
      messages: [{ role: "user", content: prompt }],
      temperature: requestOptions.temperature,
      max_tokens: requestOptions.max_tokens,
    });

    const content = completion.choices[0].message.content;

    try {
      return JSON.parse(content);
    } catch (err) {
      console.error("❌ AI response was not valid JSON.");
      console.error("📝 Raw response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }
  } catch (error) {
    if (error.response) {
      console.error(`OpenAI API error: ${error.response.status} - ${error.response.data.error.message}`);
    } else {
      console.error(`OpenAI API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Generate content with vision capabilities (for image analysis)
 * @param {string} prompt - The prompt to analyze the image with
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {string} - The generated content
 */
async function generateVisionContent(prompt, imageUrl) {
  try {
    console.log(`🔍 Analyzing image with Vision API...`);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1000,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      console.error(`Vision API error: ${error.response.status} - ${error.response.data.error.message}`);
    } else {
      console.error(`Vision API error: ${error.message}`);
    }
    throw error;
  }
}

module.exports = {
  generateAIContent,
  generateVisionContent
}; 