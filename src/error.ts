import type { ErrorRequestHandler } from "express";

const errorMiddleWare: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }
  res.status(500).json({
    message: err.message,
  });
};

export default errorMiddleWare;
