<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card flat>
      <q-bar class="bg-white text-white">
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="red"
          v-close-popup
        >
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="yellow"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="green"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
            >Maximize</q-tooltip
          >
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-table
          flat
          separator="none"
          :rows="Object.values(task)"
          :columns="header"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                <q-input
                  color="pink"
                  v-model="props.row.name"
                  label="匹配方式"
                />
              </q-td>
              <q-td key="type" :props="props">
                <q-select
                  color="pink"
                  v-model="props.row.job.type"
                  :options="[
                    { label: '跳过', value: 'skip' },
                    { label: '新增', value: 'addition' },
                    { label: '替换', value: 'replace' },
                  ]"
                  label="匹配阶段"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                />
              </q-td>
              <q-td key="target" :props="props">
                <q-input
                  color="pink"
                  v-model="props.row.job.target"
                  label="订阅地址"
                />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="content(props)"
                  size="sm"
                  flat
                  color="pink"
                  label="获取内容"
                />
                <q-btn
                  @click="del(props.row.id)"
                  size="sm"
                  flat
                  color="pink"
                  label="删除"
                />
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <q-table
                  flat
                  :rows="resource.list"
                  :columns="[
                    {
                      name: 'name',
                      align: 'center',
                      label: '名称',
                      field: 'name',
                    },
                    {
                      name: 'type',
                      align: 'center',
                      label: '时间',
                      field: 'type',
                    },
                    {
                      name: 'job',
                      align: 'center',
                      label: '任务',
                      field: 'job',
                    },
                    {
                      name: 'running',
                      align: 'center',
                      label: '状态',
                      field: 'running',
                    },
                    {
                      name: 'action',
                      align: 'center',
                      label: '操作',
                      field: 'action',
                    },
                  ]"
                >
                  <template v-slot:top>
                    <tr>
                      <td>订阅名称:{{ resource.name }}</td>
                      <td>订阅描述:{{ resource.desc }}</td>
                    </tr>
                  </template>
                  <template v-slot:body="p">
                    <q-tr :props="p">
                      <q-td key="name" :props="p">
                        {{ p.row.name }}
                      </q-td>
                      <q-td key="type" :props="p">
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
                              v-model="p.row.type"
                            />
                          </div>
                          <div class="col-12 col-md-9">
                            <q-input v-model="p.row.time" />
                          </div>
                        </div>
                      </q-td>
                      <q-td key="job" :props="p">
                        <q-select
                          :options="[
                            { label: '运行 JS', val: 'runjs' },
                            { label: 'Shell 指令', val: 'exec' },
                            { label: '开始任务', val: 'taskstart' },
                            { label: '停止任务', val: 'taskstop' },
                          ]"
                          v-model="p.row.job.type"
                          option-value="val"
                          option-label="label"
                          emit-value
                          map-options
                        />
                      </q-td>
                      <q-td key="running" :props="p">
                        <q-icon
                          :name="
                            p.row.running ? 'play_arrow' : 'not_interested'
                          "
                        />
                      </q-td>
                      <q-td key="action" :props="p">
                        <q-btn
                          @click="add(p.row, props.row)"
                          flat
                          size="sm"
                          color="pink"
                          label="添加任务"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
          color="purple"
          icon="keyboard_arrow_left"
          direction="left"
          title="订阅"
        >
          <q-fab-action
            label-position="top"
            external-label
            color="purple"
            icon="save"
            label="保存"
          />
          <q-fab-action
            label-position="top"
            @click="insert"
            external-label
            color="purple"
            icon="add"
            label="新增"
          />
        </q-fab>
      </q-page-sticky>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { LooseDictionary, QTableProps, useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref, watch, watchEffect } from 'vue';
import { SubObj, TaskObj, TaskSub, TaskType } from './task';

const emit = defineEmits(['update:modelValue', 'update:sub']);
const prop = defineProps<{
  modelValue: boolean;
  sub: Partial<TaskType>;
  //   pagination: QTableProps['pagination'];
}>();

const $q = useQuasar();

const maximizedToggle = ref(true);

const dialog = ref(false);

const task = ref<Partial<TaskType>>({});

const resource = ref<Partial<TaskSub>>({});

watch(
  () => prop.modelValue,
  () => {
    dialog.value = prop.modelValue;
  }
);

watch(dialog, (dialog) => {
  emit('update:modelValue', dialog);
});

watchEffect(() => {
  Object.keys(prop.sub).forEach((key) => {
    if (prop.sub[key]?.type === 'sub') {
      task.value[key] = prop.sub[key];
    }
  });
});

const insert = () => {
  const id: string = [Math.random().toString(36).slice(-6)].toString();
  Object.assign(task.value, {
    [id]: {
      name: 'elecV2P 任务订阅',
      type: 'sub',
      job: {
        type: 'skip',
        target:
          'https://raw.githubusercontent.com/Oreomeow/checkinpanel/master/dailycheckin.json',
      },
      id,
    },
  });
  emit('update:sub', task.value);
};

const content = async (item: {
  row: LooseDictionary;
  rowIndex: number;
  pageIndex: number;
  expand: boolean;
}) => {
  try {
    item.expand = true;
    resource.value = await api.get(item.row.job.target);
  } catch (e) {
    const notify = $q.notify({
      type: 'negative',
      position: 'top',
      group: false,
      timeout: 0,
      spinner: true,
      message: '获取订阅信息失败,即将尝试从服务器端获取该订阅内容',
    });
    setTimeout(() => {
      api
        .get(`data?type=stream&url=${(item.row as SubObj).job.target}`)
        .then((d) => {
          resource.value = d as unknown as TaskSub;
          notify({
            type: 'positive',
            icon: 'done',
            spinner: false,
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            message: `成功获取任务${resource.value.list!.length}条`,
            timeout: 2500,
          });
        })
        .catch(() => {
          notify({
            type: 'negative',
            icon: 'done',
            spinner: false,
            message: '获取订阅任务失败',
            timeout: 2500,
          });
        });
    }, 3000);
  }
};

const add = async (
  item: LooseDictionary | TaskObj,
  sub: LooseDictionary | SubObj
) => {
  try {
    const id = Math.random().toString(36).slice(-6);
    const result: Record<'message', string> = await api.put('task', {
      op: 'add',
      data: {
        task: [Object.assign(item, { id, belong: sub.id })],
        type: sub.job.type,
      },
    });
    $q.notify({
      position: 'top',
      message: result.message,
    });
  } catch (e) {
    $q.notify({
      color: 'negative',
      message: '出错啦~',
    });
  }
};

const del = async (tid: string) => {
  try {
    const result: Record<'message', string> = await api.put('task', {
      data: {
        tid,
      },
      op: 'delete',
    });
    delete task.value[tid];
    $q.notify({
      position: 'top',
      message: result.message,
    });
  } catch (e) {
    $q.notify({
      color: 'negative',
      message: '出错啦~',
    });
  }
};

const header: QTableProps['columns'] = [
  { name: 'name', align: 'center', label: '订阅名称', field: 'name' },
  { name: 'type', align: 'center', label: '同名任务处理方式', field: 'type' },
  { name: 'target', align: 'center', label: '订阅地址', field: 'target' },
  { name: 'action', align: 'center', label: '操作', field: 'action' },
];
</script>
