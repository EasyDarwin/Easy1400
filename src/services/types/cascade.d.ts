declare namespace Cascade {
  type ListReq = {
    limit?: number;
    page?: number;
  };

  type Pager = {
    MaxNumRecordReturn?: string;
    PageRecordNum: number;
    RecordStartNo: number;
    DeviceID?: string;
  };

  type ListRes = {
    items: Item[];
    total: number;
  };

  type Item = {
    created_at?: string;
    enabled?: boolean;
    id: string;
    ip: string;
    is_online: boolean;
    name: string;
    password: string;
    port: number;
    status: string;
    username: string;
  };

  type AddReq = {
    /**
     * 视图库 ID
     */
    id: string;
    /**
     * 视图库 IP
     */
    ip: string;
    /**
     * 视图库名称
     */
    name: string;
    /**
     * 视图库密码
     */
    password: string;
    /**
     * 视图库端口
     */
    port: number;
    /**
     * 视图库用户名
     */
    username: string;
  };

  type DispositionsListReq = {
    MaxNumRecordReturn: string;
    PageRecordNum: number;
    RecordStartNo: number;
  };
}
