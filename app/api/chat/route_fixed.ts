import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });
  }

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'OpenAI: o4 Mini High',
      messages: body.messages
    })
  });

  const data = await openaiRes.json();

  return NextResponse.json(data);
}
