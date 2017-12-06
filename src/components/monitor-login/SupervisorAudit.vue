<template>
  <div>
      <el-tree class="filter-tree"
    :data="treeData"
    :props="defaultProps"
    node-key="id"
    :default-expand-all="true"
    :expand-on-click-node="false"
    ref="tree"
    :render-content = "renderContent"
    v-loading="isSearching">
    </el-tree>
    <div class="colorView">
    <div class="item">
      <div class="addLi"></div>
      <div class="editLi"></div>
      <div class="deleteLi"></div>
    </div>
    <div class="item">
      <div class="identify">新增</div>
      <div class="identify">修改</div>
      <div class="identify">删除</div>
    </div>
  </div>
  <el-tree class="filter-newTree"
    :data="treeNewData"
    node-key="id"
    :default-expand-all="true"
    :expand-on-click-node="false"
    ref="tree"
    :render-content="renderNewContent"
    v-loading="isSearching">
    </el-tree>
</div>
 </template>

<script>
import { supervisorTreeService } from '@/api'

export default {
  props: ['dataIn'],
  data () {
    return {
      isSearching: false,
      treeData: [],
      treeNewData: [],
      defaultProps: {
        children: 'children',
        label: 'moni_node_name'
      },
      queryFormal: {
        edmId: '',
        flag: false,
        rootEdmcNameEn: '',
        rootNodeId: '',
        searchDate: ''
      },
      queryTemporary: {
        flag: false,
        key: '',
        type: 1,
        validDate: ''
      },
      formalTree: [],
      temporaryTree: [],
      result: [],
      newResult: []
    }
  },
  created: function () {
    this.queryTreeData()
    if (this.dataIn.temporaryTree.length) {
      this.queryNewTree(this.dataIn.temporaryTree)
    }
  },
  methods: {
    queryTreeData: function () {
      this.isSearching = true
      this.temporaryTree = []
      this.queryFormal.edmId = this.dataIn.edmId
      this.queryFormal.rootEdmcNameEn = this.dataIn.edmcNameEn
      this.queryFormal.rootNodeId = this.dataIn.rootNodeId
      this.queryFormal.searchDate = this.dataIn.endTime
      supervisorTreeService.querySupervisorTree(this.queryFormal).then(data => {
        var arr = []
        if (this.dataIn.temporaryTree.length && data.nodes.length) {
          for (var i = 0; i < data.nodes.length; i++) {
            var obj = data.nodes[i]
            for (var j = 0; j < this.dataIn.temporaryTree.length; j++) {
              if (this.dataIn.temporaryTree[j].nodeNo === obj.moni_node_no) {
                obj.type = 2
              }
            }
            arr.push(obj)
          }
        }
        this.queryTree(arr)
      }).catch(() => {
        this.isSearching = false
      })
    },
    queryTree: function (data) {
      this.treeData = []
      for (var j = 0; j < data.length; j++) {
        if (data[j].moni_lvl === 1) {
          var temFId = data[j].moni_lvl + 1
          var temFCode = data[j].moni_lvl_code
          this.result.push(data[j])
        }
      }
      this.queryChildren(data, temFId, temFCode)
    },
    queryChildren: function (data, fId, fCode) {
      var temp = []
      var childrenResult = []
      for (var j = 0; j < data.length; j++) {
        if (data[j].moni_lvl === fId && data[j].moni_lvl_code.indexOf(fCode) === 0) {
          temp = this.queryChildren(data, data[j].moni_lvl + 1, data[j].moni_lvl_code)
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
      return childrenResult
    },
    sortNumber: function (obj1, obj2) {
      var val1 = obj1.moni_seq
      var val2 = obj2.moni_seq
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    },
    queryNewTree: function (data) {
      this.treeNewData = []
      for (var j = 0; j < data.length; j++) {
        if (data[j].lvl === 1) {
          var temFId = data[j].lvl + 1
          var temFCode = data[j].lvlCode
          this.newResult.push(data[j])
        }
      }
      this.queryNewChildren(data, temFId, temFCode)
    },
    queryNewChildren: function (data, fId, fCode) {
      var temp = []
      var childrenResult = []
      for (var j = 0; j < data.length; j++) {
        if (data[j].lvl === fId && data[j].lvlCode.indexOf(fCode) === 0) {
          temp = this.queryNewChildren(data, data[j].lvl + 1, data[j].lvlCode)
          if (temp.length) {
            data[j].children = temp
          }
          childrenResult.push(data[j])
        }
      }
      var sortArray = childrenResult.sort(this.sortNewNumber)
      this.newResult[0].children = sortArray
      this.treeNewData = this.newResult
      this.isSearching = false
      return childrenResult
    },
    sortNewNumber: function (obj1, obj2) {
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
    renderContent: function (h, {node, data, store}) {
      if (node.data.type === 2) {
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
                innerHTML: node.data.moni_node_name
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
                innerHTML: node.data.moni_node_name
              },
              style: {
                'color': '#DC143C'
              }
            })
          ]
        )
      }
    },
    renderNewContent: function (h, {node, data, store}) {
      if (node.data.type === 1) {
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
                'color': '#0000FF'
              }
            })
          ]
        )
      } else if (node.data.type === 2) {
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
                'color': '#00CD00'
              }
            })
          ]
        )
      } else if (node.data.type === 3) {
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
                'color': '#DC143C'
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
            h('span', node.data.nodeName)
          ]
        )
      }
    }
  }
}
 </script>

 <style scoped>
 .filter-tree {
    width:400px;
    height: 500px;
    overflow-y: auto;
    float: left;
  }
  .filter-newTree {
    height: 500px;
    margin: 10px 20px;
  }
  .colorView {
    width:200px;
    height: 500px;
    float: right;
  }
  .item{
    position: relative;
    float: left;
    left: 10px;
  }
  .identify {
    font-size: 16px;
    position: relative;
    left:10px;
  }
  .addLi {
    position: relative;
    width: 25px;
    height: 20px;
    background: #0000FF;
  }
  .editLi {
    position: relative;
    width: 25px;
    top:1px;
    height: 20px;
    background: #00CD00;
  }
  .deleteLi {
    position: relative;
    width: 25px;
    top:2px;
    height: 20px;
    background: #DC143C;
  }
 </style>
