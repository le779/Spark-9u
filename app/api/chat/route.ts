import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  const apiKey = process.env.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;

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
      model: 'gpt-3.5-turbo',
      messages: body.messages
    })
  });

  const data = await openaiRes.json();

  return NextResponse.json(data);
}
