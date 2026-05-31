const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Procesa una imagen de ticket usando Google Gemini 1.5 Flash
 * @param {string} base64Image Imagen en formato base64 (con prefijo data:image/...)
 * @returns {Promise<Object>} Datos del ticket extraídos
 */
export const analyzeTicketWithGemini = async (base64Image) => {
  if (!GEMINI_API_KEY) {
    throw new Error('No se ha configurado la API Key de Gemini');
  }

  // Limpiar el prefijo data:image/jpeg;base64,
  const base64Data = base64Image.split(',')[1];

  const prompt = `Analiza la imagen de este ticket de compra de España y devuelve UNICAMENTE un objeto JSON con esta estructura exacta, sin texto adicional ni bloques de código markdown:
  {
    "supermercado": "Nombre del supermercado (ej: Mercadona, Carrefour, Lidl, etc)",
    "total": 0.00,
    "fecha": "YYYY-MM-DD",
    "productos": [
      {"nombre": "Nombre producto", "cantidad": 1, "precio": 0.00}
    ]
  }
  Si no encuentras productos, deja la lista vacía. Si no encuentras la fecha, usa la de hoy. Asegúrate de que el total sea un número.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: base64Data
              }
            }
          ]
        }]
      })
    });

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]) {
      throw new Error('No se pudo obtener respuesta de la IA');
    }

    let textResponse = data.candidates[0].content.parts[0].text;

    // Limpiar posibles bloques de código si la IA los pone
    textResponse = textResponse.replace(/```json|```/g, '').trim();

    return JSON.parse(textResponse);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
