<template>
  <q-page v-touch-hold.mouse="() => (swipe = !swipe)">
    <q-card flat>
      <q-card-section>
        <div class="row">
          <div class="col-12 col-md-6">
            <q-input
              @blur="validation"
              counter
              v-model="url"
              label="远程JS链接"
              dense
              :rules="[
                (val:string) => (val && val.length > 0) || '请填写url',
                (val:string) =>
                  (val &&
                    /^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/.test(
                      val
                    )) ||
                  '请输入正确的url',
              ]"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-btn-group spread>
              <q-btn
                @click="download"
                :disable="disable"
                color="purple"
                label="开始推送"
              />
              <q-btn
                @click="dialog = !dialog"
                color="purple"
                label="上传本地JS"
              />
            </q-btn-group>
            <q-dialog v-model="dialog">
              <q-card>
                <q-card-section>
                  <div class="text-h6">上传本地JS</div>
                </q-card-section>

                <q-card-section>
                  <q-uploader
                    url="/uploadjs"
                    field-name="js"
                    label="选择文件"
                    color="purple"
                    flat
                  />
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn
                    flat
                    label="关闭"
                    @click="dialog = false"
                    color="primary"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </q-card-section>
      <Store />
      <Js-Manage />
    </q-card>
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
    <q-page-sticky v-show="swipe" position="bottom-right" :offset="[18, 18]">
      <q-fab
        v-model="fab"
        color="purple"
        icon="keyboard_arrow_left"
        direction="left"
      >
        <q-fab-action
          @click="log = true"
          label-position="top"
          external-label
          color="purple"
          icon="mdi-math-log"
          label="日志"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Store from '../components/jsmanage/store.vue';
import JsManage from '../components/jsmanage/jsmanage.vue';
import { ref, inject } from 'vue';
import { useInitStore } from '../store/init';
import { api } from '../boot/axios';
import { useQuasar } from 'quasar';

export default defineComponent({
  components: {
    'Js-Manage': JsManage,
    Store,
  },
  setup() {
    const $q = useQuasar();
    const swipe = ref(false);
    const fab = ref(false);
    const log = ref(false);
    const dialog = ref(false);
    const message = ref<string[]>([]);
    const disable = ref(false);
    const url = ref('');
    const $store = useInitStore();

    const ws = inject('ws') as WebSocket;
    ws.send(JSON.stringify({ type: 'ready', data: 'jsmanage', id: $store.id }));
    ws.addEventListener('message', (e) => {
      const result = JSON.parse(e.data) as Record<'type' | 'data', string>;
      if (result.type === 'jsmanage') {
        message.value.push(result.data);
        if (result.data.indexOf('100%') !== -1) {
          log.value = false;
          disable.value = false;
        }
      }
    });

    const validation = () => {
      disable.value =
        !url.value.length ||
        !/^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/.test(
          url.value
        );
    };

    const download = async () => {
      try {
        disable.value = !url.value.length;
        const result: Record<'message', string> = await api.put('jsfile', {
          op: 'jsdownload',
          name: url.value.substring(url.value.lastIndexOf('/') + 1),
          url: url.value,
        });
        log.value = true;
        $q.notify({
          position: 'top',
          message: result.message,
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理失败',
        });
      }
    };

    return {
      swipe,
      fab,
      log,
      message,
      disable,
      validation,
      url,
      dialog,
      download,
    };
  },
});
</script>
