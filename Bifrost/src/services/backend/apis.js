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
