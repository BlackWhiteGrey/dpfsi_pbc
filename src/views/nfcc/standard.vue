<template>
  <div>
    <Row
      style="
        padding: 12px 24px;
        box-shadow: rgb(0 0 0 / 75%) 0px -5px 10px 0px;
        display: flex;
        align-items: center;
      "
    >
      <div class="contact-logo"></div>
      <h1 style="display: inline-block; margin: 0 12px">
        企业领跑者标准批量下载
      </h1>
      <div class="line"></div>
      <div class="com-logo"></div>
    </Row>
    <div class="box">
      <Divider>
        <Upload
          type="drag"
          :action="`${baseURL}/naire/uploadxls`"
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          name="userfile"
          :show-upload-list="false"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :on-progress="handleProgressxls"
          :on-success="handleSuccessxls"
          :on-error="handleErrorxls"
        >
          <div style="padding: 40px 80px">
            <Icon
              v-show="!loading"
              type="ios-cloud-upload"
              size="52"
              style="color: #3399ff"
            ></Icon>
            <p v-show="!loading">导入从领跑者网站下载的标准清单</p>
            <Icon
              v-show="loading"
              type="ios-loading"
              size="52"
              class="spin-icon-load"
              style="color: #3399ff"
            ></Icon>
            <p v-show="loading">正在获取...</p>
          </div>
        </Upload>
      </Divider>
    </div>
    <div class="footer">
      <p>Copyright © 2022 ｜ 重庆国家金融科技认证中心</p>
    </div>
    <a id="download"></a>
  </div>
</template>

<script>
import config from '@/config';
export default {
  data() {
    return {
      baseURL: config.APIBaseURL,
      loading: false,
    };
  },
  methods: {
    // 文件上传成功的回调
    handleSuccessxls(response, file, fileList) {
      console.log(response);
      if (response.err === 0) {
        this.$Loading.finish();
        const a = document.getElementById('download');
        a.href = this.baseURL + response.zip;
        a.click();
        this.loading = false;
        this.$Message.success({
          content: response.msg,
          duration: 5,
        });
      } else {
        this.$Loading.error();
        this.$Message.error('上传出错');
      }
    },
    // 文件长传失败的回调
    handleErrorxls(error, file, fileList) {
      console.log(error);
      this.$Message.error('上传出错');
    },
    handleProgressxls(event, file, fileList) {
      this.loading = true;
      this.$Loading.start();
    },
  },
};
</script>

<style>
.box {
  padding: 48px;
}

.footer {
  margin-top: 24px;
  padding: 24px 12px;
  text-align: center;
  color: #999;
}

.spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

.contact-logo {
  width: 48px;
  height: 36px;
  background-image: url('../../assets/lpzlogo.png');
  background-size: 100%;
  background-repeat: no-repeat;
}
.com-logo {
  width: 200px;
  height: 31px;
  margin-left: 12px;
  background-image: url('../../assets/com-logo.png');
  background-size: 100%;
  background-repeat: no-repeat;
}

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ivu-modal {
  top: 0;
}

.line {
  content: '';
  width: 1px;
  height: 36px;
  background: #999;
}
</style>
