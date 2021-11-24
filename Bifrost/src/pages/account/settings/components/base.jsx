import React from 'react';
import { message } from 'antd';
import ProForm, {
  ProFormText,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { queryCurrent } from '../service';
import styles from './BaseView.less';

const BaseView = () => {
  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });

  const handleFinish = async () => {
    message.success('Update basic info successfully');
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: 'Basic info update',
                },
              }}
              initialValues={{ ...currentUser, phone: currentUser?.phone.split('-') }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="email"
                label="E-mails"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              />
            </ProForm>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
