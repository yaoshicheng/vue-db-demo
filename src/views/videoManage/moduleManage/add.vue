<template>
  <div>
    <el-card class="box-card">
      <el-form  ref="addInfo" label-width="150px" class="demo-ruleForm" :inline="true" :model="addInfo">
        <el-form-item
          label="模块名称"
          prop="name"
          :rules="[
            { required: true, message: '模块名称'},
          ]"
        >
          <el-input type="text" v-model="addInfo.name" auto-complete="off" class='form-input'></el-input>
        </el-form-item>
        <el-form-item
          label="模块权重"
          prop="weight"
          :rules="[
            { required: true, message: '模块权重不能为空'},
            { pattern: /^([1-9]\d*|0)(\.\d*[1-9])?$/, message: '模块权重必须为正数！'},
            { type: 'number', message: '模块权重必须为数字值'}
          ]"
        >
          <div>
            <el-input-number v-model="addInfo.weight" :min="1" :max="10000" class='form-input width'></el-input-number>
            <el-tooltip placement="top">
              <div slot="content">提示信息：权重值越大，显示位置越靠前。范围0-10000 </div>
              <!--<i class="el-icon-question"></i>-->
              <el-button icon="el-icon-question" circle></el-button>
            </el-tooltip>
          </div>

          <!--<el-input type="text" v-model.number="addInfo.weight" auto-complete="off" class='form-input width'></el-input>-->
        </el-form-item>
        <el-form-item
          prop="previewList"
          label="封面图片"
          :rules="[
            { required: true, message: '封面图片不能为空'},
          ]"
        >
          <image-upload
            @uploaded="uploaded"></image-upload>
        </el-form-item>
        <el-form-item
          label="模块说明"
          prop="remark"
        >
          <el-input type="textarea" v-model="addInfo.remark" class='form-input width'></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="btn-sub">
      <el-button @click="handleCloseModal('addInfo')">取消</el-button>
      <el-button type="primary" @click="submitForm('addInfo')" :disabled="hasSubmit">提交</el-button>
    </div>
  </div>

</template>

<script>
  import request from '@/utils/request'
  import ImageUpload from '@/components/ImageUpload'
  import * as qiniu from 'qiniu-js'
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
      'ElCascader':Cascader,
      ImageUpload
    },
    props:{
      "weight":Number
    },
    data:()=>{
      return {
        imageLimit:1,
        imageUrl:'',
        addInfo:{
          name:"",
          remark:"",
          previewList:[],
          weight:"",
        },
        hasSubmit:false,
      }
    },
    mounted: function () {
    },
    methods: {
      uploaded(name,url){
        this.addInfo.previewList.push({
          name: name,
          url:url
        });
        this.imageUrl = url;
      },
      handleCloseModal(formName) {
        this.$refs[formName].resetFields()
        this.$emit('handleCloseAddModal')
      },
      submitForm(formName) {
        const that = this;
        if(this.addInfo.previewList.length <1){
          that.$message('请先上传封面图片！');
          return false;
        }
        this.$refs[formName].validate(valid => {
          this.addInfo.imageUrl = this.imageUrl;
          if(valid){
            this.hasSubmit = true;
            let url = '/ads-op/module-video-summary';
            request({
              url,
              method: 'put',
              data:this.addInfo
            }).then(respData=>{
              this.hasSubmit = false;
              if(respData.data.success){
                that.$message('新增模块成功！');
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
  .btn-sub {
    margin-top: 30px;
    text-align: center;
    margin-bottom: 30px;
  }
</style>
