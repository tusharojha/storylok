import AWS from "aws-sdk";
import fs from 'fs'

const handler = (req: any, res: any) => {
  const { method } = req;

  switch (method) {
    case "POST":
      return handlePOST(req, res);

    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

const handlePOST = async (req: any, res: any) => {
  const body = req.body;
  const parsedBody = body.body;

  const story = parsedBody.story;

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  // geenerate audio from story using AWS Polly
  const polly = new AWS.Polly({
    signatureVersion: "v4",
    region: "us-east-1",
  });
  console.log(story)
  const params = {
    OutputFormat: "mp3",
    Text: story,
    TextType: "text",
    VoiceId: "Matthew",
  };

  try {
    const data = await polly.synthesizeSpeech(params).promise();
    console.log(data.$response)
    const audio = data.AudioStream;

    console.log(audio)
    res.status(200).json({ audio });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Error generating audio" });
  }
};

export default handler;