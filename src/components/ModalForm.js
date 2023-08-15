import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { Form, Modal, Select, Input, DatePicker, TreeSelect } from 'antd';
import RemoteSelect from './RemoteSelect';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const formDataToValues = formData => {
  const values = {};
  const formDataKeys = Object.keys(formData);
  if (formDataKeys.length) {
    formDataKeys.forEach(key => {
      values[key] = formData[key].value;
    });
  }
  return values;
};

/**
 * fromItems的属性
 * @typedef {object} FormItem
 * @property {string} label 表单项label
 * @property {string} name 表单项name
 * @property {'select'|'range'|'input'|'textarea'} type 表单项类型
 * @property {string} [placeholder] 表单项placeholder
 * @property {object[]} [rules] 表单项rules
 * @property {'local'|'remote'} [selectMode] 下拉框的模式 local | remote
 * @property {function} [hidden] 是否隐藏的判断函数 需要返回boolean 为true时隐藏
 * @property {boolean | function} [disabled] 是否禁用
 * @property {boolean} [loading] 是否加载中
 */

/**
 * @typedef {object} ComputedOption 计算出来的表单项属性
 * @property {boolean} [disabled] 是否禁用
 */

/**
 * @param {FormItem} item
 * @param {object} states 表单的状态
 * @returns {boolean}
 */
const shouldFormItemDisabled = (item, states) => {
  if (typeof item.disabled === 'function') {
    return item.disabled(states);
  }
  return !!item.disabled;
};

/**
 * @typedef {FormItem} SelectItem
 * @extends FormItem
 * @property {object[]} options 下拉框选项
 * @property {string} options[].[key] 下拉框选项key 不填默认为value
 * @property {string} options[].name 下拉框选项label
 * @property {string} options[].value 下拉框选项value
 * @property {string} [notFoundContent] 无数据时显示的内容
 * @property {function} [onChange] 下拉框选项改变时的回调
 */
/**
 * @param {SelectItem} item
 * @param {ComputedOption} computedOption
 * @param {object} formFunc 表单的方法
 */
function renderSelect(item, { disabled }, formFunc) {
  const { options = [] } = item;
  return (
    <Select
      disabled={disabled}
      loading={item.loading}
      notFoundContent={item.notFoundContent}
      onChange={(value, option) =>
        item.onChange && item.onChange(value, { option, ...formFunc })
      }
      placeholder={item.placeholder}
    >
      {options.map(option => (
        <Select.Option
          key={option.key ? option.key : option.value}
          value={option.value}
        >
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
}

/**
 * @typedef {FormItem} TreeSelectItem
 * @extends FormItem
 * @property {object[]} options treeData
 * @property {string} options[].key 下拉框选项key
 * @property {string} options[].title 下拉框选项label
 * @property {string} options[].value 下拉框选项value
 * @property {boolean} [treeDefaultExpandAll] 是否默认展开所有节点 默认是
 */
/**
 * @param {SelectItem} item
 * @param {ComputedOption} computedOption
 * @param {object} formFunc 表单的方法
 */
function renderTreeSelect(item, { disabled }) {
  const { treeData = [], treeDefaultExpandAll = true } = item;
  return (
    <TreeSelect
      treeData={treeData}
      disabled={disabled}
      placeholder={item.placeholder}
      treeDefaultExpandAll={treeDefaultExpandAll}
    />
  );
}

/**
 * 当item.type为select 且 item.selectMode为remote时有效
 * @typedef {FormItem} RemoteSelectItem
 * @extends FormItem
 * @param {ComputedOption} computedOption
 * @property {Promise} item.onSearch 下拉框远程搜索的Promise，接受一个 searchKey 返回 options, {id, name}[]
 * @property {string} [item.placeholder]
 * @property {number} [item.wait] 搜索的防抖时间 单位s秒 默认 0.3s
 * @returns
 */
/**
 * @param {RemoteSelectItem} item
 */
function renderRemoteSelect(item, { disabled }) {
  return (
    <RemoteSelect
      disabled={disabled}
      placeholder={item.placeholder}
      onSearch={item.onSearch}
      wait={item.wait}
    />
  );
}

/**
 * @param {FormItem} item
 * @param {ComputedOption} computedOption
 * @returns
 */
function renderTextArea(item, { disabled }) {
  return <TextArea disabled={disabled} placeholder={item.placeholder} />;
}

/**
 * @typedef {FormItem} RangeItem
 * @extends FormItem
 * @property {string} [format] 时间格式 默认YYYY-MM-DD
 */
/**
 * @param {RangeItem} item
 * @param {ComputedOption} computedOption
 */
function renderRange(item, { disabled }) {
  return <RangePicker disabled={disabled} placeholder={item.placeholder} />;
}

/**
 * 通用Modal表单
 * @param {object} props
 * @param {string} props.title 标题
 * @param {boolean} props.visible 是否显示
 * @param {FormItem[]| SelectItem[] | RemoteSelectItem[]} props.formItems 表单项
 * @param {object} [props.states] 表单所需的状态
 * @param {boolean} [props.submitLoading] 提交按钮loading
 * @param {number} [props.width] 宽度
 * @param {string} [props.submitText] 提交按钮文字
 * @param {function} props.handleSubmit 提交回调 会传回提交表单数据和重置表单的方法
 * @param {function} props.handleCancel 取消回调
 * @param {function} props.handleReset 重置回调
 */
function ModalForm({
  form,
  title,
  visible,
  formData,
  submitLoading,
  width = 600,
  submitText = '提交',
  formItems,
  handleSubmit,
  handleCancel,
  handleReset,
}) {
  const { getFieldDecorator, validateFields, resetFields, setFieldsValue } =
    form;
  const states = useMemo(() => {
    return formDataToValues(formData);
  }, [formData]);

  const proxyResetFields = () => {
    // 暂时没有传参的需求
    resetFields();
    handleReset();
  };

  const onSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        let submitData = values;
        Object.keys(submitData).forEach(key => {
          const formItem = formItems.find(item => item.name === key);
          if (formItem.type === 'range') {
            submitData[key] = values[key].map(time =>
              time.format(formItem.format || 'YYYY-MM-DD')
            );
          }
        });
        handleSubmit(submitData, proxyResetFields, states);
      }
    });
  };

  const itemRender = item => {
    const computedOption = {
      disabled: shouldFormItemDisabled(item, states),
    };

    switch (item.type) {
      case 'select':
        return item.selectMode === 'remote'
          ? renderRemoteSelect(item, computedOption)
          : renderSelect(item, computedOption, {
              resetFields: proxyResetFields,
              setFieldsValue,
            });
      case 'treeSelect':
        return renderTreeSelect(item, computedOption);
      case 'textarea':
        return renderTextArea(item, computedOption);
      case 'range':
        return renderRange(item, computedOption);
      default:
        return (
          <Input
            disabled={computedOption.disabled}
            placeholder={item.placeholder}
          />
        );
    }
  };

  const shouldRenderFormItem = hidden => {
    if (hidden) {
      return !hidden(states);
    }
    return true;
  };

  const cancel = () => {
    handleCancel({ resetFields: proxyResetFields });
  };

  return (
    <Modal
      confirmLoading={submitLoading}
      okText={submitText}
      onCancel={cancel}
      onOk={onSubmit}
      title={title}
      visible={visible}
      width={width}
    >
      <Form onSubmit={onSubmit} {...formItemLayout}>
        {formItems
          .filter(item => shouldRenderFormItem(item.hidden))
          .map(item => (
            <FormItem key={item.name} label={item.label}>
              {getFieldDecorator(item.name, {
                rules: item.rules,
              })(itemRender(item))}
            </FormItem>
          ))}
      </Form>
    </Modal>
  );
}

export default Form.create({
  name: uuidv4(),
  mapPropsToFields(props) {
    const { formData, formItems = [] } = props;
    // console.log('mapPropsToFields', props);
    const formDataKeys = Object.keys(formData);
    if (formDataKeys.length) {
      const fields = {};
      formItems.forEach(item => {
        const field = formData[item.name] || { value: undefined };
        fields[item.name] = Form.createFormField({
          ...field,
          value: field.value,
        });
      });
      return fields;
    }
  },
  onFieldsChange(props, changedFields) {
    // console.log('onFieldsChange', changedFields);
    const { handleFieldsChange } = props;
    if (handleFieldsChange) {
      handleFieldsChange(changedFields);
    }
  },
})(ModalForm);

/**
 * 构造ModalForm的hooks
 * @param {object} props
 * @param {string} title 标题
 * @param {function} handleSubmit 提交回调 会传回表单数据 重制表单的方法 loading状态的方法 关闭modal的方法
 * @param {FormItem[]| SelectItem[] | RemoteSelectItem[]} formItems 表单项
 * @param {function} [handleCancel] 取消回调 会传回重置表单的方法和关闭modal的方法 默认为关闭modal
 * @param {boolean} [cancelNoReset] 取消时是否重置表单 默认重置
 * @returns {object} returnProps
 * @returns {object} returnProps.modalFormProps ModalForm的props
 * @returns {function} returnProps.openModal 打开modal的方法
 * @returns {function} returnProps.closeModal 关闭modal的方法
 */
export const useModalForm = props => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState(props.formData || {});
  const [submitLoading, setSubmitLoading] = useState(false);

  const {
    handleSubmit,
    handleCancel = () => setVisible(false),
    cancelNoReset = false,
    formItems,
  } = props;

  const closeModal = () => setVisible(false);

  const openModal = editData => {
    if (editData) {
      const fields = {};
      Object.keys(editData).forEach(key => {
        fields[key] = {
          value: editData[key],
        };
      });
      formItems.forEach(item => {
        if (item.type === 'range' && fields[item.name]) {
          fields[item.name] = {
            value: fields[item.name].value.map(time => dayjs(time)),
          };
        }
      });
      setFormData(fields);
    }
    setVisible(true);
  };

  const proxySubmit = (submitData, resetFields, states) => {
    handleSubmit({
      submitData,
      resetFields,
      setSubmitLoading,
      closeModal,
      states,
    });
  };

  const proxyCancel = cancelOptions => {
    if (!cancelNoReset) {
      cancelOptions.resetFields();
    }
    handleCancel({
      ...cancelOptions,
      closeModal,
    });
  };

  const handleFieldsChange = changedFields => {
    setFormData(prev => ({ ...prev, ...changedFields }));
  };

  const handleReset = () => {
    setFormData({});
  };

  return {
    modalFormProps: {
      ...props,
      visible,
      formData,
      submitLoading,
      handleSubmit: proxySubmit,
      handleCancel: proxyCancel,
      handleFieldsChange,
      handleReset,
    },
    openModal,
    closeModal,
  };
};
