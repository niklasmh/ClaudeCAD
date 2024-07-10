import { useAppStore } from "@/app/store";
import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export const SpeechInput = () => {
  const setTextInput = useAppStore((state) => state.setTextInput);
  const { transcript, listening } = useSpeechRecognition();

  const registeredListening = useRef(true);

  useEffect(() => {
    if (listening || !transcript || registeredListening.current) return;

    registeredListening.current = true;

    const run = async () => {
      setTextInput(transcript);
    };
    run();
  }, [listening, transcript, setTextInput]);

  return (
    <button
      className={"btn btn-outline "}
      onClick={() => {
        if (listening) {
          SpeechRecognition.stopListening();
        } else {
          registeredListening.current = false;
          SpeechRecognition.startListening();
        }
      }}
    >
      {listening ? <div className="loading loading-ball loading-xs" /> : <Mic size={16} />}
    </button>
  );
};
