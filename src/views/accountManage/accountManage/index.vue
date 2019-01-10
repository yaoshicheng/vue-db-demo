<template>
  <div class="app-container">
    <Search ref='searchcom' @setData='setData'/>
    <Table @hindSearch='hindSearch' v-bind:tabledata="tabledata" v-bind:total="total"/>
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
    }
  };
</script>
