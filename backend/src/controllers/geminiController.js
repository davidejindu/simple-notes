import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export const generateNote = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "API key is not configured" });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const formattedPrompt = `Give me simple and precise notes in bullet point format with clear headings based on the following topic: ${prompt}`;


    const requestBody = {
      contents: [
        {
          parts: [{ text: formattedPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Response:", data);
      return res.status(response.status).json({
        message: data.error?.message || "Failed to generate content",
        details: data.error || data,
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ message: "No content generated", debug: data });
    }

    res.status(200).json({ content: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      message: "Failed to generate content",
      error: error.message,
    });
  }
};
