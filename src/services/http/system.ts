import { GET, PUT } from './http';

//获取过期时间信息
export const findConfigs = 'FindConfigs';
export async function FindConfigs() {
  return await GET<System.EditConfigsReq>(`/system/configs`);
}

//设置过期配置
export async function EditConfigs(data: System.EditConfigsReq) {
  return await PUT(`/system/configs`, data);
}

//系统信息
export const findSystemInfo = 'FindSystemInfo';
export async function FindSystemInfo() {
  return await GET<System.SystemInfo>(`/system/infos`);
}

//采集数据统计
export async function FindStatistics(data:any) {
  return await GET<System.Statistics>(`/system/statistics`,data);
}

//设备及平台链接数据查询
export const findLinkData = 'FindLinkData';
export async function FindLinkData() {
  return await GET<System.LinkData>(`/system/links/status`);
}