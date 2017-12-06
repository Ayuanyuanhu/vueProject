<template>
	<div>
		<el-form  class="form-data" :inline="true">
			<el-form-item label="卷积属性">
				<el-input v-model="formName"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary"  @click="indexConfim" >确定</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="pageData" highlight-current-row v-loading="isSearching" class="filter-tree" border>
			  <el-table-column type="index"  align='center' label="序号" width="100">
			  </el-table-column>
			  <el-table-column prop="edmpName" label="卷积属性名称" align='center' :show-overflow-tooltip="true" >
			  </el-table-column>
        <el-table-column prop="indexName" label="来源表单" align='center' :show-overflow-tooltip="true" >
        </el-table-column>
			  <el-table-column prop="unsele" label="选择" header-align="center" align='center' width="100">
          <template scope="scope">
            <el-checkbox v-model="scope.row.unsele"></el-checkbox>
          </template>
        </el-table-column>
		</el-table>
	</div>
</template>

<script>
import { supervisorTreeService } from '@/api'
import _ from 'lodash'

export default {
  props: ['dataIn'],
  data () {
    return {
      formName: '',
      pageData: [],
      queryParpms: {
        edmcNameEn: '',
        enable: ''
      },
      isSearching: false,
      cacheData: []
    }
  },
  created: function () {
    this.queryData()
  },
  watch: {
    formName (val) {
      var arr = []
      for (var i = 0; i < this.cacheData.length; i++) {
        if (this.cacheData.length !== 0) {
          if (this.cacheData[i].edmpName.indexOf(val) !== -1) {
            arr.push(this.cacheData[i])
          }
        }
        this.pageData = arr
      }
    }
  },
  methods: {
    indexConfim: function () {
      var arr = []
      for (var i = 0; i < this.pageData.length; i++) {
        if (this.pageData[i].unsele === true) {
          arr.push(this.pageData[i].id)
          this.pageData[i].unsele = false
        }
      }
      this.$emit('addAttribute', arr)
    },
    queryData: function () {
      var arr = []
      this.isSearching = true
      this.queryParpms.edmcNameEn = this.dataIn.edmcNameEn
      this.queryParpms.enable = '0'
      supervisorTreeService.querySupervisorConvolutional(this.queryParpms).then(data => {
        this.cacheData = _.cloneDeep(data)
        for (var i = 0; i < data.length; i++) {
          var obj = data[i]
          obj.unsele = false
          arr.push(obj)
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
.filter-tree {
  max-height: 300px;
  overflow-y: auto;
}
</style>
