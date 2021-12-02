<template>
  <q-layout view='lHh Lpr lFf' v-touch-hold.mouse='handleMiniShell'>
    <q-header elevated class='bg-purple' v-touch-swipe.mouse.right='handleMiniShell'>
      <q-toolbar>
        <q-btn flat round dense icon='menu' @click='toggleLeftDrawer' class='q-mr-sm' />
        <q-space></q-space>
        <q-btn type='a' target='_blank' flat round icon='mdi-github' href='https://github.com/Teeoo/v2p-client'></q-btn>
      </q-toolbar>
      <q-toolbar inset>
        <q-toolbar-title>
          <strong>{{ $route.meta.desc }}</strong>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model='leftDrawerOpen'
      show-if-above
      :width='250'
    >
      <q-card flat>
        <q-item>
          <q-item-section avatar>
            <q-avatar size='38px'>
              <img src='../assets/l.png'>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>elecV2P</q-item-label>
            <q-item-label caption>
              <q-skeleton type='text' width='20%' v-show='!version' />
              <q-badge>v{{ version }}</q-badge>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-card>
      <q-list padding>
        <q-item active-class='text-pink' clickable v-ripple v-for='item in menuList' :key='item.title' :to='item.link'
                exact>
          <q-item-section avatar>
            <q-icon :name='item.icon' />
          </q-item-section>
          <q-item-section>
            <q-item-label lines='1'>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class='fixed-bottom text-center light text-italic'>
        <q-toolbar>
          <!-- TODO:设置 -->
        </q-toolbar>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog
      v-model='minishell'
      persistent
      :maximized='maximizedToggle'
      transition-show='slide-up'
      transition-hide='slide-down'
    >
      <q-card>
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
          <q-space />
          <!--          <div class="col text-center text-weight-bold text-primary">-->
          <!--            MINI-SHELL-->
          <!--          </div>-->
          <q-space />
          <q-linear-progress
            :value='status.data?.memoryusage.rss.split(" MB")[0]*0.01' color='warning'
            :buffer="status.data?.memoryusage.rss.split(' MB')[0]*0.03"
          >
            <q-tooltip>
              RSS {{ status.data?.memoryusage.rss }}
            </q-tooltip>
          </q-linear-progress>
          <q-linear-progress :value='status.data?.memoryusage.heapTotal.split(" MB")[0]*0.01' color='warning'
                             :buffer="status.data?.memoryusage.heapTotal.split(' MB')[0]*0.03"
          >
            <q-tooltip>
              heapTotal {{ status.data?.memoryusage.heapTotal }}
            </q-tooltip>
          </q-linear-progress>
          <q-linear-progress :value='status.data?.memoryusage.heapUsed.split(" MB")[0]*0.01' color='warning'
                             :buffer="status.data?.memoryusage.heapUsed.split(' MB')[0]*0.03"
          >
            <q-tooltip>
              heapUsed {{ status.data?.memoryusage.heapUsed }}
            </q-tooltip>
          </q-linear-progress>
        </q-bar>

        <q-card-section>
          <q-scroll-area style='height: 85vh;' ref='scrollAreaRef'>
            <q-chat-message v-for='(item,k) in message' :key='k'
                            :sent='item.send'
                            :text='[item.text]'
                            :stamp='date.formatDate(item.time, "YYYY-MM-DD HH:mm:ss")'
            >
              <template v-slot:avatar>
                <q-avatar>
                  <q-icon :name='item.send?"mdi-account ":"mdi-powershell"' />
                </q-avatar>
              </template>
            </q-chat-message>
          </q-scroll-area>
        </q-card-section>
        <q-card-section class='fixed-bottom'>
          <q-input
            :prefix='cwd'
            v-model='text'
            @keydown.enter='listen($event)'
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script lang='ts'>
import { QScrollArea } from 'quasar';
import { useInitStore } from 'src/store/init';
import { defineComponent, inject, onMounted, ref } from 'vue';
import { date } from 'quasar';

const menu = [
  {
    title: 'OVERVIEW',
    icon: 'menu',
    link: '/overview'
  },
  {
    title: 'RULES',
    icon: 'gavel',
    link: '/rules'
  },
  {
    title: 'REWRITE',
    icon: 'restart_alt',
    link: '/rewrite'
  },
  {
    title: 'JSMANAGE',
    icon: 'mdi-nodejs ',
    link: '/jsmanage'
  },
  {
    title: 'TASK',
    icon: 'mdi-checkbox-multiple-marked-circle-outline',
    link: '/task'
  },
  {
    title: 'MITM',
    icon: 'mdi-certificate',
    link: '/mitm'
  },
  {
    title: 'CFILTER',
    icon: 'filter_alt_off',
    link: '/cfilter'
  },
  {
    title: 'SETTING',
    icon: 'settings',
    link: '/setting'
  },
  {
    title: 'ABOUT',
    icon: 'mdi-information',
    link: '/about'
  },
  {
    title: 'DONATION',
    icon: 'volunteer_activism',
    link: '/donation'
  }
];

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
  name: 'MainLayout',
  components: {},
  setup() {
    const leftDrawerOpen = ref(false);
    const version = ref('');
    const text = ref('');
    const cwd = ref('shell');
    const minishell = ref(false);
    const maximizedToggle = ref(true);
    const message = ref<{
      send?: boolean,
      text?: string,
      time?: Date
    }[]>([]);
    const status = ref<Partial<V2Pstatus>>({});
    const scrollAreaRef = ref<Partial<typeof QScrollArea>>({});
    const $store = useInitStore();
    version.value = $store.getVersion;
    const ws = inject('ws') as WebSocket;
    ws.addEventListener('message', (e) => {
      const result = JSON.parse(e.data) as Record<'type' | 'data', string | {
        data: string,
        type: string,
      }>;
      if (result.type === 'minishell') {
        const { type, data } = result.data as {
          data: string,
          type: string,
        };
        type === 'cwd' ? cwd.value = data : '';
        message.value.push({
          send: false,
          text: typeof result.data === 'string' ? String(result.data) : JSON.stringify(result.data),
          time: new Date()
        });
        scrollAreaRef.value.setScrollPosition('vertical', scrollAreaRef.value.getScrollTarget().scrollHeight, 300);
      }
    });

    ws.addEventListener('message', (e) => {
      let result = JSON.parse(e.data) as V2Pstatus;
      if (result.type === 'elecV2Pstatus') {
        status.value = result;
      }
    });

    onMounted(() => {
      ws.send(JSON.stringify({ 'type': 'ready', 'data': 'minishell' }));
      ws.send(JSON.stringify({ 'type': 'ready', 'data': 'minishell', 'id': $store.id }));
    });

    const handleMiniShell = () => {
      minishell.value = true;
    };

    const listen = (e: KeyboardEvent) => {
      ws.send(JSON.stringify({ 'type': 'shell', 'data': text.value, 'id': $store.id }));
      message.value.push({
        send: true,
        text: text.value,
        time: new Date()
      });
      text.value = '';
      scrollAreaRef.value.setScrollPosition('vertical', scrollAreaRef.value.getScrollTarget().scrollHeight, 300);
      e.preventDefault();
    };

    return {
      menuList: menu,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      version,
      handleMiniShell, minishell, maximizedToggle, listen, text, message, scrollAreaRef, date, cwd, status
    };
  }
});
</script>
