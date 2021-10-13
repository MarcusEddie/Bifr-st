import { request } from 'umi';

export async function getApps() {
  return request('/api/app/getApps');
}

export async function getAppById(pId) {
  return request('/api/app/getAppById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function getModules(pAppId) {
  return request('/api/app/getModuleOptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appId: pAppId
    },
  });
}

export async function getModuleById(pModuleId) {
  return request('/api/app/getModuleById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pModuleId
    },
  });
}
export async function getFunctions(pModuleId) {
  return request('/api/app/getFuncOptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      moduleId: pModuleId
    },
  });
}

export async function getFunctionById(pFunctionId) {
  return request('/api/app/getFunctionById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      functionId: pFunctionId
    },
  });
}

export async function saveNewAppComponent(appVal, moduleVal, funcVal) {
  return request('/api/app/saveNewAppComponent', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appName: appVal,
      moduleName: moduleVal,
      functionName: funcVal
    },
  });
}

export async function deleteAppComponent(pAppId, pModuleId, pFuncId) {
  return request('/api/app/deleteAppComponent', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appId: pAppId,
      moduleId: pModuleId,
      functionId: pFuncId
    },
  });
}
