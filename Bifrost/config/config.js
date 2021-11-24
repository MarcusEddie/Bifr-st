// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
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
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
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
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      icon: 'dashboard',
      routes: [
        {
          name: 'workplace',
          icon: 'smile',
          path: '/dashboard/workplace',
          component: './dashboard/workplace',
        },
      ],
    },
    {
      name: 'caseMaintain',
      icon: 'highlight',
      path: '/caseMaintain',
      routes: [
        {
          path: '/caseMaintain/create',
          name: 'create',
          component: './caseMaintain/create',
          icon: 'smile',
          routes: [
            {
              path: 'caseMaintain/create',
              redirect: '/caseMaintain/create/mindMap'
            },
            {
              name: 'mindMap',
              icon: 'smile',
              path: '/caseMaintain/create/mindMap',
              component: './caseMaintain/create/mindMap',
            },
            {
              name: 'single',
              icon: 'smile',
              path: '/caseMaintain/create/single',
              component: './caseMaintain/create/single',
            },
          ],
        },
        {
          name: 'dashboard',
          icon: 'smile',
          path: '/caseMaintain/dashboard',
          component: './caseMaintain/dashboard',
        },
      ],
    },
    {
      name: 'interfaceTest',
      icon: 'ApiOutlined',
      path: '/interfaceTest',
      routes: [
        {
          path: '/interfaceTest/create',
          name: 'create',
          icon: 'smile',
          component: './interfaceTest/create',
        },
        {
          path: '/interfaceTest/dashboard',
          name: 'dashboard',
          icon: 'smile',
          component: './interfaceTest/dashboard',
        },
        {
          path: '/interfaceTest/apis',
          name: 'apis',
          icon: 'smile',
          component: './interfaceTest/apis',
        },
        {
          path: '/interfaceTest/dbConn',
          name: 'dbConn',
          icon: 'smile',
          component: './interfaceTest/dbConn',
        },
      ],
    },
    {
      name: 'uiTest',
      icon: 'AppstoreAddOutlined',
      path: '/uiTest',
      routes: [
        {
          name: 'create',
          path: '/uiTest/create',
          component: './uiTest/create',
          icon: 'smile',
        },
        {
          name: 'dashboard',
          path: '/uiTest/dashboard',
          component: './uiTest/dashboard',
          icon: 'smile',
        },
        {
          path: '/uiTest/singlePage',
          name: 'singlePage',
          icon: 'smile',
          component: './uiTest/singlePage',
        },
      ],
    },
    {
      name: 'chaosTest',
      icon: 'AimOutlined',
      path: '/chaosTest',
      routes: [
        {
          name: 'create',
          path: '/chaosTest/create',
          component: './chaosTest/create',
          icon: 'smile',
        },
        {
          name: 'dashboard',
          path: '/chaosTest/dashboard',
          component: './chaosTest/dashboard',
          icon: 'smile',
        },
      ],
    },
    {
      name: 'execPlan',
      icon: 'ScheduleOutlined',
      path: '/execPlan',
      routes: [
        {
          name: 'create',
          path: '/execPlan/create',
          component: './execPlan/create',
          icon: 'smile',
        },
        {
          name: 'dashboard',
          path: '/execPlan/dashboard',
          component: './execPlan/dashboard',
          icon: 'smile',
        },
      ],
    },
    {
      name: 'execHistory',
      icon: 'HistoryOutlined',
      path: '/execHistory',
      routes: [
        {
          name: 'queue',
          path: '/execHistory/queue',
          component: './execHistory/queue',
          icon: 'smile',
        },
        {
          name: 'history',
          path: '/execHistory/history',
          component: './execHistory/history',
          icon: 'smile',
        },
      ],
    },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      routes: [
        {
          name: 'settings',
          icon: 'smile',
          path: '/account/settings',
          component: './account/settings',
        },
      ],
    },
    {
      name: 'controlPane',
      icon: 'SettingOutlined',
      path: '/controlPane',
      routes: [
        {
          name: 'center',
          icon: 'smile',
          path: '/controlPane/center',
          component: './controlPane/center',
        },
        {
          name: 'settings',
          icon: 'smile',
          path: '/controlPane/settings',
          component: './controlPane/settings',
        },
      ],
    },
    {
      path: '/',
      redirect: '/dashboard/workplace',
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
