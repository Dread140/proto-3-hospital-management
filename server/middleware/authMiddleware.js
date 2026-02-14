import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Missing authentication token' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid authentication token' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  return next();
};
