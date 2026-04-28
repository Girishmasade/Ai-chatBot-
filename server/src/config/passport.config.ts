import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as GithubStrategy,
  type Profile as GithubProfile,
} from "passport-github2";
import {
  Strategy as FacebookStrategy,
  type Profile as FacebookProfile,
} from "passport-facebook";

import {
  googleClientId,
  googleSecret,
  facebookClientId,
  facebookSecret,
  githubClientId,
  githubSecret,
  googleFallbackUrl,
  githubFallbackUrl,
  facebookFallbackUrl,
} from "../env/env.import.js";
import { AuthModel } from "@/moduels/auth/auth.models.js";

passport.serializeUser((user: any, done) => { // store user id in session
  done(null, user.id); // store ID
});

passport.deserializeUser(async(id, done) => { // retrive user from database
 try {
    const user = await AuthModel.findById(id);
    done(null, user as any);
 } catch (error) {
    done(error, null);
 }
});

// google

passport.use(
  new GoogleStrategy(
    {
    clientID: googleClientId,
    clientSecret: googleSecret,
    callbackURL: googleFallbackUrl,
  },
  async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: (error: any, user?: any) => void) => {
    try {
      const user = await AuthModel.findOne({ googleId: profile.id });
      if (user) {
        done(null, user);
      } else {
        const newUser = new AuthModel({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
        });
        await newUser.save();
        done(null, newUser);
      }
    } catch (error) {
      done(error, null);
    }
  }
));

// github

passport.use(
    new GithubStrategy({
        clientID: githubClientId,
        clientSecret: githubSecret,
        callbackURL: githubFallbackUrl,
    },
    async (accessToken: string, refreshToken: string, profile: GithubProfile, done: (error: any, user?: any) => void) => {
        try {
            const user = await AuthModel.findOne({ githubId: profile.id });
            if (user) {
                done(null, user);
            } else {
                const newUser = new AuthModel({
                    githubId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0].value,
                    avatar: profile.photos?.[0].value,
                })
                await newUser.save();
                done(null, newUser);
            }
        } catch (error) {
            done(error, null)
        }
    }
))

// facebook

passport.use(
  new FacebookStrategy(
    {
      clientID: facebookClientId,
      clientSecret: facebookSecret,
      callbackURL: facebookFallbackUrl,
      profileFields: ["id", "emails", "name", "picture.type(large)"],
    },
    async (_accessToken, _refreshToken, profile: FacebookProfile, done: (error: any, user?: any) => void) => {
      try {
        const user = await AuthModel.findOne({ facebookId: profile.id });
        if (user) {
          done(null, user);
        } else {
          const newUser = new AuthModel({
            facebookId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
            avatar: profile.photos?.[0].value,
          });
          await newUser.save();
          done(null, newUser);
        }
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  )
);

export default passport;