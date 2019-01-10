<template>
  <el-card class="box-card">
    <template>
      <div slot="header" class="clearfix">
        <el-button style="float: right;" type="primary" @click="handleClicktoadd" class="addBtn">上传视频</el-button>
      </div>
      <el-table
        :data="tabledata"
        stripe
        style="width: 100%">
        <el-table-column
          prop="order"
          label="播放顺序"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="视频名称"
        >
        </el-table-column>

        <el-table-column
          prop="videoUrl"
          label="预览"
        >
          <template slot-scope="scope">
            <video :src="scope.row.videoUrl" width="150" height="100" controls="controls"></video>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="videoLength"-->
        <!--label="视频时长"-->
        <!--&gt;-->
        <!--</el-table-column>-->
        <el-table-column
          prop="videoFormat"
          label="视频格式"
        >
        </el-table-column>
        <el-table-column
          prop="exposureCount"
          label="播放次数"
        >
        </el-table-column>
        <el-table-column
          prop="weight"
          label="播放权重"
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
      :current-page="currentPage"
      :total="total">
    </el-pagination>
    <el-dialog
      title="上传视频"
      :visible.sync="showAddModal"
      width="600px"
      class="addModal"
    >
      <add v-bind:moduleId="moduleId" @setData='setData' @handleCloseAddModal='handleCloseAddModal'></add>
    </el-dialog>
    <el-dialog
      title="编辑视频"
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
      moduleId:Number
    },
    data() {
      return {
        showAddModal: false,
        showEditModal: false,
        passInfo: {},
        currentPage:1,
        videoUrl:"https://media.quixmart.com/acbadce7-0533-42f7-b27e-ca24855ef1ec.mp4"
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
      handleShowDetail(record){
        const adsId = record.adsId
        this.$router.push('/videoManage/videoLibrary?adsId='+adsId);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
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
              url: '/ads-op/module-video-detail',
              method: 'delete',
              data:{
                id: id,
              }
            }).then(function (respData) {
              if(respData.data.success){
                that.$message('删除视频成功！');
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
