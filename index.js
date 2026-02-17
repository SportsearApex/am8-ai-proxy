const express = require('express');
const app = express();
app.use(express.json({ limit: '50mb' }));

const API_KEY = process.env.ANTHROPIC_API_KEY || '';

app.get('/', (req, res) => res.send('AM8 AI Proxy OK'));

app.post('/v1/messages', async (req, res) => {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });
    const data = await r.text();
    res.set('Access-Control-Allow-Origin', '*');
    res.status(r.status).send(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.options('*', (req, res) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.sendStatus(204);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('AM8 AI Proxy on port ' + PORT));
