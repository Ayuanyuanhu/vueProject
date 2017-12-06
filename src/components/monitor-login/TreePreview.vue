<template>
	<div>
		<el-form :inline="true">
			<el-form-item label="">
				<el-input placeholder="请输入内容" v-model="selectName" style="width:130px;"></el-input>
			</el-form-item>
			<el-form-item v-show="resourceShow">
             <el-checkbox v-model="checked" @change="onChecked($event)" :disabled="clickTiwce">含资源</el-checkbox>
            </el-form-item>
            <el-form-item label="日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="beginDate"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="query()" >查询</el-button>
      </el-form-item>
		</el-form>
    <div v-loading="isSearching">
		<el-tree class="filter-tree"
		:data="treeData"
		:props="defaultProps"
		node-key="id"
		:default-expand-all="true"
		:expand-on-click-node="false"
		:filter-node-method="filterNode"
		ref="tree"
    :render-content="renderContent"
		>
		</el-tree>
    </div>
	</div>
</template>
<script>
import { supervisorTreeService } from '@/api'
import moment from 'moment'
import _ from 'lodash'

export default {
  props: ['dataIn'],
  data () {
    return {
      clickTiwce: false,
      resourceShow: true,
      ids: [],
      selectName: '',
      checked: '',
      beginDate: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      isSearching: false,
      queryInData: {
        nodes: '',
        classId: ''
      },
      queryTreeData: {
        edmId: '',
        flag: '',
        rootEdmcNameEn: '',
        rootNodeId: '',
        searchDate: ''
      },
      queryTemTreeData: {
        flag: '',
        type: 2,
        key: '',
        validDate: ''
      },
      showResource: false,
      result: [],
      oldTreeData: [],
      newTreeData: [],
      idObj: '',
      queryType: false
    }
  },
  watch: {
    selectName (val) {
      this.$refs.tree.filter(val)
    }
  },
  created: function () {
    if (this.dataIn.rootNodeId === '6fa512bf66e211e7b2e4005056bc4879' || this.dataIn.edmcId === '6fa512bf66e211e7b2e4005056bc4879' || this.dataIn.addRootNodeId === '6fa512bf66e211e7b2e4005056bc4879') {
      this.resourceShow = false
    }
    this.queryTree(this.dataIn)
  },
  methods: {
    renderContent: function (h, { node, data, store }) {
      if (this.showResource === true) {
        if (node.data.text) {
          return h('span', {
            'class': {
              'el-tree-node__content': true
            },
            style: {
              'margin-top': '20px'
            }
          },
            [h('span', {
              'class': {
                tooltip: true
              }
            }),
              h('span', {
                domProps: {
                  innerHTML: node.data.nodeName
                },
                style: {
                  'color': '#13CE66'
                }
              })
            ]
          )
        } else {
          return h('span', {
            'class': {
              'el-tree-node__content': true
            },
            style: {
              'margin-top': '20px'
            }
          },
            [h('span', {
              'class': {
                tooltip: true
              }
            }),
              h('span', {
                domProps: {
                  innerHTML: node.data.nodeName
                }
              })
            ]
          )
        }
      } else {
        return h('span', {
          'class': {
            tooltip: true
          }
        },
          [h('span', node.data.nodeName)
          ]
        )
      }
    },
    filterNode (value, data) {
      if (!value) return true
      return data.nodeName.indexOf(value) !== -1
    },
    queryChildren: function (data, fId, fCode) {
      var temp = []
      var childrenResult = []
      for (var j = 0; j < data.length; j++) {
        if (data[j].lvl === fId && data[j].lvlCode.indexOf(fCode) === 0) {
          temp = this.queryChildren(data, data[j].lvl + 1, data[j].lvlCode)
          if (temp.length) {
            data[j].children = temp
          }
          childrenResult.push(data[j])
        }
      }
      var sortArray = childrenResult.sort(this.sortNumber)
      this.result[0].children = sortArray
      this.treeData = this.result
      this.isSearching = false
      this.clickTiwce = false
      return childrenResult
    },
    sortNumber: function (obj1, obj2) {
      var val1 = obj1.seq
      var val2 = obj2.seq
      var val3 = obj1.isRes
      var val4 = obj2.isRes
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        if (!val3) {
          return -1
        } else if (!val4) {
          return 1
        } else {
          return 0
        }
      }
    },
    query: function (list) {
      this.result = []
      this.selectName = ''
      this.queryType = true
      if (this.checked === true) {
        var flag = {}
        flag.target = {}
        this.checked = false
        this.onChecked(flag)
      } else {
        this.queryTree(this.dataIn)
      }
    },
    sortSeq: function (obj1, obj2) {
      var val1 = obj1.seq
      var val2 = obj2.seq
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    },
    queryTree: function (list) {
      if (!this.beginDate) {
        this.beginDate = ''
      }
      var arr = []
      this.isSearching = true
      var newDate = new Date()
      if (list.type === '1') {
        var data = []
        this.queryTreeData.rootEdmcNameEn = list.edmcNameEn
        this.queryTreeData.rootNodeId = list.rootNodeId
        this.queryTreeData.flag = true
        this.queryTreeData.edmId = list.edmcId
        if (this.queryType === true) {
          if (this.beginDate !== '') {
            this.queryTreeData.searchDate = moment(this.beginDate).format('YYYY-MM-DD')
          } else {
            this.queryTreeData.searchDate = ''
          }
        } else {
          var searchDate = moment(newDate).format('YYYY-MM-DD')
          if (Date.parse(list.searchBeginDate) >= Date.parse(searchDate)) {
            this.queryTreeData.searchDate = list.searchBeginDate
            this.beginDate = list.searchBeginDate
          } else if (Date.parse(list.searchBeginDate) < Date.parse(searchDate) && Date.parse(list.searchEndDate) > Date.parse(searchDate)) {
            this.queryTreeData.searchDate = searchDate
            this.beginDate = searchDate
          } else {
            this.queryTreeData.searchDate = list.searchEndDate
            this.beginDate = list.searchEndDate
          }
        }
        if (this.queryTreeData.searchDate === '') {
          this.$message({
            showClose: true,
            message: '请输入查询日期!'
          })
          this.isSearching = false
        } else {
          this.treeData = []
          supervisorTreeService.querySupervisorTree(this.queryTreeData).then(oldData => {
            if (oldData !== null) {
              if (this.showResource === true) {
                data = this.newTreeData
              } else {
                data = oldData.nodes
                this.oldTreeData = _.cloneDeep(oldData)
              }
              for (var i = 0; i < data.length; i++) {
                arr.push(data[i])
                arr[i].lvl = arr[i].moni_lvl
                arr[i].nodeName = arr[i].moni_node_name
                arr[i].seq = arr[i].moni_seq
                arr[i].lvlCode = arr[i].moni_lvl_code
                if (arr[i].lvl === 1) {
                  var fId = arr[i].lvl + 1
                  var fCode = arr[i].lvlCode
                  this.result.push(arr[i])
                }
              }
              this.result.children = []
              this.queryChildren(arr, fId, fCode)
            } else {
              this.isSearching = false
            }
          }).catch(() => {
            this.isSearching = false
          })
        }
      } else {
        this.treeData = []
        this.queryTemTreeData.key = this.dataIn.id
        this.queryTemTreeData.flag = true
        if (this.beginDate !== '') {
          this.queryTemTreeData.validDate = moment(this.beginDate).format('YYYY-MM-DD')
        } else {
          this.queryTemTreeData.validDate = ''
        }
        supervisorTreeService.queryTemSupervisorTree(this.queryTemTreeData).then(data => {
          var Indata = data.data
          if (this.showResource === true) {
            var sortArray = Indata.sort(this.sortSeq)
            var newData = _.cloneDeep(sortArray)
            for (var s = 0; s < sortArray.length; s++) {
              if (sortArray[s].resources !== null) {
                var resArr = sortArray[s].resources
                for (var p = 0; p < resArr.length; p++) {
                  var obj = resArr[p]
                  obj.lvlCode = sortArray[s].lvlCode + 'resource'
                  if (sortArray[s].children) {
                    obj.lvl = sortArray[s].children[0].lvl
                    obj.seq = sortArray[s].children[0].seq
                  } else {
                    obj.lvl = sortArray[s].lvl + 1
                    obj.seq = 0
                  }
                  obj.isRes = true
                  obj.nodeName = obj.text
                  newData.push(obj)
                }
              }
            }
          } else {
            newData = Indata
            this.oldTreeData = _.cloneDeep(Indata)
          }
          for (var j = 0; j < newData.length; j++) {
            if (newData[j].lvl === 1) {
              var temFId = newData[j].lvl + 1
              var temFCode = newData[j].lvlCode
              this.result.push(newData[j])
            }
          }
          this.queryChildren(newData, temFId, temFCode)
        }).catch(() => {
          this.isSearching = false
        })
      }
    },
    onChecked: function (value) {
      this.clickTiwce = true
      this.isSearching = true
      this.selectName = ''
      var flag = value.target.checked
      if (flag === true) {
        if (this.dataIn.type === '1') {
          this.showResource = true
          if (this.oldTreeData.resources !== []) {
            var data = this.oldTreeData.resources
            var unData = this.oldTreeData.nodes
            let arr = unData
            for (var i = 0; i < unData.length; i++) {
              for (var m = 0; m < data.length; m++) {
                if (data[m].nodeId === unData[i].id) {
                  let newNode = _.cloneDeep(data[m])
                  newNode.moni_node_name = data[m].text
                  newNode.isRes = true
                  newNode.moni_lvl = arr[i].moni_lvl + 1
                  newNode.moni_seq = 0
                  newNode.moni_lvl_code = arr[i].moni_lvl_code + 'resource'
                  arr.push(newNode)
                }
              }
            }
            this.newTreeData = arr
            this.result = []
            this.queryTree(this.dataIn)
          }
        } else {
          this.showResource = true
          this.result = []
          this.queryTree(this.dataIn)
        }
      } else {
        this.showResource = false
        this.newTreeData = this.oldTreeData
        this.result = []
        this.queryTree(this.dataIn)
      }
    }
  }
}

</script>

<style scoped>
.filter-tree {
  height: 300px;
  overflow-y: auto;
}
</style>
