<template>
  <q-page v-touch-hold.mouse="() => (swipe = !swipe)">
    <Task-Data v-model="task" v-model:pagination="pagination" />
    <Sub-Data v-model:sub="task" v-model="dialog" />
    <q-page-sticky v-show="swipe" position="bottom-right" :offset="[18, 18]">
      <q-fab
        v-model="fab"
        color="purple"
        icon="keyboard_arrow_left"
        direction="left"
        title="任务"
      >
        <q-fab-action
          @click="log = true"
          label-position="top"
          external-label
          color="purple"
          icon="logo_dev"
          label="日志"
        />
        <q-fab-action
          @click="dialog = true"
          label-position="top"
          external-label
          color="purple"
          icon="mdi-playlist-check "
          label="订阅"
        />
        <q-fab-action
          @click="save"
          label-position="top"
          external-label
          color="purple"
          icon="save"
          label="保存"
        />
        <q-fab-action
          @click="insert"
          label-position="top"
          external-label
          color="purple"
          icon="add"
          label="新增"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
  <q-dialog v-model="log" position="right">
    <q-card style="width: 360px">
      <q-linear-progress :value="1.0" color="pink" />
      <q-card-section>
        <q-scroll-area style="height: 200px; max-width: 350px">
          <div
            style="
              white-space: pre-line;
              word-wrap: break-word;
              word-break: break-all;
            "
            v-for="(n, key) in message"
            :key="key"
            class="q-py-xs"
            v-html="n"
          ></div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, inject } from 'vue';
import { api } from 'boot/axios';
import { date, useQuasar } from 'quasar';
import { TaskType } from '../components/task/task';
import TaskData from '../components/task/task.vue';
import SubData from '../components/task/sub.vue';
import { useInitStore } from '../store/init';

export default defineComponent({
  components: {
    'Task-Data': TaskData,
    'Sub-Data': SubData,
  },
  setup() {
    const $q = useQuasar();
    const task = ref<Partial<TaskType>>({});
    const swipe = ref(false);
    const fab = ref(false);
    const log = ref(false);
    const dialog = ref(false);
    const message = ref<string[]>([]);
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: $q.localStorage.getItem<number>('taskPerPage') ?? 5,
    });
    const $store = useInitStore();
    const ws = inject('ws') as WebSocket;
    ws.addEventListener('message', (e) => {
      const result = JSON.parse(e.data) as Record<'type' | 'data', string>;
      if (result.type === 'tasklog') {
        message.value.push(result.data);
      }
    });

    onMounted(async () => {
      try {
        task.value = await api.get('task');
        ws.send(
          JSON.stringify({ type: 'ready', data: 'tasklog', id: $store.id })
        );
        ws.send(JSON.stringify({ type: 'ready', data: 'task', id: $store.id }));
        // 也许会有意想不到的BUG,待测
        if (
          !date.isSameDate(
            $q.localStorage.getItem<Date>('taskUpdate') ?? 0,
            new Date(),
            'day'
          )
        ) {
          Object.values(task.value).forEach((v) => {
            if (v?.type === 'sub') {
              //TODO:更新订阅
            } else {
              if (v?.job.type === 'runjs') {
                ws.send(
                  JSON.stringify({
                    type: 'shell',
                    data: `$download ${v?.job.target} -cwd=script/JSFile`,
                  })
                );
              }
            }
          });
          $q.localStorage.set('taskUpdate', new Date());
        }
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '加载数据失败!',
        });
      }
    });

    const insert = () => {
      const id: string = [Math.random().toString(36).slice(-6)].toString();
      task.value[id] = {
        name: '新的任务',
        type: 'cron',
        time: '20 10 0 * * *',
        job: {
          type: 'exec',
          target: 'node -v',
        },
        running: false,
        id,
      };
      let val = [];
      Object.keys(task.value).forEach((k) => {
        if (task.value[k]?.type !== 'sub') {
          val.push(task.value);
        }
      });
      pagination.value.page = Math.ceil(
        val.length / (pagination.value?.rowsPerPage ?? 5)
      );
    };

    const save = async () => {
      try {
        const result: Record<'message', string> = await api.post(
          'task',
          task.value
        );
        $q.notify({
          position: 'top',
          message: result.message,
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理失败!',
        });
      }
    };
    return { task, swipe, pagination, fab, log, dialog, message, insert, save };
  },
});
</script>
