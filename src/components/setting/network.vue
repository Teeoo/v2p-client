<template>
  <q-card-section>
    <q-input v-model="config.CONFIG_Axios!.timeout" prefix="TIMEOUT(ms):" />
  </q-card-section>
  <q-card-section>
    <q-select
      option-value="header"
      option-label="name"
      emit-value
      map-options
      prefix="User-Agent:"
      model-value="[]"
    >
      <template v-slot:after>
        <q-btn color="pink" label="管理" flat />
      </template>
    </q-select>
  </q-card-section>
  <q-card-section>
    <q-input
      v-model="config.CONFIG_Axios!.block.regexp"
      prefix="阻止 URL"
      label="匹配内容 比如: abc|123 匹配方式: new RegExp('该内容').test(url)"
      hint="当网络请求 url 符合此正则表达式时，屏蔽该请求"
    >
      <template v-slot:prepend>
        <q-toggle v-model="config.CONFIG_Axios!.block.enable" />
      </template>
    </q-input>
  </q-card-section>
  <q-card-section>
    <q-input
      v-model="config.CONFIG_Axios!.only.regexp"
      prefix="仅允许 URL"
      label="匹配内容 其他所有不符合该正则表达式的网络请求将被直接屏蔽掉"
      hint="开启时，仅允许符合此正则表达式的网络请求通过"
    >
      <template v-slot:prepend>
        <q-toggle v-model="config.CONFIG_Axios!.only.enable" />
      </template>
    </q-input>
  </q-card-section>
  <q-card-section>
    <q-toggle
      v-model="config.CONFIG_Axios!.proxy.enable"
      label="使用HTTP代理"
    />
  </q-card-section>
  <q-card-section>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="save" fab icon="save" color="accent" />
    </q-page-sticky>
  </q-card-section>
</template>
<script setup lang="ts">
import { Setting } from './setting';
import { ref, watchEffect } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar();

const prop = defineProps<{
  modelValue: Partial<Setting>;
}>();

const config = ref<Partial<Setting>>({});

const CONFIG_RUNJS = ref('');

watchEffect(() => {
  config.value = prop.modelValue;
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  CONFIG_RUNJS.value = prop.modelValue.CONFIG_RUNJS!.white.list.toString();
});

const save = async () => {
  try {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    config.value.CONFIG_RUNJS!.white.list = CONFIG_RUNJS.value.split(',');
    const result: Record<'message', string> = await api.put('config', {
      type: 'eAxios',
      data: config.value.CONFIG_Axios,
    });
    $q.notify({
      position: 'top',
      message: result.message,
    });
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '保存失败咯!',
    });
  }
};
</script>
