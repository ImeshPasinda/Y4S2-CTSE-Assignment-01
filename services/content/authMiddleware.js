const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized Access' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden' });

    req.user = user;
    next();
  });
};

const authorizeRoles = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
