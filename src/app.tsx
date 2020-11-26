import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';
import { RequestConfig } from 'umi';
import { RequestOptionsInit } from 'umi-request';
import { getAuthToken } from './utils/utils';
import { notification } from 'antd';

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.UserProfile;
  token?:string;
  fetchUserInfo: () => Promise<API.UserProfile | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const currentUser = await queryCurrent();
     const currentUserData=currentUser.data

      return currentUserData;
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (!(history.location.pathname === '/user/login' || history.location.pathname === '/user/register' ||history.location.pathname === '/user/registerresult')) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.UserProfile;token:string };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { currentUser } = initialState;
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!currentUser && !(location.pathname === '/user/login'||location.pathname === '/user/register'||location.pathname === '/user/registerresult')) {
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};


const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status } = response;

    notification.error({
      message: `请求错误 ${status}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

const requestInterceptors = (url?: string, options?: RequestOptionsInit) => {
  return {
    url,
    options: {
      ...options,
      headers: {
        Authorization: 'Bearer ' + getAuthToken(),
      },
    },
  };
};

export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [requestInterceptors],
};

