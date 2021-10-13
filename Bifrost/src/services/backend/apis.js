import { request } from 'umi';

export async function getApisByAppId(pAppId) {
  return request('/api/apis/getApisByAppId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appId: pAppId
    },
  });
}

export async function getApiById(pId) {
  return request('/api/apis/getApiById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function getApisByParams(params) {
  return request('/api/apis/getApisByParams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    data: {
      params: {
        appId: params.app,
        moduleId: params.module,
        functionId: params.function,
        name: params.name,
        state: params.state,
        path: params.path,
        method: params.method
      },
      pageInfo: {
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}

export async function saveOneApi(fields, strucObj, pHeader) {
  return request('/api/apis/addOneApi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    data: {
      appId: strucObj.app,
      moduleId: strucObj.module,
      functionId: strucObj.function,
      name: fields.apiName,
      url: fields.apiUrl,
      path: fields.apiPath,
      method: fields.apiMethod,
      header: pHeader,
      arguments: fields.arguments,
      response: fields.response
    },
  });
}

export async function updateApiById(pId, fields, strucObj, pHeader, pArgs, pResp) {
  return request('/api/apis/updateById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    data: {
      id: pId,
      appId: strucObj.app,
      moduleId: strucObj.module,
      functionId: strucObj.function,
      name: fields.apiName,
      url: fields.apiUrl,
      path: fields.apiPath,
      method: fields.apiMethod,
      header: pHeader,
      arguments: pArgs,
      response: pResp
    },
  });
}

export async function deleteApiById(pId) {
  return request('/api/apis/deleteById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deleteApiByIds(pIds){
  return request('/api/apis/deleteByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
} 

export async function activateApiById(pId) {
  return request('/api/apis/activateById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function activateApiByIds(pIds) {
  return request('/api/apis/activateByIds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function deactivateApiById(pId) {
  return request('/api/apis/deactivateById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deactivateApiByIds(pIds) {
  return request('/api/apis/deactivateByIds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}
