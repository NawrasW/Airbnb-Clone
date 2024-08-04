import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { PrismaClient } from '@prisma/client';
import authOptions from '../../../authOptions';
import fs from 'fs';
import path from 'path';
import multiparty from 'multiparty';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false, // Disable body parsing by Next.js
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(req, (err: any, fields: any, files: any) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

const ensureDirExists = async (dir: string) => {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    console.error('Unauthorized: No session found');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('Session found:', session);

  try {
    const { fields, files } = await parseForm(req);
    const { title, description, price, latitude, longitude } = fields;
    let imageFile: any;

    if (files.imageFile && files.imageFile.length > 0) {
      imageFile = files.imageFile[0]; // Assuming we only handle the first file
    }

    if (!title || !description || !price || !imageFile || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // Process the uploaded file
    const tempPath = imageFile.path;
    const fileName = imageFile.originalFilename;
    const targetDir = path.join(process.cwd(), 'public', 'uploads');
    const targetPath = path.join(targetDir, fileName);

    // Ensure the target directory exists
    await ensureDirExists(targetDir);

    // Copy the uploaded file to the target path and remove the original
    await fs.promises.copyFile(tempPath, targetPath);
    await fs.promises.unlink(tempPath);

    const imageUrl = `/uploads/${fileName}`;

    const newListing = await prisma.listing.create({
      data: {
        title: title[0],
        description: description[0],
        price: parseFloat(price[0]),
        imageUrl,
        listerName: session.user.name as string,
        userId: session.user.id,
        latitude: parseFloat(latitude[0]),
        longitude: parseFloat(longitude[0]),
      },
    });

    res.status(201).json(newListing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Error creating listing' });
  }
}
