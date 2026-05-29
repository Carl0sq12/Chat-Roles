const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function sendGeminiMessage(
  history: GeminiMessage[],
  userMessage: string,
): Promise<string> {
  const messages: GeminiMessage[] = [
    ...history,
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const response = await fetch(
    `${GEMINI_URL}?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        systemInstruction: {
          parts: [{
            text: `Eres VetBot, el asistente virtual de PetAdopt. 
Ayudas con dudas sobre salud, cuidados, alimentación y comportamiento de mascotas. 
Responde siempre en español, de forma amable y clara. 
Si la pregunta es de emergencia médica, recomienda ir al veterinario inmediatamente.
No respondas temas que no estén relacionados con mascotas o adopción.`,
          }],
        },
      }),
    }
  );

  if (!response.ok) throw new Error('Error al contactar el asistente');
  const data: any = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta';
}