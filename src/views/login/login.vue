<template>
  <div class="login-wrapper">
    <div class="login-form">
      <div class="login-logo"></div>
      <div class="both-sides-line">金融管理部门端</div>
      <div class="welcome">您好，欢迎金融管理部门用户登录！</div>
      <Form
        ref="formValidate"
        :model="formValidate"
        label-position="top"
        @submit.native.prevent
        @keyup.enter="handleSubmit('formValidate')"
      >
        <FormItem prop="username">
          <Input
            size="large"
            placeholder="金融机构编码或统一社会信用代码"
            v-model="formValidate.username"
          ></Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            size="large"
            type="password"
            placeholder="密码"
            v-model="formValidate.password"
          ></Input>
        </FormItem>
        <FormItem>
          <Checkbox v-model="single">一周内免登录</Checkbox>
        </FormItem>
        <FormItem>
          <Button
            size="large"
            type="primary"
            html-type="submit"
            @click="handleSubmit('formValidate')"
            long
            >立即登录
          </Button>
        </FormItem>
        <FormItem>
          <Button
            size="large"
            ghost
            type="primary"
            html-type="submit"
            @click="go()"
            long
            >调研机构登录地址
          </Button>
        </FormItem>
        <FormItem>
          <Button
            size="large"
            ghost
            type="primary"
            html-type="submit"
            @click="contact()"
            long
            >联系管理员
          </Button>
        </FormItem>
      </Form>
    </div>
    <div class="footer">
      <p>
        {{ year }} · 全国金融标准化技术委员会 ｜
        技术支持：重庆国家金融科技认证中心
      </p>
    </div>
  </div>
</template>

<script>
import sha1 from 'js-sha1';

const OK = 0; // 成功状态
export default {
  data() {
    return {
      single: false,
      year: new Date().getFullYear(),
      formValidate: {
        username: '',
        password: '',
      },
      ruleValidate: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    if (localStorage.JWT_TOKEN) {
      this.$http
        .post('/admin/validatelogin')
        .then((response) => {
          if (
            response.data.err === OK &&
            JSON.parse(localStorage.getItem('USER')).u_category ===
              '金融管理部门'
          ) {
            console.log(JSON.parse(localStorage.getItem('USER')).u_admin);
            if (JSON.parse(localStorage.getItem('USER')).u_admin !== '0') {
              this.$router.push('/platform/index');
            } else {
              this.$router.push('/platform/list');
            }
          } else {
            this.$Message.info('请登录');
          }
        })
        .catch((e) => {
          console.log(e);
          this.$Message.error('网络请求有误，请稍后重试!');
        });
    }
  },
  methods: {
    go() {
      window.location.href = 'http://fi.dpfsi.top';
    },
    contact() {
      this.$Message.info({
        content: '重庆国家金融科技认证中心：13640553348',
        duration: 5,
      });
    },
    handleSubmit(name) {
      let ttl = 0;
      if (this.single) {
        ttl = 604800;
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = {
            username: this.formValidate.username,
            password: sha1(this.formValidate.password),
            ttl: ttl,
          };
          this.$http
            .post('/admin/login', params)
            .then((response) => {
              if (response.data.err === OK) {
                this.$Message.success('登录成功!');
                const data = {
                  user: response.data.user,
                  token: response.data.token,
                };
                this.$store.dispatch('login', data);
                localStorage.setItem('user', this.formValidate.username);
                localStorage.setItem('pwd', sha1(this.formValidate.password));
                if (response.data.user.u_admin !== '0') {
                  this.$router.push('/platform/index');
                } else {
                  this.$router.push('/platform/list');
                }
              } else {
                console.log(response);
                this.$Message.error(response.data.message);
              }
            })
            .catch((e) => {
              console.log(e);
              this.$Message.error('网络请求有误，请稍后重试!');
            });
        } else {
          this.$Message.error('表单填写有误!');
        }
      });
    },
  },
};
</script>

<style>
.login-wrapper {
  display: flex;
  min-height: 625px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../../assets/bg-banner.jpg');
  background-size: cover;
}
.login-wrapper .footer {
  margin-top: 10px;
  padding: 24px 12px;
  text-align: center;
  color: #eee;
}
input {
  -webkit-appearance: none;
}
@media screen and (min-width: 640px) {
  .login-wrapper .login-form {
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    padding: 48px;
    width: 600px;
  }
  .login-logo {
    width: 504px;
    height: 56px;
    background-image: url('../../assets/logo-blue.svg');
    background-size: 100%;
    background-repeat: no-repeat;
  }
}

@media screen and (max-width: 640px) {
  .login-wrapper .login-form {
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    padding: 24px;
    width: 300px;
  }

  .login-logo {
    /* width: 504px;
      height: 55px; */
    width: 252px;
    height: 39px;
    background-image: url('../../assets/logo-blue.svg');
    background-size: 100%;
    background-repeat: no-repeat;
  }
}

.both-sides-line {
  text-align: center;
  position: relative;
  width: 100%;
  font-size: 18px;
  color: #0066cc;
  margin-top: 12px;
}
.both-sides-line:before,
.both-sides-line:after {
  content: '';
  position: absolute;
  background: #0066cc;
  height: 1px;
  width: 36px;
  top: 14px;
}
.both-sides-line:before {
  margin-left: -40px;
}
.both-sides-line:after {
  margin-left: 4px;
}

.welcome {
  margin: 32px 0;
  font-size: 18px;
  font-weight: 400;
}
</style>
