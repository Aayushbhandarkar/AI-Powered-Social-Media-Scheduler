const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI only if API key exists
let genAI;
try {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is missing in environment variables');
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI initialized successfully');
  }
} catch (error) {
  console.error('❌ Failed to initialize Gemini AI:', error);
}

const generateContent = async (req, res) => {
  console.log('📨 Received chatbot request from user:', req.user?.id);
  
  try {
    const { prompt, platform = "general", tone = "engaging", context = [] } = req.body;

    // Validate input
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must be a non-empty string",
      });
    }

    // Check if Gemini AI is properly initialized
    if (!genAI) {
      console.error('❌ Gemini AI not initialized - API key missing or invalid');
      return res.status(500).json({
        success: false,
        error: "AI service is not configured properly",
      });
    }

    // Validate API key format (should start with AIza)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !apiKey.startsWith('AIza')) {
      console.error('❌ Invalid GEMINI_API_KEY format');
      return res.status(500).json({
        success: false,
        error: "AI service configuration error",
      });
    }

    console.log('🤖 Using Gemini model: gemini-1.5-flash');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Simplified prompt for testing
    const fullPrompt = `
Create a social media post for ${platform} with a ${tone} tone.

User request: ${prompt}

Please provide a engaging social media post with relevant hashtags.

Response:
`;

    console.log('📤 Sending request to Gemini API...');
    
    // Add timeout and better error handling for Gemini API
    const result = await Promise.race([
      model.generateContent(fullPrompt),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Gemini API timeout after 25s')), 25000)
      )
    ]);

    if (!result || !result.response) {
      throw new Error('No response from Gemini API');
    }

    const text = result.response.text() || "I couldn't generate a response. Please try again.";
    
    console.log('✅ Successfully generated content, length:', text.length);

    res.json({
      success: true,
      data: {
        response: text,
        prompt: prompt,
        platform: platform,
        tone: tone,
      },
    });

  } catch (error) {
    console.error("❌ AI Generation Error:", error.message);
    console.error("❌ Error stack:", error.stack);

    // Specific error handling
    if (error.message.includes('API_KEY') || error.message.includes('key') || error.message.includes('keyInvalid')) {
      return res.status(500).json({
        success: false,
        error: "Invalid AI API key. Please check your Gemini API configuration.",
      });
    }
    
    if (error.message.includes('quota') || error.message.includes('limit exceeded')) {
      return res.status(500).json({
        success: false,
        error: "AI service quota exceeded. Please try again later.",
      });
    }
    
    if (error.message.includes('timeout')) {
      return res.status(500).json({
        success: false,
        error: "AI service timeout. Please try again.",
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: "AI service temporarily unavailable. Please try again in a moment.",
    });
  }
};

// Add a health check function
const healthCheck = async (req, res) => {
  try {
    if (!genAI) {
      return res.json({ 
        status: 'unhealthy', 
        gemini: 'not_configured',
        error: 'GEMINI_API_KEY not set' 
      });
    }

    // Test Gemini API with a simple request
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Say 'OK'");
    const text = result.response.text();
    
    res.json({ 
      status: 'healthy', 
      gemini: 'working',
      response: text 
    });
  } catch (error) {
    res.json({ 
      status: 'unhealthy', 
      gemini: 'error',
      error: error.message 
    });
  }
};

module.exports = {
  generateContent,
  healthCheck
};
