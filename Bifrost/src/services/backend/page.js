import { request } from 'umi';

export async function getPagesByAppId(pAppId) {
  return request('/api/uiPage/getPagesByAppId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appId: pAppId
    },
  });
}

export async function getPageById(pId) {
  return request('/api/uiPage/getPageById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function getPagesByParams(params) {
  return request('/api/uiPage/getPagesByParams', {
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
      },
      pageInfo: {
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}

export async function saveOnePage(fields, strucObj) {
  return request('/api/uiPage/addOnePage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    data: {
      appId: strucObj.app,
      moduleId: strucObj.module,
      functionId: strucObj.function,
      name: fields.pageName,
      url: fields.pageUrl,
    },
  });
}

export async function updatePageById(pId, fields, strucObj) {
  return request('/api/uiPage/updateById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    data: {
      id: pId,
      appId: strucObj.app,
      moduleId: strucObj.module,
      functionId: strucObj.function,
      name: fields.pageName,
      url: fields.pageUrl,
    },
  });
}

export async function deletePageById(pId) {
  return request('/api/uiPage/deleteById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deletePageByIds(pIds){
  return request('/api/uiPage/deleteByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
} 

export async function activatePageById(pId) {
  return request('/api/uiPage/activateById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function activatePageByIds(pIds) {
  return request('/api/uiPage/activateByIds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function deactivatePageById(pId) {
  return request('/api/uiPage/deactivateById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deactivatePageByIds(pIds) {
  return request('/api/uiPage/deactivateByIds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}
