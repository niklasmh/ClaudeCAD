import { booleanExampleString } from "@/app/examples/boolean";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const getDummyResponseText = (dummyType: string) => {
  switch (dummyType) {
    case "text-and-image":
      return (
        "You sent a text and an image, here is code:\n\n```javascript\n" +
        booleanExampleString +
        "\n```\n\nAnd here is a text response"
      );
    case "fixError":
      return "I fixed the error";
    default:
      return "Dummy response";
  }
};

export async function POST(req: Request) {
  const { model, dummyType = null, temperature = 0, system = "", messages, max_tokens = 1_000 } = await req.json();

  if (dummyType !== null) {
    return Response.json({
      content: [
        {
          text: getDummyResponseText(dummyType),
        },
      ],
    });
  }

  const response = await anthropic.messages.create({
    model,
    temperature,
    system,
    messages,
    max_tokens,
  });

  return Response.json(response);
}
