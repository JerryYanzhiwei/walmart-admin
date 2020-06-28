<template>
  <el-menu class="side_menu_container"
    text-color="#80799e"
    background-color="#241f3b"
    active-text-color="#fff"
    mode="vertical"
    :router="true"
    :default-active="$route.path">
    <el-menu-item
      v-for="(item, index) in menuData"
      :key="index"
      :index="item.path"
      :route="item.path">{{item.title}}</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    menuData () {
      const userInfo = JSON.parse(sessionStorage.getItem('adminInfo'))
      if (userInfo.superAdmin !== undefined) {
        return [
          {
            path: '/works/admin',
            title: '作品列表'
          }
        ]
      } else {
        return [
          {
            path: '/works/admin',
            title: '作品列表'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.side_menu_container {
  padding-top: 20px;
  height: 100%;
  background-color: $bg_color;
  .el-menu-item:hover {
    background-color: unset;
  }
}
</style>
