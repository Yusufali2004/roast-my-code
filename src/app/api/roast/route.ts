import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are a sarcastic Senior Software Engineer. 
Roast the code provided by the user. 
Be mean, funny, and technical. Point out bad practices.
Keep it under 100 words.
`;

export async function POST(req: Request) {
    try {
        const { code } = await req.json();

        // 1. Load Key from Environment (Secure)
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ roast: "Server Error: API Key missing." }, { status: 500 });
        }

        // 2. Call Gemini (Using the model we verified works: gemini-2.5-flash)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: SYSTEM_PROMPT + "\n\nCODE TO ROAST:\n" + code }] }]
                })
            }
        );

        const data = await response.json();
        const roast = data?.candidates?.[0]?.content?.parts?.[0]?.text || "The AI is silent.";

        return NextResponse.json({ roast });

    } catch (error: any) {
        return NextResponse.json({ roast: "CRITICAL CRASH: " + error.message });
    }
}