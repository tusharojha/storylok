import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

import loks from '@/components/Gameplay/loks.json'

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

let storyPlot = ''

const systemRecord = () => `you are an excellent story teller, and the user is the main character of story. write the story in that figure of speech, considering the following initial plot:

${storyPlot}

Drive the story and continuously ask the user for input after every plot turn to take an action that can lead to dramatic turns in the story based on the next step the user may take.

Make sure to:
- give names to characters
- make sure to give options in the response format.
- go in details like telling numbers where needed
- avoid accepting users request to escaping the physical realities

Always give response in the json format:
{ 
    "title": "a related title of the story",
    "options": ["option a", "option b", "option c"],
    "message": "the story data that you generated based on user actions, should be under 100 words. Use "<br/>" tag where you want new line. Avoid using double quotes.",
}
`

export const generateSummary = async (messages: any[]) => {
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      'role': 'system',
      'content': systemRecord()
    }, ...(messages as any)],
    temperature: 0.4,
    max_tokens: 300
  });

  console.log('c', chat_completion)
  const chat = chat_completion.data.choices[0]
  try {
    const d = chat.message?.content;
    return d;
  } catch (e) {
    console.log(e)
  }
}

export const startNewStory = async (sp: string) => {
  storyPlot = sp
  const messages = [{
    'role': 'system',
    'content': systemRecord()
  }]

  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages as any,
    temperature: 1,
    max_tokens: 250
  });

  console.log(chat_completion)
  const chat = chat_completion.data.choices[0]

  try {
    const d = JSON.parse(chat.message?.content ?? '{}');
    return d;
  } catch (e) {
    console.log(e)
  }
}


export const continueStory = async (messages: any) => {
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      'role': 'system',
      'content': systemRecord()
    }, ...(messages as any)],
    temperature: 0.4,
    max_tokens: 300
  });

  console.log('c', chat_completion)
  const chat = chat_completion.data.choices[0]
  try {
    const d = JSON.parse(chat.message?.content ?? '{}');
    return d;
  } catch (e) {
    console.log(e)
  }
}

export const createImagePrompt = async (messages: any) => {
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system", content: `
      Continue the following conversation, as your duty is to curate the story as the user take actions and make it more fun, exciting, surprising with few mysteries, riddles / puzzels and levels.
    `}, ...(messages as any)],
    temperature: 1,
    max_tokens: 256,
    top_p: 1
  });

  console.log('c', chat_completion)
  const chat = chat_completion.data.choices[0]
  return chat.message?.content;
}

export const textToImage = async (prompt: string, lok: typeof loks.loks[0]) => {
  const path =
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STABILITY}`
  };

  const body = {
    steps: 40,
    width: 1024,
    height: 1024,
    seed: 0,
    cfg_scale: 5,
    samples: 1,
    style_preset: "anime",
    text_prompts: [
      {
        "text": prompt,
        "weight": 1
      },
      {
        "text": "blurry, bad, black and white",
        "weight": -1
      }
    ],
  };

  const options = {
    url: path,
    method: "POST",
    headers,
    data: body
  }

  const response = await axios(options)

  if (response.status != 200) {
    throw new Error(`Non-200 response: ${await response}`)
  }

  const responseJSON = await response.data;

  console.log(responseJSON)
  return responseJSON.artifacts[0].base64
};

export const createImage = async (prompt: string) => {
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: "512x512",
  })
  console.log(response.data.data[0])


  return response.data.data[0].url
}

export async function getImageData(url: string) {
  try {
    const response = await axios.post('/api/getImage', {
      url: url
    });
    console.log('response', response.data)
    console.log(response.data);
    return response.data
  } catch (error) {
    console.error('Error fetching file:', error);
  }
}