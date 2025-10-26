import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import health from './routes/health.routes.js';
import personas from './routes/personas.routes.js';
import visitas from './routes/visitas.routes.js';
import vehiculos from './routes/vehiculos.routes.js';
import ingresos from './routes/ingresos.routes.js';
import { errorHandler } from './middleware/error.js';
import { notFound } from './middleware/notFound.js';
import vehiculosAdmin from './routes/vehiculos.admin.routes.js';
import visitasAdmin from './routes/visitas.admin.routes.js';
import infra from './routes/infra.routes.js';
import biometria from './routes/biometria.routes.js';


const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan(process.env.REQUEST_LOG || 'dev'));

app.use('/health', health);
app.use('/api/v1/personas', personas);
app.use('/api/v1/visitas', visitas);
app.use('/api/v1/vehiculos', vehiculos);
app.use('/api/v1/ingresos', ingresos);
app.use('/api/v1/vehiculos-admin', vehiculosAdmin);
app.use('/api/v1/visitas-admin', visitasAdmin);
app.use('/api/v1/infra', infra);
app.use('/api/v1/personas/biometria', biometria);


app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, ()=> console.log(`API Ingreso UNAH escuchando en puerto ${PORT}`));
