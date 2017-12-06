import axios from 'axios'
import { Message } from 'element-ui'
export * from './services/treeForms'
export * from './services/supervisorTreeList'

// axios全局设置
axios.default.timeout = 1000 * 15
// 配置axios拦截器
// 添加请求拦截器
axios.interceptors.request.use((config) => {
    // 发送请求之前
  return config
}, (error) => {
    // 请求错误时
  Message({
    message: '服务器异常' + error.message,
    type: 'error'
  })
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use((response) => {
    // 对响应数据
  const result = response.data
  if (!result) {
    Message({
      message: '数据异常！',
      type: 'error'
    })
    return Promise.reject({message: '数据异常！'})
  }
  if (result.retCode === 1) {
    // 成功
    return result.data
  } else if (result.retCode === 0) {
      // 失败
    Message({
      message: result.errMsg,
      type: 'error'
    })
    return Promise.reject({message: result.errMsg})
  } else if (result.retCode === -1) {
    // 未登陆
    window.location.href = result.data
  } else if (result.retCode === -2) {
    // 校验错误
    return Promise.reject({message: result.errMsg})
  }
  Message({
    message: result.errMsg,
    type: 'error'
  })
  return Promise.reject({message: result.errMsg})
}, (error) => {
        // 请求错误时提示
  Message({
    message: error.message,
    type: 'error'
  })
  return Promise.reject(error)
})
