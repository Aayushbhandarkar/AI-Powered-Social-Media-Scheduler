// filename: controllers/chatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------- Generate Social Media Content ----------------
const generateContent = async (req, res) => {
  try {
    const { prompt, platform = "general", tone = "engaging", context = [] } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must be a non-empty string",
      });
    }

    // ✅ Use latest Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Build structured instruction for social media
    let fullPrompt = `
You are an expert Social Media Content Creator AI.
Your task is to generate highly engaging, platform-optimized posts.

Guidelines:
- Adapt tone for the platform: 
  * Instagram → trendy, creative captions, emojis, and hashtags.
  * Twitter (X) → concise, witty, trending hashtags.
  * LinkedIn → professional, insightful, value-driven.
  * Facebook → conversational, friendly, slightly longer text.
- Keep it ${tone} and audience-focused.
- Suggest 3–5 trending hashtags relevant to the topic.
- Include a short call-to-action when suitable.

Context:
`;

    if (Array.isArray(context) && context.length > 0) {
      context.forEach((msg) => {
        if (msg.role && msg.content) {
          const roleLabel = msg.role === "user" ? "User" : "Assistant";
          fullPrompt += `${roleLabel}: ${msg.content}\n`;
        }
      });
    }

    fullPrompt += `\nUser Request (Platform: ${platform}): ${prompt}\nAssistant:`;

    // ✅ Call Gemini API
    const result = await model.generateContent(fullPrompt);

    // Extract text safely
    const text = result?.response?.text?.() || "";

    res.json({
      success: true,
      data: {
        response: text,
        prompt,
        platform,
        tone,
      },
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate content",
    });
  }
};

module.exports = {
  generateContent,
};
