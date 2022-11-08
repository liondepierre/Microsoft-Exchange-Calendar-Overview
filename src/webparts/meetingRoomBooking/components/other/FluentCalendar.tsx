import { Calendar, DateRangeType } from '@fluentui/react'
import { DayOfWeek, DefaultButton, PrimaryButton, Stack } from 'office-ui-fabric-react';
import *as React from 'react'
import { NavigateAction, ToolbarProps } from 'react-big-calendar';


export interface IFluentCalendarProps {
  onChangeDate: (d: Date) => void;
  onButtonNavigate: (toolbarBtn: ToolbarProps, n: NavigateAction) => void;
}


export const FluentCalendar = (props: IFluentCalendarProps) => {

  const dateRangeType = DateRangeType.Day;
  const firstDayOfWeek = DayOfWeek.Sunday
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const onSelectDate = (date: Date): void => {
    setSelectedDate(date);
    props.onChangeDate(date)
  }

  const onButtonSelect = (btn: ToolbarProps, btnNavigation: NavigateAction): void => {
    btn.onNavigate(btnNavigation);
    props.onButtonNavigate(btn, btnNavigation);
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
        <PrimaryButton onClick={() => onButtonSelect("PREV") }text='Previous' />
        <DefaultButton onClick={() => onButtonSelect("NEXT")} text='Next' />
      </Stack>
    </div>
  )
}


