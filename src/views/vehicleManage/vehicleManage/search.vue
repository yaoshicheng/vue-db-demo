<template>
    <el-card class="box-card">
        <el-form :inline="true" class="demo-form-inline" ref='formInline'>
          <el-form-item :label="$t('vehicleManage.carNumber')">
              <el-input v-model="vehicleNumber" class='vehicleNumber form-input'></el-input>
          </el-form-item>
          <el-form-item :label="$t('vehicleManage.carNumber')" style="display: none">
            <el-input v-model="vehicleNumber" class='vehicleNumber form-input'></el-input>
          </el-form-item>
            <el-form-item>
                <el-button class="searchBtn" type="primary" @click="onSubmit(10,1)">{{$t('common.search')}}</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
  import {carList} from '@/api/vehicleManage'
export default {
  name: "Search",
  data() {
    return {
      vehicleNumber:"",
    }
  },
  methods: {
    onSubmit(pageSize,pageNum) {
      //进行数据请求，得到table数据
      const query = {
        pageNum:pageNum||1,
        pageSize:pageSize||10,
      }
      if(this.vehicleNumber && this.vehicleNumber!==""){
        query.carNumber = this.vehicleNumber;
      }
      carList(query).then(respData=>{
        const data2 = respData.data;
        const {data,success,message} = data2;
        if(success){
          const listData = data.list;
          listData.map(item=>{
            const {adsList,provinceCode,cityCode,} = item;
            let adsNameTotal = "";
            let adsIdArray = [];
            let currentCity = [provinceCode,cityCode];
            if(adsList && adsList.length>0){
              adsList.map((ad,index) =>{
                adsNameTotal += ad.adsName;
                if(index<adsList.length-1){
                  adsNameTotal += "、";
                }
                adsIdArray.push(ad.adsId)
              })
            }

            item.adsIdArray = adsIdArray;
            item.adsNameTotal = adsNameTotal;
            item.currentCity = currentCity;
          });
          const passData = {
            total: data.total,
            datasouce: listData
          };
          this.$emit("setData", passData);
        }else{
          this.$message(message);
        }
      })
    }
  },
  mounted: function() {
    this.onSubmit(10, 1);
  }
};
</script>

<style scoped>
.box-card {
  width: 100%;
}
</style>
