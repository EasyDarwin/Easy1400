import { DELETE, GET, POST, PUT } from './http';

// 获取虚拟组织及子节点
export const getGroupListPage = 'GetGroupListPage';
export async function GetGroupListPage(data: Group.GroupListReq) {
  const { id, ...others } = data
  return await GET<Group.GroupListRes>(`/groups/child/${id}/pages`, others);
}
// 获取虚拟组织及子节点
export const getGroupList = 'GetGroupList';
export async function GetGroupList(id: string) {
  return await GET<Group.GroupItem[]>(`/groups/child/${id}`);
}
// 获取虚拟组织树
export async function GetGroupTree(id: string) {
  return await GET<Group.GroupItem[]>(`/groups/${id}/all`);
}

// 新增/更新虚拟组织
export async function SaveGroup(data: Group.GroupSaveReq) {
  const { id, ...others } = data
  // 更新
  if (id) return await PUT(`/groups/${id}`, others);
  // 新增子节点组织
  if (others.pid) return await POST('/groups', data);
  // 新增根组织
  return await POST('/groups/root', data);
}

// 删除虚拟组织
export async function DeleteGroup(id: string) {
  return await DELETE(`/groups/${id}`);
}

// 获取根组织的虚拟设备信息
export const getGroupDeviceListPage = 'GetGroupDeviceListPage';
export async function GetGroupDeviceListPage(data: Group.GroupDeviceListReq) {
  const { id, ...others } = data
  return await GET<Group.GroupListRes>(`/groups/${id}/devices`, others);
}

// 创建虚拟设备
export async function AddGroupDevice(data: Group.GroupDeviceAddReq) {
  return await POST('/groups/devices', data);
}

// 批量创建虚拟设备
export async function AddGroupDeviceAuto(data: Group.GroupDeviceAddReq) {
  return await POST('/groups/devices/auto', data);
}


// 删除虚拟设备
export async function DeleteGroupDevice(id: string) {
  return await DELETE(`/groups/devices/${id}`);
}

// 获取虚拟组织设备状态
export async function GetGroupDeviceStatus(id: any) {
  return await GET<Group.GroupListRes>(`/groups/${id}/devices/status`);
}

// 更新虚拟组织
export async function SaveGroupDevice(data: Group.GroupDeviceSaveReq) {
  const { id, ...others } = data
  return await PUT(`/groups/devices/${id}`, others);
}