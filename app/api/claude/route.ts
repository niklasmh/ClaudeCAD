import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(req: Request) {
  const { model, temperature = 0, system = "", messages, max_tokens = 1_000 } = await req.json();
  const response = await anthropic.messages.create({
    model,
    temperature,
    system,
    messages,
    max_tokens,
  });

  return Response.json(response);
}
