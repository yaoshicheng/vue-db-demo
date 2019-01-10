<template>
  <el-card class="box-card">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="广告位名称">
          <el-input type="text" v-model="adsenseName" auto-complete="off" class='form-input'></el-input>
      </el-form-item>
      <el-form-item label="广告位名称" style="display: none">
        <el-input type="text" v-model="adsenseName" auto-complete="off" class='form-input'></el-input>
      </el-form-item>
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
        const num = pageNum||1
        let url = '/ads-op/position?pageNum='+num+'&pageSize='+size;
        if(this.adsenseName && this.adsenseName!==""){
          url = url+"&positionName="+this.adsenseName;
        }
        request({
          url,
          method: 'get'
        }).then(respData=>{
          const data2 = respData.data;
          const {data,success,message} = data2;
          if(success){
            const listData = data.list;
            listData.map(item=>{
              const {formats,width,height} = item;
              let materialType = "";
              let materialTypeArray = [];
              formats.map((ad,index) =>{
                materialType += ad.formatName;
                if(index<formats.length-1){
                  materialType += "、";
                }
                materialTypeArray.push(ad.formatCode)
              })
              item.positionSize = width +"*" +height;
              item.materialType = materialType;
              item.materialTypeArray = materialTypeArray;
            });
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
