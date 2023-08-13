// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

const axios = require('axios');

type Data = {
  base64: any
}
async function getImageData(url: string) {
  return axios({
    url,
    responseType: 'arraybuffer'
  })
    .then((response: any) => Buffer.from(response.data, 'binary').toString('base64'))
    .catch((error: any) => {
      console.error('Error fetching image:', error);
    });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { url } = req.body

  console.log(url)
  const data = await getImageData(url?.toString() ?? '')
  res.status(200).json({ base64: data })
}
