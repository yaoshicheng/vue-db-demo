<template>
  <div class="upload-container">
    <el-upload
      class="upload-demo"
      action="http://upload.qiniu.com"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :file-list="previewList"
      :limit="imageLimit"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
    </el-upload>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import * as qiniu from 'qiniu-js'
  export default {
    name: 'ImageUpload',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        imageLimit:1,
        tempUrl: '',
        previewList:[],
        dataObj: { token: '', key: '' }
      }
    },
    computed: {
      imageUrl() {
        return this.value
      }
    },
    methods: {
      beforeUpload(file){
        const that = this;
        const fileName = file.name;

        if(fileName.indexOf('png')<0 && fileName.indexOf('jpg')<0){
          this.$alert('提示：所选文件格式不为png或jpg', {
            confirmButtonText: '确定',
          });
        }else{
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
              mimeType: ["image/png", "image/jpeg", "image/gif"]
            };
            const config = {
              useCdnDomain: true,
              region: qiniu.region.z0
            };
            //上传
            that.loading = true;
            const observable = qiniu.upload(file, fileKey, uploadToken, putExtra, config)
            const observer = {
              next(res) {
                if(res.total.percent ==100){
                  that.previewList.push({
                    name: fileName,
                    url:accessUrl
                  });
                  that.$emit('uploaded', fileName,accessUrl)
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
      handleImageSuccess() {
        this.emitInput(this.tempUrl)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .upload-container {
    width: 100%;
    position: relative;
    @include clearfix;
    .image-uploader {
      width: 60%;
      float: left;
    }
    .image-preview {
      width: 200px;
      height: 200px;
      position: relative;
      border: 1px dashed #d9d9d9;
      float: left;
      margin-left: 50px;
      .image-preview-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .image-preview-action {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0, 0, 0, .5);
        transition: opacity .3s;
        cursor: pointer;
        text-align: center;
        line-height: 200px;
        .el-icon-delete {
          font-size: 36px;
        }
      }
      &:hover {
        .image-preview-action {
          opacity: 1;
        }
      }
    }
  }

</style>
