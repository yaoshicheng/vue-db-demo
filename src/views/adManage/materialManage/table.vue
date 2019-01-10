<template>
  <el-card class="box-card">
    <template>
      <div slot="header" class="clearfix">
        <span>广告物料列表</span>
        <el-button style="float: right;" type="primary" @click="handleClicktoadd" class="addBtn">新建广告物料</el-button>
      </div>
      <el-table
        :data="tabledata"
        stripe
        style="width: 100%">
        <el-table-column
          prop="adsName"
          label="广告物料"
        >
        </el-table-column>
        <el-table-column
          prop="positionLabel"
          label="广告位"
        >
        </el-table-column>
        <el-table-column
          prop="materialCount"
          label="素材数"
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
            <el-button type="text" size="small" @click="handleShowDetail(scope.row)" class="detailBtn">详情</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row)" class="editBtn">编辑</el-button>
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
      title="新建广告物料"
      :visible.sync="showAddModal"
      width="600px"
      class="addModal"
    >
      <add @setData='setData' @handleCloseAddModal='handleCloseAddModal'></add>
    </el-dialog>
    <el-dialog
      title="编辑广告物料"
      :visible.sync="showEditModal"
      width="600px"
    >
      <edit v-bind:passInfo="passInfo" @setData='setData' @handleCloseEditModal='handleCloseEditModal'></edit>
    </el-dialog>
  </el-card>
</template>

<script>
  import request from '@/utils/request'
  import {Button,TableColumn,Table,Input,Card,Pagination,Dialog} from 'element-ui'
  import Add from "./add.vue";
  import Edit from "./edit.vue";

  export default {
    name: "Table",
    props: {
      tabledata: Array,
      total: Number,
    },
    data() {
      return {
        showAddModal: false,
        showEditModal: false,
        passInfo: {},
        currentPage:1,
      }
    },
    components: {
      Add, Edit,
      'ElButton':Button,
      'ElTable':Table,
      'ElTableColumn':TableColumn,
      'ElInput':Input,
      'ElCard':Card,
      'ElPagination':Pagination,
      'ElDialog':Dialog
    },
    methods: {
      setData(){
        this.$emit("hindSearch", 10, this.currentPage);
        this.showEditModal = false;
        this.showAddModal = false;
      },
      handleClicktoadd() {
        this.showAddModal = !this.showAddModal;
      },
      handleShowDetail(record){
        const adsId = record.adsId
        this.$router.push('/adCast/sourceMaterial?adsId='+adsId);
      },
      handleEdit(record) {
        this.passInfo = record
        this.showEditModal = !this.showEditModal;
      },
      handleCloseAddModal(){
        this.showAddModal = !this.showAddModal;
      },
      handleCloseEditModal(){
        this.showEditModal = !this.showEditModal;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.$emit("hindSearch", 10, val);
      },
      handleDelete(record) {
        const that = this;
        const adsId = record.adsId;
        this.$confirm("是否确认删除?", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
        .then(() => {
          request({
            url: '/ads-op/ads',
            method: 'delete',
            data:{
              adsId: adsId,
            }
          }).then(function (respData) {
            if(respData.data.success){
              that.$message('删除广告物料成功！');
              that.$emit("hindSearch", 10, that.currentPage);
            }
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
