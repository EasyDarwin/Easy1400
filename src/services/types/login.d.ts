declare namespace Logins {
  type CaptchaRes = {
    /**
     * 图片
     */
    base64: string;
    /**
     * 验证码 id，登录时携带参数
     */
    captcha_id: number;
    /**
     * 过期时间(秒)
     */
    expired: number;
  };

  type LoginReq = {
    /**
     * 验证码答案，验证码的值
     */
    captcha?: string;
    /**
     * 验证码唯一标识符，验证码 id
     */
    captcha_id: number;
    /**
     * 加密的密码，密码(sha256)
     */
    password: string;
    /**
     * 用户名，用户名
     */
    username: string;
  };

  type LoginRes = {
    /**
     * token过期时间戳(秒)
     */
    expires: number;
    /**
     * 是否重置密码
     */
    reset_password: boolean;
    /**
     * 认证令牌，示例：1adjd1i2jnqaw.12312fainofasdasdas.12312fasdasd
     */
    token: string;
    user: User;
  };

  type User = {
    id: number;
    name: string;
    /**
     * 域(顶级用户组)
     */
    rgroup_id: number;
    /**
     * 用户名
     */
    username: string;
    [property: string]: any;
  };
}
