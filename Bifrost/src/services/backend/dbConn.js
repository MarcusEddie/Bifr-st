import { request } from 'umi';

export async function getDBConnByAppId(pAppId){
  return request('/api/dbConn/getDBConnByAppId', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appId: pAppId
    },
  });
}

export async function saveDBConn(fields, details){
  return request('/api/dbConn/saveDBConnInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      appId: fields.app,
      dbType: fields.dbType,
      name: details.name,
      url: details.url,
      userName: details.userName,
      password: details.password,
      header: details.header
    },
  });
}

export async function updateDBConn(pId, fields, details){
  return request('/api/dbConn/updateDBConnById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId,
      dbType: fields.dbType,
      name: details.name,
      url: details.url,
      userName: details.userName,
      password: details.password,
      header: details.header
    },
  });
}




export async function getDBConnById(pId){
  return request('/api/dbConn/getDBConnById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function getDBConnByParams(params){
  return request('/api/dbConn/getDBConnByParams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      params: {
        appId: params.app,
        name: params.name,
        dbType: params.dbType,
        state: params.state
      },
      pageInfo: {
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}


export async function deleteDBConnById(pId) {
  return request('/api/dbConn/deleteById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deleteDBConnByIds(pIds){
  return request('/api/dbConn/deleteByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
} 

export async function activateDBConnById(pId) {
  return request('/api/dbConn/activateById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function activateDBConnByIds(pIds) {
  return request('/api/dbConn/activateByIds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function deactivateDBConnById(pId) {
  return request('/api/dbConn/deactivateById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deactivateDBConnByIds(pIds) {
  return request('/api/dbConn/deactivateByIds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function dbConnectionTest(pURL, pUserName, pPw) {
  return request('/api/dbConn/dbConnectionTest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      url: pURL,
      userName: pUserName,
      password: pPw
    },
  });
}