const accountManage = {
  state: {
    accountType: [
      {label: "管理员", value: "ADMIN"},
      {label: "运营", value: "OP"},
    ],
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    accountType: state => state.accountType,
  }
};

export default accountManage
