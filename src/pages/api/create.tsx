import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  const { title, description, price, imageUrl } = req.body;

  if (!title || !description || !price || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
        listerName: session.user.name as string,
        userId: session.user.id,
        latitude:parseFloat(price),
          longitude:parseFloat(price)
      },
    });
    res.status(200).json(listing);
  } catch (error) {
    console.error('Failed to create listing:', error);
    res.status(500).json({ message: 'Failed to create listing.' });
  }
}