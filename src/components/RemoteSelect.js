import React, { forwardRef, useState } from 'react';
import { Select } from 'antd';
const { Option } = Select;
import debounce from '../utils/debounce';

/**
 * 一个远程搜索的下拉框
 * @param {object} props
 * @param {string} props.onSearch 搜索的Promise, (searchKey) =>
 * @param {string} [props.placeholder]
 * @param {boolean} [props.disabled]
 * @param {function} props.onChange
 * @param {number} props.wait 搜索的防抖时间 单位s秒 默认 0.3s
 * @returns
 */
function RemoteSelect(props, ref) {
  const {
    onSearch,
    onChange,
    value,
    placeholder,
    disabled,
    wait = 0.3,
  } = props;

  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = newValue => {
    setLoading(true);
    onSearch(newValue).then(opts => {
      setOptions(opts);
      setLoading(false);
    });
  };
  const debounceSearch = debounce(search, wait * 1000);

  function triggerChange(changedValue) {
    if (onChange) {
      onChange(changedValue);
    }
  }

  return (
    <Select
      disabled={disabled}
      filterOption={false}
      loading={loading}
      onChange={triggerChange}
      onSearch={newValue => {
        if (value && !newValue) return;
        debounceSearch(newValue);
      }}
      placeholder={placeholder}
      ref={ref}
      showSearch
      value={value}
    >
      {options.map(item => (
        <Option key={item.id} value={item.value ? item.value : item.id}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
}

export default forwardRef(RemoteSelect);
