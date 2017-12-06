<template>
  <div id="app">
  <router-view></router-view>
  <!-- 弹框组件池 -->
      <el-dialog v-for="item in dialogs" :key="item.id"
        :title="item.options.title"
        :ref="item.name"
        v-model="item.visible"
        :size="item.options.size"
        :top="item.options.top"
        :modal="item.options.modal"
        :modal-append-to-body="item.options.modalAppendToBody"
        :lock-scroll="item.options.lockScroll"
        :custom-class="item.options.customClass"
        :close-on-click-modal="item.options.closeOnClickModal"
        :close-on-press-escape="item.options.closeOnPressEscape"
        :show-close="item.options.showClose"
        :before-close="item.options.beforeClose"
        @close="dialogClose(item)"
        @open="dialogOpen(item)">
        <component :is="item.component" :data-in="item.props"></component>
        <span slot="footer" class="dialog-footer" v-if="item.buttons && item.buttons.length">
          <el-button class="button" v-for="buttonItem in item.buttons" :key="buttonItem.text"
          :icon="buttonItem.icon"
          :type="buttonItem.type"
          @click="buttonItem.handler">{{buttonItem.text}}</el-button>
        </span>
     </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { dialogTypes } from '@/types'
export default {
  data () {
    return {
      isDropDownShow: false
    }
  },
  computed: {
    ...mapGetters({
      dialogs: dialogTypes.GET_DIALOG_POOL
    })
  },
  methods: {
    dialogClose (item) {
      // 一秒钟以后销毁dialog
      setTimeout(() => {
        this.$store.commit(dialogTypes.REMOVE_DIALOG, item.name)
      }, 1000)
      // 执行原生方法
      if (item.dialogEvents.close) {
        item.dialogEvents.close.call()
      }
    },
    dialogOpen (item) {
      if (item.dialogEvents.open) {
        item.dialogEvents.open.call()
      }
    }
  }
}
</script>

<style>
.nav-area{
    position: absolute;
    border-radius: 5px;
    height: 50px;
    top: 10px;
    left: 8px;
    right: 8px;
  }
  .main-area{
    position: absolute;
    top: 80px;
    left: 21px;
    right: 21px;
    bottom: 0px;
    overflow-y: auto;
  }
  .list-button{
    float: left;
    width: 120px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }
</style>
