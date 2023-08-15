export default function get(obj, path, defaultValue = void 0) {
  // 将 path 分割为数组
  const keys = path.split('.');

  // 遍历访问 obj
  let result = obj;
  for (let key of keys) {
    result = result[key];

    // 如果访问不到返回默认值
    if (result === void 0) {
      return defaultValue;
    }
  }

  return result;
}
