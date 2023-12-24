/**
 * 将长字符转成以中间省略号 如输出 "7628ce...a23e"
 * @param str string
 * @param maxLength 可选默认10 超出10个字符
 */
export function shortenString(str: string, maxLength = 10,startLength = 6,endLength = 4) {
  if (str && str.length > maxLength) {
    const firstPart = str.substring(0, startLength);
    const lastPart = str.substring(str.length - endLength);
    return `${firstPart}...${lastPart}`;
  }
  return str;
}


/**
 * 生成随机字符
 * @param {number} len 返回字符长度
 */
export function generateUniqueString(len:number) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = len; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}