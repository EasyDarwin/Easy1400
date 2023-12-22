import { POST,GET, DELETE, PUT } from './http';

//级联列表
export const getCascades = 'GetCascades'
export async function FindCascadeLists(data:Cascade.ListReq) {
    return await GET('/cascades',data)
}

//添加级联
export async function AddCascade(data:Cascade.AddReq) {
    return await POST(`/cascades`,data)
}

//删除级联
export async function DelCascade(id:string) {
    return await DELETE(`/cascades/${id}`)
}

//选择设备
export async function EditSelectDevice(data:{id:string;device_ids:string[]}) {
    console.log(data);
    
    return await PUT(`/cascades/${data.id}/devices`,{device_ids:data.device_ids})
}

//>>>>> 布控  <<<<<
export const findDispositions = 'FindDispositions'
export async function FindDispositions(data:Cascade.DispositionsListReq) {
    return await GET(`/VIID/Dispositions`,data)
}


//>>>>>> 订阅  <<<<<
export const findSubscribes = 'FindSubscribes'
export async function FindSubscribes(data:Cascade.DispositionsListReq) {
    return await GET(`/VIID/Subscribes`,data)
}

//删除订阅


//>>>>>> 通知  <<<<<
export const findNotifies = 'FindNotifies'
export async function FindNotifies(data:Cascade.DispositionsListReq) {
    return await GET<Cascade.NotifyListRes>(`/notifications`,data)
}