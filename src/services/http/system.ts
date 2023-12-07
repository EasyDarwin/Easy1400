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
