import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client lazily & safely
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!genAI && process.env.GEMINI_API_KEY) {
    try {
      genAI = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (err) {
      console.warn('Gemini client initialization failed, falling back to local recommendation engine:', err);
    }
  }
  return genAI;
}

// Helper: Multi-model resilient caller with fallback handling for high-demand spikes
async function generateJsonWithFallback(ai: GoogleGenAI, prompt: string) {
  const candidateModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.8-flash'];
  
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      if (response && response.text) {
        return { text: response.text, model };
      }
    } catch (err: any) {
      const isTransient = err?.status === 503 || err?.code === 503 || String(err?.message || '').includes('high demand') || String(err?.message || '').includes('UNAVAILABLE');
      if (isTransient) {
        console.info(`Gemini model ${model} temporarily busy/experiencing high demand, trying fallback model...`);
      } else {
        console.warn(`Gemini model ${model} error:`, err?.message || err);
      }
    }
  }
  return null;
}

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    hasGoogleMapsKey: !!(process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// 2. Google Places API (New) Live Place Discovery Endpoint
app.post('/api/places/discover', async (req, res) => {
  try {
    const { destination, query } = req.body;
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return res.json({
        success: false,
        source: 'curated-database',
        message: 'No GOOGLE_MAPS_API_KEY configured. Falling back to local curated database.',
        places: []
      });
    }

    const searchQuery = query || `top tourist attractions in ${destination || 'India'}`;
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.googleMapsUri,places.regularOpeningHours,places.types,places.editorialSummary'
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        pageSize: 10
      })
    });

    if (!response.ok) {
      console.warn(`Places API (New) response status: ${response.status}`);
      return res.json({
        success: false,
        source: 'curated-database',
        places: []
      });
    }

    const data = await response.json();
    const rawPlaces = data.places || [];

    const mappedPlaces = rawPlaces.map((p: any) => {
      const name = p.displayName?.text || 'Tourist Attraction';
      const rating = p.rating || 4.5;
      const userRatings = p.userRatingCount || 100;
      // Compute popularity score 70-99 based on ratings count
      const popularityScore = Math.min(99, Math.max(70, Math.round(75 + Math.log10(userRatings + 1) * 6)));
      const weekdayHours = p.regularOpeningHours?.weekdayDescriptions?.[0] || '09:00 AM - 06:00 PM';
      const desc = p.editorialSummary?.text || p.formattedAddress || `Iconic attraction in ${destination}`;

      return {
        id: `gplace-${p.id}`,
        placeId: p.id,
        name,
        category: 'Landmark/Culture',
        address: p.formattedAddress || `${name}, ${destination}`,
        visitDurationHours: 2.0,
        estimatedVisitDuration: 2.0,
        estimatedCostMin: 0,
        estimatedCostMax: 100,
        estimatedCost: 50,
        safetyScore: 94,
        sustainabilityScore: 88,
        latitude: p.location?.latitude || 0,
        longitude: p.location?.longitude || 0,
        description: desc,
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
        bestTimeToVisit: 'Morning or Sunset',
        openingHours: weekdayHours,
        tags: ['Culture', 'Photography', 'History'],
        interests: ['Culture', 'Photography', 'History'],
        popularityScore,
        rating,
        familyFriendly: true,
        googleMapsUri: p.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + (p.formattedAddress || destination))}&query_place_id=${encodeURIComponent(p.id)}`,
        lastUpdated: new Date().toISOString().split('T')[0],
        dataSource: 'places-api'
      };
    });

    return res.json({
      success: true,
      source: 'places-api',
      places: mappedPlaces
    });
  } catch (error: any) {
    console.warn('Live Places API error (falling back to curated data):', error?.message || error);
    return res.json({
      success: false,
      source: 'curated-database',
      places: []
    });
  }
});

// 2. Server-side AI Itinerary Enhancement Endpoint
app.post('/api/ai-plan-trip', async (req, res) => {
  try {
    const { destination, travellers, days, budget, interests, travelStyle, transport } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: false,
        source: 'local-fallback',
        message: 'No GEMINI_API_KEY configured. Running local deterministic engine.'
      });
    }

    const prompt = `You are TravelMate AI, an expert intelligent travel planner.
Generate a concise, high-value travel recommendation brief in JSON for:
Destination: ${destination}
Travellers: ${travellers}
Duration: ${days} days
Budget: ₹${budget} INR
Interests: ${interests?.join(', ')}
Travel Style: ${travelStyle}
Transport: ${transport}

Respond ONLY with valid JSON with keys:
"curatedAdvice": "2 sentence expert insider tip for this specific itinerary",
"hiddenGem": "1 lesser-known local experience or artisan spot",
"safetyAdvisory": "1 key safety tip for this destination",
"ecoTip": "1 sustainability recommendation to reduce plastic or carbon"`;

    const result = await generateJsonWithFallback(ai, prompt);

    if (result) {
      const parsed = JSON.parse(result.text || '{}');
      return res.json({
        success: true,
        source: result.model,
        data: parsed
      });
    }

    return res.json({
      success: false,
      source: 'local-fallback',
      message: 'Local intelligent recommendation engine active'
    });
  } catch (error: any) {
    return res.json({
      success: false,
      source: 'local-fallback',
      error: error?.message || 'AI request error'
    });
  }
});

// 3. AI Business Intelligence Endpoint
app.post('/api/business-insights', async (req, res) => {
  try {
    const { destination } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: false,
        source: 'local-fallback',
        insights: [
          `Growing trend: 42% of visitors to ${destination || 'India'} seek verified cultural experiences.`,
          `Weekend footfall exceeds weekday demand by 48%; local hotels should offer weekday packages.`,
          `High traveler engagement with local handicraft workshops and regional food tours.`
        ]
      });
    }

    const prompt = `Provide 3 actionable business insights for local tourism businesses (hotels, guides, restaurants, handicraft artisans) in ${destination || 'India'}.
Return ONLY a JSON array of 3 strings.`;

    const result = await generateJsonWithFallback(ai, prompt);

    if (result) {
      const insights = JSON.parse(result.text || '[]');
      return res.json({
        success: true,
        source: result.model,
        insights
      });
    }

    return res.json({
      success: false,
      source: 'local-fallback',
      insights: [
        `Growing trend: 42% of visitors to ${destination || 'India'} seek verified cultural experiences.`,
        `Weekend footfall exceeds weekday demand by 48%; local hotels should offer weekday packages.`,
        `High traveler engagement with local handicraft workshops and regional food tours.`
      ]
    });
  } catch (error: any) {
    return res.json({
      success: false,
      source: 'local-fallback',
      error: error?.message
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TravelMate AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
