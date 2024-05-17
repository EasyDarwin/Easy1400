import { DELETE, GET } from './http';

//人脸查询
export const findFace = 'face';
export async function FindFace(data: Gallery.Pager) {
  return await GET<Gallery.FindRes>(`/VIID/Faces`, data);
}

//人脸批量删除
export async function DelFaces(data: string) {
  return await DELETE<Gallery.FaceDeleteRes>(`/VIID/Faces?IDList=${data}`);
}

//人脸单个删除
export async function DelFace(data: string) {
  return await DELETE(`/VIID/Faces/${data}`);
}

//人员查询
export const findPersons = 'person';
export async function FindPersons(data: Gallery.Pager) {
  return await GET<Gallery.PersonRes>(`/VIID/Persons`, data);
}
//人员批量删除
export async function DelPersons(data: string) {
  return await DELETE(`/VIID/Persons?IDList=${data}`);
}

//人员单个删除
export async function DelPerson(data: string) {
  return await DELETE(`/VIID/Persons/${data}`);
}

//机动车查询
export const findMotorVehicles = 'motorVehicle';
export async function FindMotorVehicles(data: Gallery.Pager) {
  return await GET<Gallery.MotorVehicleRes>(`/VIID/MotorVehicles`, data);
}

//机动车批量删除
export async function DelMotorVehicles(data: string) {
  return await DELETE(`/VIID/MotorVehicles?IDList=${data}`);
}

//机动车单个删除
export async function DelMotorVehicle(data: string) {
  return await DELETE(`/VIID/MotorVehicles/${data}`);
}

//非机动车查询
export const findNonMotorVehicles = 'nonMotorVehicle';
export async function FindNonMotorVehicles(data: Gallery.Pager) {
  return await GET<Gallery.NonMotorVehicleRes>(`/VIID/NonMotorVehicles`, data);
}

//非动车批量删除
export async function DelNonMotorVehicles(data: string) {
  return await DELETE(`/VIID/NonMotorVehicles?IDList=${data}`);
}

//非机动车单个删除
export async function DelNonMotorVehicle(data: string) {
  return await DELETE(`/VIID/NonMotorVehicles/${data}`);
}

//图库请求 为了通知详情暂时封装
export async function findGalleryData(data:{url:string;id:string}){
  return await GET(`${data.url}`,{
    PageRecordNum: 1,
    RecordStartNo: 1,
    id:data.id
  })
} 