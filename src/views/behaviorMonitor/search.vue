<template>
    <el-card class="box-card">
        <el-form :inline="true" class="demo-form-inline" ref='formInline'>
              <el-form-item label="事件类型">
                <el-select v-model="behaviorType" placeholder="请选择">
                  <el-option
                    v-for="item in eventTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="发生时间">
                <el-date-picker
                  v-model="initTime"
                  type="datetimerange"
                  :picker-options="pickerOptions2"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right">
                </el-date-picker>
              </el-form-item>
        </el-form>
      <el-form :inline="true" class="demo-form-inline" ref='formInline'>
              <el-form-item label="发生车辆">
                <el-input v-model="carName" class='form-input'></el-input>
              </el-form-item>
              <el-form-item label="相机编号">
                <el-input v-model="cameraCode" class='form-input'></el-input>
              </el-form-item>
        <el-form-item>
          <el-button class="searchBtn" type="danger" @click="reset">重置</el-button>
        </el-form-item>
              <el-form-item>
                <el-button class="searchBtn" type="primary" @click="onSubmit(10,1)">查询</el-button>
              </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
  import request from '@/utils/request'
  import {formatDate} from '@/utils/index'
  import {Button,Form,FormItem,Input,Card,Message} from 'element-ui'
export default {
  name: "Search",
  components:{
    'ElButton':Button,
    'ElForm':Form,
    'ElFormItem':FormItem,
    'ElInput':Input,
    'ElCard':Card
  },
  data() {
    return {
      cameraCode:null,
      behaviorType:null,
      eventTypes:[
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '吸烟'
        },
        {
          value: '1',
          label: '偷盗'
        },
        {
          value: '2',
          label: '摔倒'
        },
      ],
      carName:"",
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      initTime: [undefined,undefined],
    }
  },
  methods: {
    reset(){
      this.cameraCode  = null;
      this.behaviorType = null;
      this.initTime = [undefined,undefined];
      this.carName = null;
    },
    onSubmit(pageSize,pageNum) {

      //进行数据请求，得到table数据
      const size = pageSize||10;
      const num = pageNum||1;
      let url = '/ads-op/behavior-monitor?pageNum='+num+'&pageSize='+size;
      if(this.carName && this.carName!==""){
        url = url+"&carName="+this.carName;
      }

      if(this.behaviorType && this.behaviorType!==""){
        url = url+"&behaviorType="+this.behaviorType;
      }

      if(this.cameraCode && this.cameraCode!==""){
        url = url+"&cameraCode="+this.cameraCode;
      }

      if(this.initTime[0] && this.initTime[1] ){
        let beginTime = formatDate(this.initTime[0],'yyyy-MM-dd hh:mm:ss');
        let endTime = formatDate(this.initTime[1],'yyyy-MM-dd hh:mm:ss');
        url = url+"&beginTime="+beginTime+"&endTime="+endTime;
      }
      request({
          url: url,
          method: 'get'
      }).then(respData=>{
        const data2 = respData.data;
        const {data,success,message} = data2;
        if(success){
          const listData = data.list;
          const passData = {
            total: data.total,
            datasouce: listData
          };
          this.$emit("setData", passData);
        }else{
          Message({
            message:message,
            type: 'error'
          });
        }
      })
    }
  },
  mounted: function() {
    this.onSubmit(10, 1);
  }
};
</script>

<style scoped>
.box-card {
  width: 100%;
}
</style>
