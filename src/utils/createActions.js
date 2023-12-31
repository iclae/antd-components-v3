/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';
import { Divider, Popconfirm, Popover, Menu, Button } from 'antd';

/**
 * @typedef {Object} Action
 * @property {string} text  操作的标题
 * @property {Function} onClick  点击后的回调函数
 * @property {'normal' | 'confirm' | 'more', 'custom'} [type] 操作的类型,默认为normal
 * @property {string} [confirmTitle] 弹出确认框的标题
 * @property {'click' | 'hover'} [moreTrigger] 弹出菜单的触发方式,默认为hover
 * @property {boolean} [hidden] 是否隐藏
 * @property {disabled} [disabled] 是否禁用
 */

/**
 * 返回一个普通的link操作按钮
 * @param {Action} action
 * @returns {JSX.Element} <a></a>
 */
const ActionLink = ({ action: { onClick = () => {}, text, disabled } }) => (
  <Button
    type="link"
    style={{ padding: 0 }}
    onClick={onClick}
    disabled={disabled}
  >
    {text}
  </Button>
);

/**
 * 返回一个带确认弹出框的按钮
 * 点击<a>会弹出确认框,点击“确定”后触发onClick
 * @param {Action} action
 * @returns {JSX.Element} <Popconfirm><a></a></Popconfirm>
 */
const ActionPopconfirm = ({
  action: { onClick = () => {}, text, confirmTitle, disabled },
}) => (
  <Popconfirm
    cancelText="取消"
    okText="确定"
    onConfirm={onClick}
    title={confirmTitle}
  >
    <Button type="link" style={{ padding: 0 }} disabled={disabled}>
      {text}
    </Button>
  </Popconfirm>
);

/**
 * 返回一个带有更多菜单的按钮
 * @returns
 */
const ActionMore = ({ action }) => {
  const { moreTrigger = 'hover', text, menus = [], zIndex = 999 } = action;

  return (
    <Popover
      placement="top"
      overlayStyle={{ zIndex }}
      content={
        <div className="folder-more-menu">
          <Menu>
            {menus.map((item, index) => (
              <Menu.Item onClick={item.onClick} key={`${item.text}@${index}`}>
                {item.text}
              </Menu.Item>
            ))}
          </Menu>
        </div>
      }
      trigger={moreTrigger}
    >
      <Button type="link" style={{ padding: 0 }}>
        {text}
      </Button>
    </Popover>
  );
};

/**
 * 创建操作列
 * @param {Action[]} actions 需要渲染的操作数组
 * @returns {JSX.Element} 操作列
 */
const createActions = actions =>
  actions
    .filter(action => !action.hidden)
    .map((action, index) => {
      let Action;
      switch (action.type) {
        case 'confirm':
          Action = ActionPopconfirm;
          break;
        case 'more':
          Action = ActionMore;
          break;
        case 'custom':
          Action = action.children;
          break;
        default:
          Action = ActionLink;
          break;
      }
      return (
        <Fragment key={`${action.text}_container`}>
          {index > 0 && <Divider style={{ margin: '0 6px' }} type="vertical" />}
          <Action action={action} />
        </Fragment>
      );
    });

export default createActions;
