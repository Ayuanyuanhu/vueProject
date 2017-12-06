<template>
<div>
<div class="nav-area nav-background">
  <div class="list-button">监管树清单</div>
  </div>
  <div class="main-area">
  <el-dialog
   title="提示"
   :visible.sync="recoverDialog"
   width="20%"
   center>
   <span>上次对临时单的操作未保存, 是否恢复上一次操作?</span>
   <span slot="footer" class="dialog-footer">
     <el-button type="primary" @click="noRecover">取消</el-button>
     <el-button type="primary" @click="recover">恢复</el-button>
   </span>
   </el-dialog>
     <el-form :inline="true" :model="pageForm">
      <el-form-item label="树名称">
        <el-input v-model="pageForm.treeName" placeholder="树名称"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker type="date" placeholder="选择日期" v-model="pageForm.endTime" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="queryForm(pageForm)" icon="search">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- <el-table :data="pageData" highlight-current-row   v-loading="isSearching" border :style="{width: tableWidth + 'px'}">  -->
    <el-table :data="pageData" highlight-current-row   v-loading="isSearching" border style="width:100%"> 
      <el-table-column align="center" label="序号" width="80" prop="index">
      </el-table-column>
      <el-table-column prop="newEdmcName" align="left" label="树名称" header-align="center" min-width="120">
      <template scope="scope">
      <div v-if="scope.row.type === '0' && scope.row.show === false">
      	<el-button type="text" icon="rx-tianjia" @click="showSubClass(scope.row, scope.$index)"></el-button>
        <span>{{scope.row.newEdmcName}}({{scope.row.count}})</span>
      </div>
      <div v-if="scope.row.type === '0' && scope.row.show === true">
      	<el-button type="text" icon="minus" @click="showSubClass(scope.row, scope.$index)"></el-button>
        <span>{{scope.row.newEdmcName}}({{scope.row.count}})</span>
      </div>
      <div v-if="scope.row.type === '1'"> 
        <span style="margin-left: 10px">{{scope.row.newEdmcName}}</span>	
      </div>
      <div v-if="scope.row.type === '2'">
        <el-button size="small" @click="openTree(scope.row)" type="text" style="margin-left: 30px">
          {{scope.row.newEdmcName}}</el-button>
      </div>
      <div v-if="scope.row.type === '3' && scope.row.show === false">
        <el-button icon="rx-tianjia" @click="showSubVersion(scope.row, scope.$index)" type="text" style="margin-left: 30px"></el-button>
          <span>{{scope.row.newEdmcName}}</span>
      </div>
      <div v-if="scope.row.type === '3' && scope.row.show === true">
        <el-button type="text" icon="minus" @click="showSubVersion(scope.row, scope.$index)" style="margin-left: 30px"></el-button>
        <span>{{scope.row.newEdmcName}}</span>
      </div>
      <div v-if="scope.row.type === '4'">
        <el-button size="small" @click="openTree(scope.row)" type="text" style="margin-left: 60px">
          {{scope.row.newEdmcName}}</el-button>
      </div>
      </template>
      </el-table-column>
      <el-table-column prop="resourceName" label="从属资源" align="left" width="120" header-align="center"></el-table-column>
      <el-table-column  label="卷积属性集" align="center" width="120" header-align="center">
      	<template scope="scope">
        <div v-if="scope.row.type === '0' || scope.row.type === '1'">
          <el-button size="small" @click="openCondetail(scope.row)" type="text">
          卷积明细</el-button>
        </div>	
      	</template>
      </el-table-column>
      <el-table-column prop="beginTime" label="生效日期"  align="center" width="140"></el-table-column>
      <el-table-column prop="endTime" label="失效日期"  align="center" width="140"></el-table-column>
      <el-table-column label="维护" align="center" header-align="center" width="80">
        <template scope="scope">
		      <div v-if="scope.row.type === '0' || scope.row.type === '1'">
		        <el-popover trigger="click" placement="left" width="400" :disabled="isAdd">
          <el-form :model="dataFrom" :label-position="labelPosition" label-width="80px">
		        <span class="addDiag">是否需要从现有的部门树中复制一份进行设置：</span>
			      <el-form-item label="树名称">
			      <el-select v-model="dataFrom.treeId" placeholder="" @change="optionChange">
					    <el-option
					      v-for="item in options"
					      :key="item.rootNodeId"
					      :label="item.rootNodeName"
					      :value="item.rootNodeId"
                >{{item.rootNodeName}}
					    </el-option>
					  </el-select>
			      </el-form-item>
			      <el-form-item label="生效日期">
			        <el-date-picker type="date" disabled v-model="dataFrom.beginTime"  ></el-date-picker>
			      </el-form-item>
			      <el-form-item label="失效日期">
			        <el-date-picker type="date" placeholder="选择日期" v-model="dataFrom.endTime" ></el-date-picker>
			      </el-form-item>
			      <el-form-item>
			        <el-button type="info" @click="copyTree(scope.row)" icon="search" :loading="copyLoading">复制</el-button>
			        <el-button type="info" @click="addTree(scope.row)" icon="search" :loading="addLoading">新增</el-button>
			      </el-form-item>
			    </el-form>
          <div slot="reference">
            <el-button size="small" type="text" @click="treeAdd(scope.row)" :disabled="isTreeAdd">树新增</el-button>
          </div>
        </el-popover>
		      </div>
		      <div v-else-if="scope.row.type === '4' && Date.parse(scope.row.endTime) > Date.parse(new Date())">
		        <el-button size="small" @click="editTree(scope.row)" type="text" :disabled="isEditTree">树维护</el-button>
		      </div>
       </template>
      </el-table-column>
    </el-table>
    </div>
</div>
</template>
<script>
import conDetail from './ConDetail'
import treePreview from './TreePreview'
import { supervisorTreeService } from '@/api'
import moment from 'moment'
import _ from 'lodash'

export default {
  data () {
    return {
      labelPosition: 'right', // 弹出的复制框表单域标签的位置
      recoverDialog: false, // 监管设计器意外关闭恢复框
      isTreeAdd: false, // 树新增按钮是否可用
      isEditTree: false, // 树维护按钮是否可用
      copyLoading: false, // 复制按钮加载效果
      addLoading: false,  // 新增按钮加载效果
      isAdd: true, // 弹出的复制框中新增按钮是否可用
      queryTreeClassParams: {
        beginTime: '', // 生效时间
        endTime: '', // 失效时间
        treeName: '' // 树名称
      }, // 监管树类查询列表参数
      queryTreeParams: {
        beginTime: '', // 开始日期
        endTime: '', // 结束日期
        treeName: '', // 数名称
        edmcNameEn: '', // emd英文名
        edmId: '' // emd id
      }, // 根据监管类英文名查询监管类下的监管树参数
      options: [], // 弹出的复制框中树名称选项
      pageForm: {
        // beginTime: moment(new Date()).format('YYYY-MM-DD'),
        beginTime: '',
        endTime: '',
        treeName: ''
      }, // 查询栏参数
      dataFrom: {
        treeId: '',
        beginTime: '9999-12-31',
        endTime: ''
      }, // 弹出的复制框数据
      subData: [], // 根据监管类英文名查询监管类下的监管树返回数据存放
      pageData: [], // 列表数据
      isSearching: false, // 列表加载效果
      queryTreeTime: {
        edmcNameEn: '',
        classId: ''
      }, // 新增树开始时间查询参数
      addTreeData: {
        beginDate: '',
        classId: '',
        edmcNameEn: '',
        rootEdmcNameEn: '',
        endDate: '',
        rootId: '',
        type: ''
      }, // 新增监管树参数
      editTreeData: {
        classId: '',
        rootEdmcNameEn: '',
        rootId: ''
      }, // 维护监管树参数
      // edmId: '',
      tableWidth: '', // 列表总宽度
      checkOrderObj: {
        classId: '',
        rootId: '',
        type: ''
      }, // 树新增、树维护前的临时单检查参数
      recoverObj: {
        flag: '',
        key: ''
      }, // 进入设计器前提示是否恢复上一步操作
      treeOptions: [], // 根据监管类英文名查询监管类下的监管树数据存放
      dialogList: {},
      dialogData: {}
    }
  },
  components: {
    'convolution-detail': conDetail,
    'tree-preview': treePreview
  },
  created: function () {
    this.queryTreeClassList()
    // if (this.$store.state.windowStore.windowWidth === 1920) {
    //   this.tableWidth = this.$store.state.windowStore.windowWidth - 900
    // } else if (this.$store.state.windowStore.windowWidth < 1920 && this.$store.state.windowStore.windowWidth >= 1600) {
    //   this.tableWidth = this.$store.state.windowStore.windowWidth - 600
    // } else {
    //   this.tableWidth = this.$store.state.windowStore.windowWidth
    // }
  },
  methods: {
    // 弹出复制框中选中数名称后，将树英文名写入新增监管树参数中
    optionChange: function () {
      if (this.treeOptions.length) {
        for (var i = 0; i < this.treeOptions.length; i++) {
          if (this.treeOptions[i].rootNodeId === this.dataFrom.treeId) {
            this.addTreeData.rootEdmcNameEn = this.treeOptions[i].rootEdmcNameEn
          }
        }
      }
    },

    // 新增树
    treeAdd: function (list) {
      this.dialogList = _.cloneDeep(list)
      this.checkOrderObj.classId = list.id
      this.checkOrderObj.type = 1
      supervisorTreeService.checkOrder(this.checkOrderObj).then(data => {
        this.dialogData = _.cloneDeep(data)
        if (data === null) {
          this.isTreeAdd = true
          this.queryTreeTime.edmcNameEn = list.edmcNameEn
          this.queryTreeTime.classId = list.id
          supervisorTreeService.querySuperbeginDate(this.queryTreeTime).then(data => {
            if (data !== null) {
              if (data.type === 1) {
                this.isAdd = false
                this.dataFrom.beginTime = data.date
                this.queryTreeParams.edmId = list.id
                this.queryTreeParams.beginTime = list.beginTime
                this.queryTreeParams.endTime = list.endTime
                this.queryTreeParams.edmcName = list.edmcName
                this.queryTreeParams.edmcNameEn = list.edmcNameEn
                supervisorTreeService.querySupervisorList(this.queryTreeParams).then(datas => {
                  var arr = []
                  var obj = {}
                  for (var i = 0; i < datas.length; i++) {
                    if (datas[i].rootNodes.length) {
                      for (var j = 0; j < datas[i].rootNodes.length; j++) {
                        obj = {}
                        obj.rootNodeName = datas[i].rootNodes[j].rootNodeName + '(' + datas[i].rootNodes[j].beginTime + '~' + datas[i].rootNodes[j].endTime + ')'
                        obj.rootNodeId = datas[i].rootNodes[j].rootNodeId
                        obj.rootEdmcNameEn = datas[i].rootNodes[j].rootEdmcNameEn
                        arr.push(obj)
                      }
                    }
                  }
                  this.options = arr
                  this.treeOptions = _.cloneDeep(arr)
                  if (datas.length !== 0) {
                    this.dataFrom.treeId = arr[0].rootNodeId
                  }
                })
              } else if (data.type === 2) {
                this.isAdd = true
                this.addTree(list)
              } else if (data.type === 3) {
                this.isAdd = true
                this.$alert('存在生效的可维护树，不可再新增树！', '', {
                  confirmButtonText: '确定'
                })
              } else {
                this.isAdd = true
              }
            } else {
              this.isAdd = true
            }
            this.$nextTick(() => {
              this.isTreeAdd = false
            })
          }).catch(() => {
            this.isTreeAdd = false
          })
        } else {
          if (data.flag === true) {
            this.recoverDialog = true
          } else {
            this.$router.push({
              path: '/drag-tree',
              query: {
                endTime: list.endTime,
                resourceName: list.resourceName,
                name: list.newEdmcName,
                resourceEdmId: list.resourceEdmId,
                id: list.id,
                edmId: list.edmId,
                tempId: data.key
              }
            })
          }
        }
      }).catch(() => {
        this.isTreeAdd = false
      })
    },
    // 打开监管类下面的监管树
    showSubClass: function (list, index) {
      var newindex = list.index
      if (list.show === false) {
        this.isSearching = true
        if (this.pageForm.beginTime !== '') {
          this.queryTreeParams.beginTime = moment(this.pageForm.beginTime).format('YYYY-MM-DD')
        } else {
          this.queryTreeParams.beginTime = ''
        }
        if (this.pageForm.endTime !== '') {
          this.queryTreeParams.endTime = moment(this.pageForm.endTime).format('YYYY-MM-DD')
        } else {
          this.queryTreeParams.endTime = ''
        }
        this.queryTreeParams.edmcName = list.newEdmcName + '类'
        this.queryTreeParams.edmcNameEn = list.edmcNameEn
        this.queryTreeParams.edmId = list.id
        this.queryTreeParams.treeName = this.queryTreeClassParams.treeName
        supervisorTreeService.querySupervisorList(this.queryTreeParams).then(data => {
          var arr = []
          for (var m = 0; m < data.length; m++) {
            var object = data[m]
            if (object.count === 0) {
              object.type = '2'
              object.newEdmcName = object.rootNodeName + '(' + list.newEdmcName + ')'
            } else {
              object.type = '3'
              object.show = false
              object.newEdmcName = object.rootNodeName + '(' + list.newEdmcName + '--' + object.versionCode + ')' + '(' + object.count + ')'
            }
            object.classId = list.id
            arr.push(object)
          }
          this.subData = arr
          list.subLength = this.subData.length
          for (var i = 0; i < this.subData.length; i++) {
            this.pageData.splice(index + 1 + i, 0,
              {index: newindex + '.' + (i + 1),
                objArr: _.cloneDeep(data),
                newEdmcName: this.subData[i].newEdmcName,
                resourceName: list.resourceName,
                resourceEdmId: list.resourceEdmId,
                beginTime: this.subData[i].beginTime,
                endTime: this.subData[i].endTime,
                type: this.subData[i].type,
                id: this.subData[i].rootNodeId,
                edmcNameEn: list.edmcNameEn,
                parentId: list.id,
                versionCode: this.subData[i].versionCode,
                show: this.subData[i].show,
                versionCount: this.subData[i].count})
          }
          list.show = true
          this.$nextTick(() => {
            this.isSearching = false
          })
        }).catch(() => {
          this.isSearching = false
        })
      } else {
        let delData = this.findChildren(list.edmId)
        for (var k = 0; k < delData.length; k++) {
          this.pageData.splice(index + 1, 1)
        }
        list.show = false
      }
    },
    findChildren: function (edmId) {
      let delData = []
      for (var i = 0; i < this.pageData.length; i++) {
        if (this.pageData[i].parentId === edmId) {
          delData.push(this.pageData[i])
        }
      }
      return delData
    },
    // 打开版本下面的监管树
    showSubVersion: function (list, index) {
      if (list.show === false) {
        this.isSearching = true
        for (let item of list.objArr) {
          if (item.rootNodeId === list.id) {
            list.subLength = item.rootNodes.length
            for (var i = 0; i < item.rootNodes.length; i++) {
              item.rootNodes[i].type = '4'
              if (item.rootNodes[i].rootNodeName === '') {
                item.rootNodes[i].rootNodeName = '已失效树'
              }
              this.pageData.splice(index + 1 + i, 0,
                {index: list.index + '.' + (i + 1),
                  newEdmcName: item.rootNodes[i].rootNodeName,
                  resourceName: list.resourceName,
                  resourceEdmId: list.resourceEdmId,
                  beginTime: item.rootNodes[i].beginTime,
                  endTime: item.rootNodes[i].endTime,
                  type: item.rootNodes[i].type,
                  id: item.rootNodes[i].rootNodeId,
                  edmcNameEn: item.rootNodes[i].rootEdmcNameEn,
                  parentId: list.parentId,
                  versionCode: item.versionCode})
            }
          }
        }
        list.show = true
        this.isSearching = false
      } else {
        for (var j = 0; j < list.subLength; j++) {
          this.pageData.splice(index + 1, 1)
        }
        list.show = false
      }
    },
    // 打开卷积明细
    openCondetail: function (list) {
      this.$openDialog({
        name: 'convolution-detail',
        component: conDetail,
        options: {
          title: '',
          customClass: 'dialog-width-l'
        },
        props: {
          edmcNameEn: list.edmcNameEn
        }
      })
    },
    // 正式树预览
    openTree: function (list) {
      this.$openDialog({
        name: 'tree-preview',
        component: treePreview,
        options: {
          customClass: 'dialog-width-l',
          title: '树查看'
        },
        props: {
          edmcName: list.newEdmcName,
          edmcNameEn: list.edmcNameEn,
          rootNodeId: list.id,
          edmcId: list.parentId,
          searchEndDate: list.endTime,
          searchBeginDate: list.beginTime,
          resourceName: list.resourceName,
          resourceEdmId: list.resourceEdmId,
          type: '1'
        }
      })
    },
    // 弹出复制框中的新增树
    addTree: function (list) {
      if (this.isAdd === false) {
        this.addLoading = true
        if (this.dataFrom.beginTime !== '') {
          this.addTreeData.beginDate = moment(this.dataFrom.beginTime).format('YYYY-MM-DD')
        }
        if (this.dataFrom.endTime !== '') {
          this.addTreeData.endDate = moment(this.dataFrom.endTime).format('YYYY-MM-DD')
        }
        if (Date.parse(this.addTreeData.beginDate) > Date.parse(this.addTreeData.endDate)) {
          this.$message({
            showClose: true,
            message: '失效时间不能小于生效时间!'
          })
          this.addLoading = false
          this.dataFrom.endTime = ''
        } else {
          this.addTreeData.classId = list.id
          this.addTreeData.edmcNameEn = list.edmcNameEn
          this.addTreeData.rootId = this.dataFrom.treeId
          this.addTreeData.type = 1
          supervisorTreeService.addSuperClassTree(this.addTreeData).then(data => {
            if (data !== null) {
              this.$router.push({
                path: '/drag-tree',
                query: {
                  endTime: list.endTime,
                  name: list.newEdmcName,
                  resourceName: list.resourceName,
                  resourceEdmId: list.resourceEdmId,
                  id: list.id,
                  tempId: data,
                  edmcId: list.edmId,
                  edmcNameEn: list.edmcNameEn
                }
              })
            }
          }).catch(() => {
            this.addLoading = false
          })
        }
      } else {
        this.addTreeData.classId = list.id
        this.addTreeData.edmcNameEn = list.edmcNameEn
        this.addTreeData.rootId = this.dataFrom.treeId
        this.addTreeData.type = 1
        supervisorTreeService.addSuperClassTree(this.addTreeData).then(data => {
          if (data !== null) {
            this.$router.push({
              path: '/drag-tree',
              query: {
                endTime: list.endTime,
                name: list.newEdmcName,
                resourceName: list.resourceName,
                resourceEdmId: list.resourceEdmId,
                id: list.id,
                tempId: data,
                edmcNameEn: list.edmcNameEn
              }
            })
          }
        }).catch(() => {
          this.addLoading = false
        })
      }
    },
    // 进入设计器提示，取消恢复上一步的意外退出操作
    noRecover: function () {
      this.recoverObj.key = this.dialogData.key
      this.recoverObj.flag = false
      supervisorTreeService.recoverTree(this.recoverObj).then(data => {
        this.recoverDialog = false
        this.$router.push({
          path: '/drag-tree',
          query: {
            type: 'edit',
            endTime: this.dialogList.endTime,
            name: this.dialogList.newEdmcName,
            resourceName: this.dialogList.resourceName,
            resourceEdmId: this.dialogList.resourceEdmId,
            id: this.dialogList.parentId,
            tempId: data,
            edmcNameEn: this.dialogList.edmcNameEn,
            rootNodeId: this.dialogList.id
          }
        })
      }).catch(() => {
        this.isEditTree = false
      })
    },
    // 进入设计器提示，恢复上一步的意外退出操作
    recover: function () {
      this.recoverObj.key = this.dialogData.key
      this.recoverObj.flag = true
      supervisorTreeService.recoverTree(this.recoverObj).then(data => {
        this.recoverDialog = false
        this.$router.push({
          path: '/drag-tree',
          query: {
            type: 'edit',
            endTime: this.dialogList.endTime,
            name: this.dialogList.newEdmcName,
            resourceName: this.dialogList.resourceName,
            resourceEdmId: this.dialogList.resourceEdmId,
            id: this.dialogList.parentId,
            tempId: data,
            edmcNameEn: this.dialogList.edmcNameEn,
            rootNodeId: this.dialogList.id
          }
        })
      }).catch(() => {
        this.isEditTree = false
      })
    },
    // 树维护
    editTree: function (list) {
      this.dialogList = _.cloneDeep(list)
      this.checkOrderObj.classId = list.parentId
      this.checkOrderObj.rootId = list.id
      this.checkOrderObj.type = 2
      supervisorTreeService.checkOrder(this.checkOrderObj).then(data => {
        this.dialogData = _.cloneDeep(data)
        if (data !== null) {
          if (data.flag === true) {
            this.recoverDialog = true
          } else {
            this.$router.push({
              path: '/drag-tree',
              query: {
                type: 'edit',
                endTime: list.endTime,
                name: list.newEdmcName,
                resourceName: list.resourceName,
                resourceEdmId: list.resourceEdmId,
                id: list.parentId,
                tempId: data.key,
                edmcNameEn: list.edmcNameEn,
                rootNodeId: list.id
              }
            })
          }
        } else {
          this.isEditTree = true
          this.editTreeData.classId = list.parentId
          this.editTreeData.rootEdmcNameEn = this.queryTreeParams.edmcNameEn
          this.editTreeData.rootId = list.id
          supervisorTreeService.editClassTree(this.editTreeData).then(data => {
            if (data !== null) {
              this.$router.push({
                path: '/drag-tree',
                query: {
                  type: 'edit',
                  endTime: list.endTime,
                  name: list.newEdmcName,
                  resourceName: list.resourceName,
                  resourceEdmId: list.resourceEdmId,
                  id: list.parentId,
                  tempId: data,
                  edmcNameEn: list.edmcNameEn,
                  rootNodeId: list.id
                }
              })
            }
            this.isEditTree = false
          }).catch(() => {
            this.isEditTree = false
          })
        }
      })
    },
    // 复制树
    copyTree: function (list) {
      this.copyLoading = true
      this.addTreeData.beginDate = moment(this.dataFrom.beginTime).format('YYYY-MM-DD')
      if (this.dataFrom.endTime !== '') {
        this.addTreeData.endDate = moment(this.dataFrom.endTime).format('YYYY-MM-DD')
      }
      if (Date.parse(this.addTreeData.beginDate) > Date.parse(this.addTreeData.endDate)) {
        this.$message({
          showClose: true,
          message: '失效时间不能小于生效时间!'
        })
        this.copyLoading = false
      } else {
        this.addTreeData.classId = list.id
        this.addTreeData.edmcNameEn = list.edmcNameEn
        this.addTreeData.rootId = this.dataFrom.treeId
        this.addTreeData.type = 2
        supervisorTreeService.addSuperClassTree(this.addTreeData).then(data => {
          if (data !== null) {
            this.$router.push({
              path: '/drag-tree',
              query: {
                type: '1',
                endTime: list.endTime,
                name: list.newEdmcName,
                resourceName: list.resourceName,
                resourceEdmId: list.resourceEdmId,
                id: list.id,
                tempId: data
              }
            })
          }
          this.$nextTick(() => {
            this.copyLoading = false
          })
        }).catch(() => {
          this.copyLoading = false
        })
      }
    },
    // 查询栏查询
    queryForm: function (list) {
      if (list.beginTime !== '') {
        this.queryTreeClassParams.beginTime = moment(list.beginTime).format('YYYY-MM-DD')
      }
      if (list.endTime !== '') {
        this.queryTreeClassParams.endTime = moment(list.endTime).format('YYYY-MM-DD')
      } else {
        this.queryTreeClassParams.endTime = ''
      }
      this.queryTreeClassParams.treeName = list.treeName.replace(/(^\s*)|(\s*$)/g, '')
      if (Date.parse(this.queryTreeClassParams.beginTime) > Date.parse(this.queryTreeClassParams.endTime)) {
        this.$message({
          showClose: true,
          message: '失效时间不能小于生效时间!'
        })
      } else {
        this.queryTreeClassList()
      }
    },
    // 查询监管树类列表
    queryTreeClassList: function () {
      this.isSearching = true
      var arr = []
      supervisorTreeService.querySupervisorClass(this.queryTreeClassParams).then(data => {
        for (var i = 0; i < data.data.length; i++) {
          var object = data.data[i]
          object.index = i + 1
          object.edmId = object.id
          object.newEdmcName = object.edmcName.substring(0, object.edmcName.length - 1)
          object.show = false
          object.subLength = ''
          if (data.data[i].count) {
            object.type = '0'
          } else {
            object.type = '1'
          }
          arr.push(object)
        }
        this.pageData = arr
        this.$nextTick(() => {
          this.isSearching = false
        })
      }).catch(() => {
        this.isSearching = false
      })
    }
  }
}
</script>
<style scoped>
.addDiag {
  line-height: 36px;
  font-size: 14px;
}
</style>
