import { buildContext, queryGemini, getRecommendations } from '../services/geminiService.js';
import ChatConversation from '../models/ChatConversation.js';

// @desc    Handle AI chat query
// @route   POST /api/ai/chat
// @access  Private
export const handleChatQuery = async (req, res, next) => {
  try {
    const { query, sessionId } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    // Build context from database
    const context = await buildContext(req.user?.id);

    // Query Gemini AI
    const answer = await queryGemini(query, context);

    // Save conversation if sessionId provided
    if (sessionId) {
      let conversation = await ChatConversation.findOne({ sessionId });
      
      if (!conversation) {
        conversation = await ChatConversation.create({
          sessionId,
          user: req.user?.id,
          messages: []
        });
      }

      conversation.messages.push(
        { role: 'user', content: query },
        { role: 'assistant', content: answer }
      );
      
      await conversation.save();
    }

    res.status(200).json({
      success: true,
      data: {
        answer,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Start new chat session
// @route   POST /api/ai/start-session
// @access  Private
export const startChatSession = async (req, res, next) => {
  try {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const conversation = await ChatConversation.create({
      sessionId,
      user: req.user.id,
      messages: [{
        role: 'assistant',
        content: "Hi! I'm your dining assistant. I can help you find restaurants, check your bookings, or answer questions about menus and availability. What would you like to know?"
      }]
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: conversation.sessionId,
        welcomeMessage: conversation.messages[0].content
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat session history
// @route   GET /api/ai/session/:sessionId
// @access  Private
export const getChatSession = async (req, res, next) => {
  try {
    const conversation = await ChatConversation.findOne({ 
      sessionId: req.params.sessionId 
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if user owns this session
    if (conversation.user && conversation.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this session'
      });
    }

    res.status(200).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    End chat session
// @route   DELETE /api/ai/session/:sessionId
// @access  Private
export const endChatSession = async (req, res, next) => {
  try {
    const conversation = await ChatConversation.findOne({ 
      sessionId: req.params.sessionId 
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    conversation.isActive = false;
    await conversation.save();

    res.status(200).json({
      success: true,
      message: 'Session ended successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI recommendations
// @route   POST /api/ai/recommend
// @access  Public
export const getAIRecommendations = async (req, res, next) => {
  try {
    const { cuisine, priceRange, city, occasion } = req.body;

    const restaurants = await getRecommendations({
      cuisine,
      priceRange,
      city,
      occasion
    });

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};
