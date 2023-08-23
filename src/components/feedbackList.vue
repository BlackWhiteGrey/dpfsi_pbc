<template>
  <div>
    <Form inline>
      <Form-item v-show="areashow" prop="user" style="width: 260px">
        <Select v-model="areas" placeholder="未选择默认全国">
          <Option value="" key="0">不限</Option>
          <Option
            v-for="item in areaList"
            :value="item.value"
            :key="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </Form-item>
      <Form-item style="width: 260px">
        <Input v-model="uCompany" placeholder="单位名称"> </Input>
      </Form-item>
      <Form-item>
        <Button type="primary" icon="ios-search" @click="fetchData(1)"
          >搜索</Button
        >
        <Button icon="ios-refresh" @click="fetchData(currentPage)">刷新</Button>
      </Form-item>
    </Form>
    <Table
      border
      :context="self"
      :columns="submitStatisColumns"
      :data="submitStatisData"
      :loading="submitStatisLoading"
    >
    </Table>
    <div style="margin: 10px; overflow: hidden">
      <div style="float: right; margin-top: 16px" v-if="!submitStatisLoading">
        <Page
          show-total
          :total="total"
          :current="currentPage"
          :page-size="pageSize"
          @on-change="fetchData"
        ></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { province } from '../../static/js/province.min.js';
import { formatDate } from '../common/js/utils';
export default {
  props: {
    area: {
      type: String,
      default: '',
    },
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
      self: this,
      uCompany: '',
      areaList: province,
      areashow: true,
      areas: '',
      currentPage: 1,
      total: 0,
      pageSize: 10,
      submitStatisLoading: true,
      submitStatisData: [],
      submitStatisColumns: [
        {
          title: '单位名称',
          key: 'u_company',
          width: '250',
          tooltip: true,
        },
        {
          title: '牵头部门',
          key: 'u_department',
          tooltip: true,
        },
        {
          title: '省份',
          key: 'u_province',
          tooltip: true,
        },
        {
          title: '联系人',
          key: 'u_contact',
          tooltip: true,
        },
        {
          title: '联系方式',
          key: 'u_phone',
          tooltip: true,
        },
        {
          title: '提交时间',
          width: 120,
          align: 'center',
          key: 'u_time',
          render: (h, params) => {
            return h('span', formatDate(params.row.u_time));
          },
        },
        {
          title: '审核状态',
          key: 'audit_time',
          align: 'center',
          tooltip: true,
          render: (h, params) => {
            return h(
              'span',
              params.row.audit_time === '' || params.row.audit_time === null
                ? '未审核'
                : '已审核'
            );
          },
        },
        {
          title: '审核机构',
          key: 'audit_pbc',
          align: 'center',
          tooltip: true,
          render: (h, params) => {
            return h(
              'span',
              params.row.audit_pbc === '' || params.row.audit_time === null
                ? ''
                : params.row.audit_pbc.substring(6)
            );
          },
        },
        {
          title: '操作',
          ellipsis: true,
          align: 'center',
          width: 130,
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type:
                      params.row.audit_time === '' ||
                      params.row.audit_time === null
                        ? 'warning'
                        : 'primary',
                    size: 'small',
                  },
                  nativeOn: {
                    click: () => {
                      this.preview(params.row.n_id, params.row.u_id);
                    },
                  },
                },
                params.row.audit_time === '' || params.row.audit_time === null
                  ? '审核'
                  : '查看'
              ),
              h(
                'Poptip',
                {
                  props: {
                    placement: 'left',
                    confirm: true,
                    title:
                      '您确认删除该答卷吗？一经删除将不可恢复，如需继续，请确定！',
                    width: '220',
                    transfer: true,
                  },
                  style: {
                    textAlign: 'left',
                    margin: '0 8px',
                  },
                  on: {
                    'on-ok': () => {
                      this.delResult(params.row.n_id, params.row.u_id);
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
                        onFocus: {
                          boxShadow: '0 0 0 0 #fff',
                        },
                      },
                    },
                    '删除'
                  ),
                ]
              ),
            ]);
          },
        },
      ],
    };
  },
  watch: {
    modalopen: function () {
      if (this.loginUser().u_admin === '0') {
        this.areas = this.loginUser().u_province;
        this.areashow = false;
      } else {
        this.areas = this.area;
      }
      if (this.modalopen) {
        this.fetchData(1);
      }
    },
    naireId: function () {
      if (this.loginUser().u_admin === '0') {
        this.areas = this.loginUser().u_province;
        this.areashow = false;
      } else {
        this.areas = this.area;
      }
      if (this.modalopen) {
        this.fetchData(1);
      }
    },
    area: function () {
      if (this.loginUser().u_admin === '0') {
        this.areas = this.loginUser().u_province;
        this.areashow = false;
      } else {
        this.areas = this.area;
      }
      if (this.modalopen) {
        this.fetchData(1);
      }
    },
  },
  methods: {
    loginUser() {
      return JSON.parse(localStorage.getItem('USER'));
    },
    // 查看回收情况 数据获取
    fetchData(curPage) {
      this.currentPage = curPage;
      this.submitStatisLoading = true;
      // 从服务端获取数据
      // 往后台传2各参数，每页显示条数和当前页码
      this.$http
        .get('/naire/submitStatis', {
          params: {
            n_id: this.naireId,
            current: this.currentPage,
            page_size: this.pageSize,
            areas: this.areas,
            uCompany: this.uCompany,
            usercode: this.loginUser().u_code,
            pbccode: this.loginUser().u_pbccode,
            admin: this.loginUser().u_admin,
          },
        })
        .then((response) => {
          this.submitStatisData = response.data.data;
          this.total = response.data.total;
          this.submitStatisLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('网络错误，请重试');
        });
    },
    // 问卷预览
    preview(nid, uid) {
      if (uid === null || uid === undefined) {
        window.open(window.location.origin + '/#/view/' + nid);
      } else {
        window.open(window.location.origin + '/#/view/' + nid + '/' + uid);
      }
    },
    // 删除答卷
    delResult(nid, uid) {
      this.$http
        .get('/naire/delResult', {
          params: {
            n_id: nid,
            u_id: uid,
          },
        })
        .then((response) => {
          if (response.data.err === 0) {
            this.$Message.success('删除成功');
            this.fetchData(this.currentPage);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('删除失败');
        });
    },
  },
};
</script>
