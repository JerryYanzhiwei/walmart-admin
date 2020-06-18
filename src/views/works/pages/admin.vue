<template>
  <div class="works_list_container">
    <!-- <div class="page_title">评委审核功能</div> -->
    <div v-if="userInfo.superAdmin === 1" class="down_list">
      <el-button @click="downloadAccount" type="primary">下载注册列表<i class="el-icon-download el-icon--right"></i></el-button>
      <el-button @click="downloadTeamList" type="primary">下载队伍列表<i class="el-icon-download el-icon--right"></i></el-button>
    </div>
    <div class="filter_container">
      <el-tabs v-model="activeType" @tab-click="handleClick">
        <el-tab-pane label="初筛" name="0"></el-tab-pane>
        <el-tab-pane label="半决赛" name="1"></el-tab-pane>
        <el-tab-pane label="决赛" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <el-table
      :data="tableData"
      stripe>
      <!-- <el-table-column
        prop="teamNo"
        label="#">
      </el-table-column> -->
      <el-table-column
        label="队伍名称">
        <template slot-scope="scope">
          <el-popover width="200" trigger="hover" :content="scope.row.teamName" placement="top">
            <div>{{scope.row.teamName}}</div>
            <div slot="reference" class="name-wrapper">
              <div class="nowrap">{{ scope.row.teamName }}</div>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="作品名称">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.opusName" placement="top">
            <span style="color: #33394E">{{scope.row.opusName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="directionName"
        label="方向">
      </el-table-column> -->
      <!-- <el-table-column
        label="课题">
        <template slot-scope="scope">
          <el-popover width="200" trigger="hover" :content="scope.row.subjectName" placement="top">
            <div>{{scope.row.subjectName}}</div>
            <div slot="reference" class="name-wrapper">
              <div class="nowrap">{{ scope.row.subjectName }}</div>
            </div>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column
        label="赛区">
        <template slot-scope="scope">
          <span>{{getZone(scope.row.matchZone)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="作品附件">
        <template slot-scope="scope">
          <div>
            <p v-for="(item, index) in scope.row.attachments" :key="index">
              <el-tooltip :content="item.attachmentFileName" placement="top">
                <span @click="getFileDown(item.attachmentId)">{{item.attachmentFileName}}</span>
              </el-tooltip>
            </p>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="得分">
        <template slot-scope="scope">
          <span>{{scope.row.totalScore || '---'}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop=""
        label="评审情况">
        <template slot-scope="scope">
          <PublicButton @clickHandle="pass(scope.row)">通过</PublicButton>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      small
      :page-size="pageData.pageSize"
      @current-change="pageChange"
      layout="prev, pager, next"
      :total="pageData.recordNumber">
    </el-pagination>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PublicButton from '@/components/public_button.vue'
import { BASE_URL } from '@/utils/http.js'
export default {
  components: {
    PublicButton
  },
  data () {
    return {
      activeType: '0',
      pageForm: {
        pageSize: 10,
        pageNo: 1,
        teamProgress: 0
      },
      pageData: {},
      tableData: [],
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(sessionStorage.getItem('adminInfo'))
    this.getData()
  },
  methods: {
    ...mapActions(['GET_TEAM_LIST', 'GET_ACCOUNT_LIST', 'GET_DOWN_FILE']),
    async getFileDown (attachmentId) {
      await this.GET_DOWN_FILE(attachmentId)
    },
    async downloadAccount () {
      window.open(`${BASE_URL}/admin/account/dowload`)
    },
    async downloadTeamList () {
      window.open(`${BASE_URL}/admin/team/dowload`)
    },
    // 切换分页
    pageChange (data) {
      this.pageForm.pageNo = data
      this.getData()
    },
    // 切换赛事类型
    handleClick (e) {
      this.pageForm = {
        pageSize: 10,
        pageNo: 1,
        teamProgress: e.name
      }
      this.activeType = e.name
      this.getData()
    },
    // 点击评分
    setSource (row) {
      console.log('row:', row)
      this.$router.push({
        path: '/works/desc',
        query: {}
      })
    },
    // 通过
    pass (row) {
      console.log('通过:', row)
    },
    // 获取页面数据
    async getData () {
      const params = this.pageForm
      const res = await this.GET_TEAM_LIST(params)
      if (res.result === '0' && res.data) {
        this.pageData = res.data
        this.tableData = res.data.records
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.works_list_container {
  .down_list {
    margin-bottom: 20px;
  }
}
</style>

<style lang="scss">
  .nowrap {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-table .cell {
    white-space: nowrap;
  }
  .el-pagination {
    margin-top: 20px;
    text-align: right;
  }
  span.el-tooltip {
    width: 100%;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    color: #409EFF;
  }
</style>
