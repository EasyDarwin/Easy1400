declare namespace Cascade {
  type ListReq = {
    size?: number;
    page?: number;
    name?:string;
    status?:string;
    value?:string;
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
    device_ids: string[];
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

    // 标记
    isEdit?: boolean;
  };

  type DispositionsListReq = {
    PageRecordNum?: number;
    RecordStartNo?: number;
    up_id?: string;
  };

  type DispositionsListRes = {
    SubscribeObject: SubscribeObject[];
    TotalNum: number;
  };

  type SubscribeObject = {
    id?: string;
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
  };

  type NotifyItem = {
    CreatedAt: string;
    id: number;
    info_ids: string;
    notification_id: string;
    object_id: string;
    result: string;
    subscribe_id: string;
    trigger_time: string;
    try_count: number;
    up_id: string;
  };
  type NotificationListReq = {
    PageRecordNum: number;
    RecordStartNo: number;
    up_id?: string;
    // device_id: string;
    // device_name: string;
    info_ids: string;
    value: string;
    timeRange?: Array;
    start_at?: integer;
    end_at?: integer;
  }

  /** ########## 向下级联 ##########  */
  type DownListRes = {
    items: DownItem[];
    total: number;
  };

  type DownItem = {
    created_at?: string;
    description?: string;
    heartbeat_at?: string;
    id: string;
    is_online?: boolean;
    name: string;
    password: string;
    realm?: string;
    register_at?: string;
    remote_ip?: string;
    remote_port: number;
    update_at?: string;
    user_name: string;
    cascade_ids?: string[];
  };

  type DownReq = {
    description?: string;
    name: string;
    /**
     * 如果密码为空设置为平台默认密码
     */
    password: string;
    /**
     * 第11~13位必须为503或120,长度为20
     */
    platform_id: string;
    realm?: string;
    remote_port: number;
    /**
     * 用于 认证的用户名
     */
    user_name: string;
  };

  type DownSubscribesListRes = {
    items: DownSubscribesListItem[];
    total: number;
  };

  type DownSubscribesListItem = {
    CreatedAt?: string;
    Ext?: DownSubscribesExt;
    FormID?: string;
    id: string;
    IsUP?: boolean;
    result?: string;
    try_count?: number;
    UpID?: string;
  };

  type DownSubscribesExt = {
    ApplicantName: string;
    ApplicantOrg: string;
    BeginTime: string;
    CancelReason: string;
    CancelTime: string;
    EndTime: string;
    OperateType: number;
    Reason: string;
    ReceiveAddr: string;
    ReportInterval: number;
    ResourceURI: string;
    SubscribeCancelOrg: string;
    SubscribeCancelPerson: string;
    SubscribeDetail: string;
    SubscribeID: string;
    SubscribeStatus: number;
    Title: string;
  };

  type DownSubscribesReq = {
    ApplicantName: string;
    ApplicantOrg: string;
    BeginTime: string;
    /**
     * 只在取消订阅时使用;
     */
    CancelReason: string;
    /**
     * 只在取消订阅时使用;
     */
    CancelTime: string;
    EndTime: string;
    /**
     * {0:订阅;1:取消订阅}；
     */
    OperateType: number;
    Reason: string;
    ReceiveAddr: string;
    ReportInterval: number;
    ResourceURI: string;
    /**
     * 只在取消订阅时使用;
     */
    SubscribeCancelOrg: string;
    /**
     * 只在取消订阅时使用;
     */
    SubscribeCancelPerson: string;
    SubscribeDetail: string;
    SubscribeID: string;
    SubscribeStatus: number;
    Title: string;
  };

  type DownDispositionsRes = {
    items: DownDispositionItem[];
    total: number;
  };

  type DownDispositionItem = {
    CreatedAt?: string;
    Ext?: DownDispositionExt;
    FormID?: string;
    ID?: string;
    IsUP?: boolean;
    Path?: string;
    result?: string;
    try_count?: number;
  };

  type DownDispositionExt = {
    ApplicantInfo: string;
    ApplicantName: string;
    ApplicantOrg: string;
    BeginTime: string;
    DispositionArea: string;
    DispositionCategory: string;
    DispositionID: string;
    DispositionRange: string;
    DispositionRemoveOrg: string;
    DispositionRemovePerson: string;
    DispositionRemoveReason: string;
    DispositionRemoveTime: string;
    DispositionStatus: number;
    EndTime: string;
    OperateType: number;
    PriorityLevel: number;
    Reason: string;
    ReceiveAddr: string;
    ReceiveMobile: string;
    SubImageList: SubImageList;
    TargetFeature: string;
    TargetImageURI: string;
    Title: string;
    TollgateList: string;
  };

  type SubImageList = {
    SubImageInfoObject: null;
  };

  type DownDispositionsReq = {
    /**
     * 子平台的ID
     */
    code: string;
    /**
     * 订阅信息
     */
    DispositionObject: DispositionObject;
  };

  type DispositionObject = {
    ApplicantInfo: string;
    ApplicantName: string;
    ApplicantOrg: string;
    BeginTime: string;
    DispositionArea: string;
    DispositionCategory: string;
    DispositionID: string;
    DispositionRange: string;
    DispositionRemoveOrg: string;
    DispositionRemovePerson: string;
    DispositionRemoveReason: string;
    DispositionRemoveTime: string;
    DispositionStatus: number;
    EndTime: string;
    OperateType: number;
    PriorityLevel: number;
    Reason: string;
    ReceiveAddr: string;
    ReceiveMobile: string;
    TargetFeature: string;
    TargetImageURI: string;
    Title: string;
    TollgateList: string;
  };

  type FindNotificationReq = {
    page?: number;
    size?: number;
    subscribe_id?: string;
  }
  type DownwardNotificationRes = {
    items:DownwardNotificationItem[];
    total:number;
  }

  type DownwardNotificationItem = {
    CreatedAt:string;
    FormID?:string;
    id:string;
    Path:string;
    SubscribeID:string;
  }

  type DownwardDeviceCheckReq = {
    value?: string;
    MaxNumRecordReturn?: number;
    PageRecordNum?: number;
    RecordStartNo?: number;
    id:string;
  }

  // 设备共享
  type DeviceShareReq = {
    platform: string;
    devices: React.Key[];
    person: boolean;
    face: boolean;
    motor_vehicle: boolean;
    non_motor_vehicle: boolean;
  }
  type DeviceShareItem = {
    ID: string;
    PlatformID: string;
    APEID: string;
    Name: string;
    Person: boolean;
    Face: boolean;
    MotorVehicle: boolean;
    NonMotorVehicle: boolean;
  }
}
