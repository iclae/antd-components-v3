/* eslint-disable react/no-multi-comp */
import React, { Fragment } from 'react';
import { Divider, Popconfirm } from 'antd';

/**
 * @typedef {Object} Action
 * @property {string} text  操作的标题
 * @property {Function} onClick  点击后的回调函数
 * @property {boolean} [popconfirm] 是否使用弹出确认框,为true时poptitle生效
 * @property {string} [poptitle] 弹出确认框的标题
 * @property {boolean} [hidden] 是否隐藏
 */

/**
 * 返回一个普通的link操作按钮
 * @param {Action} action
 * @returns {JSX.Element} <a></a>
 */
const ActionLink = ({ action: { onClick = () => {}, text } }) => (
  <a onClick={onClick}>{text}</a>
);

/**
 * 返回一个带确认弹出框的按钮
 * 点击<a>会弹出确认框,点击“确定”后触发onClick
 * @param {Action} action
 * @returns {JSX.Element} <Popconfirm><a></a></Popconfirm>
 */
const ActionPopconfirm = ({
  action: { onClick = () => {}, text, poptitle },
}) => (
  <Popconfirm
    cancelText="取消"
    okText="确定"
    onConfirm={onClick}
    title={<span className="action-pop-mark">{poptitle}</span>}
  >
    <a>{text}</a>
  </Popconfirm>
);

/**
 * 创建操作列
 * @param {Action[]} actions 需要渲染的操作数组
 * @returns {JSX.Element} 操作列
 */
const createActions = actions =>
  actions
    .filter(action => !action.hidden)
    .map((action, index) => (
      <Fragment key={`${action.text}_container`}>
        {index > 0 && <Divider style={{ margin: '0 6px' }} type="vertical" />}
        {action.popconfirm ? (
          <ActionPopconfirm action={action} />
        ) : (
          <ActionLink action={action} />
        )}
      </Fragment>
    ));

export default createActions;
