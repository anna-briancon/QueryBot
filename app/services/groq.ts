import axios from 'axios';

const groqApi = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export async function queryGroq(prompt: string) {
  try {
    const response = await groqApi.post('/chat/completions', {
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }]
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur lors de la requête à Groq:', error);
    throw error;
  }
}