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
    PageRecordNum: number;
    RecordStartNo: number;
    up_id?: string;
  };

  type DispositionsListRes = {
    SubscribeObject: SubscribeObject[];
    TotalNum: number;
  };

  type SubscribeObject = {
    ApplicantName?: string;
    ApplicantOrg?: string;
    BeginTime?: string;
    CancelReason?: string;
    CancelTime?: string;
    EndTime?: string;
    OperateType?: number;
    Reason?: string;
    ReceiveAddr?: string;
    ReportInterval?: number;
    ResourceURI?: string;
    SubscribeCancelOrg?: string;
    SubscribeCancelPerson?: string;
    SubscribeDetail?: string;
    SubscribeID: string;
    SubscribeStatus?: number;
    Title?: string;
  };


  //通知
  type NotifyListRes = { 
      items: NotifyItem[];
      total: number;
  }

  type NotifyItem = {
    ext: Ext;
    id: string;
    info_ids: string;
    result: string;
    subscribe_id: string;
    trigger_time: string;
    try_count: number;
    up_id: string;
}

type Ext = {
  ExecuteOperation: number;
  FaceObjectList?: Gallery.FindRes;
  InfoIDs: string;
  MotorVehicleObjectList: Gallery.MotorVehicleRes;
  NotificationID: string;
  PersonObjectList?: Gallery.PersonRes;
  SubscribeID: string;
  Title: string;
  TriggerTime: string;
}

}
