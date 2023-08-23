<template>
  <div class="layout">
    <Layout :style="{ minHeight: '100vh' }">
      <Sider
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
        style="padding-top: 80px"
      >
        <Menu
          :active-name="defaultActive"
          theme="dark"
          width="auto"
          :class="menuitemClasses"
        >
          <router-link
            v-for="(item, index) in navList"
            :to="item.to"
            :key="index"
          >
            <Menu-Item
              :name="item.name"
              v-if="
                loginUser.u_admin !== '0'
                  ? loginUser.u_admin !== '0' || item.admin
                  : loginUser.u_admin !== '0' || !item.admin
              "
            >
              <Icon :type="item.icon"></Icon>
              <span>{{ item.text }}</span>
            </Menu-Item>
          </router-link>
        </Menu>
      </Sider>
      <Layout>
        <Header class="header">
          <div class="layout-logo"></div>
          <div class="i-layout-header-right">
            <Badge :count="newmsg" type="warning" :offset="[20, 0]">
              <div
                @click="
                  () => {
                    this.msgOpen = !this.msgOpen;
                  }
                "
                style="cursor: pointer"
              >
                <Avatar
                  style="background-color: rgb(45, 140, 240)"
                  shape="square"
                  icon="ios-mail"
                />
              </div>
            </Badge>
            <span class="i-layout-header-trigger i-layout-header-trigger-min">
              <Dropdown>
                <Avatar icon="ios-person" style="background: #2d8cf0" />
                <span class="i-layout-header-user-name">{{
                  loginUser.u_company
                }}</span>
                <Icon type="ios-arrow-down"></Icon>
                <DropdownMenu slot="list" style="z-index: 999">
                  <DropdownItem
                    ><span
                      @click="
                        () => {
                          this.pwdmd = true;
                        }
                      "
                      ><Icon type="ios-hammer-outline" size="20" />
                      修改密码</span
                    ></DropdownItem
                  >
                  <DropdownItem
                    ><span @click="logout"
                      ><Icon type="ios-log-out" size="20" /> 退出系统</span
                    ></DropdownItem
                  >
                </DropdownMenu>
              </Dropdown>
            </span>
          </div>
        </Header>
        <Content :style="{ padding: '80px 16px 16px 16px' }">
          <router-view></router-view>
        </Content>

        <Modal
          v-model="pwdmd"
          title="修改密码"
          :mask-closable="false"
          :closable="false"
          class-name="vertical-center-modal"
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
        <messageBox
          :msgOpen="msgOpen"
          @msgClose="msgClose"
          @openws="openws"
          :loginUser="loginUser"
          @recevieMsg="recevieMsg"
        ></messageBox>
      </Layout>
    </Layout>
  </div>
</template>

<script>
import sha1 from 'js-sha1';
import messageBox from '@/components/messageBox';
export default {
  components: {
    messageBox,
  },
  data() {
    return {
      subActive: this.$route.name,
      isCollapsed: true,
      newmsg: 0,
      ws: {},
      pwdmd: false,
      msgOpen: false,
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
              } else if (sha1(value) === this.loginUser.u_password) {
                return callback(new Error('与原密码一致'));
              } else {
                callback();
              }
            },
            trigger: 'blur',
          },
        ],
      },
      navList: [
        {
          to: '/platform/index',
          name: '/platform/index',
          text: '实施概览',
          icon: 'ios-analytics',
          admin: true,
        },
        {
          to: '/platform/list',
          name: '/platform/list',
          text: '调研列表',
          icon: 'ios-albums',
          admin: false,
        },
        {
          to: '/platform/edit',
          name: '/platform/edit',
          text: '制定调研',
          icon: 'ios-paper',
          admin: false,
        },
        {
          to: '/platform/user',
          name: '/platform/user',
          text: '用户管理',
          icon: 'ios-people',
          admin: false,
        },
      ],
    };
  },
  computed: {
    defaultActive() {
      if (this.$route.matched.length > 1) {
        return this.$route.matched[1].path;
      } else {
        return this.$route.path;
      }
    },
    loginUser() {
      return JSON.parse(localStorage.getItem('USER'));
    },
    menuitemClasses: function () {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : ''];
    },
  },
  // 注销window.onresize事件
  destroyed() {
    this.logout('silence');
  },
  mounted() {},
  methods: {
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
                this.$Message.success('密码更新成功，即将重新登录！');
                this.pwdmd = false;
                let _this = this;
                window.setTimeout(function () {
                  _this.logout('silence');
                }, 3000);
              }
            });
        }
      });
    },
    recevieMsg(msg) {
      this.newmsg = msg;
    },
    msgClose() {
      this.msgOpen = false;
    },
    openws(ws) {
      this.ws = ws;
    },
    logout(mode) {
      this.$store.dispatch('logout');
      if (mode !== 'silence') {
        this.$Message.warning('已登出!');
      }
      this.ws.close();
      this.$router.push('/login');
    },
    selectMenu(name) {
      this.subActive = name;
      this.$router.push({
        name: name,
        params: {
          id: this.$route.params.id,
        },
      });
    },
  },
};
</script>

<style>
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
.ivu-modal {
  top: 0;
}
.layout-con {
  height: 100%;
  width: 100%;
}
.layout-badge {
  top: 10px;
}
.layout-logo {
  width: 320px;
  height: 36px;
  background: url('../../assets/logo-blue.svg') no-repeat;
  background-size: 100%;
  vertical-align: middle;
  display: inline-block;
}
.i-layout-header-user-name {
  margin-left: 12px;
  font-size: 14px;
}
.i-layout-header-right {
  height: 64px;
  float: right;
}
.i-layout-header-trigger-in {
  padding: 0;
}
.i-layout-header-trigger-min {
  width: auto;
  padding: 0 12px;
}
.i-layout-header-trigger {
  display: inline-block;
  height: 64px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.ivu-tooltip,
.ivu-tooltip-rel {
  display: inline-block;
}
.i-layout-header-trigger:hover {
  background: #f8f8f9;
}
.sider-avatar {
  line-height: '80px';
  text-align: center;
  padding: '20px';
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 120px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
.ivu-layout-header {
  background: #515a6e;
  padding: 0 16px;
}
.header-logout {
  font-size: 14px;
  color: #515a6d;
}
@media screen and (min-width: 1366px) {
  .header {
    background: #fff;
    box-shadow: 0 1px 4px 0px rgba(0, 21, 41, 0.08);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }
}
@media screen and (max-width: 1366px) {
  .header {
    background: #fff;
    box-shadow: 0 1px 4px 0px rgba(0, 21, 41, 0.08);
    position: absolute;
    top: 0;
    left: 0;
    width: 1366px;
    z-index: 999;
  }
}
</style>
