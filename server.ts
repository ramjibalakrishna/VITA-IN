import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'vita-in-api' });
});

app.post('/api/analyze-meal', async (req, res) => {
  try {
    const mealText = typeof req.body?.mealText === 'string' ? req.body.mealText.trim() : '';
    const dietType = typeof req.body?.dietType === 'string' ? req.body.dietType : 'lacto-veg';

    if (!mealText) {
      res.status(400).json({ error: 'Please describe an Indian meal to analyze.' });
      return;
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this Indian meal for Vitamin D (in IU) and Vitamin B12 (in micrograms, mcg), considering realistic ICMR / NIN (National Institute of Nutrition, India) nutritional values and Indian cooking practices (e.g., ghee/oil fat pairing, dairy, fermented foods, chai tannins). User dietary pattern: ${dietType}.\n\nMeal description: "${mealText}"`,
      config: {
        systemInstruction:
          'You are a clinical Indian nutritionist specializing in ICMR Vitamin B12 and Vitamin D bioavailability. Return conservative, evidence-based estimates. Plant foods without fortification have 0 mcg active B12 and 0 IU Vitamin D unless UV-exposed mushrooms or fortified ingredients are explicitly included. Note fat pairing if ghee, butter, oil, paneer, nuts, or egg yolk are present. Flag tannin blocker if chai or coffee is mentioned.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mealName: {
              type: Type.STRING,
              description: 'Concise clean title for the logged Indian meal.',
            },
            servingSummary: {
              type: Type.STRING,
              description: 'Short portion summary, e.g. 2 Parathas + 150g Dahi + 250ml Milk.',
            },
            vitaminD_IU: {
              type: Type.NUMBER,
              description: 'Estimated total Vitamin D in IU.',
            },
            vitaminB12_mcg: {
              type: Type.NUMBER,
              description: 'Estimated total bioavailable Vitamin B12 in micrograms (mcg).',
            },
            absorptionTip: {
              type: Type.STRING,
              description:
                'One concise, actionable absorption tip specific to Indian cuisine (1-2 sentences).',
            },
            isFatPaired: {
              type: Type.BOOLEAN,
              description:
                'True if the meal contains healthy fats (ghee, oil, nuts, egg yolk, paneer, fatty fish) aiding Vitamin D uptake.',
            },
            hasTanninWarning: {
              type: Type.BOOLEAN,
              description:
                'True if chai, tea, or coffee was included in the meal description.',
            },
          },
          required: [
            'mealName',
            'servingSummary',
            'vitaminD_IU',
            'vitaminB12_mcg',
            'absorptionTip',
            'isFatPaired',
            'hasTanninWarning',
          ],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      res.status(502).json({ error: 'Received empty response from nutrition analyzer.' });
      return;
    }

    const parsed = JSON.parse(rawText);
    res.json({
      mealName: String(parsed.mealName || mealText).slice(0, 80),
      servingSummary: String(parsed.servingSummary || '1 logged meal'),
      vitaminD_IU: Math.max(0, Math.round(Number(parsed.vitaminD_IU) || 0)),
      vitaminB12_mcg: Math.max(0, Math.round((Number(parsed.vitaminB12_mcg) || 0) * 100) / 100),
      absorptionTip: String(
        parsed.absorptionTip ||
          'Pair fat-soluble Vitamin D foods with a teaspoon of desi ghee or soaked nuts.'
      ),
      isFatPaired: Boolean(parsed.isFatPaired),
      hasTanninWarning: Boolean(parsed.hasTanninWarning),
    });
  } catch (error) {
    console.error('Error in /api/analyze-meal:', error);
    const message =
      error instanceof Error ? error.message : 'Unable to analyze meal right now.';
    res.status(500).json({ error: message });
  }
});

app.post('/api/recovery-plan', async (req, res) => {
  try {
    const vitaminDDeficitIU = Math.max(0, Number(req.body?.vitaminDDeficitIU) || 0);
    const vitaminB12DeficitMcg = Math.max(0, Number(req.body?.vitaminB12DeficitMcg) || 0);
    const dietType = String(req.body?.dietType || 'lacto-veg');
    const skinType = Number(req.body?.skinType || 4);
    const city = String(req.body?.city || 'Bengaluru');
    const optimalSunWindow = String(req.body?.optimalSunWindow || '10:30 AM – 1:30 PM');
    const symptoms = Array.isArray(req.body?.symptoms) ? req.body.symptoms : [];

    const ai = getGeminiClient();

    const prompt = `Create a practical, culturally authentic 1-day Indian Vitamin B12 & Vitamin D recovery protocol for tomorrow.
User Profile:
- Diet preference: ${dietType} (STRICTLY obey this diet—do not suggest eggs or meat to vegetarians/vegans, and do not suggest dairy to strict vegans)
- Fitzpatrick skin phototype: Type ${skinType}
- Indian city: ${city}
- Optimal local UV-B window: ${optimalSunWindow}
- Remaining daily deficit today: ${vitaminDDeficitIU} IU Vitamin D, ${vitaminB12DeficitMcg.toFixed(2)} mcg Vitamin B12
- Reported symptoms: ${symptoms.length > 0 ? symptoms.join(', ') : 'None reported'}

Include 4 Indian meal slots (Breakfast, Lunch, Evening Snack, Dinner) tailored to ${dietType}, plus a timed outdoor exercise & sunlight block during ${optimalSunWindow}, and a clear chai/coffee spacing rule.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an ICMR-aligned Indian clinical nutritionist. Design concise, realistic home-cooked Indian meals with exact gram/ml portions and realistic B12 (mcg) & D (IU) yields.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            sunlightProtocol: {
              type: Type.OBJECT,
              properties: {
                window: { type: Type.STRING },
                durationMinutes: { type: Type.NUMBER },
                exercise: { type: Type.STRING },
                expectedIU: { type: Type.NUMBER },
                tip: { type: Type.STRING },
              },
              required: ['window', 'durationMinutes', 'exercise', 'expectedIU', 'tip'],
            },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slot: { type: Type.STRING },
                  dish: { type: Type.STRING },
                  portion: { type: Type.STRING },
                  vitaminB12_mcg: { type: Type.NUMBER },
                  vitaminD_IU: { type: Type.NUMBER },
                  synergyNote: { type: Type.STRING },
                },
                required: [
                  'slot',
                  'dish',
                  'portion',
                  'vitaminB12_mcg',
                  'vitaminD_IU',
                  'synergyNote',
                ],
              },
            },
            avoidanceRule: { type: Type.STRING },
          },
          required: ['headline', 'sunlightProtocol', 'meals', 'avoidanceRule'],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    if (!rawText) {
      res.status(502).json({ error: 'Received empty response from recovery planner.' });
      return;
    }

    const plan = JSON.parse(rawText);
    res.json(plan);
  } catch (error) {
    console.error('Error in /api/recovery-plan:', error);
    const message =
      error instanceof Error ? error.message : 'Unable to generate recovery plan right now.';
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VITA-IN server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
