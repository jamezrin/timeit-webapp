import React from 'react';

export default function FormLabel(props) {
  return (
    <label
      className="block text-gray-700 
                text-sm font-bold mb-2"
      {...props}
    >
      {props.children}
    </label>
  );
}
