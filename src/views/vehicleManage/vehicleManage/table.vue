<template>
    <el-card class="box-card">
        <template>
            <div slot="header" class="clearfix">
                <span>{{$t('vehicleManage.carList')}}</span>
                <el-button class="addBtn" style="float: right;" type="primary" @click="handleClicktoadd" >{{$t('common.add')}}</el-button>
            </div>
            <el-table
                :data="tabledata"
                stripe
                style="width: 100%">
                <el-table-column
                prop="carName"
                :label="$t('vehicleManage.carName')"
                >
                </el-table-column>
                <el-table-column
                  prop="code"
                  :label="$t('vehicleManage.carCode')"
                >
                </el-table-column>
                <el-table-column
                prop="carNumber"
                :label="$t('vehicleManage.carNumber')"
                >
                </el-table-column>
                <el-table-column
                prop="cityName"
                :label="$t('vehicleManage.opCity')"
                >
                </el-table-column>
                <el-table-column
                prop="operationRoute"
                :label="$t('vehicleManage.opRoute')">
                </el-table-column>
                <el-table-column
                prop="adsNameTotal"
                :label="$t('vehicleManage.adMaterial')">
                </el-table-column>
                <el-table-column :label="$t('vehicleManage.operation')">
                     <template slot-scope="scope">
                        <el-button type="text" size="small" class="editBtn" @click="handleEdit(scope.row)">{{$t('common.edit')}}</el-button>
                        <el-button type="text" size="small" class="deleteBtn" @click="handleDelete(scope.row)">{{$t('common.delete')}}</el-button>
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
            :title="$t('vehicleManage.addNewCar')"
            :visible.sync="showAddModal"
            width="600px"
            class="addModal"
        >
            <add @setData='setData' @handleCloseAddModal='handleCloseAddModal'></add>
        </el-dialog>
        <el-dialog
          :title="$t('vehicleManage.editCar')"
          :visible.sync="showEditModal"
          width="600px"
          class="editModal"
        >
          <edit v-bind:vehicleInfo="editVehicleInfo" @setData='setData' @handleCloseEditModal='handleCloseEditModal'></edit>
        </el-dialog>
    </el-card>
</template>

<script>
  import {deleteCar} from '@/api/vehicleManage'
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
        showEditModal:false,
        editVehicleInfo:{},
        currentPage:1,
      }
    },
    components: {
      Add, Edit,
    },
    methods: {
      setData(){
        this.$emit("hindSearch", 10, this.currentPage);
        this.showEditModal = false;
        this.showAddModal = false;
      },
      handleEdit(record) {
        this.showEditModal = !this.showEditModal;
        this.editVehicleInfo = record;
      },
      handleClicktoadd() {
        this.showAddModal = !this.showAddModal;
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
        const carId = record.carId;
        this.$confirm(that.$t('common.confirmMsg'), that.$t('common.sureDelete'), {
          distinguishCancelAndClose: true,
          confirmButtonText: that.$t('common.yes'),
          cancelButtonText: that.$t('common.no'),
          type: "warning"
        })
        .then(() => {
          // 删除数据
          deleteCar({carId: carId}).then(function (respData) {
            if(respData.data.success){
              that.$message(that.$t('vehicleManage.deleteSucceed'));
            }
            that.$emit("hindSearch", 10, that.currentPage);
          });
        }).catch(() => {});
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
