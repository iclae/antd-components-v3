import { hasPermission } from '../../utils/permission';

/**
 * 权限组件
 * @param {object} props
 * @param {number} props.permission 要校验的权限值
 * @param {number} [props.showIfHas] 如果有权限，就显示
 * @param {number} [props.hideIfHas] 如果有权限，就隐藏
 * @param {Array} [props.chain] 权限判断组合 如果有冲突 以最后一个为准, 当有这个时其他校验方式失效
 * @param {'showIfHas' | 'hideIfHas'} [props.chain[].type] 判断类型
 * @param {number} [props.chain[].checkCode] 校验函数
 * @param {ReactNode} props.children 子组件
 * @returns {ReactNode | null} 返回子组件
 */
const Authority = ({ permission, showIfHas, hideIfHas, chain, children }) => {
  if (Array.isArray(chain) && chain.length) {
    let childrenVisible = false;
    for (let index = 0; index < chain.length; index++) {
      const { type, checkCode } = chain[index];
      if (type && checkCode) {
        switch (type) {
          case 'showIfHas':
            childrenVisible = hasPermission(permission, checkCode);
            break;
          case 'hideIfHas':
            childrenVisible = !hasPermission(permission, checkCode);
            break;
          default:
            throw new Error('chain item type wrong');
        }
      } else {
        throw new Error('chain item must have type and checkCode');
      }
    }
    return childrenVisible ? children : null;
  } else {
    if (showIfHas) {
      return hasPermission(permission, showIfHas) ? children : null;
    } else if (hideIfHas) {
      return !hasPermission(permission, hideIfHas) ? children : null;
    } else {
      return children;
    }
  }
};

export default Authority;
