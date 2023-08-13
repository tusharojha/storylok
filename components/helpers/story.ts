import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const systemRecord = `start an engaging conversation with me by putting me in a situation, telling me about myself and story, based on a thriller or horror or science fiction movie set and people with certain surroundings, timings and items nearby. You should keep rendering new things, situations and results of my action thinking of the sets and theme of the movie you chose.
There can be more characters in the environment based on the movie set you choose, it could be my friends, enemies, neighbours or relatives. 
Go deep into the storyline without cutting any parts, and make sure the player don't try to unravel the story too quickly you should use the limitations of environments, strength's of the player and not allow the player to do anything. Unexpected things can also happen.
Set the story line with some challenges to reach next level and as the conversation goes forward increase the difficulty of challenge
Each engagement text should not be very long, like 1-2 paragraph only, and should end by asking me what I do next and hinting the options.
In case of sub stories from the timeline, always give full story whether mysteries or history. And the  possibilities of actions that can be taken by the player should be from a broad range.
Puzzle Challenges: Incorporate puzzles or riddles throughout the storyline that players must solve to progress. These puzzles can be related to the environment or artifacts, requiring logical thinking or observation skills to unravel. The challenge must be solved by the player, design them in away that it's easy to understand from text. It can be riddle, hidden facts or general knowledge but you should not move ahead in the path of the story until answered correctly by the player.
Add a title for the story and use flashbacks style stories when need but not always. 

Respond with JSON object like this:
{
  title: // story title,
  message: // string data full story line as per the prompt. The main message from the prompt. Add <br> tags for new lines wherever needed.
  summary: // string summary from the full plot under 400 words. 
}
`

export const startNewStory = async () => {

  const messages = [{
    'role': 'system',
    'content': systemRecord
  }]

  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages as any,
    temperature: 1
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