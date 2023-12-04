import { POST,GET, DELETE } from './http';

//获取设备列表
export const getDeviceList = 'GetDeviceList'
export async function GetDeviceList (data:Device.ListReq){
    return await GET('/devices',data)
}

//添加设备
export async function AddDevice(data:Device.AddReq) {
    return await POST('/devices', data)
}

//删除设备
export async function DeleteDevice(id:string) {
    return await DELETE(`/devices/${id}`)
}