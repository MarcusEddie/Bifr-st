import React from "react";
import { message, Button } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { withPropsAPI } from "gg-editor";
import { saveMultiCases } from '@/services/backend/api';

class Save extends React.Component {

  render() {
    // gg-editor的使用文档和参考资料:
    // https://www.yuque.com/blueju/gg-editor 
    // https://codesandbox.io/s/r4kzkn441m?file=/src/components/Save/index.js
    // https://blog.csdn.net/weixin_34321753/article/details/94083894?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-10.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-10.control
    //
    // https://butterfly-dag.gitee.io/butterfly-dag/demo/mindMap -- a better solution
    const { submitBtnName, resetBtnName, successMsg, failedMsg, initVal } = this.props;

    const handleReset = async () => {
      const { propsAPI } = this.props;
      const data = propsAPI.save();
      for (let i = 0; i < data.roots[0].children.length; i += 1) {
        propsAPI.remove(data.roots[0].children[i].id);
      }

      const initRoot = {
        roots: [
          {
            label: initVal,
            children: []
          }
        ]
      };
      propsAPI.read(initRoot);
      // propsAPI.update(data.roots[0].id, {label: initVal.roots[0].label});
      // window.console.log(uniqueId());
      // window.console.log(`reset ${dataaa.roots[0].id}`);
    };

    const handleClick = async () => {
      const { propsAPI } = this.props;
      const data = propsAPI.save();
      const success = await saveMultiCases(data);

      if (success) {
        message.success(successMsg);
        handleReset();
      } else {
        message.error(failedMsg);
      }
    };

    return (
      <div style={{ padding: 8 }}>
        <Button id="createBtn" type="primary" onClick={handleClick} >
          <PlusOutlined /> {submitBtnName}
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button id="resetBtn" type="default" danger onClick={handleReset} >
          <CloseOutlined /> {resetBtnName}
        </Button>
      </div>
    );
  }
}

export default withPropsAPI(Save);
