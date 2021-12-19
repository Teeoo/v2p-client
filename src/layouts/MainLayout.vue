<template>
  <q-layout view="lHh Lpr lFf">
    <Hader
      v-model="leftDrawerOpen"
      v-model:miniShell="minishell"
      @toggleLeftDrawer="toggleLeftDrawer"
    />
    <Drawer v-model="leftDrawerOpen" @upgrade="upgrade" />
    <q-page-container>
      <router-view />
    </q-page-container>
    <Shell v-model="minishell" />
  </q-layout>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { useInitStore } from 'src/store/init';
import { provide, inject, onMounted, ref } from 'vue';
import { date } from 'quasar';
import { api } from 'boot/axios';
import Hader from '../components/layout/hader.vue';
import Drawer from '../components/layout/drawer.vue';
import Shell from '../components/layout/shell.vue';
import { useRouter } from 'vue-router';

interface GayHub {
  tag_name: string;
  assets: Asset[];
}

interface Asset {
  browser_download_url: string;
}

const $q = useQuasar();
const leftDrawerOpen = ref(false);
const browser_download_url = ref('');
const minishell = ref(false);
const $store = useInitStore();
const router = useRouter();
const ws = inject('ws') as WebSocket;

if (ws.readyState === 3) {
  const url =
    (process.env.wsUrl as string) ??
    `${location.protocol == 'http:' ? 'ws://' : 'wss://'}${
      location.host
    }/elecV2P`;
  const socket = new WebSocket(
    `${url}?token=${$q.localStorage.getItem<string>('token') ?? ''}`
  );
  const init = () => {
    socket.addEventListener('open', handleOpen, false);
    socket.addEventListener('close', handleClose, false);
    socket.addEventListener('error', handleError, false);
  };
  const handleOpen = () => {
    $q.notify({
      progress: true,
      position: 'bottom',
      message: '成功建立ws连接',
    });
    socket.send(JSON.stringify({ type: 'ready', data: 'init' }));
    socket.send(JSON.stringify({ type: 'ready', data: 'hold' }));
    socket.send(JSON.stringify({ type: 'ready', data: 'message' }));
    socket.send(JSON.stringify({ type: 'ready', data: 'evui' }));
    socket.send(JSON.stringify({ type: 'ready', data: 'elecV2Pstatus' }));
    socket.send(JSON.stringify({ type: 'ready', data: 'jsrunstatus' }));
    socket.addEventListener('message', (e: MessageEvent) => {
      const result = JSON.parse(e.data) as {
        type: string;
        data: { id: string; vernum: number };
      };
      if (result.type === 'init') {
        $store.setInitVal({
          id: result.data.id,
          version: result.data.vernum,
        });
        socket.send(
          JSON.stringify({ type: 'init', data: 'OK', id: result.data.id })
        );
        socket.send(
          JSON.stringify({ type: 'ready', data: 'init', id: result.data.id })
        );
        socket.send(
          JSON.stringify({ type: 'ready', data: 'hold', id: result.data.id })
        );
        socket.send(
          JSON.stringify({
            type: 'ready',
            data: 'message',
            id: result.data.id,
          })
        );
        socket.send(
          JSON.stringify({ type: 'ready', data: 'evui', id: result.data.id })
        );
        socket.send(
          JSON.stringify({
            type: 'ready',
            data: 'elecV2Pstatus',
            id: result.data.id,
          })
        );
        socket.send(
          JSON.stringify({
            type: 'ready',
            data: 'jsrunstatus',
            id: result.data.id,
          })
        );
        socket.send(JSON.stringify({ type: 'ready', data: 'minishell' }));
        socket.send(
          JSON.stringify({ type: 'ready', data: 'minishell', id: $store.id })
        );
        socket.send(
          JSON.stringify({ type: 'shell', data: 'cwd', id: $store.id })
        );
      }
    });
    socket.addEventListener('message', (e: MessageEvent) => {
      const result = JSON.parse(e.data) as {
        type: string;
        data:
          | {
              type: string;
              data: string;
            }
          | string;
      };
      if (result.type === 'minishell') {
        let text = result.data;
        if (
          String(text).search('dist.zip && unzip -o dist.zip -cwd=web') !==
            -1 &&
          String(text).search('finished') !== -1
        ) {
          $q.notify({
            position: 'top',
            message: '升级成功按 Shift+F5 刷新缓存',
          });
          $q.localStorage.set('version', $store.tag_name ?? '未知版本');
        }
      }
    });
  };

  function handleClose(e: CloseEvent) {
    $q.notify({
      progress: true,
      position: 'bottom',
      type: 'negative',
      message: e.reason,
    });
    if (e.code === 4003) {
      void router.push('/login');
    }
    console.log('websocket close', e);
  }

  function handleError(e: Event) {
    $q.notify({
      progress: true,
      position: 'bottom',
      type: 'negative',
      message: 'ws已关闭',
    });
    console.log('websocket error', e);
  }

  init();

  provide('ws', socket);
}

onMounted(async () => {
  $q.dark.set($q.localStorage.getItem<boolean>('dark') ?? 'auto');
  if (
    !date.isSameDate(
      $q.localStorage.getItem<Date>('verCheck') ?? 0,
      new Date(),
      'day'
    )
  ) {
    try {
      $q.localStorage.set('verCheck', new Date());
      const result: GayHub = await api.get(
        'https://api.github.com/repos/Teeoo/v2p-client/releases/latest'
      );
      $store.setTagName(result.tag_name);
      browser_download_url.value = result.assets[0].browser_download_url;
      setTimeout(() => {
        if ($q.localStorage.getItem<string>('version') !== result.tag_name) {
          $q.notify({
            position: 'top',
            message: '检查到新版本,正在尝试更新',
          });
          void upgrade();
        }
      }, 3000);
    } catch (e) {
      $q.notify({
        type: 'negative',
        message: '获取版本信息失败!请检查本机是否能正常访问github',
      });
    }
  }
});

const upgrade = async () => {
  try {
    const result: GayHub = await api.get(
      'https://api.github.com/repos/Teeoo/v2p-client/releases/latest'
    );
    $store.setTagName(result.tag_name);
    browser_download_url.value = result.assets[0].browser_download_url;
    if ($store.tag_name === $q.localStorage.getItem<string>('version')) {
      $q.notify({
        position: 'top',
        message: '当前已是最新版本,无需升级',
      });
    } else {
      ws.send(
        JSON.stringify({
          type: 'shell',
          data: `
              if ! type curl >/dev/null 2>&1; then
                  echo 'curl 未安装,正在安装curl';
                  apk add curl --repository s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g && curl -L ${browser_download_url.value} -o dist.zip && unzip -o dist.zip -cwd=web;
              else
                  curl -L ${browser_download_url.value} -o dist.zip && unzip -o dist.zip -cwd=web;
              fi
            `,
        })
      );
      $q.notify({
        position: 'top',
        message: '升级任务已下发',
      });
    }
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '升级失败,请手动替换文件',
    });
  }
};

const toggleLeftDrawer = (b: boolean) => {
  leftDrawerOpen.value = b;
};
</script>
