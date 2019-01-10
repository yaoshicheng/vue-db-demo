<template>
  <div class="app-container">
    <Search v-show="false" ref='searchcom' @setData='setData' v-bind:adsId = "adsId"/>
    <Table @hindSearch='hindSearch' v-bind:tabledata="tabledata" v-bind:total="total" v-bind:adsId = "adsId"/>
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
      tabledata: [],
      total: 0,
      adsId:0,
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
  mounted(){
    // console.log(window)
  },
  created(){
    if(this.$route.query.adsId){
      this.adsId = Number(this.$route.query.adsId);
    }
  }
};
</script>
