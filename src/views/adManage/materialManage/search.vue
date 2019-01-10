<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" ref='formInline'>
      <el-form-item label="广告物料名称">
          <el-input v-model="adsName" type="text" auto-complete="off" class='form-input'></el-input>
      </el-form-item>
      <el-form-item label="广告物料名称" style="display: none">
        <el-input v-model="adsName" type="text" auto-complete="off" class='form-input'></el-input>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="onSubmit(10,1)" class="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import request from '@/utils/request'
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
      formInline: {
        region1: "",
        region2: "",
        region3: ""
      },
      adsName:""
    };
  },

  methods: {
    onSubmit(pageSize,pageNum) {
      //进行数据请求，得到table数据
      const size = pageSize||10;
      const num = pageNum||1;
      let url = '/ads-op/ads?pageNum='+num+'&pageSize='+size;
      if(this.adsName && this.adsName!==""){
        url = url+"&adsName="+this.adsName;
      }
      request({
        url,
        method: 'get'
      }).then(respData=>{
        const data2 = respData.data;
        const {data,success,message} = data2;
        if(success){
          const listData = data.list;
          if(listData && listData.length>0){
            listData.map(item=>{
              const {positions} = item;
              let positionLabel = "";
              let positionArray = [];
              if(positions){
                positions.map((ad,index) =>{
                  positionLabel += ad.positionName;
                  if(index<positions.length-1){
                    positionLabel += "、";
                  }
                  positionArray.push(ad.positionId)
                })
              }
              item.positionLabel = positionLabel;
              item.positionArray = positionArray;
            });
          }
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
