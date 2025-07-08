export function formatConvHistory(messages: any[]) {
  return messages.map((msg: any, i: number) =>
    i % 2 === 0 ? `Human: ${msg}` : `AI: ${msg}`
  ).join('\n');
}
