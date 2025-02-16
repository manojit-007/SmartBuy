class ErrorHandler extends Error{
    constructor(message,statusCode){
        // console.log("ErrorHandler class working fine.");
        super(message);
        this.statusCode = statusCode

        Error.captureStackTrace(this,this.constructor); 
    }
}

module.exports = ErrorHandler;