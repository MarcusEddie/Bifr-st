import { request } from 'umi';

export async function saveOneCase(fields, pFuncId) {
  return request('/api/testcase/saveOneCase', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      functionId: pFuncId,
      name: fields.caseNameForm,
      description: fields.caseDesriptionForm,
      steps: fields.caseStepsForm,
      results: fields.caseExpectedRsForm
    },
  });
}

export async function updateTestCase(fields, pid) {
  return request('/api/testcase/updateTestCase', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pid,
      name: fields.caseName,
      description: fields.caseDesription,
      steps: fields.caseSteps,
      results: fields.caseExpectedRs
    },
  });
}
export async function saveMultiCases(fields, pFuncId) {
  return request('/api/testcase/saveMultiCases', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      functionId: pFuncId,
      rawJson: fields
    },
  });
}

export async function getRawDataByFunctionId(pFuncId) {
  return request('/api/testcase/getRawDataByFunctionId', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      functionId: pFuncId
    },
  });
}

export async function getTestCasesByParams(params, options){
  return request('/api/testcase/getTestCasesByParams', { 
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
      },
      pageInfo:{
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}

export async function getTestCaseState(){
  return request('/api/testcase/getState');
}

export async function deactivateTestCaseById(pId){
  return request('/api/testcase/deactivateById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function deactivateTestCaseByIds(pIds){
  return request('/api/testcase/deactivateByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function activateTestCaseById(pId){
  return request('/api/testcase/activateById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function activateTestCaseByIds(pIds){
  return request('/api/testcase/activateByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}

export async function delTestCaseById(pId){
  return request('/api/testcase/deleteById', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      id: pId
    },
  });
}

export async function delTestCaseByIds(pIds){
  return request('/api/testcase/deleteByIds', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ids: pIds
    },
  });
}
