import { NextApiRequest, NextApiResponse } from 'next';
import lighthouse from '@lighthouse-web3/sdk'
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { cid } = req.query;
    console.log(cid)
    if (!cid && typeof cid !== "string") {
      return res.status(400).json({ error: 'Missing base64String parameter' });
    }

    try {
      const response = await axios.get(`https://ipfs.io/ipfs/${cid}`, { responseType: 'arraybuffer' });
      const base64String = Buffer.from(response.data, 'base64');
      // const d = base64String.replace('data:image/png;base64,', '')
      // console.log(d.includes('data:image/png;base64,'))
      
      // const buffer = Buffer.from(d, 'base64');
      res.setHeader('Content-Type', 'image/png'); // Set the appropriate content type
      res.status(200).send(base64String);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to process base64 string', err: error });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
