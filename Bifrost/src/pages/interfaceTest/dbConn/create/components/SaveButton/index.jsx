import React from "react";
import { message, Button } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { withPropsAPI } from "gg-editor";
import { getFunctionById } from '@/services/backend/app';
import { saveMultiCases, getRawDataByFunctionId } from '@/services/backend/testcase';
import { isBlank } from '@/utils/StringUtils';

class Save extends React.Component {

  render() {
    // gg-editor的使用文档和参考资料:
    // https://www.yuque.com/blueju/gg-editor 
    // https://codesandbox.io/s/r4kzkn441m?file=/src/components/Save/index.js
    // https://blog.csdn.net/weixin_34321753/article/details/94083894?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-10.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-10.control
    //
    // https://butterfly-dag.gitee.io/butterfly-dag/demo/mindMap -- a better solution
    const { submitBtnName, resetBtnName, successMsg, failedMsg, initVal, functionId } = this.props;

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

    const checkFunction = async (value) => {
      const func = await getFunctionById(functionId);
      if (func && func.data) {
        if (value.toString() !== func.data.name.toString()) {
          message.error("function does not match the selected value");
          return false;
        }
        // window.console.log(`function is ${func.data.name}`);
        return true;
      }
      message.error("function is not available");
      return false;
    }

    const hasEmptyNodes = async (data) => {
      // {"jsonData":{"roots":[{"label":"请输入一个功能名称","children":[],"id":"3461ad76"}]}}
      const queue = [];
      let rs = false;
      queue.push(data.roots[0]);
      while (queue.length !== 0) {
        const obj = queue.shift();
        if (isBlank(obj.label)) {
          rs = true;
          break;
        }
        if (obj.children) {
          if (obj.children.length !== 0) {
            for (let i = 0; i < obj.children.length; i += 1) {
              queue.push(obj.children[i]);
            }
          }
        }
      }

      return rs;
    }

    const calculateMinDepth = async (data) => {
      // let cnt = 1;
      let depth = 999999;
      let queue = [];
      const levelQueue = [];

      const map = new Map();
      // queue.push(data.roots[0]);
      let breakFlag = false;
      if (data.roots[0].children.length !== 0) {
        // cnt += 1;
        for (let i = 0; i < data.roots[0].children.length; i += 1) {
          map.set(data.roots[0].children[i].id, 2);
          if (data.roots[0].children[i].children && data.roots[0].children[i].children.length !== 0) {
            queue.push(data.roots[0].children[i]);
          } else {
            breakFlag = true;
            depth = 2;
            // window.console.log(`break because of min depth is less than 5 when node is ${data.roots[0].children[i].label} - ${data.roots[0].children[i].id} - level 2`);
            break;

          }
        }
        // window.console.log(queue);
      }

      while (queue.length !== 0 && (!breakFlag)) {
        // window.console.log(`has queue`);
        // cnt += 1;
        while (queue.length !== 0 && (!breakFlag)) {
          const obj = queue.shift();
          // window.console.log(`current node is ${obj.label} - ${obj.id} - level ${cnt}`);
          if (obj.children && obj.children.length !== 0) {
            for (let i = 0; i < obj.children.length; i += 1) {
              const node = obj.children[i];
              // window.console.log(`current node ${obj.label} - ${obj.id} - sub:  ${node.label} - ${node.id} `);
              const level = map.get(obj.id) + 1;
              map.set(node.id, level);
              levelQueue.push(node);
            }
          } else {
            const level = map.get(obj.id);
            if (parseInt(level, 10) < parseInt(depth, 10)) {
              depth = level;
            }
            if (parseInt(depth, 10) < 5) {
              // window.console.log(`break because of min depth is less than 5 when node is ${obj.label} - ${obj.id} - level ${map.get(obj.id)}`);
              breakFlag = true;
            }
          }
        }
        queue = levelQueue;
      }
      if (parseInt(depth, 10) === 999999) {
        depth = 1;
      }
      // window.console.log(map);
      // window.console.log(depth);
      return depth;

    }

    const dfs = async (data, cnt, map, leaf) => {
      let ct = cnt;

      if (!(data.children && data.children.length !== 0)) {
        if (map.has(data.id)) {
          ct = map.get(data.id);
          // window.console.log(`leaf ${data.label} - ${ct}`);
          leaf.set(data.label, ct);
        }
        return;
      }
      if (data.children && data.children.length !== 0) {
        for (let i = 0; i < data.children.length; i += 1) {
          if (map.has(data.id)) {
            ct = map.get(data.id);
          } else {
            ct = cnt;
          }
          const node = data.children[i];
          if (node.children && node.children.length === 1) {
            ct += 1;
          } else if (node.children && node.children.length !== 1) {
            ct = 0;
          } else {
            ct += 1;
          }
          map.set(node.id, ct);
          dfs(node, ct, map, leaf);
        }
      }
    }

    const checkStructure = async (data) => {
      let cnt = 0;
      if (data.roots[0].children.length === 1) {
        cnt = 1;
      }
      const map = new Map();
      const leaf = new Map();
      dfs(data.roots[0], cnt, map, leaf);
      let min = 999999;
      leaf.forEach(function getMin(value, key) {
        if (parseInt(value, 10) < min) {
          min = value;
        }
      });
      // window.console.log(`min is ${min}`);
      // window.console.log(leaf);
      if (parseInt(min, 10) < 3) {
        return false;
      }
      return true;
    }

    const isFunctionBound = async () => {
      const rs = await getRawDataByFunctionId(functionId);
      if (rs && rs.data) {
        if (parseInt(rs.data.id, 10) > 0) {
          return true;
        }
      }
      return false;
    }

    const handleClick = async () => {
      const { propsAPI } = this.props;
      const data = propsAPI.save();
      // window.console.log(data);
      const functionBound = await isFunctionBound();
      if (functionBound) {
        message.error("Function is bound, select a new function please");
      } else {

        const hasEmptyNode = await hasEmptyNodes(data);
        if (hasEmptyNode) {
          message.error("Has empty node in the current map");
        } else {
          const funcIsAvailable = await checkFunction(data.roots[0].label);
          if (funcIsAvailable) {
            const depth = await calculateMinDepth(data);
            if (parseInt(depth, 10) < 5) {
              message.error("Map is not complete, check it please");
            } else {
              const checkPass = await checkStructure(data);
              if (checkPass) {
                const success = await saveMultiCases(data, functionId);
                if (success) {
                  message.success(successMsg);
                  handleReset();
                } else {
                  message.error(failedMsg);
                }
              } else {
                message.error("The last level node should be single node");
              }

            }

          }

        }
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
