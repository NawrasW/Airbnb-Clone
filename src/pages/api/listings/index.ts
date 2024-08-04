import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const listings = await prisma.listing.findMany({
        where: {
          userId: session.user.id,
        },
      });
      res.status(200).json(listings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ error: 'Failed to fetch listings' });
    }
  } else if (req.method === 'POST') {
    const { title, description, price, imageUrl } = req.body;

    try {
      const newListing = await prisma.listing.create({
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
      res.status(201).json(newListing);
    } catch (error) {
      console.error('Error creating listing:', error);
      res.status(500).json({ error: 'Failed to create listing' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
