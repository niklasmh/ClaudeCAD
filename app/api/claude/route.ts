import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { model, temperature = 0, system = "", messages, max_tokens = 1_000, api_key = "" } = await req.json();

  if (!api_key) {
    return Response.json(
      {
        error:
          "Missing API key. When you add it here, it will be saved in the local storage of the browser. Nothing will be saved on the server.",
        developerError: "Please provide an API key in `api_key` to use the API.",
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  const anthropic = new Anthropic({
    apiKey: api_key,
  });

  const response = await anthropic.messages.create({
    model,
    temperature,
    system,
    messages,
    max_tokens,
  });

  return Response.json(response);
}
