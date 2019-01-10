<template>
  <el-card class="box-card" style="display: none">
    <el-form :inline="true" class="demo-form-inline" >
      <el-form-item>
          <el-button class="searchBtn" type="primary" @click="onSubmit(10,1)">查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import request from '@/utils/request'
  import {Button,Form,FormItem,Input,Card,Message} from 'element-ui'
  export default {
    name: "Search",
    data() {
      return {
        adsenseName:""
      };
    },
    components:{
      'ElButton':Button,
      'ElForm':Form,
      'ElFormItem':FormItem,
      'ElInput':Input,
      'ElCard':Card
    },
    methods: {
      onSubmit(pageSize,pageNum) {
        //进行数据请求，得到table数据
        const size = pageSize||10;
        const num = this.$store.state.moduleManage.currentModulePage||pageNum||1;
        let url = '/ads-op/module-video-summary?pageNum='+num+'&pageSize='+size;
        request({
          url,
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
