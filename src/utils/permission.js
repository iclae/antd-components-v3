// 最小权限
// 查看 1
const READ = 0b1;
// 创建链接
const CREATELINK = 0b10;
// 下载
const DOWNLOAD = 0b100;
// 上传
const UPLOAD = 0b1000;
// 编辑
const EDIT = 0b10000;
// 复制
const COPY = 0b100000;
// 移动
const MOVE = 0b1000000;
// 删除
const DELETE = 0b10000000;

// 组合权限 (尽量使用单个权限，以防止以后权限变更要改的地方多)
// 访客：可查看 3
const GUEST = READ | CREATELINK;
// 用户：可查看/下载 7
const USER = GUEST | DOWNLOAD;
// 编辑者：可编辑/上传/创建链接 31
const EDITOR = USER | UPLOAD | EDIT;
// 管理者：可复制/移动/删除 255
const MANAGER = EDITOR | COPY | MOVE | DELETE;

// 组合权限
export const identity = {
  GUEST,
  USER,
  EDITOR,
  MANAGER,
};
export const identityLabel = {
  仅可查看: GUEST,
  '可查看/下载': USER,
  可编辑: EDITOR,
  可管理: MANAGER,
};

// 所有权限
export const Permissions = {
  READ,
  DOWNLOAD,
  UPLOAD,
  EDIT,
  CREATELINK,
  COPY,
  MOVE,
  DELETE,
  GUEST,
  USER,
  EDITOR,
  MANAGER,
};

// 权限判断
/**
 *
 * @param {number} permission 要判断的权限
 * @param {number} permissionCode 想判断对象是否拥有的权限
 * @eg: hasPermission(USER, READ) => true
 * @returns {boolean}
 */
export function hasPermission(permission, permissionCode) {
  // return true // 调试用
  return (permission & permissionCode) === permissionCode;
}
/**
 * 判断该权限是什么组合权限
 * @param {number} permission 判断权限的身份
 * @eg: getPermissionType(READ) => 'GUEST'
 * @returns {'GUEST'|'USER'|'EDITOR'|'MANAGER'}
 */
export function getPermissionType(permission) {
  if (permission === READ) return 'GUEST';
  if (permission === USER) return 'USER';
  if (permission === EDITOR) return 'EDITOR';
  if (permission === MANAGER) return 'MANAGER';
}

/**
 * 判断该权限的中文标签
 * @param {number} permission
 * @eg: getPermissionLabel(READ) => '仅可查看'
 * @returns {'仅可查看'|'可查看/下载'|'可编辑'|'可管理'}
 */
export function getPermissionLabel(permission) {
  if (permission === READ) return '仅可查看';
  if (permission === USER) return '可查看/下载';
  if (permission === EDITOR) return '可编辑';
  if (permission === MANAGER) return '可管理';
}

/**
 * 去除权限中的某个权限
 * @param {number} permission 要去除权限的身份
 * @param {number} permissionCode 要去除的权限
 * @eg: removePermission(EDITOR, DOWNLOAD) => 27
 * @returns {number}
 */
export function removePermission(permission, permissionCode) {
  return permission ^ permissionCode;
}

/**
 * 添加权限
 * @param {number} permission 要添加权限的身份
 * @param {number} permissionCode 要添加的权限
 * @eg: addPermission(EDITOR, DOWNLOAD) => 31
 * @returns {number}
 */
export function addPermission(permission, permissionCode) {
  return permission | permissionCode;
}
