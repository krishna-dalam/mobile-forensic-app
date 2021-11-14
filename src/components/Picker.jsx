import React, { useState } from "react";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment";
import { FormLabel } from "react-bootstrap";

export default function Picker({ label, onDateChange, selectedDate }) {
  const onPickerDateChange = (date) => {
    onDateChange(date, label);
  };
  return (
    <div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDateTimePicker
          id="time-picker"
          value={selectedDate}
          onChange={onPickerDateChange}
        />
      </MuiPickersUtilsProvider>
    </div>
  );
}
