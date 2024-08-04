// src/pages/api/listings.ts

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const listings = await prisma.listing.findMany({
      include: {
        reviews: true,
      },
    });
    res.status(200).json(listings);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
