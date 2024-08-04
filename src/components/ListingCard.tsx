import React, { useState } from 'react';
import Image from 'next/image';
import { Listing } from '@prisma/client';
import NSFWFilter from 'nsfw-filter';

interface ListingCardProps {
  listing: Listing;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedListing: Listing) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedListing, setEditedListing] = useState(listing);
  const [error, setError] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleDelete = () => {
    onDelete(listing.id);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEditedListing(listing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedListing({ ...editedListing, [name]: value });
  };

  const handleUpdate = () => {
    onUpdate(listing.id, editedListing);
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if the image is appropriate
      const isSafe = await NSFWFilter.isSafe(file);
      if (!isSafe) {
        setError('Image is not appropriate');
        return;
      }

      setImageFile(file);
      setEditedListing({ ...editedListing, imageUrl: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="aspect-square w-full relative overflow-hidden rounded-xl">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          layout="responsive"
          width={400}
          height={250}
          objectFit="cover"
          className="object-cover h-full w-full transition ease-in-out hover:scale-110"
        />
      </div>
      <div>
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={editedListing.title}
              onChange={handleInputChange}
              className="border-b border-gray-300 mb-2 w-full"
            />
            <textarea
              name="description"
              value={editedListing.description}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg mb-2 w-full h-24 p-2"
            />
            <input
              type="number"
              name="price"
              value={editedListing.price}
              onChange={handleInputChange}
              className="border-b border-gray-300 mb-2 w-full"
            />
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={toggleEdit}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-black">{listing.title}</h3>
            <p className="text-gray-800">{listing.description}</p>
            <p className="font-semibold text-black">${listing.price}</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={toggleEdit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
