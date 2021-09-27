/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt');
const JWTStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcryptjs');
const { findUser } = require('../db');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    (email, password, done) => {
      // Search DB for user email
      findUser({ email })
        .then((user) => {
          if (!user) {
            return done(null, false);
          }
          // Match password with user's email
          bcrypt.compare(password, user.password, (error, isMatch) => {
            // PASSWORD NO LONGER NEEDED, DELETE IT SO IT CAN'T BE SENT
            delete user.password;

            if (error) throw error;
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false);
          });
        })
        .catch((err) => done(err));
    },
  ),
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (jwt_payload, done) => {
      try {
        done(null, jwt_payload);
      } catch (error) {
        done(null, false);
      }
    },
  ),
);
