import { GoogleGenerativeAI } from "@google/generative-ai";
import { api_key } from "../config/config";
import { getSystemPrompt } from "../prompt";

const genAI = new GoogleGenerativeAI(api_key);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
    systemInstruction: getSystemPrompt(),
});

const generationConfig = {
    temperature: 0.8,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 5000,
    responseMimeType: "application/json",
};
export const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
});