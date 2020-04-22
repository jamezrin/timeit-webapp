import React from 'react';
import DatePicker from 'react-datepicker/es';

import "react-datepicker/dist/react-datepicker.css";

const FormDatePicker = (props) => {
  return (
    <DatePicker
      type="text"
      className="shadow appearance-none border
                    rounded w-full py-2 px-3 text-gray-700 leading-tight
                    focus:outline-none focus:shadow-outline"
      {...props}
    />
  );
};

export default FormDatePicker;