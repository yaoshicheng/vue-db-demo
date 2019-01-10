<template>
  <el-card class="box-card">
    <template>
      <div slot="header" class="clearfix">
        <span>账号列表</span>
        <el-button style="float: right;" type="primary" @click="handleClicktoadd" >新建账号</el-button>
      </div>
      <el-table
        :data="tabledata"
        stripe
        style="width: 100%">
        <el-table-column
          prop="mobile"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="userInfoType"
          label="账号类型"
        >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.userInfoType=="ADMIN"?"管理员":"运营" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-dialog
      title="新建账号"
      :visible.sync="showAddModal"
      width="600px"
    >
      <add v-bind:accountInfo="accountInfo" @setData='setData' @handleCloseAddModal='handleCloseAddModal'></add>
    </el-dialog>
    <el-dialog
      title="编辑账号"
      :visible.sync="showEditModal"
      width="600px"
    >
      <edit v-bind:accountInfo="accountInfo" @setData='setData' @handleCloseEditModal='handleCloseEditModal'></edit>
    </el-dialog>
  </el-card>
</template>

<script>
  import request from '@/utils/request'
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
        showEditModal:false,
        accountInfo:{},
      }
    },
    components: {
      Add, Edit,
    },
    methods: {
      setData(){
        this.$emit("hindSearch");
        this.showEditModal = false;
        this.showAddModal = false;
      },
      handleCloseAddModal(){
        this.showAddModal = !this.showAddModal;
      },
      handleCloseEditModal(){
        this.showEditModal = !this.showEditModal;
      },
      handleClicktoadd() {
        this.accountInfo = {
          mobile:"",
          userInfoType:"",
        };
        this.showAddModal = !this.showAddModal;
      },
      handleEdit(record) {
        this.accountInfo = {
          mobile:record.mobile,
          userInfoType:record.userInfoType,
        };
        this.showEditModal = !this.showEditModal;
      },
      handleCurrentChange(val) {
        this.$emit("hindSearch", 10, val);
      },
      handleDelete(record) {
        const that = this;
        this.$confirm("是否确认删除?", "确认信息", {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
          .then(() => {
            request({
              url: '/ads-op/user',
              method: 'delete',
              data:{
                mobile: record.mobile,
              }
            }).then(function (respData) {
              if(respData.data.success){
                that.$message('删除用户成功！');
              }
              // 重新搜索
              that.$emit("hindSearch");
            });
          })
          .catch(() => {});
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
