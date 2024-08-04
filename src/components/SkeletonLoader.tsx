import React from 'react';


const SkeletonLoader = () => {
  return (
    <>
      {/* Navbar Skeleton */}
      <div className="sticky top-0 bg-white border-b-2 h-20 border-gray-110 z-50 animate-pulse">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gray-200 h-5 w-36"></div>
          </div>
          <div className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm animate-pulse">
            <div className="flex flex-row items-center justify-between">
              <div className="bg-gray-200 h-5 w-20 mx-6"></div>
              <div className="hidden sm:block bg-gray-200 h-5 w-24 mx-6 border-x-[1px] flex-1 text-center"></div>
              <div className="flex flex-row items-center gap-3">
                <div className="hidden sm:block bg-gray-200 h-5 w-20"></div>
                <div className="bg-gray-200 h-7 w-7 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-5">
            <div className="hidden md:block bg-gray-200 h-5 w-40 py-3 rounded-full ml-10"></div>
            <div className="relative">
              <div className="bg-gray-200 w-10 h-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-6 animate-pulse">
            <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-gray-200"></div>
            <div className="mt-4 space-y-2">
              <div className="bg-gray-200 h-5 w-3/4"></div>
              <div className="bg-gray-200 h-5 w-1/2"></div>
              <div className="bg-gray-200 h-5 w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SkeletonLoader;
