<template>
  <div class="dashboard-container">
    <component :is="currentRole" v-if="showAnimation" />
    <div v-if="!showAnimation" style="margin-top: 20px">
      <el-button type="primary" style="margin-left: 85%"><a href="https://v-charts.js.org/#/" target="_blank">更多</a></el-button>
      <div class="flex">
        <div style="margin: 0 3%;width: 50%">
          <ve-histogram :colors="color" :data="chartData"></ve-histogram>
        </div>
        <div style="margin: 0 3%;width: 50%">
          <ve-line :data="chartData" :settings="chartSettingsLine"></ve-line>
        </div>
      </div>

      <div class="flex">
        <div style="margin: 0 3%;width: 50%">
          <ve-bar :data="chartData"></ve-bar>
        </div>
        <div style="margin: 0 3%;width: 50%">
          <ve-pie :data="chartDataPie"></ve-pie>
        </div>
      </div>

      <div class="flex">
        <div style="margin: 0 3%;width: 50%">
          <ve-funnel :data="chartDataFunnel"></ve-funnel>
        </div>
        <div style="margin: 0 3%;width: 50%">
          <ve-radar :data="chartDataRadar"></ve-radar>
        </div>
      </div>

      <div class="flex">
        <div style="margin: 0 3%;width: 50%">
          <ve-scatter :data="chartDataScatter"></ve-scatter>
        </div>
        <div style="margin: 0 3%;width: 50%">
          <ve-heatmap :data="chartDataHeatmap"></ve-heatmap>
        </div>
      </div>

      <div class="flex">
        <div style="margin: 0 3%;width: 50%">
          <ve-sankey :data="chartDataSankey" :settings="chartSettingsSankey"></ve-sankey>
        </div>
        <div style="margin: 0 3%;width: 50%">
          <ve-liquidfill :data="chartDataLiquidfill"></ve-liquidfill>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard',
      showAnimation: true,
      color:["#F48B5E","#F8C264","#F7749E"],
      dataZoom:	 [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          left: '1%',
          right:"1%",
          start: 0, //数据窗口范围的起始百分比
          end: 100
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 36
        }
      ],
      chartData: {
        columns: ['日期', 'Vue', 'React', 'Angular'],
        rows: [
          { '日期': '2013', 'Vue': 1393, 'React': 1093, 'Angular': 323 },
          { '日期': '2014', 'Vue': 3530, 'React': 3230, 'Angular': 267 },
          { '日期': '2015', 'Vue': 2923, 'React': 2623, 'Angular': 765 },
          { '日期': '2016', 'Vue': 1723, 'React': 1423, 'Angular': 493 },
          { '日期': '2017', 'Vue': 3792, 'React': 3492, 'Angular': 326 },
          { '日期': '2018', 'Vue': 4593, 'React': 4293, 'Angular': 783 }
        ]
      },
      chartDataPie:{
        columns: ['日期', '访问用户'],
        rows: [
          { '日期': '1/1', '访问用户': 1393 },
          { '日期': '1/2', '访问用户': 3530 },
          { '日期': '1/3', '访问用户': 2923 },
          { '日期': '1/4', '访问用户': 1723 },
          { '日期': '1/5', '访问用户': 3792 },
          { '日期': '1/6', '访问用户': 4593 }
        ]
      },
      chartDataRadar:{
        columns: ['日期', '访问用户', '下单用户', '下单率'],
        rows: [
          { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
          { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
          { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
          { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
          { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
          { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
        ]
      },
      chartDataFunnel: {
        columns: ['状态', '数值'],
        rows: [
          { '状态': '展示', '数值': 900 },
          { '状态': '访问', '数值': 600 },
          { '状态': '点击', '数值': 300 },
          { '状态': '订单', '数值': 100 }
        ]
      },
      chartDataScatter: {
        columns: ['日期', '访问用户', '下单用户', '年龄'],
        rows: {
          '上海': [
            {'日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244},
            {'日期': '1/2', '访问用户': 1223, '年龄': 6, '下单用户': 2344},
            {'日期': '1/3', '访问用户': 7123, '年龄': 9, '下单用户': 3245},
            {'日期': '1/4', '访问用户': 4123, '年龄': 12, '下单用户': 4355},
            {'日期': '1/5', '访问用户': 3123, '年龄': 15, '下单用户': 4564},
            {'日期': '1/6', '访问用户': 2323, '年龄': 20, '下单用户': 6537}
          ],
          '北京': [
            {'日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244},
            {'日期': '1/2', '访问用户': 1273, '年龄': 6, '下单用户': 2344},
            {'日期': '1/3', '访问用户': 3123, '年龄': 15, '下单用户': 4564},
            {'日期': '1/4', '访问用户': 2123, '年龄': 9, '下单用户': 3245},
            {'日期': '1/5', '访问用户': 4103, '年龄': 12, '下单用户': 4355},
            {'日期': '1/6', '访问用户': 7123, '年龄': 10, '下单用户': 3567}
          ],
          '广州': [
            {'日期': '1/1', '访问用户': 123, '年龄': 3, '下单用户': 1244},
            {'日期': '1/2', '访问用户': 1223, '年龄': 6, '下单用户': 2344},
            {'日期': '1/3', '访问用户': 2123, '年龄': 30, '下单用户': 3245},
            {'日期': '1/5', '访问用户': 4123, '年龄': 12, '下单用户': 4355},
            {'日期': '1/4', '访问用户': 5123, '年龄': 18, '下单用户': 4564},
            {'日期': '1/6', '访问用户': 3843, '年龄': 30, '下单用户': 4850}
          ]
        }
      },
      chartDataHeatmap:{
        columns: ['时间', '地点', '人数'],
        rows: [
          { '时间': '星期一', '地点': '北京', '人数': 1000 },
          { '时间': '星期二', '地点': '上海', '人数': 400 },
          { '时间': '星期三', '地点': '杭州', '人数': 800 },
          { '时间': '星期二', '地点': '深圳', '人数': 200 },
          { '时间': '星期三', '地点': '长春', '人数': 100 },
          { '时间': '星期五', '地点': '南京', '人数': 300 },
          { '时间': '星期四', '地点': '江苏', '人数': 800 },
          { '时间': '星期一', '地点': '北京', '人数': 700 },
          { '时间': '星期三', '地点': '上海', '人数': 300 },
          { '时间': '星期二', '地点': '杭州', '人数': 500 }
        ]
      },
      chartDataSankey:{
        columns: ['页面', '访问量'],
        rows: [
          { '页面': '首页', '访问量': 100000 },
          { '页面': '列表页a', '访问量': 20000 },
          { '页面': '列表页b', '访问量': 80000 },
          { '页面': '内容页a-1', '访问量': 10000 },
          { '页面': '内容页a-2', '访问量': 10000 },
          { '页面': '内容页b-1', '访问量': 60000 },
          { '页面': '内容页b-2', '访问量': 20000 }
        ]
      },
      chartDataLiquidfill:{
        columns: ['city', 'percent'],
          rows: [{
          city: '上海',
          percent: 0.6
        }]
      },
      chartSettingsSankey:{
        links: [
          { source: '首页', target: '列表页a', value: 0.5 },
          { source: '首页', target: '列表页b', value: 0.5 },
          { source: '列表页a', target: '内容页a-1', value: 0.1 },
          { source: '列表页a', target: '内容页a-2', value: 0.4 },
          { source: '列表页b', target: '内容页b-1', value: 0.2 },
          { source: '列表页b', target: '内容页b-2', value: 0.3 }
        ]
      },
      chartSettingsLine:{
        axisSite: { right: ['下单率'] },
        yAxisType: ['KMB', 'percent'],
        yAxisName: ['数值', '比率']
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  },
  mounted:function(){
    setTimeout(()=>{
      this.showAnimation = false;
    },3000)
  }
}
</script>

<style scoped>
  .flex {
    width:100%;
    min-height: 200px;
    display: flex;
  }
</style>
