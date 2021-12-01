<template>
  <q-layout view='lHh Lpr lFf' v-touch-swipe.mouse.right='handleMiniShell' v-touch-hold.mouse='handleMiniShell'>
    <q-header elevated class='bg-purple'>
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
        </q-bar>

        <q-card-section>
          <q-scroll-area style='height: 65vh;' ref='scrollAreaRef'>
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
        <q-card-section class='vertical-bottom'>
          <q-input
            v-model='text'
            type='textarea'
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

export default defineComponent({
  name: 'MainLayout',
  components: {},
  setup() {
    const leftDrawerOpen = ref(false);
    const version = ref('');
    const text = ref('');
    const minishell = ref(false);
    const maximizedToggle = ref(true);
    const message = ref<{
      send?: boolean,
      text?: string,
      time?: Date
    }[]>([]);
    const scrollAreaRef = ref<Partial<typeof QScrollArea>>({});
    const $store = useInitStore();
    version.value = $store.getVersion;
    const ws = inject('ws') as WebSocket;
    ws.addEventListener('message', (e) => {
      const result = JSON.parse(e.data) as Record<'type' | 'data', string>;
      if (result.type === 'minishell') {
        message.value.push({
          send: false,
          text: result.data,
          time: new Date()
        });
        scrollAreaRef.value.setScrollPosition('vertical', scrollAreaRef.value.getScrollTarget().scrollHeight, 300);
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
      handleMiniShell, minishell, maximizedToggle, listen, text, message, scrollAreaRef, date
    };
  }
});
</script>
