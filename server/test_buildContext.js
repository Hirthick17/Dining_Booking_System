import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { buildContext } from './src/services/geminiService.js';

dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected DB");
  
  // Call buildContext with no user ID just for a quick test
  const context = await buildContext();
  console.log("Context output:", context.substring(0, 500)); // Print first 500 chars
  
  await mongoose.disconnect();
}
test();
