<template>
  <div>
    <Modal
      :model-value="msgOpen"
      title="金融标准化在线交流平台"
      width="672"
      :closable="false"
      class-name="vertical-center-modal"
    >
      <div class="msg-box">
        <div class="msg-box-left">
          <Divider
            style="
              font-size: 12px;
              text-align: center;
              margin-bottom: 6px;
              margin-top: 0px;
            "
            >当前在线用户：{{ clients.length }}</Divider
          >
          <div class="msg-box-client">
            <p v-for="(client, index) in clients" :key="index">
              <span
                class="client"
                :class="{ 'client-me': client === clientName }"
                >{{ client }}</span
              >
            </p>
          </div>
        </div>
        <div class="msg-box-right" ref="msgbox">
          <div v-for="(message, index) in messages" :key="index">
            <div
              style="padding: 4px 0"
              :class="{ 'msg-right': message.from === clientName }"
            >
              <p>{{ message.from }}({{ message.time }})</p>
              <div
                class="msg-info"
                :class="{ 'msg-info-yellow': message.from === clientName }"
              >
                {{ message.content }}
              </div>
              <span v-if="message.type === 'notice'"
                ><a
                  style="font-weight: 800"
                  @click="preview(message.n_id, message.u_id)"
                  >查看</a
                ></span
              >
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Input
          @keydown.enter.native="enterKey($event)"
          v-model="msg"
          style="margin-bottom: 8px"
          type="textarea"
          :rows="4"
        ></Input>
        <span>（Ctrl+Enter发送）</span>
        <Button
          type="text"
          @click="
            () => {
              this.msgOpen = false;
            }
          "
          >关闭</Button
        >
        <Button type="primary" @click="wsSend()">发送</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  props: ['msgOpen', 'loginUser'],
  data() {
    return {
      ws: {},
      msg: '',
      messages: [],
      clients: [],
      client_id: 0,
      newmsg: 0,
      clientName: '',
    };
  },
  watch: {
    msgOpen: function () {
      if (this.msgOpen) {
        this.newmsg = 0;
      } else {
        this.$emit('msgClose');
      }
      this.$nextTick(() => {
        let div = this.$refs['msgbox'];
        div.scrollTop = div.scrollHeight;
      });
    },
    newmsg: function () {
      console.log(this.newmsg);
      this.$emit('recevieMsg', this.newmsg);
    },
  },
  mounted() {
    this.initailSocket();
  },
  methods: {
    enterKey(event) {
      if (event.ctrlKey === true) {
        this.wsSend();
      }
    },
    simpleName(name) {
      return name !== null &&
        (name.slice(-6) === '股份有限公司' || name.slice(-6) === '有限责任公司')
        ? name.slice(0, -6)
        : name;
    },
    orderClients() {
      if (this.clients.indexOf(this.clientName)) {
        this.clients.splice(this.clients.indexOf(this.clientName), 1);
        this.clients.unshift(this.clientName);
      }
    },
    wsSend() {
      if (this.msg !== '') {
        let msgJSON = {
          type: 'msg',
          to: 0,
          from: this.clientName,
          content: this.msg,
        };
        this.ws.send(JSON.stringify(msgJSON));
        this.msg = '';
      }
    },
    initailSocket() {
      this.ws = new WebSocket('ws://www.dpfsi.top:4000');
      let _this = this;
      this.ws.onopen = function () {
        console.log('握手成功');
        _this.$emit('openws', _this.ws);
        _this.ws.send(
          JSON.stringify({
            type: 'login',
            u_id: _this.loginUser.u_id,
            u_company: _this.simpleName(_this.loginUser.u_company),
          })
        );
      };
      this.ws.onmessage = function (e) {
        let result = JSON.parse(e.data);
        switch (result.type) {
          case 'login':
            _this.clients = [];
            for (var key in result.clients) {
              let client = result.clients[key];
              _this.clients.push(client);
            }
            _this.orderClients();
            break;
          case 'regist':
            _this.clientName = result.client_name;
            break;
          case 'logout':
            _this.clients = [];
            for (var index in result.clients) {
              let client = result.clients[index];
              _this.clients.push(client);
            }
            _this.orderClients();
            break;
          case 'msg':
            _this.messages.push(result);
            _this.$nextTick(() => {
              let div = _this.$refs['msgbox'];
              div.scrollTop = div.scrollHeight;
              if (!_this.msgOpen) {
                _this.newmsg++;
              }
            });
            break;
          case 'notice':
            let notice = {
              type: 'notice',
              from: result.user.u_company,
              content: result.naire.n_title + '答卷已提交',
              n_id: result.n_id,
              u_id: result.u_id,
              time: result.time,
            };
            _this.messages.push(notice);
            _this.$nextTick(() => {
              let div = _this.$refs['msgbox'];
              div.scrollTop = div.scrollHeight;
              if (!_this.msgOpen) {
                _this.newmsg++;
              }
            });
            break;
        }
      };
      this.ws.onerror = function (e) {
        console.log('message_error:' + e.data);
      };
    },
  },
};
</script>

<style scoped>
.msg-box-client p {
  line-height: 24px;
}
.client:before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 4px;
  background-color: #19be6b;
  vertical-align: middle;
  margin-right: 7px;
  border-radius: 4px;
}
.client-me {
  color: rgb(45, 140, 240);
}
.msg-box {
  width: 640px;
}
.msg-box-left {
  width: 236px;
  border-right: 1px solid #e1e1e1;
  padding: 0 12px 12px 12px;
  display: inline-block;
  font-size: 12px;
  height: 300px;
}
.msg-box-client {
  display: inline-block;
  height: 270px;
  overflow: scroll;
}
.msg-box-right {
  width: 400px;
  padding: 0 12px 12px 12px;
  display: inline-block;
  font-size: 12px;
  height: 300px;
  overflow: scroll;
  text-align: left;
}
.msg-right {
  text-align: right;
}
.msg-info {
  white-space: pre-line;
  display: inline-block;
  max-width: 85%;
  padding: 4px 8px;
  border-radius: 2px;
  background: #19be6b;
  color: #fff;
  font-size: 13px;
}
.msg-info-yellow {
  background: rgb(45, 140, 240);
}
</style>
