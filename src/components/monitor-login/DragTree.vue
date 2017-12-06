<template>
<div>
<div class="nav-area nav-background">
  <div class="list-button">监管设计器</div>
  </div>
  <div class="main-area">
        <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        size="tiny">
        <span>&nbsp;&nbsp;还剩下资源清单中的资源,是否需要将剩余的资源在监管树中设置为其他节点？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="checkResource()" :loading="checkResourceLoading">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title=""
        :visible.sync="dialogType"
        size="tiny">
        <div align="center">
        <el-button type="default" @click="addNodeByType('1')">上方节点</el-button>
        <el-button type="default" @click="addNodeByType('2')">下方节点</el-button>
        <el-button type="default" @click="addNodeByType('0')">子节点</el-button>
        </div>
      </el-dialog>
    <el-form :inline="true">
      <el-form-item>
        <el-button icon="rx-chexiao" type="primary" @click="cancel" :loading="cancelLoading" :disabled="unCancel">撤销</el-button>
        <el-button icon="rx-baocun2" type="primary" @click="save" :loading="saveLoading">保存</el-button>
        <el-button icon="rx-bianji1" type="primary" @click="checkTree" :loading="checkTreeLoading" v-show="unCheck">校验</el-button>
        <el-button icon="rx-yulan" type="primary" @click="preview" :loading="previewLoading">预览</el-button>
        <el-button icon="rx-baocun2" type="primary" @click="submitTree" :loading="submitTreeLoading" v-show="this.$route.query.type">审核</el-button>
        <el-button icon="rx-bianji2" type="primary" @click="storeUp" :loading="storeUpLoading">生效</el-button>
      </el-form-item>
      <el-form-item label="树名称" class="treeTop">
      <el-input v-model="branchTreeName" disabled></el-input>
         </el-form-item>
    </el-form>
  </div>
  <div class="left-List" ref="leftArea">
        <div class="topName">
          <span v-show="!isTopShow" class="topName">{{resourceName}}清单</span>
          <div v-show="!isLeftAreaCllapsed" class="left-concent" id="left-concent">
          <el-table :data="pageTree" :show-header='false' style="margin-top:50px;margin-left:25px;width:80%;"
          @row-dblclick="dbClick($event)" v-loading="ResourceSearching">
            <el-table-column prop="text" align="center" :show-overflow-tooltip="true">
            <template scope="scope">
            <div v-if="!scope.row.resId" style="color:#FF4949;">{{scope.row.text}}</div>
            <div v-else>
              <el-button size="small"  type="text">
          {{scope.row.text}}</el-button>
            </div>     
        </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--收缩展开按钮-->
      <div class="left-operate button-hover" @click="leftAreaToggle">
        <i :class="isLeftAreaCllapsed ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
      </div>
    </div>
    <div ref="mainArea">
      <!-- 拖拽树 -->
  <vue-drag-tree 
  :current-highlight='true'  
  :hover-color='"#D6D8FF"'
  class="filter-tree"
  :model='treeData'
  :vm.sync="vm"
  v-loading="isSearching">
  </vue-drag-tree>
  <div class="right-card" v-show="isShow">
     <el-card class="box-card" >
        <div slot="header" class="clearfix">
        <el-button type="info" @click="confim(resourceForm)" :loading="confimLoading">确定</el-button>
        <el-button type="info" @click="close">取消</el-button>
          <el-form :inline="true" :data="resourceForm" :label-position="labelPosition" label-width="90px">
      <el-form-item label="编号">
        <el-input v-model="resourceForm.nodeNo" placeholder="" disabled></el-input>
      </el-form-item>
      <el-form-item label="名称">
         <el-input v-model="resourceForm.nodeName" placeholder="" :disabled="nodeEdit"></el-input>
      </el-form-item>
       <el-form-item label="生效日期">
        <el-date-picker type="date" placeholder="选择日期" v-model="resourceForm.begin" style="width: 100%;" 
         :disabled="editBeginTime" @input="beginDateChange" @change="beginTimeChanges(resourceForm, 'begin')"
         :picker-options="pickerOptionsTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="失效日期">
        <el-date-picker type="date" placeholder="选择日期" v-model="resourceForm.end" style="width: 100%;"
        :disabled="editEndTime" @input="endDateChange" @change="endTimeChanges(resourceForm, 'end')"
        :picker-options="pickerOptionsTime"></el-date-picker>
      </el-form-item>
      <el-form-item label="主管人">
        <el-autocomplete
              class="input"
              v-model="resourceForm.majorText"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelectMajor"></el-autocomplete>
      </el-form-item>
      <el-form-item label="协管人">
      <el-autocomplete
              class="input"
              v-model="resourceForm.assitText"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelectAssist"></el-autocomplete>
      </el-form-item>
     <!--  <el-form-item label="主责岗位" v-show="postShow">
        <el-select v-model="resourceForm.bk1">
         <el-option
         v-for="item in postOptions"
         :key="item.resId"
         :label="item.text"
         :value="item.resId">{{item.text}}</el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="定义">
    <el-input type="textarea" v-model="resourceForm.nodeDef" style="width:450px;"></el-input>
  </el-form-item>
    </el-form>
        </div>
        <div class="filter-card">
        <div class="cardName">
          <span>{{branchName}}清单</span>
        </div>
          <el-form :inline="true" style="margin-top: 10px;">
            <!-- <el-form-item>
            <label>清单名称</label>
             <el-input  style="width:280px;">{{branchName}}</el-input>
            </el-form-item> -->
            </el-form>
            <el-form>
            <el-form-item>
            <label>{{branchName}}筛选条件&nbsp;&nbsp;</label>
            <el-input style="width:280px;" v-model="relateCnd" icon="plus" @click="openNewWindow" disabled/>
            </el-form-item>
            <el-form-item>
            <label>{{branchName}}清单&nbsp;&nbsp;</label>
            <br>
            <div v-loading="tagLoading">
              <el-tag
                :key="tag.text"
                v-for="tag in selectTreeTag"
                :closable="closable"
                :close-transition="false"
                @close="handleClose(tag)">
                {{tag.text}}
               </el-tag>
             </div>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
   </div>
  </div>
  </div>
</template>

<script>
import VueDragTree from './SupervisorDesigner'
import { supervisorTreeService } from '@/api'
import treePreview from './TreePreview'
import supervisorAudit from './SupervisorAudit'
import moment from 'moment'
import _ from 'lodash'

export default{
  data () {
    return {
      pickerOptionsTime: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }]
      },
      closable: true,
      nodeEdit: false,
      unCancel: false,
      unCheck: true,
      vm: { twoWay: true },
      postOptions: [],
      postShow: false,
      pickerOptions: {
        disabledDate: (time) => {
          let beginDateVal = Date.parse(new Date())
          if (beginDateVal) {
            return time.getTime() < beginDateVal
          }
        }
      },
      queryTreeData: {
        flag: false,
        type: 2,
        key: '',
        validDate: ''
      },
      labelPosition: 'right',
      treeData: {},
      isSearching: false,
      editEndTime: false,
      editBeginTime: false,
      tagLoading: false,
      dialogType: false,
      scroll: '',
      resourceName: '',
      ResourceSearching: false,
      dialogVisible: false,
      branchName: '',
      branchTreeName: this.$route.query.name,
      isLeftAreaCllapsed: false,
      isTopShow: false,
      resourceForm: {
        // bk1: '',
        nodeNo: '',
        begin: '',
        nodeName: '',
        end: '',
        majorText: null,
        assit: null,
        major: null,
        assitText: null,
        nodeDef: '',
        mainPost: ''
      },
      resourceFormInitInfo: {
        // bk1: '',
        nodeNo: '',
        begin: '',
        nodeName: '',
        end: '',
        majorText: null,
        assit: null,
        major: null,
        assitText: null,
        nodeDef: ''
      },
      prplId: '',
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      treeFormName: '',
      isShow: false,
      pageTree: [],
      relateCnd: '',
      oldEditTreeData: [],
      treeResource: [],
      selectTreeTag: [],
      arrCache: [],
      queryResource: {
        key: '',
        lvlCode: ''
      },
      dataTree: [],
      result: {},
      deleteData: {
        nodeId: '',
        type: 0
      },
      revokeParams: {
        key: ''
      },
      catchResource: [],
      lvlCode: '',
      nodeResource: {
        key: '',
        lvlCode: '',
        resourceId: ''
      },
      addNodeResourceObj: {
        key: '',
        lvlCode: '',
        resourceId: '',
        resourceText: ''
      },
      resourceList: [],
      leftResource: {
        currentPage: '',
        lvlCode: '',
        key: '',
        pageSize: ''
      },
      clickStore: {},
      count: 1,
      dataList: {
        key: this.$route.query.tempId,
        endDate: '',
        lvlCode: '',
        startDate: ''
      },
      storeData: {
        key: this.$route.query.tempId
      },
      catchDate: {
        beginDate: '',
        endDate: ''
      },
      queryData: {
        nodeId: '',
        nodeType: ''
      },
      saveLoading: false,
      cancelLoading: false,
      checkTreeLoading: false,
      previewLoading: false,
      submitTreeLoading: false,
      storeUpLoading: false,
      confimLoading: false,
      checkResourceLoading: false,
      staffData: {
        resourceClassId: '',
        resourceValue: ''
      },
      staffObjs: [],
      resourceNull: false,
      timeout: null,
      showTreeButton: false,
      treeResourceDetail: [],
      prpData: {},
      acheMajorText: '',
      acheAssistText: '',
      acheAssist: '',
      acheMajor: '',
      treeModel: {},
      temporaryTree: []
    }
  },
  components: {
    'vue-drag-tree': VueDragTree,
    'tree-preview': treePreview,
    'supervisor-audit': supervisorAudit
  },
  watch: {
    treeFormName (val) {
      var arr = []
      for (var i = 0; i < this.catchResource.length; i++) {
        if (this.catchResource.length !== 0) {
          if (this.catchResource[i].indexOf(val) !== -1) {
            arr.push(this.catchResource[i])
          }
        }
        this.selectTreeTag = arr
        this.postOptions = arr
      }
    }
  },
  computed: {
    isParent () { // 拖放限制 1：判断“我”是否为被拖动节点的父节点
      return this === this.vm.$parent
    },
    isNextToMe () { // 拖放限制 2：判断“我”是否为被拖动节点的相邻节点
      return this.$parent === this.vm.$parent && Math.abs(this.idx - this.vm.idx) === 1
    },
    isMeOrMyAncestor () { // 拖放限制 3：判断被拖动节点是否为“我”自身或“我”的祖先
      var p = this
      while (p) {
        if (this.vm === p) return true
        p = p.$parent
      }
    },
    isAllowToDrop () { // 上述拖放限制条件的综合
      return !(this.isParent || this.isNextToMe || this.isMeOrMyAncestor)
    }
  },
  mounted () {
    // 监听滚动
    document.getElementById('left-concent').addEventListener('scroll', this.queryLeftResource)
  },
  created: function () {
    this.queryTree()
    if (this.$route.query.resourceName) {
      this.resourceName = this.$route.query.resourceName.substring(0, this.$route.query.resourceName.length - 1)
    }
    if (this.$route.query.id === '6fa512bf66e211e7b2e4005056bc4879' || this.$route.query.rootNodeId === '6fa512bf66e211e7b2e4005056bc4879') {
      this.unCheck = false
      this.closable = false
    }
  },
  methods: {
    openNewWindow: function () {
      // 注册页面接收函数
      if (this.prplId === '' || this.prplId === null) {
        window.open(`${this.CONFIG.baseUrl.formula}#/regulatory-tree-condition-config/${this.$route.query.resourceEdmId}`)
      } else {
        window.open(`${this.CONFIG.baseUrl.formula}#/regulatory-tree-condition-config/${this.$route.query.resourceEdmId}/${this.prplId}`)
      }
      window.onmessage = (message) => {
        this.relateCnd = message.data.eventData.prplConditionDesc
        this.prplId = message.data.eventData.prplId
        supervisorTreeService.queryResourceById(message.data.eventData.prplId).then(data => {
          if (data.length !== 0) {
            var list = {}
            var resources = []
            list.key = this.$route.query.tempId
            list.lvlCode = this.lvlCode
            list.relateCnd = message.data.eventData.prplId
            list.relateCndText = message.data.eventData.prplConditionDesc
            for (var i = 0; i < data.length; i++) {
              var obj = {}
              obj.resId = data[i].id
              resources.push(obj)
            }
            list.resources = resources
            this.selectTreeTag = []
            this.postOptions = []
            supervisorTreeService.queryResourceByFormula(list).then(data => {
              if (data.revoke === 0) {
                this.unCancel = true
              } else {
                this.unCancel = false
              }
              this.queryFirstLeftResource()
              this.selectTreeTag = data.data
              this.postOptions = data.data
              this.editTreeNode(this.treeModel)
              if (this.$route.query.id === '6fa512bf66e211e7b2e4005056bc4879' || this.$route.query.rootNodeId === '6fa512bf66e211e7b2e4005056bc4879') {
                this.resourceForm.nodeName = data.data[0].text
              }
            })
          }
        })
      }
    },
    save: function () {
      this.saveLoading = true
      supervisorTreeService.saveOrder(this.$route.query.tempId).then(data => {
        this.$message({
          showClose: true,
          message: '保存成功!',
          type: 'success'
        })
        this.saveLoading = false
      }).catch(() => {
        this.saveLoading = false
      })
    },
    endTimeChanges: function (item, param) {
      setTimeout(() => {
        if (!item[param] || item[param] === '') {
          item[param] = (new Date()).getTime()
          item[param] = ''
        }
      }, 100)
    },
    beginTimeChanges: function (item, param) {
      setTimeout(() => {
        if (!item[param] || item[param] === '') {
          item[param] = (new Date()).getTime()
          item[param] = ''
        }
      }, 100)
    },
    // 资源详情生效时间
    beginDateChange: function (val) {
      if (Date.parse(val) < Date.parse(new Date())) {
        if (moment(val).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
          this.$message({
            showClose: true,
            message: '生效日期请选择当前日期之后的日期!'
          })
          this.$nextTick(() => {
            this.resourceForm.begin = this.catchDate.beginDate
          })
        }
      }
    },
    // 资源详情失效时间
    endDateChange: function (val) {
      if (Date.parse(val) < Date.parse(new Date())) {
        if (moment(val).format('YYYY-MM-DD') !== moment().format('YYYY-MM-DD')) {
          this.$message({
            showClose: true,
            message: '失效日期请选择当前日期之后的日期!'
          })
          this.$nextTick(() => {
            this.resourceForm.end = this.catchDate.endDate
          })
        }
      }
    },
    dbClick: function (event) {
      if (this.isShow === true) {
        this.ResourceSearching = true
        if (!event.resId) {
          this.ResourceSearching = false
        } else {
          if (this.$route.query.id === '6fa512bf66e211e7b2e4005056bc4879' || this.$route.query.rootNodeId === '6fa512bf66e211e7b2e4005056bc4879') {
            this.selectTreeTag = []
            this.resourceForm.nodeName = event.text
            this.branchName = event.text
            this.nodeEdit = true
          }
          this.addNodeResourceObj.key = this.$route.query.tempId
          this.addNodeResourceObj.resourceId = event.resId
          this.addNodeResourceObj.resourceText = event.text
          supervisorTreeService.addNodeResource(this.addNodeResourceObj).then(data => {
            if (data.revoke === 0) {
              this.unCancel = true
            } else {
              this.unCancel = false
            }
            if (data.data !== null) {
              this.queryFirstLeftResource()
              this.selectTreeTag.push(event)
              this.postOptions.push(event)
            }
          })
        }
      }
    },
    storeUp: function () {
      this.storeUpLoading = true
      supervisorTreeService.laidStore(this.$route.query.tempId).then(data => {
        this.$router.push({
          path: '/supervisor-treeList'
        })
        this.$nextTick(() => {
          this.storeUpLoading = false
        })
      }).catch(() => {
        this.storeUpLoading = false
      })
    },
    confim: function (list) {
      list.major = this.resourceForm.major
      list.assit = this.resourceForm.assit
      this.dataList.lvlCode = list.lvlCode
      this.catchResource = []
      this.confimLoading = true
      if ((this.$route.query.id === '6fa512bf66e211e7b2e4005056bc4879' || this.$route.query.rootNodeId === '6fa512bf66e211e7b2e4005056bc4879') && this.selectTreeTag.length === 0) {
        this.$message({
          showClose: true,
          message: '每个节点必须包含一个资源!'
        })
        this.confimLoading = false
      } else {
        if (!list.end) {
          this.dataList.endDate = ''
        } else {
          this.dataList.endDate = moment(list.end).format('YYYY-MM-DD')
        }
        if (!list.begin) {
          this.dataList.startDate = ''
        } else {
          this.dataList.startDate = moment(list.begin).format('YYYY-MM-DD')
        }
        list.begin = this.dataList.startDate
        list.end = this.dataList.endDate
        if (this.dataList.endDate === '') {
          this.$message({
            showClose: true,
            message: '失效日期不能为空!'
          })
          this.resourceForm.end = ''
          this.confimLoading = false
        } else {
          supervisorTreeService.editIdBydate(this.dataList).then(data => {
            if (data === false) {
              if (list.majorText === '') {
                list.major = null
              }
              if (list.assitText === '') {
                list.assit = null
              }
              list.id = this.queryResource.lvlCode
              list.begin = moment(list.begin).format('YYYY-MM-DD')
              list.end = moment(list.end).format('YYYY-MM-DD')
              if ((list.major === null && !!list.majorText) || (list.major === this.acheMajor && list.majorText !== this.acheMajorText)) {
                this.$message({
                  showClose: true,
                  message: '主管人不存在，请重新选择!'
                })
                this.confimLoading = false
              } else if ((list.assit === null && !!list.assitText) || (list.assit === this.acheAssist && list.assitText !== this.acheAssistText)) {
                this.$message({
                  showClose: true,
                  message: '协管人不存在，请重新选择!'
                })
                this.confimLoading = false
              } else {
                var newList = list
                this.nodeList = _.cloneDeep(list)
                newList.key = this.$route.query.tempId
                newList.relateCnd = this.prplId
                // if (list.bk1 !== '') {
                //   var object = {}
                //   var arr = []
                //   object.bk1 = list.bk1
                //   arr.push(object)
                //   newList.backSet = arr
                // }
                supervisorTreeService.addCheckedDetail(newList).then(data => {
                  this.queryTree()
                  this.pageTree = []
                  this.selectTreeTag = []
                })
                this.isShow = false
                this.confimLoading = false
              }
            } else {
              this.$confirm('此操作子节点将失效, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                var newList = list
                newList.key = this.$route.query.tempId
                newList.relateCnd = this.relateCnd
                newList.prplId = this.prplId
                // if (list.bk1 !== '') {
                //   var object = {}
                //   var arr = []
                //   object.bk1 = list.bk1
                //   arr.push(object)
                //   newList.backSet = arr
                // }
                supervisorTreeService.addCheckedDetail(newList).then(data => {
                  this.queryTree()
                  this.pageTree = []
                  this.selectTreeTag = []
                })
                this.isShow = false
                this.confimLoading = false
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '时间已复原!'
                })
                this.resourceForm.begin = this.catchDate.beginDate
                this.resourceForm.end = this.catchDate.endDate
                this.confimLoading = false
              })
            }
          }).catch(() => {
            this.resourceForm.begin = this.catchDate.beginDate
            this.resourceForm.end = this.catchDate.endDate
            this.confimLoading = false
          })
        }
      }
    },
    editTreeNode: function (node) {
      this.postOptions = []
      this.selectTreeTag = []
      this.editEndTime = false
      if (this.$route.query.id === '6fa512bf66e211e7b2e4005056bc4879') {
        this.nodeEdit = true
      }
      this.showTreeButton = false
      this.treeNode = node
      this.editBeginTime = false
      this.editEndTime = false
      this.isShow = true
      if (this.$route.query.id === '6fa42d7866e211e7b2e4005056bc4879') {
        this.postShow = true
      }
      this.$refs.leftArea.style.width = '260px'
      this.$refs.mainArea.style.left = '260px'
      setTimeout(() => {
        this.isLeftAreaCllapsed = false
        this.isTopShow = false
      }, 400)
      this.queryResource.lvlCode = node.lvlCode
      this.queryResource.key = this.$route.query.tempId
      supervisorTreeService.queryCheckedDetail(this.queryResource).then(data => {
        this.prplId = data.relateCnd
        this.treeResourceDetail = _.cloneDeep(data)
        this.resourceForm.begin = data.begin
        this.resourceForm.end = data.end
        // 复制生效失效时间，后面时间校验用
        this.acheMajorText = _.cloneDeep(data.majorText)
        this.acheAssistText = _.cloneDeep(data.assitText)
        this.acheMajor = _.cloneDeep(data.major)
        this.acheAssist = _.cloneDeep(data.assit)
        this.catchDate.beginDate = _.cloneDeep(data.begin)
        this.catchDate.endDate = _.cloneDeep(data.end)
        this.resourceForm.nodeNo = data.nodeNo
        this.resourceForm.nodeName = data.nodeName
        this.resourceForm.majorStaff = data.majorStaff
        this.resourceForm.majorText = data.majorText
        this.resourceForm.lvlCode = data.lvlCode
        this.resourceForm.assit = data.assit
        this.resourceForm.major = data.major
        this.resourceForm.assitText = data.assitText
        this.resourceForm.nodeDef = data.nodeDef
        this.resourceForm.id = data.id
        this.relateCnd = data.relateCndText
        this.prplId = data.relateCnd
        this.lvlCode = data.lvlCode
        this.addNodeResourceObj.lvlCode = data.lvlCode
        this.branchName = data.nodeName
        // if (data.backSet !== null) {
        //   this.resourceForm.bk1 = data.backSet[0].bk1
        // }
        if (data.resources !== null) {
          this.selectTreeTag = []
          for (var i = 0; i < data.resources.length; i++) {
            this.selectTreeTag.push(data.resources[i])
            this.postOptions.push(data.resources[i])
            this.catchResource = _.cloneDeep(this.selectTreeTag)
          }
        }
        if (data.lvl === 1) {
          this.editBeginTime = true
          if (data.end !== '9999-12-31') {
            this.editEndTime = true
          }
        }/* if (Date.parse(this.resourceForm.begin) < Date.parse(moment().format('YYYY-MM-DD'))) {
          this.editBeginTime = true
        } */
        this.queryFirstLeftResource()
      })
      this.node = node
    },
    cancel: function () {
      this.cancelLoading = true
      this.revokeParams.key = this.$route.query.tempId
      supervisorTreeService.revokeEdit(this.revokeParams).then(data => {
        if (data !== null) {
          if (data.type === 'NODE') {
            this.queryTree()
          } if (data.type === 'DETAIL') {
            this.queryTree()
            this.queryResource.lvlCode = data.code
            this.queryFirstLeftResource()
            this.editTreeNode(this.treeModel)
          }
        } else {
          this.$message({
            showClose: true,
            message: '没有需要撤销的操作!'
          })
        }
        this.$nextTick(() => {
          this.cancelLoading = false
        })
      }).catch(() => {
        this.cancelLoading = false
      })
    },
    createFilter (queryString) {
      return (orginObj) => {
        return (orginObj.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelectMajor: function (data) {
      this.resourceForm.major = data.id
    },
    handleSelectAssist: function (data) {
      this.resourceForm.assit = data.id
    },
    querySearch (queryString, func) {
      this.staffData.resourceClassId = '2d6b8cd2abcb11e78bba005056bc4879'
      this.staffData.resourceValue = queryString
      this.staffObjs = []
      supervisorTreeService.queryStaff(this.staffData).then(data => {
        if (data !== null) {
          for (var i = 0; i < data.length; i++) {
            var everyObj = data[i]
            everyObj.value = data[i].name
            this.staffObjs.push(everyObj)
          }
          var staffObjs = this.staffObjs
          var results = queryString ? staffObjs.filter(this.createFilter(queryString)) : staffObjs
          // 调用 callback 返回建议列表的数据
          func(results)
        } else {
          clearTimeout(this.timeout)
          this.timeout = setTimeout(() => {
            var results = []
            func(results)
          }, 3000 * Math.random())
        }
      })
    },
    close: function () {
      this.catchResource = []
      this.selectTreeTag = []
      this.postOptions = []
      this.resourceForm = _.cloneDeep(this.resourceFormInitInfo)
      this.isShow = false
      this.pageTree = []
      this.queryTree()
    },
    handleClose (tag) {
      // if (tag.resId === this.resourceForm.bk1) {
      //   this.resourceForm.bk1 = ''
      // }
      this.nodeResource.key = this.$route.query.tempId
      this.nodeResource.lvlCode = this.lvlCode
      this.nodeResource.resourceId = tag.resId
      supervisorTreeService.deleteCheckedDetail(this.nodeResource).then(data => {
        if (data.revoke === 0) {
          this.unCancel = true
        } else {
          this.unCancel = false
        }
        this.queryFirstLeftResource()
        for (var j = 0; j < this.selectTreeTag.length; j++) {
          if (this.selectTreeTag[j].resId === tag.resId) {
            this.selectTreeTag.splice(j, 1)
            this.postOptions.splice(j, 1)
            break
          }
        }
      })
    },
    queryTree: function () {
      this.temporaryTree = []
      this.isSearching = true
      this.result = {}
      this.queryTreeData.key = this.$route.query.tempId
      supervisorTreeService.queryTemSupervisorTree(this.queryTreeData).then(newData => {
        this.temporaryTree = _.cloneDeep(newData.data)
        if (newData.revoke === 0) {
          this.unCancel = true
        } else {
          this.unCancel = false
        }
        var data = newData.data
        if (data !== null) {
          for (var i = 0; i < data.length; i++) {
            var arr = []
            arr.push(data[i])
            if (data[i].lvl === 1) {
              var fId = data[i].lvl + 1
              var fCode = data[i].lvlCode
              this.result = data[i]
            }
          }
          this.result.children = []
          this.queryChildren(data, fId, fCode)
        } else {
          this.isSearching = false
          this.treeData = {}
        }
      }).catch(() => {
        this.isSearching = false
      })
    },
    queryChildren: function (data, fId, fCode) {
      var temp = []
      var childrenResult = []
      this.result.children = childrenResult
      for (var j = 0; j < data.length; j++) {
        if (data[j].lvl === fId && data[j].lvlCode.indexOf(fCode) === 0) {
          temp = this.queryChildren(data, data[j].lvl + 1, data[j].lvlCode)
          if (temp.length) {
            data[j].children = temp
          }
          childrenResult.push({nodeName: '', remark: 'up', lvlCode: data[j].lvlCode, seq: data[j].seq, type: '1'})
          childrenResult.push(data[j])
          childrenResult.push({nodeName: '', remark: 'down', lvlCode: data[j].lvlCode, seq: data[j].seq, type: '2'})
        }
      }
      if (childrenResult.length !== 0) {
        var sortArray = childrenResult.sort(this.sortNumber)
        this.result.children = sortArray
      }
      this.treeData = this.result
      this.isSearching = false
      return childrenResult
    },
    sortNumber: function (obj1, obj2) {
      var val1 = obj1.seq
      var val2 = obj2.seq
      var val3 = obj1.remark
      var val4 = obj2.remark
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        if ((!val3 && val4 === 'down') || (val3 === 'up' && (val4 === 'down' || !val4))) {
          return -1
        } else if ((!val3 && val4 === 'up') || (val3 === 'down' && (val4 === 'up' || !val4))) {
          return 1
        } else {
          return 0
        }
      }
    },
    checkTree: function () {
      this.checkTreeLoading = true
      supervisorTreeService.checkSuperviorTree(this.storeData).then(data => {
        if (data === true) {
          this.dialogVisible = true
          this.$nextTick(() => {
            this.checkTreeLoading = false
          })
        } else {
          this.$message({
            showClose: true,
            message: '没有需要校验的资源!'
          })
          this.$nextTick(() => {
            this.checkTreeLoading = false
          })
        }
      }).catch(() => {
        this.checkTreeLoading = false
      })
    },
    checkResource: function () {
      this.checkResourceLoading = true
      supervisorTreeService.checkResource(this.storeData).then(data => {
        this.dialogVisible = false
        this.pageTree = []
        this.queryTree()
        this.isShow = false
        this.$nextTick(() => {
          this.checkResourceLoading = false
        })
      }).catch(() => {
        this.checkResourceLoading = false
      })
    },
    queryFirstLeftResource: function () {
      this.pageTree = []
      var arr = []
      var obj = {}
      this.resourceNull = false
      this.ResourceSearching = true
      this.leftResource.currentPage = 1
      this.leftResource.lvlCode = this.queryResource.lvlCode
      this.leftResource.key = this.$route.query.tempId
      this.leftResource.pageSize = this.CONFIG.page.defaultPageSize
      supervisorTreeService.queryUnDistributed(this.leftResource).then(data => {
        for (var i = 0; i < data.data.length; i++) {
          arr.push(data.data[i])
        }
        if (data.data.length === 15) {
          obj.text = '下拉加载更多...'
          arr.push(obj)
        }
        this.pageTree = arr
        this.count = 1
        this.$nextTick(() => {
          this.ResourceSearching = false
        })
      }).catch(() => {
        this.ResourceSearching = false
      })
    },
    queryLeftResource: function () {
      if (this.isShow === true && this.resourceNull === false) {
        this.scroll = document.getElementById('left-concent').scrollTop
        this.scrollHeight = document.getElementById('left-concent').scrollHeight
        this.offsetHeight = document.getElementById('left-concent').offsetHeight
        if (this.scroll + this.offsetHeight === this.scrollHeight && this.pageTree.length !== 0) {
          this.ResourceSearching = true
          this.leftResource.currentPage = this.count + 1
          this.leftResource.lvlCode = this.queryResource.lvlCode
          this.leftResource.key = this.$route.query.tempId
          this.leftResource.pageSize = this.CONFIG.page.defaultPageSize
          supervisorTreeService.queryUnDistributed(this.leftResource).then(data => {
            if (data.data === null) {
              this.resourceNull = true
              this.pageTree[this.pageTree.length - 1].text = '没有更多的数据了!'
            } else {
              this.resourceNull = false
              for (var i = 0; i < data.data.length; i++) {
                this.pageTree.splice(this.pageTree.length - 1, 0, data.data[i])
              }
              document.getElementById('left-concent').scrollTop = this.scrollHeight - this.offsetHeight - 2
            }
            this.count = this.count + 1
            this.ResourceSearching = false
          }).catch(() => {
            this.ResourceSearching = false
          })
        }
      }
    },
    // 左边菜单的展开和收缩
    leftAreaToggle () {
      if (this.isLeftAreaCllapsed) {
        // 展开
        this.$refs.leftArea.style.width = '260px'
        this.$refs.mainArea.style.left = '260px'
        // 效果快结束时再重置状态
        setTimeout(() => {
          this.isLeftAreaCllapsed = false
          this.isTopShow = false
        }, 400)
      } else {
        // 收缩
        this.$refs.leftArea.style.width = '0px'
        this.$refs.mainArea.style.left = '0px'
        this.isLeftAreaCllapsed = true
        this.isTopShow = true
      }
    },
    preview: function () {
      this.$openDialog({
        name: 'tree-preview',
        component: treePreview,
        options: {
          customClass: 'dialog-width-ml',
          title: '树预览'
        },
        props: {
          id: this.$route.query.tempId,
          rootNodeId: this.$route.query.id,
          addRootNodeId: this.$route.query.rootNodeId
        }
      })
    },
    submitTree: function () {
      this.$openDialog({
        name: 'supervisor-audit',
        component: supervisorAudit,
        options: {
          customClass: 'dialog-width-xxl',
          title: '监管树审核'
        },
        props: {
          temporaryTree: this.temporaryTree,
          endTime: this.$route.query.endTime,
          edmcNameEn: this.$route.query.edmcNameEn,
          rootNodeId: this.$route.query.rootNodeId,
          id: this.$route.query.tempId,
          edmId: this.$route.query.id
        }
      })
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
.filter-tree {
  position: absolute;
  left: 260px;
  top: 120px;
  height: 800px;
  min-width: 100px;
  overflow-y: auto;
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
.cardName {
  height: 30px;
  font-size: 20px;
  text-align: center;
}
.right-card {
  position: relative;
  left:50%;
  margin-left:-225px;
  width: 650px;
  top: 130px;
  box-shadow: 0px 0px 10px #D6D8FF;
  transition: left 0.5s;
  overflow: auto;
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
    font-size: 18px;
    color: #324057;
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