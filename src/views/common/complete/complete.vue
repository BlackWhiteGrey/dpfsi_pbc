<template>
  <div class="view-layout">
    <div class="main">
      <div class="header">
        <h1>提交成功！</h1>
      </div>
      <div class="content">
        <p>您填写的调研问卷已经提交成功，感谢您的反馈！</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.view-layout {
  width: 100%;
  height: 100vh;
  padding: 20px 0;
  background-color: rgb(237, 240, 248);
}

.view-layout .main {
  width: 800px;
  height: auto;
  margin: 0 auto;
  padding-bottom: 30px;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 5px 1px rgba(124, 124, 124, 0.2);
  box-shadow: 0 2px 5px 1px rgba(124, 124, 124, 0.2);
}

.view-layout .header {
  padding: 15px 20px;
  height: auto;
  min-height: 33px;
  border-bottom: 2px dotted #eee;
}

.view-layout .header h1 {
  text-align: center;
}

.view-layout .content {
  padding: 20px;
  text-align: center;
  font-size: 16px;
}

.view-layout .footer {
  margin-top: 10px;
  padding-top: 10px;
  text-align: center;
  border-top: 1px dotted #eee;
}
</style>
