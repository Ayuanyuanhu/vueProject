<template>
	<div>
		<el-form  class="form-data" :inline="true">
			<el-form-item label="卷积属性">
				<el-input v-model="formName"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary"  @click="addForm" >新增</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="pageData" highlight-current-row v-loading="isAddSearching"  border class="filter-tree">
			  <el-table-column type="index"  align='center' label="序号" width="100">
			  </el-table-column>
			  <el-table-column prop="edmpName" label="卷积属性名称" align='center' :show-overflow-tooltip="true" >
			  </el-table-column>
        <el-table-column prop="indexName" label="来源表单" align='center' :show-overflow-tooltip="true" >
        </el-table-column>
			  <el-table-column  label="操作" header-align="center" align='center' width="100">
    	    <template scope="scope">
			    	<el-button size="small" @click="deleteRow(scope.row)" type="text">删除</el-button>
			    </template>
			  </el-table-column>
		</el-table>
	</div>
</template>

<script>
import { supervisorTreeService } from '@/api'
import addAttribute from './AddAttribute'
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
      isAddSearching: false,
      filterArr: [],
      cachePageData: [],
      resList: {
        ids: [],
        visible: ''
      }
    }
  },
  created: function () {
    this.queryData()
  },
  watch: {
    formName (val) {
      var arr = []
      for (var i = 0; i < this.cachePageData.length; i++) {
        if (this.cachePageData.length !== 0) {
          if (this.cachePageData[i].edmpName.indexOf(val) !== -1) {
            arr.push(this.cachePageData[i])
          }
        }
        this.pageData = arr
      }
    }
  },
  components: {
    'add-attribute': addAttribute
  },
  methods: {
    deleteRow: function (list) {
      this.resList.ids = []
      this.resList.visible = 0
      this.resList.ids.push(list.id)
      supervisorTreeService.deleteSupervisorCon(this.resList).then(data => {
        this.queryData()
      })
    },
    queryData: function () {
      this.isAddSearching = true
      this.queryParpms.edmcNameEn = this.dataIn.edmcNameEn
      this.queryParpms.enable = '1'
      supervisorTreeService.querySupervisorConvolutional(this.queryParpms).then(data => {
        this.pageData = data
        this.cachePageData = _.cloneDeep(data)
        this.$nextTick(() => {
          this.isAddSearching = false
        })
      }).catch(() => {
        this.isAddSearching = false
      })
    },
    addForm: function () {
      this.$openDialog({
        name: 'add-attribute',
        component: addAttribute,
        options: {
          title: '',
          customClass: 'dialog-width-m'
        },
        props: {
          edmcNameEn: this.dataIn.edmcNameEn
        },
        events: {
          addAttribute: this.addAttribute
        }
      })
    },
    addAttribute: function (list) {
      this.$closeDialog('add-attribute')
      this.resList.visible = 1
      this.resList.ids = list
      supervisorTreeService.deleteSupervisorCon(this.resList).then(data => {
        this.queryData()
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
