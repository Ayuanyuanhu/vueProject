import { dialogTypes } from '@/types'
// import Vue from 'vue'
import _ from 'lodash'

const state = {
  dialogs: []
}

const getters = {
  // 获得dialog池
  [dialogTypes.GET_DIALOG_POOL]: state => state.dialogs
}

const mutations = {
  // 添加一个dialog
  [dialogTypes.ADD_DIALOG] (state, dialog) {
    state.dialogs.push(dialog)
  },
  // 关闭一个弹框
  [dialogTypes.CLOASE_DIALOG] (state, name) {
    for (let index = 0; index < state.dialogs.length; index++) {
      if (state.dialogs[index].name === name) {
        state.dialogs[index].visible = false
      }
    }
  },
  // 删除一个dialog
  [dialogTypes.REMOVE_DIALOG] (state, name) {
    for (let index = 0; index < state.dialogs.length; index++) {
      if (state.dialogs[index].name === name) {
        state.dialogs.splice(index, 1)
      }
    }
  }
}

// let a = null

const actions = {
  // 打开一个弹框
  [dialogTypes.OPEN_DIALOG] ({state, commit}, {name, component, options, props, dialogEvents, events, buttons}) {
    return new Promise((resolve, reject) => {
      if (!name) {
        reject('名称不能为空')
        return
      }
      if (!component) {
        reject('组件不能为空')
        return
      }
      // 初始化dialog
      const dialog = {
        // 唯一标识，用时间来保证唯一
        id: new Date().getTime(),
        // 名称
        name: null,
        // 要展示的组件
        component: null,
        // 显示状态
        visible: true,
        // 自定义参数
        options: {
          // 标题，默认为空
          title: null,
          // 大小, 默认小
          size: 'small',
          // 距离顶部, 默认15%
          top: '15%',
          // 是否需要遮罩层
          modal: true,
          // 遮罩层插入body中
          modalAppendToBody: true,
          // 是否在 Dialog 出现时将 body 滚动锁定
          lockScroll: true,
          // 自定义类名
          customClass: null,
          // 点击遮罩关闭
          closeOnClickModal: false,
          // 是否可以通过按下 ESC 关闭 Dialog
          closeOnPressEscape: true,
          // 是否显示关闭按钮
          showClose: true,
          // 关闭前的回调，会暂停 Dialog 的关闭
          beforeClose: null
        },
        // 事件
        dialogEvents: {
          // 关闭事件
          close: null,
          // 打开事件
          open: null
        },
        events: {

        },
        // 定义参数
        props: {},
        // 自定义事件, 默认为空
        customEvent: {},
          // 示例
          // success: () => {
          //  方法体
          // }
          // 在子组件中，使用vm.$emit('success'), 调用事件
        // 自定义按钮，默认为空
        buttons: []
        // 示例
        // [{
        //   text: '确定',
        //   type: 'primary',
        //   icon: 'check',
        //   handler: () => {
        //     点击事件方法体
        //   }
        // }, {
        //   text: '取消',
        //   type: 'default',
        //   icon: 'close',
        //   handler: () => {
        //     点击事件方法体
        //   }
        // }]
      }
      // 设置Name
      dialog.name = name
      // 注入组件
      dialog.component = component
      // 设置按钮
      dialog.buttons = buttons
      // 合并参数
      _.assign(dialog.options, options)
      // 设置原生事件
      _.assign(dialog.dialogEvents, dialogEvents)
      // 设置参数
      _.assign(dialog.props, props)
      // 设置事件
      _.assign(dialog.customEvent, events)
      // 设置参数事件
      const defaultCreated = component.created
      component.resolve = resolve
      component.dialog = dialog
      // 创建方法
      component.created = function () {
        component.created = defaultCreated
        this.name = component.dialog.name
        // 设置视图模型
        component.dialog.vm = this
        // 设置自定义事件
        for (let key in component.dialog.customEvent) {
          // 先删除后添加
          this.$on(key, component.dialog.customEvent[key])
        }
        // 执行默认方法
        if (defaultCreated) {
          defaultCreated.apply(this)
        }
        // 返回到promise中
        component.resolve(component.dialog.vm)
      }
      // 添加到state中
      commit(dialogTypes.ADD_DIALOG, dialog)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
