declare namespace Device {
  type Pager = {
    PageRecordNum: number;
    RecordStartNo: number;
    ApeID?: string;
  };

  type FindReq = {
    APEListObject: APEListObject;
  };

  type APEListObject = {
    APEObject: APEObject[];
    TotalNum: number;
  };

  type APEObject = {
    ApeID: string;
    CapDirection: number;
    FunctionType: string;
    HeartbeatAt: string;
    IPAddr: string;
    IPV6Addr: string;
    IsOnline: string;
    Latitude: number;
    Longitude: number;
    Model: string;
    MonitorAreaDesc: string;
    MonitorDirection: string | any;
    Name: string;
    OrgCode: string;
    OwnerID: string;
    Password: string;
    Place: string;
    PlaceCode: string;
    Port: number;
    PositionType: string | any;
    RegisteredAt: string;
    UserId: string;
  };
}
