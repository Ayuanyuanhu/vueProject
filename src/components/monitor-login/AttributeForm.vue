<template>
	<div>
		<el-form>
			<el-form-item>
				<el-button type="primary"  @click="indexConfim" >确定</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="pageData" highlight-current-row v-loading="isSearching" border class="filter-tree">
			  <el-table-column type="index"  align='center' label="序号" width="100">
			  </el-table-column>
			  <el-table-column prop="edmpName" label="指标名称" align='center' :show-overflow-tooltip="true" >
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
      isSearching: false
    }
  },
  created: function () {
    this.queryData()
  },
  methods: {
    queryData: function () {
      var arr = []
      this.isSearching = true
      this.queryParpms.edmcNameEn = this.dataIn.edmcNameEn
      this.queryParpms.enable = '1'
      supervisorTreeService.querySupervisorConvolutional(this.queryParpms).then(data => {
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
    },
    indexConfim: function () {
      var arr = []
      for (var i = 0; i < this.pageData.length; i++) {
        if (this.pageData[i].unsele === true) {
          arr.push(this.pageData[i])
          this.pageData[i].unsele = false
        }
      }
      this.$emit('selectAttribute', arr)
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
