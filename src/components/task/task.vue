<template>
  <q-table
    flat
    row-key="name"
    :rows="Object.values(task)"
    separator="none"
    :columns="header"
    v-model:pagination="page"
    :filter="filter"
  >
    <template v-slot:top>
      <q-space />
      <q-input
        placeholder="搜索"
        v-model="filter"
        borderless
        dense
        debounce="300"
        color="primary"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          <q-input v-model="props.row.name" />
        </q-td>
        <q-td key="type" :props="props">
          <div class="row">
            <div class="col-12 col-md-3">
              <q-select
                :options="[
                  { label: 'cron定时', val: 'cron' },
                  { label: '倒计时', val: 'schedule' },
                ]"
                option-value="val"
                option-label="label"
                emit-value
                map-options
                v-model="props.row.type"
              />
            </div>
            <div class="col-12 col-md-9">
              <q-input v-model="props.row.time" />
            </div>
          </div>
        </q-td>
        <q-td key="job" :props="props">
          <div class="row">
            <div class="col-12 col-md-3">
              <q-select
                :options="[
                  { label: '运行 JS', val: 'runjs' },
                  { label: 'Shell 指令', val: 'exec' },
                  { label: '开始任务', val: 'taskstart' },
                  { label: '停止任务', val: 'taskstop' },
                ]"
                v-model="props.row.job.type"
                option-value="val"
                option-label="label"
                emit-value
                map-options
              />
            </div>
            <div class="col-12 col-md-9">
              <q-input v-model="props.row.job.target" />
            </div>
          </div>
        </q-td>
        <q-td key="running" :props="props">
          <q-icon :name="props.row.running ? 'play_arrow' : 'not_interested'" />
        </q-td>
        <q-td key="action" :props="props">
          <q-btn
            flat
            size="sm"
            color="pink"
            label="测试"
            @click="action(props.row, 'test')"
          />
          <q-btn
            flat
            size="sm"
            color="pink"
            :label="`${props.row.running ? '停止' : '开始'}`"
            @click="action(props.row, props.row.running ? 'stop' : 'start')"
          />
          <q-btn
            @click="action(props.row, 'delete')"
            flat
            size="sm"
            color="pink"
            label="删除"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
<script lang="ts" setup>
import { LooseDictionary, QTableProps, useQuasar } from 'quasar';
import { TaskObj, TaskType } from './task';
import { ref, watch, watchEffect } from 'vue';
import { api } from '../../boot/axios';

const $q = useQuasar();
const emit = defineEmits(['update:modelValue', 'update:pagination']);

const prop = defineProps<{
  modelValue: Partial<TaskType>;
  pagination: QTableProps['pagination'];
}>();

const page = ref<QTableProps['pagination']>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: $q.localStorage.getItem<number>('taskPerPage') ?? 5,
});

const task = ref<Partial<TaskType>>({});

const filter = ref('');

// 这里我用科学解释不了
// watch(
//   () => prop.obj,
//   () => {
//     Object.keys(prop.obj).forEach((key) => {
//       if (prop.obj[key]?.type !== 'sub') {
//         task.value[key] = prop.obj[key];
//       }
//     });
//   }
// );

watchEffect(() => {
  Object.keys(prop.modelValue).forEach((key) => {
    if (prop.modelValue[key]?.type !== 'sub') {
      task.value[key] = prop.modelValue[key];
    }
  });
});

watchEffect(() => {
  page.value = prop.pagination;
});

watch(page, (page) => {
  emit('update:pagination', page);
});

watch(
  task,
  (task) => {
    emit('update:modelValue', task);
  },
  { deep: true }
);

watchEffect(() =>
  $q.localStorage.set('taskPerPage', page.value?.rowsPerPage ?? 5)
);

const action = async (item: TaskObj | LooseDictionary, type: string) => {
  try {
    let to;
    if (type === 'test') {
      to = {
        tid: `to${type}`,
        task: item,
      };
    } else if (type === 'start') {
      to = {
        task: Object.assign(item, {
          running: true,
        }),
      };
    } else {
      to = {
        tid: item.id,
      };
    }
    const result: Record<'message', 'string'> = await api.put('task', {
      op: type,
      data: to,
    });
    $q.notify({
      position: 'top',
      message:
        type === 'test' ? `任务已下发 ${result.message}` : result.message,
    });
    if (type === 'start') {
      item.running = true;
    } else if (type === 'stop') {
      item.running = false;
    } else if (type === 'test') {
      // LOG:
    } else {
      delete task.value[item.id];
    }
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '处理失败!',
    });
  }
};

const header: QTableProps['columns'] = [
  { name: 'name', align: 'center', label: '名称', field: 'name' },
  { name: 'type', align: 'center', label: '时间', field: 'type' },
  { name: 'job', align: 'center', label: '任务', field: 'job' },
  { name: 'running', align: 'center', label: '状态', field: 'running' },
  { name: 'action', align: 'center', label: '操作', field: 'action' },
];
</script>
