import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import accommodationRoutes from './routes/accommodation.routes.js';
import categoryRoutes from './routes/category.routes.js';
import hostRoutes from './routes/host.routes.js';
import imageRoutes from './routes/image.routes.js';
import locationRoutes from './routes/location.routes.js';
import profileRoutes from './routes/profile.routes.js';
import roleRoutes from './routes/role.routes.js';
import userRoutes from './routes/user.routes.js';
import variantRoutes from './routes/variant.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { authenticate } from './middlewares/authenticate.middleware.js';
import { authorizeRoles } from './middlewares/authorize.middleware.js';
import { serveSwagger, setupSwagger } from './config/swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const adminAccess = [authenticate, authorizeRoles('admin')];

connectDB();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api-docs', serveSwagger, setupSwagger);

app.use('/api/auth', authRoutes);
app.use('/api/accommodations', ...adminAccess, accommodationRoutes);
app.use('/api/categories', ...adminAccess, categoryRoutes);
app.use('/api/hosts', ...adminAccess, hostRoutes);
app.use('/api/images', ...adminAccess, imageRoutes);
app.use('/api/locations', ...adminAccess, locationRoutes);
app.use('/api/profiles', ...adminAccess, profileRoutes);
app.use('/api/roles', ...adminAccess, roleRoutes);
app.use('/api/users', ...adminAccess, userRoutes);
app.use('/api/variants', ...adminAccess, variantRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});
