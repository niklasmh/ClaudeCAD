import { codeTemplate } from "./variables/codeTemplate";

export const fixCodeFromError = (code: string, error: string): string => {
  return `I got this error when I tried to run the code:

\`\`\`
${error}
\`\`\`

This is the JavaScript code that I tried to run:

\`\`\`javascript
${code}
\`\`\`

The variable "jscad" is available for use in the code. It contains the JSCAD API. The code should end with "return main()".

Output a fixed version of the code.

Generate the code based on this template:

\`\`\`javascript
${codeTemplate}
\`\`\`
`;
};
