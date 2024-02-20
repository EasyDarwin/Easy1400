import { DELETE, GET, POST, PUT } from './http';

// findDictTypes 查询字典类型列表
export async function FindDictTypes(page: number, size: number, name: string) {
  return await GET<Dict.FindTypeResp>(`/dicts/types`, {
    page,
    size,
    name,
  });
}

// findDictDatas 查询字典列表
export const findDictTypes = 'findDictTypes';
export async function FindDictDatas(code: string) {
  return await GET<Dict.FindDatasResp>(`/dicts/datas`, {
    code,
  });
}

//添加字典类型
export async function AddDictType(data: Dict.AddType) {
  return await POST<Dict.AddTypeResp>(`/dicts/types`, data);
}

//编辑字典类型
export async function EditDictTypeData(id: string, name: string) {
  return await PUT<Dict.EditDictTypeDataResp>(`/dicts/types/${id}`, { name });
}

// delDictType 删除字典类型
export async function DelDictType(id: string) {
  return await DELETE<any>(`/dicts/types/${id}`);
}

// addDictDatas 添加字典
export async function AddDictData(data: Dict.AddData) {
  return await POST<Dict.AddDataResp>('/dicts/datas', data);
}

// editDictData 修改字典
export async function EditDictData(id: string, data: Dict.AddData) {
  return await PUT<Dict.AddDataResp>(`/dicts/datas/${id}`, data);
}

// delDictData 删除字典
export async function DelDictData(id: string) {
  return await DELETE<any>(`/dicts/datas/${id}`);
}
