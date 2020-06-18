import jsonData from '@/config/province.js'
export default {
  methods: {
    /* 手机 */
    validatePhone (str) {
      const reg = /^[1]{1}[\d]{10}$/
      return reg.test(str)
    },
    /* 邮箱 */
    validateEmail (str) {
      const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      return reg.test(str)
    },
    getZone (code) {
      const arr = jsonData.filter((val) => code === val.value)
      return arr[0].matchZone
    },
    // 获取信息
    getAdminInfo () {
      const adminInfo = sessionStorage.getItem('adminInfo')
      return adminInfo ? JSON.parse(adminInfo) : {}
    }
  }
}
