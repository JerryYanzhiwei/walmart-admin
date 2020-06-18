import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { BASE_URL } from '@/utils/http'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    /**
     * @管理员
     */
    // 账号登录
    async POST_LOGIN ({ commit }, data = {}) {
      const { data: res } = await axios.post(`/adminLogin?username=${data.phone}&password=${data.password}`)
      return res
    },
    // 验证码登录
    async POST_CODE_LOGIN ({ commit }, data = {}) {
      const { data: res } = await axios.post(`/adminLoginCode?username=${data.phone}&code=${data.code}`)
      return res
    },
    // 获取验证码
    async GET_CODE ({ commit }, phone) {
      const { data: res } = await axios.get(`/login/code?phone=${phone}`)
      return res
    },
    // 队伍列表
    async GET_TEAM_LIST ({ commit }, data = {}) {
      const { data: res } = await axios.get(`/admin/team/page?pageNo=${data.pageNo}&pageSize=${data.pageSize}&teamProgress=${data.teamProgress}`)
      return res
    },
    // 评委修改密码
    async PUT_MOIDIFY_PASSWORD ({ commit }, data = {}) {
      const { data: res } = await axios.put(`/judge/password?password=${data.password}`)
      return res
    },
    // 管理员修改密码
    async PUT_ADMIN_MOIDIFY_PASSWORD ({ commit }, data = {}) {
      const { data: res } = await axios.put(`/admin/password?password=${data.password}`)
      return res
    },
    // 下载学生账号
    async GET_ACCOUNT_LIST ({ commit }, data = {}) {
      const { data: res } = await axios.get('/admin/account/dowload')
      return res
    },
    // 下载附件
    async GET_DOWN_FILE ({ commit }, attachmentId = 0) {
      const url = '/admin/team/dowload/attachment'
      window.open(`${BASE_URL}${url}?attachmentId=${attachmentId}`)
    },
    // 更改队伍流程
    async PUT_TEAM_PROGRESS ({ commit }, data = {}) {
      data.progress = ++data.progress
      const { data: res } = await axios.put(`/admin/team/teamProgress?teamId=${data.teamId}&teamProgress=${data.progress}`)
      return res
    }
  },
  modules: {
  }
})
