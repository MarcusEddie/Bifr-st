import { request } from 'umi';

export async function getQueueById(params, pGeneralCaseId) {
  return request('/api/queue/getPlanById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      params:{
        generalCaseId: pGeneralCaseId
      },
      pageInfo:{
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}

export async function getQueueByParams(params, options){
  return request('/api/queue/getQueueByParams', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      params:{
        appId: params.app,
        moduleId: params.module,
        functionId: params.function,
        state: params.state,
        taskState: params.taskState,
        testType: params.testType,
      },
      pageInfo:{
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}

export async function deleteById(pId){
  return request('/api/queue/deleteById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deleteByIds(pIds){
  return request('/api/queue/deleteByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
} 

export async function deactivateById(pId){
  return request('/api/queue/deactivateById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deactivateByIds(pIds){
  return request('/api/queue/deactivateByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function activateById(pId){
  return request('/api/queue/activateById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function activateByIds(pIds){
  return request('/api/queue/activateByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}