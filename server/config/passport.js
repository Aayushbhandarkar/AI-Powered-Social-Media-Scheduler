const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const TwitterStrategy = require('passport-twitter').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const User = require('../models/User');

// ---------------- JWT Strategy ----------------
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.id);
      if (user) return done(null, user);
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// ---------------- Twitter Strategy ----------------
if (process.env.TWITTER_CLIENT_ID && process.env.TWITTER_CLIENT_SECRET) {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CLIENT_ID,
        consumerSecret: process.env.TWITTER_CLIENT_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL,
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        try {
          let user = await User.findOne({
            $or: [{ twitterId: profile.id }, { email: profile.emails?.[0]?.value }],
          });

          if (user) {
            user.twitterId = profile.id;
            user.twitter = { token, tokenSecret, profile: profile._json };
            await user.save();
            return done(null, user);
          }

          user = await User.create({
            twitterId: profile.id,
            username: profile.username || profile.displayName.replace(/\s+/g, '').toLowerCase(),
            displayName: profile.displayName,
            email: profile.emails?.[0]?.value,
            twitter: { token, tokenSecret, profile: profile._json },
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// ---------------- LinkedIn Strategy ----------------
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_CALLBACK_URL,
        scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
        state: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // LinkedIn email might be in different location
          const email = profile.emails?.[0]?.value || 
                       (profile._json && profile._json.emailAddress);

          let user = await User.findOne({
            $or: [{ linkedinId: profile.id }, { email: email }],
          });

          if (user) {
            user.linkedinId = profile.id;
            user.linkedin = { 
              token: accessToken, 
              refreshToken, 
              profile: profile._json 
            };
            await user.save();
            return done(null, user);
          }

          // Create username from display name if not available
          const username = profile.displayName 
            ? profile.displayName.replace(/\s+/g, '').toLowerCase() 
            : `user_${Date.now()}`;

          user = await User.create({
            linkedinId: profile.id,
            username: username,
            displayName: profile.displayName || 'LinkedIn User',
            email: email,
            linkedin: { 
              token: accessToken, 
              refreshToken, 
              profile: profile._json 
            },
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// ---------------- Instagram Strategy ----------------
if (process.env.INSTAGRAM_CLIENT_ID && process.env.INSTAGRAM_CLIENT_SECRET) {
  passport.use(
    new InstagramStrategy(
      {
        clientID: process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
        callbackURL: process.env.INSTAGRAM_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ instagramId: profile.id });

          if (user) {
            user.instagram = { 
              token: accessToken, 
              refreshToken, 
              profile: profile._json 
            };
            await user.save();
            return done(null, user);
          }

          const username = profile.username || 
                          (profile.displayName ? profile.displayName.replace(/\s+/g, '').toLowerCase() : 
                          `instagram_${profile.id}`);

          user = await User.create({
            instagramId: profile.id,
            username: username,
            displayName: profile.displayName || profile.username || 'Instagram User',
            instagram: { 
              token: accessToken, 
              refreshToken, 
              profile: profile._json 
            },
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// ---------------- Session handling ----------------
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;