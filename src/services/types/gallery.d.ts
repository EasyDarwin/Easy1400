declare namespace Gallery {
  type Pager = {
    MaxNumRecordReturn?: string;
    PageRecordNum: number;
    RecordStartNo: number;
    DeviceID: string;
    start_at?:number;
    end_at?:number;
  };

  type FindRes = {
    FaceListObject: FaceListObject;
  };

  type FaceListObject = {
    FaceObject: FaceObject[];
    TotalNum: number;
  };

  type FaceObject = {
    AccompanyNumber: number;
    AcneStain: string;
    AgeLowerLimit: number;
    AgeUpLimit: number;
    Alias: string;
    Attitude: number;
    BodySpeciallMark: string;
    CapColor: string;
    CapStyle: string;
    ChineseAccentCode: string;
    CorpseConditionCode: string;
    CrimeCharacterCode: string;
    CrimeMethod: string;
    CriminalInvolvedSpecilisationCode: string;
    DetaineesIdentity: string;
    DetaineesSpecialIdentity: string;
    DetentionHouseCode: string;
    DeviceID: string;
    EscapedCriminalNumber: string;
    EthicCode: string;
    EyebrowStyle: string;
    FaceAppearTime: string;
    FaceDisAppearTime: string;
    FaceID: string;
    FaceStyle: string;
    FacialFeature: string;
    FreckleBirthmark: string;
    GenderCode: string;
    GlassColor: string;
    GlassStyle: string;
    HairColor: string;
    HairStyle: string;
    IDNumber: string;
    IDType: string;
    ImmigrantTypeCode: string;
    InfoKind: number;
    InjuredDegree: string;
    IsCriminalInvolved: number;
    IsDetainees: number;
    IsDriver: number;
    IsForeigner: number;
    IsSuspectedTerrorist: number;
    IsSuspiciousPerson: number;
    IsVictim: number;
    JobCategory: string;
    LeftTopX: number;
    LeftTopY: number;
    LipStyle: string;
    LocationMarkTime: string;
    MemberTypeCode: string;
    MustacheStyle: string;
    Name: string;
    NationalityCode: string;
    NativeCityCode: string;
    NoseStyle: string;
    OtherFeature: string;
    PassportType: string;
    PhysicalFeature: string;
    ResidenceAdminDivision: string;
    RespiratorColor: string;
    RightBtmX: number;
    RightBtmY: number;
    ScarDimple: string;
    Similaritydegree: number;
    SkinColor: string;
    SourceID: string;
    SubImageList: SubImageList;
    SuspectedTerroristNumber: string;
    UsedName: string;
    VictimType: string;
    WrinklePouch: string;
  };
  type SubImageList = {
    SubImageInfoObject: SubImageInfoObject[];
  };

  type SubImageInfoObject = {
    Data: string;
    DeviceID: string;
    EventSort: number;
    FeatureInfoObject: string;
    FileFormat: string;
    Height: number;
    ImageID: string;
    ShotTime: string;
    StoragePath: string;
    Type: string;
    Width: number;
  };

  //人脸批量删除
  type FaceDeleteReq = {
    IDList: string;
  };

  type FaceDeleteRes = {
    ResponseStatusList: ResponseStatusList;
  };

  type ResponseStatusList = {
    ResponseStatusObject: ResponseStatusObject[];
  };

  type ResponseStatusObject = {
    Id: string;
    LocalTime: string;
    RequestURL: string;
    StatusCode: number;
    StatusString: string;
  };

  //人员
  type PersonRes = {
    PersonListObject: PersonListObject;
  };

  type PersonListObject = {
    PersonObject: PersonObject[];
    TotalNum: number;
  };

  type PersonObject = {
    AccompanyNumber?: number;
    AgeLowerLimit?: number;
    AgeUpLimit?: number;
    Alias?: string;
    Appendant?: string;
    BagColor?: string;
    BagStyle?: string;
    Behavior?: string;
    BehaviorDescription?: string;
    BodyFeature?: string;
    BodySpeciallMark?: string;
    BodyType?: string;
    CapColor?: string;
    CapStyle?: string;
    ChineseAccentCode?: string;
    CoatColor?: string;
    CoatLength?: string;
    CoatStyle?: string;
    CorpseConditionCode?: string;
    CrimeCharacterCode?: string;
    CrimeMethod?: string;
    CriminalInvolvedSpecilisationCode?: string;
    DetaineesIdentity?: string;
    DetaineesSpecialIdentity?: string;
    DetentionHouseCode?: string;
    DeviceID?: string;
    EscapedCriminalNumber?: string;
    EthicCode?: string;
    FaceStyle?: string;
    FacialFeature?: string;
    GenderCode?: string;
    Gesture?: string;
    GlassColor?: string;
    GlassStyle?: string;
    HabitualMovement?: string;
    HairColor?: string;
    HairStyle?: string;
    HeightLowerLimit?: number;
    HeightUpLimit?: number;
    IDNumber?: string;
    IDType?: string;
    ImmigrantTypeCode?: string;
    InfoKind?: number;
    InjuredDegree?: string;
    IsCriminalInvolved?: number;
    IsDetainees?: number;
    IsDriver?: number;
    IsForeigner?: number;
    IsSuspectedTerrorist?: number;
    IsSuspiciousPerson?: number;
    IsVictim?: number;
    JobCategory?: string;
    LeftTopX?: number;
    LeftTopY?: number;
    LocationMarkTime?: string;
    MemberTypeCode?: string;
    Name?: string;
    NationalityCode?: string;
    NativeCityCode?: string;
    PassportType?: string;
    PersonAppearTime?: string;
    PersonDisAppearTime?: string;
    PersonID: string;
    PersonOrg?: string;
    PhysicalFeature?: string;
    ResidenceAdminDivision?: string;
    RespiratorColor?: string;
    RightBtmX?: number;
    RightBtmY?: number;
    ScarfColor?: string;
    ShoesColor?: string;
    ShoesStyle?: string;
    SkinColorType?: string;
    SourceID?: string;
    Status?: string;
    SubImageList?: SubImageList;
    SuspectedTerroristNumber?: string;
    TrousersColor?: string;
    TrousersLen?: string;
    TrousersStyle?: string;
    UmbrellaColor?: string;
    UsedName?: string;
    VictimType?: string;
  };

  //机动车检测
  type MotorVehicleRes = {
    MotorVehicleListObject: MotorVehicleListObject;
  };

  type MotorVehicleListObject = {
    MotorVehicleObject: MotorVehicleObject[];
    TotalNum: number;
  };

  type MotorVehicleObject = {
    AppearTime: string;
    CarOfVehicle: string;
    ColorType: string;
    DeviceID: string;
    DisappearTime: string;
    DrivingStatusCode: string;
    FilmColor: number;
    HasPlate: string;
    InfoKind: number;
    IsAltered: string;
    IsCovered: string;
    IsDecked: string;
    IsModified: number;
    LaneNo: number;
    LeftTopX: number;
    LeftTopY: number;
    MarkTime: string;
    MotorVehicleID: string;
    PlateClass: string;
    PlateDescribe: string;
    PlateNo: string;
    PlateNoAttach: string;
    RearviewMirror: string;
    RightBtmX: number;
    RightBtmY: number;
    SideOfVehicle: string;
    SourceID: string;
    Speed: number;
    StorageUrl1: string;
    StorageUrl2: string;
    StorageUrl3: string;
    StorageUrl4: string;
    StorageUrl5: string;
    SubImageList: SubImageList;
    TollgateID: string;
    UsingPropertiesCode: number;
    VehicleBrand: string;
    VehicleChassis: string;
    VehicleClass: string;
    VehicleColor: string;
    VehicleDoor: string;
    VehicleHeight: number;
    VehicleHood: string;
    VehicleLength: number;
    VehicleModel: string;
    VehicleRoof: string;
    VehicleShielding: string;
    VehicleStyles: string;
    VehicleTrunk: string;
    VehicleWheel: string;
    VehicleWidth: number;
    VehicleWindow: string;
    WheelPrintedPattern: string;
  };

  //非机动车检测
  type NonMotorVehicleRes = {
    NonMotorVehicleListObject: NonMotorVehicleListObject;
  };

  type NonMotorVehicleListObject = {
    NonMotorVehicleObject: NonMotorVehicleObject[];
    TotalNum: number;
  };

  type NonMotorVehicleObject = {
    AppearTime?: string;
    CarOfVehicle?: string;
    DeviceID?: string;
    Direction?: string;
    DisappearTime?: string;
    DrivingStatusCode?: string;
    FilmColor?: number;
    HasPlate?: null;
    InfoKind?: string;
    IsAltered?: null;
    IsCovered?: null;
    IsDecked?: null;
    IsModified?: number;
    LeftTopX?: number;
    LeftTopY?: number;
    MarkTime?: string;
    NonMotorVehicleID: string;
    PlateClass?: string;
    PlateDescribe?: string;
    PlateNo?: string;
    PlateNoAttach?: string;
    RearviewMirror?: string;
    RightBtmX?: number;
    RightBtmY?: number;
    SideOfVehicle?: string;
    SourceID?: string;
    Speed?: number;
    SubImageList?: SubImageList;
    UsingPropertiesCode?: number;
    VehicleBrand?: string;
    VehicleChassis?: string;
    VehicleColor?: string;
    VehicleDoor?: string;
    VehicleHeight?: number;
    VehicleHood?: string;
    VehicleLength?: number;
    VehicleRoof?: string;
    VehicleShielding?: string;
    VehicleTrunk?: string;
    VehicleType?: string;
    VehicleWheel?: string;
    VehicleWidth?: number;
    VehicleWindow?: string;
    WheelPrintedPattern?: string;
  };

  type SubImageList = {
    Data: string;
    DeviceID: string;
    EventSort: number;
    FileFormat: string;
    Height: number;
    ImageID: string;
    ShotTime: string;
    StoragePath: string;
    Type: string;
    Width: number;
  };
}
