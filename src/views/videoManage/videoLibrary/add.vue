<template>
  <div>
    <el-card class="box-card">
      <el-form  ref="addInfo" label-width="150px" class="demo-ruleForm" :inline="true" :model="addInfo">
        <el-form-item
          label="视频名称"
          prop="name"
          :rules="[
            { required: true, message: '视频名称不能为空'},
          ]"
        >
          <el-input type="text" v-model="addInfo.name" auto-complete="off" class='form-input'></el-input>
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
          prop="videoUrl"
          label="视频上传"
        >
          <el-upload
            class="upload-demo"
            accept=".mp4"
            action="http://upload.qiniu.com"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="addInfo.previewList"
            :limit="videoLimit">
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">注意：请上传MP4或FLV文件</div>
            <video style="display:none;" controls="controls" id="uploadVideo" :src="videoUrl"></video>
          </el-upload>
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
      "total":Number,
      "moduleId":Number,
    },
    data:()=>{
      return {
        videoLimit:1,
        formatCode:"MP4",
        videoUrl:"",
        addInfo:{
          name:"",
          weight:"",
          videoUrl:"",
          previewList: [],
        },
        hasSubmit:false,
      }
    },
    mounted: function () {
    },
    methods: {
      beforeUpload(file){
        const that = this;
        const fileName = file.name;

        if(fileName.indexOf('mp4')<0 && fileName.indexOf('flv')<0){
          this.$alert('提示：所选文件格式不为mp4或flv', {
            confirmButtonText: '确定',
          });
        }else{
          if(fileName.indexOf('mp4')>-1){
            that.formatCode = "MP4";
          }else if(fileName.indexOf('flv')>-1){
            that.formatCode = "FLV";
          }else{
            that.formatCode = "";
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
              mimeType: null
            };
            const config = {
              useCdnDomain: true,
              region: qiniu.region.z0
            };

            //上传
            that.loading = true;
            const observable = qiniu.upload(file, fileKey, uploadToken, putExtra, config)
            const observer = {
              next(res){
                if(res.total.percent ==100){
                  // that.$message('上传完成！');
                  that.addInfo.previewList = [];
                  that.addInfo.previewList.push({
                    name: fileName,
                    url:accessUrl
                  });
                  that.videoUrl = accessUrl;
                }
              },
              error(err){
                this.$message(err);
              },
              complete(){
                that.loading = false;
                that.materialPreview = accessUrl;
                that.materialUrl = accessUrl;
              }
            }
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
        this.$refs[formName].resetFields();
        this.addInfo.previewList = [];
        this.$emit('handleCloseAddModal')
      },
      submitForm(formName) {
        const that = this;
        if(this.addInfo.previewList.length <1){
          that.$message('请先上传视频！');
          return false;
        }
        this.$refs[formName].validate(valid => {
          if(valid){
            this.hasSubmit = true;
            let url = '/ads-op/module-video-detail';
            this.addInfo.videoUrl = this.videoUrl;
            this.addInfo.imageUrl = this.videoUrl;
            this.addInfo.videoFormat = this.formatCode;
            let ele = document.getElementById("uploadVideo");
            let hour = parseInt((ele.duration)/3600);
            let minute = parseInt((ele.duration%3600)/60);
            let second = Math.ceil(ele.duration%60);
            let timeStr = "";
            if(hour>0){
              timeStr+=hour+":";
            }
            if(minute>0){
              timeStr+=minute+":";
            }
            if(second>0){
              if(hour<=0 && minute<=0){
                timeStr+=second+"s";
              }else{
                timeStr+=second;
              }
            }

            this.addInfo.videoLength = timeStr;
            this.addInfo.moduleId = this.moduleId;

            request({
              url,
              method: 'put',
              data:this.addInfo
            }).then(respData=>{
              this.hasSubmit = false;
              if(respData.data.success){
                that.$message('新增视频成功！');
                that.addInfo.previewList = [];
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
