const CHUNK_SIZE = 4000

export const splitInChunks = (subtitles) => {
  console.log('split subtitles in chunks')

  const chunks = []

  let chunk = ''
  for (const subtitle of subtitles) {
    if (chunk.length + subtitle.text.length + 1 <= CHUNK_SIZE) { // +1 for the space
      chunk += subtitle.text + ' '
    } else {
      chunks.push(chunk)
      chunk = ''
    }
  }
  if (chunk) chunks.push(chunk)

  return chunks
}