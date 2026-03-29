import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
    const result = await model.generateContent('Say Hello');
    const response = await result.response;
    console.log("Response:", response.text());
  } catch (err) {
    console.error('Error Details:', err);
  }
}
test();
