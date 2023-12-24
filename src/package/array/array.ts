/**
 * 遍历字典找出指定的字段
 * @param {Array} array 包含对象的数组
 * @param {string} id 要查找的对象的 code 值
 * @returns {string} 对应的lable
 */
export function findDictLabel(array:Dict.DataItem[], value:string){
  let obj = array.find((item: Dict.DataItem) => item.value == value)
  return obj?.label;
}