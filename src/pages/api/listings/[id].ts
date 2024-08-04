import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const listingId = parseInt(req.query.id as string, 10);

  if (req.method === 'PATCH') {
    try {
      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: {
          price: parseFloat(req.body.price), // Ensure price is parsed correctly
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        title: req.body.title
        },
      });

      res.status(200).json(updatedListing);
    } catch (error) {
      console.error('Error updating listing:', error);
      res.status(500).json({ error: 'Failed to update listing' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.listing.delete({
        where: { id: listingId },
      });

      res.status(204).end();
    } catch (error) {
      console.error('Error deleting listing:', error);
      res.status(500).json({ error: 'Failed to delete listing' });
    }
  } else {
    res.setHeader('Allow', ['PATCH', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
