// Middleware-ka loogu talagalay in lagu qabto khaladaadka (Error Handling)
const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    // Log garee khalaadka si loo arko (Console)
    console.log(err.stack);

    // Khalaadka Mongoose-ka (Bad Object ID)
    if (err.name === 'CastError') {
        const message = `Xogta la raadiyay laguma helin ID-gan: ${err.value}`;
        error = { message, statusCode: 404 };
    }

    // Khalaadka Mongoose-ka (Duplicate Key)
    if (err.code === 11000) {
        const message = 'Xogta aad galisay mar hore ayay diwaangashnayd (Email duplicate)';
        error = { message, statusCode: 400 };
    }

    // Khalaadka Mongoose-ka (Validation Error)
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = { message, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Khalad ayaa ka dhacay server-ka (Server Error)'
    });
};

module.exports = errorHandler;
