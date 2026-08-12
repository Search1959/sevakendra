import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with 25MB limit for Base64 image payload from camera
  app.use(express.json({ limit: "25mb" }));

  // Initialize Gemini Client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Seva Desk Backend" });
  });

  // OCR Document Scan & Regional Translation Route
  app.post("/api/ocr-scan", async (req, res) => {
    try {
      const { imageBase64, mimeType } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: "Missing imageBase64 data in request body" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY environment variable is not configured on the server." 
        });
      }

      const prompt = `
You are an expert government document OCR and multilingual translation AI for Indian Seva Kendras (handling Bengali, Hindi, Urdu, Tamil, Oriya, Gujarati, Marathi, and English paper forms).

Analyze the provided paper form / document image.
1. Perform high-accuracy Optical Character Recognition (OCR) on all printed or handwritten fields.
2. Translate all non-English names, addresses, occupations, castes, and details (Hindi/Bangla/Urdu/etc.) into clean English.
3. Standardize and return ONLY a valid JSON object matching the following structure:

{
  "fullName": "Name translated to English",
  "fatherName": "Father/Spouse Name translated to English",
  "mobile": "10-digit phone number if present",
  "gender": "Female" or "Male" or "Other",
  "dob": "YYYY-MM-DD or DD/MM/YYYY if present",
  "address": "Full residential address translated into English",
  "district": "District name in English",
  "pin": "6-digit PIN code",
  "occupation": "Homemaker | Farmer | Daily Wage / Worker | Small Business / Self-Employed | Student | Unemployed | Govt / Private Employee",
  "annualIncome": 80000,
  "category": "SC" | "ST" | "OBC-A" | "OBC-B" | "General",
  "religion": "Hinduism" | "Islam" | "Christianity" | "Sikhism" | "Buddhism" | "Jainism" | "Other",
  "rationCardType": "SPHH" | "PHH" | "AAY (Antyodaya)" | "RKSY-I" | "RKSY-II" | "None",
  "rationCardNo": "Ration card number",
  "maritalStatus": "Married" | "Single" | "Widowed" | "Divorced / Separated",
  "isDivyangjan": false,
  "aadhaarLast4": "4 digits if present",
  "bankName": "Bank Name if present",
  "bankIfsc": "IFSC Code if present",
  "notes": "Short English summary of document type, e.g. Lakshmir Bhandar Form, Caste Certificate application, Ration card, etc."
}

Return ONLY raw JSON. No markdown blocks, no commentary.
`;

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || "image/jpeg",
                data: cleanBase64
              }
            },
            {
              text: prompt
            }
          ]
        },
        config: {
          responseMimeType: "application/json"
        }
      });

      const rawText = response.text || "{}";
      const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanedText);

      return res.json({ success: true, data: parsedData });
    } catch (err: any) {
      console.error("OCR Scan Error:", err);
      return res.status(500).json({ 
        error: err.message || "Failed to process and translate form document" 
      });
    }
  });

  // Vite Middleware in Development vs Static Serving in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Seva Desk Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
