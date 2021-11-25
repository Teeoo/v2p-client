<template>
  <q-layout view='lHh Lpr lFf'>
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
        <q-item active-class="text-pink" clickable v-ripple v-for='item in menuList' :key='item.title' :to='item.link' exact>
          <q-item-section avatar>
            <q-icon :name='item.icon' />
          </q-item-section>
          <q-item-section>
            <q-item-label lines='1'>{{ item.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="fixed-bottom text-center light text-italic">
        <q-toolbar>
        <!-- TODO:设置 -->
        </q-toolbar>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { useInitStore } from 'src/store/init';
import { defineComponent, ref } from 'vue';

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
    const $store = useInitStore();
    version.value = $store.getVersion;
    return {
      menuList: menu,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      version
    };
  }
});
</script>
