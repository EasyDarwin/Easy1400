/**
 * 在数组中查找指定 ID 的对象
 * @param {Array} array 包含对象的数组
 * @param {string|number} id 要查找的对象的 ID 值
 * @param {string} key 匹配 ID 的对象属性名（默认为 "id"）
 * @returns {object|undefined} 查找到的对象，如果没有找到则返回 undefined
 */
function findObjectById(array:any, id:any, key = 'id') {
    return array.find((item:any) => item[key] === id);
  }