export function errorHandler(err, req, res, next) {
  console.error('[ERR]', err);
  const code = err.status || 500;
  const detail = err.detail || err.message || 'Error inesperado';
  res.status(code).json({ ok: false, error: detail });
}
