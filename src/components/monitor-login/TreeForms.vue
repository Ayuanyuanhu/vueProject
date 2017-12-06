<template>
<div>
<div class="nav-area nav-background">
  <div class="list-button">树统计报表</div>
  </div>
  <div class="main-area">
  <el-form :inline="true" :model="pageForm">
      <el-form-item>
        <el-select v-model="pageForm.departmentId" style="width:100px;" @change="departmentChange($event)">
	    <el-option
	      v-for="item in optionTree"
	      :key="item.id"
	      :label="item.edmcName"
	      :value="item.id">{{item.edmcName}}
	    </el-option>
	  </el-select>
      </el-form-item>
      <el-form-item>
        <el-input icon="view" @click="viewTree" v-model="pageForm.treeName"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-checkbox v-model="checked">含下级</el-checkbox>
      </el-form-item> -->
      <el-form-item label="指标名称">
        <el-input v-model="pageForm.attrName" icon="view" @click="viewAttribute" placeholder="指标名称"></el-input>
      </el-form-item>
      <el-form-item label="财年">
        <el-select v-model="pageForm.yearId" placeholder="" @change="yearChange($event)">
	    <el-option
	      v-for="item in optionYear"
	      :key="item.id"
	      :label="item.peid006"
	      :value="item.id">{{item.peid006}}
	    </el-option>
	  </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="query()" icon="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="pageData" border class="tree-table" v-loading="isSearching">
    	<el-table-column type="index" label="序号" width="150" align="center">
	    </el-table-column>
	    <el-table-column prop="nodeName"  :label="departmentName" width="300" header-align="center">
	    <template scope="scope">
	    	<div v-if="scope.row.show === false">
      	<el-button type="text" :style="{'margin-left': (scope.row.level - 1) * indent + 'px'}" icon="rx-tianjia" @click="showSubTree(scope.row, scope.$index)"></el-button>
        <span>{{scope.row.nodeName}}</span>
      </div>
      <div v-if="scope.row.show === true">
      	<el-button type="text" :style="{'margin-left': (scope.row.level - 1) * indent + 'px'}"  icon="minus" @click="showSubTree(scope.row, scope.$index)"></el-button>
        <span>{{scope.row.nodeName}}</span>
      </div>
	    </template>
	    </el-table-column>
	    <el-table-column  label="指标名称" width="200" align="left" header-align="center">
	    <template scope="scope">
      <div v-for="item in scope.row.statistics">
	    	<span class="firstBorder" :rowspan="item.attrName">{{item.attrName}}</span>
      </div>
	    </template>
	    </el-table-column>
	    <el-table-column label="当月" align="center">
	      <el-table-column label="月规划"  align="right" header-align="center">
	      <template scope="scope">
	      <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.month">{{item.month}}</span>
         </div>
	      </template>
	      </el-table-column>
	      <el-table-column  label="日值"  align="right" header-align="center">
	      <template scope="scope">
	       <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.dayValue">{{item.dayValue}}</span>
         </div>
	      </template>
	      </el-table-column>
	      <el-table-column label="月值"  align="right" header-align="center">
	      <template scope="scope">
	       <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.monthValue">{{item.monthValue}}</span>
         </div>
	      </template>
	      </el-table-column>
	      <el-table-column  label="环比(%)"  align="right" header-align="center">
	      <template scope="scope">
	       <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.monthLinkRelativeRatio">{{item.monthLinkRelativeRatio}}</span>
         </div>
	      </template>
	      </el-table-column>
	      <el-table-column label="同比(%)" align="right" header-align="center">
	      <template scope="scope">
	       <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.monthLearOnYear">{{item.monthLearOnYear}}</span>
         </div>
	      </template>
	      </el-table-column>
	    </el-table-column>
	    <el-table-column :label="yearCount" align="center">
	      <el-table-column label="财年规划" align="right" header-align="center">
	      <template scope="scope">
	       <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.plan">{{item.plan}}</span>
         </div>
	      </template>
	      </el-table-column>
	      <el-table-column label="累计规划" align="right" header-align="center">
	      <template scope="scope">
	       <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.plan">{{item.plan}}</span>
         </div>
	      </template>
	      </el-table-column>
	      <el-table-column label="累计统计" align="right" header-align="center">
	      <template scope="scope">
	       <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.queryMonthValue">{{item.queryMonthValue}}</span>
         </div>
	      </template>
	      </el-table-column>
	      <el-table-column  label="同比(%)"  align="right" header-align="center">
	      <template scope="scope">
	       <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.queryMonthLinkRelativeRatio">{{item.queryMonthLinkRelativeRatio}}</span>
         </div>
	      </template>
	      </el-table-column>
	      <el-table-column label="完成(%)" align="right" header-align="center">
	      <template scope="scope">
	       <div v-for="item in scope.row.statistics">
        <span class="firstBorder" :rowspan="item.ok">{{item.ok}}</span>
         </div>
	      </template>
	      </el-table-column>
	    </el-table-column>
    </el-table>
    </div>
</div>
</template>
<script>
import departmentTree from './DepartmentTree'
import { treeFormService, supervisorTreeService } from '@/api'
import attributeForm from './AttributeForm'
import _ from 'lodash'

export default {
  data () {
    return {
      indent: 30,
      checked: false,
      isSearching: false,
      pageData: [],
      subData: [],
      optionTree: [],
      optionYear: [],
      pageForm: {
        departmentId: '',
        treeName: '',
        attrName: '',
        yearId: ''
      },
      queryData: {
        // 属性id列表
        attributeIds: [],
        // 所属监管类id
        monitorId: '',
        // 周期类id
        periodId: '',
        // 监管树英文名
        edmcNameEn: '',
        // 当前节点
        treeNode: {
          nodeId: '',
          nodeName: ''
        },
        type: ''
      },
      queryTreeData: {
        edmcNameEn: '',
        rootNodeId: '',
        searchDate: ''
      },
      queryTreeClassParams: {
        beginTime: '',
        endTime: '',
        treeName: ''
      },
      treeData: [],
      departmentName: '',
      yearCount: '',
      level: 2,
      childLength: 0,
      nodeId: '',
      nodeName: ''
    }
  },
  created: function () {
    this.queryYear()
    this.queryDepartment()
  },
  components: {
    'department-tree': departmentTree,
    'attribute-form': attributeForm
  },
  methods: {
    departmentChange: function (value) {
      for (var i = 0; i < this.optionTree.length; i++) {
        if (this.optionTree[i].id === value) {
          this.queryTreeData.edmcNameEn = this.optionTree[i].edmcNameEn
          this.departmentName = this.optionTree[i].edmcName
          this.pageForm.treeName = ''
          this.pageForm.attrName = ''
        }
      }
    },
    yearChange: function (value) {
      for (var i = 0; i < this.optionYear.length; i++) {
        if (this.optionYear[i].id === value) {
          this.yearCount = '财年累计' + '(' + this.optionYear[i].peid006 + ')'
        }
      }
    },
    queryDepartment: function () {
      supervisorTreeService.querySupervisorClass(this.queryTreeClassParams).then(data => {
        this.optionTree = data.data
        if (data.data !== null) {
          this.pageForm.departmentId = this.optionTree[0].id
          this.queryTreeData.edmcNameEn = this.optionTree[0].edmcNameEn
          this.departmentName = this.optionTree[0].edmcName
        }
      })
    },
    /* 部门树查询选择 */
    viewTree: function () {
      this.$openDialog({
        name: 'department-tree',
        component: departmentTree,
        options: {
          title: '',
          customClass: 'dialog-width-m'
        },
        props: {
          edmcNameEn: this.queryTreeData.edmcNameEn
        },
        events: {
          selectDeparTree: this.selectDeparTree
        }
      })
    },
    selectDeparTree: function (data) {
      this.$closeDialog('department-tree')
      this.pageForm.treeName = data.moni002
      this.nodeId = data.id
      this.nodeName = data.moni002
    },
    viewAttribute: function () {
      this.$openDialog({
        name: 'attribute-form',
        component: attributeForm,
        options: {
          title: '',
          customClass: 'dialog-width-m'
        },
        props: {
          edmcNameEn: this.queryTreeData.edmcNameEn
        },
        events: {
          selectAttribute: this.selectAttribute
        }
      })
    },
    selectAttribute: function (data) {
      this.queryData.attributeIds = []
      this.$closeDialog('attribute-form')
      var arr = []
      var obj = {}
      for (var i = 0; i < data.length; i++) {
        arr.push(data[i].edmpName)
        obj = {}
        obj.attrId = data[i].id
        obj.attrName = data[i].edmpName
        this.queryData.attributeIds.push(obj)
      }
      this.pageForm.attrName = arr.join(',')
    },
    showSubTree: function (list, index) {
      var newindex = list.index
      if (list.show === false) {
        this.queryData.treeNode.nodeId = list.nodeId
        this.queryData.treeNode.nodeName = list.nodeName
        this.queryData.monitorId = this.pageForm.departmentId
        this.queryData.periodId = this.pageForm.yearId
        this.queryData.edmcNameEn = this.queryTreeData.edmcNameEn
        if (this.queryData.treeNode.nodeId === '' || this.queryData.attributeIds === [] || this.queryData.monitorId === '' ||
        this.queryData.periodId === '') {
          this.$message({
            showClose: true,
            message: '监管树，财年，指标查询条件不可为空!'
          })
        } else {
          this.isSearching = true
          var obj = {}
          var arr = []
          this.queryData.type = '1'
          this.subData = []
          treeFormService.queryTreeForm(this.queryData).then(data => {
            for (var j = 0; j < data.treeNode.childNodes.length; j++) {
              obj = data.treeNode.childNodes[j]
              obj.show = false
              arr.push(obj)
            }
            this.level = list.level + 1
            for (var m = 0; m < arr.length; m++) {
              arr[m].level = this.level
            }
            this.subData = arr
            for (var i = 0; i < this.subData.length; i++) {
              this.pageData.splice(index + 1 + i, 0,
                {
                  index: newindex + '.' + (i + 1),
                  nodeName: this.subData[i].moni002,
                  nodeId: this.subData[i].id,
                  statistics: this.subData[i].statistics,
                  show: this.subData[i].show,
                  level: this.subData[i].level,
                  parent: list.nodeId
                }
              )
            }
            list.show = true
            this.$nextTick(() => {
              this.isSearching = false
            })
          }).catch(() => {
            this.isSearching = false
          })
        }
      } else {
        let delData = this.findChildren(list.nodeId)
        for (var k = 0; k < delData.length; k++) {
          for (var n = 0; n < this.pageData.length; n++) {
            if (this.pageData[n].nodeId === delData[k].nodeId) {
              this.pageData.splice(n, 1)
            }
          }
        }
        list.show = false
      }
    },
    findChildren: function (nodeId) {
      let delData = []
      for (var i = 0; i < this.pageData.length; i++) {
        if (this.pageData[i].parent && this.pageData[i].parent === nodeId) {
          delData.push(this.pageData[i])
          let subDelData = this.findChildren(this.pageData[i].nodeId)
          delData = _.concat(delData, subDelData)
        }
      }
      return delData
    },
    queryYear: function () {
      treeFormService.queryYears().then(data => {
        this.optionYear = data.dataset
        if (data.dataset.length !== 0) {
          this.pageForm.yearId = data.dataset[0].id
          this.yearCount = '财年累计' + '(' + data.dataset[0].peid006 + ')'
        }
      })
    },
    query: function () {
      this.level = 2
      this.queryData.monitorId = this.pageForm.departmentId
      this.queryData.periodId = this.pageForm.yearId
      this.queryData.edmcNameEn = this.queryTreeData.edmcNameEn
      this.queryData.treeNode.nodeId = this.nodeId
      this.queryData.treeNode.nodeName = this.nodeName
      if (this.nodeId === '' || this.queryData.attributeIds === [] || this.queryData.monitorId === '' ||
      this.queryData.periodId === '') {
        this.$message({
          showClose: true,
          message: '监管树，财年，指标查询条件不可为空!'
        })
      } else {
        this.isSearching = true
        var obj = {}
        var arr = []
        this.queryData.type = '0'
        treeFormService.queryTreeForm(this.queryData).then(data => {
          this.isSearching = false
          obj = data.treeNode
          obj.show = false
          obj.level = 1
          obj.index = 1
          arr.push(obj)
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
}
</script>
<style scoped>
.firstBorder {
	display:block;
  border-bottom: 1px solid #dfe6ec;
  height: 35px;
  line-height: 35px;
}
</style>
