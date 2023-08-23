<template>
  <div style="position: relative; height: 100%">
    <ul>
      <li
        v-for="item in rankdata"
        :key="item.rank"
        style="margin-bottom: 10px; list-style: none"
      >
        <div class="flex-center">
          <span style="width: 30px">
            <Avatar
              v-if="item.rank < 4"
              style="
                color: #ff9e00;
                background-color: #feedd4;
                margin-right: 8px;
              "
              size="small"
              >{{ item.rank }}</Avatar
            >
            <Avatar
              v-if="item.rank >= 4"
              style="
                color: rgb(140, 140, 140);
                background-color: rgb(245, 245, 245);
                margin-right: 8px;
              "
              size="small"
              >{{ item.rank }}</Avatar
            >
          </span>
          <span style="display: inline-block; width: 85%">{{ item.name }}</span>
          <span style="width: 40px; text-align: right">{{ item.score }}</span>
        </div>
      </li>
    </ul>
    <div v-if="rankdata.length == 0" style="text-align: center; height: 100%">
      暂无数据
    </div>
    <Spin fix v-if="spinShow">
      <Icon
        type="ios-loading"
        size="18"
        class="spin-icon-load"
        color="#ff9e00"
      ></Icon>
      <span>正在获取数据</span>
    </Spin>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 0,
    },
    ranktype: {
      type: Number,
      default: 1,
    },
    year: {
      type: String,
      default: '2020',
    },
    province: {
      type: String,
      default: '',
    },
    naireid: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      rankdata: [],
      spinShow: false,
    };
  },
  watch: {
    naireid: function () {
      this.getRankData();
    },
    ranktype: function () {
      this.getRankData();
    },
    province: function () {
      this.getRankData();
    },
  },
  mounted() {
    this.getRankData();
  },
  methods: {
    getRankData() {
      this.spinShow = true;
      this.$http
        .post('/naire/rankdata', {
          size: this.size,
          ranktype: this.ranktype,
          year: this.year,
          province: this.province,
          naireid: this.naireid,
        })
        .then((response) => {
          this.rankdata = response.data.rankdata;
          this.spinShow = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
