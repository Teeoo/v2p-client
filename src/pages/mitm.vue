<template>
  <q-page v-touch-hold.mouse='()=>handleSwipe=!handleSwipe'>
    <q-table
      flat
      separator='none'
      :columns='header'
      :rows='mitm.host'
      v-model:pagination='pagination'
    >
      <template v-slot:body='props'>
        <q-tr :props='props'>
          <q-td key='host' :props='props'>
            <q-input v-model='props.row.host' />
          </q-td>
          <q-td key='note' :props='props'>
            <q-input v-model='props.row.note' />
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
        <q-fab-action @click='save' label-position='top' external-label color='purple' icon='save' label='保存' />
        <q-fab-action @click='insert' label-position='top' external-label color='purple' icon='add' label='新增' />
        <q-fab-action @click='dialog=true' label-position='top' external-label color='purple' icon='mdi-certificate'
                      label='证书' />
      </q-fab>
    </q-page-sticky>
    <q-dialog v-model='dialog' position='right'>
      <q-card flat>
        <q-card-section horizontal>
          <q-card-section>
            <div class='text-h6'>当前使用证书</div>
            <div class='text-subtitle1'>{{ mitm.crtinfo?.commonName ?? '没有检测到相关证书(可能是 ANYPROXY 尚未开启)' }}</div>
            <div class='text-h6'>有效日期</div>
            <div class='text-subtitle1'>{{ mitm.crtinfo?.notBefore ?? '无' }} 至 {{ mitm.crtinfo?.notAfter ?? '无' }}</div>
          </q-card-section>

          <q-card-section>
            <q-input label='证书名称' v-model='commonName' />
            <q-toggle color='pink' label='强制覆盖' v-model='overwrite' />
          </q-card-section>

          <q-card-actions vertical class='justify-around q-px-md'>
            <q-btn flat round color='red' icon='download' @click='download'>
              <q-tooltip anchor='center left' self='center right' :offset='[10, 10]'>
                下载当前使用的根证书 rootCA.crt
              </q-tooltip>
            </q-btn>
            <q-btn flat round color='accent' icon='mdi-newspaper-variant-multiple' @click='generate'>
              <q-tooltip anchor='center left' self='center right' :offset='[10, 10]'>
                生成新的根证书
              </q-tooltip>
            </q-btn>
            <!--            <q-btn flat round color='primary' icon='upload' />-->
            <q-btn flat round color='primary' icon='mdi-cached' @click='tempcaches'>
              <q-tooltip anchor='center left' self='center right' :offset='[10, 10]'>
                清空 ANYPROXY temp cache 文件夹
              </q-tooltip>
            </q-btn>
            <q-btn flat round color='primary' icon='mdi-delete' @click='clear'>
              <q-tooltip anchor='center left' self='center right' :offset='[10, 10]'>
                删除由根证书签发的其他域名证书
              </q-tooltip>
            </q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

export interface Mitm {
  host: Host[];
  enable: boolean;
  crtinfo: Crtinfo;
}

export interface Host {
  host: string;
  enable: boolean;
  note?: string;
}

export interface Crtinfo {
  rescode: number;
  commonName: string;
  notBefore: string;
  notAfter: string;
}


const columns = [
  { name: 'host', align: 'center', label: '解析域名', field: 'host' },
  { name: 'note', align: 'center', label: '备注', field: 'note' },
  { name: 'enable', align: 'center', label: '启用', field: 'enable' },
  { name: 'action', align: 'center', label: '操作', field: 'action' }
];

export default defineComponent({
  components: {},
  setup() {
    const $q = useQuasar();
    const header = ref(columns);
    const pagination = ref({ sortBy: 'desc', descending: false, page: 1, rowsPerPage: 5 });
    const mitm = ref<Partial<Mitm>>({});
    const draggingFab = ref(false);
    const dialog = ref(false);
    const handleSwipe = ref(false);
    const commonName = ref('elecV2P');
    const overwrite = ref(false);

    onMounted(async () => {
      try {
        mitm.value = await api.get('data?type=mitmhost');
        $q.notify({
          position: 'top',
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          message: `成功获取 mitmhost 列表 ${mitm.value.host?.length}`
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    });

    const del = (idx: number) => {
      mitm.value.host?.splice(idx, 1);
    };

    const insert = () => {
      mitm.value.host?.push(
        {
          'host': '',
          'note': '备注',
          'enable': true
        }
      );
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      pagination.value.page = Math.ceil(mitm.value.host!.length / pagination.value.rowsPerPage);
    };

    const save = async () => {
      try {
        const result: Record<'message', string> = await api.put('data', {
          'mitmhostenable': false,
          'type': 'mitmhost',
          'data': mitm.value.host
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

    const download = () => {
      window.location.href = '/crt';
    };

    const generate = async () => {
      const notif = $q.notify({
        position: 'top',
        group: false,
        timeout: 0,
        spinner: true,
        message: '证书生成中...'
      });
      try {
        const result: Record<'message' | 'rescode', string | number> = await api.put('crt', {
          'op': 'new',
          'data': {
            'commonName': commonName.value,
            'overwrite': overwrite.value
          }
        });
        let msg: string;
        if (Number(result.rescode) !== -1) {
          msg = `成功生成新的根证书
          ${result.message}
将在 ANYPROXY 重启后自动应用`;
        } else {
          msg = result.message.toString();
        }
        notif({
          icon: 'done',
          spinner: false,
          message: msg,
          timeout: 2500
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    };

    const tempcaches = async () => {
      try {
        const result: Record<'message', string> = await api.delete('tempcaches');
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

    const clear = async () => {
      try {
        const result: Record<'message', string> = await api.put('crt', { 'op': 'clearcrt' });
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

    return {
      header,
      pagination,
      mitm,
      del,
      save,
      insert,
      draggingFab,
      dialog,
      download,
      commonName,
      overwrite,
      generate,
      tempcaches,
      clear,
      handleSwipe
    };
  }
});
</script>

