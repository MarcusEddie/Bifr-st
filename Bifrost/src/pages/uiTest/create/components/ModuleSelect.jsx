
import React, { useEffect, useState } from 'react';
import { getModules } from '@/services/backend/app';
import { useIntl } from 'umi';
import { Select } from 'antd';

const loadingModules = async (rootId) => {
  const rs = [];
  const modules = await getModules(rootId);
  // window.console.log(`loading module by app id ${rootId}`);
  if (modules && modules.data) {
    return modules.data;
  }
  return rs;
}

const ModuleSelect = (props) => {
  const intl = useIntl();

  const { state } = props;
  const [innerOptions, setOptions] = useState([]);
  useEffect(() => {
    let { rootId } = state || {};
    const all = intl.formatMessage({ id: 'pages.caseMaintain.DropList.all'});
    if(rootId.toString() === all.toString()) {
      rootId = 0;
    }
    const modules = loadingModules(rootId);
    const rs = [];
    rs.push({ label: all, value: 0});
    modules.then((data) => {
      for (let i = 0; i < data.length; i += 1) {
        rs.push({ label: data[i].name, value: data[i].id });
      }
      setOptions(rs);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state)]);
  return <Select options={innerOptions} defaultValue={intl.formatMessage({ id: 'pages.caseMaintain.DropList.all', })} onChange={props.onChange} />;
};

export default ModuleSelect;