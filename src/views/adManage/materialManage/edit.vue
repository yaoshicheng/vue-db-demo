<template>
  <div>
    <el-card class="box-card">
      <el-form ref="editInfo" label-width="150px" class="demo-ruleForm" :inline="true" :model="passInfo">
        <el-form-item
          label="广告物料名称"
          prop="adsName"
          :rules="[
            { required: true, message: '广告物料名称不能为空'},
          ]"
        >
          <el-input type="text" v-model="passInfo.adsName" auto-complete="off" class='form-input adsName'></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="btn-sub">
      <el-button @click="handleCloseModal">取消</el-button>
      <el-button type="primary" @click="submitForm('editInfo')">提交</el-button>
    </div>
  </div>

</template>

<script>
  import request from '@/utils/request'
  import {Button,Input,Card,Form,FormItem,Message} from 'element-ui'
  export default {
    name: "Add",
    components: {
      'ElButton':Button,
      'ElInput':Input,
      'ElCard':Card,
      'ElForm':Form,
      'ElFormItem':FormItem
    },
    props:{
      passInfo:{
        adsName:String,
        adsId:Number,
      }
    },
    data:()=>{
      return {
      }
    },
    computed: {
    },
    mounted: function () {
    },
    methods: {
      handleCloseModal() {
        this.$emit('handleCloseEditModal')
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if(valid){
            let url = '/ads-op/ads';
            request({
              url,
              method: 'post',
              data:{
                adsId:this.passInfo.adsId,
                adsName:this.passInfo.adsName,
              }
            }).then(respData=>{
              if(respData.data.success){
                this.$message('编辑广告物料成功！');
                this.$emit("setData");
              }else{
                Message({
                  message:respData.data.message,
                  type: 'error'
                });
              }
            });
          } else {
            return false;
          }
        });
      },
    },
  };
</script>

<style scoped>
  .box-card {
    width: 100%;
    margin-top: 30px;
  }

  .form-input {
    width: 300px;
  }
  .form-input2 {
    width: 115px;
  }

  .btn-sub {
    margin-top: 30px;
    text-align: center;
    margin-bottom: 30px;
  }
</style>
