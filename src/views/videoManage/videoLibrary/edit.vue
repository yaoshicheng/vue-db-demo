<template>
  <div>
    <el-card class="box-card">
      <el-form  ref="addInfo" label-width="150px" class="demo-ruleForm" :inline="true" :model="passInfo">
        <el-form-item
          label="视频名称"
          prop="name"
          :rules="[
            { required: true, message: '模块名称'},
          ]"
        >
          <el-input type="text" v-model="passInfo.name" auto-complete="off" class='form-input'></el-input>
        </el-form-item>
        <el-form-item
          label="播放权重"
          prop="weight"
          :rules="[
            { required: true, message: '播放权重不能为空'},
            { pattern: /^([1-9]\d*|0)(\.\d*[1-9])?$/, message: '播放权重必须为正数！'},
            { type: 'number', message: '播放权重必须为数字值'}
          ]"
        >
          <div>
            <el-input-number v-model="passInfo.weight" :min="1" :max="10000" class='form-input width'></el-input-number>
            <el-tooltip placement="top">
              <div slot="content">提示信息：权重值越大，显示位置越靠前。范围0-10000 </div>
              <!--<i class="el-icon-question"></i>-->
              <el-button icon="el-icon-question" circle></el-button>
            </el-tooltip>
          </div>

          <!--<el-input type="text" v-model.number="passInfo.weight" auto-complete="off" class='form-input width'></el-input>-->
        </el-form-item>
        <!--<el-form-item-->
        <!--prop="videoUrl"-->
        <!--label="视频上传"-->
        <!--&gt;-->
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--action="http://upload.qiniu.com"-->
        <!--:on-preview="handlePreview"-->
        <!--:on-remove="handleRemove"-->
        <!--:on-change="beforeUpload"-->
        <!--:file-list="previewList"-->
        <!--:limit="videoLimit">-->
        <!--<el-button size="small" type="primary">上传文件</el-button>-->
        <!--<div slot="tip" class="el-upload__tip">注意：请上传MP4文件</div>-->
        <!--<video style="display:none;" controls="controls" id="uploadVideo" :src="videoUrl"></video>-->
        <!--</el-upload>-->
        <!--</el-form-item>-->
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
      'ElCascader':Cascader
    },
    props:{
      passInfo:{
        name:String,
        weight:Number,
        videoUrl:String,
      }
    },
    data:()=>{
      return {
        videoUrl:"",
        formatCode:"MP4",
        videoLimit:1,
        previewList: [],
      }
    },
    mounted: function () {
      this.previewList.push({
        name: "现有视频",
        url:this.passInfo.videoUrl
      });
      this.videoUrl = this.passInfo.videoUrl
    },
    methods: {
      beforeUpload(file){
        const that = this;
        const fileName = file.name;

        if(fileName.indexOf('mp4')<0){
          this.$alert('提示：所选文件格式不为mp4', {
            confirmButtonText: '确定',
          });
        }else{
          if(fileName.indexOf('mp4')>-1){
            that.formatCode = "MP4";
          }
          const url = "/ads-op/token?fileName="+fileName;
          request({
            url,
            method: 'get'
          }).then(respData=>{
            const tmpData = respData.data;
            const {accessUrl,fileKey,uploadToken} = tmpData.data;
            const putExtra = {
              fname: "",
              params: {},
              mimeType: null,
            };
            const config = {
              useCdnDomain: true,
              region: qiniu.region.z0
            };

            //上传
            that.loading = true;
            const observable = qiniu.upload(file.raw, fileKey, uploadToken, putExtra, config)
            const observer = {
              next(res) {
                if(res.total.percent ==100){
                  that.previewList = [];
                  that.previewList.push({
                    name: fileName,
                    url:accessUrl
                  });
                  that.videoUrl = accessUrl;
                  // that.$message('上传完成！')
                }
              },
              error(error) {
                that.$message(error)
              },
              complete() {}
            };
            observable.subscribe(observer) // 上传开始
          })
        }
      },
      handleRemove() {
        // console.log(file, fileList);
      },
      handlePreview() {
        // console.log(file);
      },
      handleCloseModal(formName) {
        this.$refs[formName].resetFields()
        this.$emit('handleCloseEditModal')
      },
      submitForm(formName) {
        const that = this;
        if(this.previewList.length <1){
          that.$message('请先上传视频！');
          return false;
        }
        this.$refs[formName].validate(valid => {
          if(valid){

            this.passInfo.videoUrl = this.previewList[0].url;
            this.passInfo.imageUrl = this.previewList[0].url;

            let url = '/ads-op/module-video-detail';
            request({
              url,
              method: 'post',
              data:this.passInfo
            }).then(respData=>{
              if(respData.data.success){
                that.$message('编辑视频成功！');
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
