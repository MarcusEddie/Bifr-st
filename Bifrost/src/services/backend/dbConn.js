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