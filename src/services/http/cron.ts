import { DELETE, GET, POST } from './http';

//获取设备列表
export const findCrontab = 'FindCrontab';
export async function FindCrontab() {
  return await GET<Cron.FindResponse>('/ext/crontab');
}

//立即执行
export async function EditExecCrontab(key:string) {
  return await POST<{key:string}>(`/ext/crontab/${key}/exec`);
}

//停止任务
export async function EditStopCrontab(key:string) {
  return await DELETE<{key:string}>(`/ext/crontab/${key}`);
}

//启动任务
export async function EditStartCrontab(key:string) {
  return await POST<{key:string}>(`/ext/crontab/${key}`);
}

//重载定时任务
export async function EditReloadCrontab() {
  return await POST(`/ext/crontab/reload`);
}