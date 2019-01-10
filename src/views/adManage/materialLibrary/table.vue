<template>
  <div>
    <el-card class="box-card">
      <template>
        <div slot="header" class="clearfix">
          <span>素材库</span>
          <el-button style="float: right;" type="primary" @click="handleClicktoadd" class="addBtn">新建素材</el-button>
        </div>
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in tabledata" :key="item.materialId"
                  style="margin: 15px 0px;display: flex;height: 330px;overflow-x: hidden;overflow-y: auto">
            <div class="grid-content bg-purple">
              <video :src=item.materialUrl class="video" controls="controls"></video>
              <div class="labelAndBtn">
                <el-checkbox :disabled=item.bind :checked=item.bind @change="changeSelectedMaterial" :label=item.materialId border>{{item.materialName}}</el-checkbox>
                <el-button value=item.materialId
                           style="margin-left:10px" type="danger" labelAndBtn="mini" icon="el-icon-delete"
                           @click = "()=>handleDelete(item.materialId)" class="deleteBtn"
                ></el-button>
              </div>
              <div class="label">
                {{item.adsenseName}}
              </div>
              <div class="label">
                性别标签：{{item.genderLabel}}
              </div>
              <div class="label">
                年龄标签：{{item.ageLabel}}
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <el-row style="display: flex;align-items: center;margin: 30px 0px">
        <el-col :span="4">选中素材：{{selectedMaterial}}条</el-col>
        <el-col :span="20">
          <el-pagination
            class="table-pagination"
            style="margin-top: 0px"
            background
            layout="prev, pager, next, jumper"
            :page-size=8
            @current-change="handleCurrentChange"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>

      <el-dialog
        title="新建素材"
        :visible.sync="showAddModal"
        width="600px"
        class="addModal"
      >
        <add v-bind:passInfo="passInfo" @setData='setData' @handleCloseAddModal='handleCloseAddModal'></add>
      </el-dialog>
      <el-dialog
        title="编辑素材"
        :visible.sync="showEditModal"
        width="600px"
      >
        <edit v-bind:passInfo="passInfo" @setData='setData' @handleCloseEditModal='handleCloseEditModal'></edit>
      </el-dialog>
    </el-card>
    <div class="btn-sub">
      <el-button type="primary" @click="addMaterial">添加</el-button>
      <el-button @click="handleCancle">取消</el-button>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {Button,Table,TableColumn,Input,Card,Dialog,Pagination} from 'element-ui'
  import Add from "./add.vue";

  export default {
    name: "Robattable",
    props: {
      tabledata: Array,
      total: Number,
      adsId:Number
    },
    data() {
      return {
        showAddModal: false,
        showEditModal: false,
        selectedMaterial:0,
        passInfo: {},
        materials:[],
      }
    },
    components: {
      Add,
      'ElButton':Button,
      'ElTable':Table,
      'ElTableColumn':TableColumn,
      'ElInput':Input,
      'ElCard':Card,
      'ElDialog':Dialog,
      'ElPagination':Pagination
    },
    methods: {
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
                  positionName:positionName+'（'+size+';'+materialType+'）'
                }
              )
              that.adsenses = adsenses;
            });
          }
        })
      },
      addMaterial(){
        const that = this;
        request({
          url: '/ads-op/ads/bindMaterial',
          method: 'post',
          data:{
            "adsId": this.adsId,
            "materialIds": this.materials
          }
        }).then(function (respData) {
          if(respData.data.success){
            that.$message('绑定素材成功！');
          }
          that.$router.back();
          // 重新搜索
          that.$emit("hindSearch", 8, 1);

        });

      },
      handleCancle(){
        this.$router.back();
      },
      handleDelete(value){
        const that =this;
        const materialId = value;
        this.$confirm("是否确认删除?", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
        .then(() => {
          request({
            url: '/ads-op/material',
            method: 'delete',
            data:{
              materialId:materialId,
            }
          }).then(function (respData) {
              if(respData.data.success){
                that.$message('删除素材成功！');
              }
            // 重新搜索
              that.$emit("hindSearch", 8, 1);
            });
        })
        .catch(() => {
        });
      },
      changeSelectedMaterial(value,e){
        const value1 = e.target.value;
        if(value){
          if(!this.materials.includes(value1)){
            this.materials.push(value1)
          }
        }else{
          if(this.materials.includes(value1)){
            this.materials = this.materials.filter(x => x!==value1) // ['a','b']
          }
        }
        this.selectedMaterial = this.materials.length
      },
      setData(){
        this.$emit("hindSearch", 8, 1);
      },
      handleClicktoadd() {
        this.showAddModal = !this.showAddModal;
      },
      handleEdit(record) {
        this.passInfo = record;
        this.showEditModal = !this.showEditModal;
      },
      handleCurrentChange(val) {
        this.$emit("hindSearch", 8, Number(val));
      },
      handleCloseAddModal(){
        this.showAddModal = !this.showAddModal;
      },
      handleCloseEditModal(){
        this.showEditModal = !this.showEditModal;
      },
    },
    mounted(){
      this.getAdsenses();
    }
  };
</script>

<style scoped>
  .box-card {
    width: 100%;
    margin-top: 30px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .table-pagination {
    margin-top: 30px;
    text-align: center;
  }
  .labelAndBtn{
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .video{
    width:100%;
    height: 150px;
  }
  .label{
    display:flex;
    padding: 5px 0px;
    align-items: center;
    width: 100%;
    min-height:26px
  }
  .el-checkbox__inner{
    width:30px!important;
    height: 30px!important;
  }
  .btn-sub {
    margin-top: 30px;
    text-align: center;
    margin-bottom: 30px;
  }
</style>
