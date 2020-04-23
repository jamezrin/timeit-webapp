import React from 'react';

const FormInput = React.forwardRef((props, ref) => {
  return (
    <input
      type="text"
      ref={ref}
      className="shadow appearance-none border 
                rounded w-full py-2 px-3 text-gray-700 leading-tight 
                focus:outline-none focus:shadow-outline"
      {...props}
    />
  );
});

export default FormInput;