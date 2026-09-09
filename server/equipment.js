import dotenv from 'dotenv';
dotenv.config();

const ENDPOINT_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';

export const getModel = () => (process.env.GEMINI_MODEL || 'gemini-3.8-flash').trim();
export const getKey = () => (process.env.GEMINI_API_KEY || '').trim();

export const isConfigured = () => Boolean(getKey());

export const EQUIPMENT_CATALOG = [
  { id: 'bodyweight', name_ro: 'Doar greutatea corpului', category: 'none', default: true },
  { id: 'chair', name_ro: 'Scaun stabil', category: 'household', default: true },
  { id: 'wall', name_ro: 'Perete liber', category: 'household', default: true },
  { id: 'yoga_mat', name_ro: 'Saltea / Covoraș fitness', category: 'floor' },
  { id: 'dumbbells', name_ro: 'Gantere mici', category: 'weights' },
  { id: 'adjustable_dumbbells', name_ro: 'Gantere reglabile (5 - 20 kg)', category: 'weights' },
  { id: 'resistance_band', name_ro: 'Bandă elastică', category: 'bands' },
  { id: 'kettlebell', name_ro: 'Kettlebell', category: 'weights' },
  { id: 'pullup_bar', name_ro: 'Bară de tracțiuni', category: 'bar' },
  { id: 'foam_roller', name_ro: 'Rolă de spumă', category: 'recovery' },
  { id: 'step_box', name_ro: 'Treaptă / Stepper', category: 'household' },
  { id: 'cushion', name_ro: 'Pernă / Suport genunchi', category: 'floor' }
];

export const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    detected: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          id: {
            type: 'STRING',
            description: 'Identificator standard: bodyweight, chair, wall, yoga_mat, dumbbells, adjustable_dumbbells, resistance_band, kettlebell, pullup_bar, foam_roller, step_box, cushion, other'
          },
          name_ro: { type: 'STRING', description: 'Numele în limba română' },
          details: { type: 'STRING', description: 'Detalii vizuale scurte (ex: 2 gantere mici aprox 2kg, o bandă elastică textilă etc.)' },
          confidence: { type: 'NUMBER', description: 'Încredere de la 0.0 la 1.0' }
        },
        required: ['id', 'name_ro']
      }
    },
    summary_ro: {
      type: 'STRING',
      description: 'Rezumat cald și încurajator în română despre ce s-a găsit în poză'
    },
    recommendation_ro: {
      type: 'STRING',
      description: 'Sfat scurt pentru începător bazat pe echipamentul identificat'
    }
  },
  required: ['detected', 'summary_ro']
};

export async function detectEquipmentFromPhoto(base64Data, mimeType = 'image/jpeg') {
  const key = getKey();
  if (!key) {
    return {
      success: false,
      error: 'GEMINI_NOT_CONFIGURED',
      message: 'Cheia Gemini nu este configurată pe server. Poți bifa manual echipamentul.',
      detected: [
        { id: 'bodyweight', name_ro: 'Greutatea corpului', confidence: 1 },
        { id: 'chair', name_ro: 'Scaun stabil', confidence: 1 },
        { id: 'wall', name_ro: 'Perete liber', confidence: 1 }
      ],
      summary_ro: 'Configurare manuală: ai acces la exerciții fără echipament.',
      recommendation_ro: 'Exercițiile cu greutatea corpului sunt cel mai bun punct de pornire!'
    };
  }

  const prompt = `Analizează această fotografie din locuința utilizatorului pentru a identifica dacă există echipamente de fitness sau obiecte casnice uzuale (cum ar fi gantere, kettlebell, benzi elastice, saltea yoga/covoraș, scaun stabil, bară, perete liber).
Aplicația se adresează începătorilor de la nivelul 0, așa că fii foarte prietenos și încurajator.
Dacă nu există echipamente de fitness specifice în imagine, menționează că se poate lucra perfect doar cu greutatea corpului sau un simplu scaun.`;

  const body = {
    contents: [
      {
        parts: [
          { inline_data: { mime_type: mimeType, data: base64Data } },
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.2,
      maxOutputTokens: 2048
    }
  };

  try {
    const res = await fetch(`${ENDPOINT_BASE}${encodeURIComponent(getModel())}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45000)
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msg = errJson?.error?.message || `Status HTTP ${res.status}`;
      return {
        success: false,
        error: 'API_ERROR',
        message: `Serviciul de recunoaștere a întâmpinat o eroare: ${msg}`,
        detected: [
          { id: 'bodyweight', name_ro: 'Greutatea corpului', confidence: 1 },
          { id: 'chair', name_ro: 'Scaun stabil', confidence: 1 }
        ]
      };
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Răspuns gol de la model');
    }

    const parsed = JSON.parse(text);
    // Asigură-te că include întotdeauna bodyweight și wall
    const hasBodyweight = parsed.detected.some((d) => d.id === 'bodyweight');
    if (!hasBodyweight) {
      parsed.detected.unshift({
        id: 'bodyweight',
        name_ro: 'Doar greutatea corpului',
        details: 'Întotdeauna disponibil',
        confidence: 1.0
      });
    }

    return {
      success: true,
      ...parsed
    };
  } catch (err) {
    return {
      success: false,
      error: err.name === 'TimeoutError' ? 'TIMEOUT' : 'PROCESSING_ERROR',
      message: err.message || 'Nu s-a putut analiza fotografia.',
      detected: [
        { id: 'bodyweight', name_ro: 'Greutatea corpului', confidence: 1 },
        { id: 'chair', name_ro: 'Scaun stabil', confidence: 1 }
      ],
      summary_ro: 'Nu am putut analiza imaginea în acest moment, dar poți alege manual din listă.',
      recommendation_ro: 'Începem oricând cu exerciții simple!'
    };
  }
}
