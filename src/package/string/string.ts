/**
 * 将长字符转成以中间省略号 如输出 "7628ce...a23e"
 * @param str string
 * @param maxLength 可选默认10 超出10个字符
 */
export function shortenString(str:string, maxLength=10) {
    if (str.length > maxLength) {
      const firstPart = str.substring(0, 6);
      const lastPart = str.substring(str.length - 4);
      return `${firstPart}...${lastPart}`;
    } else {
      return str;
    }
  }