import Vue from 'vue'
import Vuex from 'vuex'
import sinon from 'sinon'
import { mount,createLocalVue } from '@vue/test-utils'
import SourceMaterialManageTable from '@/views/adManage/sourceMaterialManage/table.vue'
const localVue = createLocalVue();
localVue.use(Vuex);

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
describe('素材列表Table单元测试', () => {
  const Constructor = Vue.extend(SourceMaterialManageTable);
  const vm = new Constructor().$mount();
  test('新增Modal初始为空', () => {
    expect(vm.showAddModal).toBe(false);
  });
  test('组件包含新增按钮', () => {
    const wrapper = mount(SourceMaterialManageTable);
    expect(wrapper.find('.addBtn').exists()).toBeTruthy();
  });
  test('组件包含删除按钮', () => {
    const wrapper = mount(SourceMaterialManageTable);
    wrapper.setProps(mockData());
    expect(wrapper.find('.deleteBtn').exists()).toBeTruthy();
  });

  test('点击新增按钮，显示新增Modal', () => {
    const wrapper = mount(SourceMaterialManageTable);
    const handleClicktoadd = sinon.stub();
    wrapper.setMethods({handleClicktoadd:handleClicktoadd});
    wrapper.find('.addBtn').trigger('click');
    expect(handleClicktoadd.called).toBe(true);
    expect(handleClicktoadd.callCount).toBe(1);
  });
  test('点击删除按钮，数据减少一条', () => {
    const wrapper = mount(SourceMaterialManageTable);
    const handleDelete = sinon.stub();
    wrapper.setProps(mockData());
    wrapper.setMethods({handleDelete:handleDelete});
    wrapper.find('.deleteBtn').trigger('click');
    expect(handleDelete.called).toBe(true);
    expect(handleDelete.callCount).toBe(1);
  });
  test('点击分页，事件触发', () => {
    const handleCurrentChange = sinon.stub();
    const wrapper = mount(SourceMaterialManageTable);
    wrapper.setMethods({handleCurrentChange:handleCurrentChange});
    wrapper.vm.$emit('handleCurrentChange');
    expect(wrapper.emitted().handleCurrentChange).toBeTruthy();
  });
});

