<template>
  <div class="naire-list">
    <Row type="flex" justify="start" style="padding-bottom: 16px">
      <Input
        v-model="sTitle"
        placeholder="输入查询调研标题"
        style="width: 200px; margin-right: 24px"
      ></Input>
      <DatePicker
        :value="sStart"
        :options="oStart"
        type="date"
        @on-change="startTimeChange"
        placeholder="设置调研开始日期"
        style="width: 200px; margin-right: 24px"
      ></DatePicker>
      <DatePicker
        :value="sEnd"
        :options="oEnd"
        type="date"
        @on-change="endTimeChange"
        placeholder="设置调研结束日期"
        style="width: 200px; margin-right: 24px"
      ></DatePicker>
      <Button type="primary" icon="ios-search" @click="getData(1)">搜索</Button>
      <Button
        style="margin-left: 24px"
        icon="ios-refresh"
        @click="getData(currentPage)"
        >刷新</Button
      >
    </Row>
    <Row>
      <Col span="24">
        <Table
          border
          :columns="columns"
          :data="naireList"
          :loading="loading"
        ></Table>
        <div style="float: right; margin-top: 16px" v-if="!loading">
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
      </Col>
    </Row>
    <!-- 复制地址 -->
    <Modal
      v-model="showURL"
      title="预览问卷"
      class-name="vertical-center-modal"
    >
      <Row>
        <Col span="18">
          <Input
            v-model="url"
            ref="copyURL"
            id="url"
            :autofocus="true"
            :readonly="true"
          ></Input>
        </Col>
        <Col span="4" offset="1">
          <Button
            class="copyboard"
            data-clipboard-target="#url"
            @click="openURL(url)"
            >打开问卷</Button
          >
        </Col>
      </Row>
      <Alert style="margin-top: 20px"
        >也可扫描下方二维码或右键保存二维码进行访问。</Alert
      >
      <div class="qrcode-wrapper">
        <div id="qrcode" ref="qrcode"></div>
      </div>
    </Modal>
    <!-- 修改截止时间 -->
    <Modal v-model="updateTime" title="修改截止时间" @on-ok="submitChangeTime">
      <Date-picker
        type="datetime"
        placeholder="截止日期"
        v-model="deadline"
        :editable="false"
        placement="bottom"
        :options="dateOption"
      >
      </Date-picker>
    </Modal>
    <!-- 查看回收情况 -->
    <Modal
      v-model="submitStatisModel"
      :title="currentNarie"
      class-name="vertical-center-modal"
      width="80%"
    >
      <feedbackList
        :naireId="currentId"
        area=""
        :modalopen="submitStatisModel"
      ></feedbackList>
    </Modal>
    <!-- 设置关联关系 -->
    <Modal
      v-model="associationModel"
      :title="currentNarie"
      footer-hide="true"
      class-name="vertical-center-modal"
      width="80%"
    >
      <associationList
        :naireId="currentId"
        :modalopen="associationModel"
      ></associationList>
    </Modal>
    <a id="download"></a>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2';
import { formatDate } from '../../common/js/utils';
import { province } from '../../../static/js/province.min.js';
import Clipboard from 'clipboard';
import feedbackList from '@/components/feedbackList';
import associationList from '@/components/associationList';

const OK = 0; // OK
export default {
  data() {
    return {
      self: this,
      loading: true,
      url: '',
      showURL: false,
      areaList: province,
      uCompany: '',
      areas: '',
      sTitle: '',
      sStart: new Date().getFullYear() + '-01-01',
      sEnd: new Date().getFullYear() + '-12-31',
      oStart: {},
      oEnd: {},
      submitStatisModel: false,
      associationModel: false,
      currentPage: 1,
      total: 5,
      pageSize: 10,
      currentNarie: '',
      updateTimeId: 0,
      updateTime: false,
      deadline: '',
      dateOption: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        },
      },
      currentId: '',
      columns: [
        {
          title: '操作',
          key: 'action',
          width: 260,
          align: 'center',
          render: (h, params) => {
            const _publishText =
              params.row.n_status === '1' ? '停止发布' : '发布问卷';
            let auth =
              this.loginUser().u_admin > '0' ||
              this.loginUser().u_id === params.row.u_id;

            return h(
              'div',
              {
                style: {
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              },
              [
                h(
                  'Button',
                  {
                    props: {
                      size: 'small',
                    },
                    nativeOn: {
                      click: () => {
                        this.getURL(params.row.n_id);
                      },
                    },
                  },
                  '预览'
                ),
                h(
                  'Badge',
                  {
                    attrs: {
                      count: params.row.re_count,
                      type: 'primary',
                      overflowCount: 999,
                    },
                  },
                  [
                    h(
                      'Tag',
                      {
                        props: {
                          type: 'border',
                          color: 'blue',
                        },
                        style: {
                          cursor: 'pointer',
                          fontSize: '14px',
                          marginLeft: '8px',
                        },
                        nativeOn: {
                          click: () => {
                            this.submitStatis(
                              params.row.n_id,
                              params.row.n_title
                            );
                          },
                        },
                      },
                      '查看反馈'
                    ),
                  ]
                ),
                auth
                  ? h(
                      'Poptip',
                      {
                        props: {
                          placement: 'left',
                          confirm: true,
                          title:
                            '您确认删除该问卷吗？所有答卷将一并删除且不可恢复，如需继续，请确定！',
                          width: '220',
                          transfer: true,
                        },
                        style: {
                          textAlign: 'left',
                          margin: '0 8px',
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
                    )
                  : '',
                h(
                  'Dropdown',
                  {
                    props: {
                      transfer: true,
                    },
                  },
                  [
                    h(
                      'Button',
                      {
                        props: {
                          size: 'small',
                        },
                      },
                      [
                        h('Icon', {
                          props: {
                            type: 'ios-arrow-down',
                          },
                        }),
                      ],
                      '更多'
                    ),
                    h(
                      'DropdownMenu',
                      {
                        slot: 'list',
                      },
                      [
                        h(
                          'DropdownItem',
                          {
                            nativeOn: {
                              click: () => {
                                this.exportEXL(
                                  params.row.re_count,
                                  params.row.n_id
                                );
                              },
                            },
                          },
                          [h('span', '导出反馈数据')]
                        ),
                        auth
                          ? h(
                              'DropdownItem',
                              {
                                nativeOn: {
                                  click: () => {
                                    // console.log(params.row.n_id)
                                    this.currentId = params.row.n_id;
                                    this.currentNarie =
                                      params.row.n_title +
                                      '问卷题目关联关系设置';
                                    this.associationModel = true;
                                  },
                                },
                              },
                              [h('span', '设置关联关系')]
                            )
                          : '',
                        auth
                          ? h(
                              'DropdownItem',
                              {
                                nativeOn: {
                                  click: () => {
                                    this.changeTime(
                                      params.row.n_deadline,
                                      params.row.n_id
                                    );
                                  },
                                },
                              },
                              [h('span', '编辑截止时间')]
                            )
                          : '',
                        auth
                          ? h(
                              'DropdownItem',
                              {
                                nativeOn: {
                                  click: () => {
                                    this.$router.push(
                                      '/platform/edit/' + params.row.n_id
                                    );
                                  },
                                },
                                props: {
                                  disabled: params.row.n_status === '0' ? 0 : 1,
                                },
                              },
                              [h('span', '编辑问卷')]
                            )
                          : '',
                        auth
                          ? h(
                              'DropdownItem',
                              {
                                nativeOn: {
                                  click: () => {
                                    this.changeStatus(
                                      params.row.n_id,
                                      params.row.n_status === '1' ? '2' : '1'
                                    );
                                  },
                                },
                              },
                              [h('span', _publishText)]
                            )
                          : '',
                      ]
                    ),
                  ]
                ),
              ]
            );
          },
        },
        {
          title: '状态',
          key: 'n_status',
          align: 'center',
          width: 160,
          render: (h, params) => {
            const deadline = params.row.n_deadline; // 获取截止时间
            const curtime = new Date().getTime(); // 获取当前时间
            const status =
              curtime > deadline
                ? '已截止'
                : params.row.n_status === '0'
                ? '未发布'
                : params.row.n_status === '1'
                ? '已发布'
                : '停止发布';
            const mycolor =
              params.row.n_status === '0' ||
              params.row.n_status === '2' ||
              curtime > deadline
                ? 'gray'
                : 'green';
            return h(
              'div',
              {
                style: {
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              },
              [
                h(
                  'Tag',
                  {
                    props: {
                      type: 'border',
                      color: mycolor,
                    },
                  },
                  status
                ),
                h(
                  'Badge',
                  {
                    attrs: {
                      count: params.row.audit_count,
                      type: 'warning',
                      overflowCount: 999,
                    },
                  },
                  [
                    h(
                      'Tag',
                      {
                        props: {
                          type: 'border',
                          color: 'orange',
                        },
                      },
                      '未审核'
                    ),
                  ]
                ),
              ]
            );
          },
        },
        {
          title: '调研名称',
          key: 'n_title',
          minWidth: 380,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'Tooltip',
              {
                attrs: {
                  content: params.row.n_title,
                  maxWidth: 300,
                  transfer: true,
                },
              },
              [h('span', params.row.n_title)]
            );
          },
        },
        {
          title: '调研类别',
          key: 'tn_title',
          minWidth: 240,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '创建单位',
          key: 'u_company',
          minWidth: 180,
          align: 'center',
          ellipsis: true,
        },
        {
          title: '调研区域',
          key: 'n_area',
          minWidth: 150,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              params.row.n_area === '' ? '全国' : params.row.n_area
            );
          },
        },
        {
          title: '调研机构类型',
          key: 'n_category',
          minWidth: 150,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h(
              'span',
              params.row.n_category === '' ? '所有类型' : params.row.n_category
            );
          },
        },
        {
          title: '创建时间',
          key: 'n_createtime',
          width: 170,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('span', formatDate(params.row.n_createtime));
          },
        },
        {
          title: '截止时间',
          key: 'n_deadline',
          width: 170,
          align: 'center',
          ellipsis: true,
          render: (h, params) => {
            return h('span', formatDate(params.row.n_deadline));
          },
        },
      ],
      naireList: [],
      qrcode: null,
    };
  },
  created() {
    this.getData(1);
  },
  methods: {
    // 删除问卷
    remove(index) {
      this.$http
        .get('/naire/del', {
          params: {
            n_id: this.naireList[index].n_id,
          },
        })
        .then((response) => {
          if (response.data.err === OK) {
            this.$Message.success('删除成功');
            this.naireList.splice(index, 1);
            this.getData(this.currentPage);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('删除失败');
        });
    },
    // 统计
    exportEXL(counts, currentNaireid) {
      if (counts === 0) {
        this.$Message.warning('当前问卷还没有反馈数据！');
        return;
      }
      this.loading = true;
      this.$http
        .get('/naire/exportdata', {
          params: {
            n_id: currentNaireid,
            areas: this.loginUser().u_province,
            usercode: this.loginUser().u_code,
            pbccode: this.loginUser().u_pbccode,
            admin: this.loginUser().u_admin,
          },
        })
        .then((response) => {
          const a = document.getElementById('download');
          a.href = response.data.data.file;
          a.setAttribute('download', response.data.data.name);
          a.click();
          this.loading = false;
          this.$Message.success('导出标准反馈数据成功！');
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 新建问卷
    newNaire() {
      this.$router.push('/platform/edit');
    },
    changePageSize(pagesize) {
      this.pageSize = pagesize;
      this.getData(1);
    },
    loginUser() {
      return JSON.parse(localStorage.getItem('USER'));
    },
    // 获取问卷列表数据
    getData(curPage) {
      this.loading = true;
      this.currentPage = curPage;
      this.$http
        .get('/naire', {
          params: {
            s_title: this.sTitle,
            s_start: this.sStart === '' ? '' : new Date(this.sStart).getTime(),
            s_end: this.sEnd === '' ? '' : new Date(this.sEnd).getTime(),
            page_size: this.pageSize,
            current: this.currentPage,
            userprovince: this.loginUser().u_province,
            usercompany: this.loginUser().u_company,
            pbccode: this.loginUser().u_pbccode,
            usercode: this.loginUser().u_code,
            uid: this.loginUser().u_id,
            admin: this.loginUser().u_admin,
          },
        })
        .then((response) => {
          this.naireList = response.data.data;
          this.total = response.data.total;
          this.loading = false;
          console.log(this.naireList);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 复制问卷地址
    getURL(nid) {
      // 复制地址
      this.showURL = true;
      this.url = window.location.origin + '/#/preview/' + nid;
      this.$nextTick(() => {
        if (this.qrcode === null) {
          this.qrcode = new QRCode(this.$refs.qrcode, {
            // eslint-disable-line no-new
            text: window.location.origin + '/#/preview/' + nid,
            width: 250,
            height: 250,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H,
          });
        } else {
          this.qrcode.makeCode(window.location.origin + '/#/preview/' + nid);
        }
      });
    },
    // 问卷地址快速复制
    handleCopy() {
      let clipboard = new Clipboard('.copyboard');

      clipboard.on('success', (e) => {
        this.$Message.success('复制成功！');
        e.clearSelection();
      });

      clipboard.on('error', (e) => {
        this.$Message.error('复制失败！');
      });
    },
    openURL(url) {
      window.open(url);
    },
    submitStatis(id, name) {
      // 查看统计情况
      this.currentId = id;
      this.currentNarie = name + '实施情况调研问卷回收列表';
      this.submitStatisModel = true;
    },
    // 修改问卷状态
    changeStatus(nId, status) {
      console.log(nId, status);
      this.$http
        .get('/naire/changeStatus', {
          params: {
            n_id: nId,
            n_status: status,
          },
        })
        .then((response) => {
          console.log(response.data.data);
          if (response.data.err === OK && response.data.data > 0) {
            this.$Message.success('问卷更改状态成功');
            this.getData(this.currentPage);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('更改状态失败');
        });
    },
    // 修改截止时间
    changeTime(time, id) {
      this.updateTime = true;
      this.deadline = new Date(time).getTime();
      this.updateTimeId = id;
    },
    // 提交截止时间修改
    submitChangeTime() {
      this.$http
        .post('/naire/changeTime', {
          n_id: this.updateTimeId,
          n_deadline: new Date(this.deadline).getTime(),
        })
        .then((response) => {
          if (response.data.err === OK && response.data.data > 0) {
            this.$Message.success('问卷截止时间更改成功');
            this.getData(this.currentPage);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Message.error('更改问卷截止时间失败');
        });
    },
    handleSubmit() {
      console.log(this.searchForm);
      this._fetchStatisData(1);
    },
    startTimeChange: function (e) {
      // 设置开始时间
      this.sStart = e;
      this.oEnd = {
        disabledDate: (date) => {
          let startTime = this.sStart ? new Date(this.sStart).valueOf() : '';
          return date && date.valueOf() < startTime;
        },
      };
    },
    endTimeChange: function (e) {
      // 设置结束时间
      this.sEnd = e;
      this.oStart = {
        disabledDate: (date) => {
          let endTime = this.sEnd
            ? new Date(this.sEnd).valueOf() - 1 * 24 * 60 * 60 * 1000
            : '';
          return date && date.valueOf() > endTime;
        },
      };
    },
  },
  components: {
    feedbackList,
    associationList,
  },
};
</script>

<style scoped>
.naire-list {
  min-height: 672px;
  min-width: 1366px;
}
.qrcode-wrapper {
  padding: 20px;
  background-color: #fff;
}
#qrcode {
  margin: 0 auto;
  width: 250px;
  height: 250px;
}
.ivu-table-cell-status {
  overflow: inherit;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
