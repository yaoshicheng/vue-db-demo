<template>
  <div>
    <el-card class="box-card">
      <el-form label-width="150px" class="demo-ruleForm" :inline="true" ref="editInfo" :model="accountInfo">
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input type="text" disabled v-model="accountInfo.mobile" auto-complete="off" class='form-input'></el-input>
        </el-form-item>
        <el-form-item
          label="账号类型"
          prop="userInfoType"
        >
          <el-radio-group v-model="accountInfo.userInfoType">
            <el-radio v-for="item in accountType"
                      v-bind:key="item.value"
                      :label="item.value">
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="重置密码"
          prop="password"
          :rules="[
            { required: true, message: '密码不能为空'},
            { min:6 ,max:20, message: '密码必须在6-20位'}
          ]"
        >
          <el-input :minlength=6 :maxlength=20 type="password" v-model="accountInfo.password" auto-complete="off" class='form-input'></el-input>
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
  import { mapGetters } from 'vuex'
  import { Message } from 'element-ui'
  export default {
    name: "Edit",
    props:{
      accountInfo:{
        mobile:String,
        type:String,
      },
    },
    data:()=>{
      return {
        password:"",
        password2:"",
      }
    },
    computed: {
      ...mapGetters([
        'accountType',
      ])
    },
    mounted: function () {
      //请求数据，初始化数据
    },
    methods: {
      handleCloseModal() {
        this.$emit('handleCloseEditModal')
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let url = '/ads-op/user';
            request({
              url,
              method: 'post',
              data:this.accountInfo
            }).then(respData=>{
              if(respData.data.success){
                this.$message('修改用户成功！');
                this.$emit("setData");
              }else{
                Message({
                  message:respData.data.message,
                  type: 'error'
                });
              }

            }).catch(error=>{
              this.$message(error+"");
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
