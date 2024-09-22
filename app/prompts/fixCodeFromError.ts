import { codeTemplate } from "./variables/codeTemplate";
import { JSCADInstructions, JSCADInstructionsShort } from "./variables/JSCADInstructions";

export const fixCodeFromError = (code: string, error: string, nthTime: number = 1): string => {
  let additionalInstructions = "";

  if (nthTime === 1) {
    additionalInstructions = `
Generate the JSCAD code based on this these instructions:

\`\`\`javascript
${JSCADInstructionsShort}
\`\`\`
`;
  } else if (nthTime === 2) {
    additionalInstructions = `
Generate the JSCAD code based on this these instructions:

\`\`\`javascript
${JSCADInstructions}
\`\`\`
`;
  }

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
${additionalInstructions}

Here is a template for the code. Following this is essential for the code to work in JSCAD:

\`\`\`javascript
${codeTemplate}
\`\`\`
`;
};
