
import * as React from 'react';
import "react-big-calendar/lib/css/react-big-calendar.css";
require('moment/locale/da.js')
import 'moment-timezone';
import MyCalendar from './other/MyCalendar';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { GraphApiTest } from './other/GraphApiTest';

export interface IMeetingRoomBookingProps {
  description: string;
  context: WebPartContext;
}


const MeetingRoomBooking = ({ description, context }: IMeetingRoomBookingProps) => {

  return (
    <div>
      {/* <MyCalendar /> */}
      <GraphApiTest context={context} />
    </div>
  )
}



export default MeetingRoomBooking

