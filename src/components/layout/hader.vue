<template>
  <q-header
    elevated
    :class="$q.dark.isActive ? 'q-dark' : 'bg-purple'"
    v-touch-hold.mouse="handleMiniShell"
    v-touch-swipe.mouse.right="handleMiniShell"
  >
    <q-toolbar>
      <q-btn
        flat
        round
        dense
        icon="menu"
        @click="toggleLeftDrawer(leftDrawerOpen)"
        class="q-mr-sm"
      />
      <q-space></q-space>
      <q-btn
        type="a"
        target="_blank"
        flat
        round
        icon="mdi-github"
        href="https://github.com/Teeoo/v2p-client"
      >
        <q-tooltip> 喜欢的话就贡献出你的小星星吧~ </q-tooltip>
      </q-btn>
    </q-toolbar>
    <q-toolbar inset>
      <q-toolbar-title>
        <strong>{{ $route.meta.desc }}</strong>
      </q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>
<script setup lang="ts">
import { useQuasar } from 'quasar';
import { defineProps, watch, ref, defineEmits } from 'vue';

const $q = useQuasar();

const leftDrawerOpen = ref(false);

const prop = defineProps<{ modelValue: boolean; miniShell: boolean }>();

const emit = defineEmits([
  'update:modelValue',
  'update:miniShell',
  'toggleLeftDrawer',
]);

watch(
  () => prop.modelValue,
  () => {
    leftDrawerOpen.value = prop.modelValue;
  }
);

watch(leftDrawerOpen, (leftDrawerOpen) => {
  emit('update:modelValue', leftDrawerOpen);
});

const toggleLeftDrawer = (b: boolean) => {
  emit('toggleLeftDrawer', !b);
};

const handleMiniShell = () => {
  emit('update:miniShell', !prop.miniShell);
};
</script>
