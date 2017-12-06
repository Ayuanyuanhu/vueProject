import config from '@/assets/config/env-config.json'
import axios from 'axios'

export const supervisorTreeService = {
  // 监管树类查询列表
  querySupervisorClass ({treeName, beginTime, endTime}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors', {
      params: {
        treeName, beginTime, endTime
      }
    })
  },
  // 根据监管类英文名查询监管类下的监管树
  querySupervisorList ({treeName, edmId, edmcNameEn, beginTime, endTime}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/trees', {
      params: {
        treeName, edmId, edmcNameEn, beginTime, endTime
      }
    })
  },
  // 监管树卷积明细列表查询
  querySupervisorConvolutional ({edmcNameEn, enable}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/conproperties', {
      params: {
        edmcNameEn, enable
      }
    })
  },
  // 删除/新增卷积属性
  deleteSupervisorCon (list) {
    return axios.put(config.baseUrl.common + 'properties/changeVisible', list)
  },
  // 新增树开始时间查询
  querySuperbeginDate ({edmcNameEn, classId}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/newDate', {
      params: {
        edmcNameEn, classId
      }
    })
  },
  // 新增监管树
  addSuperClassTree (list) {
    return axios.post(config.baseUrl.monitor + 'v1/monitors/addMonitorTree', list)
  },
  // 维护监管树
  editClassTree ({classId, rootEdmcNameEn, rootId}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/treeMaintaince', {
      params: {
        classId, rootEdmcNameEn, rootId
      }
    })
  },
  // 监管树所有节点和相应资源查询(正式)
  querySupervisorTree ({edmId, flag, rootEdmcNameEn, rootNodeId, searchDate}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/trees/nodes', {
      params: {
        edmId, flag, rootEdmcNameEn, rootNodeId, searchDate
      }
    })
  },
  // 监管树结构查询（临时）
  queryTemSupervisorTree ({flag, type, key, validDate}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/tempTree', {
      params: {
        flag, type, key, validDate
      }
    })
  },
  // 未分配资源清单查询
  queryUnDistributed ({key, lvlCode, pageSize, currentPage}) {
    return axios.get(config.baseUrl.monitor + 'v1/nodes/resource', {
      params: {
        key, lvlCode, pageSize, currentPage
      }
    })
  },
  // 监管树节点详情查询
  queryCheckedDetail ({key, lvlCode}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/nodeDetail', {
      params: {
        key, lvlCode
      }
    })
  },
  // 提示是否恢复上一步操作
  recoverTree ({flag, key}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/edit', {
      params: {
        flag, key
      }
    })
  },
  // 监管树节点详情保存
  addCheckedDetail (list) {
    return axios.post(config.baseUrl.monitor + 'v1/monitors/saveNodeDetail', list)
  },
  // 删除关联资源
  deleteCheckedDetail ({key, lvlCode, resourceId}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/deleteNodeResource', {
      params: {
        key, lvlCode, resourceId
      }
    })
  },
  // 校验监管树
  checkSuperviorTree ({key}) {
    return axios.get(config.baseUrl.monitor + 'v1/nodes/other/resource', {
      params: {
        key
      }
    })
  },
  // 归类监管数未分配资源
  checkResource ({key}) {
    return axios.get(config.baseUrl.monitor + 'v1/nodes/other', {
      params: {
        key
      }
    })
  },
  // 提交监管树单据
  submitSuperviorList (id) {
    return axios.get(config.baseUrl.monitor + '' + id)
  },
  // 删除监管树节点
  deleteSupervior ({key, lvlCode, type}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/deleteNode', {
      params: {
        key, lvlCode, type
      }
    })
  },
  // 添加监管树节点
  addSuperviorId ({key, lvlCode, type}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/addNode', {
      params: {
        key, lvlCode, type
      }
    })
  },
  // 移动监管树节点
  moveSuperior ({key, desLvlCode, moveLvlCode, type}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/moveNode', {
      params: {
        key, desLvlCode, moveLvlCode, type
      }
    })
  },
  // 新增节点资源
  addNodeResource ({key, lvlCode, resourceId, resourceText}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/addResource', {
      params: {
        key, lvlCode, resourceId, resourceText
      }
    })
  },
  // 撤销编辑
  revokeEdit ({key}) {
    return axios.get(config.baseUrl.monitor + 'v1/nodes/revoke/' + key)
  },
  // 节点时间区间修改校验
  editIdBydate ({key, lvlCode, startDate, endDate}) {
    return axios.get(config.baseUrl.monitor + 'v1/nodes/checkDate', {
      params: {
        key, lvlCode, startDate, endDate
      }
    })
  },
  // 临时单据入库
  laidStore (orderId) {
    return axios.get(config.baseUrl.monitor + 'v1/nodes/' + orderId)
  },
  // 主管人/协管人
  queryStaff ({resourceClassId, resourceValue}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/search', {
      params: {
        resourceClassId, resourceValue
      }
    })
  },
  // 树节点移动
  dragTreeNode ({nodeId, nodeLeftId, nodeParentId, nodeRightId}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/moveNode', {
      params: {
        nodeId, nodeLeftId, nodeParentId, nodeRightId
      }
    })
  },
  // 树新增、树维护前的临时单检查
  checkOrder ({classId, rootId, type}) {
    return axios.get(config.baseUrl.monitor + 'v1/monitors/checkOrder', {
      params: {
        classId, rootId, type
      }
    })
  },
  // 监管树保存
  saveOrder (key) {
    return axios.get(config.baseUrl.monitor + 'v1/nodes/save/' + key)
  },
  // 公式條件篩選資源
  queryResourceByFormula (list) {
    return axios.post(config.baseUrl.monitor + 'v1/monitors/formula', list)
  },
  // 根據公式id查找資源
  queryResourceById (prplId) {
    return axios.get(config.baseUrl.formulaResource + 'relatedConditions/getObjectRelCondConfDataByPro/' + prplId)
  }
}
