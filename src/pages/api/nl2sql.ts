import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  try {
    const prompt = `Convert the following natural language request to a single SQL query.\nRequest: ${query}\nSQL:`;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an expert SQL generator. Only output the SQL query, nothing else.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 256,
        temperature: 0,
      }),
    });
    const data = await response.json();
    const sql = data.choices?.[0]?.message?.content?.trim();
    if (!sql) {
      return res.status(500).json({ error: 'No SQL generated' });
    }
    res.status(200).json({ sql });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (error) {
  console.error('OpenAI API error:', error); // ✅ this line uses the error
  res.status(500).json({ error: 'Failed to generate SQL' });
}
}
} 
