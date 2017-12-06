<template>
<div align="center">
  <p >监管树</p>
  <el-button type="info" size="small" @click="SupervisorTreeList" >监管树清单</el-button>
<el-button type="info" size="small" @click="TreeForms" >树统计报表</el-button>
</div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    SupervisorTreeList: function () {
      this.$router.push({
        path: '/supervisor-treeList'
      })
    },
    TreeForms: function () {
      this.$router.push({
        path: '/tree-forms'
      })
    }
  }
}
</script>
<style scoped>

</style>
