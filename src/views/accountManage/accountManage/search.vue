<template>
  <el-card class="box-card" v-show=false>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" ref='formInline'>
      <el-form-item label="电话">
        <el-input type="text" auto-complete="off" class='form-input'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import request from '@/utils/request'
  import { Message } from 'element-ui'
  export default {
    name: "Search",
    data() {
      return {
        formInline: {
          region1: "",
          region2: "",
          region3: ""
        }
      };
    },

    methods: {
      onSubmit() {
        const that = this;
        //进行数据请求，得到table数据
        let url = '/ads-op/user';
        request({
          url,
          method: 'get'
        }).then(respData=>{
          const data2 = respData.data;
          const {data,success,message} = data2;
          if(success){
            const passData = {
              datasouce: data
            };
            this.$emit("setData", passData);
          }else{
            Message({
              message:message,
              type: 'error'
            });
          }
        }).catch(error=>{
          that.$message(error+"")
        })
      }
    },
    mounted: function() {
      this.onSubmit();
    }
  };
</script>

<style scoped>
  .box-card {
    width: 100%;
  }
</style>
