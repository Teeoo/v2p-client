<template>
  <q-page
    v-touch-hold.mouse='()=>handleSwipe=!handleSwipe'
  >
    <q-table
      flat
      separator='none'
      :rows='rule.eplists?.list'
      :columns='header'
      v-model:pagination='pagination'
    >
      <template v-slot:body='props'>
        <q-tr :props='props'>
          <q-td key='mtype' :props='props'>
            <q-select color='pink' v-model='props.row.mtype' :options='mtype' label='匹配方式' />
          </q-td>

          <q-td key='match' :props='props'>
            <q-input color='pink' v-model='props.row.match' label='匹配内容' />
          </q-td>

          <q-td key='ctype' :props='props'>
            <q-select color='pink' v-model='props.row.ctype' :options='ctype'
                      option-value='val'
                      option-label='label'
                      emit-value
                      map-options label='修改方式' />
          </q-td>

          <q-td key='target' :props='props'>
            <q-input color='pink' v-model='props.row.target' label='修改内容' />
          </q-td>

          <q-td key='stage' :props='props'>
            <q-select color='pink' v-model='props.row.stage' :options='stage'
                      option-value='val'
                      option-label='label'
                      emit-value
                      map-options
                      label='修改时间' />
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
    <q-page-sticky v-show='handleSwipe' position='bottom-right' :offset='[18, 18]'>
      <q-fab
        v-model='draggingFab'
        color='purple'
        icon='keyboard_arrow_left'
        direction='left'
      >
        <q-fab-action @click='insert' label-position='top' external-label color='purple' icon='add' label='新增' />
        <q-fab-action @click='save' label-position='top' external-label color='purple' icon='save' label='保存' />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang='ts'>

import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const columns = [
  { name: 'mtype', align: 'center', label: '匹配方式', field: 'mtype' },
  { name: 'match', align: 'center', label: '匹配内容（正则）', field: 'match' },
  { name: 'ctype', align: 'center', label: '修改方式', field: 'ctype' },
  { name: 'target', align: 'center', label: '修改内容', field: 'target' },
  { name: 'stage', align: 'center', label: '修改时间', field: 'stage' },
  { name: 'enable', align: 'center', label: '启用', field: 'enable' },
  { name: 'action', align: 'center', label: '操作', field: 'action' }
];
const mtype = ['url', 'host', 'useragent', 'reqmethod', 'reqbody', 'resstatus', 'restype', 'resbody'];
const ctype = [
  { label: 'JS', val: 'js' },
  { label: '307 重定向', val: '307' },
  { label: '阻止', val: 'block' },
  { label: '$HOLD', val: 'hold' },
  { label: 'User-Agent', val: 'ua' }
];
const stage = [{ label: '网络请求前', val: 'req' }, { label: '数据返回前', val: 'res' }];

interface Rules {
  eplists: Eplists;
  uagent: Uagent;
}

interface Eplists {
  note: string;
  total: number;
  active: number;
  list: List[];
}

interface List {
  mtype: string;
  match: string;
  ctype: string;
  target: string;
  stage: string;
  enable: boolean;
}

interface Uagent {
  iPhone: IPhone;
  chrome: Chrome;
}

interface IPhone {
  name: string;
  header: string;
}

interface Chrome {
  name: string;
  header: string;
}

export default defineComponent({
  components: {},
  setup() {
    const $q = useQuasar();
    const rule = ref<Partial<Rules>>({});
    const header = ref(columns);
    const draggingFab = ref(false);
    const handleSwipe = ref(false);
    const pagination = ref({ sortBy: 'desc', descending: false, page: 1, rowsPerPage: 5 });
    onMounted(async () => {
      try {
        rule.value = await api.get('data?type=rules');
        $q.notify({
          position: 'top',
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          message: `成功获取规则列表 ${rule.value.eplists!.total} / ${rule.value.eplists!.active} `
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    });

    const del = (idx: number) => {
      rule.value.eplists?.list.splice(idx, 1);
    };

    const save = async () => {
      try {
        const result: Record<'message', string> = await api.put('data', {
          'type': 'rules',
          'eplists': rule.value.eplists?.list
        });
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    };

    const insert = () => {
      rule.value.eplists?.list.push(
        {
          'mtype': 'host',
          'match': 'host.com',
          'ctype': 'hold',
          'target': 'body.js',
          'stage': 'res',
          'enable': true
        }
      );
      pagination.value.page = Math.ceil(rule.value.eplists!.list.length / pagination.value.rowsPerPage);
    };

    return {
      rule, header, mtype, ctype, stage, del, save, draggingFab, insert, pagination, handleSwipe
    };
  }
});
</script>
