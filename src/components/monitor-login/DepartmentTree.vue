<template>
	<div>
		<el-form :inline="true">
			<el-form-item label="">
				<el-input placeholder="请输入内容" v-model="selectName" style="width:130px;"></el-input>
			</el-form-item>
		</el-form>
		<el-tree class="filter-tree"
		:data="treeData"
		:props="defaultProps"
		node-key="id"
		:default-expand-all="true"
		:expand-on-click-node="false"
		:filter-node-method="filterNode"
		ref="tree"
    @node-click="nodeClick"
    v-loading="isSearching">
		</el-tree>
	</div>
</template>
<script>
import { supervisorTreeService } from '@/api'
import moment from 'moment'

export default {
  props: ['dataIn'],
  data () {
    return {
      selectName: '',
      treeData: [],
      result: [],
      isSearching: false,
      defaultProps: {
        children: 'children',
        label: 'moni002'
      },
      queryTreeData: {
        edmcNameEn: '',
        rootNodeId: '',
        searchDate: ''
      }
    }
  },
  watch: {
    selectName (val) {
      this.$refs.tree.filter(val)
    }
  },
  created: function () {
    this.queryTree(this.dataIn)
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.moni002.indexOf(value) !== -1
    },
    nodeClick: function (nodeData, nodeObj, nodeEle) {
      this.$emit('selectDeparTree', nodeData)
    },
    queryChildren: function (data, fId) {
      this.isSearching = true
      var temp = []
      var childrenResult = []
      for (var j = 0; j < data.length; j++) {
        if (data[j].moni006 === fId) {
          temp = this.queryChildren(data, data[j].id)
          if (temp.length) {
            data[j].children = temp
          }
          childrenResult.push(data[j])
        }
      }
      let sortArray = []
      let nextId = ''
      // 找到第一个元素
      while (true) {
        var nextItem = this.findByRightId(nextId, childrenResult)
        if (!nextItem) {
          break
        }
        sortArray.push(nextItem)
        nextId = nextItem.id
      }
      childrenResult = sortArray
      this.result[0].children = childrenResult
      this.treeData = this.result
      this.isSearching = false
      return childrenResult
    },
    findByRightId: function (id, arr) {
      for (let item of arr) {
        if (item.moni008 === id) {
          return item
        }
      }
    },
    queryTree: function (list) {
      this.isSearching = true
      var newDate = new Date()
      this.queryTreeData.edmcNameEn = list.edmcNameEn
      this.queryTreeData.searchDate = moment(newDate).format('YYYY-MM-DD')
      supervisorTreeService.querySupervisorTree(this.queryTreeData).then(data => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].moni006 === '') {
            var fId = data[i].id
            this.result.push(data[i])
          }
        }
        this.queryChildren(data, fId)
      }).catch(() => {
        this.isSearching = false
      })
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
