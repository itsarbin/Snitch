import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import Config from './config/config.js';
import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import cookieParser from 'cookie-parser';



import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';

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
    clientID: Config.GOOGLE_CLIENT_ID,
    clientSecret: Config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done)=>{
    //here we will find or create user in database and then call done with user data
    return done(null, profile)
}))




app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);


export default app;
