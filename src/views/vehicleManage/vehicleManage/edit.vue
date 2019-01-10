<template>
  <div>
    <el-card class="box-card">
      <el-form label-width="150px" class="demo-ruleForm" :inline="true" ref="editInfo" :model="vehicleInfo">
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
          :label="$t('vehicleManage.carCode')"
          prop="code"
          :rules="[
            { required: true, message:$t('vehicleManage.tipMsg.tip6')},
          ]"
        >
          <el-input type="text" disabled v-model="vehicleInfo.code" auto-complete="off" class='form-input code'></el-input>
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
            name="cityName"
            expand-trigger="hover"
            :options="cities"
            v-model="vehicleInfo.currentCity"
            :show-all-levels="false"
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
          <div>
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
            :placeholder="$t('common.pleaseChoose')"
            class='form-input adMaterial'>
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
      <el-button @click="handleCloseModal">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="submitForm('editInfo')">{{$t('common.submit')}}</el-button>
    </div>
  </div>

</template>

<script>
  import {updateCar,getCitys,getAds} from '@/api/vehicleManage'
  export default {
    name: "Edit",
    props:{
      vehicleInfo:{
        name:String,
        number:String,
        route:String,
        currentCity:Array,
        adsIdArray: Array,
        cityName:String,
        cityCode:String,
        provinceName:String,
        provinceCode:String,
        adsList:Array,
      },
    },
    data(){
      return {
        inputVisible: false,
        inputValue: '',
        cities:[],
        adMaterials:[],
        editVehicleInfo:[],
      };
    },
    watch: {
      vehicleInfo: function(newVal){
        this.editVehicleInfo = newVal;  //newVal即是chartData
      }
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
          for (var itm of opt) {
            if (itm.value == value) { opt = itm.children; return itm; }
          }
          return null;
        });
      },
      handleCloseModal() {
        this.$emit('handleCloseEditModal')
      },
      handleChangeCity(value){
        const item=this.getCascaderObj(value, this.cities);
        this.editVehicleInfo.cityCode = item[1].value;
        this.editVehicleInfo.cityName = item[1].label;
        this.editVehicleInfo.provinceCode = item[0].value;
        this.editVehicleInfo.provinceName = item[0].label;
        this.currentCity = value;
      },
      handleChangeAds(value){
        let adsList = [];
        value.map(vla=>{
          let obj={};
          obj = this.adMaterials.find((item)=>{
            return item.adsId === vla;
          });
          adsList.push(obj);
        });
        this.vehicleInfo.adsList = adsList;
      },
      submitForm(formName) {
        const that = this;
        this.$refs[formName].validate(valid => {
          if(valid){
            updateCar(this.vehicleInfo).then(respData=>{
              if(respData.data.success){
                that.$message(that.$t('vehicleManage.updateSucceed'));
                this.$emit("setData");
              }else{
                that.$message(respData.data.message);
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
