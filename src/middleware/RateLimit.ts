import { rateLimit } from 'express-rate-limit'

const RequestLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again after 10 minutes',
})

export default RequestLimiter
