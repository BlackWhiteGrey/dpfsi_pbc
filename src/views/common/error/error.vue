<template>
  <div class="view-body">
    <div class="view-layout">
      <div class="content">
        <div id="lottie_box"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as animationData from '../../../../static/js/404.json';

export default {
  name: 'Lottie',
  data() {
    return {
      lottie: {},
    };
  },
  methods: {
    suspendFun: function () {
      this.lottie.pause();
    },
    startFun: function () {
      this.lottie.play();
    },
  },
  mounted() {
    this.lottie = lottie.loadAnimation({
      container: document.getElementById('lottie_box'),
      renderer: 'svg',
      loop: true,
      animationData: animationData,
    });
  },
};
</script>

<style scoped>
.view-body {
  background-color: #f3f3f3;
  background-repeat: repeat-x;
  background-size: 1px 300px;
  min-height: 100%;
  overflow: hidden;
}
.view-layout {
  width: 100%;
  height: 100vh;
}

.view-body .content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
</style>
