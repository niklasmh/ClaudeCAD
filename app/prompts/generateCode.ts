import { codeTemplate } from "./variables/codeTemplate"

export const generateCode = (prompt: string): string => {
  return `Generate a JavaScript code for JSCAD that matches the prompt:

"${prompt}"

Generate the code based on this template:

\`\`\`javascript
${codeTemplate}
\`\`\`

The variable "jscad" is available for use in the code. It contains the JSCAD API.
`
}
