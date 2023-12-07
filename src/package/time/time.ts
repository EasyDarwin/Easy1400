import moment from 'moment';

/**
 * 将时间20231213120713 转成 2023-12-13 12:07:13
 * @param time 20231213120713
 */
export function timeToFormatTime(time: string) {
  if(!time) return ''
  return moment(time, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
}
