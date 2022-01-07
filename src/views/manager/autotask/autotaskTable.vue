<template>
      <a-row>
            <a-col :span="24">
                  <a-form layout="inline">
                        <a-form-item>
                              <a-button type="primary" @click="p.newTask()">新建自动化任务</a-button>
                        </a-form-item>
                        <a-form-item>
                              <a-input-search
                                    placeholder="输入权限组名称"
                                    enter-button
                                    allowClear
                                    v-model:value="expr.find.text"
                                    @search="currentPage"
                              />
                        </a-form-item>
                  </a-form>
            </a-col>
      </a-row>

      <br />
      <a-table :columns="col" :dataSource="tData" :pagination="false" rowKey="id" bordered>
            <template #bodyCell="{ column, text, record }">
                  <template v-if="column.dataIndex === 'action'">
                        <a-space>
                              <a-button ghost size="small" @click="p.editTask(record)">编辑</a-button>
                              <a-popconfirm
                                    title="确认要删除该任务吗?"
                                    @confirm="request.Delete(record.task_id).then(() => currentPage())"
                              >
                                    <a-button ghost size="small" danger>删除</a-button>
                              </a-popconfirm>
                        </a-space>
                  </template>
                  <template
                        v-if="column.dataIndex === 'tp'"
                  >{{ taskTp.filter(item => item.v === text)[0].title }}</template>
                  <template v-if="column.dataIndex === 'status'">
                        <a-switch
                              v-model:checked="record.status"
                              :checkedValue="1"
                              :unCheckedValue="0"
                              @change="() => request.Post('active', record)"
                        ></a-switch>
                  </template>
            </template>
      </a-table>
      <br />
      <a-pagination
            :total="pagination.pageCount"
            :page-size.sync="pagination.pageSize"
            :show-total="(total) => `共 ${total} 个工单`"
            v-model:current="expr.page"
            @change="currentPage"
      />
      <AutotaskModal ref="p" :title="title" @success="currentPage"></AutotaskModal>
</template>

<script lang="ts" setup>

import { onMounted, reactive, ref } from "vue"
import CommonMixins from "@/mixins/common"
import { AutoTaskExpr, AutoTask, AutoTaskParams, AutoTaskResp, Request } from "@/apis/autotask"
import { AxiosResponse } from "axios"
import { Res } from "@/config/request"
import AutotaskModal from "./autotaskModal.vue"

const title = ref("新建权限组")

const p = ref()

const col = [
      {
            title: '名称',
            dataIndex: 'name',
      },
      {
            title: '类型',
            dataIndex: 'tp',
      },
      {
            title: '环境',
            dataIndex: 'idc',
      },
      {
            title: '数据源',
            dataIndex: 'source',
      },
      {
            title: '数据库',
            dataIndex: 'data_base',
      },
      {
            title: '数据表',
            dataIndex: 'table',
      },
      {
            title: '最大影响行数',
            dataIndex: 'affect_rows',
      },
      {
            title: '状态',
            dataIndex: 'status',
      },
      {
            title: '操作',
            dataIndex: 'action',
      },
]

const tData = ref([] as AutoTask[])

const { pagination, taskTp } = CommonMixins()

const request = new Request

const expr = reactive<AutoTaskParams>({
      find: {} as AutoTaskExpr,
      page: 1
})

const currentPage = () => {
      request.List(expr).then((res: AxiosResponse<Res<AutoTaskResp>>) => {
            tData.value = res.data.payload.data
            pagination.pageCount = res.data.payload.page
      })
}

onMounted(() => {
      currentPage()
})


</script>