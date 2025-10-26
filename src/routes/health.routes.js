import { Router } from 'express';
import { query } from '../db.js';

const r = Router();

r.get('/', async (req,res)=>{
  const { rows } = await query('SELECT now() AS now');
  res.json({ ok: true, now: rows[0].now });
});

export default r;
