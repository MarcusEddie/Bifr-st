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
  return request('/api/apiTest/getApiTestCaseByGeneralCaseId', { 
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

