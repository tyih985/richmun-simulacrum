import { DateFormatter, DateInput, DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';

const formatter: DateFormatter = ({ type, date, locale, format }) => {
  if (type === 'range' && Array.isArray(date)) {
    if (date[0] === null || date[1] === null) {
      return '';
    }

    if (
      dayjs(date[0]).locale(locale).format(format) ===
      dayjs(date[1]).locale(locale).format(format)
    ) {
      return `${dayjs(date[0]).locale(locale).format(format)}`;
    }

    if (date.length > 1) {
      return `${dayjs(date[0]).locale(locale).format(format)} - ${dayjs(date[1]).locale(locale).format(format)}`;
    }

    return '';
  }

  return '';
};

type DateInputProps = {
  label?: string;
  placeholder?: string;
  value?: [Date | null, Date | null];
  onChange?: (value: [Date | null, Date | null]) => void;
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

export const DateInputComponent = (props: DateInputProps) => {
  return (
    <DatePickerInput
      type="range"
      minDate={dayjs().toDate()}
      label="What date(s) will your event take place?"
      placeholder="Pick a date range"
      value={props.value}
      onChange={(value) => props.onChange?.(value as [Date | null, Date | null])} 
      radius="lg"
      leftSection={<IconCalendar size={20} />}
      valueFormatter={formatter}
      required
      allowSingleDateInRange
      clearable
    />
  );
};

export const DateInputComponentNonRequired = (props: DateInputProps) => {
  return (
    <DatePickerInput
      type="range"
      minDate={dayjs().toDate()}
      label="What date(s) will your event take place?"
      placeholder="Pick a date range"
      value={props.value}
      // valueFormat="date"
      onChange={(value) => props.onChange?.(value as [Date | null, Date | null])} 
      leftSection={<IconCalendar size={20} />}
      valueFormatter={formatter}
      allowSingleDateInRange
      clearable
    />
  );
};
