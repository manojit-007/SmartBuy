// Middleware to catch and handle async errors
module.exports = (anyFunction) => (req, res, next) => {

  Promise.resolve(anyFunction(req, res, next)).catch(next);
};


  // The purpose of this middleware is to handle any errors occurring in asynchronous functions.
  // It wraps the given function (anyFunction) with a promise and automatically catches any error that occurs.

  // console.log("CatchAsync Error working fine.");
  // Debugging line to check if middleware is being executed

  // Example: If a user requests product details from the server and the server doesn't return any data,
  // this middleware will catch the error, preventing the server from crashing and passing the error to the next middleware (error handler).

  // The Promise.resolve() method ensures that any asynchronous errors within the 'anyFunction'
  // are caught and passed down to the 'next()' error handler.


  

// Explanation of Comments:

// Purpose: This middleware is designed to handle errors in asynchronous route handlers. By wrapping the function in a promise, any errors (including those from async functions) are caught and passed to the next error handler.

// Real-world example: The comment explains how this middleware would work in practice, such as when a user requests product details and no product is returned, an error will be caught here and passed to the next middleware to handle it (in my case I use ErrorHandler function ).

// Promise.resolve(): It ensures that if anyFunction (which is an async function) returns a rejected promise, it will be caught and handled by catch(next).
