export const extractCodeFromMessage = (message: string): string => {
  const code =
    message.split("```javascript\n")[1].split("\n```")[0].trim() + "\n"
  return code
}
