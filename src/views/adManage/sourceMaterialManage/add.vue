<template>
  <div>
    <el-card class="box-card">
      <!--<el-form label-width="150px" class="demo-ruleForm" :inline="true">-->
        <el-form-item
          label="素材名称"
          prop="adsenseName"
        >
          <el-input type="text" v-model="passInfo.adsenseName" auto-complete="off" class='form-input'></el-input>
        </el-form-item>
        <el-form-item
          label="广告位"
        >
          <el-form label-width="20px" class="demo-ruleForm" :inline="true">
            <el-select v-model="selectedAdType" placeholder="请选择" class='form-input'>
              <el-option
                v-for="item in adType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form>
        </el-form-item>
        <el-form-item
          label="  "
          style="display: flex"
        >
          <el-upload
            class="upload-demo"
            ref="upload"
            accept=".mp4,.flv"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="beforeUpload"
            :file-list="fileList"
            :limit="1"
            :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传mp4/flv文件
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="性别标签"
        >
          <el-checkbox-group v-model="typeArray">
            <el-checkbox v-for="item in genderType" v-bind:key="item.label" style="margin-left: 30px"
                         v-bind:label="item.label">
              {{item.value}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="年龄标签"
          style="display: flex"
        >
          <el-checkbox-group v-model="typeArray" style="width: 300px;">
            <el-checkbox v-for="item in ageType" v-bind:key="item.value" style="margin-left: 30px"
                         v-bind:label="item.label">
              {{item.value}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      <!--</el-form>-->
    </el-card>
    <div class="btn-sub">
      <el-button @click="handleCloseModal">取消</el-button>
      <el-button type="primary" @click="submitForm('basicInformation')">提交</el-button>
    </div>
  </div>

</template>

<script>
  import {Button,Input,Card,Form,FormItem} from 'element-ui'
  import { mapGetters } from 'vuex'
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
        adsenseId:String,
        adsenseName:String,
        adsenseSize:String,
        materialType:Array,
      },
    },
    data:()=>{
      return {
        typeArray:[],
        selectedAdType:"",
        fileList:[],
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
    },
    methods: {
      // handleRemove(file, fileList) {
      //   // console.log(file, fileList);
      // },
      // handlePreview(file) {
      //   // console.log(file);
      // },
      beforeUpload(file){
        const fileName = file.name;
        if(fileName.indexOf('mp4')<0 && fileName.indexOf('flv')<0){
          this.$alert('提示：所选文件格式不为mp4或flv', {
            confirmButtonText: '确定',
          });
        }
      },
      handleRemove() {
        // console.log(file, fileList);
      },
      handlePreview() {
        // console.log(file);
      },
      handleCloseModal(done) {
        this.$confirm('确认关闭？')
          .then(() => {
            done();
          })
          .catch(() => {});
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert("submit!");
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
