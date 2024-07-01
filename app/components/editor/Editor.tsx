import Editor from "@monaco-editor/react"

export function CodeEditor({ code, setCode }: any) {
  return (
    <Editor
      height="400px"
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
      }}
      defaultLanguage="javascript"
      value={code}
      onChange={(value) => setCode(value)}
    />
  )
}
