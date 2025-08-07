
import React from 'react';

const Spinner = ({ text }) => {
  return (
    <div className="flex flex-col justify-center items-center py-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      {text && <p className="mt-4 text-lg text-gray-600">{text}</p>}
    </div>
  );
};

export default Spinner;
