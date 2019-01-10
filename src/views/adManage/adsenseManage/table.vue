<template>
  <el-card class="box-card">
    <template>
      <div slot="header" class="clearfix">
        <span>广告位列表</span>
        <el-button style="float: right;" type="primary" @click="handleClicktoadd" class="addBtn">新建广告位</el-button>
      </div>
      <el-table
        :data="tabledata"
        stripe
        style="width: 100%">
        <el-table-column
          prop="positionId"
          label="广告位ID"
        >
        </el-table-column>
        <el-table-column
          prop="positionName"
          label="广告位名称"
        >
        </el-table-column>
        <el-table-column
          prop="positionSize"
          label="广告位尺寸"
        >
        </el-table-column>
        <el-table-column
          prop="materialType"
          label="物料格式"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
      title="新建广告位"
      :visible.sync="showAddModal"
      width="600px"
      class="addModal"
    >
      <add v-bind:passInfo="passInfo" @setData='setData' @handleCloseAddModal='handleCloseAddModal'></add>
    </el-dialog>
    <el-dialog
      title="编辑广告位"
      :visible.sync="showEditModal"
      width="600px"
      class="editModal"
    >
      <edit v-bind:passInfo="passInfo" @setData='setData' @handleCloseEditModal='handleCloseEditModal'></edit>
    </el-dialog>
  </el-card>
</template>

<script>
  import request from '@/utils/request'
  import {Button,Table,TableColumn,Input,Card,Dialog,Pagination} from 'element-ui'
  import Add from "./add.vue";
  import Edit from "./edit.vue";

  export default {
    name: "Robattable",
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
      'ElDialog':Dialog,
      'ElPagination':Pagination
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
      handleEdit(record) {
        this.passInfo = record;
        this.showEditModal = !this.showEditModal;
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.$emit("hindSearch", 10, val);
      },
      handleDelete(record) {
        const that = this;
        const positionId= record.positionId;
        this.$confirm("是否确认删除?", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
        .then(() => {
          request({
            url: '/ads-op/position',
            method: 'delete',
            data:{
              positionId: positionId,
            }
          }).then(function (respData) {
              if(respData.data.success){
                that.$message('删除广告位成功！');
              }
            // 重新搜索
            that.$emit("hindSearch", 10, that.currentPage);
            });

        })
        .catch(() => {
        });
      },
      handleCloseAddModal(){
        this.showAddModal = !this.showAddModal;
      },
      handleCloseEditModal(){
        this.showEditModal = !this.showEditModal;
      },
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
