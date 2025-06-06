import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';


import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.router.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();
const isProduction = process.env.NODE_ENV === 'production';

// CORS Configuration
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL
}));

// Middleware
app.use(express.json());
app.use(cookieParser());
//app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": ["'self'", "https://js.stripe.com"],
          "frame-src": ["'self'", "https://js.stripe.com"],
          "connect-src": ["'self'", "https://api.stripe.com"],
          "img-src": ["'self'", "data:", "https://res.cloudinary.com"],
        },
      },
    crossOriginResourcePolicy: isProduction ? { policy: "same-origin" } : false
}));

// Routes


app.use('/api/user', userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use('/api/order', orderRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    })
}



// Database Connection and Server Start
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on PORT ${PORT} in ${isProduction ? 'production' : 'development'} mode.`);
    });
}).catch(err => {
    console.error("Database connection failed:", err);
});


