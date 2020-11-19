// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Ant Design Pro',
    locale: true,
    ...defaultSettings,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: '注册结果页',
          icon: 'smile',
          path: '/user/registerresult',
          component: './user/UserRegisterResult',
        },
        {
          name: '注册页',
          icon: 'smile',
          path: '/user/register',
          component: './user/UserRegister',
        },
      ],
    },
    {
      path: '/welcome',
      name: 'welcome',
      icon: 'smile',
      component: './Welcome',
    },
    {
      name: '订单管理',
      icon: 'table',
      path: '/order',
      apiPath:"/api/auth/order",
      access: 'normalRouteFilter',
      routes: [
        {
          name: '我的订单',
          path: '/order/mine',
          component: './order/mine',
          apiPath:"/api/auth/order/mine",
          access: 'normalRouteFilter',
        },
      ],
    },
    {
      name: '基础档案',
      icon: 'table',
      path: '/setting',
      apiPath:"/api/auth/setting",
      access: 'normalRouteFilter',
      routes: [
        {
          name: '网点管理',
          path: '/setting/office',
          component: './setting/office',
          apiPath:"/api/auth/setting/office",
          access: 'normalRouteFilter',
        },
        {
          name: '角色管理',
          path: '/setting/role',
          component: './setting/role',
          apiPath:"/api/auth/setting/role",
          access: 'normalRouteFilter',
        },
        {
          name: '用户管理',
          path: '/setting/user',
          component: './setting/user',
          apiPath:"/api/auth/setting/user",
          access: 'normalRouteFilter',
        },
      ],
    },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
