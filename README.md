# Youtube summarizer

YouTube video summary implementation in Node.js.

## Requirements

Create an OpenAI account and get an API key [from here](https://openai.com/blog/openai-api). It must be set to the constant `OPEN_AI_API_KEY` in `src/summarizeChunks.js`.

Node version >= 20

## Install dependencies

```sh
yarn install
```

## How to use

```sh
yarn cli --video="https://www.youtube.com/watch?v=3l2wh5K_WLI" --language en
```
