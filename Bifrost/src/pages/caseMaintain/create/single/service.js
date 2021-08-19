import { request } from 'umi';

export async function getSystems() {
  return request('/api/getSystems');
}

export async function getSystems2() {
  return request('/api/getSystems2');
}
