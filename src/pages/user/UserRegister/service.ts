import { UserRegisterParams,UserRegisterCodeParams } from './index';
import { request } from 'umi';

export async function fakeRegister(params: UserRegisterParams) {
  return request('/api/access/register', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegisterCode(params: UserRegisterCodeParams) {
  return request('/api/access/register/code', {
    method: 'POST',
    data: params,
  });
}
