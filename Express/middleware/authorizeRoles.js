function authorizeRoles(roles = []) {
    if (typeof roles === 'string') {
      roles = [roles];
    }
  
    return (req, res, next) => {
      const user = req.user;
  
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access Denied: Insufficient permissions' });
      }
  
      next();
    };
  }
  
  module.exports = authorizeRoles;
  