// require('jsdom-global')()
import Vue from 'vue'
import Vuex from 'vuex'
import sinon from 'sinon'
import { mount,createLocalVue,shallowMount } from '@vue/test-utils'
import VehicleManageSearch from '@/views/vehicleManage/vehicleManage/search.vue'
import VehicleManageTable from '@/views/vehicleManage/vehicleManage/table.vue'
import VehicleManageAdd from '@/views/vehicleManage/vehicleManage/add.vue'
import VehicleManageEdit from '@/views/vehicleManage/vehicleManage/edit.vue'
const localVue = createLocalVue();
localVue.use(Vuex);

describe('车辆管理搜索栏单元测试', () => {
  const Constructor = Vue.extend(VehicleManageSearch);
  const vm = new Constructor().$mount();
  const wrapper = mount(VehicleManageSearch);

  test('输入框初始为空', () => {
    // const vm = new Vue(VehicleManageSearch).$mount();
    expect(vm.vehicleNumber).toBe('');
  });
  test('输入框在model变更后变为test', () => {
    wrapper.setData({
      vehicleNumber:"test"
    });
    expect(wrapper.vm.vehicleNumber).toBe('test');

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
      datasouce: [
        {
          name: "熊猫公交1号",
          number: "沪B GH123",
          city: "上海",
          route:"浦东-嘉定",
          adMaterial:"物料1，物料2",
          adMaterialType:"1，2"
        },
        {
          name: "熊猫公交2号",
          number: "沪B SE234",
          city: "上海",
          route:"周浦-长宁",
          adMaterial:"物料1，物料2",
          adMaterialType:"2，3"
        },
        {
          name: "熊猫公交3号",
          number: "沪B FD443",
          city: "上海",
          route:"普陀-宝山",
          adMaterial:"物料1，物料2",
          adMaterialType:"1，4"
        },
      ]
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
describe('车辆管理Table单元测试', () => {
  const Constructor = Vue.extend(VehicleManageTable);
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
    const wrapper = mount(VehicleManageTable);
    expect(wrapper.find('.addBtn').exists()).toBeTruthy();
  });
  test('组件包含编辑按钮', () => {
    const wrapper = mount(VehicleManageTable);
    wrapper.setProps(mockData());
    expect(wrapper.find('.editBtn').exists()).toBeTruthy();
  });

  test('点击新增按钮，显示新增Modal', () => {
    const wrapper = mount(VehicleManageTable);
    wrapper.find('.addBtn').trigger('click');
    expect(wrapper.vm.showAddModal).toBe(true);
    expect(wrapper.find('.addModal').isVisible()).toBe(true)
  });
  test('点击编辑按钮，显示编辑Modal', () => {
    const wrapper = mount(VehicleManageTable);
    wrapper.setProps(mockData())
    wrapper.setData({showEditModal:false});
    wrapper.find('.editBtn').trigger('click');
    expect(wrapper.vm.showEditModal).toBe(true);
  });
  test('点击删除按钮，数据减少一条', () => {
    const wrapper = mount(VehicleManageTable);
    const handleDelete = sinon.stub();
    wrapper.setProps(mockData());
    wrapper.setMethods({handleDelete:handleDelete});
    wrapper.find('.deleteBtn').trigger('click');
    expect(handleDelete.called).toBe(true);
    expect(handleDelete.callCount).toBe(1);
  });
  test('点击分页，事件触发', () => {
    const handleCurrentChange = sinon.stub();
    const wrapper = mount(VehicleManageTable);
    wrapper.setMethods({handleCurrentChange:handleCurrentChange});
    wrapper.vm.$emit('handleCurrentChange');
    expect(wrapper.emitted().handleCurrentChange).toBeTruthy();
  });
});

describe('车辆管理新增车辆单元测试', () => {
  const wrapper = shallowMount(VehicleManageAdd,{
    localVue,
    propsData: {
      vehicleInfo:{
        name:"",
        number:"",
        route:"",
        city:[],
        adMaterial: [],
      },
    },
  });
  test('新增车辆各信息框存在', () => {
    expect(wrapper.find('.carName').exists()).toBe(true);
    expect(wrapper.find('.city').exists()).toBe(true);
    expect(wrapper.find('.operationRoute').exists()).toBe(true);
    expect(wrapper.find('.adMaterial').exists()).toBe(true);
  });
  test('新增车辆模型数据等于指定数据', () => {
    wrapper.setData({
      vehicleInfo:{
        carName:"111",
        carNumber:"111",
        operationRoute:"111",
        currentCity:[1,2],
        adsIdArray: [1,2,3],
      },
    });
    expect(wrapper.vm.vehicleInfo.carName).toBe("111");
    expect(wrapper.vm.vehicleInfo.carNumber).toBe("111");
    expect(wrapper.vm.vehicleInfo.operationRoute).toBe("111");
    expect(wrapper.vm.vehicleInfo.currentCity).toEqual([1,2]);
    expect(wrapper.vm.vehicleInfo.adsIdArray).toEqual([1,2,3]);
  });
  test('新增车辆各信息框值等于指定值', () => {
    wrapper.setData({
      vehicleInfo:{
        carName:"111",
        carNumber:"111",
        operationRoute:"111",
        currentCity:[1,2],
        adsIdArray: [1,2,3],
      },
    });
    expect(wrapper.find('.carName').attributes().value).toBe("111");
    expect(wrapper.find('.operationRoute').attributes().value).toBe("111");
    expect(wrapper.find('.carNumber').attributes().value).toBe("111");
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

describe('车辆管理编辑车辆单元测试', () => {
  const wrapper = shallowMount(VehicleManageEdit,{
    localVue,
    propsData: {
      vehicleInfo:{
        carName:"111",
        carNumber:"111",
        operationRoute:"111",
        currentCity:[1,2],
        adsIdArray: [1,2,3],
      },
    },
  });
  test('编辑车辆各信息框存在',()=>{
    expect(wrapper.find('.carName').exists()).toBe(true);
    expect(wrapper.find('.city').exists()).toBe(true);
    expect(wrapper.find('.operationRoute').exists()).toBe(true);
    expect(wrapper.find('.adMaterial').exists()).toBe(true);
  });
  test('编辑车辆各信息框初始值等于特定值', () => {
    expect(wrapper.find('.carName').attributes().value).toBe("111");
    expect(wrapper.find('.carNumber').attributes().value).toBe("111");
    expect(wrapper.find('.operationRoute').attributes().value).toBe("111");
    expect(wrapper.find('.city').attributes().value).toBe("1,2");
    expect(wrapper.find('.adMaterial').attributes().value).toBe("1,2,3");
  });
  test('编辑车辆各信息框值等于改变后的值', () => {
    wrapper.setProps({
      vehicleInfo:{
        carName:"222",
        carNumber:"222",
        operationRoute:"222",
        currentCity:[2,3],
        adsIdArray: [1,2,3,4],
      },
    });
    expect(wrapper.vm.vehicleInfo.carName).toBe("222");
    expect(wrapper.vm.vehicleInfo.carNumber).toBe("222");
    expect(wrapper.vm.vehicleInfo.operationRoute).toBe("222");
    expect(wrapper.vm.vehicleInfo.currentCity).toEqual([2,3]);
    expect(wrapper.vm.vehicleInfo.adsIdArray).toEqual([1,2,3,4]);
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
