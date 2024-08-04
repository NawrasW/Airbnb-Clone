import type { NextApiRequest, NextApiResponse } from 'next';
import vision from '@google-cloud/vision';
import fs from 'fs';
import path from 'path';

// Initialize the Google Cloud Vision client
const client = new vision.ImageAnnotatorClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { image } = req.body;

      // Decode base64 image string and save it to a temporary file
      const buffer = Buffer.from(image, 'base64');

      
      const tempDir = path.join(process.cwd(), 'temp');
      const tempFilePath = path.join(tempDir, 'image.jpg');

      // Ensure the temp directory exists
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      fs.writeFileSync(tempFilePath, buffer);

      // Detect explicit content using Google Vision API
      const [result] = await client.safeSearchDetection(tempFilePath);
      const detections = result.safeSearchAnnotation;



      // Clean up temporary file
      fs.unlinkSync(tempFilePath);

      if (detections) {
        if (detections.adult === 'VERY_LIKELY' || detections.violence === 'VERY_LIKELY') {
          return res.status(400).json({ error: 'Image contains explicit content' });
        }
      }

      return res.status(200).json({ message: 'Image is safe' });
    } catch (error) {
      console.error('Error moderating image:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
