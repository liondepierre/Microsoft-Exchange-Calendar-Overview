import { Calendar, Callout, DateRangeType } from '@fluentui/react'
import { DayOfWeek, DefaultButton, Link, PrimaryButton, Stack, Text, TextField } from 'office-ui-fabric-react';
import *as React from 'react'
import { NavigateAction, ToolbarProps } from 'react-big-calendar';


export interface IFluentCalendarProps {
  onChangeDate: (d: Date) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}


export const FluentCalendar = (props: IFluentCalendarProps) => {

  const dateRangeType = DateRangeType.Day;
  const firstDayOfWeek = DayOfWeek.Sunday

  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const onSelectDate = (date: Date): void => {
    setSelectedDate(date);
    props.onChangeDate(date)
  }

  const jumpSevenDaysFunc = () => {
    setSelectedDate(prev => {
      const jumpSevenDays = prev.getTime() + (1000 * 60 * 60 * 24 * 7);

      return new Date(jumpSevenDays);
    });
    props.onNext();
  }

  const jumpBackSevenDaysFunc = () => {
    setSelectedDate(prev => {
      const goBackSevenDays = prev.getTime() - (1000 * 60 * 60 * 24 * 7);

      return new Date(goBackSevenDays);
    });
    props.onPrev();
  }

  const jumpToTodayFunc = () => {
    setSelectedDate(prev => {
      const jumpToToday = new Date();
      return jumpToToday;
    });
    props.onToday();
  }


  return (
    <div>
      <Text>Selected date: {selectedDate?.toLocaleString() || "Not set"}</Text>
      <Calendar
        showGoToToday={false}
        showWeekNumbers
        dateRangeType={dateRangeType}
        highlightSelectedMonth
        onSelectDate={onSelectDate}
        value={selectedDate}
        firstDayOfWeek={firstDayOfWeek}
      />

      <Stack horizontalAlign='space-between' horizontal tokens={{ padding: "7px", childrenGap: "9px" }} className='my-toolbar'>
        <Stack tokens={{ childrenGap: "9px" }} horizontal horizontalAlign='start'>
          <DefaultButton onClick={jumpBackSevenDaysFunc} text='Previous' />
          <DefaultButton onClick={jumpSevenDaysFunc} text='Next' />
        </Stack>
        <Stack horizontal horizontalAlign='end'>
          <Text style={{ cursor: "pointer" }} onClick={jumpToTodayFunc}>Go to today</Text>
        </Stack>
      </Stack>
    </div>
  )
}


