<template>
<div>
        <div v-if="model.nodeName !== ''" :id='model.nodeNo' :draggable="model.lvl !== 1" @dragover.prevent @dragstart='onDragStart($event, model)' @drop.stop="handleDrop($event, model)" @dblclick='dbNodeClick(model)' @dragover='dragOver' @dragenter.stop='dragEnter' @dragleave.stop='dragLeave' @dragend.prevent='dragEnd' class='treeNodeText' @mouseover='mouseOver' @mouseout='mouseOut' :style='styleObj'>
            <span v-show="open"  @click="toggle" :class="[fIsClicked ? 'nodeClicked' : '','vue-drag-node-icon']"></span>
            <span v-show="!open"  @click="toggle" :class="[isClicked ? 'nodeClicked' : '','vue-drag-node-icon']"></span>
            <span style="cursor: pointer;" id="demo-src">{{model.nodeName}}
             <el-popover
               ref="popover2"
               placement="bottom-start"
               title="节点位置"
               width="280"
               trigger="hover">
               <div>
               <el-button type="primary" @click="addNodeByType(1, model.lvlCode)">上方节点</el-button>
               <el-button type="primary" @click="addNodeByType(2, model.lvlCode)">下方节点</el-button>
               <el-button type="primary" @click="addNodeByType(0, model.lvlCode)">&nbsp;子节点</el-button>
               </div>
             </el-popover>
             <i class="el-icon-plus" style="cursor: pointer;
            margin-left:20px;"  v-popover:popover2 v-show="showTreeButton && model.lvl!==1"></i>
             <el-popover
               ref="popover1"
               placement="bottom"
               title="节点位置"
               width="50"
               trigger="hover">
               <div>
                <el-button type="primary" @click="addNodeByType(0, model.lvlCode)">子节点</el-button>
               </div>
             </el-popover>
             <i class="el-icon-plus" style="cursor: pointer;
            margin-left:20px;"  v-popover:popover1 v-show="showTreeButton && model.lvl===1"></i>
            </span>
            <i @click="editNode(model)" class="el-icon-edit" style="cursor: pointer;
            margin-left:10px;" v-show="showTreeButton"></i>
            <i @click="removeChild(model)" v-if='model.lvl !==1' class="el-icon-rx-shanchu2" style="cursor: pointer;
            margin-left:10px;" v-show="showTreeButton"></i>
        </div>
        <div v-if="model.nodeName === ''" :id='model.nodeNo' :draggable=false class='treeNodeNull' @dragover.prevent @dragstart.stop='onDragStart($event, model)' @drop.stop="handleDrop($event, model)" @dragover='dragOver' @dragenter.stop='dragEnter' @dragleave.stop='dragLeave' @dragend.prevent='dragEnd'  @mouseover='mouseOver' @mouseout='mouseOut' :style='styleObj'>
          <span style="cursor: pointer;">{{model.nodeName}}</span>
        </div>
        <div class='treeMargin' v-show="show" v-if="isFolder">
            <item v-for="model in model.children"  :model="model" :key='model.nodeNo' :current-highlight='currentHighlight' :default-text='defaultText' 　:hover-color='hoverColor' :highlight-color='highlightColor'>
            </item>
        </div>
</div>
</template>
<script>
import { supervisorTreeService } from '@/api'

let nodeClicked = ''
export default {
  name: 'dragTree',
  data () {
    return {
      show: true,
      open: true,
      fIsClicked: true,
      isClicked: false,
      styleObj: {
        background: 'white'
      },
      dialogType: false,
      deleteData: {
        key: '',
        lvlCode: '',
        type: 0
      },
      queryData: {
        key: '',
        lvlCode: '',
        type: ''
      },
      showTreeButton: false,
      queryDragNode: {
        nodeId: '',
        nodeLeftId: '',
        nodeParentId: '',
        nodeRightId: ''
      },
      NewVm: this.vm,
      moveNodeObj: {
        desLvlCode: '',
        key: '',
        moveLvlCode: '',
        type: ''
      }
    }
  },
  props: {
    model: Object,
    'default-text': String, // 填加节点时显示的默认文本．
    'current-highlight': Boolean, // 当前节点高亮
    'hover-color': String,
    'highlight-color': String,
    vm: { twoWay: true } // 正在拖动的节点实例
  },

  computed: {
    isFolder () {
      return this.model.children &&
        this.model.children.length
    }
  },
  mounted () {
    var me = this
    me.src = document.querySelector('#demo-src')
    // 为拖拽源监听dragstart,设置关联数据
    me.src.addEventListener('dragstart', this.onDragStart, false)
  },
  beforeCreate () {
    this.$options.components.item = require('./SupervisorDesigner')
  },
  methods: {
    dbNodeClick: function (node) {
      // this.styleObj.background = '#D6D8FF'
      this.editNode(node)
    },
    // 增加树节点
    addNodeByType: function (type, lvlCode) {
      let rootTree = this.findRoot()
      rootTree.$parent.isSearching = true
      this.queryData.type = type
      this.queryData.key = rootTree.$parent.$route.query.tempId
      this.queryData.lvlCode = lvlCode
      supervisorTreeService.addSuperviorId(this.queryData).then(data => {
        rootTree.$parent.queryTree()
        this.$nextTick(() => {
          rootTree.$parent.isSearching = false
        })
      }).catch(() => {
        rootTree.$parent.isSearching = false
      })
    },
    // 树的收缩
    toggle () {
      if (this.isFolder) {
        this.show = !this.show
      }
      // 调用vue-drag-tree的父组件中的方法,以传递出当前被点击的节点的id值
      let rootTree = this.findRoot()
      // 纪录节点被点击的状态
      this.isClicked = !this.isClicked
      this.fIsClicked = !this.fIsClicked
      // 用户需要节点高亮？-->this.currentHighlight ? 高亮 : 不高亮
      if (this.currentHighlight) {
        // 第一次点击当前节点．当前节点高亮，遍历重置其他节点的样式
        if (nodeClicked !== this.model.nodeNo) {
          let treeParent = rootTree.$parent
          // 遍历重置所有树组件的高亮样式
          let nodeStack = [treeParent.$children[0]]
          while (nodeStack.length !== 0) {
            let item = nodeStack.shift()
            if (item.$children && item.$children.length > 0) {
              nodeStack = nodeStack.concat(item.$children)
            }
          }
          // 然后把当前节点的样式设置为高亮
          this.styleObj.background = this.highlightColor ? this.highlightColor : '#99A9BF'
          // 设置为当前节点
          nodeClicked = this.model.nodeNo
        }
      }
    },
    mouseOver (e) {
      let rootTree = this.findRoot()
      if (rootTree.$parent.isShow === false) {
        this.showTreeButton = true
      }
      if ((this.styleObj.background !== '#99A9BF' || this.styleObj.background !== this.hightlightColor) && e.target.className === 'treeNodeText') {
        e.target.style.background = this.hoverColor ? this.hoverColor : '#E5E9F2'
      }
    },
    mouseOut (e) {
      this.showTreeButton = false
      if ((this.styleObj.background !== '#99A9BF' || this.styleObj.background !== this.hightlightColor) && e.target.className === 'treeNodeText') {
        e.target.style.background = 'white'
      }
    },
    findRoot () {
      // 返回Tree的根,即递归Tree时的最顶层那个vue-drag-tree组件
      let ok = false
      let that = this
      while (!ok) {
        // 如果父组件有data属性，说明当前组件是Tree组件递归调用发生时的第一个组件。
        if (!/dragTree/.test(that.$parent.$vnode.tag) || that.$parent.data) {
          ok = true
          // 交换两者的数据
          break
        }
        that = that.$parent
      }
      return that
    },
    removeChild (data) {
      let rootTree = this.findRoot()
      if (data.children) {
        this.$confirm('存在子节点,删除该节点,子节点将丢失，是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (data.type === 1) {
            this.deleteData.type = '1'
          } else {
            this.deleteData.type = '0'
          }
          this.deleteData.lvlCode = data.lvlCode
          this.deleteData.key = rootTree.$parent.$route.query.tempId
          supervisorTreeService.deleteSupervior(this.deleteData).then(data => {
            let rootTree = this.findRoot()
            rootTree.$parent.queryTree()
            this.pageTree = []
          })
        }).catch(() => {
        })
      } else {
        if (data.type === '1') {
          this.deleteData.type = '1'
        } else {
          this.deleteData.type = '0'
        }
        this.deleteData.lvlCode = data.lvlCode
        this.deleteData.key = rootTree.$parent.$route.query.tempId
        supervisorTreeService.deleteSupervior(this.deleteData).then(data => {
          let rootTree = this.findRoot()
          rootTree.$parent.queryTree()
          this.pageTree = []
        })
      }
    },
    handleDrop (e, node) {
      let rootTree = this.findRoot()
      var id = e.dataTransfer.getData('text/plain')
      this.moveNodeObj.moveLvlCode = id
      this.clearBgColor()
      this.moveNodeObj.desLvlCode = node.lvlCode
      this.moveNodeObj.key = rootTree.$parent.$route.query.tempId
      if (!rootTree.$parent.isAllowToDrop) return
      else if (this.model.nodeName === '') {
        this.moveNodeObj.type = node.type
      } else if (this.model.nodeName !== '') {
        this.moveNodeObj.type = 0
      }
      if (this.moveNodeObj.desLvlCode.indexOf(this.moveNodeObj.moveLvlCode) === 0) {
        this.$message({
          showClose: true,
          message: '父节点不允许移动到子节点下方!'
        })
      } else {
        if (this.moveNodeObj.desLvlCode !== this.moveNodeObj.moveLvlCode || (this.moveNodeObj.moveLvlCode.indexOf(this.moveNodeObj.desLvlCode) === 0 && this.moveNodeObj.moveLvlCode.length - this.moveNodeObj.desLvlCode.length !== 2)) {
          supervisorTreeService.moveSuperior(this.moveNodeObj).then(data => {
            rootTree.$parent.queryTree()
          })
        }
      }
    },
    onDragStart (e, node) {
      e.dataTransfer.setData('text/plain', node.lvlCode)
      this.NewVm = this // 设置本组件为当前正在拖动的实例
      this.styleObj.background = 'D6D8FF'
    },
    dragEnd (e) {
      this.clearBgColor()
    },
    dragOver (e) {
      e.preventDefault()
      return true
    },
    clearBgColor () { // 清理样式
      this.styleObj.background = 'white'
    },
    dragEnter (e) {
      let rootTree = this.findRoot()
      if (!rootTree.$parent.isAllowToDrop) return // 允许拖放才会显示样式
      this.NewVm = this
      this.styleObj.background = '#D6D8FF'
    },
    dragLeave (e) {
      this.clearBgColor()
    },
    editNode: function (node) {
      let rootTree = this.findRoot()
      rootTree.$parent.treeModel = node
      rootTree.$parent.editTreeNode(node)
    }
  }
}
</script>
<style scoped>
.treeTop {
  margin-left: 100px;
}
.left-List{
  position: absolute;
  width: 260px;
  left: 0px;
  top: 120px;
  bottom: 0px;
  box-shadow: 0px 0px 10px #D6D8FF;
  transition: width 0.5s;
  z-index: 1;
}
.left-concent {
  height: 500px;
  overflow-y: auto;
}
.left-operate{
  position: absolute;
  height: 60px;
  line-height: 60px;
  width: 16px;
  background-color: #D6D8FF;
  right: -16px;
  top: 50%;
  margin-top: -30px;
  cursor: pointer;
  border-radius: 0 5px 5px 0px;
  z-index: 2;
}
.topName{
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  text-align: center;
}
/* 标签页样式 */
  .el-tabs__nav-scroll {
    overflow: hidden;
    width: 50%;
  }
  .el-tag {
    background-color: #D6D8FF;
    display: inline-block;
    padding: 0 5px;
    height: 30px;
    line-height: 22px;
    font-size: 12px;
    color: #7459FC;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid transparent;
    white-space: nowrap;
  }
  .el-tag {
    margin-left: 10px;
  }
  .filter-card {
  height: 260px;
  overflow-y: auto;
}
.item {
    cursor: pointer;
}
.bold {
    font-weight: bold;
}
.treeNodeText {
    margin: 2px;
    padding: 0.2rem 0.5rem;
    width: fit-content;
    background: #F9FAFC;
    font-size: 16px;
    color: #324057;
}
.treeNodeNull {
    padding: 0.1rem 0.1rem;
    width: 300px;
    background: #F9FAFC;
    color: #324057;
}
.treeMargin {
    margin-left: 2rem;
    border-left: 1px dotted #D6D8FF;
}
.changeTree {
    width: 1rem;
    color: #324057;
}
.vue-drag-node-icon {
    display: inline-block;
    width: 0;
    height: 0;
    padding-right: 3px;
    border-left: 6px solid black;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 0 solid yellow;
    transition: transform .3s ease-in-out;
}
.nodeClicked {
    transform: rotate(90deg);
}
</style>
