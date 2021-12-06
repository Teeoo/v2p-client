<template>
  <q-page
    v-touch-hold.mouse='()=>handleSwipe=!handleSwipe'>
    <q-card flat>
      <q-card-section>
        <div class='row'>
          <div class='col-12 col-md-6'>
            <q-input @blur='validation' counter v-model='downFile' label='远程JS链接' dense
                     :rules='[
                         val => val && val.length > 0 || "请填写url",
                         val => val && /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/.test(val) || "请输入正确的url"
                     ]' />
          </div>
          <div class='col-12 col-md-6'>
            <q-btn-group spread>
              <q-btn @click='download' :disable='disable' color='purple' label='开始推送' />
              <q-btn @click='alertUpload=!alertUpload' color='purple' label='上传本地JS' />
            </q-btn-group>
            <q-dialog v-model='alertUpload'>
              <q-card>
                <q-card-section>
                  <div class='text-h6'>上传本地JS</div>
                </q-card-section>

                <q-card-section>
                  <q-uploader
                    url='/uploadjs'
                    field-name='js'
                    label='选择文件'
                    color='purple'
                    flat
                  />
                </q-card-section>

                <q-card-actions align='right'>
                  <q-btn flat label='关闭' @click='alertUpload=false' color='primary' v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class='text-h6 text-center' @click='alertStore=true'>store/cookie 常量储存管理 - {{ store.length }}</div>
      </q-card-section>
      <q-card-section>
        <q-chip clickable dense @remove='storeAction("delete",item)' size='18px' icon='mdi-cookie-settings '
                v-for='item in store' :key='item'
                removable
                @click='storeHandler(item)'>
          {{ item }}
        </q-chip>
      </q-card-section>
      <q-card-section>
        <div class='text-h6 text-center' @click='alertJs=true'>当前服务器 JS 文件 - {{ manage.jslists?.length }}</div>
      </q-card-section>
      <q-card-section>
        <q-chip clickable @click='jsHandler(item)' dense @remove='delJs(item)' size='18px' icon='mdi-nodejs'
                v-for='item in manage.jslists' :key='item'
                removable>
          {{ item }}
        </q-chip>
      </q-card-section>
    </q-card>
    <!-- store编辑 -->
    <q-dialog v-model='alertStore' seamless position='bottom'>
      <q-card flat style='width: 420px;' class='q-px-sm q-pb-md'>
        <q-card-section class='row items-center q-pb-none'>
          <div class='text-h6'>编辑{{ storeKey }}</div>
          <q-space />
          <q-btn @click='alertStore=false' icon='close' flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form class='q-gutter-md'>
            <q-input
              label='key'
              v-model='storeKey'
            />
            <q-select
              label='type'
              :options='["string","number","array","object","boolean"]'
              v-model='pushStore.type'
            />

            <q-input
              label='关联脚本'
              v-model='pushStore.belong'
            />
            <q-input
              label='备注'
              v-model='pushStore.note'
            />
            <q-input
              ref='codemirror'
              type='textarea'
              label='内容'
              v-model='pushStore.value'
              :hint='`最近更新时间: ${pushStore.update}`'
            />
            <div>
              <q-btn @click='storeAction("save")' label='提交' flat color='pink' />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- js编辑 -->
    <q-dialog v-model='alertJs' seamless position='bottom'>
      <q-card flat style='width: 420px;' class='q-px-sm q-pb-md'>
        <q-card-section class='row items-center q-pb-none'>
          <div class='text-h6'>编辑{{ jsKey }}</div>
          <q-space />
          <q-btn @click='alertJs=false' icon='close' flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <q-form class='q-gutter-md'>
            <q-input
              label='文件名'
              v-model='jsKey'
            />
            <Codemirror v-model='jsContent' />
            <div>
              <q-btn @click='saveJs' label='提交' flat color='pink' />
            </div>
          </q-form>
        </q-card-section>
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
    <q-page-sticky v-show='handleSwipe' position='bottom-right' :offset='[18, 18]'>
      <q-fab
        v-model='draggingFab'
        color='purple'
        icon='keyboard_arrow_left'
        direction='left'
        title='任务'
      >
        <q-fab-action @click='isOpenLog=true' label-position='top' external-label color='purple' icon='logo_dev'
                      label='日志' />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang='ts'>
import { defineComponent, inject, onMounted, ref } from 'vue';
import Codemirror from '../components/codemirror.vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useInitStore } from 'src/store/init';

interface JsManage {
  storemanage: boolean;
  jslists: string[];
}

interface StoreType {
  type: string;
  value: string;
  note: string;
  update: string;
  belong: string;
}

export default defineComponent({
  components: {
    Codemirror
  },
  setup() {
    const $q = useQuasar();
    const manage = ref<Partial<JsManage>>({});
    const pushStore = ref<Partial<StoreType>>({});
    const store = ref<string[]>([]);
    const isOpenEdit = ref(false);
    const alertUpload = ref(false);
    const alertJs = ref(false);
    const disable = ref(false);
    const storeKey = ref('');
    const jsKey = ref('');
    const jsContent = ref('');
    const downFile = ref('');
    const alertStore = ref(false);
    const isOpenLog = ref(false);
    const downloadForm = ref(null);
    const draggingFab = ref(false);
    const handleSwipe = ref(false);

    const message = ref<string[]>([]);
    const ws = inject('ws') as WebSocket;
    const $store = useInitStore();
    ws.addEventListener('message', (e) => {
      const result = JSON.parse(e.data) as Record<'type' | 'data', string>;
      if (result.type === 'jsmanage') {
        message.value.push(result.data);
        if (result.data.indexOf('100%') !== -1) {
          isOpenLog.value = false;
          disable.value = false;
        }
      }
    });
    onMounted(async () => {
      try {
        manage.value = await api.get('jsmanage');
        $q.notify({
          position: 'top',
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          message: `成功获取JS列表 ${manage.value.jslists!.length}`
        });
        store.value = await api.get('store');
        $q.notify({
          position: 'top',
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          message: `成功获取 store 数据 ${store.value.length}`
        });
        ws.send(JSON.stringify({ 'type': 'ready', 'data': 'jsmanage', 'id': $store.id }));
      } catch (e) {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Loading failed',
          icon: 'report_problem'
        });
      }
    });

    const delJs = async (f: string) => {
      try {
        const result: Record<'message', string> = await api.request({
          method: 'delete',
          url: 'jsfile',
          data: { 'jsfn': f }
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

    const storeHandler = async (f: string) => {
      storeKey.value = f;
      alertStore.value = true;
      try {
        pushStore.value = await api.get(`store?key=${f}`);
        if (typeof pushStore.value.value !== 'string') {
          pushStore.value.value = JSON.stringify(pushStore.value.value);
        }
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    };

    const jsHandler = async (f: string) => {
      jsKey.value = f;
      alertJs.value = true;
      try {
        jsContent.value = await api.get(`jsfile?jsfn=${f}`);
        if (typeof jsContent.value === typeof 0) {
          jsContent.value = String(jsContent.value);
        }
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    };

    const storeAction = async (type: string, f?: string) => {
      try {
        const result: Record<'message', string> = await api.put('store', {
          type,
          data: f ?? {
            'key': storeKey.value,
            'value': pushStore.value
          }
        });
        alertStore.value = false;
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

    const saveJs = async () => {
      try {
        const result: Record<'message', string> = await api.post('jsfile', {
          'jscontent': jsContent.value,
          'jsname': jsKey.value
        });
        alertJs.value = false;
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

    const validation = () => {
      disable.value = !downFile.value.length || !/^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/.test(downFile.value);
    };

    const download = async () => {
      try {
        disable.value = !downFile.value.length;
        const result: Record<'message', string> = await api.put('jsfile', {
          'op': 'jsdownload',
          'name': downFile.value.substring(downFile.value.lastIndexOf('/') + 1),
          'url': downFile.value
        });
        isOpenLog.value = true;
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
      manage,
      alertUpload,
      store,
      alertStore,
      storeHandler,
      pushStore,
      storeKey,
      isOpenEdit,
      storeAction,
      alertJs,
      jsHandler,
      jsKey,
      jsContent,
      saveJs,
      delJs,
      download,
      downFile,
      downloadForm,
      disable,
      isOpenLog,
      message,
      draggingFab,
      validation,
      handleSwipe
    };
  }
});
</script>
