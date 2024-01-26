declare namespace Device {
  type Pager = {
    PageRecordNum: number;
    RecordStartNo: number;
    value?: string;
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
    FunctionType: string | any;
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
    NoAuth:boolean;
    Port: number;
    PositionType: string | any;
    RegisteredAt: string;
    UserId: string;
    CurrentCount: number;
    MaxCount: number;
  };

  type FindImportHistoryReq = {
    page?: number;
    size?: number;
    type?: string;
  };

  type FindImportHistoryRes = {
    items: ImportHistoryItem[];
    total: number;
  };

  type ImportHistoryItem = {
    created_at: string;
    creator: string;
    id: number;
    overview: Overview;
    result: {items:ImportHistoryResult[]};
    type: string;
  };

  type Overview = {
    failure: number;
    success: number;
  };

  type ImportHistoryResult = {
     error: string; line: number ;
  };

  type ImportMessage = {
    total: number;
    current:number;
    success:number;
    failure:number;
    err?:string
  }
}
