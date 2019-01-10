const moduleManage = {
  state: {
    currentModulePage:1,
    currentVideoPage:1,
  },
  mutations: {
    SET_PAGE: (state, currentPage) => {
      state.currentModulePage = currentPage
    },
    SET_VIDEO_PAGE: (state, currentPage) => {
      state.currentVideoPage = currentPage
    },
  },
  actions: {
    changePage({ commit }, { currentPage }) {
      commit('SET_PAGE', currentPage)
    },
    changeVideoPage({ commit }, { currentPage }) {
      commit('SET_VIDEO_PAGE', currentPage)
    },
  },
  getters: {
    currentPage: state => state.currentPage,
  }
};

export default moduleManage
