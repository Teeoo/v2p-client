<template>
  <q-layout view='lHh Lpr lFf'>
    <q-header elevated :class='$q.dark.isActive ? "q-dark":"bg-purple"' v-touch-hold.mouse='handleMiniShell'
              v-touch-swipe.mouse.right='handleMiniShell'>
      <q-toolbar>
        <q-btn flat round dense icon='menu' @click='toggleLeftDrawer' class='q-mr-sm' />
        <q-space></q-space>
        <q-btn type='a' target='_blank' flat round icon='mdi-github' href='https://github.com/Teeoo/v2p-client'>
          <q-tooltip>
            喜欢的话就贡献出你的小星星吧~
          </q-tooltip>
        </q-btn>
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
              <q-skeleton type='text' width='20%' v-show='!$q.localStorage.getItem("version")' />
              <q-badge class='flex flex-center' v-show='$q.localStorage.getItem("version")' @click='upgrade'>{{ $q.localStorage.getItem('version') }}</q-badge>
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
      <q-toolbar class='fixed-bottom'>
        <q-btn @click='$q.fullscreen.toggle()' flat round dense
               :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" class='q-mr-sm' />
        <q-space />
        <q-btn @click='dark' flat round dense
               :icon="!$q.dark.isActive?'mdi-weather-night':'mdi-white-balance-sunny'" class='q-mr-sm' />
      </q-toolbar>
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
import { QScrollArea, useQuasar } from 'quasar';
import { useInitStore } from 'src/store/init';
import { defineComponent, inject, onMounted, ref } from 'vue';
import { date } from 'quasar';
import { api } from 'boot/axios';

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

export interface GayHub {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: Author;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: Asset[];
  tarball_url: string;
  zipball_url: string;
}

export interface Author {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Asset {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label: string;
  uploader: Uploader;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
}

export interface Uploader {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}


export default defineComponent({
  name: 'MainLayout',
  components: {},
  setup() {
    const $q = useQuasar();
    const leftDrawerOpen = ref(false);
    const version = ref('');
    const text = ref('');
    const cwd = ref('shell');
    const tag_name = ref('');
    const browser_download_url = ref('');
    const shell = ref(false);
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
      const result = JSON.parse(e.data) as {
        type: string;
        data: {
          type: string;
          data: string;
        } | string;
      };
      if (result.type === 'minishell') {
        let text = result.data;
        if (typeof text !== 'string' && text !== null) {
          const { type, data } = result.data as {
            data: string,
            type: string,
          };
          type === 'cwd' ? cwd.value = data : '';
          text = JSON.stringify(result.data);
        }
        if (text && text !== '\n') {
          message.value.push({ send: false, text: text, time: new Date() });
          if (String(text).search('dist.zip && unzip -o dist.zip -cwd=web finished') !== -1) {
            $q.notify({
              position: 'top',
              message: '升级成功按 Shift+F5 刷新缓存'
            });
            $q.localStorage.set('version', tag_name.value);
          }
        }
        if (scrollAreaRef.value.getScrollTarget) {
          scrollAreaRef.value.setScrollPosition('vertical', scrollAreaRef.value.getScrollTarget().scrollHeight, 300);
        }
      }
    });

    ws.addEventListener('message', (e) => {
      let result = JSON.parse(e.data) as V2Pstatus;
      if (result.type === 'elecV2Pstatus') {
        status.value = result;
      }
    });

    onMounted(async () => {
      $q.dark.set($q.localStorage.getItem<boolean>('dark') ?? 'auto');
      ws.send(JSON.stringify({ 'type': 'ready', 'data': 'minishell' }));
      ws.send(JSON.stringify({ 'type': 'ready', 'data': 'minishell', 'id': $store.id }));
      ws.send(JSON.stringify({ 'type': 'shell', 'data': 'cwd', 'id': $store.id }));
      if (!date.isSameDate($q.localStorage.getItem<Date>('verCheck') ?? 0, new Date(), 'day')) {
        try {
          $q.localStorage.set('verCheck', new Date());
          const result: GayHub = await api.get('https://api.github.com/repos/Teeoo/v2p-client/releases/latest');
          tag_name.value = result.tag_name;
          browser_download_url.value = result.assets[0].browser_download_url;
          setTimeout(() => {
            if ($q.localStorage.getItem<string>('version') !== tag_name.value) {
              $q.notify({
                position: 'top',
                message: '检查到新版本,正在尝试更新'
              });
              void upgrade();
            }
          }, 3000);
        } catch (e) {
          $q.notify({
            type: 'negative',
            message: '获取版本信息失败!请检查本机是否能正常访问github'
          });
        }
      }
    });

    const handleMiniShell = () => {
      shell.value = true;
    };

    const upgrade = () => {
      try {
        if (tag_name.value === $q.localStorage.getItem<string>('version')) {
          $q.notify({
            position: 'top',
            message: '当前已是最新版本,无需升级'
          });
        } else {
          ws.send(JSON.stringify({
            'type': 'shell',
            'data': `
              if ! type curl >/dev/null 2>&1; then
                  echo 'curl 未安装,正在安装curl';
                  apk add curl --repository s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g && curl -L ${browser_download_url.value} -o dist.zip && unzip -o dist.zip -cwd=web;
              else
                  curl -L ${browser_download_url.value} -o dist.zip && unzip -o dist.zip -cwd=web;
              fi
            `
          }));
          $q.notify({
            position: 'top',
            message: '升级任务已下发'
          });
        }
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '升级失败,请手动替换文件'
        });
      }
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

    const dark = () => {
      $q.dark.toggle();
      $q.localStorage.set('dark', $q.dark.isActive);
    };

    return {
      menuList: menu,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      version,
      handleMiniShell,
      minishell: shell,
      maximizedToggle,
      listen,
      text,
      message,
      scrollAreaRef,
      date,
      cwd,
      status,
      upgrade,
      dark
    };
  }
});
</script>
