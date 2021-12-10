<template>
  <q-card-section>
    <q-scroll-area style="height: 85vh" ref="scrollAreaRef">
      <q-chat-message
        v-for="(item, k) in message"
        :key="k"
        :sent="item.send"
        :text="[item.text]"
        :stamp="date.formatDate(item.time, 'YYYY-MM-DD HH:mm:ss')"
      >
        <template v-slot:avatar>
          <q-avatar>
            <q-icon :name="item.send ? 'mdi-account ' : 'mdi-powershell'" />
          </q-avatar>
        </template>
      </q-chat-message>
    </q-scroll-area>
  </q-card-section>
  <q-card-section class="fixed-bottom">
    <q-input :prefix="cwd" v-model="text" @keydown.enter="listen($event)" />
  </q-card-section>
</template>
<script lang="ts" setup>
import { QScrollArea, date } from 'quasar';
import { useInitStore } from '../../store/init';
import { ref, inject } from 'vue';

const $store = useInitStore();
const message = ref<
  {
    send?: boolean;
    text?: string;
    time?: Date;
  }[]
>([]);
const scrollAreaRef = ref<Partial<QScrollArea>>({});
const cwd = ref('shell');
const ws = inject('ws') as WebSocket;
const text = ref('');

ws.send(JSON.stringify({ type: 'shell', data: 'cwd', id: $store.id }));
ws.addEventListener('message', (e) => {
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
    if (typeof text !== 'string' && text !== null) {
      const { type, data } = result.data as {
        data: string;
        type: string;
      };
      type === 'cwd' ? (cwd.value = data) : '';
      text = JSON.stringify(result.data);
    }
    if (text && text !== '\n') {
      message.value.push({ send: false, text: text, time: new Date() });
    }
    if (scrollAreaRef.value.getScrollTarget) {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      scrollAreaRef.value.setScrollPosition!(
        'vertical',
        scrollAreaRef.value.getScrollTarget().scrollHeight,
        300
      );
    }
  }
});

const listen = (e: KeyboardEvent) => {
  ws.send(JSON.stringify({ type: 'shell', data: text.value, id: $store.id }));
  message.value.push({
    send: true,
    text: text.value,
    time: new Date(),
  });
  text.value = '';
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  scrollAreaRef.value.setScrollPosition!(
    'vertical',
    scrollAreaRef.value.getScrollTarget!().scrollHeight,
    300
  );
  e.preventDefault();
};
</script>
