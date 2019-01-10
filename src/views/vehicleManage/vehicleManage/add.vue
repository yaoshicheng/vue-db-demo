<template>
  <div>
    <el-card class="box-card">
      <el-form ref="addInfo" label-width="150px" class="demo-ruleForm" :inline="true" :model="vehicleInfo">
        <el-form-item
          :label="$t('vehicleManage.carName')"
          prop="carName"
          :rules="[
            { required: true, message: $t('vehicleManage.tipMsg.tip1')},
          ]"
        >
          <el-input type="text" v-model="vehicleInfo.carName" auto-complete="off" class='form-input carName'></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('vehicleManage.carNumber')"
          prop="carNumber"
          :rules="[
            { required: true, message:$t('vehicleManage.tipMsg.tip2')},
          ]"
        >
          <el-input type="text" v-model="vehicleInfo.carNumber" auto-complete="off" class='form-input carNumber'></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('vehicleManage.opCity')"
          prop="currentCity"
          :rules="[
            { required: true, message: $t('vehicleManage.tipMsg.tip3')},
          ]"
        >
          <el-cascader
            class='form-input city'
            expand-trigger="hover"
            :options="cities"
            v-model="vehicleInfo.currentCity"
            :show-all-levels="true"
            @change="handleChangeCity">
          </el-cascader>
        </el-form-item>
        <el-form-item
          :label="$t('vehicleManage.opRoute')"
          prop="operationRoute"
          :rules="[
            { required: true, message: $t('vehicleManage.tipMsg.tip4')},
          ]"
        >
          <el-input type="text" v-model="vehicleInfo.operationRoute" auto-complete="off" class='form-input operationRoute'></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('vehicleManage.macAddress')"
          prop="algMacs"
          :rules="[
            { required: true, message: $t('vehicleManage.tipMsg.tip5')},
          ]"
        >
          <div style="min-width: 300px">
            <el-tag
              :key="tag"
              v-for="tag in vehicleInfo.algMacs"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)">
              {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+</el-button>
          </div>
        </el-form-item>
        <el-form-item
          :label="$t('vehicleManage.adMaterial')"
          prop="adsIdArray"
          :rules="[
            // { required: true, message: '广告物料不能为空'},
          ]"
        >
          <el-select
            multiple
            v-model="vehicleInfo.adsIdArray"
            @change = "handleChangeAds"
            :placeholder="$t('common.pleaseChoose')" class='form-input adMaterial'>
            <el-option
              v-for="item in adMaterials"
              :key="item.adsId"
              :label="item.adsName"
              :value="item.adsId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="btn-sub">
      <el-button @click="handleCloseModal('addInfo')">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="submitForm('addInfo')">{{$t('common.submit')}}</el-button>
    </div>
  </div>

</template>

<script>
  import {addCar,getCitys,getAds} from '@/api/vehicleManage'
  export default {
    name: "Add",
    data(){
      return {
        cities:[],
        adMaterials:[],
        inputVisible: false,
        inputValue: '',
        vehicleInfo:{
          carName:"",
          carNumber:"",
          operationRoute:"",
          currentCity:[],
          adsIdArray: [],
          cityCode: "",
          cityName: "",
          provinceCode: "",
          provinceName: "",
          adsList:[],
          algMacs:[],
        },
      };
    },
    computed: {
    },
    mounted: function () {
      const that = this;
      //请求数据，初始化数据
      getCitys().then(respData=> {
        if(respData.data.success){
          that.cities = respData.data.data;
        }
      })
      getAds().then(respData=> {
        if(respData.data.success){
        that.adMaterials = respData.data.data;
        }
      })
    },
    methods: {
      handleClose(tag) {
        this.vehicleInfo.algMacs.splice(this.vehicleInfo.algMacs.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.vehicleInfo.algMacs.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      getCascaderObj(val,opt) {
        return val.map(function (value) {
          for (let itm of opt) {
            if (itm.value == value) { opt = itm.children; return itm; }
          }
          return null;
        });
      },
      handleChangeAds(value){
        let adsList = [];
        value.map(vla=>{
          let obj={};
          obj = this.adMaterials.find((item)=>{
            return item.adsId === vla;
          });
          adsList.push(obj);
        })
        this.vehicleInfo.adsList = adsList;
      },
      handleCloseModal(formName) {
        this.$refs[formName].resetFields()
        this.$emit('handleCloseAddModal')
      },
      handleChangeCity(value){
        const item=this.getCascaderObj(value, this.cities);
        this.vehicleInfo.cityCode = item[1].value;
        this.vehicleInfo.cityName = item[1].label;
        this.vehicleInfo.provinceCode = item[0].value;
        this.vehicleInfo.provinceName = item[0].label;
        this.currentCity = value;
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if(valid){
            addCar(this.vehicleInfo).then(respData=>{
              if(respData.data.success){
                this.$message(this.$t('vehicleManage.addSucceed'));
                this.$refs[formName].resetFields();
                this.$emit("setData");
              }else{
                this.$message(respData.data.message);
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
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
