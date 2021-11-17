import { request } from 'umi';

export async function getLogsByDataIdAndFunc(pDataId, pFuncTag, params) {
  return request('/api/actionLogs/getLogsByDataIdAndFunc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      params: {
        dataId: pDataId,
        funcTag: pFuncTag
      },
      pageInfo: {
        current: params.current,
        pageSize: params.pageSize
      }
    },
  });
}
