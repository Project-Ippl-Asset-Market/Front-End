import React from 'react';

const ProductCard = ({ image, title, price, likes, author }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full w-full">
      <img src={image} alt={title} className="w-full h-32 sm:h-40 object-cover" />
      <div className="p-2 sm:p-4 flex flex-col flex-grow">
        <div>
          <h3 className="text-xs sm:text-sm text-gray-500">{author}</h3>
          <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1">{title}</p>
        </div>
        <div className="flex justify-between items-center mt-auto pt-2 sm:pt-4 space-x-1">
          <div className="flex items-center space-x-1">
            <span className="text-red-500 text-base sm:text-lg">❤️</span>
            <span className="text-xs sm:text-sm text-gray-500">({likes})</span>
          </div>
          <span className="text-sm text-gray-900 font-bold truncate">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
