import axios from 'axios'
import router from '@/router'
import {
  Message
} from 'element-ui'

const origin = location.hostname === 'localhost' ? 'http://122.152.200.11:8080' : location.origin
export const BASE_URL = origin + '/match-service'
axios.defaults.baseURL = BASE_URL

axios.defaults.withCredentials = true

// 超时时间
axios.defaults.timeout = 120000

// 头部
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

// 上传图片
export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

axios.interceptors.request.use(
  config => {
    if (config.method === 'post' || config.method === 'put') {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截
axios.interceptors.response.use(
  response => {
    if (response.data.result === '0') {
      return response
    } else {
      Message({
        message: response.data.msg,
        type: 'error'
      })
      return response
    }
  },
  error => {
    const msg = error.response.data.msg
    const code = error.response.status
    console.log(error.response)
    if (code === 401) {
      router.push('/')
    }
    Message({
      message: msg,
      type: 'error'
    })
    return Promise.reject(error)
  }
)
export default axios
