/*
import ollama from 'ollama'

const response = await ollama.chat({
  model: 'llama3.2-vision',
  messages: [{
    role: 'user',
    content: 'What is in this image?',
    images: ['image.jpg']
  }]
})

console.log(response)
*/

export async function POST(req: Request) {
  const { model, temperature = 0, messages } = await req.json();

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    body: JSON.stringify({
      model,
      stream: false,
      options: { temperature },
      messages,
    }),
  }).then((res) => res.json());

  return Response.json(response);
}
