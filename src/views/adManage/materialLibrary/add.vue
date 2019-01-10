<template>
  <div>
    <el-card class="box-card"
     v-loading="loading"
     element-loading-text="上传中。。。"
     element-loading-spinner="el-icon-loading"
    >
      <el-form label-width="150px" class="demo-ruleForm" :inline="true" ref="addInfo" :model="materialInfo">
        <el-form-item
          label="素材名称"
          prop="materialName"
          :rules="[
            { required: true, message: '素材名称不能为空'},
          ]"
        >
          <el-input type="text" v-model="materialInfo.materialName" auto-complete="off" class='form-input materialName'></el-input>
        </el-form-item>
        <el-form-item
          label="广告位"
          prop="positionId"
          :rules="[
            { required: true, message: '广告位不能为空'},
          ]"
        >
          <el-select v-model="materialInfo.positionId" placeholder="请选择" class='form-input positionId'
            @change="changePosition"
          >
            <el-option
              v-for="item in adsenses"
              :key="item.positionId"
              :label="item.positionName"
              :value="item.positionId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="素材"
          prop="materialUrl"
          style="display: flex"
        >
          <el-upload
            class="upload-demo"
            ref="upload"
            action="http://upload.qiniu.com"
            accept=".mp4,.flv"
            :on-change="beforeUpload"
            :file-list="fileList"
            list-type="picture"
            :limit="1"
            :auto-upload="false">
            <el-button :disabled=!materialInfo.positionId size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传mp4/flv文件，单次只能上传一个视频，重新上传需要先删除已上传的视频
            </div>
          </el-upload>
        </el-form-item>
        <video class="uploadVideo" :src="materialInfo.materialUrl" width="0" height="0"/>
        <el-form-item
          label="性别标签"
          prop="sexTag"
          :rules="[
            { required: true, message: '性别标签不能为空'},
          ]"
        >
          <el-checkbox-group v-model="materialInfo.sexTag" @change="handleChangeSexTags" class="sexTag">
            <el-checkbox v-for="item in genderType" v-bind:key="item.tagName" style="margin-left: 30px"
                         v-bind:label="item.tagId">
              {{item.tagName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="年龄标签"
          prop="ageTag"
          :rules="[
            { required: true, message: '年龄标签不能为空'},
          ]"
          style="display: flex"
        >
          <el-checkbox-group v-model="materialInfo.ageTag" @change="handleChangeAgeTags" style="width: 300px;" class="ageTag">
            <el-checkbox v-for="item in ageType" v-bind:key="item.tagName" style="margin-left: 30px"
                         v-bind:label="item.tagId">
              {{item.tagName}}
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
  import * as qiniu from 'qiniu-js'
  import {Button,Input,Card,Form,FormItem,Message} from 'element-ui'
  import { mapGetters } from 'vuex'
  // import $ from 'jquery'
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
    },
    data:()=>{
      return {
        videoName:"",
        loading:false,
        materialName:"",
        selectedAdType:"",
        fileList:[],
        adsenses:[],
        materialInfo:{
          "ageTag": [],
          "formatCode": "",
          "materialName": "",
          "materialPreview": "",
          "materialUrl": "",
          "positionId": null,
          "positionName": "",
          "sexTag": []
        }
      }
    },
    computed: {
      ...mapGetters([
        'genderType',
        'ageType',
        'adType',
      ]),
    },
    mounted: function () {
      this.fileList = [];
      this.getAdsenses();
    },
    methods: {
      changePosition(value){
        this.adsenses.map(item=>{
          if(item.positionId == value ){
            this.allowedWidth = item.positionWidth;
            this.allowedHeight= item.positionHeight;
            return;
          }
        })
      },
      handleChangeSexTags(value){
        let sexTags = [];
        value.map(vla=>{
          let obj={};
          obj = this.genderType.find((item)=>{
            return item.tagId === vla;
          });
          sexTags.push(obj);
        })
        this.sexTags = sexTags;
      },
      handleChangeAgeTags(value){
        let ageTags = [];
        value.map(vla=>{
          let obj={};
          obj = this.ageType.find((item)=>{
            return item.tagId === vla;
          });
          ageTags.push(obj);
        })
        this.ageTags = ageTags;
      },
      getAdsenses(){
        const that = this;
        let url = '/ads-op/position?pageNum=1&pageSize=10000';
        request({
          url,
          method: 'get'
        }).then(respData=>{
          const data2 = respData.data;
          const {data,success} = data2;
          if(success){
            const listData = data.list;
            const adsenses = [];
            listData.map(item=>{
              const {formats,width,height,positionId,positionName} = item;
              let materialType = "";
              let size = width +"*" +height;
              formats.map((ad,index) =>{
                materialType += ad.formatName;
                if(index<formats.length-1){
                  materialType += "、";
                }
              });
              adsenses.push(
                {
                  positionId:positionId,
                  positionName:positionName+'（'+size+';'+materialType+'）',
                  positionWidth:width,
                  positionHeight:height,
                }
              )
              that.adsenses = adsenses;
            });
          }
        })
      },
      beforeUpload(file){
        const that = this;
        const fileName = file.name;

        if(fileName.indexOf('mp4')<0 && fileName.indexOf('flv')<0){
          this.$alert('提示：所选文件格式不为mp4或flv', {
            confirmButtonText: '确定',
          });
        }else{
          if(fileName.indexOf('mp4')>-1){
            that.materialInfo.formatCode = "MP4";
          }else if(fileName.indexOf('flv')>-1){
            that.materialInfo.formatCode = "FLV";
          }else{
            that.materialInfo.formatCode = "";
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
            const observable = qiniu.upload(file.raw, fileKey, uploadToken, putExtra, config)
            const observer = {
              next(res){
                if(res.total.percent ==100){
                  that.$message('上传完成！')
                }
              },
              error(err){
                this.$message(err);
              },
              complete(){
                that.loading = false;
                that.materialInfo.materialPreview = accessUrl;
                that.materialInfo.materialUrl = accessUrl;
              }
            }
            observable.subscribe(observer) // 上传开始
          })
        }
      },
      handleCloseModal(formName) {
        this.$refs[formName].resetFields()
        this.$emit('handleCloseAddModal')
      },
      submitForm(formName) {
        if(this.materialInfo.materialUrl ==""){
          this.$message('请先上传需要添加的视频！');
          return
        }

        // let video = $('.uploadVideo');
        // let uploadVideoWidth = video[0].videoWidth;
        // let uploadVideoHeight = video[0].videoHeight;

        // if(this.allowedWidth == uploadVideoWidth && this.allowedHeight == uploadVideoHeight){
          this.$refs[formName].validate(valid => {
            if (valid) {
              this.materialInfo.ageTags = this.ageTags;
              this.materialInfo.sexTags = this.sexTags;
              let url = '/ads-op/material';
              request({
                url,
                method: 'put',
                data:this.materialInfo
              }).then(respData=>{
                const data2 = respData.data;
                const {success,message} = data2;
                if(success){
                  this.$message('新建素材成功！');
                  this.$emit('handleCloseAddModal')
                  this.$emit("setData");
                }else{
                  Message({
                    message:message,
                    type: 'error'
                  });
                }
              }).catch((error)=>{
                this.$message(error+"")
              })
            } else {
              return false;
            }
          });
        // }
        // else{
        //   this.$message('视频尺寸与广告位尺寸不符！');
        //   return false;
        // }
      },
    },
  };
</script>

<style scoped>
  .box-card {
    width: 100%;
    margin-top: 10px;
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
