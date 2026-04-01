const passport = require('passport');

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'You are not authorized' });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = auth;
