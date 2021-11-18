import { request } from 'umi';

export async function addOnePlan(fields, pGeneralCaseId) {
  return request('/api/plan/addOnePlan', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      pageId: fields.pageSelected,
      name: fields.caseName,
      priority: fields.casePriority,
      parameters: fields.caseParams,
      expectedResult: fields.caseResult,
      steps: fields.caseSteps,
      generalCaseId: pGeneralCaseId
    },
  });
}

export async function getPlanById(params, pGeneralCaseId) {
  return request('/api/plan/getPlanById', { 
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

export async function getPlanByParams(params, options){
  return request('/api/plan/getPlanByParams', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      params:{
        appId: params.app,
        moduleId: params.module,
        functionId: params.function,
        name: params.name,
        state: params.state,
        priority: params.priority,
        testType: params.testType,
      },
      pageInfo:{
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}

export async function updateById(fields, pid){
  return request('/api/plan/updateById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pid,
      name: fields.caseName,
      steps: fields.caseSteps,
      parameters: fields.caseParams,
      priority: fields.casePriority,
      expectedResult: fields.caseResult,
    },
  });
}

export async function deleteById(pId){
  return request('/api/plan/deleteById', { 
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
  return request('/api/plan/deleteByIds', { 
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
  return request('/api/plan/deactivateById', { 
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
  return request('/api/plan/deactivateByIds', { 
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
  return request('/api/plan/activateById', { 
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
  return request('/api/plan/activateByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function cronExplain(pCron){
  return request('/api/plan/cronExplain', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      cron: pCron
    },
  });
}

export async function getAPITestCaseByPlanId(params, options, pId){
  return request('/api/plan/getAPITestCaseByPlanId', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      params:{
        id: pId
      },
      pageInfo:{
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}