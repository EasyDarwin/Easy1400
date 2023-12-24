import { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import moment from 'moment';

/**
 * 将时间20231213120713 转成 2023-12-13 12:07:13
 * @param time 20231213120713
 */
export function timeToFormatTime(time: string) {
  if(!time) return ''
  return moment(time, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
}


/**
 * 将时间选择器的数据 转成 秒级 时间戳
 * @param {value: DatePickerProps['value'] | RangePickerProps['value']} value 时间选择器的值
 * @returns {start:number,end:number} {start: ....,end: .....}
 */
export function datePickerToTimestamp(value: DatePickerProps['value'] | RangePickerProps['value']) {
  if (Array.isArray(value) && value.length === 2) {
    const [start,end] = value
    const formattedStart = Math.floor(dayjs(start).valueOf() / 1000);
    const formattedEnd = Math.floor(dayjs(end).valueOf() / 1000);
    if (dayjs(formattedStart).isValid() && dayjs(formattedEnd).isValid()) {
      return {start: formattedStart, end: formattedEnd}
    }
  }
}