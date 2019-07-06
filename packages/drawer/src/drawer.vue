<template>
  <div
    :class="[
      'vue-drawer',
      `vue-drawer-${placement}`,
      visible && 'vue-drawer-open',
      className
    ]"
    :style="containerStyle"
    v-if="rendered"
  >
    <div
      class="mask"
      v-show="mask"
      @click="handleMaskClick"
      :style="maskStyle"
    ></div>
    <div
      class="drawer-content-wrapper"
      :style="{
        width: widthStyle,
        height: heightStyle,
        transform: translateDirection
      }"
    >
      <div class="drawer-content">
        <slot name="title">
          <div class="drawer-header" v-if="showHeader">
            <slot name="header">
              <div class="drawer-title">{{ title }}</div>
            </slot>
            <button
              v-if="showClose"
              @click="handleClose"
              class="drawer-close close"
            ></button>
          </div>
        </slot>
        <div class="drawer-body" :style="bodyStyle">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "vue-drawer",
  props: {
    showClose: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    maskCloseable: {
      type: Boolean,
      default: true
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    wrapStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    bodyStyle: {
      type: Object,
      default: function() {
        return {};
      }
    },
    title: {
      type: String,
      default: ""
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 256
    },
    height: {
      type: [String, Number],
      default: 256
    },
    className: {
      type: String,
      default: ""
    },
    zIndex: {
      type: Number,
      default: 1000
    },
    placement: {
      type: String,
      default: "right"
    },
    opened: Function,
    beforeClose: Function,
    afterVisibleChange: Function,
    closeOnPressEscape: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      closed: false,
      rendered: false,
      firstEnter: false,
      transitionEndFlag: true,
      translateDirection: "translateX(100%)"
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.handleEsc(this.handleClose);
        this.closed = false;
        this.transitionEndFlag = true;
        this.$emit("open");
        if (this.rendered) {
          this.translateDirection = this.updateTransition(this.visible);
          return;
        }
        document.body.appendChild(this.$el);
        this.rendered = true;
        setTimeout(() => {
          this.transitionEnd();
          this.translateDirection = this.updateTransition(this.visible);
        }, 200);
      } else {
        // 关闭的回调
        this.transitionEndFlag = true;
        if (!this.closed) this.$emit("close");
        this.translateDirection = this.updateTransition(this.visible);
      }
    }
  },
  computed: {
    widthStyle: function() {
      if (this.placement === "left" || this.placement === "right") {
        if (Number(this.width) >= 0) {
          return this.width + "px";
        }
        return this.width;
      }
      return "100%";
    },
    heightStyle: function() {
      if (this.placement === "top" || this.placement === "bottom") {
        if (Number(this.height) >= 0) {
          return this.height + "px";
        }
        return this.height;
      }
      return "100%";
    },
    containerStyle: function() {
      const style = {};
      for (let i in this.wrapStyle) {
        style[i] = this.wrapStyle[i];
      }
      style.zIndex = this.zIndex;
      return style;
    }
  },
  methods: {
    updateTransition(value) {
      const direction = {
        left: value ? "translateX(0)" : "translateX(-100%)",
        right: value ? "translateX(0)" : "translateX(100%)",
        top: value ? "translateY(0)" : "translateY(-100%)",
        bottom: value ? "translateY(0)" : "translateY(100%)"
      };
      return direction[this.placement];
    },
    handleMaskClick() {
      if (!this.maskCloseable) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === "function") {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit("update:visible", false);
        this.$emit("close");
        this.closed = true;
      }
    },
    afterEnter() {
      this.$emit("opened");
    },
    afterLeave() {
      this.$emit("closed");
    },
    // 监听动画
    transitionEnd() {
      if (this.firstEnter) return;
      this.firstEnter = true;
      let transitionEndEvent = "transitionend";
      if (
        window.ontransitionend === undefined &&
        window.onwebkittransitionend !== undefined
      ) {
        transitionEndEvent = "webkitTransitionEnd";
      }
      this.$el.addEventListener(
        transitionEndEvent,
        () => {
          if (!this.transitionEndFlag) return;
          this.transitionEndFlag = false;
          if (this.visible) {
            this.afterEnter();
          } else {
            this.afterLeave();
          }
        },
        false
      );
    },
    handleEsc(value) {
      if (this.closeOnPressEscape) {
        if (window.vueDrawer) {
          window.vueDrawer.push(value);
          return;
        }
        window.vueDrawer = [value];
        window.addEventListener("keydown", event => {
          if (event.keyCode === 27) {
            const handler = window.vueDrawer.pop();
            handler && handler();
          }
        });
      }
    },
    init(visible, rendered) {
      if (visible) {
        this.handleEsc(this.handleClose);
        this.$emit("open");
        if (!rendered) {
          document.body.appendChild(this.$el);
          setTimeout(() => {
            this.transitionEnd();
            this.translateDirection = this.updateTransition(this.visible);
          }, 200);
          return true;
        }
        return false;
      }
      return false;
    }
  },
  mounted() {
    this.rendered = this.init(this.visible, this.rendered);
  },
  destroyed() {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
      this.$el.removeEventListener("transitionend", () => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.close {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;

  /* bouton X */
  &:after,
  &:before {
    content: "";
    position: absolute;
    height: 18px;
    width: 1px;
    background-color: rgba(0, 0, 0, 0.45);
    top: 19px;
    left: 50%;
    margin-left: -1px;
    transform: rotate(45deg);
    transition: all 200ms ease-in;
  }
  &:before {
    transform: rotate(-45deg);
  }
}
.vue-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: rgba(0, 0, 0, 0.65);
    opacity: 0;
    filter: alpha(opacity=50);
    transition: opacity 0.3s linear, height 0s ease 0.3s;
  }
  .drawer-content-wrapper {
    position: fixed;
    width: 256px;
    transition: transform 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    .drawer-content {
      position: relative;
      z-index: 1;
      background-color: #fff;
      background-clip: padding-box;
      height: 100%;
      .drawer-header {
        position: relative;
        padding: 16px 24px;
        color: rgba(0, 0, 0, 0.65);
        background: #fff;
        border-bottom: 1px solid #e8e8e8;
        border-radius: 4px 4px 0 0;
      }
      .drawer-close {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 10;
        display: block;
        width: 56px;
        height: 56px;
        padding: 0;
        background: transparent;
        border: 0;
        outline: 0;
        cursor: pointer;
        transition: color 0.3s;
        text-rendering: auto;
        &:hover {
          &:after,
          &:before {
            background-color: rgba(0, 0, 0, 0.75);
          }
        }
      }
      .drawer-title {
        margin: 0;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
      }
      .drawer-body {
        position: relative;
      }
    }
  }
  &.vue-drawer-left {
    .drawer-content-wrapper {
      left: 0;
      height: 100%;
    }
  }
  &.vue-drawer-right {
    .drawer-content-wrapper {
      right: 0;
      height: 100%;
    }
  }
  &.vue-drawer-top {
    .drawer-content-wrapper {
      top: 0;
      width: 100%;
    }
  }
  &.vue-drawer-bottom {
    .drawer-content-wrapper {
      bottom: 0;
      width: 100%;
    }
  }
  &.vue-drawer-open {
    display: block;
    width: 100%;
    .mask {
      height: 100%;
      opacity: 0.3;
      transition: none;
      animation: fadeIn 0.3s cubic-bezier(0.7, 0.3, 0.1, 1);
    }
    .drawer-content-wrapper {
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.3;
  }
}
</style>
