<template>
  <div style="position: relative">
    <Spin fix v-if="spinShow"></Spin>
    <Row>
      <Col span="14">
        <Card :bordered="false">
          <div slot="title" class="flex-center" style="padding-right: 64px">
            <Avatar
              icon="ios-navigate"
              style="color: #1890ff; background-color: #e6efff; flex: none"
              size="small"
            />
            <Dropdown placement="bottom-start" transfer>
              <Button
                type="text"
                style="
                  margin: 0 4px;
                  padding: 0 4px;
                  font-weight: 500;
                  background-color: #e6efff;
                  color: #1890ff;
                  border-radius: 4px;
                "
              >
                {{ year }}年
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="item in years"
                  :key="item.year"
                  @click.native="changeYear(item.year)"
                  >{{ item.year }}年</DropdownItem
                >
              </DropdownMenu>
            </Dropdown>
            <Dropdown placement="bottom-start" transfer>
              <span style="font-weight: 500; cursor: pointer">
                {{ naire }}实施情况概览
                <Icon
                  type="ios-arrow-down"
                  color="rgb(45, 140, 240)"
                  style="font-weight: 900"
                ></Icon>
              </span>
              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="item in naireList"
                  :key="item.n_id"
                  @click.native="changeStandard(item.n_title, item.n_id)"
                  >{{ item.n_title }}</DropdownItem
                >
              </DropdownMenu>
            </Dropdown>
          </div>
          <div slot="extra">
            <div style="display: flex">
              <Dropdown placement="bottom-end" transfer>
                <a href="javascript:void(0)">
                  <Icon type="ios-more" size="24"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem @click.native="exportEXL(currentNaireid)"
                    >导出标准实施数据</DropdownItem
                  >
                  <DropdownItem @click.native="exportREPORT(currentNaireid)"
                    >生成标准实施报告</DropdownItem
                  >
                  <DropdownItem divided disabled style="color: #515a6e"
                    ><span>地图特效开关</span>
                    <i-switch
                      size="small"
                      v-model="effection"
                      @on-change="changeEffect"
                    ></i-switch>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div style="display: flex; align-items: center">
            <div id="mapChart" class="mapbig"></div>
            <div style="width: 20%">
              <div id="mapLevel1" class="mapsmall"></div>
              <div id="mapLevel2" class="mapsmall"></div>
            </div>
          </div>
        </Card>
      </Col>
      <Col span="10">
        <Row>
          <Col span="6">
            <Row style="margin-left: 16px">
              <Card :bordered="false" :padding="8">
                <div slot="title" class="flex-center">
                  <Avatar
                    icon="md-checkmark-circle"
                    style="
                      color: #ff9e00;
                      background-color: #feedd4;
                      flex: none;
                    "
                    size="small"
                  />
                  <span style="margin-left: 4px; font-weight: 500"
                    >平均达标率</span
                  >
                </div>
                <Row type="flex" justify="center" align="middle" class="number">
                  <Col>
                    <span class="dynamic-num">
                      <countTo
                        :startVal="0"
                        :endVal="rate"
                        :duration="3000"
                      ></countTo>
                    </span>
                    <span style="font-size: 16px; font-weight: 300">%</span>
                  </Col>
                </Row>
              </Card>
            </Row>
          </Col>
          <Col span="6">
            <Row style="margin-left: 16px">
              <Card :bordered="false" :padding="8">
                <div slot="title" class="flex-center">
                  <Avatar
                    icon="md-construct"
                    style="
                      color: #1890ff;
                      background-color: #e6efff;
                      flex: none;
                    "
                    size="small"
                  />
                  <span style="margin-left: 4px; font-weight: 500"
                    >标准适用率</span
                  >
                </div>
                <Row type="flex" justify="center" align="middle" class="number">
                  <Col>
                    <span class="dynamic-num">
                      <countTo
                        :startVal="0"
                        :endVal="statics.shiyongnum"
                        :duration="3000"
                      ></countTo>
                    </span>
                    <span style="font-size: 16px; font-weight: 300">%</span>
                  </Col>
                </Row>
              </Card>
            </Row>
          </Col>
          <Col span="6">
            <Row style="margin-left: 16px">
              <Card :bordered="false" :padding="8">
                <div slot="title" class="flex-center">
                  <Avatar
                    icon="md-git-compare"
                    style="
                      color: #ff9e00;
                      background-color: #feedd4;
                      flex: none;
                    "
                    size="small"
                  />
                  <span style="margin-left: 4px; font-weight: 500"
                    >标准对标率</span
                  >
                </div>
                <Row type="flex" justify="center" align="middle" class="number">
                  <Col>
                    <span class="dynamic-num">
                      <countTo
                        :startVal="0"
                        :endVal="statics.duibiaonum"
                        :duration="3000"
                      ></countTo>
                    </span>
                    <span style="font-size: 16px; font-weight: 300">%</span>
                  </Col>
                </Row>
              </Card>
            </Row>
          </Col>
          <Col span="6">
            <Row style="margin-left: 16px">
              <Card :bordered="false" :padding="8">
                <div slot="title" class="flex-center">
                  <Avatar
                    icon="md-home"
                    style="
                      color: #1890ff;
                      background-color: #e6efff;
                      flex: none;
                    "
                    size="small"
                  />
                  <span style="margin-left: 4px; font-weight: 500"
                    >已反馈机构</span
                  >
                </div>
                <Row type="flex" justify="center" align="middle" class="number">
                  <Col>
                    <span class="dynamic-num">
                      <countTo
                        :startVal="0"
                        :endVal="statics.feedbacknum"
                        :duration="3000"
                      ></countTo>
                    </span>
                    <span style="font-size: 16px; font-weight: 300">家</span>
                  </Col>
                </Row>
              </Card>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Row style="margin: 16px 0 0 16px">
              <Card :bordered="false" :padding="8" style="position: relative">
                <div slot="title" class="flex-center">
                  <Avatar
                    icon="ios-chatboxes"
                    style="
                      color: #1890ff;
                      background-color: #e6efff;
                      flex: none;
                    "
                    size="small"
                  />
                  <span style="margin-left: 4px; font-weight: 500"
                    >近一月反馈</span
                  >
                </div>
                <div id="lineChartOne" class="line"></div>
              </Card>
            </Row>
          </Col>
          <Col span="12">
            <Row style="margin: 16px 0 0 16px">
              <Card :bordered="false" :padding="8">
                <div slot="title" class="flex-center">
                  <Avatar
                    icon="ios-eye"
                    style="
                      color: #ff9e00;
                      background-color: #feedd4;
                      flex: none;
                    "
                    size="small"
                  />
                  <span style="margin-left: 4px; font-weight: 500"
                    >近一月访问</span
                  >
                </div>
                <div id="lineChartTwo" class="line"></div>
              </Card>
            </Row>
          </Col>
        </Row>
        <Row style="margin: 16px 0 0 16px">
          <Card :bordered="false">
            <div slot="title" class="flex-center">
              <Avatar
                icon="ios-leaf"
                style="color: #ff9e00; background-color: #feedd4; flex: none"
                size="small"
              />
              <Dropdown placement="bottom-start" transfer>
                <span style="font-weight: 500; cursor: pointer">
                  {{ text }}
                  <Icon
                    type="ios-arrow-down"
                    color="rgb(45, 140, 240)"
                    style="font-weight: 900"
                  ></Icon>
                </span>
                <DropdownMenu slot="list">
                  <DropdownItem
                    v-for="item in textList"
                    :key="item.id"
                    @click.native="changeText(item.name, item.id)"
                    >{{ item.name }}</DropdownItem
                  >
                </DropdownMenu>
              </Dropdown>
            </div>
            <div id="myCloudTag" style="position: relative">
              <canvas id="myTag" class="text"></canvas>
              <Spin fix v-if="loading">
                <Icon
                  type="ios-loading"
                  size="18"
                  class="spin-icon-load"
                  color="#ff9e00"
                ></Icon>
                <span>正在获取数据</span>
              </Spin>
            </div>
            <div id="tags">
              <ul v-show="false">
                <li v-for="content in textData[currentTextid]">
                  <a
                    :href="'#/view/' + content.n_id + '/' + content.u_id + ''"
                    target="_blank"
                    >{{ content.o_addtion }}</a
                  >
                </li>
              </ul>
            </div>
          </Card>
        </Row>
      </Col>
    </Row>
    <Row style="margin-top: 16px">
      <Col span="18">
        <Row>
          <Card :bordered="false">
            <div slot="title" class="flex-center">
              <Avatar
                icon="ios-stats"
                style="
                  color: #1890ff;
                  background-color: #e6f7ff;
                  margin-right: 4px;
                  flex: none;
                "
                size="small"
              />
              <Dropdown placement="bottom-start" transfer>
                <span style="font-weight: 500; cursor: pointer">
                  {{ question }}统计
                  <Icon
                    type="ios-arrow-down"
                    color="rgb(45, 140, 240)"
                    style="font-weight: 900"
                  ></Icon>
                </span>
                <DropdownMenu slot="list">
                  <DropdownItem
                    v-for="item in questionList"
                    :key="item.id"
                    @click.native="changeQuestion(item.name, item.id)"
                    >{{ item.name }}</DropdownItem
                  >
                </DropdownMenu>
              </Dropdown>
            </div>
            <div>
              <Row>
                <Col span="6">
                  <Row>
                    <div id="pieChart" class="bar"></div>
                  </Row>
                </Col>
                <Col span="18">
                  <Row style="margin-left: 16px">
                    <div id="barChart" class="bar"></div>
                  </Row>
                </Col>
              </Row>
            </div>
          </Card>
        </Row>
      </Col>
      <Col span="6">
        <Row style="margin-left: 16px">
          <Card :bordered="false">
            <div slot="title" class="flex-center">
              <Avatar
                icon="ios-medal"
                style="
                  color: #ff9e00;
                  background-color: #feedd4;
                  margin-right: 4px;
                  flex: none;
                "
                size="small"
              />
              <Dropdown placement="bottom-start" transfer>
                <span style="font-weight: 500; cursor: pointer">
                  {{ currentrank }}
                  <Icon
                    type="ios-arrow-down"
                    color="rgb(45, 140, 240)"
                    style="font-weight: 900"
                  ></Icon>
                </span>
                <DropdownMenu slot="list">
                  <DropdownItem
                    v-for="item in rankset"
                    :key="item.index"
                    @click.native="changeRank(item.value, item.index)"
                    >{{ item.value }}</DropdownItem
                  >
                </DropdownMenu>
              </Dropdown>
            </div>
            <div class="bar" style="overflow: scroll">
              <rankList
                :size="20"
                :ranktype="currentranktype"
                :naireid="currentNaireid"
                :year="year"
              ></rankList>
            </div>
          </Card>
        </Row>
      </Col>
    </Row>
    <Modal
      v-model="mapModel"
      :title="currentArea1 + '金融机构标准实施达标率'"
      class-name="vertical-center-modal"
      width="450px"
    >
      <rankList
        v-if="mapModel"
        :province="currentArea1"
        :ranktype="1"
        :naireid="currentNaireid"
        :year="year"
      ></rankList>
    </Modal>
    <Modal
      v-model="legallevelMapModel"
      :title="currentArea2 + '法人金融机构标准化工作水平自评分'"
      class-name="vertical-center-modal"
      width="450px"
    >
      <rankList
        v-if="legallevelMapModel"
        :province="currentArea2"
        :ranktype="2"
        :naireid="currentNaireid"
        :year="year"
      ></rankList>
    </Modal>
    <Modal
      v-model="nonlegallevelMapModel"
      :title="currentArea3 + '非法人金融机构标准化工作水平自评分'"
      class-name="vertical-center-modal"
      width="450px"
    >
      <rankList
        v-if="nonlegallevelMapModel"
        :province="currentArea3"
        :ranktype="3"
        :naireid="currentNaireid"
        :year="year"
      ></rankList>
    </Modal>
    <a id="download"></a>
  </div>
</template>

<script>
import rankList from '@/components/rankList';
import 'echarts/map/js/china.js';
import echarts from 'echarts';
import countTo from 'vue-count-to';
import { TagCanvas } from '../../../static/js/tagcanvas.min.js';
import { geoCoordMap } from '../../../static/js/geocoord.js';
export default {
  components: { countTo, rankList },
  data() {
    return {
      naireList: [],
      questionList: [],
      provinceList: [],
      provinceFN: {},
      textList: [],
      textData: [],
      mapChart: {},
      mapLevel: {},
      mapdata: [],
      legalleveldata: [],
      nonlegalleveldata: [],
      linedata: [],
      linechartdata: [],
      linesdata: {},
      bardata: {},
      reportdata: {},
      barChart: {},
      pieChart: {},
      lineChartOne: {},
      lineChartTwo: {},
      mapOption: [],
      pieOption: [],
      barOption: [],
      naire: '',
      currentArea1: '',
      currentArea2: '',
      currentArea3: '',
      mapModel: false,
      legallevelMapModel: false,
      nonlegallevelMapModel: false,
      question: '',
      effection: true,
      spinShow: false,
      loading: false,
      text: '意见及建议摘要',
      currentNaireid: '',
      currentQuestionid: 0,
      currentTextid: 0,
      fontsize: 10,
      year: '',
      years: [],
      rates: [],
      rate: 0,
      statics: {
        shiyongnum: 0,
        feedbacknum: 0,
        suggestionnum: 0,
        duibiaonum: 0,
      },
      rankset: [
        { index: 1, value: '标准实施达标率排行榜' },
        { index: 2, value: '法人金融机构标准化水平排行榜' },
        { index: 3, value: '非法人金融机构标准化水平排行榜' },
      ],
      currentrank: '标准实施达标率排行榜',
      currentranktype: 1,
    };
  },
  created() {
    if (JSON.parse(localStorage.getItem('USER')).u_admin === '0') {
      this.$router.push('/platform/list');
    }
  },
  watch: {
    year: function () {
      this.getNaireList();
      this.getLegalLevelData();
      this.getNonLegalLevelData();
    },
  },
  mounted() {
    const _this = this;
    window.onresize = function tmp() {
      // 定义窗口大小变更通知事件
      _this.changheFontSize();
      _this.getTagCloud();
      _this.barChart.resize();
      _this.pieChart.resize();
      _this.getMap();
      _this.getLegalLevel();
      _this.getNonLegalLevel();
      _this.mapChart.resize();
      _this.mapLevel1.resize();
      _this.mapLevel2.resize();
      _this.lineChartOne.resize();
      _this.lineChartTwo.resize();
    };
    this.$nextTick(() => {
      this.mapChart = echarts.init(document.getElementById('mapChart'));
      this.mapLevel1 = echarts.init(document.getElementById('mapLevel1'));
      this.mapLevel2 = echarts.init(document.getElementById('mapLevel2'));
      this.pieChart = echarts.init(document.getElementById('pieChart'));
      this.lineChartOne = echarts.init(document.getElementById('lineChartOne'));
      this.lineChartTwo = echarts.init(document.getElementById('lineChartTwo'));
      this.barChart = echarts.init(document.getElementById('barChart'));
      this.getLineChart();
      this.changheFontSize();
      this.getYears();
    });
  },
  // 注销window.onresize事件
  destroyed() {
    window.onresize = null;
  },
  methods: {
    getYears() {
      // let _this = this
      this.$http
        .get('/naire/years', {
          params: {
            u_company: this.loginUser().u_company,
          },
        })
        .then((response) => {
          this.years = response.data.data;
          this.$nextTick(function () {
            this.year = this.years[0].year;
            this.getNaireList();
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeYear(y) {
      this.year = y;
    },
    getLegalLevelData() {
      this.mapLevel1.showLoading('default', {
        text: '正在获取数据',
        color: '#ff9e00',
        textColor: '#428cec',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0,
      });
      this.$http
        .get('/naire/leveldata', {
          params: {
            year: this.year,
            type: 2,
          },
        })
        .then((response) => {
          this.legalleveldata = response.data.leveldata;
          this.$nextTick(() => {
            this.getLegalLevel();
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getNonLegalLevelData() {
      this.mapLevel2.showLoading('default', {
        text: '正在获取数据',
        color: '#ff9e00',
        textColor: '#428cec',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0,
      });
      this.$http
        .get('/naire/leveldata', {
          params: {
            year: this.year,
            type: 3,
          },
        })
        .then((response) => {
          this.nonlegalleveldata = response.data.leveldata;
          this.$nextTick(() => {
            this.getNonLegalLevel();
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeRank(value, index) {
      this.currentrank = value;
      this.currentranktype = index;
    },
    changeEffect(val) {
      this.effection = val;
      this.mapChart.dispose();
      this.mapChart = echarts.init(document.getElementById('mapChart'));
      this.getMap();
    },
    changeStandard(title, id) {
      this.rates = [];
      this.naire = title;
      this.currentNaireid = id;
      this.showLoading();
      this.getChartdata();
    },
    changeQuestion(title, id) {
      this.question = title;
      this.currentQuestionid = id;
      this.getBar();
      this.getPie();
    },
    changeText(title, id) {
      this.text = title;
      this.currentTextid = id;
      if (this.textData[id].length === 0) {
        this.textData[id] = [
          {
            n_id: '#',
            u_id: '#',
            o_addtion: '暂无数据',
          },
        ];
      }
      this.$nextTick(function () {
        this.getTagCloud();
      });
    },
    changheFontSize() {
      if (document.body.clientWidth <= 1440) {
        this.fontsize = 10;
      }
      if (document.body.clientWidth > 1440) {
        this.fontsize = 15;
      }
      if (document.body.clientWidth > 1920) {
        this.fontsize = 20;
      }
    },
    exportEXL(currentNaireid) {
      if (this.statics.feedbacknum === 0) {
        this.$Message.warning('当前问卷还没有反馈数据！');
        return;
      }
      this.spinShow = true;
      this.$http
        .get('/naire/exportdata', {
          params: {
            n_id: this.currentNaireid,
          },
        })
        .then((response) => {
          const a = document.getElementById('download');
          a.href = response.data.data.file;
          a.setAttribute('download', response.data.data.name);
          a.click();
          this.spinShow = false;
          this.$Message.success('导出标准反馈数据成功！');
        })
        .catch((error) => {
          console.log(error);
        });
    },
    exportREPORT(currentNaireid) {
      if (this.statics.feedbacknum === 0) {
        this.$Message.warning('当前问卷还没有反馈数据！');
        return;
      }
      this.spinShow = true;
      const img = this.mapChart.getDataURL({
        pixelRatio: 2, // double pixel
        backgroundColor: '#fff',
      });
      this.reportdata.naire = this.naire;
      this.reportdata.rate = this.rate;
      this.$http
        .post('/naire/exportreport', {
          n_id: this.currentNaireid,
          img: img,
          reportdata: this.reportdata,
        })
        .then((response) => {
          const a = document.getElementById('download');
          a.href = response.data.data.file;
          a.setAttribute('download', response.data.data.name);
          a.click();
          this.spinShow = false;
          this.$Message.success('生成标准实施报告成功！');
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getNaireList() {
      this.$http
        .get('/naire', {
          params: {
            type: 1,
            usercompany: this.loginUser().u_company,
            s_start: new Date(this.year + '-01-01').getTime(),
            s_end: new Date(this.year + '-12-31').getTime(),
          },
        })
        .then((response) => {
          this.naireList = response.data.data;
          this.$nextTick(function () {
            this.changeStandard(
              this.naireList[0].n_title,
              this.naireList[0].n_id
            );
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTagCloud() {
      document.getElementById('myTag').width =
        document.getElementById('myCloudTag').offsetWidth;
      document.getElementById('myTag').height =
        document.getElementById('myCloudTag').offsetHeight;

      TagCanvas.Start('myTag', 'tags', {
        textColour: '#428cec',
        outlineColour: '#ff9e00',
        reverse: true,
        textHeight: this.fontsize,
        outlineThickness: 1,
        outlineMethod: 'colour',
        maxSpeed: 0.01,
        minSpeed: 0.01,
        fadeIn: 800,
        depth: 1,
        initial: [0.1, 0],
        freezeActive: true,
        wheelZoom: false,
        noTagsMessage: false,
      });
      this.loading = false;
    },
    sumArray(arr) {
      let s = 0;
      arr.forEach(function (val, idx, arr) {
        s += Math.abs(val);
      }, 0);
      return s;
    },
    getLineChart() {
      const lineOneOption = {
        color: ['#428cec'],
        grid: {
          bottom: '-12',
          right: '-10',
          left: '10',
          top: '8',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 1,
              type: 'dashed',
              color: '#ff9e00',
            },
            label: {
              show: true,
              fontWeight: '600',
              backgroundColor: '#ff9e00',
              shadowBlur: 0,
              borderRadius: 4,
            },
          },
          position: function (pt) {
            return [pt[0] - 100, '10%'];
          },
        },
        xAxis: [
          {
            type: 'category',
            show: false,
            boundaryGap: false,
            data: this.linesdata.days,
          },
        ],
        yAxis: [
          {
            show: false,
            position: 'right',
            type: 'value',
          },
        ],
        series: [
          {
            name: '反馈数量',
            type: 'line',
            stack: '总量',
            smooth: 0.5,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#428cec',
                  },
                  {
                    offset: 1,
                    color: '#e2edfc',
                  },
                ]),
              },
            },
            data: this.linesdata.lineone,
          },
        ],
      };
      const lineTwoOption = {
        color: ['#428cec', '#19be6b'],
        grid: {
          bottom: '-12',
          right: '-10',
          left: '8',
          top: '8',
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 1,
              type: 'dashed',
              color: '#ff9e00',
            },
            label: {
              show: true,
              fontWeight: '600',
              backgroundColor: '#ff9e00',
              shadowBlur: 0,
              borderRadius: 4,
            },
          },
          position: function (pt) {
            return [pt[0] - 100, '10%'];
          },
        },
        xAxis: [
          {
            type: 'category',
            show: false,
            boundaryGap: false,
            data: this.linesdata.days,
          },
        ],
        yAxis: [
          {
            show: false,
            position: 'right',
            type: 'value',
          },
        ],
        series: [
          {
            name: '访问数量',
            type: 'line',
            stack: '总量',
            smooth: 0.5,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#428cec',
                  },
                  {
                    offset: 1,
                    color: '#e2edfc',
                  },
                ]),
              },
            },
            data: this.linesdata.linetwo,
          },
        ],
      };
      this.lineChartOne.setOption(lineOneOption, true);
      this.lineChartTwo.setOption(lineTwoOption, true);
      this.lineChartOne.hideLoading();
      this.lineChartTwo.hideLoading();
    },
    getPie() {
      // 初始化echarts实例
      const piedata = [];
      const _this = this;
      if (this.bardata[this.currentQuestionid] !== undefined) {
        this.bardata[this.currentQuestionid].forEach(function (item, i) {
          piedata.push({
            value: _this.sumArray(item.datanum),
            name: item.name,
          });
        });
      }
      // 进行相关配置
      const pieOption = {
        backgroundColor: '#fff',
        title: {
          text: '全国',
          left: 'center',
          top: 'center',
          textStyle: {
            fontSize: 12,
            fontWeight: 500,
            align: 'center',
            color: '#515a6e',
          },
        },
        color: this.getColors(piedata.length),
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          position: function (pt) {
            return [pt[0], '10%'];
          },
        },
        series: [
          {
            name: this.question,
            type: 'pie',
            radius: ['40%', '80%'],
            center: ['50%', '50%'],
            data: piedata,
            roseType: 'radius',
            label: {
              normal: {
                textStyle: {
                  color: '#515a6e',
                },
                position: 'outside',
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: '#ff9e00',
                },
                length: 4,
                length2: 16,
              },
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      };
      this.pieChart.setOption(pieOption, true);
      this.pieChart.hideLoading();
    },
    getMap() {
      // 初始化echarts实例
      const lineDataArr = this.linedata;
      // 处理线路所需要的数据格式data
      const convertData = function (data) {
        const res = [];
        for (let i = 0; i < data.length; i++) {
          const dataItem = data[i];
          const fromCoord = geoCoordMap[dataItem[0].name];
          const toCoord = geoCoordMap[dataItem[1].name];
          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [fromCoord, toCoord],
            });
          }
        }
        return res;
      };

      // 发射点和线路颜色
      const color = ['#ff9e00', '#a6c84c', '#46bee9']; // 橙 墨绿 蓝
      let seriesData = [];
      const _this = this;
      lineDataArr.forEach(function (item, i) {
        seriesData.push(
          {
            // 亮光发射效果
            // name: item[0] + ' Top10',
            name: 'line1',
            type: 'lines',
            zlevel: 1,
            effect: {
              show: _this.effection,
              period: 6, // 特效动画的时间，单位为 s
              // delay: i * 5000, // 特效动画的延时，支持设置成数字或者回调。单位ms
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3,
            },
            label: {
              show: true,
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 0,
                curveness: 0.2,
              },
            },
            // data: convertData(item[1])
            data: convertData(item),
          },
          {
            // 线路效果
            // name: item[0] + ' Top10',
            name: 'line2',
            type: 'lines',
            show: _this.effection,
            zlevel: 2,
            label: {
              show: true,
            },
            lineStyle: {
              normal: {
                color: color[i],
                width: 1,
                opacity: 0.4,
                curveness: 0.2,
              },
            },
            // data: convertData(item[1])
            data: convertData(item),
          },
          {
            // 文字和地点涟漪效果
            // name: item[0] + ' Top10',
            name: 'line3',
            type: 'effectScatter',
            show: _this.effection,
            coordinateSystem: 'geo',
            // geoIndex: 0,
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke',
            },
            label: {
              // 涟漪文字位置
              // normal: {
              //   show: true,
              //   position: 'right',
              //   formatter: '{b}',
              //   fontSize: 10,
              //   fontWeight: 600
              // }
              emphasis: {
                // 有这一层为鼠标移入涟漪点才显示文字，去掉这一层那么直接显示文字再地图上
                show: true,
                // position: 'top',
                formatter: '{b}',
                // offset: [10, -4]
              },
            },
            symbolSize: 6,
            // symbolOffset:[4, 4], // 标记相对于原本位置的偏移
            itemStyle: {
              // 涟漪相关颜色
              normal: {
                color: color[i],
              },
              // color: color[i]
            },
            data: item.map(function (dataItem) {
              return {
                name: dataItem[0].name,
                value: geoCoordMap[dataItem[0].name].concat([
                  dataItem[0].value,
                ]),
              };
            }),
          }
        );
      });
      seriesData = this.effection ? seriesData : [];
      // 中国地图线路特效配置 end
      // 进行相关配置
      const mapOption = {
        title: {
          text: '金融机构标准实施达标率',
          left: 'center',
          top: document.body.clientHeight <= 1024 ? 16 : 48,
          textStyle: {
            fontSize: document.body.clientWidth <= 1920 ? 14 : 16,
            color: '#515a6e',
          },
        },
        tooltip: {
          // 鼠标移到图里面的浮动提示框
          // formatter详细配置： https://echarts.baidu.com/option.html#tooltip.formatter
          formatter(params, ticket, callback) {
            // params.data 就是series配置项中的data数据遍历

            let value = params.value;
            if (Array.isArray(value)) {
              // 鼠标移到涟漪点上不显示浮层
              return '';
            }
            if (value === undefined) {
              // 鼠标移到路线上不显示浮层
              return '';
            }
            if (isNaN(value)) {
              value = 0;
            }

            let localValue;
            if (params.data) {
              localValue = params.data.value;
            } else {
              // 为了防止没有定义数据的时候报错写的
              localValue = 0;
            }
            if (localValue === 0) {
              return `暂无数据`;
            }
            let newLocal = localValue * 100;
            newLocal = newLocal.toFixed(1);
            const htmlStr = `
                <div style='font-size:16px;'> ${params.name}</div>
                <div style='text-align:left;margin-top:10px;'>
                  辖内机构达标率均值：${newLocal}%<br/>
                  点击查看详细情况
                </div>
              `;
            return htmlStr;
          },
          // backgroundColor:"#ff7f50",//提示标签背景颜色
          // textStyle:{color:"#fff"} //提示标签字体颜色
        },
        // visualMap的详细配置解析：https://echarts.baidu.com/option.html#visualMap
        visualMap: {
          // 左下角的颜色区域
          type: 'piecewise', // 定义为分段型 visualMap
          min: 0,
          max: 1,
          size: 2,
          show: true,
          itemGap: document.body.clientWidth <= 1720 ? 6 : 8,
          itemWidth: document.body.clientWidth <= 1720 ? 6 : 8,
          itemHeight: document.body.clientWidth <= 1720 ? 6 : 8,
          textStyle: {
            fontSize: document.body.clientWidth <= 1720 ? 9 : 11,
            color: '#515a6e',
          },
          // show: false,
          bottom: 0,
          left: 16,
          pieces: [
            // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式'#6fa6ec', '#428cec', '#0965d8', '#ffc973', '#ffb640', '#ff9e00'
            { gt: 0.95, lte: 1, label: '95%-100%', color: '#0156c1' }, // (0.95, 1]
            { gt: 0.9, lte: 0.95, label: '90%-95%', color: '#206ed6' },
            { gt: 0.85, lte: 0.9, label: '85%-90%', color: '#2982de' },
            { gt: 0.8, lte: 0.85, label: '80%-85%', color: '#3e90e3' },
            { gt: 0.75, lte: 0.8, label: '75%-80%', color: '#59a4ec' },
            { gt: 0.7, lte: 0.75, label: '70%-75%', color: '#6cb4f1' },
            { gt: 0.65, lte: 0.7, label: '65%-70%', color: '#85c4f1' },
            { gt: 0.6, lte: 0.65, label: '60%-65%', color: '#98d4f0' },
            { gt: 0, lte: 0.6, label: '60%以下', color: '#d7f8fd' },
            { value: 0, label: '暂无数据', color: '#fafafa' }, // [0]
          ],
        },
        // geo配置详解： https://echarts.baidu.com/option.html#geo
        geo: {
          // 地理坐标系组件用于地图的绘制
          map: 'china', // 表示中国地图
          roam: false, // 是否开启鼠标缩放和平移漫游
          zoom: 1.25, // 当前视角的缩放比例（地图的放大比例）
          label: {
            normal: {
              show: false,
              fontSize: 8,
              fontWeight: 600,
              color: '#003e8a',
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            // 地图区域的多边形 图形样式。
            borderColor: '#d7f8fd',
            emphasis: {
              // 高亮状态下的多边形和标签样式
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              color: '#ffc973',
            },
          },
        },
        series: [
          ...seriesData, // 中国地图线路特效配置
          {
            name: '', // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
            type: 'map',
            geoIndex: 0,
            label: {
              show: false,
            },
            // 这是需要配置地图上的某个地区的数据，根据后台的返回的数据进行拼接（下面是我定义的假数据）
            data: this.mapdata,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示地图数据
      this.mapChart.setOption(mapOption, true);
      this.mapChart.hideLoading();
      // 点击事件,根据点击某个省份计算出这个省份的数据
      this.mapChart.on('click', function (params) {
        if (params.name !== '' && params.value > 0) {
          _this.mapModel = true;
          _this.currentArea1 = _this.provinceFN[params.name];
        }
      });
    },
    randomData() {
      return Math.round(Math.random() * 100);
    },
    getLegalLevel() {
      // 进行相关配置
      let mydata = this.legalleveldata;
      const mapOption = {
        title: {
          text: '法人金融机构标准化水平',
          left: 'center',
          top:
            document.body.clientHeight <= 960
              ? document.body.clientHeight <= 820
                ? 0
                : '5%'
              : '10%',
          textStyle: {
            fontSize: 12,
            color: '#515a6e',
          },
        },
        tooltip: {
          // 鼠标移到图里面的浮动提示框
          // formatter详细配置： https://echarts.baidu.com/option.html#tooltip.formatter
          formatter(params, ticket, callback) {
            // params.data 就是series配置项中的data数据遍历

            let value = params.value;
            if (Array.isArray(value)) {
              // 鼠标移到涟漪点上不显示浮层
              return '';
            }
            if (value === undefined) {
              // 鼠标移到路线上不显示浮层
              return '';
            }
            if (isNaN(value)) {
              value = 0;
            }

            let localValue;
            if (params.data) {
              localValue = params.data.value;
            } else {
              // 为了防止没有定义数据的时候报错写的
              localValue = 0;
            }
            if (localValue === 0) {
              return `暂无数据`;
            }
            let newLocal = localValue;
            const htmlStr = `
                <div style='font-size:16px;'> ${params.name}</div>
                <div style='text-align:left;margin-top:10px;'>
                  法人金融机构标准化水平评价均分：${newLocal}<br/>
                </div>
              `;
            return htmlStr;
          },
          // backgroundColor:"#ff7f50",//提示标签背景颜色
          // textStyle:{color:"#fff"} //提示标签字体颜色
        },
        // visualMap的详细配置解析：https://echarts.baidu.com/option.html#visualMap
        visualMap: {
          // 左下角的颜色区域
          type: 'piecewise', // 定义为分段型 visualMap
          min: 0,
          max: 1,
          size: 2,
          show: false,
          itemGap: document.body.clientWidth <= 1720 ? 6 : 8,
          itemWidth: document.body.clientWidth <= 1720 ? 6 : 8,
          itemHeight: document.body.clientWidth <= 1720 ? 6 : 8,
          textStyle: {
            fontSize: document.body.clientWidth <= 1720 ? 9 : 11,
            color: '#515a6e',
          },
          bottom: 0,
          left: 0,
          pieces: [
            // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式'#6fa6ec', '#428cec', '#0965d8', '#ffc973', '#ffb640', '#ff9e00'
            { gt: 90, lte: 100, label: '90-100分', color: '#F57F17' },
            { gt: 80, lte: 90, label: '80-90分', color: '#F9A825' },
            { gt: 70, lte: 80, label: '70-80分', color: '#FBC02D' },
            { gt: 60, lte: 70, label: '60-70分', color: '#FDD835' },
            { gt: 50, lte: 60, label: '50-60分', color: '#FFEB3B' },
            { gt: 40, lte: 50, label: '40-50分', color: '#FFEE58' },
            { gt: 30, lte: 40, label: '30-40分', color: '#FFF176' },
            { gt: 20, lte: 30, label: '20-30分', color: '#FFF59D' },
            { gt: 10, lte: 20, label: '10-20分', color: '#FFFF8D' },
            { gt: 0, lte: 10, label: '0-10分', color: '#FFF9C4' },
            { value: 0, label: '暂无数据', color: '#fafafa' }, // [0]
          ],
        },
        // geo配置详解： https://echarts.baidu.com/option.html#geo
        geo: {
          // 地理坐标系组件用于地图的绘制
          map: 'china', // 表示中国地图
          roam: false, // 是否开启鼠标缩放和平移漫游
          zoom: 1.25, // 当前视角的缩放比例（地图的放大比例）
          label: {
            normal: {
              show: false,
              fontSize: 8,
              fontWeight: 600,
              color: '#003e8a',
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            // 地图区域的多边形 图形样式。
            borderColor: '#d7f8fd',
            emphasis: {
              // 高亮状态下的多边形和标签样式
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              color: '#ffc973',
            },
          },
        },
        series: [
          {
            name: '', // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
            type: 'map',
            geoIndex: 0,
            label: {
              show: false,
            },
            // 这是需要配置地图上的某个地区的数据，根据后台的返回的数据进行拼接（下面是我定义的假数据）
            data: mydata,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示地图数据
      this.mapLevel1.hideLoading();
      this.mapLevel1.setOption(mapOption, true);
      let _this = this;
      // 点击事件,根据点击某个省份计算出这个省份的数据
      this.mapLevel1.on('click', function (params) {
        if (params.name !== '' && params.value > 0) {
          _this.legallevelMapModel = true;
          _this.currentArea2 = _this.provinceFN[params.name];
        }
      });
    },
    getNonLegalLevel() {
      // 进行相关配置
      let mydata = this.nonlegalleveldata;
      const mapOption = {
        title: {
          text: '非法人金融机构标准化水平',
          left: 'center',
          top:
            document.body.clientHeight <= 960
              ? document.body.clientHeight <= 820
                ? 0
                : '5%'
              : '10%',
          textStyle: {
            fontSize: 12,
            color: '#515a6e',
          },
        },
        tooltip: {
          // 鼠标移到图里面的浮动提示框
          // formatter详细配置： https://echarts.baidu.com/option.html#tooltip.formatter
          formatter(params, ticket, callback) {
            // params.data 就是series配置项中的data数据遍历

            let value = params.value;
            if (Array.isArray(value)) {
              // 鼠标移到涟漪点上不显示浮层
              return '';
            }
            if (value === undefined) {
              // 鼠标移到路线上不显示浮层
              return '';
            }
            if (isNaN(value)) {
              value = 0;
            }

            let localValue;
            if (params.data) {
              localValue = params.data.value;
            } else {
              // 为了防止没有定义数据的时候报错写的
              localValue = 0;
            }
            if (localValue === 0) {
              return `暂无数据`;
            }
            let newLocal = localValue;
            const htmlStr = `
                <div style='font-size:16px;'> ${params.name}</div>
                <div style='text-align:left;margin-top:10px;'>
                  非法人金融机构标准化水平评价均分：${newLocal}<br/>
                </div>
              `;
            return htmlStr;
          },
          // backgroundColor:"#ff7f50",//提示标签背景颜色
          // textStyle:{color:"#fff"} //提示标签字体颜色
        },
        // visualMap的详细配置解析：https://echarts.baidu.com/option.html#visualMap
        visualMap: {
          // 左下角的颜色区域
          type: 'piecewise', // 定义为分段型 visualMap
          min: 0,
          max: 1,
          size: 2,
          show: false,
          itemGap: document.body.clientWidth <= 1720 ? 6 : 8,
          itemWidth: document.body.clientWidth <= 1720 ? 6 : 8,
          itemHeight: document.body.clientWidth <= 1720 ? 6 : 8,
          textStyle: {
            fontSize: document.body.clientWidth <= 1720 ? 9 : 11,
            color: '#515a6e',
          },
          bottom: 0,
          left: 0,
          pieces: [
            // 自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式'#6fa6ec', '#428cec', '#0965d8', '#ffc973', '#ffb640', '#ff9e00'
            { gt: 90, lte: 100, label: '90-100分', color: '#F57F17' },
            { gt: 80, lte: 90, label: '80-90分', color: '#F9A825' },
            { gt: 70, lte: 80, label: '70-80分', color: '#FBC02D' },
            { gt: 60, lte: 70, label: '60-70分', color: '#FDD835' },
            { gt: 50, lte: 60, label: '50-60分', color: '#FFEB3B' },
            { gt: 40, lte: 50, label: '40-50分', color: '#FFEE58' },
            { gt: 30, lte: 40, label: '30-40分', color: '#FFF176' },
            { gt: 20, lte: 30, label: '20-30分', color: '#FFF59D' },
            { gt: 10, lte: 20, label: '10-20分', color: '#FFFF8D' },
            { gt: 0, lte: 10, label: '0-10分', color: '#FFF9C4' },
            { value: 0, label: '暂无数据', color: '#fafafa' }, // [0]
          ],
        },
        // geo配置详解： https://echarts.baidu.com/option.html#geo
        geo: {
          // 地理坐标系组件用于地图的绘制
          map: 'china', // 表示中国地图
          roam: false, // 是否开启鼠标缩放和平移漫游
          zoom: 1.25, // 当前视角的缩放比例（地图的放大比例）
          label: {
            normal: {
              show: false,
              fontSize: 8,
              fontWeight: 600,
              color: '#003e8a',
            },
            emphasis: {
              show: false,
            },
          },
          itemStyle: {
            // 地图区域的多边形 图形样式。
            borderColor: '#d7f8fd',
            emphasis: {
              // 高亮状态下的多边形和标签样式
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              color: '#ffc973',
            },
          },
        },
        series: [
          {
            name: '', // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
            type: 'map',
            geoIndex: 0,
            label: {
              show: false,
            },
            // 这是需要配置地图上的某个地区的数据，根据后台的返回的数据进行拼接（下面是我定义的假数据）
            data: mydata,
          },
        ],
      };
      // 使用刚指定的配置项和数据显示地图数据
      this.mapLevel2.hideLoading();
      this.mapLevel2.setOption(mapOption, true);
      let _this = this;
      // 点击事件,根据点击某个省份计算出这个省份的数据
      this.mapLevel2.on('click', function (params) {
        if (params.name !== '' && params.value > 0) {
          _this.nonlegallevelMapModel = true;
          _this.currentArea3 = _this.provinceFN[params.name];
        }
      });
    },
    getBar() {
      const seriesData = [];
      const legenddata = [];
      if (this.bardata[this.currentQuestionid] !== undefined) {
        this.bardata[this.currentQuestionid].forEach(function (item, i) {
          seriesData.push({
            name: item.name,
            type: 'bar',
            stack: '数量',
            animationDelay: function (idx) {
              return idx * 10 + 100 * i;
            },
            data: item.data,
          });
          legenddata.push(item.name);
        });
      }

      const provinces = [];
      this.provinceList.forEach((item, i) => {
        const tmp = {
          value: item,
          textStyle: {
            fontWeight: 500,
          },
        };
        provinces.push(tmp);
      });

      // 进行相关配置
      const barOption = {
        title: {
          text: '',
          textStyle: {
            fontSize: 14,
            color: '#464c5b',
          },
        },
        color: this.getColors(legenddata.length),
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: (params) => {
            if (!params.length) return '';
            console.log(params);
            let s =
              params[0].axisValueLabel +
              ' ｜ 共' +
              (this.bardata[this.currentQuestionid][0].total[
                params[0].dataIndex
              ] === null
                ? 0
                : this.bardata[this.currentQuestionid][0].total[
                    params[0].dataIndex
                  ]) +
              '份反馈<br/>';
            for (const iterator of params) {
              // 如果是负数则反转
              const d = Math.abs(iterator.data);
              s += iterator.marker + iterator.seriesName + '：' + d + '<br/>';
            }
            return s;
          },
        },
        legend: {
          data: legenddata,
          top: '0px',
          icon: 'circle',
          itemGap: 30,
          itemWidth: 10,
        },
        grid: {
          left: '0px',
          right: '8px',
          bottom: '20px',
          top: '40px',
          containLabel: false,
        },
        xAxis: [
          {
            type: 'category',
            data: provinces,
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: (value) => {
                return Math.abs(value);
              },
            },
            show: false,
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
          return idx * 5;
        },
        series: seriesData,
      };
      // 使用刚指定的配置项和数据显示地图数据
      this.barChart.clear();
      this.barChart.setOption(barOption);
      this.barChart.hideLoading();
    },
    getColors(length) {
      switch (length) {
        case 2:
          return ['#0965d8', '#ff9e00'];
        case 3:
          return ['#0965d8', '#6fa6ec', '#ff9e00'];
        default:
          return [
            '#0156c1',
            '#206ed6',
            '#2982de',
            '#3e90e3',
            '#59a4ec',
            '#ff9e00',
          ];
      }
    },
    showLoading() {
      this.loading = true;
      this.lineChartOne.showLoading('default', {
        text: '正在获取数据',
        color: '#ff9e00',
        textColor: '#428cec',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0,
      });
      this.lineChartTwo.showLoading('default', {
        text: '正在获取数据',
        color: '#ff9e00',
        textColor: '#428cec',
        maskColor: 'rgba(255, 255, 255, 0.6)',
        zlevel: 0,
      });
      this.pieChart.showLoading('default', {
        text: '正在获取数据',
        color: '#ff9e00',
        textColor: '#428cec',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0,
      });
      this.barChart.showLoading('default', {
        text: '正在获取数据',
        color: '#ff9e00',
        textColor: '#428cec',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0,
      });
      this.mapChart.showLoading('default', {
        text: '正在获取数据',
        color: '#ff9e00',
        textColor: '#428cec',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0,
      });
    },
    loginUser() {
      return JSON.parse(localStorage.getItem('USER'));
    },
    getChartdata() {
      this.$http
        .get('/naire/chartdata', {
          params: {
            n_id: this.currentNaireid,
            province:
              this.loginUser().u_company === '中国人民银行总行' ||
              this.loginUser().u_company === '中国银行保险监督管理委员会' ||
              this.loginUser().u_company === '中国证券监督管理委员会'
                ? ''
                : this.loginUser().u_province,
          },
        })
        .then((response) => {
          this.reportdata = response.data;
          this.mapdata = response.data.map;
          this.linedata = response.data.line;
          this.questionList = response.data.questionlist;
          this.bardata = response.data.bar;
          this.provinceList = response.data.province;
          this.provinceFN = response.data.provinceFN;
          this.textList = response.data.textList;
          this.textData = response.data.textData;
          this.linesdata = response.data.lines;
          this.statics = response.data.statics;
          this.$nextTick(() => {
            this.mapdata.forEach((item, i) => {
              if (item.value > 0) {
                this.rates.push(item.value);
              }
            });
            this.rate =
              this.rates.length > 0
                ? (this.sumArray(this.rates) * 100) / this.rates.length
                : 0;
            // this.autoChangeQuestion()
            this.changeQuestion(
              this.questionList[0].name,
              this.questionList[0].id
            );
            this.changeText(this.textList[0].name, this.textList[0].id);
            this.getMap();
            this.getLineChart();
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    autoChangeQuestion() {
      let _this = this;
      this.questionList.forEach((e, index) => {
        setTimeout(function () {
          _this.changeQuestion(e.name, e.id);
        }, 2000 * index);
      });
    },
  },
};
</script>

<style>
body {
  min-width: 1366px;
  min-height: 768px;
}
.naire-btn {
  padding-bottom: 10px;
}

.dynamic-num {
  font-size: 24px;
  font-weight: 500;
  color: #0766d9;
}

.number {
  height: calc(((768px - 282px) * 0.65 - 176px) * 0.3);
}
.mapbig {
  height: calc((768px - 282px) * 0.65);
  width: 80%;
}
.mapsmall {
  height: calc((768px - 282px) * 0.325);
  width: 100%;
}

.line {
  height: calc(((768px - 282px) * 0.65 - 176px) * 0.3);
}
.text {
  height: calc(((768px - 282px) * 0.65 - 176px) * 0.4);
}
.bar {
  height: calc((768px - 282px) * 0.35);
}

@media screen and (min-height: 768px) {
  .number {
    height: calc(((100vh - 282px) * 0.65 - 176px) * 0.3);
  }
  .mapbig {
    height: calc((100vh - 282px) * 0.65);
    width: 80%;
  }
  .mapsmall {
    height: calc((100vh - 282px) * 0.325);
    width: 100%;
  }
  .line {
    height: calc(((100vh - 282px) * 0.65 - 176px) * 0.3);
  }
  .text {
    height: calc(((100vh - 282px) * 0.65 - 176px) * 0.4);
  }
  .bar {
    height: calc((100vh - 282px) * 0.35);
  }
}

@media screen and (min-width: 1366px) {
  .dynamic-num {
    font-size: 32px;
    font-weight: 500;
    color: #0766d9;
  }
}

@media screen and (min-width: 1920px) {
  .dynamic-num {
    font-size: 44px;
    font-weight: 500;
    color: #0766d9;
  }
}

.ivu-card-head {
  padding: 14px 8px;
}
.ivu-layout-sider-trigger {
  position: absolute;
}

.flex-center {
  display: flex;
  align-items: center;
  line-height: 16px;
  height: 24px;
}

.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vertical-center-modal .ivu-modal {
  top: 0;
}
.spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
