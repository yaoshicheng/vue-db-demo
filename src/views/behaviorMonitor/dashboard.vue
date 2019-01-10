<template>
  <div style="padding: 0 30px">
    <div style="margin: 20px 3%;color:#3c3c3c;font-size: 17px">近30天全局异常事件统计</div>
      <div class="topContainer">
        <div class="innerItem" v-bind:key="item.color" v-for="item in countData">
          <div class="innerLeft">
            <img style="height: 80px;width: 80px;border-radius: 40px" :src="item.imgUrl"/>
          </div>
          <div class="innerRight">
            <div class="aaa" v-bind:style="{color:item.color}" >{{item.count}}</div>
            <div class="bbb">{{item.name}}</div>
          </div>
        </div>
      </div>
      <div style="margin-top: 40px">
        <el-form :inline="true" class="demo-form-inline" ref='formInline' style="margin: 0 3%">
          <el-form-item label="车辆选择">
            <el-autocomplete
              v-model="vehicleName"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入车辆名称"
              @select="selectCar"
              style="width: 180px"
            ></el-autocomplete>
          </el-form-item>

          <el-form-item label="开始时间">
            <el-date-picker
              v-model="startTime"
              type="date"
              placeholder="选择开始时间"
              @change="changeStartTime"
              :picker-options="startPickerOptions"
              @focus="datePickerFocus"
              style="width: 180px"
              align="right">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="结束时间">
            <el-date-picker
              v-model="endTime"
              type="date"
              placeholder="选择结束时间"
              @change="changeEndTime"
              @focus="datePickerFocus"
              :picker-options="endPickerOptions"
              style="width: 180px"
              align="right"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item>
            <el-button class="searchBtn" type="primary" @click="searchData">查询</el-button>
          </el-form-item>
        </el-form>
        <div style="margin: 0 3%">
          <ve-histogram :colors="color" :data-zoom="dataZoom" :data="chartData" :settings="chartSettings"></ve-histogram>
        </div>
      </div>

  </div>

</template>

<script>
  import request from '@/utils/request'
  import {formatDate} from '@/utils/index'
  import {Button,Select,Option,Input,Card,Form,FormItem,Message} from 'element-ui'

  // import { mapGetters } from 'vuex'
  export default {
    name: "Edit",
    components: {
      'ElButton':Button,
      'ElSelect':Select,
      'ElOption':Option,
      'ElInput':Input,
      'ElCard':Card,
      'ElForm':Form,
      'ElFormItem':FormItem
    },
    data(){
      this.chartSettings = {};
      return {
        color:["#F48B5E","#F8C264","#F7749E"],
        searchCarId:null,
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
        countData:[
          {name:"吸烟行为",count:null,imgUrl:require("./smoke.png"),color:'#F48B5E'},
          {name:"摔倒事件",count:null,imgUrl:require("./slide.png"),color:'#F8C264'},
          {name:"偷窃事件",count:null,imgUrl:require("./theft.png"),color:'#F7749E'},
        ],
        vehicleName:'',
        startTime:null,
        endTime:null,
        chartData: [],
        startPickerOptions: {},
        endPickerOptions: {},
      };
    },
    mounted: function () {
      const that = this;
      let url = '/ads-op/car/all-car-names';
      request({
        url: url,
        method: 'get'
      }).then(respData=>{
        const data2 = respData.data;
        const {data,success,message} = data2;
        if(success && data.length>0){
          let tmp = [];
          data.map(item=>{
            tmp.push({value:item.carName,carId:item.carId})
          });
          that.cars = tmp;
        }else{
          that.cars = [];
          Message({
            message:message,
            type: 'error'
          });
        }
      })

      let url2 = '/ads-op/behavior-monitor-summary-30';
      request({
        url: url2,
        method: 'get'
      }).then(respData=>{
        const data2 = respData.data;
        const {data,success,message} = data2;
        if(success){
         that.countData=[
            {name:"吸烟行为",count:data.smokeCount,imgUrl:require("./smoke.png"),color:'#F48B5E'},
            {name:"摔倒事件",count:data.fallCount,imgUrl:require("./slide.png"),color:'#F8C264'},
            {name:"偷窃事件",count:data.stealCount,imgUrl:require("./theft.png"),color:'#F7749E'},
          ]
        }else{
          Message({
            message:message,
            type: 'error'
          });
        }
      })
    },
    methods: {
      selectCar(item){
        this.searchCarId = item.carId;
      },
      searchData(){
        const that = this;
        if(this.vehicleName && this.startTime && this.endTime){
          let beginDay = formatDate(this.startTime,'yyyyMMdd');
          let endDay = formatDate(this.endTime,'yyyyMMdd');
          let url = '/ads-op/behavior-monitor-summary-car?beginDay='+beginDay+'&endDay='+endDay+'&carId='+that.searchCarId;
          request({
            url: url,
            method: 'get'
          }).then(respData=>{
            const data2 = respData.data;
            const {data,success,message} = data2;
            if(success){
              let columns = ['日期', '吸烟行为', '摔倒事件', '偷窃事件'];
              let rows = [];
              data.map(item=>{
                let tmp = item.summaryDay;
                rows.push({ '日期': tmp.substr(0,4)+'-'+tmp.substr(4,2)+'-'+tmp.substr(6,2), '吸烟行为': item.smokeCount, '摔倒事件': item.fallCount, '偷窃事件': item.stealCount},)
              });
              this.chartData = {
                columns: columns,
                rows: rows
              };
            }else{
              Message({
                message:message,
                type: 'error'
              });
            }
          })

        }else{
          Message({
            message:"请先选择车辆及查询时间范围！",
            type: 'error'
          });
        }
      },
      querySearchAsync(queryString, cb) {
        let cars = this.cars;
        let results = queryString ? cars.filter(this.createStateFilter(queryString)) : cars;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 50 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      // handleSelectVehicle(item) {
      //   // console.log(item);
      // },
      datePickerFocus(){
        if(!this.startTime){
          this.endPickerOptions = {
            disabledDate() {
              return false;
            }
          }
        }
        if(!this.endTime){
          this.startPickerOptions = {
            disabledDate() {
              return false;
            }
          }
        }
      },
      changeStartTime(value){
        const vm = this;
        this.startTime = value;
        if(value){
          this.endPickerOptions =  {
            disabledDate(time) {
              return (time.getTime() > value.getTime()+ 3600 * 1000 * 24 * 29) || (time.getTime() < value.getTime());
            }
          }
        }else{
          this.endPickerOptions =  {
            disabledDate() {
              return false;
            }
          }
        }
        if(this.endTime){
          this.startPickerOptions =  {
            disabledDate(time) {
              return (time.getTime() < vm.endTime.getTime()- 3600 * 1000 * 24 * 29) || (time.getTime() > vm.endTime.getTime());
            }
          }
        }else {
          this.startPickerOptions = {
            disabledDate() {
              return false;
            }
          }
        }
      },
      changeEndTime(value){
        const vm = this;
        this.endTime = value;
        if(this.startTime){
          this.endPickerOptions =  {
            disabledDate(time) {
              return (time.getTime() > vm.startTime.getTime()+ 3600 * 1000 * 24 * 29) || (time.getTime() < vm.startTime.getTime());
            }
          }
        }else {
          this.endPickerOptions = {
            disabledDate() {
              return false;
            }
          }
        }
        if(value){
          this.startPickerOptions =  {
            disabledDate(time) {
              return (time.getTime() < value.getTime()- 3600 * 1000 * 24 * 29) || (time.getTime() > value.getTime());
            }
          }
        }else{
          this.startPickerOptions =  {
            disabledDate() {
              return false;
            }
          }
        }

      },
    },
  };
</script>

<style scoped>

  .form-input {
    width: 300px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .topContainer{
    /*padding: 20px 50px;*/
    width: 100%;
    min-width: 700px;
    height:120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .topContainer .innerItem{
    width: 33%;
    min-width: 200px;
    height: 100%;
    margin: 0 3%;
    background: #efefef;
    display: flex;
  }
  .innerLeft{
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .innerRight{
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .aaa{
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 36px;
  }
  .bbb{
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 17px;
    color: #343434;
  }

</style>
