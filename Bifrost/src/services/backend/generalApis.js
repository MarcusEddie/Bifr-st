import { request } from 'umi';

export async function getHttpMethods(){
  return request('/api/generalApis/getHttpMethods');
}

export async function getCasePriority(){
  return request('/api/generalApis/getCasePriority');
}

export async function getCaseCheckMode(){
  return request('/api/generalApis/getCaseCheckMode');
}

export async function getDBType(){
  return request('/api/generalApis/getDBType');
}

export async function getTestType(){
  return request('/api/generalApis/getTestType');
}

export async function getTaskStateInQueue(){
  return request('/api/generalApis/getTaskStateInQueue');
}

export async function getTaskStateInHist(){
  return request('/api/generalApis/getTaskStateInHistory');
}

export async function getTriggerType(){
  return request('/api/generalApis/getTriggerType');
}