import { request } from 'umi';

export async function saveOneApiTestCase(fields, pGeneralCaseId, pHeader) {
  return request('/api/apiTest/saveApiTest', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      apiId: fields.apiSelected,
      name: fields.caseName,
      resultCheckMode: fields.caseCheckMethod,
      parameters: fields.caseParams,
      priority: fields.casePriority,
      expectedResult: fields.caseResult,
      steps: fields.caseSteps,
      dbConnId: fields.caseDBConn,
      querySql: fields.caseDBSQL,
      generalCaseId: pGeneralCaseId,
      header: pHeader
    },
  });
}

export async function getApiTestCaseByGeneralCaseId(params, pGeneralCaseId) {
  return request('/api/apiTest/getApiTestCasesByParams', { 
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

export async function getApiTestCasesByParams(params, options){
  return request('/api/apiTest/getApiTestCasesByParams', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      params:{
        appId: params.app,
        api: {
          moduleId: params.module,
          functionId: params.function,
        },
        name: params.name,
        state: params.state,
        priority: params.priority,
        resultCheckMode: params.resultCheckMode,
      },
      pageInfo:{
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}

export async function updateApiTestCaseDetails(fields, pid, pHeader){
  return request('/api/apiTest/updateApiTestCaseDetails', { 
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
      resultCheckMode: fields.caseCheckMethod,
      expectedResult: fields.caseResult,
      dbConnId: fields.caseDBConn,
      querySql: fields.caseDBSQL,
      header: pHeader
    },
  });
}

export async function delApiTestCaseById(pId){
  return request('/api/apiTest/delApiTestCaseById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function delApiTestCaseByIds(pIds){
  return request('/api/apiTest/delApiTestCaseByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
} 

export async function deactivateApiTestCaseById(pId){
  return request('/api/apiTest/deactivateApiTestCaseById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deactivateApiTestCaseByIds(pIds){
  return request('/api/apiTest/deactivateApiTestCaseByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function activateApiTestCaseById(pId){
  return request('/api/apiTest/activateApiTestCaseById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function activateApiTestCaseByIds(pIds){
  return request('/api/apiTest/activateApiTestCaseByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}