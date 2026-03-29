import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import Restaurant from './src/models/Restaurant.js';

async function checkRestaurants() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const all = await Restaurant.find({});
    console.log(`\nTotal restaurants in database: ${all.length}`);

    const active = await Restaurant.find({ isActive: true });
    console.log(`Active restaurants: ${active.length}`);

    console.log('\n--- All Restaurants ---');
    all.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name} | isActive: ${r.isActive} | slug: ${r.slug}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

checkRestaurants();
