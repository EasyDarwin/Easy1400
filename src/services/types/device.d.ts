declare namespace Device {
  type ListReq = {
    /**
     * 设备 id 搜索
     */
    device_id?: string;
    page?: number;
    size?: number;
  };

  type ListRes = {
    items: Item[];
    total: number;
  };

  type Item = {
    heartbeat_at?: string;
    id?: string;
    is_online?: boolean;
    password?: string;
    register_at?: string;
    [property: string]: any;
  };

  type AddReq = {
    /**
     * 设备唯一标识
     */
    id: string;
    /**
     * 设备名
     */
    name: string;
    /**
     * 密码
     */
    password: string;
    /**
     * 用户名，非必填，建议为空
     */
    username?: string;
  };
}
