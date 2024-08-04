// src/pages/api/listings/[id]/reviews.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Missing rating or comment' });
    }

    try {
      // Fetch the listing to get listerName
      const listing = await prisma.listing.findUnique({
        where: { id: parseInt(id as string, 10) },
        select: { listerName: true },
      });

      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }

      const review = await prisma.review.create({
        data: {
          rating: parseInt(rating, 10),
          comment,
          listingId: parseInt(id as string, 10),
          listerName: listing.listerName, 
        },
      });

      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Error creating review' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
