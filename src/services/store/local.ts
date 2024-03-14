export const config = 'LNTON_CONFIG';

export function getConfig(key?: string) {
  const configData = sessionStorage.getItem(config);
  if (key) return configData ? JSON.parse(configData)[key] : null;
  return configData ? JSON.parse(configData) : null;
}

export function setConfig(data: any) {
  sessionStorage.setItem(config, JSON.stringify(data));
}
