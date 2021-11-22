import { request } from 'umi';

export async function getQueueById(params, pGeneralCaseId) {
  return request('/api/history/getPlanById', { 
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

export async function getHistoryByParams(params, options){
  return request('/api/history/getHistoryByParams', { 
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

export async function reEnqueueById(pId){
  return request('/api/history/reEnqueueById', { 
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
  return request('/api/history/deleteByIds', { 
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
  return request('/api/history/deactivateById', { 
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
  return request('/api/history/deactivateByIds', { 
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
  return request('/api/history/activateById', { 
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
  return request('/api/history/activateByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}