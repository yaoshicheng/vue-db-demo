<template>
  <div class="app-container">
    <Search ref='searchcom' @setData='setData' v-bind:moduleId = "moduleId" />
    <Table @hindSearch='hindSearch' v-bind:tabledata="tabledata" v-bind:total="total" v-bind:moduleId = "moduleId"/>
  </div>
</template>

<script>
import Search from "./search.vue";
import Table from "./table.vue";
export default {
  name: "Robat",
  components: { Search, Table },
  data() {
    return {
      moduleId:"",
      tabledata: [],
      total: 0
    };
  },
  methods: {
    hindSearch(limit, current) {
      this.$refs.searchcom.onSubmit(limit, current);
    },
    setData(data) {
      this.tabledata = data.datasouce;
      this.total = data.total;
    }
  },
  created(){
    if(this.$route.query.moduleId){
      this.moduleId = Number(this.$route.query.moduleId);
    }
  }
};
</script>
