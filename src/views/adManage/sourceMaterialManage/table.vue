<template>
  <el-card class="box-card">
    <template>
      <div slot="header" class="clearfix">
        <span>素材列表</span>
        <el-button style="float: right;" type="primary" @click="handleClicktoadd" class="addBtn">添加素材</el-button>
      </div>
      <el-table
        :data="tabledata"
        stripe
        style="width: 100%">
        <el-table-column
          prop="materialName"
          label="素材名称"
        >
        </el-table-column>
        <el-table-column label="预览" width="300">
          <template slot-scope="scope">
            <video :src="scope.row.materialUrl" width="260" height="130" controls="controls"></video>
          </template>
        </el-table-column>
        <el-table-column
          prop="adsenseName"
          label="素材尺寸"
        >
        </el-table-column>
        <el-table-column
          prop="genderLabel"
          label="性别标签"
        >
        </el-table-column>
        <el-table-column
          prop="ageLabel"
          label="年龄标签"
        >
        </el-table-column>
        <el-table-column
          prop="exposureCount"
          label="曝光总数（千次）"
        >
        </el-table-column>
        <el-table-column
          prop="viewCount"
          label="观看数"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDelete(scope.row)" class="deleteBtn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination
      class="table-pagination"
      background
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
    <el-dialog
      title=""
      :modal=false
      :visible.sync="showAddModal"
      width="95%"
      top="1vh"
      append-to-body
      class="addModal"
    >
      <material-library v-bind:adsId="adsId"></material-library>
    </el-dialog>
  </el-card>
</template>

<script>
  import request from '@/utils/request'
  import {Button,Table,TableColumn,Input,Card,Dialog,Pagination} from 'element-ui'
  import MaterialLibrary from "../materialLibrary/index";

  export default {
    name: "Table",
    props: {
      tabledata: Array,
      total: Number,
      adsId:Number
    },
    data() {
      return {
        showAddModal: false,
        showEditModal: false,
        passInfo: {},
      }
    },
    components: {
      MaterialLibrary,
      'ElButton':Button,
      'ElTable':Table,
      'ElTableColumn':TableColumn,
      'ElInput':Input,
      'ElCard':Card,
      'ElDialog':Dialog,
      'ElPagination':Pagination
    },
    methods: {
      handleClicktoadd() {
        this.passInfo = {
          materialName: "",
          materialPic: "",
          materialSize: "",
          genderLabel: [],
          ageLabel:[],
        };
        // this.showAddModal = !this.showAddModal;
        this.$router.push('/adCast/materialLibrary?adsId='+this.adsId);
      },
      handleCurrentChange(val) {
        this.$emit("hindSearch", 10, val);
      },
      handleDelete(record) {
        const that = this;
        const materialId = record.materialId
        this.$confirm("是否确认删除?", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
        .then(() => {
          request({
            url: '/ads-op/ads/unbindMaterial',
            method: 'post',
            data:{
              adsId:that.adsId,
              materialId:materialId
            }
          }).then(function (respData) {
              if(respData.data.success){
                that.$message('删除素材成功！');
              }
              that.$emit("hindSearch", 10, 1);
            });
        })
        .catch(() => {
        });
      }
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
</style>
