<template>
  <q-page>
    <q-card flat>
      <q-card-section>
        <div class='row'>
          <div class='col-12 col-md-3'>
            <q-btn @click='dialog=true' flat class='full-width' color='purple' label='查看程序运行日志' icon='mdi-bug' />
          </div>
          <div class='col-12 col-md-3'>
            <q-btn flat class='full-width' color='purple' label='EFSS 文件管理界面' icon='folder' />
          </div>
          <div class='col-12 col-md-3'>
            <q-btn-dropdown flat class='full-width' auto-close rounded color='purple' :disable='!view.anyproxy?.enable'
                            :label='`ANYPROXY 端口: ${view.anyproxy?.port}`' icon='router' split>
              <q-list padding>
                <q-item>
                  <q-item-section>
                    <q-btn @click='proxyHandler(view.anyproxy?.enable)' :disable='view.anyproxy?.enable' flat
                           color='pink' label='开启' />
                    <q-btn @click='proxyHandler(view.anyproxy?.enable)' :disable='!view.anyproxy?.enable' flat
                           color='pink' label='关闭' />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <div class='col-12 col-md-3'>
            <q-btn flat class='full-width' color='purple' :disable='!view.anyproxy?.enable'
                   :label='`网络请求查看端口: ${view.anyproxy?.webPort}`'
                   icon='language' />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class='row'>
          <div class='col-12 col-md-2'>
            <q-btn flat class='full-width' color='purple' :label='`RULES 规则数: ${view.ruleslen}`' />
          </div>
          <div class='col-12 col-md-2'>
            <q-btn flat class='full-width' color='purple' :label='`REWRITE 规则数: ${view.rewriteslen}`' />
          </div>
          <div class='col-12 col-md-2'>
            <q-btn flat class='full-width' color='purple' :label='`JS 文件数: ${view.jslistslen}`' />
          </div>
          <div class='col-12 col-md-2'>
            <q-btn flat class='full-width' color='purple'
                   :label='`TASK 定时: ${view.taskstatus?.running}/${view.taskstatus?.total}/${view.taskstatus?.sub}`' />
          </div>
          <div class='col-12 col-md-3'>
            <q-btn flat class='full-width' color='purple' :label='`MITM HOST 数: ${view.mitmhostlen}`' />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card flat>
      <q-card-section>
        <q-card-section>
          <div class='text-h6 text-center'>客户端连接数: {{ status.data?.clients }}</div>
        </q-card-section>
        <q-card-section>
          <div class='row'>
            <div class='col'>
              <q-list>
                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color='primary' name='local_bar' />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ view.sysinfo?.arch }}</q-item-label>
                    <q-item-label caption>架构</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color='red' name='mdi-linux' />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ view.sysinfo?.platform }}</q-item-label>
                    <q-item-label caption>平台</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color='amber' name='mdi-memory ' />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ view.sysinfo?.memory }}</q-item-label>
                    <q-item-label caption>内存</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color='primary' name='schedule' />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ view.sysinfo?.uptime }}</q-item-label>
                    <q-item-label caption>UPTIME</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
                    <q-icon color='accent' name='mdi-nodejs ' />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ view.sysinfo?.nodever }}</q-item-label>
                    <q-item-label caption>NODEJS</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class='col'>
              <q-list>
                <q-item clickable>
                  <q-item-section avatar>
<!--                    <q-icon color='positive' name='mdi-chart-donut ' />-->
                    <q-spinner-audio color="secondary" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      <q-skeleton type='text' width='25%' v-show='!status.data?.memoryusage.rss' />
                      {{ status.data?.memoryusage.rss }}
                    </q-item-label>
                    <q-item-label caption>
                      <q-item-label caption>rss</q-item-label>
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
<!--                    <q-icon color='info' name='hub' />-->
                    <q-spinner-ball color="red" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      <q-skeleton type='text' width='25%' v-show='!status.data?.memoryusage.heapTotal' />
                      {{ status.data?.memoryusage.heapTotal }}
                    </q-item-label>
                    <q-item-label caption>heapTotal</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
<!--                    <q-icon color='negative' name='spoke' />-->
                    <q-spinner-bars color="purple" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      <q-skeleton type='text' width='25%' v-show='!status.data?.memoryusage.heapUsed' />
                      {{ status.data?.memoryusage.heapUsed }}
                    </q-item-label>
                    <q-item-label caption>heapUsed</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
<!--                    <q-icon color='secondary' name='local_movies' />-->
                    <q-spinner-pie color="orange" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      <q-skeleton type='text' width='25%' v-show='!status.data?.memoryusage.external' />
                      {{ status.data?.memoryusage.external }}
                    </q-item-label>
                    <q-item-label caption>external</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable>
                  <q-item-section avatar>
<!--                    <q-icon color='amber' name='insert_chart' />-->
                    <q-spinner-puff color="deep-orange" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>
                      <q-skeleton type='text' width='25%' v-show='!status.data?.memoryusage.arrayBuffers' />
                      {{ status.data?.memoryusage.arrayBuffers }}
                    </q-item-label>
                    <q-item-label caption>arrayBuffers</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
  <q-footer elevated class='bg-white'>
    <q-toolbar>
      <q-btn disable flat color='primary' :label='`VERSION: ${view.version}`'>
        <q-badge color='red' rounded floating />
      </q-btn>
      <q-space />
      <q-btn disable flat color='primary'
             :label='`START AT: ${date.formatDate(view.start, "YYYY-MM-DD HH:mm:ss")}`' />
    </q-toolbar>
  </q-footer>
  <q-dialog
    v-model='dialog'
    persistent
    :maximized='maximizedToggle'
    transition-show='slide-up'
    transition-hide='slide-down'
  >
    <q-card>
      <q-bar  class="bg-white text-white">
        <q-btn  dense flat round icon="lens" size="8.5px" color="red"  v-close-popup>
          <q-tooltip class='bg-white text-primary'>Close</q-tooltip>
        </q-btn>
        <q-btn  dense flat round icon="lens" size="8.5px" color="yellow" @click='maximizedToggle = false' :disable='!maximizedToggle'>
          <q-tooltip v-if='maximizedToggle' class='bg-white text-primary'>Minimize</q-tooltip>
        </q-btn>
        <q-btn dense flat round icon="lens" size="8.5px" color="green"  @click='maximizedToggle = true' :disable='maximizedToggle'>
          <q-tooltip v-if='!maximizedToggle' class='bg-white text-primary'>Maximize</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <q-chip clickable @click='loadLogs(item)' v-for='(item,k) in logs' :key='k'>{{ item }}</q-chip>
      </q-card-section>

      <q-card-section v-if='log'>
        <q-scroll-area style='height: calc(100vh - 128px);'>
          <div style='white-space: pre-line;word-wrap:break-word;word-break:break-all'>
            {{ log }}
          </div>
        </q-scroll-area>
<!--        <Codemirror style='height: 80vh' v-model='log' read-only/>-->
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang='ts' s>
import { defineComponent, inject, onMounted, ref, watch } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { date } from 'quasar';
// import Codemirror from '../components/codemirror.vue';

interface Overview {
  ruleslen: number;
  rewriteslen: number;
  jslistslen: number;
  taskstatus: Taskstatus;
  mitmhostlen: number;
  version: string;
  start: number;
  anyproxy: Anyproxy;
  newversion: string;
  sysinfo: Sysinfo;
  enablelist: Enablelist;
}

interface Taskstatus {
  total: number;
  running: number;
  sub: number;
}

interface Anyproxy {
  enable: boolean;
  port: number;
  webPort: number;
}

interface Sysinfo {
  arch: string;
  platform: string;
  memory: string;
  uptime: string;
  nodever: string;
}

interface Enablelist {
  rule: boolean;
  rewrite: boolean;
  mitmhost: boolean;
}

interface Message {
  type: string;
  data: Data;
}

interface Data {
  type: string;
  data: string[];
}

interface V2Pstatus {
  type: string;
  data: Data;
}

interface Data {
  clients: number;
  memoryusage: Memoryusage;
}

interface Memoryusage {
  rss: string;
  heapTotal: string;
  heapUsed: string;
  external: string;
  arrayBuffers: string;
}

export default defineComponent({
  components: {
    // Codemirror
  },
  setup() {
    const $q = useQuasar();
    const view = ref<Partial<Overview>>({});
    const logs = ref<string[]>([]);
    const log = ref<string>();
    const status = ref<Partial<V2Pstatus>>({});
    const msg = ref<Partial<Message>>({});
    const dialog = ref(false);
    const maximizedToggle = ref(true);
    const ws = inject('ws') as WebSocket;
    ws.addEventListener('message', (e) => {
      let result = JSON.parse(e.data) as V2Pstatus;
      if (result.type === 'elecV2Pstatus') {
        status.value = result;
      }
      result = JSON.parse(e.data) as Message;
      if (result.type === 'message') {
        msg.value = result;
      }
    });

    onMounted(async () => {
      try {
        view.value = await api.get('data?type=overview');
        $q.notify({
          position: 'top',
          message: '成功获取 overview 相关数据'
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    });

    watch(msg, (msg) => {
      $q.loadingBar.stop();
      $q.notify({
        position: 'top',
        message: msg.data?.data[0]
      });
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      view.value.anyproxy!.enable = !view.value.anyproxy?.enable;
    });

    watch(dialog, (dialog) => {
      if (dialog) {
        $q.addressbarColor.set('#ffffff')
        void logsList();
      }
    });

    const loadLogs = async (item: string) => {
      try {
        const result: string = await api.get(`logs/${item}`);
        const parser = new DOMParser();
        const doc = parser.parseFromString(result, 'text/html');
        const data = document.evaluate('//*[@class="logs"]//text()', doc, null, XPathResult.ANY_TYPE, null).iterateNext();
        log.value = data?.textContent as string;
      } catch (e) {
        $q.notify({
          color: 'negative',
          message: '加载日志出错了!'
        });
      }
    };
    const logsList = async () => {
      try {
        if (!logs.value.length) {
          const data: string = await api.get('logs');
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'text/html');
          const result = document.evaluate('//*[@class="logs_a"]//text()', doc, null, XPathResult.ANY_TYPE, null);
          let nodes;
          while (nodes = result.iterateNext()) {
            logs.value.push(nodes?.textContent as string);
          }
        }
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子'
        });
      }
    };

    const proxyHandler = (status: boolean) => {
      $q.loadingBar.start();
      ws.send(JSON.stringify({ 'type': 'eproxy', 'data': `${!status ? 'start' : 'close'}` }));
    };

    return {
      view, status, proxyHandler, date, logsList, dialog, maximizedToggle, log, logs, loadLogs
    };
  }
});
</script>
