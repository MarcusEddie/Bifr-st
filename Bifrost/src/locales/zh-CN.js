import component from './zh-CN/component';
import globalHeader from './zh-CN/globalHeader';
import menu from './zh-CN/menu';
import pwa from './zh-CN/pwa';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pages from './zh-CN/pages';
export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '',
  'layout.user.link.privacy': '',
  'layout.user.link.terms': '',
  'app.copyright.produced': '',
  'app.preview.down.block': '',
  'app.welcome.link.fetch-blocks': '',
  'app.welcome.link.block-list': '',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
