import React from 'react';

export default function Benefit({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="bg-indigo-100 text-indigo-600 rounded-full p-4 mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}