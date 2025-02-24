'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import postRoutes from '../src/posts/post.routes.js';
import commentRoutes from '../src/comments/comment.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use('/opinionManager/v1/auth', authRoutes);
    app.use('/opinionManager/v1/users', userRoutes);
    app.use('/opinionManager/v1/posts', postRoutes);
    app.use('/opinionManager/v1/comments', commentRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Conexión exitosa con la base de datos.');
    } catch (error) {
        console.log('Error al conectar con la base de datos.', error);
    }
}

export const initServer = () => {
    const app = express();
    const port = process.env.PORT || 3005;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (err) {
        console.log(`Server init failed ${err}`);
    }
}