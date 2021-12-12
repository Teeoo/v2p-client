<template>
  <q-card-section>
    <div class="text-h6 text-center">
      store/cookie 常量储存管理 - {{ store.length }}
    </div>
  </q-card-section>
  <q-card-section>
    <q-chip
      clickable
      icon="mdi-cookie"
      v-for="(item, key) in store"
      :key="item"
      removable
      @remove="action('delete', item, key)"
      @click="handle(item)"
    >
      {{ item }}
    </q-chip>
  </q-card-section>
  <q-dialog v-model="dialog" seamless position="bottom">
    <q-card flat class="q-px-sm q-pb-md" style="width: 420px">
      <q-linear-progress :value="1.0" color="pink" />
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">编辑{{ key }}</div>
        <q-space />
        <q-btn
          @click="dialog = false"
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input label="key" v-model="key" />
          <q-select
            label="type"
            :options="['string', 'number', 'array', 'object', 'boolean']"
            v-model="push.type"
          />

          <q-input label="关联脚本" v-model="push.belong" />
          <q-input label="备注" v-model="push.note" />
          <q-input
            ref="codemirror"
            type="textarea"
            label="内容"
            v-model="push.value"
            :hint="`最近更新时间: ${push.update}`"
          />
          <div>
            <q-btn @click="action('save')" label="提交" flat color="pink" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { api } from '../../boot/axios';
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { StoreType } from './jsmanage';

const $q = useQuasar();

const store = ref<string[]>([]);

const key = ref('');

const push = ref<Partial<StoreType>>({});

const dialog = ref(false);

onMounted(async () => {
  try {
    store.value = await api.get('store');
    $q.notify({
      position: 'top',
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      message: `成功获取 store 数据 ${store.value.length}`,
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '获取store失败!',
    });
  }
});

const action = async (type: string, item?: string, k?: number) => {
  try {
    const result: Record<'message', string> = await api.put('store', {
      type,
      data: item ?? {
        key: key.value,
        value: push.value,
      },
    });
    $q.notify({
      position: 'top',
      message: result.message,
    });
    if (type === 'delete') {
      store.value.splice(k ?? 0, 1);
    } else {
      dialog.value = false;
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '处理失败了!',
    });
  }
};

const handle = async (item: string) => {
  key.value = item;
  dialog.value = true;
  try {
    push.value = await api.get(`store?key=${item}`);
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '获取数据失败!',
    });
  }
};
</script>
