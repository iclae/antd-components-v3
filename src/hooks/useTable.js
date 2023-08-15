import { useState, useEffect } from 'react';
import useUpdateEffect from './useUpdateEffect';

const PAGE_SIZE = 10;

/**
 * @typedef {object} TableReturn
 * @property {object} tableProps antd table props
 * @property {boolean} refresh 手动触发刷新
 * @property {function} run 手动触发 run(mapParams, resetPage = true)
 * @property {object} params
 */

/**
 *
 * @param {Promise} requestPromise 返回格式 {dataSource: [], total: 0}
 * @param {object} options
 * @param {boolean} options.manual 是否手动触发
 * @param {number} options.defaultPageSize 默认每页条数
 * @param {array} options.refreshDeps 依赖项，变化后重新请求
 * @param {object} options.initParam 初始参数
 * @param {boolean} options.showSizeChanger 是否显示每页条数切换器
 * @param {array} options.pageSizeOptions 每页条数切换器可选值
 * @param {function} options.showTotal 显示总条数
 * @returns {TableReturn} tableReturn
 */
export default function useTable(requestPromise, options = {}) {
  const {
    manual = false,
    defaultPageSize = PAGE_SIZE,
    refreshDeps = [],
    initParam = {},
    pageSizeOptions = ['10', '20', '50'],
    showSizeChanger = false,
    showTotal = total => `共 ${total} 条`,
  } = options;

  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [fresh, refresh] = useState(false);
  const [params, setParams] = useState(initParam || {});

  const request = () => {
    setLoading(true);
    requestPromise({ ...params, pageSize, pageNum: current }).then(
      ({ dataSource = [], total = 0 } = {}) => {
        setDataSource(dataSource);
        setTotal(total);
        setLoading(false);
      }
    );
  };

  const tableRefresh = resetPage => {
    if (resetPage) {
      setCurrent(prev => {
        if (prev === 1) {
          refresh(!fresh);
        }
        return 1;
      });
    } else {
      refresh(!fresh);
    }
  };

  useUpdateEffect(() => {
    request();
  }, [current, fresh, pageSize, ...refreshDeps]);

  useEffect(() => {
    if (!manual) {
      request();
    }
  }, []);

  return {
    tableProps: {
      dataSource,
      loading,
      pagination: {
        current,
        total,
        pageSize: defaultPageSize,
        showSizeChanger,
        pageSizeOptions,
        showTotal,
        onShowSizeChange: (_, pageSize) => {
          setPageSize(pageSize);
        },
        onChange: newPageNum => {
          setCurrent(newPageNum);
        },
      },
    },
    refresh: tableRefresh,
    run: (mapParams, resetPage = true) => {
      setParams(mapParams(params));
      tableRefresh(resetPage);
    },
    params,
  };
}
