import Editor from "@monaco-editor/react";

type Props = {
  code: string;
  setCode: (code: string) => void;
  readOnly?: boolean;
};

export function CodeEditor({ code, setCode, readOnly }: Props) {
  return (
    <Editor
      height="400px"
      theme="vs-dark"
      className="rounded-lg overflow-hidden"
      options={{
        minimap: { enabled: false },
        readOnly,
        scrollBeyondLastLine: false,
      }}
      defaultLanguage="javascript"
      value={code}
      onChange={(value) => {
        if (typeof value === "string") {
          setCode(value);
        }
      }}
    />
  );
}
