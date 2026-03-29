import { GoogleGenerativeAI } from '@google/generative-ai';
import Restaurant from '../models/Restaurant.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

let genAI;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

/**
 * Build context from database for Gemini AI
 */
export const buildContext = async (userId) => {
  try {
    // Fetch restaurants
    const restaurants = await Restaurant.find({ isActive: true })
      .select('name cuisineTypes priceRange location rating seatingCapacity operatingHours menu')
      .limit(30)
      .sort({ 'rating.average': -1 });

    // Fetch user's bookings if userId provided
    let userBookings = [];
    if (userId) {
      userBookings = await Booking.find({ user: userId })
        .populate('restaurant', 'name location')
        .sort({ createdAt: -1 })
        .limit(10);
    }

    // Format restaurant data
    const restaurantContext = restaurants.map(r => {
      const menuSummary = (r.menu || []).map(cat => 
        `${cat.category}: ${(cat.items || []).slice(0, 3).map(item => 
          `${item.name} (₹${item.price})`
        ).join(', ')}`
      ).join(' | ');

      return `
📍 ${r.name}
   Cuisine: ${(r.cuisineTypes || []).join(', ')}
   Price: ${'$'.repeat(r.priceRange)}
   Location: ${r.location.city}, ${r.location.address}
   Rating: ${r.rating.average}⭐ (${r.rating.count} reviews)
   Capacity: ${r.seatingCapacity} seats
   Menu Highlights: ${menuSummary || 'N/A'}
   Hours: ${r.operatingHours.monday?.open || 'N/A'} - ${r.operatingHours.monday?.close || 'N/A'}
`;
    }).join('\n');

    // Format user bookings
    const bookingsContext = userBookings.length > 0 ? `
User's Recent Bookings:
${userBookings.map(b => `
- ${b.restaurant.name} on ${new Date(b.bookingDate).toDateString()} at ${b.bookingTime}
  Party size: ${b.partySize} | Status: ${b.status}
  Booking ID: ${b.bookingId}
`).join('')}
` : '';

    const fullContext = `
You are an AI dining assistant for a restaurant booking platform. Help users discover restaurants, make bookings, and answer questions about dining options.

AVAILABLE RESTAURANTS:
${restaurantContext}

${bookingsContext}

Current Date: ${new Date().toDateString()}

Guidelines:
- Be friendly, helpful, and concise
- Recommend restaurants based on user preferences
- Provide accurate information from the data above
- If asked about bookings, refer to the user's booking history
- If asked about availability, mention that users can check specific dates
- Format responses with emojis for better readability
- Keep responses under 200 words
`;

    return fullContext;
  } catch (error) {
    console.error('Error building context:', error);
    return 'Error loading restaurant data. Please try again.';
  }
};

/**
 * Query Gemini AI with context
 */
export const queryGemini = async (userQuery, context) => {
  try {
    const model = getGenAI().getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 512,
      }
    });

    const prompt = `${context}\n\nUser Question: ${userQuery}\n\nProvide a helpful, concise answer:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    return answer;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
};

/**
 * Get restaurant recommendations based on query
 */
export const getRecommendations = async (preferences) => {
  try {
    const { cuisine, priceRange, city, occasion } = preferences;
    
    let query = { isActive: true };
    
    if (cuisine) query.cuisineTypes = { $in: cuisine.split(',') };
    if (priceRange) query.priceRange = { $lte: Number(priceRange) };
    if (city) query['location.city'] = new RegExp(city, 'i');
    
    const restaurants = await Restaurant.find(query)
      .select('name cuisineTypes priceRange location rating images')
      .sort({ 'rating.average': -1 })
      .limit(5);

    return restaurants;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return [];
  }
};
