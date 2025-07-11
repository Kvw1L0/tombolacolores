const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de participantes y colores
const TOTAL_PARTICIPANTS = 10;
const COLORS = [
  'rojo','azul','verde'
];

// Calcula cuotas equitativas
const base = Math.floor(TOTAL_PARTICIPANTS / COLORS.length);
const remainder = TOTAL_PARTICIPANTS % COLORS.length;
const shuffled = [...COLORS].sort(() => 0.5 - Math.random());
const quotas = {};
COLORS.forEach(c => quotas[c] = base);
for (let i = 0; i < remainder; i++) {
  quotas[shuffled[i]]++;
}

// Contadores iniciales
const counts = {};
COLORS.forEach(c => counts[c] = 0);

// Sirve archivos estáticos desde raíz
app.use(express.static(path.join(__dirname, '/')));

// Endpoint de asignación
app.get('/api/assign', (req, res) => {
  const available = COLORS.filter(c => counts[c] < quotas[c]);
  if (available.length === 0) {
    return res.status(400).json({ error: 'No quedan cupos disponibles' });
  }
  const color = available[Math.floor(Math.random() * available.length)];
  counts[color]++;
  res.json({ color, counts });
});

app.listen(PORT, () => {
  console.log(`Tómbola corriendo en http://localhost:${PORT}`);
});
