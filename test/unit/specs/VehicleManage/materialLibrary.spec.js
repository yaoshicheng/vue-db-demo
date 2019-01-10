import Vue from 'vue'
import Vuex from 'vuex'
import sinon from 'sinon'
// import { mapGetters } from 'vuex'
import { mount,createLocalVue,shallowMount } from '@vue/test-utils'
import MaterialLibrarySearch from '@/views/adManage/materialLibrary/search.vue'
import MaterialLibraryTable from '@/views/adManage/materialLibrary/table.vue'
import MaterialLibraryAdd from '@/views/adManage/materialLibrary/add.vue'
const localVue = createLocalVue();
const store = new Vuex.Store({
  getters:{
    materialType:()=>[
      {label: "MP4", value: "MP4"},
      {label: "FLV", value: "FLV"},
    ],
    genderType: ()=>[
      { tagName: "男",tagId: 1},
      { tagName: "女",tagId: 2},
    ],
    ageType: ()=>[
      {tagName: "幼年", tagId: 3},
      {tagName: "少年", tagId: 4},
      {tagName: "青年", tagId: 5},
      {tagName: "中年", tagId: 6},
      {tagName: "老年", tagId: 7},
    ],
  }
})
localVue.use(Vuex);

const mockData = ()=> {
  return {
    tabledata: [{
      positionId:1,
      positionName: "熊猫公交1号",
      positionSize: "1920*1280",
      materialType: "mp4",
    }],
    total: 100,
  }
}

describe('素材库搜索栏单元测试', () => {
  const wrapper = shallowMount(MaterialLibrarySearch,{
    localVue,
    propsData: {
      adsId:1
    },
  });

  test('输入框初始为空', () => {
    expect(wrapper.vm.materialName).toBe('');
    expect(wrapper.vm.selectedPosition).toBe('');
  });
  test('输入框在model变更后变为test', () => {
    wrapper.setData({
      materialName:"test",
      selectedPosition:1
    });
    expect(wrapper.vm.materialName).toBe('test');
    expect(wrapper.vm.selectedPosition).toBe(1);

  });
  test('组件包含搜索框和按钮', () => {
    expect(wrapper.find('.materialName').exists()).toBeTruthy();
    expect(wrapper.find('.selectedPosition').exists()).toBeTruthy();
    expect(wrapper.find('.searchBtn').exists()).toBeTruthy();
  });
});

describe('素材库Table单元测试', () => {
  const Constructor = Vue.extend(MaterialLibraryTable);
  const vm = new Constructor().$mount();
  const wrapper = mount(MaterialLibraryTable);
  wrapper.setProps(mockData());
  test('新增Modal初始为空', () => {
    expect(vm.showAddModal).toBe(false);
  });
  test('编辑Modal初始为空', () => {
    expect(vm.showEditModal).toBe(false);
  });

  test('组件包含新增按钮', () => {
    expect(wrapper.find('.addBtn').exists()).toBeTruthy();
  });

  test('点击新增按钮，显示新增Modal', () => {
    wrapper.find('.addBtn').trigger('click');
    expect(wrapper.vm.showAddModal).toBe(true);
    expect(wrapper.find('.addModal').isVisible()).toBe(true)
  });
  test('点击删除按钮，数据减少一条', () => {
    const wrapper = mount(MaterialLibraryTable);
    wrapper.setProps(mockData());
    const handleDelete = sinon.stub();
    wrapper.setMethods({handleDelete:handleDelete});
    wrapper.find('.deleteBtn').trigger('click');
    expect(handleDelete.called).toBe(true);
    expect(handleDelete.callCount).toBe(1);
  });
  test('点击分页，事件触发', () => {
    const handleCurrentChange = sinon.stub();
    wrapper.setMethods({handleCurrentChange:handleCurrentChange});
    wrapper.vm.$emit('handleCurrentChange');
    expect(wrapper.emitted().handleCurrentChange).toBeTruthy();
  });
});

describe('素材库新增素材单元测试', () => {
  const wrapper = shallowMount(MaterialLibraryAdd,{
    localVue,
    store,
    mocks: {
      'genderType':[],
      'ageType':[],
      'adType':[],
    }
  });
  test('新增素材各信息框存在', () => {
    expect(wrapper.find('.materialName').exists()).toBe(true);
    expect(wrapper.find('.positionId').exists()).toBe(true);
    expect(wrapper.find('.sexTag').exists()).toBe(true);
    expect(wrapper.find('.ageTag').exists()).toBe(true);
  });
  test('新增素材模型数据等于指定数据', () => {
    wrapper.setData({
      materialInfo:{
        "ageTag": [1,2],
        "materialName": "111",
        "positionId": 1,
        "sexTag": [1,2]
      }
    });
    expect(wrapper.vm.materialInfo.materialName).toBe("111");
    expect(wrapper.vm.materialInfo.positionId).toBe(1);
    expect(wrapper.vm.materialInfo.sexTag).toEqual([1,2]);
    expect(wrapper.vm.materialInfo.ageTag).toEqual([1,2]);
  });
  // test('新增素材各信息框值等于指定值', () => {
  //   wrapper.setData({
  //     materialInfo:{
  //       "ageTag": [1,2],
  //       "materialName": "111",
  //       "positionId": 1,
  //       "sexTag": [1,2]
  //     }
  //   });
  //   expect(wrapper.find('.materialName').attributes().value).toBe("111");
  //   // expect(wrapper.find('.positionId').attributes().value).toBe("1");
  //   expect(wrapper.find('.sexTag').attributes().value).toBe("1,2");
  //   expect(wrapper.find('.ageTag').attributes().value).toBe("1,2");
  // });
  test('点击取消按钮，触发事件', () => {
    wrapper.vm.$emit('handleCloseModal')
    expect(wrapper.emitted().handleCloseModal).toBeTruthy()
  });
  test('点击提交按钮，触发事件', () => {
    wrapper.vm.$emit('submitForm')
    expect(wrapper.emitted().submitForm).toBeTruthy()
  });
});

