import lrz from 'lrz';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthToken() {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const str=localStorage.getItem('antd-pro-auth-token');
  const authorityString = str===null?"":str;
  // authorityString could be admin, "admin", ["admin"]

  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return authority;
  }
  return authority;
}
export function setAuthToken(authority:string) {
  const proAuthority = authority;
  return localStorage.setItem('antd-pro-auth-token', JSON.stringify(proAuthority));
}


export function getApiServer() {
  const config = {
    development: {
      API_SERVER: 'http://127.0.0.1:8080',
    },
    test: {
      API_SERVER: 'http://ccb.car-helper.com',
    },
    production: {
      API_SERVER: '',
    },
  };
  let resultStr=""
  if (process.env.NODE_ENV){
    resultStr=config[process.env.NODE_ENV].API_SERVER;
  }
  return resultStr;
}


export async function imageFileCompression(file:any) {
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    const compressedFiles = await lrz(file, { quality: 0.1 })
      .then((rst:any) => {
        const originFile = rst.origin;
        const { file: compressionFile } = rst;
        compressionFile.uid = originFile.uid;
        compressionFile.name = originFile.name;
        return { file: compressionFile };
      })
      .catch(() => {
        return { file };
      });
    return compressedFiles.file;
  }
  return true;
}

