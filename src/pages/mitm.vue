<template>
  <q-page v-touch-hold.mouse="() => (handleSwipe = !handleSwipe)">
    <Mitm-Data v-model="mitm" v-model:pagination="pagination" />
    <q-page-sticky
      v-show="handleSwipe"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-fab
        v-model="draggingFab"
        color="purple"
        icon="keyboard_arrow_left"
        direction="left"
      >
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
        <q-fab-action
          @click="dialog = true"
          label-position="top"
          external-label
          color="purple"
          icon="mdi-certificate"
          label="证书"
        />
      </q-fab>
    </q-page-sticky>
    <q-dialog v-model="dialog" position="right">
      <q-card flat>
        <q-card-section horizontal>
          <q-card-section>
            <div class="text-h6">当前使用证书</div>
            <div class="text-subtitle1">
              {{
                mitm.crtinfo?.commonName ??
                '没有检测到相关证书(可能是 ANYPROXY 尚未开启)'
              }}
            </div>
            <div class="text-h6">有效日期</div>
            <div class="text-subtitle1">
              {{ mitm.crtinfo?.notBefore ?? '无' }} 至
              {{ mitm.crtinfo?.notAfter ?? '无' }}
            </div>
          </q-card-section>

          <q-card-section>
            <q-input label="证书名称" v-model="commonName" />
            <q-toggle color="pink" label="强制覆盖" v-model="overwrite" />
            <q-card-actions class="justify-around">
              <q-btn flat round color="red" icon="download" @click="download">
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :offset="[10, 10]"
                >
                  下载当前使用的根证书 rootCA.crt
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="accent"
                icon="mdi-newspaper-variant-multiple"
                @click="generate"
              >
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :offset="[10, 10]"
                >
                  生成新的根证书
                </q-tooltip>
              </q-btn>
              <!--            <q-btn flat round color='primary' icon='upload' />-->
              <q-btn
                flat
                round
                color="primary"
                icon="mdi-cached"
                @click="caches"
              >
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :offset="[10, 10]"
                >
                  清空 ANYPROXY temp cache 文件夹
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="primary"
                icon="mdi-delete"
                @click="clear"
              >
                <q-tooltip
                  anchor="center left"
                  self="center right"
                  :offset="[10, 10]"
                >
                  删除由根证书签发的其他域名证书
                </q-tooltip>
              </q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { Mitm } from '../components/mitm/mitm';
import MitmData from '../components/mitm/mitm.vue';

export default defineComponent({
  components: { 'Mitm-Data': MitmData },
  setup() {
    const $q = useQuasar();
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: $q.localStorage.getItem<number>('mitmPerPage') ?? 5,
    });
    const handleSwipe = ref(false);
    const draggingFab = ref(false);
    const dialog = ref(false);

    const commonName = ref('elecV2P');
    const overwrite = ref(false);

    const mitm = ref<Partial<Mitm>>({});

    onMounted(async () => {
      try {
        mitm.value = await api.get('data?type=mitmhost');
        $q.notify({
          position: 'top',
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          message: `成功获取 mitmhost 列表 ${mitm.value.host?.length}`,
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '获取数据失败',
        });
      }
    });

    const save = async () => {
      try {
        const result: Record<'message', string> = await api.put('data', {
          mitmhostenable: false,
          type: 'mitmhost',
          data: mitm.value.host,
        });
        $q.notify({
          position: 'top',
          message: result.message,
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '保存数据失败',
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
        message: '证书生成中...',
      });
      try {
        const result: Record<'message' | 'rescode', string | number> =
          await api.put('crt', {
            op: 'new',
            data: {
              commonName: commonName.value,
              overwrite: overwrite.value,
            },
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
          timeout: 2500,
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子',
        });
      }
    };

    const clear = async () => {
      try {
        const result: Record<'message', string> = await api.put('crt', {
          op: 'clearcrt',
        });
        $q.notify({
          position: 'top',
          message: result.message,
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理出错了',
        });
      }
    };

    const caches = async () => {
      try {
        const result: Record<'message', string> = await api.delete(
          'tempcaches'
        );
        $q.notify({
          position: 'top',
          message: result.message,
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理出错了',
        });
      }
    };

    const insert = () => {
      mitm.value.host?.push({
        host: '',
        note: '备注',
        enable: true,
      });
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      pagination.value.page = Math.ceil(
        mitm.value.host!.length / pagination.value.rowsPerPage
      );
    };

    return {
      pagination,
      handleSwipe,
      mitm,
      draggingFab,
      dialog,
      commonName,
      overwrite,
      save,
      download,
      generate,
      clear,
      caches,
      insert,
    };
  },
});
</script>
