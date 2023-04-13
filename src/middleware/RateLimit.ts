import { rateLimit } from 'express-rate-limit'

export const RequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again after 10 minutes',
})

export const PostRequestLimiter = rateLimit({
  windowMs: 1440 * 60 * 1000,
  max: 400,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again after 1 day',
})
