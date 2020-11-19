import { request } from 'umi';
import { TableListParams, TableListItem } from './data.d';


export const listApi:string="/api/auth/setting/role/list";
export const deleteApi:string="/api/auth/setting/role/delete";
export const createApi:string="/api/auth/setting/role/create";
export const updateApi:string="/api/auth/setting/role/update";
export const permissionApi:string="/api/auth/setting/role/permission";

export async function queryRule(params?: TableListParams) {
  return request(listApi, {
    params,
  });
}

export async function getAllRulePermission() {
  return request(permissionApi, {});
}

export async function removeRule(params: { ids: number[] }) {
  return request(deleteApi, {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListItem) {
  return request(createApi, {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request(updateApi, {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
