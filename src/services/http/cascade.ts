import { DELETE, GET, POST, PUT } from './http';

//级联列表
export const getCascades = 'GetCascades';
export async function FindCascadeLists(data: Cascade.ListReq) {
  return await GET('/cascades', data);
}

// 添加级联 / 更新级联
export async function SaveCascade(data: Cascade.AddReq) {
  const { id, isEdit, ...others } = data
  if (isEdit) {
    return await PUT(`/cascades/${id}`, others);
  }
  return await POST(`/cascades`, data);
}


//删除级联
export async function DelCascade(id: string) {
  return await DELETE(`/cascades/${id}`);
}

//选择设备
export async function EditSelectDevice(data: {
  id: string;
  device_ids: string[];
}) {
  return await PUT(`/cascades/${data.id}/devices`, {
    device_ids: data.device_ids,
  });
}

// 向上共享
export async function EditSelectPlatforms(data: {
  id: string;
  cascade_ids: string[];
}) {
  return await PUT(`/platforms/${data.id}/restrict`, {
    cascade_ids: data.cascade_ids,
  });
}

// 查询对上级的限制
export const findCascadeShare = 'FindCascadeShare';
export async function FindCascadeShare(id: string) {
  return await GET(`/cascades/${id}/share`);
}
// 限制设备和类型
export async function SaveCascadeShare(data: Cascade.DeviceShareReq) {
  // const { platform, ...others } = data
  return await POST(`/cascades/${data.platform}/share`, data);
}
// 删除对上级的限制
export async function DeleteCascadeShare(ids: string) {
  return await DELETE('/cascades/share/', { id: ids });
}

//>>>>> 布控  <<<<<
export const findDispositions = 'FindDispositions';
export async function FindDispositions(data: Cascade.DispositionsListReq) {
  return await GET(`/VIID/Dispositions`, data);
}

//>>>>>> 订阅  <<<<<
export const findSubscribes = 'FindSubscribes';
export async function FindSubscribes(data: Cascade.DispositionsListReq) {
  return await GET(`/VIID/Subscribes`, data);
}

//删除订阅
export async function DelSubscribes(data: string) {
  return await DELETE(`/VIID/Subscribes/${data}`);
}

//>>>>>> 通知  <<<<<
export const findNotifies = 'FindNotifies';
export async function FindNotifies(data: Cascade.NotificationListReq) {
  return await GET<Cascade.NotifyListRes>(`/notifications`, data);
}

/** ########## 向下级联 ##########  */
export const findDownwardCascade = 'FindDownwardCascade';
export async function FindDownwardCascade(data: Cascade.ListReq) {
  return await GET<Cascade.DownListRes>(`/platforms`, data);
}

//创建下级视图库
export async function AddDownwardCascade(data: Cascade.DownReq) {
  return await POST(`/platforms`, data);
}

//编辑下级视图库
export async function EditDownwardCascade(data: {
  id: string;
  data: Cascade.DownReq;
}) {
  return await PUT(`/platforms/${data.id}`, data.data);
}

//删除下级视图库
export async function DelDownwardCascade(id: string) {
  return await DELETE(`/platforms/${id}`);
}

//>>>>>> 订阅  <<<<<
export const findDownwardSubscribes = 'FindDownwardSubscribes';
export async function FindDownwardSubscribes(
  data: Cascade.ListReq & { id: string },
) {
  return await GET<Cascade.DownSubscribesListRes>(
    `/platforms/${data.id}/subscribes`,
    { page: data.page, size: data.size },
  );
}

//创建下级订阅
export async function AddDownwardSubscribes(data: {
  id: string;
  data: Cascade.DownSubscribesReq;
}) {
  return await POST(`/platforms/${data.id}/subscribes`, data.data);
}

//删除订阅
export async function DelDownwardSubscribes(id: string) {
  return await DELETE(`/platforms/subscribes/${id}`);
}

//>>>>>> 布控  <<<<<
export const findDownwardDispoitions = 'FindDownwardDispositions';
export async function FindDownwardDispositions(
  data: Cascade.ListReq & { code: string },
) {
  return await GET<Cascade.DownDispositionsRes>(`/dispositions`, data);
}

//创建布控
export async function AddDownwardDispositions(
  data: Cascade.DownDispositionsReq,
) {
  return await POST(`/dispositions`, data);
}

//>>>>>> 通知  <<<<<
export const findDownwardNotification = 'FindDownwardDispositions';
export async function FindDownwardNotification(
  data: Cascade.FindNotificationReq,
) {
  return await GET(`/subscribes/${data.subscribe_id}/notifications`, {
    page: data.page,
    size: data.size,
  });
}

//删除通知
export async function DelDownwardNotification(id: string) {
  return await DELETE(`/subscribes/notifications/${id}`);
}

//获取下级通知详情
export async function FindDownwardNotificationJson(url:string) {
  return await GET(`${url}`);
}

//查询下级设备信息
export async function FindDownwardDeviceCheck(data:Cascade.DownwardDeviceCheckReq){
  return await GET<Device.FindReq>(`/platforms/${data.id}/devices`,{PageRecordNum:data.PageRecordNum,RecordStartNo:data.RecordStartNo,value:data.value});
}

// 同步下级设备状态给上级
export async function FindDownwardDeviceSyncCheck(id: any) {
  return await GET(`/platforms/${id}/sync/devices`)
}
