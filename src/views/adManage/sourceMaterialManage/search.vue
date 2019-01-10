<template>
    <el-card class="box-card">
        <!--<el-form :inline="true" :model="formInline" class="demo-form-inline" ref='formInline'>-->
            <el-form-item label="素材名称">
                <el-input v-model="materialName" type="text" auto-complete="off" class='form-input materialName'></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit(10,1)">查询</el-button>
            </el-form-item>
        <!--</el-form>-->
    </el-card>
</template>

<script>
  import request from '@/utils/request'
  import {Button,Form,FormItem,Input,Card,Message} from 'element-ui'
export default {
  name: "Search",
  components:{
    'ElButton':Button,
    'ElForm':Form,
    'ElFormItem':FormItem,
    'ElInput':Input,
    'ElCard':Card
  },
  props: {
    adsId:Number
  },
  data() {
    return {
      formInline: {
        region1: "",
        region2: "",
        region3: ""
      },
      materialName:"",
    };
  },
  methods: {
    onSubmit(pageSize,pageNum) {
      //进行数据请求，得到table数据
      const size = pageSize||10;
      const num = pageNum||1;
      let url = '/ads-op/ads/bindMaterials?pageNum='+num+'&pageSize='+size+'&adsId='+this.adsId;
      request({
        url,
        method: 'get'
      }).then(respData=>{
        const data2 = respData.data;
        const {data,success,message} = data2;
        if(success){
          const listData = data.list;
          if(listData && listData.length>0){
            listData.map(item=>{
              let {ageTags,sexTags,positionWidth,positionHeight} = item;
              let ageLabel = "";
              let ageTagsArray = [];
              let genderLabel = "";
              let adsenseName = "";
              let sexTagsArray = [];

              if(ageTags && ageTags.length>0){
                ageTags.map((ad,index) =>{
                  ageLabel += ad.tagName;
                  if(index<ageTags.length-1){
                    ageLabel += "、";
                  }
                  ageTagsArray.push(ad.tagId)
                })
              }
              positionWidth = positionWidth?positionWidth+"x":"";
              positionHeight = positionHeight?positionHeight:"";
              adsenseName = positionWidth+positionHeight
              if(sexTags && sexTags.length>0){
                sexTags.map((ad,index) =>{
                  genderLabel += ad.tagName;
                  if(index<sexTags.length-1){
                    genderLabel += "、";
                  }
                  sexTagsArray.push(ad.tagId)
                });
              }
              item.ageLabel = ageLabel;
              item.ageTagsArray = ageTagsArray;
              item.genderLabel = genderLabel;
              item.sexTagsArray = sexTagsArray;
              item.adsenseName =adsenseName;
            });
          }
          const passData = {
            total: data.total,
            datasouce: listData
          };
          this.$emit("setData", passData);
        }else{
          Message({
            message:message,
            type: 'error'
          });
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
