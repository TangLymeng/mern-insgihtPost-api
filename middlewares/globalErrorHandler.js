const globalErrorHandler = (err, req, res, next) => {
    //status
    const status = err?.status ? err?.status: "failed";
    //message
    const message = err?.message;
    //stack
    const stack = err?.stack;
    res.status(500).json({
        status,
        message,
        stack,
    });
}

// not found handler
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

module.exports = { globalErrorHandler, notFound };