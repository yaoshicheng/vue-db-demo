<template>
  <div>
    <el-card class="box-card">
      <el-form  ref="addInfo" label-width="150px" class="demo-ruleForm" :inline="true" :model="passInfo">
        <el-form-item
          label="广告位名称"
          prop="positionName"
          :rules="[
            { required: true, message: '广告位名称不能为空'},
          ]"
        >
          <el-input type="text" v-model="passInfo.positionName" auto-complete="off" class='form-input positionName'></el-input>
        </el-form-item>
        <el-form-item
          label="广告位尺寸-宽"
          prop="width"
          :rules="[
            { required: true, message: '宽不能为空'},
            { pattern: /^([1-9]\d*|0)(\.\d*[1-9])?$/, message: '宽必须为正数！'},
            { type: 'number', message: '宽必须为数字值'}
          ]"
        >
          <el-input type="text" v-model.number="passInfo.width" auto-complete="off" class='form-input width'></el-input>
        </el-form-item>
        <el-form-item
          prop="height"
          label="广告位尺寸-高"
          :rules="[
            { required: true, message: '高不能为空'},
            { pattern:/^([1-9]\d*|0)(\.\d*[1-9])?$/, message: '高必须为正数！'},
            { type: 'number', message: '高必须为数字值'}
          ]"
        >
          <el-input type="text" v-model.number="passInfo.height" auto-complete="off" class='form-input height'></el-input>
        </el-form-item>
        <el-form-item
          label="物料格式"
          prop="selectedTypeArray"
          :rules="[
            { required: true, message: '物料格式不能为空'},
          ]"
        >
          <el-checkbox-group v-model="passInfo.selectedTypeArray" @change="handleCheckedMaterialChange" class="selectedTypeArray">
            <el-checkbox v-for="item in materialTypeArray" v-bind:key="item.formatCode"
                         v-bind:label="item.formatName">
              {{item.formatCode}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="btn-sub">
      <el-button @click="handleCloseModal('addInfo')">取消</el-button>
      <el-button type="primary" @click="submitForm('addInfo')">提交</el-button>
    </div>
  </div>

</template>

<script>
  import request from '@/utils/request'
  import {Button,Select,Option,Input,Card,Form,FormItem,Cascader,Message} from 'element-ui'
  // import { mapGetters } from 'vuex'
  export default {
    name: "Add",
    components: {
      'ElButton':Button,
      'ElSelect':Select,
      'ElOption':Option,
      'ElInput':Input,
      'ElCard':Card,
      'ElForm':Form,
      'ElFormItem':FormItem,
      'ElCascader':Cascader
    },
    data:()=>{
      return {
        passInfo:{
          "formats": [],
          "height": undefined,
          "positionName": "",
          "width": undefined,
          selectedTypeArray:[],
        },
        materialTypeArray:[]
      }
    },
    mounted: function () {
      const that = this;
      //请求数据，初始化数据
      request({
        url: '/ads-op/position/formats',
        method: 'get'
      }).then(respData=> {
        if(respData.data.success){
          that.materialTypeArray = respData.data.data;
        }
      })
    },
    methods: {
      handleCheckedMaterialChange(value){
        let formats = [];
        value.map(vla=>{
          let obj={};
          obj = this.materialTypeArray.find((item)=>{
            return item.formatCode === vla;
          });
          formats.push(obj);
        })
        this.passInfo.formats = formats;
      },
      handleCloseModal(formName) {
        this.$refs[formName].resetFields()
        this.$emit('handleCloseAddModal')
      },
      submitForm(formName) {
        const that = this;
        this.$refs[formName].validate(valid => {
          if(valid){
            let url = '/ads-op/position';
            const {width,height} = this.passInfo;
            this.passInfo.width = Number(width);
            this.passInfo.height = Number(height);
            request({
              url,
              method: 'put',
              data:this.passInfo
            }).then(respData=>{
              if(respData.data.success){
                that.$message('新增广告位成功！');
                this.$refs[formName].resetFields()
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
    width: 95px;
  }

  .btn-sub {
    margin-top: 30px;
    text-align: center;
    margin-bottom: 30px;
  }
</style>
