type ErrorDetails = {
  message: string
  type: string | null
  lineNumber: number | null
  columnNumber: number | null
}

export function extractError(error: Error): ErrorDetails {
  const errorDetails: ErrorDetails = {
    message: error.message,
    type: (error.stack || "").split(": ")[0],
    lineNumber: null,
    columnNumber: null,
  }

  if (error.stack) {
    const stackLines = error.stack.split("\n")
    const relevantLine = stackLines[1]

    if (relevantLine) {
      const match = relevantLine.match(/<anonymous>:(\d+):(\d+)/)
      if (match) {
        errorDetails.lineNumber = parseInt(match[1], 10) - 2
        errorDetails.columnNumber = parseInt(match[2], 10)
      }
    }
  }

  return errorDetails
}
