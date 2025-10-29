import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectSequelize } from './config/orm.js';

// Rutas principales
import personasRoutes from './routes/personas.routes.js';
import estudiantesRoutes from './routes/estudiantes.routes.js';
import LoginRoutes from './routes/login.routes.js';


// Middlewares
import { errorHandler } from './middleware/error.js';
import { notFound } from './middleware/notFound.js';

// Inicializar Express
const app = express();

// Configuración base
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan(process.env.REQUEST_LOG || 'dev'));

// Conectar base de datos
connectSequelize();

// Rutas
app.use('/api/v1/personas', personasRoutes);
app.use('/api/v1/estudiantes', estudiantesRoutes);
app.use('/api/v1/login', LoginRoutes);


// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Puerto
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () =>
  console.log(`✅ API Ingreso UNAH escuchando en puerto ${PORT}`)
);
