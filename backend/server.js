const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// TEST ruta da vidimo da API radi
app.get('/api/hello', (req, res) => {
  res.json({ message: 'API radi 🙂' });
});

// (kasnije ćemo ovdje dodati /api/check-tax i AI poziv)

app.listen(port, () => {
  console.log(`Backend radi na http://localhost:${port}`);
});

// glavna ruta: primamo podatke o transakciji
app.post('/api/check-tax', (req, res) => {
  const { country, amount, description } = req.body;

  // Za sada NE koristimo pravi AI, nego fejk logiku, čisto za test
  let risk = 'low';
  let notes = [];

  if (!country || !amount || !description) {
    return res.status(400).json({ error: 'Nedostaju podaci.' });
  }

  if (amount > 10000) {
    risk = 'medium';
    notes.push('Iznos je veći od 10 000, može biti rizično za dodatne provjere.');
  }

  if (description.toLowerCase().includes('crypto')) {
    risk = 'high';
    notes.push('Spomenuta je kripto transakcija – često zahtijeva dodatni compliance.');
  }

  if (notes.length === 0) {
    notes.push('Nema očitih rizika, ali treba provjeriti lokalne porezne propise.');
  }

  res.json({
    country,
    amount,
    description,
    risk,
    notes,
  });
});
