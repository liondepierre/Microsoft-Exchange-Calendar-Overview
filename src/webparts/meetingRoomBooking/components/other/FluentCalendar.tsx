import { Calendar, DateRangeType } from '@fluentui/react'
import { DayOfWeek, DefaultButton, PrimaryButton, Stack } from 'office-ui-fabric-react';
import *as React from 'react'
import { NavigateAction, ToolbarProps } from 'react-big-calendar';


export interface IFluentCalendarProps {
  onChangeDate: (d: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}


export const FluentCalendar = (props: IFluentCalendarProps) => {

  const dateRangeType = DateRangeType.Day;
  const firstDayOfWeek = DayOfWeek.Sunday
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const onSelectDate = (date: Date): void => {
    setSelectedDate(date);
    props.onChangeDate(date)
  }




  return (
    <div>
      <div>Selected date: {selectedDate?.toLocaleString() || "Not set"}</div>
      <Calendar
        showWeekNumbers
        dateRangeType={dateRangeType}
        highlightSelectedMonth
        onSelectDate={onSelectDate}
        value={selectedDate}
        firstDayOfWeek={firstDayOfWeek}
      />
      <Stack style={{ display: "flex", justifyContent: "flex-start" }} horizontal tokens={{ padding: "7px", childrenGap: "9px" }} className='rbc-toolbar'>
        <PrimaryButton onClick={() => props.onPrev() }text='Previous' />
        <DefaultButton onClick={() => props.onNext()} text='Next' />
      </Stack>
    </div>
  )
}


