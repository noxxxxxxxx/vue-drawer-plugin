// 导入颜色选择器组件
import Drawer from "./drawer";

// 存储组件列表
const components = [Drawer];

const install = function(Vue) {
  if (install.installed) return;
  components.map(component => Vue.component(component.name, component));
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Drawer
};
