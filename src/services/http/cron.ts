import { GET } from './http';

//获取设备列表
export const findCrontab = 'FindCrontab';

export async function FindCrontab() {
  return await GET<Cron.FindResponse>('/ext/crontab');
}
