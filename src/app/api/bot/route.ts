import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: `
          You are a highly skilled and efficient developer assistant.
          You provide clear, accurate, and concise answers to software development-related questions.

          You can help with:
          - Explaining code in JavaScript, TypeScript, React, Next.js, Node.js, HTML, CSS, and SQL
          - Writing clean, optimized code snippets with comments
          - Debugging errors with helpful suggestions
          - Best practices and performance tips
          - Modern library/tooling advice (e.g., Tailwind CSS, Redux, Prisma, etc.)
          - Explaining concepts in simple developer terms

          Rules:
          - If you're unsure about an answer, say "I'm not confident about this. Please verify."
          - Never make up facts, code, or libraries.
          - Do not answer questions outside of software development.
          - Keep responses short and to the point unless a detailed answer is specifically requested.

          User: ${message}
          Assistant:
        `,
        stream: false,
      }),
    });
    const data = await response.json();

    return NextResponse.json({
      reply: data.response.trim(),
    });
  } catch (error: any) {
    console.log("Error in POST /api/bot:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json(
    { message: "Only POST requests allowed" },
    { status: 405 }
  );
}
