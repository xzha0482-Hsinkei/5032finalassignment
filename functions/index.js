// functions/index.js
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import sendgrid from "@sendgrid/mail";
import fetch from "node-fetch";
import cors from "cors";

// === ✅ 1. 定义 Secrets ===
const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");
const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY"); // ✅ 使用 Gemini API Key

// === ✅ 2. 邮件函数 ===
export const sendMail1 = onRequest(
  {
    cors: true,
    region: "us-central1",
    secrets: [SENDGRID_API_KEY],
  },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).send("");

    const { name, email, role, availability } = req.body || {};
    if (!email) return res.status(400).json({ success: false, error: "Missing email" });

    try {
      sendgrid.setApiKey(SENDGRID_API_KEY.value());
      const msg = {
        to: "keeling.zhangxinke@gmail.com",
        from: "keeling.zhangxinke@gmail.com",
        subject: `New Volunteer Submission: ${name || "Anonymous"}`,
        html: `
          <h3>New Volunteer Application</h3>
          <p><strong>Name:</strong> ${name || "N/A"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Role:</strong> ${role || "N/A"}</p>
          <p><strong>Availability:</strong> ${availability || "N/A"}</p>
        `,
      };
      await sendgrid.send(msg);
      console.log("✅ Email sent successfully!");
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("❌ SendGrid error:", err.response?.body || err.message);
      return res.status(401).json({ success: false, error: err.message });
    }
  }
);

// === ✅ 3. 地图路由代理 ===
export { orsProxy } from "./orsProxy.js";

// === ✅ 4. Gemini API 调用版 AI Suggest（最终修正版） ===
const corsHandler = cors({ origin: true });

export const aiSuggest = onRequest(
  {
    cors: true,
    region: "us-central1",
    secrets: [GEMINI_API_KEY],
  },
  async (req, res) => {
    corsHandler(req, res, async () => {
      if (req.method === "OPTIONS") return res.status(204).send("");

      const { prompt } = req.body || {};
      if (!prompt) return res.status(400).json({ success: false, error: "Missing prompt" });

      try {
        console.log("🧠 Sending request to Gemini:", prompt);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY.value()}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 256,
                topP: 0.8,
                topK: 40,
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_NONE",
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_NONE",
                },
              ],
            }),
          }
        );

        const data = await response.json();
        console.log("✅ Gemini raw response:", JSON.stringify(data, null, 2));

        const reply =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          data?.promptFeedback?.blockReason ||
          "⚠️ No valid response from Gemini (empty candidates).";

        res.status(200).json({ success: true, result: reply });
      } catch (err) {
        console.error("❌ Gemini Error:", err);
        res.status(500).json({ success: false, error: err.message });
      }
    });
  }
);
