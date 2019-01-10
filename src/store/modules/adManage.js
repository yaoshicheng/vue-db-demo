const adManage = {
  state: {
    materialType: [
      {label: "MP4", value: "MP4"},
      {label: "FLV", value: "FLV"},
    ],
    genderType: [
      { tagName: "男",tagId: 1},
      { tagName: "女",tagId: 2},
    ],
    ageType: [
      {tagName: "幼年", tagId: 3},
      {tagName: "少年", tagId: 4},
      {tagName: "青年", tagId: 5},
      {tagName: "中年", tagId: 6},
      {tagName: "老年", tagId: 7},
    ],
    adType: [
      {value: 1, label: "公交小屏（1920x1080;mp4、flv）"},
      {value: 2, label: "问路大屏（3000x1500;mp4、flv）"},
    ],
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    materialType: state => state.materialType,
    genderType: state => state.genderType,
    ageType: state => state.ageType,
    adType: state => state.adType,
  }
};

export default adManage
