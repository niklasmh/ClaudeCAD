export const extractCodeFromMessage = (message: string): string => {
  if (message.includes("```javascript")) {
    const code = message.split("```javascript\n")[1].split("\n```")[0].trim() + "\n";
    return code;
  }

  if (message.includes("\nconst main") || message.includes("\nfunction main") || message.includes("\nreturn main")) {
    return message;
  }

  throw new Error("No code found in message");
};
