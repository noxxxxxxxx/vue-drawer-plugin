import Drawer from "./src/drawer.vue";

// 为组件提供 install 安装方法，供按需引入
Drawer.install = function(Vue) {
  Vue.component(Drawer.name, Drawer);
};

// 默认导出组件
export default Drawer;
