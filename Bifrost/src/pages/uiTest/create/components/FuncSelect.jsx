import React, { useEffect, useState } from 'react';
import { getFunctions } from '@/services/backend/app';
import { useIntl } from 'umi';
import { Select } from 'antd';

const loadingFuncs = async (rootId) => {
  const rs = [];
  const funcs = await getFunctions(rootId);
  if (funcs && funcs.data) {
    return funcs.data;
  }
  return rs;
}

const FuncSelect = (props) => {
  const intl = useIntl();

  const { state } = props;
  const [innerOptions, setOptions] = useState([]);
  useEffect(() => {
    const { rootId } = state || {};
    const funcs = loadingFuncs(rootId);
    const rs = [];
    rs.push({ label: intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', }), value: 0});
    funcs.then((data) => {
      for (let i = 0; i < data.length; i += 1) {
        rs.push({ label: data[i].name, value: data[i].id });
      }
      setOptions(rs);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state)]);
  return <Select options={innerOptions} defaultValue={intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', })} onChange={props.onChange} />;
};

export default FuncSelect;