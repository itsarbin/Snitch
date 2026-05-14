import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import passport from 'passport';

// Import routes
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';

const app = express();
// app.use(cors({
//   origin: ['http://localhost:5173', 'http://localhost:5174'],
//   credentials: true,
// }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
},(accessToken, refreshToken, profile, done) => {
     return done(null,profile)
}))


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);

export default app;
