export function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

export function validateBody(body, fields) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    fail(400, 'Enviá un objeto JSON con los campos del formulario.');
  }
  const keys = Object.keys(body);
  if (!keys.length || keys.some((key) => !fields.includes(key))) {
    fail(400, 'El cuerpo está vacío o contiene campos no permitidos.');
  }
}

export function textField(body, key, label, max, required = false) {
  if (body[key] === undefined) {
    if (required) fail(400, `${label} es obligatorio.`);
    return undefined;
  }
  if (typeof body[key] !== 'string') fail(400, `${label} debe ser texto.`);
  const value = body[key].trim();
  if (required && !value) fail(400, `${label} es obligatorio.`);
  if (value.length > max) fail(400, `${label} admite hasta ${max} caracteres.`);
  return value;
}
