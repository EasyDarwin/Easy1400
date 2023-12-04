declare namespace Model {
    type Error = {
      reason: string;
      msg: string;
      details?: any;
    };
  
    type Device = {
      id: string;
      name: string;
      status: string;
      type: string;
    };
  
    type DeviceListResp = {
      items: Device[];
      total: number;
    };
    type DeviceResult = {
      id: string;
    };
    type DeviceChangeResp = {
      password: string;
      code: string;
      created_at: string;
      id: number;
      ip: string;
      name: string;
      port: number;
      protocol: string;
      remark: string;
      status: string;
      transport: string;
      updated_at: string;
      username: string;
    };
  
    type LoginResp = {
      token: string;
    };
  }
  