import React, { useState } from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import 'moment/locale/es';

export default function PeriodDateRangePicker({
  startDate,
  endDate,
  onDatesChange,
}) {
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <DateRangePicker
      startDate={startDate} // momentPropTypes.momentObj or null,
      endDate={endDate} // momentPropTypes.momentObj or null,
      startDateId="session_period_start_date" // PropTypes.string.isRequired,
      endDateId="session_period_end_date" // PropTypes.string.isRequired,
      onDatesChange={onDatesChange} // PropTypes.func.isRequired,
      isOutsideRange={() => false} // PropTypes.func.isRequired
      focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
      onFocusChange={setFocusedInput} // PropTypes.func.isRequired,
    />
  );
}
