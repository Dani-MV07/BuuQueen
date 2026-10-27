import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import accommodationRoutes from './routes/accommodation.routes.js';
import categoryRoutes from './routes/category.routes.js';
import hostRoutes from './routes/host.routes.js';
import imageRoutes from './routes/image.routes.js';
import locationRoutes from './routes/location.routes.js';
import roleRoutes from './routes/role.routes.js';
import userRoutes from './routes/user.routes.js';
import variantRoutes from './routes/variant.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { serveSwagger, setupSwagger } from './config/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api-docs', serveSwagger, setupSwagger);

app.use('/api/accommodations', accommodationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/hosts', hostRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/variants', variantRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
