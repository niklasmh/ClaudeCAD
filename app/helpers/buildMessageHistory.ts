const buildMessageHistory = (messages: string, type: "chat" | "image") => {
  return messages.split("\n").map((message) => {
    const [role, text, image, model, date] = message.split("|");
    return {
      role,
      type,
      text,
      image,
      model,
      date,
    };
  });
};
