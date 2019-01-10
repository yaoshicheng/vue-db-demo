<template>
  <el-card class="box-card">
    <template>
      <div slot="header" class="clearfix">
        <el-button style="float: right;" type="primary" @click="handleClicktoadd" class="addBtn">新建模块</el-button>
      </div>
      <el-table
        :data="tabledata"
        stripe
        style="width: 100%">
        <el-table-column
          prop="order"
          label="模块顺序"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="模块名称"
        >
        </el-table-column>
        <el-table-column
          prop="weight"
          label="模块权重"
        >
        </el-table-column>
        <el-table-column
          prop="positionSize"
          label="预览"
        >
          <template slot-scope="scope">
            <div class="imgContainer" style="width: 150px;height: 100px">
              <img :src="scope.row.imageUrl" class="img" alt="模块封面"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="videoCount"
          label="视频数量"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
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
      :current-page="currentPage"
      :total="total">
    </el-pagination>
    <el-dialog
      title="新建模块"
      :visible.sync="showAddModal"
      width="600px"
      class="addModal"
    >
      <add v-bind:total="10" @setData='setData' @handleCloseAddModal='handleCloseAddModal'></add>
    </el-dialog>
    <el-dialog
      title="编辑模块"
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
      }
    },
    // computed: {
    //   currentPage:function () {
    //     return this.$store.state.moduleManage.currentModulePage||1
    //   }
    // },
    filters:{
      changeImage(value){
        return (value)
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
    mounted(){
      this.currentPage = this.$store.state.moduleManage.currentModulePage||1;
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
      handleShowDetail(record){
        const moduleId = record.id
        this.$router.push('/videoManage/videoLibrary?moduleId='+moduleId);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.$store.dispatch('changePage',{currentPage:val});
        this.$emit("hindSearch", 10, val);
      },
      handleDelete(record) {
        const that = this;
        const id= record.id;
        this.$confirm("是否确认删除?", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
          .then(() => {
            request({
              url: '/ads-op/module-video-summary',
              method: 'delete',
              data:{
                id: id,
              }
            }).then(function (respData) {
              if(respData.data.success){
                that.$message('删除模块成功！');
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
  .imgContainer{
    width: 150px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img{
    max-width: 100%;
    max-height: 100%;
  }
</style>
