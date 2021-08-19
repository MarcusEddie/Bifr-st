const systemData2 = [
  {label: 'yong hu guan li', value: 'yong hu guan li'},
  {label: 'guang gao toufang guan li', value: 'guang gao toufang guan li'},
  {label: 'shang pin guan li', value: 'shang pin guan li'},
  {label: 'ding dan guan li', value: 'ding dan guan li'},
  {label: 'zhi fu guan li', value: 'zhi fu guan li'},
];
const systemData = ['yong hu guan li', 'guang gao toufang guan li', 'shang pin guan li', 'ding dan guan li', 'zhi fu guan li'];


const getSystemsData = {
  systemData,
};

const getSystems = (_, res) => {
  return res.json({
    data: getSystemsData,
  });
};

const getSystemsData2 = {
  systemData2,
};

const getSystems2 = (_, res) => {
  return res.json({
    data: getSystemsData2,
  });
};

export default {
  'GET  /api/getSystems': getSystems,
  'GET  /api/getSystems2': getSystems2,
};
