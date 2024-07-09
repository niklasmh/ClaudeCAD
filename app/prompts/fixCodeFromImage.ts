import { codeTemplate } from "./variables/codeTemplate";

export const fixCodeFromImage = (basePrompt: string, prompt: string, code: string): string => {
  return `This is the JavaScript code that was used to generate the image:

\`\`\`javascript
${code}
\`\`\`

This is the original instructions asked when generating the image:

"${basePrompt}"

${prompt ? `Here are additional instructions given with the image:\n\n"${prompt}"` : ""}

Based on the image generated, fix the code above to better match the instructions.

Generate the code based on this template:

\`\`\`javascript
${codeTemplate}
\`\`\`
`;
};
