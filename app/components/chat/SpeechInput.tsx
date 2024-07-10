import { Mic } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

type Props = {
  onChange: (transcript: string) => void;
  className?: string;
};

export const SpeechInput = ({ onChange, className }: Props) => {
  const { transcript, resetTranscript } = useSpeechRecognition({
    clearTranscriptOnListen: false,
  });
  const [isListening, setIsListening] = useState(false);
  const timer = useRef<any>();

  useEffect(() => {
    if (isListening && transcript) onChange(transcript);
  }, [isListening, transcript]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (isListening && transcript) {
      clearTimeout(timer.current!);
      timer.current = setTimeout(() => {
        SpeechRecognition.stopListening();
        setIsListening(false);
      }, 5000);
    }
  }, [isListening, transcript]);

  return (
    <button className={"btn btn-outline " + className} onClick={toggleListening}>
      {isListening ? <div className="loading loading-ball loading-xs" /> : <Mic size={16} />}
    </button>
  );
};
