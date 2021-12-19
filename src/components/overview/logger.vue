<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-bar :class="$q.dark.isActive ? 'q-dark' : 'bg-white text-white'">
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="red"
          v-close-popup
        >
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="yellow"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="green"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
            >Maximize</q-tooltip
          >
        </q-btn>
      </q-bar>

      <q-card-section>
        <q-chip
          clickable
          @click="load(item)"
          v-for="(item, k) in logs"
          :key="k"
          >{{ item }}</q-chip
        >
      </q-card-section>

      <q-card-section v-if="log">
        <q-scroll-area style="height: calc(100vh - 128px)">
          <div
            style="
              white-space: pre-line;
              word-wrap: break-word;
              word-break: break-all;
            "
          >
            {{ log }}
          </div>
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { api } from '../../boot/axios';
import { defineProps, watch, ref, onMounted } from 'vue';

const $q = useQuasar();

const prop = defineProps<{ modelValue: boolean }>();

const emit = defineEmits(['update:modelValue']);

const dialog = ref(false);

const maximizedToggle = ref(true);

const logs = ref<string[]>([]);

const log = ref<string>('');

watch(
  () => prop.modelValue,
  () => {
    dialog.value = prop.modelValue;
  }
);

watch(dialog, (dialog) => {
  emit('update:modelValue', dialog);
});

onMounted(async () => {
  try {
    if (!logs.value.length) {
      const data: string = await api.get('logs');
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const result = document.evaluate(
        '//*[@class="logs_a"]//text()',
        doc,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      let nodes;
      while ((nodes = result.iterateNext())) {
        logs.value.push(nodes?.textContent as string);
      }
    }
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '加载数据失败~',
    });
  }
});

const load = async (item: string) => {
  try {
    const result: string = await api.get(`logs/${item}`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(result, 'text/html');
    const data = document
      .evaluate(
        '//*[@class="logs"]//text()',
        doc,
        null,
        XPathResult.ANY_TYPE,
        null
      )
      .iterateNext();
    log.value = data?.textContent as string;
  } catch (e) {
    $q.notify({
      color: 'negative',
      message: '加载日志出错了!',
    });
  }
};
</script>
