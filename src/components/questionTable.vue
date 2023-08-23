<template>
  <Row class="question-wrapper">
    <Col span="24" class="question-list">
      <table class="question-tb">
        <tr
          v-for="(topic, index) in questionList"
          :key="topic.q_id"
          v-show="
            topic.depend === null ||
            topic.depend === '' ||
            dependSelected(selectedOptions, topic.depend.split(','))
          "
        >
          <td class="border-none">
            <table class="question-tb2">
              <tr v-if="topic.sectioninfo !== ''">
                <td colspan="2" class="tb-sectioninfo">
                  {{ topic.sectioninfo }}
                </td>
              </tr>
              <tr>
                <td width="240" class="tb-questions">
                  <h4>
                    {{ topic.question
                    }}<span
                      style="color: #f00; margin-left: 4px ;"
                      v-if="topic.isRequired"
                      >*</span
                    >
                    <span
                      class="question-action"
                      v-show="isAdmin && !topic.isDefault"
                      @click="delQuestion(index)"
                    >
                      <Icon type="md-trash" size="18" />
                    </span>
                    <span
                      class="question-action"
                      v-show="isAdmin"
                      @click="editQuestion(index, topic)"
                    >
                      <Icon type="ios-create" size="18" />
                    </span>
                  </h4>
                  <p class="question-desc" v-if="topic.description !== ''">
                    说明：{{ getDes(topic.description, topic.type) }}
                  </p>
                </td>
                <td class="tb-options">
                  <div class="question-options">
                    <div v-if="topic.type === '单选'">
                      <Radio-group
                        v-model="topic.selectContent"
                        style="width: 100%"
                      >
                        <Radio
                          :label="option.o_id"
                          v-for="(option, opIndex) in topic.options"
                          :disabled="isPreview"
                          class="option-item"
                          :key="option.o_id"
                        >
                          <span>{{ option.content }}</span>
                          <input
                            v-model="option.addition"
                            placeholder="请输入..."
                            v-show="
                              option.isAddition &&
                              topic.selectContent === option.o_id
                            "
                            v-if="option.isAddition"
                            :disabled="isPreview"
                            class="user-input"
                          />
                          <div
                            class="option-action"
                            v-show="isAdmin && !topic.isDefault"
                            @click="delOption(index, opIndex)"
                          >
                            <Icon type="md-close" size="18"></Icon>
                          </div>
                        </Radio>
                      </Radio-group>
                    </div>
                    <div v-if="topic.type === '多选'">
                      <Checkbox-group
                        v-model="topic.selectMultipleContent"
                        class="checkbox-list"
                      >
                        <Checkbox
                          :label="option.o_id"
                          v-for="(option, opIndex) in topic.options"
                          :disabled="isPreview"
                          class="option-item"
                          :key="option.o_id"
                        >
                          <span>{{ option.content }}</span>
                          <input
                            v-model="option.addition"
                            placeholder="请输入..."
                            v-show="
                              option.isAddition &&
                              topic.selectMultipleContent.includes(option.o_id)
                            "
                            v-if="option.isAddition"
                            :disabled="isPreview"
                            class="user-input"
                          />
                          <div
                            class="option-action"
                            v-show="isAdmin && !topic.isDefault"
                            @click="delOption(index, opIndex)"
                          >
                            <Icon type="md-close" size="18"></Icon>
                          </div>
                        </Checkbox>
                      </Checkbox-group>
                    </div>
                    <div class="option-item" v-if="topic.type === '文本'">
                      <Input
                        v-model="topic.selectContent"
                        type="textarea"
                        :autosize="{ minRows: 8 }"
                        placeholder="请输入..."
                        :disabled="isPreview"
                        v-if="!topic.hasattach && !onPrint"
                      ></Input>
                    </div>
                    <div class="option-item" v-if="topic.type === '数值'">
                      <InputNumber
                        v-model="topic.selectContent"
                        :max="getMaxNum(topic.description)"
                        :min="0"
                        :disabled="isPreview"
                      ></InputNumber>
                    </div>
                    <div v-show="topic.hasattach">
                      <Upload
                        v-show="topic.attach === null || topic.attach === ''"
                        :disabled="isPreview"
                        style="display: inline-block"
                        :action="`${baseURL}/naire/upload`"
                        name="userfile"
                        :show-upload-list="false"
                        :data="{ id: topic.q_id }"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                      >
                        <Button>添加附件</Button>
                      </Upload>
                      <Button
                        style="display: inline-block"
                        v-show="topic.attach !== null && topic.attach !== ''"
                        :to="`${baseURL}` + topic.attach"
                        target="_blank"
                        >查看附件</Button
                      >
                      <Button
                        style="display: inline-block"
                        v-show="
                          topic.attach !== null &&
                          topic.attach !== '' &&
                          !isPreview
                        "
                        @click="delAttach(topic)"
                        >删除附件</Button
                      >
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <div class="question-btns">
        <slot></slot>
      </div>
      <Modal
        title="修改题目说明"
        ok-text="更新"
        v-model="infomodal"
        @on-ok="updateDescription()"
        class-name="vertical-center-modal"
      >
        <Input
          v-model="topicDescription"
          type="textarea"
          placeholder="Enter something..."
          :rows="4"
        />
      </Modal>
    </Col>
  </Row>
</template>

<script>
import config from '@/config';
export default {
  props: [
    'questionList',
    'isPreview',
    'isAdmin',
    'currentPage',
    'pageSize',
    'resultId',
    'onPrint',
  ],
  created() {
    console.log(this.questionList);
  },
  data() {
    return {
      baseURL: config.APIBaseURL,
      infomodal: false,
      topicDescription: '',
      currentIndex: 0,
    };
  },
  computed: {
    selectedOptions: function () {
      let so = [];
      if (this.questionList !== undefined) {
        this.questionList.forEach((topic) => {
          if (topic.type === '单选' && topic.selectContent !== '') {
            so = so.concat(topic.selectContent);
          }
          if (topic.type === '多选' && topic.selectMultipleContent.length > 0) {
            so = so.concat(topic.selectMultipleContent);
          }
        });
      }
      return so;
    },
  },
  watch: {
    selectedOptions: function () {
      this.questionList.forEach((topic) => {
        if (
          topic.type === '单选' &&
          topic.selectContent !== '' &&
          topic.depend !== null &&
          topic.depend !== '' &&
          !this.dependSelected(this.selectedOptions, topic.depend.split(','))
        ) {
          topic.selectContent = '';
          topic.options.forEach((o) => {
            o.addition = '';
          });
          topic.attach = '';
        } else if (
          topic.type === '多选' &&
          topic.selectMultipleContent.length > 0 &&
          topic.depend !== null &&
          topic.depend !== '' &&
          !this.dependSelected(this.selectedOptions, topic.depend.split(','))
        ) {
          topic.selectMultipleContent = [];
          topic.options.forEach((o) => {
            o.addition = '';
          });
          topic.attach = '';
        } else if (
          topic.depend !== null &&
          topic.depend !== '' &&
          !this.dependSelected(this.selectedOptions, topic.depend.split(','))
        ) {
          topic.selectContent = '';
          topic.attach = '';
        }
      });
    },
  },
  methods: {
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
    delAttach(topic) {
      this.$http
        .post('/naire/delattach', {
          filepath: topic.attach,
          rid: this.resultId,
          qid: topic.q_id,
        })
        .then((response) => {
          if (response.data.err === 0) {
            topic.attach = '';
            this.$Message.success(response.data.msg);
          } else {
            this.$Message.error(response.data.err);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('删除失败，请重试');
        });
    },
    // 文件格式校验
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc:
          '文件 ' + file.name + ' 格式不正确，请上传 xls 或 xlsx 格式的文件。',
      });
    },
    // 文件大小检验
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。',
      });
    },
    // 文件上传成功的回调
    handleSuccess(response, file, fileList) {
      console.log(response);
      if (response.err === 0) {
        this.$Message.success(response.msg);
        console.log(this.questionList);
        this.questionList.forEach((question) => {
          if (question.q_id === response.id) {
            question.attach = response.uploadfile;
          }
        });
      } else {
        this.$Message.error('上传出错');
      }
    },
    // 文件长传失败的回调
    handleError(error, file, fileList) {
      console.log(error);
      this.$Message.error('上传出错');
    },
    editQuestion(index, topic) {
      this.topicDescription = topic.description;
      this.currentIndex = index;
      this.infomodal = true;
      console.log(topic);
    },
    updateDescription() {
      // this.currentTopic.description = this.topicDescription
      this.$store.dispatch('updateDescription', {
        index: this.currentIndex,
        description: this.topicDescription,
      });
    },
    delQuestion(index) {
      console.log(index);
      this.$store.dispatch('delQuestion', index);
    },
    delOption(index, opIndex) {
      this.$store.dispatch('delOption', {
        index: index,
        opIndex: opIndex,
      });
    },
    getMaxNum(val) {
      let max = val.split('|');
      return max[0];
    },
    getDes(des, type) {
      if (type === '数值') {
        let info = des.split('|');
        return info[2];
      } else {
        return des;
      }
    },
  },
};
</script>

<style>
.border-none {
  border: none;
}
.tb-options {
  text-align: left;
  border-top: 1px solid #abdcff;
  border-left: 1px solid #abdcff;
  border-right: 1px solid #abdcff;
  padding: 16px 8px;
}
.tb-sectioninfo {
  text-align: center;
  background-color: #f0faff;
  font-size: 16px;
  font-weight: 600;
  padding: 20px 40px;
  border: 1px solid #abdcff;
}
.tb-questions {
  text-align: center;
  background-color: #f0faff;
  padding: 16px 8px;
  border-top: 1px solid #abdcff;
  border-left: 1px solid #abdcff;
  border-right: 1px solid #abdcff;
}
.question-tb {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-bottom: 1px solid #abdcff;
}
.question-tb2 {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
.user-input {
  display: block;
  width: 540px;
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

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-list {
  overflow: visible;
  padding: 0 32px;
}

.question-options {
  padding: 0 8px;
}

.option-item {
  margin: 5px 0;
}

.question-desc {
  padding: 5px 0;
  font-size: 8px;
}

.question-action {
  display: none;
  color: #a9afb2;
}

.question-action:hover {
  color: #018fe5;
  cursor: pointer;
}

.option-action {
  display: none;
  margin-left: 100px;
  padding: 0 10px;
  text-align: right;
  color: #a9afb2;
}

.option-action:hover {
  color: #018fe5;
}

.option-item:hover .option-action {
  display: inline-block;
  cursor: pointer;
}

.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  background-color: #fff;
  opacity: 0.72;
  cursor: not-allowed;
  color: #515a6e;
}

.ivu-input-number-input[disabled] {
  color: #515a6e;
}

.ivu-radio-disabled .ivu-radio-inner:after {
  background-color: #515a6e;
}

.ivu-checkbox-disabled + span {
  color: #515a6e;
  cursor: not-allowed;
}

.ivu-checkbox-disabled.ivu-checkbox-checked .ivu-checkbox-inner:after {
  -webkit-animation-name: none;
  animation-name: none;
  border-color: #515a6e;
}

.ivu-input-number-disabled .ivu-input-number-input {
  opacity: 0.72;
  cursor: not-allowed;
  background-color: #fff;
}

.checkbox-list label {
  height: 30px;
  line-height: 30px;
}
</style>
