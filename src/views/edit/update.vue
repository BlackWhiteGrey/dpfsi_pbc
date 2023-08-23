<template>
  <div class="edit">
    <Card>
      <p slot="title">调研基本信息</p>
      <Form :model="naire" :label-width="120">
        <FormItem label="调研名称">
          <Input v-model="title" ref="title" placeholder="请输入调研名称">
          </Input>
        </FormItem>
        <FormItem label="调研介绍">
          <Input
            v-model="intro"
            @on-change="updateIntro"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 8 }"
            placeholder="请输入调研介绍..."
          >
          </Input>
        </FormItem>
        <FormItem label="调研截止日期">
          <DatePicker
            style="width: 260px"
            type="datetime"
            placeholder="截止日期"
            format="yyyy-MM-dd HH:mm:ss"
            v-model="deadline"
            :editable="false"
            placement="bottom"
            :options="dateOption"
          >
          </DatePicker>
        </FormItem>
        <FormItem label="调研区域">
          <Select
            v-model="areas"
            multiple
            style="width: 260px"
            placeholder="未选择默认全国"
          >
            <Option
              v-for="item in areaList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="调研机构类型">
          <Select
            v-model="categories"
            multiple
            style="width: 260px"
            placeholder="未选择默认所有类型"
          >
            <Option
              v-for="item in cateList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="附件">
          <Upload
            v-show="attach === null || attach === ''"
            :disabled="isPreview"
            style="display: inline-block"
            :action="`${baseURL}/naire/upload`"
            name="userfile"
            :show-upload-list="false"
            :data="{ id: 0 }"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :on-success="handleAttachSuccess"
            :on-error="handleError"
          >
            <Button>添加附件</Button>
          </Upload>
          <Button
            style="display: inline-block"
            v-show="attach !== null && attach !== ''"
            :to="`${baseURL}` + attach"
            target="_blank"
            >查看附件</Button
          >
          <Button
            style="display: inline-block"
            v-show="attach !== null && attach !== ''"
            @click="delAttach(attach)"
            >删除附件</Button
          >
        </FormItem>
      </Form>
    </Card>

    <Card style="margin-top: 16px">
      <p slot="title">制定调研指标</p>
      <questionList
        :questionList="naire.topic"
        :isPreview="true"
        :isAdmin="true"
        :current-page="1"
        :page-size="100"
      >
      </questionList>
      <div style="text-align: center">
        <Dropdown placement="top">
          <a href="javascript:void(0)">
            <Icon
              type="md-add-circle"
              style="font-size: 36px; color: rgb(45, 140, 240)"
            />
          </a>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="addRadio">单选</DropdownItem>
            <DropdownItem @click.native="addCheckbox">多选</DropdownItem>
            <DropdownItem @click.native="addTextarea">文本</DropdownItem>
            <DropdownItem @click.native="addNumber">数值</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </Card>

    <Row
      style="padding: 32px 0 16px 0"
      type="flex"
      justify="center"
      align="middle"
    >
      <Button style="margin-right: 16px" @click="handleSave">更新问卷</Button>
      <Button type="success" @click="handlePublish">发布问卷</Button>
    </Row>
    <!-- addRadio -->
    <Modal v-model="addRadio_modal" title="添加单选题" :mask-closable="false">
      <!-- form表单-->
      <Form
        ref="addRadio"
        v-model="addRadio_form"
        :label-width="80"
        class="form"
      >
        <FormItem label="段落说明" prop="sectioninfo">
          <Input
            v-model="addRadio_form.sectioninfo"
            placeholder="请输入段落说明，可以为空"
          ></Input>
        </FormItem>
        <FormItem label="题目" prop="title">
          <Input
            v-model="addRadio_form.question"
            placeholder="请输入题目内容"
          ></Input>
        </FormItem>
        <FormItem label="题目说明" prop="description">
          <Input
            type="textarea"
            v-model="addRadio_form.description"
            placeholder="请输入题目说明，可以为空"
          ></Input>
        </FormItem>
        <FormItem label="选项" prop="title">
          <div
            class="option-item"
            v-for="(option, index) in addRadio_form.options"
          >
            <Row>
              <Col span="18">
                <Input
                  v-model="option.content"
                  :key="index"
                  placeholder="请输入选项内容"
                  style="display: inline-block"
                ></Input
              ></Col>
              <Col span="6">
                <div class="option-btn">
                  <Button
                    type="success"
                    icon="md-add"
                    size="small"
                    @click="addOption(addRadio_form.options)"
                  ></Button>
                  <Button
                    type="warning"
                    icon="md-remove"
                    size="small"
                    @click="delOption(addRadio_form.options, index)"
                  ></Button>
                </div>
              </Col>
            </Row>
            <div class="option-addtion">
              是否有附加说明内容：
              <i-switch v-model="option.isAddition">
                <span slot="open">有</span>
                <span slot="close">无</span>
              </i-switch>
            </div>
          </div>
        </FormItem>
        <FormItem label="必填项">
          <div class="option-addtion">
            <i-switch v-model="addRadio_form.isRequired">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
        <FormItem label="上传附件">
          <div class="option-addtion">
            <i-switch v-model="addRadio_form.hasattach">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          :loading="addRadio_loading"
          @click="submitRadio('addRadio')"
          >提交</Button
        >
        <Button @click="closeRadioModal">关闭</Button>
      </div>
    </Modal>
    <!-- addCheckbox -->
    <Modal
      v-model="addCheckbox_modal"
      title="添加多选题"
      :mask-closable="false"
    >
      <!-- form表单-->
      <Form
        ref="addCheckbox"
        :model="addCheckbox_form"
        :label-width="80"
        class="form"
      >
        <FormItem label="段落说明" prop="sectioninfo">
          <Input
            v-model="addCheckbox_form.sectioninfo"
            placeholder="请输入段落说明，可以为空"
          ></Input>
        </FormItem>
        <FormItem label="题目" prop="title">
          <Input
            v-model="addCheckbox_form.question"
            placeholder="请输入题目内容"
          ></Input>
        </FormItem>
        <FormItem label="题目说明" prop="description">
          <Input
            type="textarea"
            v-model="addCheckbox_form.description"
            placeholder="请输入题目说明，可以为空"
          ></Input>
        </FormItem>
        <FormItem label="选项" prop="title">
          <div
            class="option-item"
            v-for="(option, index) in addCheckbox_form.options"
          >
            <Row>
              <Col span="18">
                <Input
                  v-model="option.content"
                  :key="index"
                  placeholder="请输入选项内容"
                  style="display: inline-block"
                ></Input
              ></Col>
              <Col span="6">
                <div class="option-btn">
                  <Button
                    type="success"
                    icon="md-add"
                    size="small"
                    @click="addOption(addCheckbox_form.options)"
                  ></Button>
                  <Button
                    type="warning"
                    icon="md-remove"
                    size="small"
                    @click="delOption(addCheckbox_form.options, index)"
                  ></Button>
                </div>
              </Col>
            </Row>
            <div class="option-addtion">
              是否有附加说明内容：
              <i-switch v-model="option.isAddition">
                <span slot="open">有</span>
                <span slot="close">无</span>
              </i-switch>
            </div>
          </div>
        </FormItem>
        <FormItem label="必填项">
          <div class="option-addtion">
            <i-switch v-model="addCheckbox_form.isRequired">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
        <FormItem label="上传附件">
          <div class="option-addtion">
            <i-switch v-model="addCheckbox_form.hasattach">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          :loading="addCheckbox_loading"
          @click="submitCheckbox('addCheckbox')"
          >提交</Button
        >
        <Button @click="closeCheckboxModal">关闭</Button>
      </div>
    </Modal>
    <!-- addTextarea -->
    <Modal
      v-model="addTextarea_modal"
      title="添加文本题"
      :mask-closable="false"
    >
      <!-- form表单-->
      <Form
        ref="addTextarea"
        :model="addTextarea_form"
        :label-width="80"
        class="form"
      >
        <FormItem label="段落说明" prop="sectioninfo">
          <Input
            v-model="addTextarea_form.sectioninfo"
            placeholder="请输入段落说明，可以为空"
          ></Input>
        </FormItem>
        <FormItem label="题目" prop="title">
          <Input
            v-model="addTextarea_form.question"
            placeholder="请输入题目内容"
          ></Input>
        </FormItem>
        <FormItem label="题目说明" prop="description">
          <Input
            type="textarea"
            v-model="addTextarea_form.description"
            placeholder="请输入题目说明，可以为空"
          ></Input>
        </FormItem>
        <FormItem label="必填项">
          <div class="option-addtion">
            <i-switch v-model="addTextarea_form.isRequired">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
        <FormItem label="上传附件">
          <div class="option-addtion">
            <i-switch v-model="addTextarea_form.hasattach">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          :loading="addTextarea_loading"
          @click="submitTextarea('addTextarea')"
          >提交</Button
        >
        <Button @click="closeTextareaModal">关闭</Button>
      </div>
    </Modal>
    <!-- addNumber -->
    <Modal v-model="addNumber_modal" title="添加数值题" :mask-closable="false">
      <!-- form表单-->
      <Form
        ref="addNumber"
        :model="addNumber_form"
        :label-width="80"
        class="form"
      >
        <FormItem label="段落说明" prop="sectioninfo">
          <Input
            v-model="addNumber_form.sectioninfo"
            placeholder="请输入段落说明，可以为空"
          ></Input>
        </FormItem>
        <FormItem label="题目" prop="title">
          <Input
            type="textarea"
            v-model="addNumber_form.question"
            placeholder="请输入题目内容"
          ></Input>
        </FormItem>
        <FormItem label="题目说明" prop="description">
          <Input
            v-model="addNumber_form.description"
            placeholder="输入题目说明，可以为空"
          ></Input>
        </FormItem>
        <FormItem label="最大值" prop="maxvalue">
          <InputNumber
            :min="0"
            v-model="addNumber_form.maxvalue"
            placeholder="设定最大值"
          ></InputNumber>
        </FormItem>
        <FormItem label="权重" prop="weight">
          <InputNumber
            :min="0"
            v-model="addNumber_form.weight"
            placeholder="设定权重"
          ></InputNumber>
        </FormItem>
        <FormItem label="必填项">
          <div class="option-addtion">
            <i-switch v-model="addNumber_form.isRequired">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
        <FormItem label="上传附件">
          <div class="option-addtion">
            <i-switch v-model="addNumber_form.hasattach">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          :loading="addNumber_loading"
          @click="submitNumber('addNumber')"
          >提交</Button
        >
        <Button @click="closeNumberModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import config from '@/config';
import questionList from '@/components/questionList';
import { province } from '../../../static/js/province.min.js';
export default {
  components: {
    questionList,
  },
  data() {
    return {
      baseURL: config.APIBaseURL,
      addRadio_modal: false,
      addRadio_loading: false,
      addRadio_form: {},
      addCheckbox_modal: false,
      addCheckbox_loading: false,
      addCheckbox_form: {},
      addTextarea_modal: false,
      addTextarea_loading: false,
      addTextarea_form: {},
      addNumber_modal: false,
      addNumber_loading: false,
      addNumber_form: {},
      areaList: province,
      cateList: [
        {
          value: '货币当局',
          label: '货币当局',
        },
        {
          value: '银行业存款类金融机构',
          label: '银行业存款类金融机构',
        },
        {
          value: '银行业非存款类金融机构',
          label: '银行业非存款类金融机构',
        },
        {
          value: '证券业金融机构',
          label: '证券业金融机构',
        },
        {
          value: '保险业金融机构',
          label: '保险业金融机构',
        },
        {
          value: '交易及结算类金融机构',
          label: '交易及结算类金融机构',
        },
        {
          value: '金融控股公司',
          label: '金融控股公司',
        },
        {
          value: '境外机构',
          label: '境外机构',
        },
        {
          value: '其他',
          label: '其他',
        },
      ],
      dateOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
      textarea: '',
      templatelist: [],
      defaultQuestions: [],
    };
  },
  computed: {
    naire() {
      return this.$store.getters.naire;
    },
    title: {
      get() {
        return this.$store.getters.naire.title;
      },
      set(value) {
        this.$store.commit('UPDATE_TITLE', value);
      },
    },
    ratio: {
      get() {
        return this.$store.getters.naire.ratio;
      },
      set(value) {
        this.$store.commit('UPDATE_RATIO', value);
      },
    },
    intro: {
      get() {
        return this.$store.getters.naire.intro;
      },
      set(value) {
        this.$store.commit('UPDATE_INTRO', value);
      },
    },
    deadline: {
      get() {
        return this.$store.getters.naire.deadline;
      },
      set(value) {
        this.$store.commit('UPDATE_DEADLINE', value);
      },
    },
    areas: {
      get() {
        return this.$store.getters.naire.areas;
      },
      set(value) {
        this.$store.commit('UPDATE_AREAS', value);
      },
    },
    categories: {
      get() {
        return this.$store.getters.naire.categories;
      },
      set(value) {
        this.$store.commit('UPDATE_CATEGORIES', value);
      },
    },
    ntype: {
      get() {
        return this.$store.getters.naire.ntype;
      },
      set(value) {
        this.$store.commit('UPDATE_NTYPE', value);
      },
    },
    attach: {
      get() {
        return this.$store.getters.naire.attach;
      },
      set(value) {
        this.$store.commit('UPDATE_ATTACH', value);
      },
    },
  },
  created() {
    // 如果id存在，则从服务器获取数据，并展示
    this.fetchData();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: 'fetchData',
  },
  methods: {
    warning(nodesc, title, desc) {
      this.$Notice.warning({
        title: title,
        desc: nodesc ? '' : desc,
      });
    },
    error(nodesc, title, desc) {
      this.$Notice.error({
        title: title,
        desc: nodesc ? '' : desc,
      });
    },
    formatRatio(val) {
      return '比例为: ' + val + '%';
    },
    // 校验填写项是否正确填写
    validQuestion(target) {
      let isPassed = true;
      if (target.question === '') {
        this.warning(false, '题目', '请输入问题内容');
        isPassed = false;
      }
      if (target.options.length < 1) {
        this.warning(false, '选项', '选项至少增加一个');
        isPassed = false;
      }
      let valid = target.options.some((item, index) => {
        return item.content === '';
      });
      if (valid) {
        this.warning(false, '选项内容', '请输入选项内容');
        isPassed = false;
      }
      return isPassed;
    },
    validNaire() {
      let isPassed = true;
      if (this.title === '') {
        this.warning(false, '问卷标题', '请输入问卷标题');
        this.$refs.title.focus();
        isPassed = false;
      }
      if (this.deadline === '' || !this.deadline) {
        this.warning(false, '截止时间', '请选择问卷截止时间');
        isPassed = false;
      }
      if (this.naire.topic.length < 1) {
        this.warning(false, '问卷题目', '请至少添加一道问卷题目');
        isPassed = false;
      }
      return isPassed;
    },
    // 用于问卷介绍的 v-model 双向数据绑定
    updateIntro(e) {
      this.$store.commit('UPDATE_INTRO', e.target.value);
    },
    handleSave() {
      if (this.validNaire()) {
        this.$store.dispatch('changeNaireStatus', 0);
        this.saveNaire('保存失败，请重试');
      }
    },
    handlePublish() {
      if (this.validNaire()) {
        this.$store.dispatch('changeNaireStatus', 1);
        this.saveNaire('发布失败，请重试');
      }
    },
    delAttach(attach) {
      this.$http
        .post('/naire/delattach', {
          filepath: attach,
        })
        .then((response) => {
          if (response.data.err === 0) {
            this.attach.set('');
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
    // 文件上传成功的回调
    handleAttachSuccess(response, file, fileList) {
      console.log(response);
      if (response.err === 0) {
        this.$Message.success(response.msg);
        console.log(this.questionList);
        this.attach = response.uploadfile;
      } else {
        this.$Message.error('上传出错');
      }
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
        this.$store.commit('UPDATE_UPLOADFILE', response.uploadfile);
      } else {
        this.$Message.error('上传出错');
      }
    },
    // 文件长传失败的回调
    handleError(error, file, fileList) {
      console.log(error);
      this.$Message.error('上传出错');
    },
    // 新建题目
    addRadio() {
      this.addRadio_modal = true;
      const radioQues = {
        question: '',
        sectioninfo: '',
        options: [],
        description: '',
        type: '单选',
        isRequired: true,
        hasattach: false,
        depend: '',
        selectContent: '',
        attach: '',
      };
      this.addRadio_form = Object.assign({}, radioQues);
      const tempData = {
        content: '',
        isAddition: false,
      };
      this.addRadio_form.options.splice(
        0,
        this.addRadio_form.options.length,
        Object.assign({}, tempData)
      );
    },
    addCheckbox() {
      this.addCheckbox_modal = true;
      const checkboxQues = {
        question: '',
        sectioninfo: '',
        options: [],
        description: '',
        type: '多选',
        isRequired: true,
        hasattach: false,
        depend: '',
        selectMultipleContent: [],
        attach: '',
      };
      this.addCheckbox_form = Object.assign({}, checkboxQues);
      const tempData = {
        content: '',
        isAddition: false,
      };
      this.addCheckbox_form.options.splice(
        0,
        this.addCheckbox_form.options.length,
        Object.assign({}, tempData)
      );
    },
    addTextarea() {
      this.addTextarea_modal = true;
      const TextareaQues = {
        question: '',
        sectioninfo: '',
        description: '',
        type: '文本',
        isRequired: true,
        hasattach: false,
        depend: '',
        selectContent: '',
        attach: '',
      };
      this.addTextarea_form = Object.assign({}, TextareaQues);
    },
    addNumber() {
      this.addNumber_modal = true;
      const NumberQues = {
        question: '',
        sectioninfo: '',
        description: '',
        type: '数值',
        maxvalue: 100,
        weight: 1,
        isRequired: true,
        hasattach: false,
        depend: '',
        selectContent: '',
        attach: '',
      };
      this.addNumber_form = Object.assign({}, NumberQues);
    },
    // 新增选项
    addOption(source) {
      const tempData = {
        content: '选项',
        isAddition: false,
      };
      source.push(Object.assign({}, tempData));
    },
    // 删除选项
    delOption(source, index) {
      if (source.length > 1) {
        source.splice(index, 1);
      } else {
        this.$Message.warning('最后一个啦，不要删除哦');
      }
    },
    // 默认题目
    submitDefaultQuestion() {
      this.defaultQuestions.forEach((q) => {
        this.$store.dispatch('addQuestion', q);
      });
    },
    // 提交题目
    submitRadio(name) {
      if (this.validQuestion(this.addRadio_form)) {
        this.addRadio_form.description = this.myTrim(
          this.addRadio_form.description,
          'g'
        );
        const data = Object.assign({}, this.addRadio_form);
        this.$store.dispatch('addQuestion', data);
        this.addRadio_modal = false;
      }
      console.log(this.addRadio_form);
    },
    submitCheckbox(name) {
      if (this.validQuestion(this.addCheckbox_form)) {
        this.addCheckbox_form.description = this.myTrim(
          this.addCheckbox_form.description,
          'g'
        );
        const data = Object.assign({}, this.addCheckbox_form);
        this.$store.dispatch('addQuestion', data);
        this.addCheckbox_modal = false;
      }
    },
    submitTextarea(name) {
      if (this.addTextarea_form.question === '') {
        this.warning(false, '题目', '请输入问题内容');
        return;
      }
      this.addTextarea_form.description = this.myTrim(
        this.addTextarea_form.description,
        'g'
      );
      const data = Object.assign({}, this.addTextarea_form);
      this.$store.dispatch('addQuestion', data);
      this.addTextarea_modal = false;
    },
    myTrim(str, isGlobal) {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g, '');
      if (isGlobal.toLowerCase() === 'g') {
        result = result.replace(/\s/g, '');
      }
      return result;
    },
    submitNumber(name) {
      if (this.addNumber_form.question === '') {
        this.warning(false, '题目', '请输入问题内容');
        return;
      }
      this.addNumber_form.description = this.myTrim(
        this.addNumber_form.description,
        'g'
      );
      if (
        this.addNumber_form.weight === '' ||
        this.addNumber_form.weight === null
      ) {
        this.addNumber_form.weight = 1;
      }
      if (
        this.addNumber_form.maxvalue === '' ||
        this.addNumber_form.maxvalue === null
      ) {
        this.addNumber_form.maxvalue = 100;
      }
      if (
        this.addNumber_form.description === '' ||
        this.addNumber_form.description === null
      ) {
        this.addNumber_form.description =
          this.addNumber_form.maxvalue + '|' + this.addNumber_form.weight;
      } else {
        this.addNumber_form.description =
          this.addNumber_form.maxvalue +
          '|' +
          this.addNumber_form.weight +
          '|' +
          this.addNumber_form.description;
      }
      const data = Object.assign({}, this.addNumber_form);
      this.$store.dispatch('addQuestion', data);
      this.addNumber_modal = false;
    },
    // 关闭弹框
    closeRadioModal() {
      this.addRadio_modal = false;
    },
    closeCheckboxModal() {
      this.addCheckbox_modal = false;
    },
    closeTextareaModal() {
      this.addTextarea_modal = false;
    },
    closeNumberModal() {
      this.addNumber_modal = false;
    },
    // 当传入id值时，获取问卷详情，用于编辑
    fetchData() {
      if (this.$route.params.id) {
        this.$store
          .dispatch('editNaire', {
            n_id: this.$route.params.id,
          })
          .then((response) => {
            if (response.data.naire.status !== '0') {
              this.$Message.error('问卷已发布，不可再编辑！');
              history.back();
            } else if (response.data.err === 0) {
              this.$store.dispatch('updateNaire', response.data.naire);
              this.$store.dispatch('clearQuestion');
              this.defaultQuestions = response.data.questions;
              this.$nextTick(() => {
                this.submitDefaultQuestion();
              });
              console.log(this.naire);
            }
          });
        // this.$store.dispatch('getQuestionList')
        // this.$store.dispatch('changeStatus', 'update')
        // 通过 JSON 序列化将数组不再为引用，避免出现在 store 外修改 state 的内容
      }
    },
    // 保存问卷和发布问卷
    saveNaire(message) {
      let _axios = this.$store.dispatch('updateNewNaire');
      _axios
        .then((response) => {
          console.log(response.data);
          if (response.data.err === 0) {
            this.$Message.success(response.data.data);
            this.$router.push('/platform/list');
          } else {
            this.$Message.error(response.data.data);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error(message);
        });
    },
  },
};
</script>

<style>
.option-btn {
  padding-left: 10px;
}

.option-item {
  padding: 5px 0;
}

.option-addtion {
  height: 30px;
  line-height: 30px;
}

.add-button button {
  margin: 0 10px;
}

.ivu-card-head {
  padding: 14px 16px;
}
</style>
