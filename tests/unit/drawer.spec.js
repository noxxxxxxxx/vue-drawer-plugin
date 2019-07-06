import Vue from "vue";
import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Drawer from "../../packages/drawer/src/drawer.vue";
import DrawerPlugin from "../../packages/drawer";
import { wrap } from "module";

function getRendered(Component, propsData) {
  const Constructor = Vue.extend(Component);
  const vm = new Constructor({ propsData: propsData }).$mount();
  return vm.$el;
}

describe('Installation Cases', () => {
  const testComponent = {
    template: '<vue-drawer />',
  }
  test('install component by plugin way when passed', () => {
    const localVue = createLocalVue()
    localVue.use(DrawerPlugin)
    const wrapper = shallowMount(testComponent, {
      localVue
    })
    expect(wrapper.find(Drawer).exists()).toBeTruthy()
  })
  test('install component by component way when passed', () => {
    const localVue = createLocalVue()
    localVue.component(Drawer.name, Drawer)
    const wrapper = shallowMount(testComponent, {
      localVue
    })
    expect(wrapper.find(Drawer).exists()).toBeTruthy()
  })
})

describe('Using Cases', () => {
  test('renders with default style when passed', () => {
    const localVue = createLocalVue()
    localVue.use(DrawerPlugin)
    const wrapper = mount({
      template: '<vue-drawer :visible.sync="visible"/>',
      data () {
        return {
          visible: true
        }
      }
    }, {
      localVue,
      attachToDocument: true
    })
    expect(wrapper.find('.drawer-content-wrapper').attributes().style).toMatch('width: 256px; height: 100%; transform: translateX(100%);')
  });
  
  test('render close button when passed', () => {
    const wrapper = shallowMount(Drawer, {
      propsData: {
      visible: true,
      showClose: true
    }});
    expect(wrapper.find('.drawer-close')).toBeTruthy()
  });
})
