<template>
  <q-page>
    <Action :view="view" />
    <Sys-info :view="view" />
  </q-page>
  <q-footer elevated :class="$q.dark.isActive ? 'q-dark' : 'bg-white'">
    <q-toolbar>
      <q-btn
        @click="update"
        flat
        color="primary"
        :label="`VERSION: ${view.version}`"
      >
        <q-badge color="red" rounded floating v-if="view.newversion" />
      </q-btn>
      <q-space />
      <q-btn
        disable
        flat
        color="primary"
        :label="`START AT: ${date.formatDate(
          view.start,
          'YYYY-MM-DD HH:mm:ss'
        )}`"
      />
    </q-toolbar>
  </q-footer>
  <q-dialog v-model="dialog" position="bottom">
    <q-card style="width: 700px; max-width: 80vw">
      <q-linear-progress :value="1.0" color="pink" />
      <q-card-section>
        <q-scroll-area style="height: 480px; max-width: 700px">
          <div
            class="text-grey"
            style="
              white-space: pre-line;
              word-wrap: break-word;
              word-break: break-all;
            "
            v-html="log"
          ></div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
import SysInfo from '../components/overview/sysinfo.vue';
import Action from '../components/overview/action.vue';
import { Message, Overview } from '../components/overview/overview';
import { V2Pstatus } from 'src/components/layout/layout';

export default defineComponent({
  components: {
    'Sys-info': SysInfo,
    Action,
  },
  setup() {
    const $q = useQuasar();
    const log = ref('');
    const dialog = ref(false);
    const view = ref<Partial<Overview>>({});
    const status = ref<Partial<V2Pstatus>>({});
    const msg = ref<Partial<Message>>({});
    const ws = inject('ws') as WebSocket;
    ws.addEventListener('message', (e) => {
      const result = JSON.parse(e.data) as V2Pstatus | Message;
      if (result.type === 'elecV2Pstatus') {
        status.value = result as V2Pstatus;
      }
      if (result.type === 'message') {
        msg.value = result as Message;
      }
    });

    onMounted(async () => {
      try {
        view.value = await api.get('data?type=overview');
        $q.notify({
          position: 'top',
          message: '成功获取 overview 相关数据',
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '加载数据失败!',
        });
      }
    });

    watch(msg, (msg) => {
      $q.loadingBar.stop();
      $q.notify({
        position: 'top',
        message: msg.data?.data[0],
      });
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      view.value.anyproxy!.enable = !view.value.anyproxy?.enable;
    });

    const update = async () => {
      try {
        log.value = await api.get(
          'https://raw.githubusercontent.com/elecV2/elecV2P/master/logs/update.log'
        );
        dialog.value = true;
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: '加载数据失败!',
        });
      }
    };

    return {
      view,
      date,
      log,
      dialog,
      update,
    };
  },
});
</script>
