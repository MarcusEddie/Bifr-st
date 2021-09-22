
import { useIntl } from 'umi';
import ProForm, { ProFormText, ProFormList } from '@ant-design/pro-form';
import React from 'react';

const HeaderArea = (props) => {
  const { headers } = props;
  const intl = useIntl();

  return (
    <ProFormList name="headers" initialValue={headers} copyIconProps={false}
      creatorButtonProps={{
        creatorButtonText: `${intl.formatMessage({ id: 'pages.caseMaintain.action.new', })}${intl.formatMessage({ id: 'pages.interfaceTest.create.newCase.api.header', })}`,
        position: "bottom",
        type: "dashed"
      }}
    >
      <ProForm.Group size={8}>
        <ProFormText name="headerName" /> <ProFormText name="headerVal" />
      </ProForm.Group>
    </ProFormList>
  );
};

export default HeaderArea;