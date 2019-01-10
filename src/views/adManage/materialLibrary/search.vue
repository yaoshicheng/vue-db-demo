<template>
  <el-card class="box-card">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="素材名称">
          <el-input type="text" v-model="materialName" auto-complete="off" class='form-input materialName'></el-input>
      </el-form-item>
      <el-form-item label="广告位规格">
        <el-select
          v-model="selectedPosition"
          @change = "handleChangeAdsense"
          placeholder="--请选择--"
          class='form-input selectedPosition'>
          <el-option
            label="--全部--"
            value="">
          </el-option>
          <el-option
            v-for="item in adsenses"
            :key="item.positionId"
            :label="item.positionName"
            :value="item.positionId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="onSubmit(10,1)" class="searchBtn">查询</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import request from '@/utils/request'
  import {Button,Select,Option,Form,FormItem,Input,Card,Message} from 'element-ui'
  export default {
    name: "Search",
    props: {
      adsId:Number
    },
    data() {
      return {
        selectedPosition:"",
        materialName:"",
        adsenses:[],
      };
    },
    components:{
      'ElButton':Button,
      'ElForm':Form,
      'ElFormItem':FormItem,
      'ElInput':Input,
      'ElSelect':Select,
      'ElOption':Option,
      'ElCard':Card
    },
    methods: {
      handleChangeAdsense(){

      },
      getAdsenses(){
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
                  positionName:positionName+'（'+size+';'+materialType+'）'
                }
              )
              this.adsenses = adsenses;
            });
          }
        })
      },
      onSubmit(pageSize,pageNum) {
        //进行数据请求，得到table数据
        const size = pageSize||8;
        const num = pageNum||1;
        let url = '/ads-op/material?pageNum='+num+'&pageSize='+size+'&adsId='+this.adsId;
        if(this.materialName && this.materialName!==""){
          url = url+"&materialName="+this.materialName;
        }
        if(this.selectedPosition && this.selectedPosition!==""){
          url = url+"&positionId="+this.selectedPosition;
        }
        request({
          url,
          method: 'get'
        }).then(respData=>{
          const data2 = respData.data;
          const {data,success,message} = data2;
          if(success){
            const listData = data.list;
            listData.map(item=>{
              let {ageTags,sexTags,positionWidth,positionHeight,positionFormatCodes,positionName} = item;
              let ageLabel = "";
              let ageTagsArray = [];
              let genderLabel = "";
              let sexTagsArray = [];
              let adsenseName = "";
              let materialType = "";
              if(positionFormatCodes){
                positionFormatCodes.map((ad,index) =>{
                  materialType += ad;
                  if(index<positionFormatCodes.length-1){
                    materialType += "、";
                  }
                })
              }

              positionName = positionName?positionName:"";
              positionWidth = positionWidth?positionWidth+"x":"";
              positionHeight = positionHeight?positionHeight+"；":"";
              materialType = materialType?materialType:"";

              adsenseName = positionName +"（"+positionWidth+positionHeight+materialType +"）"
              ageTags.map((ad,index) =>{
                ageLabel += ad.tagName;
                if(index<ageTags.length-1){
                  ageLabel += "、";
                }
                ageTagsArray.push(ad.tagId)
              })
              sexTags.map((ad,index) =>{
                genderLabel += ad.tagName;
                if(index<sexTags.length-1){
                  genderLabel += "、";
                }
                sexTagsArray.push(ad.tagId)
              });
              // let materialUrl = item.materialUrl;
              // item.materialUrl = require(materialUrl);
              item.ageLabel = ageLabel;
              item.ageTagsArray = ageTagsArray;
              item.genderLabel = genderLabel;
              item.sexTagsArray = sexTagsArray;
              item.adsenseName = adsenseName;
            });
            const passData = {
              total: data.total,
              datasouce: listData
            };
            this.$emit("setData", passData);
          }
          else{
            Message({
              message:message,
              type: 'error'
            });
          }
        })
        const passData = {
          total: 1000,
        };
        this.$emit("setData", passData);
      }
    },
    mounted: function() {
      this.onSubmit(10, 1);
      this.getAdsenses();
    }
  };
</script>

<style scoped>
.box-card {
  width: 100%;
}
</style>
