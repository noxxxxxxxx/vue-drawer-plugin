<template>
  <div id="app">
    <button @click="open">open drawer</button>
    <vue-drawer
      :visible.sync="visible"
      class="test-wrap-class"
      title="header"
      width="70vw"
      height="200px"
      @opened="opened"
      :before-close="handleClose"
      :wrap-style="{ border: '1px solid #ddd' }"
      :body-style="{ background: '#ddd' }"
      :mask-closeable="true"
      :show-close="true"
    >
      <div>drawer connent</div>
      <button @click="open2">open another drawer</button>
    </vue-drawer>
    <vue-drawer
      :visible.sync="visible2"
      width="40vw"
      height="200px"
      title="this is title"
      :close-on-press-escape="true"
    >
      <div>drawer connent</div>
      <button class="open2">open another</button>
    </vue-drawer>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      visible: true,
      visible2: false,
      mask: {
        color: "#ddd"
      }
    };
  },
  methods: {
    open() {
      this.visible = true;
    },
    open2() {
      this.visible2 = true;
    },
    close() {
      this.visible = false;
    },
    close2() {
      this.visible2 = false;
    },
    closeRightNow() {
      console.log("2 - close right now");
    },
    triggerClose() {
      console.log("trigger close");
    },
    triggerClose2() {
      console.log("trigger close 2");
    },
    handleClose(done) {
      console.log("before close");
      done();
    },
    handleClose2(done) {
      done();
    },
    closed() {
      console.log("3 - closed");
    },
    opened() {
      console.log("1 - opened");
    }
  }
};
</script>

<style lang="scss">
#app {
  .list {
    height: 200px;
    border-bottom: 10px solid #ddd;
  }
  .list-a {
    background-color: #ccc;
  }
}
</style>
