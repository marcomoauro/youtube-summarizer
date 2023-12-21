import PQueue from 'p-queue';
import axios from "axios";
const pq = new PQueue({concurrency: 2});
import { strict as assert } from 'assert';

export const LANGUAGES_CODES = {
  ITALIAN: 'it',
  ENGLISH: 'en',
  FRENCH: 'fr',
  GERMAN: 'de',
  SPANISH: 'es',
  PORTUGUESE: 'pt',
  RUSSIAN: 'ru',
  ROMANIAN: 'ro',
  JAPANESE: 'ja',
  KOREAN: 'ko',
  CHINESE: 'zh-cn',
  CHINESE_TRADITIONAL: 'zh-tw',
}

export const LANGUAGE_CODE_TO_LANGUAGE = {
  [LANGUAGES_CODES.ITALIAN]: 'Italian',
  [LANGUAGES_CODES.ENGLISH]: 'English',
  [LANGUAGES_CODES.FRENCH]: 'French',
  [LANGUAGES_CODES.GERMAN]: 'German',
  [LANGUAGES_CODES.SPANISH]: 'Spanish',
  [LANGUAGES_CODES.PORTUGUESE]: 'Portuguese',
  [LANGUAGES_CODES.RUSSIAN]: 'Russian',
  [LANGUAGES_CODES.ROMANIAN]: 'Romanian',
  [LANGUAGES_CODES.JAPANESE]: 'Japanese',
  [LANGUAGES_CODES.KOREAN]: 'Korean',
  [LANGUAGES_CODES.CHINESE]: 'Chinese',
  [LANGUAGES_CODES.CHINESE_TRADITIONAL]: 'Traditional Chinese',
};

export const summarizeChunks = async ({chunks, language}) => {
  console.log('summarize chunks by AI')

  // summarizes the subtitles by making sense of them
  chunks = await Promise.all(chunks.map((chunk) => computeSummaryByAI({text: chunk, language})))

  let summary

  if (chunks.length > 1) {
    summary = await recursiveSummaryByChunks({chunks, language})
  } else {
    summary = chunks[0]
  }

  return summary
}

const chunkArray = (array, size) => {
  const chunks = []
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    chunks.push(chunk)
  }

  return chunks
}

const recursiveSummaryByChunks = async ({chunks, language}) => {
  if (chunks.length <= 5) {
    return computeSummaryByAI({text: chunks.join(' '), language});
  }

  const groups_chunks = chunkArray(chunks, 5)
  const groups_chunks_summary = await Promise.all(groups_chunks.map((group_chunk) => computeSummaryByAI({
    text: group_chunk.join(' '),
    language
  })))

  const result = await recursiveSummaryByChunks({chunks: groups_chunks_summary, language});

  return result;
}

const computeSummaryByAI = async ({text, language}) => {
  const summary = await pq.add(() => _computeSummaryByAI({text, language}));

  return summary;
}

const OPEN_AI_API_KEY = ''
assert(OPEN_AI_API_KEY, 'Please define OPEN_AI_API_KEY, you can create it from https://openai.com/blog/openai-api');

const _computeSummaryByAI = async ({text, language}) => {
    const body = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a brilliant assistant, and your task is to summarize the provided text in less than 200 words
            in the language ${LANGUAGE_CODE_TO_LANGUAGE[language]}.
            Ensure that the sentences are connected to form a continuous discourse.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    try {
      const {data} = await axios.post('https://api.openai.com/v1/chat/completions', body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPEN_AI_API_KEY}`
        },
      });

      const summary = data.choices[0].message.content
      return summary
    } catch (error) {
      console.error('_computeSummaryByAI', error)
      throw error
    }
  }