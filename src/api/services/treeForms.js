import config from '@/assets/config/env-config.json'
import axios from 'axios'

export const treeFormService = {
  // 树统计报表查询接口
  queryTreeForm (pageData) {
    return axios.post(config.baseUrl.monitor + 'v1/statistics/query/statistics', pageData)
  },
  // 财年查询
  queryYears () {
    return axios.post(config.baseUrl.monitor + 'v1/statistics/query/period')
  }
}
