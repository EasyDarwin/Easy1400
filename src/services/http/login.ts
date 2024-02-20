import CryptoJS from 'crypto-js';
import { POST, PUT } from './http';

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

/** #########  用户  #########*/
export async function EditUserPwd(data: {
  id: string;
  password: string;
  new_password: string;
}) {
  return await PUT(`/users/${data.id}/reset-password`, {
    password: sha256(data.password),
    new_password: sha256(data.new_password),
  });
}
