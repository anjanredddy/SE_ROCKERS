const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: err.errors
      });
    }
  
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({
        message: 'Invalid token'
      });
    }
  
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        message: 'Duplicate entry found'
      });
    }
  
    if (err.code === 'ER_NO_REFERENCED_ROW') {
      return res.status(400).json({
        message: 'Referenced record not found'
      });
    }
  
    return res.status(500).json({
      message: 'Internal server error'
    });
  };
  
  module.exports = errorHandler;
