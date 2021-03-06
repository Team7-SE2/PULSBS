import React from 'react'
//import Form from "react-bootstrap/Form";
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker
} from '@material-ui/pickers';
var moment = require("moment");

const TimePickerComponent = (props) => {

  let { initialValue, setStateDate } = props;

  let date = initialValue ? moment(initialValue) : moment();

  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(date);

  const handleDateChange = (d) => {
    setSelectedDate(d);
    setStateDate(d);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
      <KeyboardTimePicker
          margin="normal"
          id="time-picker"
          /*label= {label}*/
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

export default TimePickerComponent;