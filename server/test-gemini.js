import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash',
    'gemini-2.5-pro',
    'gemini-pro'
  ];

  console.log("Using key:", process.env.GEMINI_API_KEY ? "Set" : "Not Set");
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  for (const modelName of modelsToTest) {
    try {
      console.log(`\nTesting model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say Hello');
      const response = await result.response;
      console.log(`✅ Success with ${modelName}:`, response.text().trim());
      // Stop and select this one if it succeeded
      break;
    } catch (err) {
      console.error(`❌ Failed with ${modelName}:`, err.message);
    }
  }
}
test();
