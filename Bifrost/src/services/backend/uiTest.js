import { request } from 'umi';

export async function saveOneUiTestCase(fields, pGeneralCaseId) {
  return request('/api/uiTest/saveUiTest', { 
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

export async function getUiTestCaseByGeneralCaseId(params, pGeneralCaseId) {
  return request('/api/uiTest/getUiTestCasesByParams', { 
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

export async function getUiTestCasesByParams(params, options){
  return request('/api/uiTest/getUiTestCasesByParams', { 
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

export async function updateUiTestCaseDetails(fields, pid){
  return request('/api/uiTest/updateUiTestCaseDetails', { 
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

export async function delUiTestCaseById(pId){
  return request('/api/uiTest/delUiTestCaseById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function delUiTestCaseByIds(pIds){
  return request('/api/uiTest/delUiTestCaseByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
} 

export async function deactivateUiTestCaseById(pId){
  return request('/api/uiTest/deactivateUiTestCaseById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deactivateUiTestCaseByIds(pIds){
  return request('/api/uiTest/deactivateUiTestCaseByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function activateUiTestCaseById(pId){
  return request('/api/uiTest/activateUiTestCaseById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function activateUiTestCaseByIds(pIds){
  return request('/api/uiTest/activateUiTestCaseByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}