import express from "express";
import session from "express-session";
import passport from "./utils/config/passport";
import morgan from 'morgan';
import authRoutes from './routes/auth/authRoutes';
import fileRoutes from './routes/file/fileRoutes';
import folderRoutes from './routes/folder/folderRouter';
import historyRoutes from './routes/history/fileHistoryRoute'
import streamingRoutes from './routes/streaming/streamingRoutes'
import dotenv from 'dotenv';
import { connectRedis } from "./utils/config/redis";

dotenv.config();

const app = express();
connectRedis();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(session({secret:process.env.SESSION_SECRET!,resave:false,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session())

const API_VERSION = process.env.API_VERSION || 'v1'
const API_PREFIX = process.env.API_PREFIX || '/api'

app.use(`${API_PREFIX}/${API_VERSION}/auth`, authRoutes)
app.use(`${API_PREFIX}/${API_VERSION}/files`, fileRoutes)
app.use(`${API_PREFIX}/${API_VERSION}/folder`, folderRoutes)
app.use(`${API_PREFIX}/${API_VERSION}/history`, historyRoutes)
app.use(`${API_PREFIX}/${API_VERSION}/streaming`, streamingRoutes)

export default app;