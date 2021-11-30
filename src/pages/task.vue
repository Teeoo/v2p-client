<template>
  <q-page>
    <q-table
      flat
      row-key='name'
      :rows='Object.values(task)'
      separator='none'
      :columns='header'
      v-model:pagination='pagination'
      filter='{}'
      :filter-method='filterSub'
    >
      <template v-slot:body='props'>
        <q-tr :props='props'>
          <q-td key='name' :props='props'>
            {{ props.row.name }}
          </q-td>
          <q-td key='type' :props='props'>
            <div class='row'>
              <div class='col-12 col-md-3'>
                <q-select :options="[{label: 'cron定时',val: 'cron'}, {label: '倒计时',val: 'schedule'}]"
                          option-value='val'
                          option-label='label'
                          emit-value
                          map-options
                          v-model='props.row.type' />
              </div>
              <div class='col-12 col-md-9'>
                <q-input v-model='props.row.time' />
              </div>
            </div>
          </q-td>
          <q-td key='job' :props='props'>
            <div class='row'>
              <div class='col-12 col-md-3'>
                <q-select :options="[
                  {label: '运行 JS',val: 'runjs'},
                  {label: 'Shell 指令',val: 'exec'},
                  {label: '开始任务',val: 'taskstart'},
                  {label: '停止任务',val: 'taskstop'},
                ]" v-model='props.row.job.type'
                          option-value='val'
                          option-label='label'
                          emit-value
                          map-options
                />
              </div>
              <div class='col-12 col-md-9'>
                <q-input v-model='props.row.job.target' />
              </div>
            </div>
          </q-td>
          <q-td key='running' :props='props'>
            <q-icon :name='props.row.running?"play_arrow":"not_interested"' />
          </q-td>
          <q-td key='action' :props='props'>
            <q-btn flat size='sm' color='pink' label='测试' @click='taskAction(props.row,"test")' />
            <q-btn flat size='sm' color='pink' :label='`${props.row.running?"停止":"开始"}`'
                   @click='taskAction(props.row,props.row.running?"stop":"start")' />
            <q-btn @click='del(props.row.id)' flat size='sm' color='pink' label='删除' />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!-- 订阅 -->
    <q-dialog
      v-model='dialog'
      persistent
      :maximized='maximizedToggle'
      transition-show='rotate'
      transition-hide='rotate'
    >
      <q-card flat>
        <q-bar class='bg-white text-white'>
          <q-btn dense flat round icon='lens' size='8.5px' color='red' v-close-popup>
            <q-tooltip class='bg-white text-primary'>Close</q-tooltip>
          </q-btn>
          <q-btn dense flat round icon='lens' size='8.5px' color='yellow' @click='maximizedToggle = false'
                 :disable='!maximizedToggle'>
            <q-tooltip v-if='maximizedToggle' class='bg-white text-primary'>Minimize</q-tooltip>
          </q-btn>
          <q-btn dense flat round icon='lens' size='8.5px' color='green' @click='maximizedToggle = true'
                 :disable='maximizedToggle'>
            <q-tooltip v-if='!maximizedToggle' class='bg-white text-primary'>Maximize</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section>
          <q-table
            flat
            separator='none'
            :rows='Object.values(task)'
            :columns='subHeader'
            row-key='job'
            filter='{}'
            :filter-method='filterTask'
          >
            <template v-slot:body='props'>
              <q-tr :props='props'>
                <q-td key='name' :props='props'>
                  <q-input color='pink' v-model='props.row.name' label='匹配方式' />
                </q-td>
                <q-td key='type' :props='props'>
                  <q-select color='pink' v-model='props.row.job.type'
                            :options="[{label: '跳过',value: 'skip'}, {label: '新增',value: 'addition'},{label: '替换',value: 'replace'}]"
                            label='匹配阶段'
                            option-value='value'
                            option-label='label'
                            emit-value
                            map-options
                  />
                </q-td>
                <q-td key='target' :props='props'>
                  <q-input color='pink' v-model='props.row.job.target' label='订阅地址' />
                </q-td>
                <q-td key='action' :props='props'>
                  <q-btn @click='getContent(props)' size='sm' flat color='pink' label='获取内容' />
                  <q-btn @click='del(props.row.id)' size='sm' flat color='pink' label='删除' />
                </q-td>
              </q-tr>
              <q-tr v-show='props.expand' :props='props'>
                <q-td colspan='100%'>
                  <q-table
                    flat
                    :rows='taskSubList.list'
                    :columns='header'
                    v-model:pagination='pagination'
                  >
                    <template v-slot:top>
                      <tr>
                        <td>订阅名称:{{ taskSubList.name }}</td>
                        <td>订阅描述:{{ taskSubList.desc }}</td>
                      </tr>
                    </template>
                    <template v-slot:body='p'>
                      <q-tr :props='p'>
                        <q-td key='name' :props='p'>
                          {{ p.row.name }}
                        </q-td>
                        <q-td key='type' :props='p'>
                          <div class='row'>
                            <div class='col-12 col-md-3'>
                              <q-select :options="[{label: 'cron定时',val: 'cron'}, {label: '倒计时',val: 'schedule'}]"
                                        option-value='val'
                                        option-label='label'
                                        emit-value
                                        map-options
                                        v-model='p.row.type' />
                            </div>
                            <div class='col-12 col-md-9'>
                              <q-input v-model='p.row.time' />
                            </div>
                          </div>
                        </q-td>
                        <q-td key='job' :props='p'>
                          <q-select :options="[
                  {label: '运行 JS',val: 'runjs'},
                  {label: 'Shell 指令',val: 'exec'},
                  {label: '开始任务',val: 'taskstart'},
                  {label: '停止任务',val: 'taskstop'},
                ]" v-model='p.row.job.type'
                                    option-value='val'
                                    option-label='label'
                                    emit-value
                                    map-options
                          />
                        </q-td>
                        <q-td key='running' :props='p'>
                          <q-icon :name='p.row.running?"play_arrow":"not_interested"' />
                        </q-td>
                        <q-td key='action' :props='p'>
                          <q-btn @click='addTask(p,props.row)' flat size='sm' color='pink' label='添加任务' />
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-page-sticky position='bottom-right' :offset='[18, 18]'>
          <q-fab
            v-model='draggingFab'
            color='purple'
            icon='keyboard_arrow_left'
            direction='left'
            title='订阅'
          >
            <q-fab-action @click='save' label-position='top' external-label color='purple' icon='save' label='保存' />
            <q-fab-action label-position='top' @click='insertSub' external-label color='purple' icon='add' label='新增' />
          </q-fab>
        </q-page-sticky>
      </q-card>
    </q-dialog>
    <q-dialog v-model='isOpenLog' position='right'>
      <q-card style='width: 360px'>
        <q-linear-progress query color='pink' />
        <q-card-section>
          <q-scroll-area style='height: 200px; max-width: 350px;'>
            <div style='white-space: pre-line;word-wrap:break-word;word-break:break-all' v-for='(n,key) in message'
                 :key='key' class='q-py-xs' v-html='n'></div>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-page-sticky position='bottom-right' :offset='[18, 18]'>
      <q-fab
        v-model='draggingFab'
        color='purple'
        icon='keyboard_arrow_left'
        direction='left'
        title='任务'
      >
        <q-fab-action @click='isOpenLog=true' label-position='top' external-label color='purple' icon='logo_dev'
                      label='日志' />
        <q-fab-action @click='dialog=true' label-position='top' external-label color='purple' icon='mdi-playlist-check '
                      label='订阅' />
        <q-fab-action @click='save' label-position='top' external-label color='purple' icon='save' label='保存' />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang='ts'>
import { defineComponent, inject, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useInitStore } from 'src/store/init';

const columns = [
  { name: 'name', align: 'center', label: '名称', field: 'name' },
  { name: 'type', align: 'center', label: '时间', field: 'type' },
  { name: 'job', align: 'center', label: '任务', field: 'job' },
  { name: 'running', align: 'center', label: '状态', field: 'running' },
  { name: 'action', align: 'center', label: '操作', field: 'action' }
];

export interface Message {
  type: string;
  data: Data;
}

export interface Data {
  type: string;
  data: string[];
}

export interface V2Pstatus {
  type: string;
  data: Data;
}

export interface Data {
  clients: number;
  memoryusage: Memoryusage;
}

export interface Memoryusage {
  rss: string;
  heapTotal: string;
  heapUsed: string;
  external: string;
  arrayBuffers: string;
}

export interface Task {
  [keys: string]: Bh1jEbDk;
}

export interface Bh1jEbDk {
  id: string;
  name: string;
  type: string;
  time: string;
  job: Job;
  running: boolean;
}

export interface Job {
  type: string;
  target: string;
}

export interface TaskSub {
  name: string;
  desc: string;
  date: string;
  type: string;
  author: string;
  resource: string;
  list: Bh1jEbDk[];
}

export default defineComponent({
  components: {},
  setup() {
    const $q = useQuasar();
    const task = ref<Partial<Task>>({});
    // const taskList = ref<Partial<Bh1jEbDk[]>>([]);
    // const taskSub = ref<Partial<Bh1jEbDk[]>>([]);
    const taskSubList = ref<Partial<TaskSub>>({});
    const header = ref(columns);
    const subHeader = ref([
      { name: 'name', align: 'center', label: '订阅名称', field: 'name' },
      { name: 'type', align: 'center', label: '同名任务处理方式', field: 'type' },
      { name: 'target', align: 'center', label: '订阅地址', field: 'target' },
      { name: 'action', align: 'center', label: '操作', field: 'action' }
    ]);
    const draggingFab = ref(false);
    const isOpenLog = ref(false);
    const dialog = ref(false);
    const maximizedToggle = ref(true);
    const pagination = ref({ sortBy: 'desc', descending: false, page: 1, rowsPerPage: 5 });
    const loading = ref(true);
    const message = ref<string[]>([]);
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
        void await loadInfo();
        $q.notify({
          position: 'top',
          message: `成功获取任务列表 ${Object.values(task.value).length}`
        });
        loading.value = false;
        ws.send(JSON.stringify({ 'type': 'ready', 'data': 'tasklog', 'id': $store.id }));
        ws.send(JSON.stringify({ 'type': 'ready', 'data': 'task', 'id': $store.id }));
      } catch (e) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Loading failed',
          icon: 'report_problem'
        });
        loading.value = false;
      }
    });

    const loadInfo = async () => {
      task.value = await api.get('task');
    };

    const save = async () => {
      try {
        const result: Record<'message', string> = await api.post('task', task.value);
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: e as string,
          icon: 'report_problem'
        });
      }
    };

    const taskAction = async (item: Bh1jEbDk, type: string) => {
      try {
        isOpenLog.value = type === 'test';
        let to;
        if (type === 'test') {
          to = {
            'tid': `to${type}`,
            'task': item
          };
        } else if (type === 'start') {
          to = {
            'task': Object.assign(item, {
              'running': true
            })
          };
        } else {
          to = {
            'tid': item.id
          };
        }
        const result: Record<'message', 'string'> = await api.put('task', {
          'op': type,
          'data': to
        });
        $q.notify({
          position: 'top',
          message: type === 'test' ? '任务已下发' : result.message
        });
        item.running = !item.running;
        void await loadInfo();
      } catch (e) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: e as string,
          icon: 'report_problem'
        });
      }
    };

    const insertSub = () => {
      const id: string = [Math.random().toString(36).slice(-6)].toString();
      Object.assign(task.value, {
        [id]: {
          'name': 'elecV2P 任务订阅',
          'type': 'sub',
          'job': {
            'type': 'skip',
            'target': 'https://raw.githubusercontent.com/Oreomeow/checkinpanel/master/dailycheckin.json'
          },
          id
        }
      });
      // taskSub.value = [];
      // Object.values(task).forEach((i) => {
      //   if (i?.type === 'sub') {
      //     taskSub.value.push(i);
      //   }
      // });
      // paginationSub.value.page = Math.ceil(Object.values(rewrite.rewritesub as Rewritesub).length / paginationSub.value.rowsPerPage);
    };

    const getContent = async (item: {
      row: {
        name: string
        type: string
        job: {
          type: string
          target: string
        }
      }
      pageIndex: number
      rowIndex: number
      color: string
      dark: boolean
      dense: boolean
      expand: boolean
    }) => {
      try {
        item.expand = true;
        taskSubList.value = await api.get(item.row.job.target);
      } catch (e) {
        const notify = $q.notify({
          type: 'negative',
          position: 'top',
          group: false,
          timeout: 0,
          spinner: true,
          message: '获取订阅信息失败,即将尝试从服务器端获取该订阅内容'
        });
        setTimeout(() => {
          api.get(`data?type=stream&url=${item.row.job.target}`).then(d => {
            taskSubList.value = d as unknown as TaskSub;
            notify({
              type: 'positive',
              icon: 'done',
              spinner: false,
              /* eslint-disable @typescript-eslint/no-non-null-assertion */
              message: `成功获取任务${taskSubList.value.list!.length}条`,
              timeout: 2500
            });
          }).catch(() => {
            notify({
              type: 'negative',
              icon: 'done',
              spinner: false,
              message: '获取订阅任务失败',
              timeout: 2500
            });
          });
        }, 3000);
      }
    };

    const del = async (tid: string) => {
      try {
        const result: Record<'message', string> = await api.put('task', {
          'data': {
            tid
          },
          'op': 'delete'
        });
        void await loadInfo();
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          color: 'negative',
          message: '出错啦~'
        });
      }
    };

    const filterSub = (rows: Bh1jEbDk[]): Bh1jEbDk[] => {
      return rows.filter(item => item.type !== 'sub');
    };

    const filterTask = (rows: Bh1jEbDk[]): Bh1jEbDk[] => {
      return rows.filter(item => item.type === 'sub');
    };

    const addTask = async (item: {
      row: {
        name: string;
        type: string;
        time: string;
        job: {
          type: string;
          target: string;
        };
        running: boolean;
      }
    }, sub: {
      name: string;
      type: string;
      job: {
        type: string;
        target: string;
      };
      id: string;
    }) => {
      try {
        Object.assign(task.value, {
          [Math.random().toString(36).slice(-6)]: item.row
        });
        const result: Record<'message', string> = await api.put('task',
          {
            'op': 'add',
            'data': {
              'task': [Object.assign(item.row, { 'belong': sub.id })],
              'type': sub.job.type
            }
          }
        );
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          color: 'negative',
          message: '出错啦~'
        });
      }
    };

    return {
      task,
      header,
      del,
      save,
      draggingFab,
      pagination,
      loading,
      isOpenLog,
      message,
      taskAction,
      dialog,
      subHeader,
      maximizedToggle,
      insertSub,
      getContent,
      filterSub,
      filterTask,
      addTask,
      taskSubList
    };
  }
});
</script>
