import { POST } from './http';
import CryptoJS from 'crypto-js';


const sha256 = (message: string) => {
  const hash = CryptoJS.SHA256(message);
  // 将散列值转换为字符串表示
  const hashInString = hash.toString(CryptoJS.enc.Hex);
  return hashInString;
};

//获取验证码
export const getCaptcha = 'GetCaptcha';
export async function GetCaptcha() {
  return await POST(`/captcha`, { username: '' });
}

//登录
export async function Login(data: Logins.LoginReq) {
  return await POST(`/login`, {
    ...data,
    password: sha256(data.password),
  });
}
