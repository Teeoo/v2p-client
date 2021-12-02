<template>
  <q-page>
    <q-table
      flat
      separator='none'
      :rows='rewrite.rewrite?.list'
      :columns='header'
      v-model:pagination='pagination'
    >
      <template v-slot:body='props'>
        <q-tr :props='props'>
          <q-td key='match' :props='props'>
            {{ props.row.match }}
            <q-popup-edit v-model='props.row.match'>
              <q-input type='textarea' v-model='props.row.match' dense autofocus counter label='匹配方式' />
            </q-popup-edit>
          </q-td>

          <q-td key='stage' :props='props'>
            {{ props.row.stage === 'req' ? '网络请求前' : '数据返回前' }}
            <q-popup-edit v-model='props.row.stage'>
              <q-select color='pink' v-model='props.row.stage'
                        :options="[{label: '网络请求前',value: 'req'}, {label: '数据返回前',value: 'res'}]" label='匹配阶段'
                        option-value='value'
                        option-label='label'
                        emit-value
                        map-options
              />
            </q-popup-edit>
          </q-td>

          <q-td key='target' :props='props'>
            {{ props.row.target }}
            <q-popup-edit v-model='props.row.target'>
              <q-input type='textarea' counter color='pink' v-model='props.row.target' label='匹配内容' />
            </q-popup-edit>
          </q-td>

          <q-td key='enable' :props='props'>
            <q-toggle
              v-model='props.row.enable'
              color='pink'
            />
          </q-td>

          <q-td key='action' :props='props'>
            <q-btn @click='del(props.pageIndex)' size='sm' flat color='pink' label='删除' />
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
            :rows='Object.values(rewrite.rewritesub)'
            :columns='subHeader'
            v-model:pagination='paginationSub'
          >
            <template v-slot:body='props'>
              <q-tr :props='props'>
                <q-td auto-width>
                  <q-btn flat color='accent' round dense @click='props.row.collapse = !props.row.collapse'
                         :icon="props.expand ? 'mdi-chevron-down' : 'mdi-chevron-up'" />
                </q-td>
                <q-td key='name' :props='props'>
                  <q-input color='pink' v-model='props.row.name' label='订阅名称' />
                </q-td>
                <q-td key='resource' :props='props'>
                  <q-input color='pink' v-model='props.row.resource' label='订阅地址' />
                </q-td>
                <q-td key='enable' :props='props'>
                  <q-toggle
                    v-model='props.row.enable'
                    color='pink'
                  />
                </q-td>
                <q-td key='action' :props='props'>
                  <q-btn @click='getContent(props)' size='sm' flat color='pink' label='获取内容' />
                  <q-btn disable @click='delSub(props.pageIndex)' size='sm' flat color='pink' label='删除' />
                </q-td>
              </q-tr>
              <q-tr v-show='props.row.collapse' :props='props'>
                <q-td colspan='100%'>
                  <q-table
                    flat
                    :rows='props.row.list'
                    :columns='header'
                    v-model:pagination='pagination'
                  >
                    <template v-slot:body='props'>
                      <q-tr :props='props'>
                        <q-td key='match' :props='props'>
                          <q-input color='pink' v-model='props.row.match' label='订阅名称' />
                        </q-td>
                        <q-td key='stage' :props='props'>
                          <q-select color='pink' v-model='props.row.stage'
                                    :options="[{label: '网络请求前',value: 'req'}, {label: '数据返回前',value: 'res'}]"
                                    label='匹配阶段'
                                    option-value='value'
                                    option-label='label'
                                    emit-value
                                    map-options
                          />
                        </q-td>
                        <q-td key='target' :props='props'>
                          <q-input color='pink' v-model='props.row.target' label='订阅地址' />
                        </q-td>
                        <q-td key='enable' :props='props'>
                          <q-toggle
                            v-model='props.row.enable'
                            color='pink'
                          />
                        </q-td>
                        <q-td key='action' :props='props'>
                          <q-btn disable @click='delSubRes(props.pageIndex)' size='sm' flat color='pink' label='删除' />
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
            <q-fab-action @click='insertSub' label-position='top' external-label color='purple' icon='add' label='新增' />
          </q-fab>
        </q-page-sticky>
      </q-card>
    </q-dialog>
    <q-page-sticky position='bottom-right' :offset='[18, 18]'>
      <q-fab
        v-model='draggingFab'
        color='purple'
        icon='keyboard_arrow_left'
        direction='left'
        title='订阅'
      >
        <q-fab-action @click='save' label-position='top' external-label color='purple' icon='save' label='保存' />
        <q-fab-action @click='dialog=true' label-position='top' external-label color='purple' icon='mdi-playlist-check '
                      label='订阅' />
        <q-fab-action @click='insert' label-position='top' external-label color='purple' icon='add' label='新增' />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref, reactive } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const columns = [
  { name: 'match', align: 'center', label: '匹配链接（正则表达式）', field: 'match' },
  { name: 'stage', align: 'center', label: '匹配阶段', field: 'stage' },
  { name: 'target', align: 'center', label: '对应重写目标', field: 'target' },
  { name: 'enable', align: 'center', label: '启用', field: 'enable' },
  { name: 'action', align: 'center', label: '操作', field: 'action' }
];

const subColumns = [
  { name: 'collapse', align: 'center', label: '折叠', field: 'collapse' },
  { name: 'name', align: 'center', label: '订阅名称', field: 'name' },
  { name: 'resource', align: 'center', label: '订阅地址', field: 'resource' },
  { name: 'enable', align: 'center', label: '启用', field: 'enable' },
  { name: 'action', align: 'center', label: '操作', field: 'action' }
];

interface RewriteLists {
  rewrite: Rewrite;
  rewritesub: Rewritesub;
}

interface Rewrite {
  note: string;
  total: number;
  active: number;
  enable: boolean;
  list: List[];
}

interface List {
  match: string;
  stage: string;
  target: string;
  enable: boolean;
}

interface Rewritesub {
  [keys: string]: {
    name: string
    resource: string
    type: string
    note: string
    date: string
    total: number
    active: number
    enable: boolean
    bkcolor: string
    collapse: boolean
    list: List[]
  };
}

export default defineComponent({
  components: {},
  setup() {
    const $q = useQuasar();
    const rewrite = reactive<Partial<RewriteLists>>({});
    const header = ref(columns);
    const subHeader = ref(subColumns);
    const draggingFab = ref(false);
    const dialog = ref(false);
    const maximizedToggle = ref(true);
    const pagination = ref({ sortBy: 'desc', descending: false, page: 1, rowsPerPage: 5 });
    const paginationSub = ref({ sortBy: 'desc', descending: false, page: 1, rowsPerPage: 5 });
    onMounted(async () => {
      try {
        const data: RewriteLists = await api.get('data?type=rewritelists');
        Object.assign(rewrite, data);
        $q.notify({
          position: 'top',
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          message: `成功获取 REWRITE 列表，规则 ${rewrite.rewrite!.total} 订阅 ${Object.values(data.rewritesub).length}`
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    });

    const del = (idx: number) => {
      rewrite.rewrite?.list.splice(idx, 1);
    };

    const delSub = (idx: number) => {
      console.log(idx);
      // rewrite.rewritesub?.splice(idx, 1);
      // console.info(rewrite.rewritesub)
      // const im: Rewritesub[] = Object.values(rewrite.rewritesub as Rewritesub);
      // im?.splice(idx, 1);
    };

    const delSubRes = (idx: number) => {
      console.info(idx);
    };


    const save = async () => {
      // const rewriteSub = {};
      // rewrite.rewritesub?.map(value => {
      //   Object.assign(rewriteSub, { [Math.random().toString(36).slice(-6)]: value });
      // });
      try {
        const result: Record<'message', string> = await api.put('data', {
          'type': 'rewrite',
          'rewritelists': rewrite.rewrite?.list,
          'rewritesub': rewrite.rewritesub
        });
        $q.notify({
          position: 'top',
          message: result.message
        });
        dialog.value = false;
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    };

    const insert = () => {
      rewrite.rewrite?.list.push({
        'match': '',
        'stage': '',
        'target': '',
        'enable': true
      });
      pagination.value.page = Math.ceil(rewrite.rewrite!.list.length / pagination.value.rowsPerPage);
    };

    const insertSub = () => {
      Object.assign(rewrite.rewritesub, {
        [Math.random().toString(36).slice(-6)]: {
          'name': 'elecV2P 重写订阅',
          'resource': 'https://raw.githubusercontent.com/shaolin-kongfu/js_scripts/main/zq/zqcx.json',
          'type': 'rewrite',
          'note': '',
          'date': '',
          'total': 0,
          'active': 0,
          'enable': true,
          'bkcolor': '#c55890',
          'collapse': false,
          'list': []
        }
      });
      paginationSub.value.page = Math.ceil(Object.values(rewrite.rewritesub as Rewritesub).length / paginationSub.value.rowsPerPage);
    };

    const getContent = async (item: Record<'pageIndex', number>) => {
      const result: {
        name: string
        author: string
        mitmhost: string[]
        rewrite: [{
          match: string
          target: string
          enable: boolean
        }]
      } = await api.get(Object.values(rewrite.rewritesub as Rewritesub)[item.pageIndex].resource);
      Object.values(rewrite.rewritesub as Rewritesub)[item.pageIndex].list = result.rewrite as unknown as List[];
    };

    return {
      rewrite,
      header,
      subHeader,
      del,
      delSub,
      save,
      draggingFab,
      insert,
      insertSub,
      pagination,
      paginationSub,
      dialog,
      maximizedToggle,
      delSubRes,
      getContent
    };
  }
});
</script>
