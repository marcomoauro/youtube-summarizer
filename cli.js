#!/bin/nodejs

// yarn cli --video https://www.youtube.com/watch?v=3l2wh5K_WLI --language en

import yargs from 'yargs';
import {getSubtitleFromVideo} from "./src/getSubtitleFromVideo.js";
import {splitInChunks} from "./src/splitInChunks.js";
import {LANGUAGES_CODES, summarizeChunks} from "./src/summarizeChunks.js";

const { argv } = yargs(process.argv.slice(2));

if (!argv.video) {
  throw new Error('Video not found, expected either --video option');
}

if (!argv.language) {
  throw new Error('Language not found, expected either --language option');
}

if (!Object.values(LANGUAGES_CODES).includes(argv.language)) {
  throw new Error(`Language not supported, specify one among ${Object.values(LANGUAGES_CODES)}`);
}

const main = async ({video, language}) => {
  const subtitle = await getSubtitleFromVideo(video)
  const chunks = splitInChunks(subtitle)
  const summary = await summarizeChunks({chunks, language})
  console.log('Summary:', summary)
}

await main({video: argv.video, language: argv.language})

process.exit(0)