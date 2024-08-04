"use client";
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const Host = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(48);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !price || !imageFile) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('imageFile', imageFile);
    formData.append('userId', session?.user?.id as string);
    formData.append('listerName', session?.user?.name as string);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully:', data.imageUrl);
        const listingResponse = await fetch('/api/auth/host', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            price,
            imageUrl: data.imageUrl,
            userId: session?.user?.id,
            listerName: session?.user?.name,
          }),
        });

        if (listingResponse.ok) {
          router.push('/');
        } else {
          const listingData = await listingResponse.json();
          setError(listingData.error || 'Failed to create listing');
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload image');
      }
    } catch (error) {
      setError('Error creating listing');
      console.error('Failed to create listing:', error);
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <button
          onClick={() => signIn()}
          className="bg-red-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
        >
          Sign in to host a room
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Host a Room</h1>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-red-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {!title && error && (
          <p className="text-red-500 text-sm mb-4">Title is required</p>
        )}
        <textarea
          placeholder="Description"
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-red-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {!description && error && (
          <p className="text-red-500 text-sm mb-4">Description is required</p>
        )}
        <div className="w-full mb-4">
          <label className="block text-gray-700 mb-2">Price</label>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">JD {price}</span>
            <input
              type="range"
              min={48}
              max={1459}
              value={price}
              className="w-full"
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>
        {!price && error && (
          <p className="text-red-500 text-sm mb-4">Price is required</p>
        )}
        <div className="w-full mb-4">
          <label className="block text-gray-700 mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        {!imageFile && error && (
          <p className="text-red-500 text-sm mb-4">Image is required</p>
        )}
        <button
          onClick={handleSubmit}
          className="bg-red-500 text-white py-2 px-8 rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
        >
          Submit
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Host;
