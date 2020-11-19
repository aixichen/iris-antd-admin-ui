import { request } from 'umi';
import { TableListParams, TableListItem } from './data.d';
export const listApi:string="/api/auth/setting/office/list";
export const deleteApi:string="/api/auth/setting/office/delete";
export const createApi:string="/api/auth/setting/office/create";
export const updateApi:string="/api/auth/setting/office/update";

export async function queryOffice(params?: TableListParams) {
  return request(listApi, {
    params,
  });
}

export async function removeOffice(params: { ids: number[] }) {
  return request(deleteApi, {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function addOffice(params: Partial<TableListItem>) {
  return request(createApi, {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateOffice(params:  Partial<TableListItem>) {
  return request(updateApi, {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
