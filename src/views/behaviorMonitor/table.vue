<template>
    <el-card class="box-card">
        <template>
            <el-table
                :data="tabledata"
                stripe
                style="width: 100%">
                <el-table-column
                prop="behaviorType"
                label="事件类型"
                >
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.behaviorType=="0"?"吸烟":(scope.row.behaviorType=="1"?"偷盗":"摔倒") }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="carName"
                  label="发生车辆"
                >
                </el-table-column>
                <el-table-column
                prop="cameraCode"
                label="相机编号"
                >
                </el-table-column>
                <el-table-column
                prop="createTime"
                :formatter="timestampToTime"
                label="发生时间">
                </el-table-column>
                <el-table-column
                prop="operationRoute"
                label="时间图片">
                  <template slot-scope="scope">
                    <div class="imgContainer">
                      <img :src="scope.row.imageUrl" class="img" />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                prop="adsNameTotal"
                label="事件录像">
                  <template slot-scope="scope">
                    <video :src="scope.row.videoUrl" width="150" height="100" controls="controls"></video>
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
    </el-card>
</template>

<script>
  // import request from '@/utils/request'
  import {Button,Table,TableColumn,Input,Card,Dialog,Pagination} from 'element-ui'
  export default {
    name: "Table",
    props: {
      tabledata: Array,
      total: Number,
    },
    data() {
      return {
        showAddModal: false,
        showEditModal:false,
        editVehicleInfo:{},
        currentPage:1,
        imgUrl:require("./slide.png"),
        videoUrl:"https://media.quixmart.com/acbadce7-0533-42f7-b27e-ca24855ef1ec.mp4"
      }
    },
    components: {
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
      handleCurrentChange(val) {
        this.currentPage = val;
        this.$emit("hindSearch", 10, val);
      },
      timestampToTime (row) {
        var date = new Date(row.createTime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
        var D = date.getDate() + ' '
        var h = date.getHours() + ':'
        var m = date.getMinutes() + ':'
        var s = date.getSeconds()
        return Y+M+D+h+m+s
      },
    }
  };
</script>

<style scoped>
.box-card {
  width: 100%;
  margin-top: 30px;
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
