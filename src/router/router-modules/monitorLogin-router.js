import SupervisorTreeList from '@/components/monitor-login/SupervisorTreeList'
import TreeForms from '@/components/monitor-login/TreeForms'
import SupervisorDesigner from '@/components/monitor-login/SupervisorDesigner'
import DragTree from '@/components/monitor-login/DragTree'
import SupervisorAudit from '@/components/monitor-login/SupervisorAudit'
import MonitorLogin from '@/components/monitor-login/MonitorLogin'

export default [
  {
    name: 'monitor-login',
    path: '/monitor-login',
    component: MonitorLogin
  },
  {
    name: 'supervisor-treeList',
    path: '/supervisor-treeList',
    component: SupervisorTreeList
  },
  {
    name: 'supervisor-audit',
    path: '/supervisor-audit',
    component: SupervisorAudit
  },
  {
    name: 'tree-forms',
    path: '/tree-forms',
    component: TreeForms
  },
  {
    name: 'designer-supervisorTree',
    path: '/designer-supervisorTree',
    component: SupervisorDesigner
  },
  {
    name: 'drag-tree',
    path: '/drag-tree',
    component: DragTree
  }]
