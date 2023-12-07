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
    ext: Ext;
    id: string;
    name: string;
    password: string;
    username: string;
  };

  type Ext = {
    area: string;
    direction: string;
    ipv4: string;
    ipv6: string;
    latitude: number;
    longitude: number;
    model: string;
    organize: string;
    owner_id: string;
    place: string;
    place_code: string;
    port: number;
  };
}
