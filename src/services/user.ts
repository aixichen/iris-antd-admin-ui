import { request } from 'umi';

export async function queryCurrent() {
  return request<API.Api>('/api/auth/user/profile');
}

export async function outLogin() {
  return request('/api/auth/user/loginout');
}