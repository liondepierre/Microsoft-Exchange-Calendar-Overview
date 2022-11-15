
import * as React from 'react';
require('moment/locale/da.js')
import 'moment-timezone';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { MyCalendar } from './other/MyCalendar';

export interface IMeetingRoomBookingProps {
  description: string;
  context: WebPartContext;
}


const MeetingRoomBooking = ({ description, context }: IMeetingRoomBookingProps) => {

  return (
    <div>
      <MyCalendar context={context}/>
    </div>
  )
}



export default MeetingRoomBooking

