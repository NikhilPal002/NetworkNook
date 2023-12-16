import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoute.js';
import { register } from './controllers/authController.js';
import {createPost } from './controllers/postController.js';
import { verifyToken } from "./middleware/authUser.js";

/* Manually injection of Data  */
// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts } from "./data/index.js";
/* end of section  */


// CONFIGURATONS

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// file Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });


/* ROUTES WITH FILES */
app.post("/api/auth/register", upload.single("picture"), register);
app.post("/api/post", verifyToken, upload.single("picture"), createPost);


/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);


// MONGOOSE SETUP 

const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Connected to MongoDB!');
    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch((error) => console.log(`${error} Did not connect`));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });