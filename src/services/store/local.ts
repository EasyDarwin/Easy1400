export const config = 'LNTON_CONFIG';

export function getConfig(key?: string) {
  const configData = sessionStorage.getItem(config);
  if (key) return configData ? JSON.parse(configData)[key] : null;
  return configData ? JSON.parse(configData) : null;
}

export function setConfig(data: any) {
  sessionStorage.setItem(config, JSON.stringify(data));
}

// 字典缓存
export function setAttrConfig(key: any, list: any[]) {
  let data = sessionStorage.getItem('ATTR_DATA') || '{}' as any;
  data = JSON.parse(data)
  sessionStorage.setItem('ATTR_DATA', JSON.stringify({ ...data, [key]: list }));
}
export function getAttrConfig(key: any) {
  let data = sessionStorage.getItem('ATTR_DATA') || '{}';
  data = JSON.parse(data)
  return data[key]
}