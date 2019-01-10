// require('jsdom-global')()
import Vue from 'vue'
import Vuex from 'vuex'
import sinon from 'sinon'
import { mount,createLocalVue,shallowMount } from '@vue/test-utils'
import MaterialManageSearch from '@/views/adManage/materialManage/search.vue'
import MaterialManageTable from '@/views/adManage/materialManage/table.vue'
import MaterialManageAdd from '@/views/adManage/materialManage/add.vue'
import MaterialManageEdit from '@/views/adManage/materialManage/edit.vue'
const localVue = createLocalVue();
localVue.use(Vuex);

describe('广告物料搜索栏单元测试', () => {
  const Constructor = Vue.extend(MaterialManageSearch);
  const vm = new Constructor().$mount();
  const wrapper = mount(MaterialManageSearch);

  test('输入框初始为空', () => {
    expect(vm.adsName).toBe('');
  });
  test('输入框在model变更后变为test', () => {
    wrapper.setData({
      adsName:"test"
    });
    expect(wrapper.vm.adsName).toBe('test');

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
  test('按钮正常点击 返回数据格式正确', () => {

    const onSubmit = jest.fn().mockReturnValueOnce({
      total: 1000,
      datasource:[]
    });
    wrapper.setMethods({ onSubmit: onSubmit })
    // wrapper.vm.$emit('onSubmit')
    wrapper.find('.searchBtn').trigger('click');
    wrapper.find('.searchBtn').trigger('click');
    wrapper.find('.searchBtn').trigger('click');
    expect(onSubmit.mock.calls.length).toBe(3);
  });
});

const mockData = ()=> {
  return {
    tabledata: [{
      name: "熊猫公交1号",
      number: "沪B GH123",
      city: "上海",
      route: "浦东-嘉定",
      adMaterial: "物料1，物料2",
      adMaterialType: "1，2"
    }],
    total: 100,
  }
}
describe('广告物料管理Table单元测试', () => {
  const Constructor = Vue.extend(MaterialManageTable);
  const vm = new Constructor().$mount();
  test('新增Modal初始为空', () => {
    // const vm = new Vue(VehicleManageSearch).$mount();
    expect(vm.showAddModal).toBe(false);
  });
  test('编辑Modal初始为空', () => {
    // const vm = new Vue(VehicleManageSearch).$mount();
    expect(vm.showEditModal).toBe(false);
  });

  test('组件包含新增按钮', () => {
    const wrapper = mount(MaterialManageTable);
    expect(wrapper.find('.addBtn').exists()).toBeTruthy();
  });
  test('组件包含编辑按钮', () => {
    const wrapper = mount(MaterialManageTable);
    wrapper.setProps(mockData());
    expect(wrapper.find('.detailBtn').exists()).toBeTruthy();
    expect(wrapper.find('.editBtn').exists()).toBeTruthy();
    expect(wrapper.find('.deleteBtn').exists()).toBeTruthy();
  });

  test('点击新增按钮，显示新增Modal', () => {
    const wrapper = mount(MaterialManageTable);
    wrapper.find('.addBtn').trigger('click');
    expect(wrapper.vm.showAddModal).toBe(true);
    expect(wrapper.find('.addModal').isVisible()).toBe(true)
  });
  test('点击编辑按钮，显示编辑Modal', () => {
    const wrapper = mount(MaterialManageTable);
    wrapper.setProps(mockData())
    wrapper.setData({showEditModal:false});
    wrapper.find('.editBtn').trigger('click');
    expect(wrapper.vm.showEditModal).toBe(true);
  });
  test('点击删除按钮，数据减少一条', () => {
    const wrapper = mount(MaterialManageTable);
    const handleDelete = sinon.stub();
    wrapper.setProps(mockData());
    wrapper.setMethods({handleDelete:handleDelete});
    wrapper.find('.deleteBtn').trigger('click');
    expect(handleDelete.called).toBe(true);
    expect(handleDelete.callCount).toBe(1);
  });
  test('点击分页，事件触发', () => {
    const handleCurrentChange = sinon.stub();
    const wrapper = mount(MaterialManageTable);
    wrapper.setMethods({handleCurrentChange:handleCurrentChange});
    wrapper.vm.$emit('handleCurrentChange');
    expect(wrapper.emitted().handleCurrentChange).toBeTruthy();
  });
});

describe('广告物料管理新增车辆单元测试', () => {
  const wrapper = shallowMount(MaterialManageAdd,{
    localVue,
  });
  test('广告物料名称信息框存在', () => {
    expect(wrapper.find('.adsName').exists()).toBe(true);
  });
  test('广告物料名称数据等于指定数据', () => {
    wrapper.setData({
      adsInfo:{
        adsName:"111",
      },
    });
    expect(wrapper.vm.adsInfo.adsName).toBe("111");
  });
  test('广告物料名称信息框值等于指定值', () => {
    wrapper.setData({
      adsInfo:{
        adsName:"111",
      },
    });
    expect(wrapper.find('.adsName').attributes().value).toBe("111");
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

describe('广告物料管理编辑车辆单元测试', () => {
  const wrapper = shallowMount(MaterialManageEdit,{
    localVue,
    propsData: {
      passInfo:{
        adsName:"111",
        adsId:1,
      }
    },
  });
  test('编辑广告物料名称信息框存在',()=>{
    expect(wrapper.find('.adsName').exists()).toBe(true);
  });
  test('编辑车辆各信息框初始值等于特定值', () => {
    expect(wrapper.find('.adsName').attributes().value).toBe("111");
  });
  test('编辑车辆各信息框值等于改变后的值', () => {
    wrapper.setProps({
      passInfo:{
        adsName:"222",
        adsId:1,
      }
    });
    expect(wrapper.vm.passInfo.adsName).toBe("222");
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
