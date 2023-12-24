/**
 * 拼接图片URL
 * @param {string} path 需要拼接的url
 */
export function getImgURL(path: string) {
  if (path.startsWith('http')) {
    return path;
  }

  return `${window.location.origin}${process.env.BASEURL}${path}`;
}
