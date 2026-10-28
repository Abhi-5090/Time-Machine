import { v4 as uuidv4 } from 'uuid';

export function requestId(req, res, next) {
  const incomingId = req.headers['x-request-id'];
  const reqId = typeof incomingId === 'string' && incomingId.length <= 64 ? incomingId : uuidv4();
  req.id = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
}
