
import { OptionType } from '@/services/data';
import { request } from 'umi';
import { TableListParams, TableListItem } from './data.d';

export const listApi:string="/api/auth/setting/user/list";
export const deleteApi:string="/api/auth/setting/user/delete";
export const createApi:string="/api/auth/setting/user/create";
export const updateApi:string="/api/auth/setting/user/update";
export const roleApi:string="/api/auth/setting/user/role";
export const officeApi:string="/api/auth/setting/user/office";

const userIsDisableOption: OptionType[] = [
  {
    label: '禁止登录',
    value: 1,
  },
  {
    label: '允许登录',
    value: 2,
  },
];

const userTypeOption: OptionType[] = [
  {
    label: '客户',
    value: 1,
  },
  {
    label: '平台',
    value: 2,
  },
  {
    label: '金融',
    value: 3,
  },
];


export async function query(params?: TableListParams) {
  return request(listApi, {
    params,
  });
}

export async function getAllUserRole() {
  return request(roleApi, {});
}
export async function getAllUserOffice() {
  return request(officeApi, {});
}

export async function remove(params: { ids: number[] }) {
  return request(deleteApi, {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function add(params: TableListItem) {
  return request(createApi, {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function update(params: TableListItem) {
  return request(updateApi, {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}


export async function getIsDisableOption() {
  return userIsDisableOption;
}

export async function getUserTypeOption() {
  return userTypeOption;
}
