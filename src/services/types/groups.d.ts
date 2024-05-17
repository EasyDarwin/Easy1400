declare namespace Group {
  // 子虚拟组织项
  type GroupItem = {
    id: string;
    created_at?: string;
    updated_at?: string;
    code?: string;
    pid?: integer;
    level?: integer;
    name?: string;
    is_expanded?: boolean;
    is_leaf?: boolean;
    [property: string]: any;
  }
  // 子虚拟组织列表
  type GroupListReq = {
    id:? string;
    name?: string;
    page: number;
    size: number;
  }
  type GroupListRes = {
    items: GroupItem[];
    total: number;
  }

  // 新增/更新虚拟组织
  type GroupSaveReq = {
    name: string;
    id?: string;
    code?: string;
    pid?: integer;
  }

  // 虚拟设备新增
  type GroupDeviceAddReq = {
    [property: string]: any;
    device_id?: string;
    device_ids?: string[];
    industry_code?: string; // 行业编码
    network_code?: string; // 网络标识
    type_code?: string; // 类型编码，后端暂定”119“
    virtual_group_id: number;
    virtual_device_id: string;
    virtual_group_id: integer;
    parent_id: integer;
  }
  // 虚拟设备更新
  type GroupDeviceSaveReq = {
    id: any;
    parent_id: any;
    virtual_ape_id: any;
  }
  // 根组织的虚拟设备查询
  type GroupDeviceListReq = {
    id: string;
    name?: string;
    page: number;
    size: number;
  } 
  // 根组织的虚拟设备项
  type GroupDeviceItem = {
    id?: string;
    ape_id?: string;
    is_online?: string;
    name?: string;
    parent_id?: number;
    virtual_ape_id?: string;
    virtual_group_id?: number;
    [property: string]: any;
  }
  // 根组织的虚拟设备列表
  type GroupDeviceRes = {
    items: GroupDeviceItem[];
    total: number;
  }

  // 子节点的设备信息
  type GroupParentDeviceListRes = []
}