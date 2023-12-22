declare namespace System {
  type ConfigsRes = {
    face: number;
    file: number;
    motor_vehicle: number;
    none_motor_vehicle: number;
    person: number;
    picture: number;
    thing: number;
    video: number;
  };

  type EditConfigsReq = {
    /**
     * 人脸，单位小时
     */
    face: number;
    /**
     * 文件，单位小时
     */
    file: number;
    /**
     * 机动车，单位小时
     */
    motor_vehicle: number;
    /**
     * 非机动车，单位小时
     */
    none_motor_vehicle: number;
    /**
     * 人员，单位小时
     */
    person: number;
    /**
     * 图片，单位小时
     */
    picture: number;
    /**
     * 物品，单位小时
     */
    thing: number;
    /**
     * 视频，单位小时
     */
    video: number;
  };

  type SystemInfo = {
    /**
     * 平台密码，级联用的
     */
    password: string;
    /**
     * 启动时间，程序啥时候启动的?
     */
    start_at: string;
    /**
     * 平台用户名，级联用的
     */
    username: string;
    /**
     * 版本号
     */
    version: string;
    [property: string]: any;
}
}
