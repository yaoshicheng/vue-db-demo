const vehicleManage = {
  state: {
    city: [
      {label: "上海", value: "1"},
      {label: "北京", value: "2"},
    ],
    material:[
      {label: "物料1", value: "1"},
      {label: "物料2", value: "2"},
      {label: "物料3", value: "3"},
      {label: "物料4", value: "4"},
    ]
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    city: state => state.city,
    material: state => state.material,
  }
};

export default vehicleManage
