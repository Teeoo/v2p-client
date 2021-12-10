<template>
  <q-linear-progress
    :value="(Number(status.data?.memoryusage.rss.split(' MB')[0]) ?? 0) * 0.01"
    color="warning"
    :buffer="(Number(status.data?.memoryusage.rss.split(' MB')[0]) ?? 0) * 0.03"
  >
    <q-tooltip>RSS {{ status.data?.memoryusage.rss }}</q-tooltip>
  </q-linear-progress>
  <q-linear-progress
    :value="
      (Number(status.data?.memoryusage.heapTotal.split(' MB')[0]) ?? 0) * 0.01
    "
    color="warning"
    :buffer="
      (Number(status.data?.memoryusage.heapTotal.split(' MB')[0]) ?? 0) * 0.03
    "
  >
    <q-tooltip>heapTotal {{ status.data?.memoryusage.heapTotal }}</q-tooltip>
  </q-linear-progress>
  <q-linear-progress
    :value="
      (Number(status.data?.memoryusage.heapUsed.split(' MB')[0]) ?? 0) * 0.01
    "
    color="warning"
    :buffer="
      (Number(status.data?.memoryusage.heapUsed.split(' MB')[0]) ?? 0) * 0.03
    "
  >
    <q-tooltip>heapUsed {{ status.data?.memoryusage.heapUsed }}</q-tooltip>
  </q-linear-progress>
</template>
<script setup lang="ts">
import { inject, ref } from 'vue';

interface V2Pstatus {
  type: string;
  data: {
    clients: number;
    memoryusage: {
      rss: string;
      heapTotal: string;
      heapUsed: string;
      external: string;
      arrayBuffers: string;
    };
  };
}
const ws = inject('ws') as WebSocket;
const status = ref<Partial<V2Pstatus>>({});

ws.addEventListener('message', (e) => {
  let result = JSON.parse(e.data) as V2Pstatus;
  if (result.type === 'elecV2Pstatus') {
    status.value = result;
  }
});
</script>
