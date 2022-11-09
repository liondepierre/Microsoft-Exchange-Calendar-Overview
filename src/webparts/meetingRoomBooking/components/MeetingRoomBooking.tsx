
import * as React from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
require('moment/locale/da.js')
import 'moment-timezone';
import MyCalendar from './other/MyCalendar';

export interface IMeetingRoomBookingProps {
  description: string;
}


const MeetingRoomBooking = ({ description }: IMeetingRoomBookingProps) => {

  return (
    <div>
      <MyCalendar />
    </div>
  )
}



export default MeetingRoomBooking

