<template>
  <q-drawer v-model="leftDrawerOpen" show-if-above :width="250">
    <q-card flat>
      <q-item>
        <q-item-section avatar>
          <q-avatar size="38px">
            <img src="../../assets/l.png" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>elecV2P</q-item-label>
          <q-item-label caption>
            <q-skeleton
              type="text"
              width="20%"
              v-show="!$q.localStorage.getItem('version')"
            />
            <q-badge
              class="flex flex-center"
              v-show="$q.localStorage.getItem('version')"
              @click="upgrade"
            >
              {{ $q.localStorage.getItem('version') }}
            </q-badge>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
    <q-list padding>
      <q-item
        active-class="text-pink"
        clickable
        v-ripple
        v-for="item in menu"
        :key="item.title"
        :to="item.link"
        exact
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">{{ item.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-toolbar class="fixed-bottom">
      <q-btn
        @click="$q.fullscreen.toggle()"
        flat
        round
        dense
        :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
        class="q-mr-sm"
      />
      <q-space />
      <iframe
        src="https://ghbtns.com/github-btn.html?user=teeoo&repo=v2p-client&type=star&count=true"
        frameborder="0"
        scrolling="0"
        width="100px"
        height="20px"
      >
      </iframe>
      <q-space />
      <q-btn
        @click="dark"
        flat
        round
        dense
        :icon="
          !$q.dark.isActive ? 'mdi-weather-night' : 'mdi-white-balance-sunny'
        "
        class="q-mr-sm"
      />
    </q-toolbar>
  </q-drawer>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { defineProps, watch, ref, defineEmits } from 'vue';

const $q = useQuasar();
const dark = () => {
  $q.dark.toggle();
  $q.localStorage.set('dark', $q.dark.isActive);
};
const leftDrawerOpen = ref(false);

const prop = defineProps<{ modelValue: boolean }>();

const emit = defineEmits(['update:modelValue', 'upgrade']);

watch(
  () => prop.modelValue,
  () => {
    leftDrawerOpen.value = prop.modelValue;
  }
);

watch(leftDrawerOpen, (leftDrawerOpen) => {
  emit('update:modelValue', leftDrawerOpen);
});

const upgrade = () => {
  emit('upgrade');
};

const menu: { title: string; icon: string; link: string }[] = [
  {
    title: 'OVERVIEW',
    icon: 'menu',
    link: '/overview',
  },
  {
    title: 'RULES',
    icon: 'gavel',
    link: '/rules',
  },
  {
    title: 'REWRITE',
    icon: 'restart_alt',
    link: '/rewrite',
  },
  {
    title: 'JSMANAGE',
    icon: 'mdi-nodejs ',
    link: '/jsmanage',
  },
  {
    title: 'TASK',
    icon: 'mdi-checkbox-multiple-marked-circle-outline',
    link: '/task',
  },
  {
    title: 'MITM',
    icon: 'mdi-certificate',
    link: '/mitm',
  },
  {
    title: 'CFILTER',
    icon: 'filter_alt_off',
    link: '/cfilter',
  },
  {
    title: 'SETTING',
    icon: 'settings',
    link: '/setting',
  },
  {
    title: 'ABOUT',
    icon: 'mdi-information',
    link: '/about',
  },
  {
    title: 'DONATION',
    icon: 'volunteer_activism',
    link: '/donation',
  },
];
</script>
