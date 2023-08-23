<template>
  <div id="viewBox" class="view-body">
    <div class="view-layout">
      <Spin size="large" fix v-show="spinShow"></Spin>
      <div class="main" v-show="isNotPublish && !isAdmin">
        <div class="header">
          <h1>问卷未发布！</h1>
        </div>
        <div class="content">
          <p>您所填写的问卷未发布，暂不能填写。</p>
        </div>
      </div>
      <div class="main" v-show="!isNotPublish && isExpired && !isAdmin">
        <div class="header">
          <h1>问卷已过期！</h1>
        </div>
        <div class="content">
          <p>您所填写的问卷已到截止日期，暂不能填写。</p>
        </div>
      </div>
      <div
        class="main"
        v-show="!spinShow && ((!isExpired && !isNotPublish) || isAdmin)"
      >
        <div class="header" style="position: relative">
          <h1>{{ naire.title }}</h1>
          <div class="intro">
            <Alert style="padding: 8px 16px">
              <table>
                <tr>
                  <td width="90" class="info-title">调研说明</td>
                  <td>：</td>
                  <td>{{ naire.intro }}</td>
                </tr>
                <tr>
                  <td width="90" class="info-title">截止日期</td>
                  <td>：</td>
                  <td>{{ naire.deadline | timeFormat }}</td>
                </tr>
                <tr v-if="!isLogin">
                  <td width="90" class="info-title">调研区域</td>
                  <td>：</td>
                  <td>{{ naire.area === '' ? '全国' : naire.area }}</td>
                </tr>
                <tr v-if="!isLogin">
                  <td width="90" class="info-title">调研机构类别</td>
                  <td>：</td>
                  <td>
                    {{ naire.category === '' ? '所有类别' : naire.category }}
                  </td>
                </tr>
                <tr v-if="isAdmin && isLogin">
                  <td width="90" class="info-title">机构名称</td>
                  <td>：</td>
                  <td>{{ loginUser.u_company }}</td>
                </tr>
                <tr
                  v-if="
                    isLogin &&
                    loginUser.u_leicode !== '' &&
                    loginUser.u_leicode !== null
                  "
                >
                  <td width="90" class="info-title">LEI代码</td>
                  <td>：</td>
                  <td>{{ loginUser.u_leicode }}</td>
                </tr>
                <tr v-if="isLogin">
                  <td width="90" class="info-title">机构类别</td>
                  <td>：</td>
                  <td>{{ loginUser.u_category }}</td>
                </tr>
                <tr v-if="isLogin">
                  <td width="90" class="info-title">所在省市区</td>
                  <td>：</td>
                  <td>
                    {{ loginUser.u_province }}-{{ loginUser.u_city }}-{{
                      loginUser.u_region
                    }}
                  </td>
                </tr>
                <tr v-if="isLogin && isAudited()">
                  <td width="90" class="info-title">审核机构</td>
                  <td>：</td>
                  <td>{{ loginUser.auditpbc }}</td>
                </tr>
                <tr v-if="isLogin && isAudited()">
                  <td width="90" class="info-title">审核时间</td>
                  <td>：</td>
                  <td>{{ auditpbctime }}</td>
                </tr>
                <tr
                  v-if="isLogin && naire.attach !== '' && naire.attach !== null"
                >
                  <td width="90" class="info-title">标准文本</td>
                  <td>：</td>
                  <td>
                    <Button
                      size="small"
                      type="primary"
                      style="display: inline-block"
                      :to="`${baseURL}` + naire.attach"
                      target="_blank"
                      >点击下载</Button
                    >
                  </td>
                </tr>
              </table>
            </Alert>
            <div
              class="canvas-seal"
              v-bind:class="{
                'canvas-seal-active': hasSubmited,
                'canvas-seal-default':
                  this.r_status === '1' || this.r_status === '2',
              }"
            >
              <canvas id="canvas" width="200" height="200"></canvas>
            </div>
          </div>
          <div class="user-info">
            <Form
              v-show="!isLogin && !isAdmin"
              ref="userInfo"
              :model="userInfo"
              :rules="userInfoRule"
              inline
            >
              <FormItem prop="name">
                <Input
                  v-model="userInfo.u_code"
                  placeholder="请输入LEI编码"
                  style="width: 220px"
                ></Input>
              </FormItem>
              <FormItem prop="identity">
                <Input
                  v-model="userInfo.u_password"
                  type="password"
                  placeholder="请输入密码"
                  style="width: 220px"
                ></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleLogin('userInfo')"
                  >登录</Button
                >
              </FormItem>
            </Form>
            <Form v-show="isLogin">
              <FormItem>
                <div style="width: 50%; float: left">
                  <Button
                    v-show="isLogin && !isAdmin"
                    @click="
                      () => {
                        this.pwdmd = true;
                      }
                    "
                    >修改密码</Button
                  >
                </div>
                <div style="width: 50%; float: right; text-align: right">
                  <Button
                    type="primary"
                    v-show="isLogin && finished && !isAdmin && !isAudited()"
                    @click="edit()"
                    >再次编辑</Button
                  >
                </div>
              </FormItem>
            </Form>
            <Form v-show="isLogin">
              <FormItem>
                <div
                  v-show="!isAudited()"
                  style="width: 100%; text-align: center"
                >
                  <Button
                    type="warning"
                    v-show="isLogin && isAdmin"
                    @click="audit()"
                    >审核通过</Button
                  >
                </div>
                <div
                  v-show="isAudited()"
                  style="width: 100%; text-align: center"
                >
                  <Button
                    type="error"
                    v-show="isLogin && isAdmin"
                    @click="audit()"
                    >取消审核</Button
                  >
                </div>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="content" v-show="!spinShow">
          <div>
            <Row style="text-align: center; padding: 20px 0px; z-index: 20">
              <Col span="8">
                <span style="font-size: 14; font-weight: 600"
                  ><span style="color: rgb(255, 0, 0)">* </span>牵头部门:
                </span>
                <input
                  v-model="u_department"
                  :disabled="finished"
                  class="user-input"
                />
              </Col>
              <Col span="8">
                <span style="font-size: 14; font-weight: 600"
                  ><span style="color: rgb(255, 0, 0)">* </span>联系人:
                </span>
                <input
                  v-model="u_contact"
                  :disabled="finished"
                  class="user-input"
                />
              </Col>
              <Col span="8">
                <span style="font-size: 14; font-weight: 600"
                  ><span style="color: rgb(255, 0, 0)">* </span>联系电话:
                </span>
                <input
                  v-model="u_phone"
                  :disabled="finished"
                  class="user-input"
                />
              </Col>
            </Row>
          </div>
          <questionTable
            :isPreview="finished || !isLogin"
            :question-list="currentQuestionList"
            :current-page="currentPage"
            :page-size="pageSize"
            :result-id="resultId"
            style="z-index: 25"
          >
            <Row
              type="flex"
              justify="end"
              align="middle"
              class="code-row-bg"
              style="position: relative; padding: 16px 0"
            >
              <Page
                style="z-index: 50"
                :total="total"
                :current="currentPage"
                :page-size="pageSize"
                @on-page-size-change="changePageSize"
                @on-change="changePage"
              ></Page>
            </Row>
            <Row
              type="flex"
              justify="center"
              align="middle"
              class="code-row-bg"
              style="margin-top: 32px; position: relative"
            >
              <Button type="success" v-show="isAdmin" @click="goBack"
                >关闭
              </Button>
              <Button
                type="primary"
                style="z-index: 50"
                @click="saveNaire"
                :disabled="finished || !isLogin"
                v-show="!finished && isLogin"
                >保存问卷
              </Button>
              <Button
                type="primary"
                style="z-index: 50"
                @click="submitNaire"
                :disabled="finished || !isLogin"
                v-show="!finished && isLogin"
                >提交问卷
              </Button>
              <Button
                style="z-index: 50"
                v-show="isLogin"
                :loading="downloading"
                @click="downPdf()"
                >下载问卷
              </Button>
            </Row>
          </questionTable>
          <Modal
            v-model="pwdmd"
            title="修改密码"
            :mask-closable="false"
            :closable="false"
          >
            <Form
              ref="PWDForm"
              :model="pwdmodify"
              :rules="pwdmodifyRule"
              :label-width="80"
            >
              <FormItem prop="newpwd" label="新密码">
                <Input
                  type="password"
                  v-model="pwdmodify.newpwd"
                  placeholder="输入新密码"
                >
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
              <FormItem prop="pwdcheck" label="确认密码">
                <Input
                  type="password"
                  v-model="pwdmodify.pwdcheck"
                  placeholder="再次输入新密码"
                >
                  <Icon type="ios-lock-outline" slot="prepend"></Icon>
                </Input>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button
                type="text"
                @click="
                  () => {
                    this.pwdmd = false;
                  }
                "
                >暂不更新</Button
              >
              <Button type="primary" @click="updatePWD">更新密码</Button>
            </div>
          </Modal>
        </div>
        <div class="footer">
          <p>
            2021 · 全国金融标准化技术委员会 ｜ 技术支持：国家金融科技认证中心
          </p>
        </div>
        <BackTop ref="bt"></BackTop>
      </div>
    </div>
  </div>
</template>

<script>
import questionTable from '@/components/questionTable';
import { formatDate } from '../../common/js/utils';
import { createSeal } from '../../common/js/seal';
import config from '@/config';
import sha1 from 'js-sha1';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default {
  components: {
    questionTable,
  },
  filters: {
    timeFormat(value) {
      return formatDate(value);
    },
  },
  data() {
    return {
      ws: {},
      baseURL: config.APIBaseURL,
      naire: {
        topic: [],
      },
      count: 0,
      downloading: false,
      u_department: '',
      u_contact: '',
      u_phone: '',
      r_status: '0',
      finished: false,
      pwdmd: false,
      spinShow: true,
      hasSubmited: false,
      isLogin: false,
      pwdloading: true,
      userId: 0,
      userInfo: {
        u_code: '',
        u_passwword: '',
      },
      loginUser: { u_id: '' },
      userInfoRule: {
        u_code: [{ required: true, message: '请填写LEI编码', trigger: 'blur' }],
      },
      pwdmodify: {
        newpwd: '',
        pwdcheck: '',
      },
      pwdmodifyRule: {
        newpwd: [
          { required: true, message: '请填写新密码', trigger: 'blur' },
          { min: 6, message: '新密码至少6位数', trigger: 'blur' },
        ],
        pwdcheck: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value.trim() === '') {
                return callback(new Error('请输入确认密码'));
              } else if (value !== this.pwdmodify.newpwd) {
                return callback(new Error('两次输入密码不一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
      currentQuestionList: [],
      currentPage: 1,
      pageSize: 50,
      resultId: 0,
      total: 0,
      userIP: '',
    };
  },
  computed: {
    auditpbctime() {
      if (
        this.loginUser.audittime !== null &&
        this.loginUser.audittime !== ''
      ) {
        return formatDate(this.loginUser.audittime);
      } else {
        return '';
      }
    },
    isAdmin() {
      if (localStorage.getItem('isAdmin') === null) {
        return false;
      } else {
        return localStorage.getItem('isAdmin');
      }
    },
    isExpired() {
      return Number(this.naire.deadline) < new Date().getTime();
    },
    isNotPublish() {
      return this.naire.status === '0';
    },
    selectedOptions: function () {
      let so = [];
      this.naire.topic.forEach((tp) => {
        so = so.concat(tp.selectContent);
      });
      return so;
    },
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'fetchData',
  },
  mounted: function () {
    if (this.$route.params.uid !== undefined && this.isAdmin) {
      this.getAdminView();
    } else if (
      sessionStorage.getItem('user') !== '' &&
      sessionStorage.getItem('user') !== null
    ) {
      this.userInfo.u_code = sessionStorage.getItem('user');
      this.userInfo.u_password = sessionStorage.getItem('pwd');
      this.userLogin();
    } else {
      this.fetchData();
    }
  },
  methods: {
    downPdf() {
      // 要导出pdf的节点
      let _this = this;
      this.downloading = true;
      html2canvas(document.body, {
        useCORS: true, // 是否允许网页中img元素跨域，这个设置需要img元素支持及服务器支持
        scale: 1.2, // 这个影响生成图片的清晰度
      }).then((canvas) => {
        var img = new Image();
        img.width = canvas.width;
        img.height = canvas.height;
        img.src = canvas.toDataURL('image/jpeg', 1.0);

        var pdf = jsPDF('', 'pt', 'a4');
        // canvas尺寸
        var canvasWidth = img.width;
        var canvasHeight = img.height;
        var pageData = img.src;
        _this.addImg(pdf, pageData, canvasWidth, canvasHeight);

        pdf.save(_this.naire.title + '.pdf');
        this.downloading = false;
      });
    },
    addImg(pdf, pageData, canvasWidth, canvasHeight) {
      // a4纸的尺寸[595.28,841.89]
      var a4Width = 595.28;
      var a4Height = 841.89;

      // html页面生成的canvas在pdf中图片的宽高
      var imgWidth = a4Width;
      var imgHeight = (a4Width / canvasWidth) * canvasHeight;

      // 一页pdf显示html页面生成的canvas高度;
      var pageHeight = (canvasWidth / a4Width) * a4Height;

      this.addPages(
        pdf,
        pageData,
        0,
        imgWidth,
        imgHeight,
        canvasHeight,
        pageHeight,
        a4Height
      );
    },
    addPages(
      pdf,
      pageData,
      position,
      imgWidth,
      imgHeight,
      canvasHeight,
      pageHeight,
      a4Height
    ) {
      pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
      // 减去已经绘制的区域
      canvasHeight -= pageHeight;
      position -= a4Height;
      // 当还有内容未生成pdf，则新加页面，并添加图片
      if (canvasHeight > 0) {
        pdf.addPage();
        this.addPages(
          pdf,
          pageData,
          position,
          imgWidth,
          imgHeight,
          canvasHeight,
          pageHeight,
          a4Height
        );
      }
    },
    downLoad() {
      let _this = this;
      html2canvas(document.body).then(function (canvas) {
        var type = 'image/jpeg';
        var imgData = canvas.toDataURL(type);
        var _fixType = function (type) {
          type = type.toLowerCase().replace(/jpg/i, 'jpeg');
          var r = type.match(/png|jpeg|bmp|gif/)[0];
          return 'image/' + r;
        };
        // 加工image data，替换mime type
        imgData = imgData.replace(_fixType(type), 'image/octet-stream');

        var saveLink = document.createElementNS(
          'http://www.w3.org/1999/xhtml',
          'a'
        );
        saveLink.href = imgData;
        saveLink.download = _this.naire.title + '.jpg';
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        saveLink.dispatchEvent(event);
      });
    },
    audit() {
      let loginadmin = JSON.parse(localStorage.getItem('USER'));
      if (loginadmin !== null && loginadmin.u_category === '金融管理部门') {
        const now = new Date().getTime();
        this.$http
          .post('/naire/audit', {
            n_id: this.naire.n_id,
            u_id: this.loginUser.u_id,
            audit_time: this.isAudited() ? '' : now,
            audit_pbc: this.isAudited() ? '' : loginadmin.u_company,
          })
          .then((response) => {
            if (response.data.err === 0) {
              this.loginUser.audittime = this.isAudited() ? '' : now;
              if (this.loginUser.audittime === '') {
                this.$Message.success('取消审核成功！');
                createSeal(
                  'canvas',
                  '已完成',
                  '',
                  formatDate(this.loginUser.time)
                );
              } else {
                this.$Message.success('审核成功！');
                this.loginUser.auditpbc = loginadmin.u_company;
                createSeal(
                  'canvas',
                  '已完成',
                  '已审核',
                  formatDate(this.loginUser.time)
                );
              }
            }
          });
      } else {
        this.error(true, '没有审核权限！请登录系统后台。', '');
      }
    },
    // 判断题目关联是否选中
    dependSelected(arr, brr) {
      let samearr = [];
      for (let i = 0; i < arr.length; i++) {
        let temp = arr[i];
        for (let j = 0; j < brr.length; j++) {
          if (brr[j] === temp && temp !== '' && temp !== null) {
            samearr.push(brr[j]);
          }
        }
      }
      if (samearr.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    checkPWD(callback) {
      if (this.pwdmodify.pwdcheck.trim() === '') {
        return callback(new Error('请再次输入新密码'));
      } else if (this.pwdmodify.newpwd !== this.pwdmodify.pwdcheck) {
        return callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
    updatePWD() {
      this.$refs['PWDForm'].validate((valid) => {
        if (valid) {
          this.$http
            .post('/user/updateUserPWD', {
              u_id: this.loginUser.u_id,
              u_password: sha1(this.pwdmodify.newpwd),
            })
            .then((response) => {
              if (response.data.err === 0) {
                this.$Message.success('密码更新成功！');
                this.pwdmd = false;
              }
            });
        }
      });
    },
    edit() {
      this.finished = false;
    },
    userLogin() {
      // 查找用户，返回用户id
      this.$http
        .post('/user/getId', {
          n_id: this.$route.params.nid,
          n_area: '',
          n_category: '',
          u_code: this.userInfo.u_code,
          u_password: this.userInfo.u_password,
        })
        .then((response) => {
          // 用户存在,服务器返回 u_id
          if (response.data.err === 0 && !response.data.data.isFinished) {
            this.fetchData();
            this.isLogin = true;
            this.loginUser = response.data.data;
            this.userId = response.data.data.u_id;
            this.count++;
            this.$Notice.open({
              title: '欢迎您！',
              desc:
                '来自' +
                response.data.data.u_company +
                '的用户，请继续完成问卷内容吧！',
              duration: 5,
            });
            if (
              this.loginUser.u_leicode !== null &&
              this.loginUser.u_leicode.substr(-6) === this.userInfo.u_password
            ) {
              this.pwdmd = true;
            }
          } else if (response.data.err === 2) {
            this.$Notice.warning({
              title: '没有权限',
              desc: '您不属于当前问卷调研范围！',
              duration: 5,
            });
          } else if (response.data.data.isFinished) {
            this.isLogin = true;
            this.loginUser = response.data.data;
            console.log(response.data.data);
            this.userId = response.data.data.u_id;
            this.r_status = response.data.data.r_status;
            this.fetchData();
            // this.hasSubmited = true
            switch (response.data.data.r_status) {
              case '0':
                this.finished = false;
                this.$Modal.warning({
                  title: '您保存的问卷已加载',
                  content: '请继续完成问卷内容吧！',
                });
                break;
              case '1':
                this.finished = true;
                this.$Modal.warning({
                  title: '您已完成问卷',
                  content: '审核通过前重新提交可更新反馈数据！',
                });
                break;
              case '2':
                this.finished = true;
                this.$Modal.warning({
                  title: '您的问卷已被审核通过',
                  content: '如需修改反馈数据请联系审核机构！',
                });
                break;
            }
          } else {
            this.$Notice.warning({
              title: '用户不存在',
              desc: '请确认用户名和密码后重试！',
              duration: 5,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('用户登录失败，请重试');
        });
    },
    // 用户登录
    handleLogin(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // 查找用户，返回用户id
          this.$http
            .post('/user/getId', {
              n_id: this.naire.n_id,
              n_area: this.naire.area,
              n_category: this.naire.category,
              u_code: this.userInfo.u_code,
              u_password: sha1(this.userInfo.u_password),
            })
            .then((response) => {
              // 用户存在,服务器返回 u_id
              if (response.data.err === 0 && !response.data.data.isFinished) {
                this.isLogin = true;
                this.loginUser = response.data.data;
                this.userId = response.data.data.u_id;
                this.$Notice.open({
                  title: '欢迎您！',
                  desc:
                    '来自' +
                    response.data.data.u_company +
                    '的用户，请继续完成问卷内容吧！',
                  duration: 5,
                });
                if (
                  this.loginUser.u_leicode !== null &&
                  this.loginUser.u_leicode.substr(-6) ===
                    this.userInfo.u_password
                ) {
                  this.pwdmd = true;
                }
              } else if (response.data.err === 2) {
                this.$Notice.warning({
                  title: '没有权限',
                  desc: '您不属于当前问卷调研范围！',
                  duration: 5,
                });
              } else if (response.data.data.isFinished) {
                this.isLogin = true;
                this.loginUser = response.data.data;
                console.log(response.data.data);
                this.userId = response.data.data.u_id;
                this.r_status = response.data.data.r_status;
                this.fetchData();
                // this.hasSubmited = true
                switch (response.data.data.r_status) {
                  case '0':
                    this.finished = false;
                    this.$Modal.warning({
                      title: '您保存的问卷已加载',
                      content: '请继续完成问卷内容吧！',
                    });
                    break;
                  case '1':
                    this.finished = true;
                    this.$Modal.warning({
                      title: '您已完成问卷',
                      content: '审核通过前重新提交可更新反馈数据！',
                    });
                    break;
                  case '2':
                    this.finished = true;
                    this.$Modal.warning({
                      title: '您的问卷已被审核通过',
                      content: '如需修改反馈数据请联系审核机构！',
                    });
                    break;
                }
              } else {
                this.$Notice.warning({
                  title: '用户不存在',
                  desc: '请确认用户名和密码后重试！',
                  duration: 5,
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.$Message.error('用户登录失败，请重试');
            });
        } else {
          this.$Message.error('请先填写用户信息!');
        }
      });
    },
    isAudited() {
      return (
        this.loginUser.audittime !== '' && this.loginUser.audittime !== null
      );
    },
    error(nodesc, title, desc) {
      this.$Notice.error({
        title: title,
        desc: nodesc ? '' : desc,
      });
    },
    fetchData() {
      this.$http
        .post('/naire/detail', {
          n_id: this.$route.params.nid,
          u_id:
            this.$route.params.uid !== undefined && this.isAdmin
              ? this.$route.params.uid
              : this.loginUser.u_id,
          // eslint-disable-next-line no-undef
          u_ip: JSON.stringify(returnCitySN),
        })
        .then((response) => {
          if (response.data.err === 0) {
            console.log(response);
            this.naire = response.data.data;
            this.naire.title = this.naire.title.replace('/\n/g', '<br>');
            this.u_department = response.data.contact.department;
            this.u_contact = response.data.contact.contact;
            this.u_phone = response.data.contact.phone;
            this.r_status = response.data.contact.r_status;
            this.total = this.naire.topic.length;
            this.resultId = response.data.contact.r_id;
            this.currentQuestionList = this.naire.topic.slice(
              (this.currentPage - 1) * this.pageSize,
              this.currentPage * this.pageSize
            );
            this.spinShow = false;
            this.$nextTick(() => {
              console.log(this.r_status);
              if (this.r_status === '1' || this.r_status === '2') {
                createSeal(
                  'canvas',
                  '已完成',
                  this.isAudited() ? '已审核' : '',
                  formatDate(this.loginUser.time)
                );
              }
            });
          } else {
            this.$Message.error(response.data.data);
            this.$router.push('/404');
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('获取问卷，请重试');
        });
    },
    changePage(page) {
      this.currentPage = page;
      this.currentQuestionList = this.naire.topic.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
      this.$refs.bt.$el.click();
    },
    changePageSize(pageSize) {
      this.pageSize = pageSize;
      this.changePage(1);
    },
    goBack() {
      // this.$router.push('/platform')
      window.close();
    },
    validateNaire() {
      let _isfinished = true;
      let count = 0;
      if (
        this.u_department === '' ||
        this.u_contact === '' ||
        this.u_phone === ''
      ) {
        this.error(true, '牵头部门及联系方式为必填项，请检查后提交！', '');
        _isfinished = false;
      }
      if (
        !/^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/.test(
          this.u_phone
        ) &&
        !/^(0[0-9]{2,3}-)([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/.test(this.u_phone)
      ) {
        this.error(true, '联系电话有误，请检查后提交！', '');
        this.$Message.info({
          content: '固话格式为010-88888888-分机号。',
          duration: 5,
        });
        _isfinished = false;
      }
      this.naire.topic.forEach((item, index) => {
        count++;
        if (
          item.isRequired &&
          (item.depend === null ||
            this.dependSelected(this.selectedOptions, item.depend.split(',')))
        ) {
          if (item.type === '文本' || item.type === '数值') {
            if (item.hasattach) {
              if (item.attach === null || item.attach === '') {
                this.error(
                  true,
                  '第' + count + '题未上传附件，请检查后提交！',
                  ''
                );
                _isfinished = false;
              }
            } else {
              if (item.selectContent === null || item.selectContent === '') {
                this.error(
                  true,
                  '第' + count + '题为必填项，请检查后提交！',
                  ''
                );
                _isfinished = false;
              }
            }
          }
          if (item.type === '单选') {
            item.options.forEach((o) => {
              if (
                item.selectContent === o.o_id &&
                o.isAddition &&
                !o.addition.trim().length > 0
              ) {
                this.error(true, '请填写第' + count + '题附加信息！', '');
                _isfinished = false;
              }
              if (
                item.selectContent === o.o_id &&
                o.isAddition &&
                item.hasattach
              ) {
                if (item.attach === null || item.attach === '') {
                  this.error(
                    true,
                    '第' + count + '题未上传附件，请检查后提交！',
                    ''
                  );
                  _isfinished = false;
                }
              }
            });
            if (!item.selectContent.trim().length > 0) {
              this.error(true, '第' + count + '题为必填项，请检查后提交！', '');
              _isfinished = false;
            }
          }
          if (item.type === '多选') {
            item.options.forEach((o) => {
              if (
                item.selectMultipleContent.includes(o.o_id) &&
                o.isAddition &&
                !o.addition.trim().length > 0
              ) {
                this.error(true, '请填写第' + count + '题附加信息！', '');
                _isfinished = false;
              }
              if (
                item.selectMultipleContent.includes(o.o_id) &&
                o.isAddition &&
                item.hasattach
              ) {
                if (item.attach === null || item.attach === '') {
                  this.error(
                    true,
                    '第' + count + '题未上传附件，请检查后提交！',
                    ''
                  );
                  _isfinished = false;
                }
              }
            });
            if (!item.selectMultipleContent.length > 0) {
              this.error(true, '第' + count + '题为必填项，请检查后提交！', '');
              _isfinished = false;
            }
          }
        }
      });
      if (!this.isLogin) {
        this.error(true, '请先填写用户信息', '');
        _isfinished = false;
      }
      return _isfinished;
    },
    submitNaire() {
      if (!this.validateNaire()) {
        return;
      }
      console.log(this.naire);
      const _this = this;
      _this.changePage(1);
      const answer = [];
      console.log(this.naire);
      this.naire.topic.forEach((question, index) => {
        if (question.type === '单选') {
          let addition = '';
          question.options.forEach((o) => {
            if (o.o_id === question.selectContent && o.isAddition) {
              addition = o.addition;
            }
          });
          const curQues = {
            q_id: question.q_id,
            o_id: question.selectContent,
            o_addition: addition,
            o_attach: question.attach.trim(),
          };
          answer.push(curQues);
        } else if (question.type === '多选') {
          let additions = {};
          question.options.forEach((o) => {
            if (
              question.selectMultipleContent.includes(o.o_id) &&
              o.isAddition
            ) {
              additions[o.o_id] = o.addition;
            }
          });
          const curQues = {
            q_id: question.q_id,
            o_id: question.selectMultipleContent,
            o_addition: additions,
            o_attach: question.attach.trim(),
          };
          answer.push(curQues);
        } else if (question.type === '数值') {
          const curQues = {
            q_id: question.q_id,
            o_id: '',
            o_addition: question.selectContent,
            o_attach: question.attach.trim(),
          };
          answer.push(curQues);
        } else {
          const curQues = {
            q_id: question.q_id,
            o_id: '',
            o_addition: question.selectContent,
            o_attach: question.attach.trim(),
          };
          answer.push(curQues);
        }
      });
      const now = new Date().getTime();
      /* eslint-disable */
      const result = {
        n_id: this.naire.n_id,
        u_id: this.loginUser.u_id,
        u_department: this.u_department,
        u_contact: this.u_contact,
        u_phone: this.u_phone,
        u_time: now,
        r_status: 1,
        u_ip: JSON.stringify(returnCitySN),
        answer: answer,
      };
      /* eslint-enable */
      // 防止重复提交
      this.finished = true;
      this.$http
        .post('/naire/submit', {
          result: result,
        })
        .then((response) => {
          console.log(response.data);
          // 影响行数大于0
          if (response.data.err === 0) {
            this.resultId = response.data.rid;
            this.$Modal.success({
              title: '提交成功！',
              content: '您填写的调研问卷已经提交成功，感谢您的反馈！',
              onOk() {
                _this.hasSubmited = true;
                this.$nextTick(() => {
                  createSeal('canvas', '已完成', '', formatDate(now));
                });
              },
            });
          } else {
            this.$Message.error(response.data.data);
            this.finished = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('提交失败，请重试');
          this.finished = false;
        });
    },
    saveNaire() {
      const _this = this;
      _this.changePage(1);
      const answer = [];
      this.naire.topic.forEach((question, index) => {
        if (question.type === '单选') {
          let addition = '';
          question.options.forEach((o) => {
            if (o.o_id === question.selectContent && o.isAddition) {
              addition = o.addition;
            }
          });
          const curQues = {
            q_id: question.q_id,
            o_id: question.selectContent,
            o_addition: addition,
            o_attach: question.attach.trim(),
          };
          answer.push(curQues);
        } else if (question.type === '多选') {
          let additions = {};
          question.options.forEach((o) => {
            if (
              question.selectMultipleContent.includes(o.o_id) &&
              o.isAddition
            ) {
              additions[o.o_id] = o.addition;
            }
          });
          const curQues = {
            q_id: question.q_id,
            o_id: question.selectMultipleContent,
            o_addition: additions,
            o_attach: question.attach.trim(),
          };
          answer.push(curQues);
        } else if (question.type === '数值') {
          const curQues = {
            q_id: question.q_id,
            o_id: '',
            o_addition: question.selectContent,
            o_attach: question.attach.trim(),
          };
          answer.push(curQues);
        } else {
          const curQues = {
            q_id: question.q_id,
            o_id: '',
            o_addition: question.selectContent,
            o_attach: question.attach.trim(),
          };
          answer.push(curQues);
        }
      });
      const now = new Date().getTime();
      /* eslint-disable */
      const result = {
        n_id: this.naire.n_id,
        u_id: this.loginUser.u_id,
        u_department: this.u_department,
        u_contact: this.u_contact,
        u_phone: this.u_phone,
        u_time: now,
        r_status: 0,
        u_ip: JSON.stringify(returnCitySN),
        answer: answer,
      };
      /* eslint-enable */
      // 防止重复提交
      this.$http
        .post('/naire/submit', {
          result: result,
        })
        .then((response) => {
          // 影响行数大于0
          if (response.data.err === 0) {
            this.$Modal.success({
              title: '保存成功！',
              content: '您填写的调研问卷已经保存成功，请及时完成后提交！',
            });
            var c = document.getElementById('canvas');
            var cxt = c.getContext('2d');
            c.height = cxt.height;
          } else {
            this.$Message.error(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('提交失败，请重试');
          this.finished = false;
        });
    },
    getAdminView() {
      this.$http
        .post('/user/getUserinfo', {
          u_id: this.$route.params.uid,
          n_id: this.$route.params.nid,
        })
        .then((response) => {
          if (response.data.err === 0) {
            this.loginUser = response.data.data;
            this.finished = true;
            this.isLogin = true;
            this.fetchData();
          } else {
            this.$Message.error(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('提交失败，请重试');
          this.finished = false;
        });
    },
  },
};
</script>

<style scoped>
p {
  line-height: 24px;
}

input:disabled {
  opacity: 1;
}
.intro table tr {
  display: block;
  margin-top: 8px;
}
.intro table tr td {
  vertical-align: top;
}
.info-title {
  text-align: justify;
  text-align-last: justify;
  font-weight: 500;
}

.view-body {
  background-color: #f3f6fa;
  background-image: url(../../assets/body-bg.jpg);
  background-repeat: repeat-x;
  background-size: 1px 300px;
  min-height: 100%;
  overflow: hidden;
}

.view-layout {
  width: 100%;
  max-width: 920px;
  background: url(../../assets/banner.png) no-repeat top center;
  background-size: 910px 132px;
  padding-top: 120px;
  padding-bottom: 30px;
  margin: 0 auto;
}

.view-layout .main {
  width: 100%;
  height: auto;
  background-color: #fff;
  -webkit-box-shadow: 0px 1px 6px 0px rgba(205, 220, 245, 1);
  box-shadow: 0px 1px 6px 0px rgba(205, 220, 245, 1);
}

.view-layout .header {
  padding: 30px 20px 0 20px;
  height: auto;
  min-height: 33px;
  border-bottom: 2px dotted #eee;
}

.view-layout .header h1 {
  /*width: 500px;*/
  width: 100%;
  margin: 0 auto;
  text-align: center;
}

.view-layout .content {
  padding: 20px;
}

.view-layout .intro {
  font-size: 14px;
  margin-top: 32px;
  padding: 0 32px;
  z-index: 10;
}

.view-layout .footer {
  margin-top: 10px;
  padding: 24px 12px;
  text-align: center;
  border-top: 1px dotted #eee;
  color: #999;
}

.code-row-bg button {
  margin: 0 10px;
}

.user-info {
  width: 100%;
  padding: 16px 32px 0 32px;
  z-index: 30;
  position: relative;
}

.canvas-seal {
  position: absolute;
  opacity: 0;
  transform: rotate(-2deg) scale(5);
  right: 16px;
  bottom: 72px;
  z-index: 20;
}

.canvas-seal-active {
  opacity: 1;
  transform: rotate(-15deg) scale(1);
  transition: all 0.3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
}

.canvas-seal-default {
  opacity: 1;
  transform: rotate(-15deg) scale(1);
}
.user-input {
  display: inline-block;
  width: 128px;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 14px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid #ddd;
}

h1 {
  white-space: pre-line;
}

.user-input:focus {
  border-color: #57a3f3;
  outline: 0;
}
</style>
