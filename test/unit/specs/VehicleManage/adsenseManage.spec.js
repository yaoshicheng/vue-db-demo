// require('jsdom-global')()
import Vue from 'vue'
import Vuex from 'vuex'
import sinon from 'sinon'
import { mount,createLocalVue,shallowMount } from '@vue/test-utils'
import AdsenseManageSearch from '@/views/adManage/adsenseManage/search.vue'
import AdsenseManageTable from '@/views/adManage/adsenseManage/table.vue'
import AdsenseManageAdd from '@/views/adManage/adsenseManage/add.vue'
import AdsenseManageEdit from '@/views/adManage/adsenseManage/edit.vue'
const localVue = createLocalVue();
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
describe('广告位管理搜索栏单元测试', () => {
  const Constructor = Vue.extend(AdsenseManageSearch);
  const vm = new Constructor().$mount();
  const wrapper = mount(AdsenseManageSearch);

  test('输入框初始为空', () => {
    // const vm = new Vue(VehicleManageSearch).$mount();
    expect(vm.adsenseName).toBe('');
  });
  test('输入框在model变更后变为test', () => {
    wrapper.setData({
      adsenseName:"test"
    });
    expect(wrapper.vm.adsenseName).toBe('test');

  });
  test('组件包含输入框', () => {
    expect(wrapper.find('.form-input').exists()).toBeTruthy();
  });
  test('组件包含按钮', () => {
    expect(wrapper.find('.searchBtn').exists()).toBeTruthy();
  });
  test('按钮正常点击 点击3次', () => {
    const onSubmit = sinon.stub();
    wrapper.setMethods({ onSubmit: onSubmit })
    // wrapper.vm.$emit('onSubmit')
    wrapper.find('.searchBtn').trigger('click');
    wrapper.find('.searchBtn').trigger('click');
    wrapper.find('.searchBtn').trigger('click');
    expect(onSubmit.called).toBe(true);
    expect(onSubmit.callCount).toBe(3);
  });
});

describe('广告位管理Table单元测试', () => {
  const Constructor = Vue.extend(AdsenseManageTable);
  const vm = new Constructor().$mount();
  const wrapper = mount(AdsenseManageTable);
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
  test('组件包含编辑按钮', () => {
    expect(wrapper.find('.editBtn').exists()).toBeTruthy();
  });

  test('点击新增按钮，显示新增Modal', () => {
    wrapper.find('.addBtn').trigger('click');
    expect(wrapper.vm.showAddModal).toBe(true);
    // expect(wrapper.find('.addModal').isVisible()).toBe(true)
  });
  test('点击编辑按钮，显示编辑Modal', () => {
    const wrapper = mount(AdsenseManageTable);
    wrapper.setProps(mockData());
    wrapper.setData({showEditModal:false});
    wrapper.find('.editBtn').trigger('click');
    expect(wrapper.vm.showEditModal).toBe(true);
  });
  test('点击删除按钮，数据减少一条', () => {
    const wrapper = mount(AdsenseManageTable);
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

describe('广告位管理新增车辆单元测试', () => {
  const wrapper = shallowMount(AdsenseManageAdd,{
    localVue,
    propsData: {
      passInfo:{
        "formats": [],
        "height": undefined,
        "positionName": "",
        "width": undefined,
        selectedTypeArray:[],
      },
    },
  });
  test('新增广告位各信息框存在', () => {
    expect(wrapper.find('.positionName').exists()).toBe(true);
    expect(wrapper.find('.width').exists()).toBe(true);
    expect(wrapper.find('.height').exists()).toBe(true);
    expect(wrapper.find('.selectedTypeArray').exists()).toBe(true);
  });
  test('新增广告位模型数据等于指定数据', () => {
    wrapper.setData({
      passInfo:{
        "formats": [],
        "height": 1280,
        "positionName": "11111",
        "width": 1920,
        selectedTypeArray:[1,2],
      },
    });
    expect(wrapper.vm.passInfo.positionName).toBe("11111");
    expect(wrapper.vm.passInfo.width).toBe(1920);
    expect(wrapper.vm.passInfo.height).toBe(1280);
    expect(wrapper.vm.passInfo.selectedTypeArray).toEqual([1,2]);
  });
  test('新增广告位各信息框值等于指定值', () => {
    wrapper.setData({
      passInfo:{
        "formats": [],
        "height": 1280,
        "positionName": "11111",
        "width": 1920,
        selectedTypeArray:[1,2],
      },
    });
    expect(wrapper.find('.positionName').attributes().value).toBe("11111");
    expect(wrapper.find('.width').attributes().value).toBe("1920");
    expect(wrapper.find('.height').attributes().value).toBe("1280");
    // expect(wrapper.find('.selectedTypeArray').attributes().value).toBe('1,2');
  });
  test('点击取消按钮，触发事件', () => {
    wrapper.vm.$emit('handleCloseModal')
    expect(wrapper.emitted().handleCloseModal).toBeTruthy()
  });
  test('点击提交按钮，触发事件', () => {
    wrapper.vm.$emit('submitForm')
    expect(wrapper.emitted().submitForm).toBeTruthy()
  });
});

describe('广告位管理编辑广告位单元测试', () => {
  const wrapper = shallowMount(AdsenseManageEdit,{
    localVue,
    propsData: {
      passInfo:{
        "formats": [],
        "height": 111,
        "positionName": "111",
        "width": 111,
        selectedTypeArray:[],
      },
    },
  });
  test('编辑广告位各信息框存在',()=>{
    expect(wrapper.find('.positionName').exists()).toBe(true);
    expect(wrapper.find('.width').exists()).toBe(true);
    expect(wrapper.find('.height').exists()).toBe(true);
    expect(wrapper.find('.materialTypeArray').exists()).toBe(true);
  });
  test('编辑广告位各信息框初始值等于特定值', () => {
    expect(wrapper.find('.positionName').attributes().value).toBe("111");
    expect(wrapper.find('.width').attributes().value).toBe("111");
    expect(wrapper.find('.height').attributes().value).toBe("111");
  });
  test('编辑广告位各信息框值等于改变后的值', () => {
    wrapper.setProps({
      passInfo:{
        "formats": [],
        "height": 1280,
        "positionName": "222",
        "width": 1920,
        selectedTypeArray:[],
      },
    });
    expect(wrapper.vm.passInfo.positionName).toBe("222");
    expect(wrapper.vm.passInfo.width).toBe(1920);
    expect(wrapper.vm.passInfo.height).toBe(1280);
    // expect(wrapper.vm.passInfo.materialTypeArray).toEqual([2,3]);
  });
  test('点击取消按钮，触发事件', () => {
    wrapper.vm.$emit('handleCloseModal');
    expect(wrapper.emitted().handleCloseModal).toBeTruthy();
  });
  test('点击提交按钮，触发事件', () => {
    wrapper.vm.$emit('submitForm')
    expect(wrapper.emitted().submitForm).toBeTruthy()
  });
});
