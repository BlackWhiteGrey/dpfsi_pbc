<template>
  <div class="box">
    <div class="box-left">
      <div style="text-align: center; margin-bottom: 12px">
        <Tag color="blue" size="large">所有题目</Tag>
      </div>
      <div class="radiogroup">
        <Alert
          >在下方选中题目，在右侧选择关联题目及选项，<Icon
            color="#2d8cf0"
            type="ios-star"
          />为已设置关联题目，点击可查看。
        </Alert>
        <RadioGroup v-model="question" vertical @on-change="changeRadio()">
          <Radio
            v-for="(item, index) in questions"
            :key="item.q_id"
            :label="item.q_id"
          >
            <Tooltip
              transfer="true"
              :content="item.q_content"
              max-width="300"
              placement="right"
            >
              <span
                >{{ index + 1 }}、{{
                  item.q_content.length > 20
                    ? item.q_content.substring(0, 28) + '...'
                    : item.q_content
                }}</span
              >
            </Tooltip>
            <Icon
              v-show="item.depend_o_id !== null && item.depend_o_id !== ''"
              color="#2d8cf0"
              type="ios-star"
            />
          </Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="box-right">
      <div style="text-align: center; margin-bottom: 12px">
        <Tag color="orange" size="large">关联题目</Tag>
      </div>
      <div class="optiongroup">
        <Alert type="warning"
          >在问卷中，当以下选项中勾选的任意一个选项被选中时，左侧对应的题目才出现。
        </Alert>
        <Select v-model="depend_q_id">
          <Option
            v-for="item in associationQuestions"
            :value="item.q_id"
            :key="item.q_id"
            >{{ item.q_content }}</Option
          >
        </Select>
        <CheckboxGroup v-model="depend_o_id" @on-change="changeCheckbox()">
          <Checkbox v-for="item in options" :key="item.o_id" :label="item.o_id">
            {{ item.content }}
          </Checkbox>
        </CheckboxGroup>
      </div>
    </div>
    <div
      style="
        text-align: right;
        border-top: 1px solid #e1e1e1;
        margin-top: 12px;
        padding: 24px 24px 12px 24px;
      "
    >
      <Button @click="clear()">清除关联关系</Button>
      <Button @click="submit()" type="primary">提交当前设置</Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    naireId: {
      type: String,
      default: '',
    },
    modalopen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      spinShow: false,
      vertical: true,
      questions: [],
      depend_q_id: '',
      depend_o_id: [],
      split: 0.4,
      question: '',
      options: [],
    };
  },
  computed: {
    associationQuestions() {
      let aqs = [];
      this.questions.forEach((q) => {
        if (
          (q.q_type === '单选' || q.q_type === '多选') &&
          q.q_id < this.question
        ) {
          aqs.push(q);
        }
      });
      return aqs;
    },
  },
  watch: {
    naireId: function () {
      this.getQuestionList();
      this.options = [];
      this.depend_o_id = [];
      this.question = '';
      this.depend_q_id = '';
    },
    modalopen: function () {
      if (this.modalopen) {
        this.getQuestionList();
        this.options = [];
        this.depend_o_id = [];
        this.question = '';
        this.depend_q_id = '';
      }
    },
    depend_q_id: function () {
      this.options = [];
      this.questions.forEach((q) => {
        if (q.q_id === this.depend_q_id) {
          this.options = q.options;
        }
      });
    },
  },
  methods: {
    submit() {
      this.$http
        .post('/naire/setAssociation', {
          questions: this.questions,
        })
        .then((response) => {
          if (response.data.err === 0) {
            this.$Message.success('设置成功');
          }
        });
    },
    clear() {
      this.questions.forEach((q) => {
        q.depend_o_id = '';
        q.depend_q_id = '';
      });
      this.question = '';
      this.options = [];
      this.depend_q_id = '';
      this.depend_o_id = [];
    },
    changeCheckbox() {
      this.questions.forEach((q) => {
        if (q.q_id === this.question) {
          if (this.depend_o_id.length > 0) {
            q.depend_o_id = this.depend_o_id.toString();
            q.depend_q_id = this.depend_q_id;
          } else {
            q.depend_o_id = '';
            q.depend_q_id = '';
          }
        }
      });
      console.log(this.questions);
    },
    changeRadio() {
      this.depend_o_id = [];
      this.questions.forEach((q) => {
        if (q.q_id === this.question) {
          this.depend_q_id = q.depend_q_id;
          if (q.depend_o_id !== null && q.depend_o_id !== '') {
            this.depend_o_id = q.depend_o_id.split(',');
          }
        }
      });
    },
    getQuestionList() {
      this.$http
        .post('/naire/questionList', {
          n_id: this.naireId,
        })
        .then((response) => {
          this.questions = response.data.questions;
        });
    },
  },
};
</script>

<style scoped>
.box {
  overflow: scroll;
}
.box-left {
  width: 50%;
  border-right: 1px solid #e1e1e1;
  padding: 0 12px 12px 12px;
  display: inline-block;
}
.box-right {
  width: 49%;
  padding: 0 12px 12px 12px;
  display: inline-block;
}
.radiogroup {
  height: 420px;
  overflow: scroll;
}
.optiongroup {
  height: 420px;
  overflow: scroll;
  text-align: left;
}
.ivu-checkbox-group-item {
  display: block;
  text-align: left;
  padding: 6px;
}
.ivu-checkbox-group {
  padding: 24px 48px;
}
.ivu-alert {
  position: relative;
  margin-top: 16px;
  padding: 8px 16px 8px 16px;
  border-radius: 4px;
  color: #515a6e;
  font-size: 14px;
  line-height: 16px;
  margin-bottom: 10px;
}
</style>
