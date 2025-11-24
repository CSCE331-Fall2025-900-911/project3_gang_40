import express from 'express';
import { translate } from '@vitalets/google-translate-api';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Translation route is active. Use POST to translate text.');
});


router.post('/', async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) return res.status(400).json({ error: 'Missing text or targetLang' });

    const result = await translate(text, { to: targetLang });
    res.json({ translatedText: result.text });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: 'Failed to translate text' });
  }
});

export default router;
