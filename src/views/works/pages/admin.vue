<template>
  <div class="works_list_container">
    <!-- <div class="page_title">评委审核功能</div> -->
    <div class="down_list">
      <el-button @click="downloadAccount" type="primary">下载注册列表<i class="el-icon-download el-icon--right"></i></el-button>
      <el-button @click="downloadTeamList" type="primary">下载队伍列表<i class="el-icon-download el-icon--right"></i></el-button>
    </div>
    <div class="search_contain">
      <div>
        <span>队伍名称</span>
        <el-input v-model="pageForm.teamName" size="mini"/>
      </div>
      <div>
        <span>提交作品</span>
        <el-select v-model="pageForm.opusFlag">
          <el-option
            v-for="item in isSubmitForm"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
      <div>
        <span>赛区</span>
        <el-select v-model="pageForm.matchZone">
          <el-option
            v-for="item in matchArea"
            :key="item.code"
            :label="item.value"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
      <el-button @click="searchList" type="primary">搜索</el-button>
      <el-button @click="downloadTeamFile" type="primary">下载队伍文件<i class="el-icon-download el-icon--right"></i></el-button>
    </div>
    <div class="filter_container">
      <el-tabs v-model="activeType" @tab-click="handleClick">
        <el-tab-pane label="组队中" name="0"></el-tab-pane>
        <el-tab-pane label="初赛" name="1"></el-tab-pane>
        <el-tab-pane label="区域复赛" name="2"></el-tab-pane>
        <el-tab-pane label="全国决赛" name="3"></el-tab-pane>
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
          <el-tooltip :content="scope.row.teamName" placement="top-start">
            <span>{{scope.row.teamName}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="作品名称">
        <template slot-scope="scope">
          <div>
            <p v-for="(item, index) in scope.row.attachments" :key="index">
              <el-tooltip v-if="item.attachmentType === 2" :content="item.attachmentFileName" placement="top-start">
                <span @click="getFileDown(item.attachmentId)">{{item.attachmentFileName}}</span>
              </el-tooltip>
            </p>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="directionName"
        label="方向">
      </el-table-column> -->
      <!-- <el-table-column
        label="课题">
        <template slot-scope="scope">
          <el-popover width="200" trigger="hover" :content="scope.row.subjectName" placement="top-start">
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
          <span>{{getZone(scope.row.province)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="作品附件">
        <template slot-scope="scope">
          <div>
            <p v-for="(item, index) in scope.row.attachments" :key="index">
              <el-tooltip v-if="item.attachmentType === 2" :content="item.attachmentFileName" placement="top-start">
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
          <PublicButton :disabled="scope.row.progress >= 3" @clickHandle="pass(scope.row)">通过</PublicButton>
          <PublicButton :disabled="scope.row.progress < 1" @clickHandle="backProcess(scope.row)">回退状态</PublicButton>
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
        teamProgress: 0,
        matchZone: '',
        opusFlag: -1,
        teamName: ''
      },
      pageData: {},
      tableData: [],
      userInfo: {},
      matchArea: [
        {
          value: '华北区',
          code: 1001
        },
        {
          value: '华南区',
          code: 1003
        },
        {
          value: '华东区',
          code: 1002
        },
        {
          value: '华西区',
          code: 1004
        },
        {
          value: '全部',
          code: ''
        }
      ],
      isSubmitForm: [
        {
          value: '否',
          code: 0
        },
        {
          value: '是',
          code: 1
        },
        {
          value: '全部',
          code: -1
        }
      ]
    }
  },
  created () {
    // this.userInfo = JSON.parse(sessionStorage.getItem('adminInfo'))
    // this.getData()
  },
  methods: {
    ...mapActions(['PUT_BACK_PROCESS', 'GET_TEAM_LIST', 'GET_ACCOUNT_LIST', 'GET_DOWN_FILE', 'PUT_TEAM_PROGRESS']),
    async getFileDown (attachmentId) {
      await this.GET_DOWN_FILE(attachmentId)
    },
    async downloadAccount () {
      window.open(`${BASE_URL}/admin/account/dowload`)
    },
    async downloadTeamList () {
      window.open(`${BASE_URL}/admin/team/dowload`)
    },
    async downloadTeamFile () {
      const params = this.pageForm
      window.open(`${BASE_URL}/admin/team/dowload/files?matchZone=${params.matchZone}&opusFlag=${params.opusFlag}&teamName=${params.teamName}&teamProgress=${params.teamProgress}`)
    },
    // 切换分页
    pageChange (data) {
      this.pageForm.pageNo = data
      this.getData()
    },
    // 搜索
    searchList () {
      this.pageForm.pageNo = 1
      this.getData()
    },
    // 切换赛事类型
    handleClick (e) {
      this.pageForm = {
        pageSize: 10,
        pageNo: 1,
        teamProgress: e.name,
        matchZone: '',
        opusFlag: -1
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
    async pass (row) {
      this.$confirm('是否确认此队伍通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.PUT_TEAM_PROGRESS(row)
        if (res.result === '0' && res.data) {
          this.getData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 回滚状态
    backProcess (row) {
      this.$confirm('是否确认此队伍回退状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.PUT_BACK_PROCESS({
          teamProgress: row.progress,
          teamId: row.teamId
        })
        if (res.result === '0' && res.data) {
          this.getData()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
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
  .search_contain {
    display: flex;
    > div {
      display: flex;
      align-items: center;
      width: 20%;
    }
  }
}
</style>

<style lang="scss">
  .search_contain {
    display: flex;
    > div {
      .el-input {
        width: 70%;

        margin-left: 5px;
      }
      .el-select {
        width: 70%;
        .el-input {
          width: 100%;

          margin-left: 5px;
        }
      }
    }
  }
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
