import { codeTemplate } from "./variables/codeTemplate";

export const generateCode = (prompt: string): string => {
  return `Generate a JavaScript code for JSCAD that matches the prompt:

"${prompt}"

Generate the code based on this template:

\`\`\`javascript
${codeTemplate}
\`\`\`

The variable "jscad" is available for use in the code. It contains the JSCAD API.
`;
};

export const generateCodeWithImage = (prompt: string): string => {
  return `Generate a JavaScript code for JSCAD that matches the prompt:

"${prompt}"

Generate the code based on this template:

\`\`\`javascript
${codeTemplate}
\`\`\`

The variable "jscad" is available for use in the code. It contains the JSCAD API.

Here is an hand drawn image of how the output should look like. Do not question the image since it is hand-drawn and may have imperfections. Try to reason what is the intended output based on the image before writing the code. When you write the code, include the whole code in the code block.
`;
};

export const generateCodeWithImageOnly = (): string => {
  return `Generate a JavaScript code for JSCAD. Generate the code based on this template:

\`\`\`javascript
${codeTemplate}
\`\`\`

The variable "jscad" is available for use in the code. It contains the JSCAD API.

Here is an hand drawn image of how the output should look like. Do not question the image since it is hand-drawn and may have imperfections. Try to reason what is the intended output based on the image before writing the code. When you write the code, include the whole code in the code block.
`;
};
