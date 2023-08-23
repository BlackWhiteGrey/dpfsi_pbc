<template>
  <div class="user">
    <Row type="flex" justify="start" style="padding-bottom: 16px">
      <Button icon="ios-person" @click="handleAdd" style="margin-right: 24px"
        >新增用户</Button
      >
      <Input
        v-model="uCompany"
        placeholder="机构名称"
        style="width: 200px; margin-right: 24px"
      >
      </Input>
      <Select
        v-model="area"
        v-show="areashow"
        placeholder="所属省份"
        style="width: 200px; margin-right: 24px"
      >
        <Option value="" key="0">不限</Option>
        <Option
          v-for="item in areaList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <Select
        v-model="category"
        placeholder="机构类别"
        style="width: 200px; margin-right: 24px"
      >
        <Option value="" key="0">不限</Option>
        <Option
          v-for="item in cateList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <Button type="primary" icon="ios-search" @click="getData(1)"
        >搜索用户</Button
      >
    </Row>
    <Row>
      <Col span="24">
        <Table
          border
          :loading="loading"
          :columns="tableColumns"
          :data="userData"
          @on-selection-change="selectionChange"
        >
        </Table>
        <div style="margin: 16px 0 16px 0; overflow: hidden">
          <div style="float: right" v-if="!loading">
            <Page
              show-elevator
              show-total
              show-sizer
              @on-page-size-change="changePageSize"
              :total="total"
              :current="currentPage"
              :page-size="pageSize"
              @on-change="getData"
            ></Page>
          </div>
        </div>
      </Col>
    </Row>

    <!-- 新增用户表单 -->
    <Modal
      v-model="addUserModel"
      title="新增用户"
      :mask-closable="false"
      class-name="vertical-center-modal"
    >
      <!-- form表单-->
      <Form
        ref="addUser"
        :model="addUserForm"
        :rules="addUserRule"
        :label-width="160"
        class="form"
      >
        <FormItem label="机构名称" prop="u_company">
          <Input v-model="addUserForm.u_company" placeholder=""></Input>
        </FormItem>
        <FormItem label="登录密码" prop="u_password">
          <Input v-model="addUserForm.u_password" placeholder=""></Input>
        </FormItem>
        <FormItem label="机构类别" prop="u_category">
          <Select v-model="addUserForm.u_category" style="width: 200px">
            <Option
              v-for="item in cateList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="金融机构代码" prop="u_code">
          <Input v-model="addUserForm.u_code" placeholder=""></Input>
        </FormItem>
        <FormItem label="LEI代码" prop="u_leicode">
          <Input v-model="addUserForm.u_leicode" placeholder=""></Input>
        </FormItem>
        <FormItem label="所属金融管理部门" prop="u_pbccode">
          <Select
            v-model="addUserForm.u_pbccode"
            filterable
            label-in-value
            :remote-method="searchPBC"
            :loading="loadingPBC"
            @on-change="addUserFormSelectPBC"
          >
            <Option
              v-for="(option, index) in optionsPBC"
              :value="option.value"
              :key="index"
              >{{ option.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="所在省市区" prop="u_province">
          <Cascader
            :data="provinceData"
            v-model="addUserForm.u_province"
          ></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          :loading="addFormLoading"
          @click="submitUser('addUser')"
          >提交</Button
        >
        <Button @click="addUserModel = false">关闭</Button>
      </div>
    </Modal>

    <!-- 编辑用户表单 -->
    <Modal
      v-model="updateUserModel"
      title="编辑用户"
      :mask-closable="false"
      class-name="vertical-center-modal"
    >
      <!-- form表单-->
      <Form
        ref="updateUser"
        :model="updateUserForm"
        :rules="updateUserRule"
        :label-width="160"
        class="form"
      >
        <FormItem label="机构名称" prop="u_company">
          <Input v-model="updateUserForm.u_company" placeholder=""></Input>
        </FormItem>
        <FormItem label="登录密码" prop="u_password">
          <Input
            type="password"
            v-model="updateUserForm.u_password"
            placeholder="留空为不修改密码"
          ></Input>
        </FormItem>
        <FormItem label="机构类别" prop="u_category">
          <Select v-model="updateUserForm.u_category" style="width: 200px">
            <Option
              v-for="item in cateList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="金融机构代码" prop="u_code">
          <Input v-model="updateUserForm.u_code" placeholder=""></Input>
        </FormItem>
        <FormItem label="LEI代码" prop="u_leicode">
          <Input v-model="updateUserForm.u_leicode" placeholder=""></Input>
        </FormItem>
        <FormItem label="所属金融管理部门" prop="u_pbccode">
          <Select
            v-model="updateUserForm.u_pbccode"
            filterable
            label-in-value
            :remote-method="searchPBC"
            :loading="loadingPBC"
            @on-change="updateUserFormSelectPBC"
          >
            <Option
              v-for="(option, index) in optionsPBC"
              :value="option.value"
              :key="index"
              >{{ option.label }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="所在省市区" prop="u_province">
          <Cascader
            :data="provinceData"
            v-model="updateUserForm.u_province"
          ></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          :loading="updateFormLoading"
          @click="updateUser('updateUser')"
          >提交</Button
        >
        <Button @click="updateUserModel = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { province } from '../../../static/js/province.min.js';
import sha1 from 'js-sha1';
const OK = 0; // OK
export default {
  data() {
    return {
      loadingPBC: false,
      optionsPBC: [],
      selectRows: [],
      uCompany: '',
      area: '',
      areashow: true,
      category: '',
      cateList: [
        {
          value: '金融管理部门',
          label: '金融管理部门',
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
          value: '金融机具企业',
          label: '金融机具企业',
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
      provinceData: province,
      self: this,
      loading: true,
      currentPage: 1,
      total: 5,
      pageSize: 10,
      tableColumns: [
        {
          title: '操作',
          key: 'action',
          width: 140,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    size: 'small',
                  },
                  nativeOn: {
                    click: () => {
                      this.update(params.index);
                    },
                  },
                  style: {
                    margin: '0 8px 0 0',
                  },
                },
                '修改'
              ),
              h(
                'Poptip',
                {
                  props: {
                    placement: 'left',
                    confirm: true,
                    title: '确认删除这条内容吗？',
                    width: '200',
                    transfer: true,
                  },
                  style: {
                    textAlign: 'left',
                  },
                  on: {
                    'on-ok': () => {
                      this.remove(params.index);
                    },
                  },
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small',
                      },
                      style: {
                        backgroundColor: '#FF647C',
                        border: 'none',
                      },
                    },
                    '删除'
                  ),
                ]
              ),
            ]);
          },
        },
        {
          title: '机构名称',
          minWidth: 400,
          key: 'u_company',
        },
        {
          title: '机构类别',
          width: 200,
          key: 'u_category',
        },
        {
          title: '金融机构代码',
          width: 160,
          key: 'u_code',
        },
        {
          title: 'LEI代码',
          width: 230,
          key: 'u_leicode',
        },
        {
          title: '所属金融管理部门',
          width: 250,
          key: 'u_pbcname',
        },
        {
          title: '所在省份',
          width: 100,
          key: 'u_province',
        },
        {
          title: '所在城市',
          width: 120,
          key: 'u_city',
        },
        {
          title: '所在地区',
          width: 100,
          key: 'u_region',
        },
      ],
      areaList: province,
      userData: [],
      addFormLoading: false,
      updateUserRule: {
        u_company: [
          { required: true, message: '请输入金融机构名称', trigger: 'blur' },
        ],
        u_category: [
          { required: true, message: '请选择机构类别', trigger: 'blur' },
        ],
        u_code: [
          { required: true, message: '请输入金融机构编码', trigger: 'blur' },
        ],
        u_province: [
          {
            type: 'array',
            required: true,
            message: '请选择所在省市区',
            trigger: 'blur',
          },
        ],
        u_pbccode: [
          {
            required: true,
            message: '请输入所属金融管理部门',
            trigger: 'blur',
          },
        ],
      },
      addUserRule: {
        u_company: [
          { required: true, message: '请输入金融机构名称', trigger: 'blur' },
        ],
        u_password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
        ],
        u_category: [
          { required: true, message: '请选择机构类别', trigger: 'blur' },
        ],
        u_code: [
          { required: true, message: '请输入金融机构编码', trigger: 'blur' },
        ],
        u_province: [
          {
            type: 'array',
            required: true,
            message: '请选择所在省市区',
            trigger: 'blur',
          },
        ],
        u_pbccode: [
          {
            required: true,
            message: '请输入所属金融管理部门',
            trigger: 'blur',
          },
        ],
      },
      addUserForm: {
        u_company: '',
        u_password: '',
        u_category: '',
        u_code: '',
        u_leicode: '',
        u_province: [],
        u_pbccode: '',
        u_pbcname: '',
      },
      addUserModel: false,
      updateFormLoading: false,
      updateUserModel: false,
      updateUserForm: {},
    };
  },
  methods: {
    selectionChange(selection) {
      this.selectRows = selection;
    },
    addUserFormSelectPBC(pbc) {
      this.addUserForm.u_pbccode = pbc.value;
      this.addUserForm.u_pbcname = pbc.label;
    },
    updateUserFormSelectPBC(pbc) {
      if (pbc !== undefined) {
        this.updateUserForm.u_pbccode = pbc.value;
        this.updateUserForm.u_pbcname = pbc.label;
      }
    },
    searchPBC(query) {
      if (query.length >= 2 && query.length <= 6) {
        this.loadingPBC = true;
        this.$http
          .post('/user/pbc', {
            name:
              this.loginUser().u_company === '中国人民银行总行'
                ? query
                : this.loginUser().u_company,
          })
          .then((response) => {
            if (response.data.err === OK) {
              this.optionsPBC = response.data.pbc;
              this.loadingPBC = false;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (query === '') {
        this.optionsPBC = [];
      }
    },
    // 编辑用户
    update(index) {
      this.updateUserForm.u_pbccode = '';
      this.$http
        .get('/user', {
          params: {
            u_id: this.userData[index].u_id,
          },
        })
        .then((response) => {
          if (response.data.err === OK) {
            this.updateUserForm = response.data.data[0];
            this.updateUserForm.u_province = [
              this.updateUserForm.u_province,
              this.updateUserForm.u_city,
              this.updateUserForm.u_region,
            ];
            this.updateUserForm.u_password = '';
            this.optionsPBC = [
              {
                value: this.updateUserForm.u_pbccode,
                label: this.updateUserForm.u_pbcname,
              },
            ];
            this.updateUserModel = true;
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('获取用户数据失败');
        });
    },
    // 删除用户
    remove(index) {
      this.$http
        .post('/user/del', {
          u_id: this.userData[index].u_id,
        })
        .then((response) => {
          if (response.data.data > 0 && response.data.err === OK) {
            this.$Message.success(`成功删除${response.data.data}个用户`);
            this.userData.splice(index, 1);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('删除失败');
        });
    },
    betchRemove() {
      const rowIds = [];
      this.selectRows.forEach(({ uId }) => {
        rowIds.push(uId);
      });
      this.$http
        .post('/user/del', {
          u_id: rowIds + '',
        })
        .then((response) => {
          if (response.data.data > 0 && response.data.err === OK) {
            this.$Message.success(`成功删除${response.data.data}个用户`);
            this.getData(1);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('删除失败');
        });
    },
    changePageSize(pagesize) {
      this.pageSize = pagesize;
      this.getData(1);
    },
    // 拉取用户数据
    getData(curPage) {
      this.loading = true;
      this.currentPage = curPage;
      this.$http
        .get('/user', {
          params: {
            area: this.area,
            category: this.category,
            u_company: this.uCompany,
            pbccode: this.loginUser().u_pbccode,
            usercode: this.loginUser().u_code,
            current: this.currentPage,
            page_size: this.pageSize,
          },
        })
        .then((response) => {
          this.userData = response.data.data;
          this.total = response.data.total;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('网络错误，请重试');
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
      if (response.err === 0) {
        this.$Message.success(response.msg);
        this.getData();
      } else {
        this.$Message.error('上传出错');
      }
    },
    // 文件长传失败的回调
    handleError(error, file, fileList) {
      console.log(error);
      this.$Message.error('上传出错');
    },
    // 显示新增用户弹窗
    handleAdd() {
      this.optionsPBC = [];
      this.addUserModel = true;
    },
    loginUser() {
      return JSON.parse(localStorage.getItem('USER'));
    },
    // 编辑用户提交
    updateUser(name) {
      this.updateUserForm.u_password = sha1(this.updateUserForm.u_password);
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http
            .post('/user/updateUser', Object.assign({}, this.updateUserForm))
            .then((response) => {
              if (response.data.err === OK) {
                this.$Message.success(response.data.data);
                this.updateUserModel = false;
                this.$refs[name].resetFields();
                this.getData(1);
              } else {
                this.$Message.error(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
              this.$Message.error('修改失败');
            });
        } else {
          this.$Message.error('表单校验失败！');
        }
      });
    },
    // 提交新增用户
    submitUser(name) {
      this.addUserForm.u_password = sha1(this.addUserForm.u_password);
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http
            .post('/user/addUser', Object.assign({}, this.addUserForm))
            .then((response) => {
              if (response.data.err === OK) {
                this.$Message.success(response.data.data);
                this.addUserModel = false;
                this.$refs[name].resetFields();
                this.getData(1);
              } else {
                this.$Message.error(response.data.data);
              }
            })
            .catch((error) => {
              console.log(error);
              this.$Message.error('新增失败');
            });
        } else {
          this.$Message.error('表单校验失败！');
        }
      });

      console.log(Object.assign({}, this.addUserForm));
    },
  },
  created() {
    if (this.loginUser().u_admin === '0') {
      this.area = this.loginUser().u_province;
      province.forEach((p) => {
        if (p.value === this.loginUser().u_province) {
          this.provinceData = [p];
        }
      });
      this.areashow = false;
    }
    this.getData(1);
  },
};
</script>

<style>
.user {
  min-height: 672px;
  min-width: 1366px;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
.ivu-modal {
  top: 0;
}
</style>
