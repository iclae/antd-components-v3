export default function set(obj, path, value) {
  if (Object(obj) !== obj) return obj; // 当不是对象时，直接返回
  if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []; // 将字符串路径转换为数组形式的路径

  path.slice(0, -1).reduce(
    (
      a,
      c,
      i // 遍历路径中的所有属性，除了最后一个
    ) =>
      Object(a[c]) === a[c] // 如果当前属性是对象，则使用当前属性，否则创建一个新对象
        ? a[c]
        : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {}),
    obj
  )[path[path.length - 1]] = value; // 在最后一个属性上设置值
  return obj; // 返回修改后的对象
}
