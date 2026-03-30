export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  
  // Always log full details to Render logs
  console.error('═══════════════════════════');
  console.error(`[${new Date().toISOString()}] ERROR`);
  console.error(`Route: ${req.method} ${req.originalUrl}`);
  console.error(`Message: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error('═══════════════════════════');
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack 
    })
  });
};
