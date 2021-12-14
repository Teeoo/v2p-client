<template>
  <q-card-section>
    <q-input
      v-model="config.CONFIG_RUNJS!.timeout"
      label="0 ms: 不设定超过时间，由 $done 控制返回"
      prefix="TIMEOUT(ms):"
    />
  </q-card-section>
  <q-card-section>
    <q-input
      v-model="config.CONFIG_RUNJS!.intervals"
      label="0 秒: 表示如果有则不更新"
      prefix="远程 JS 更新间隔(秒):"
    />
  </q-card-section>
  <q-card-section>
    <q-input
      v-model="config.CONFIG_RUNJS!.numtofeed"
      label="0 次: 表示不通知"
      type="number"
      prefix="每运行"
      suffix="次, 添加一个默认通知"
    />
  </q-card-section>
  <q-card-section>
    <q-input
      v-model="CONFIG_RUNJS"
      prefix="白名单脚本:"
      label="完整的 JS 文件名，以逗号或空格进行分隔，比如: test.js,softupdate.js"
      hint="该名单脚本内所有网络请求直接放行，不做屏蔽检测"
    >
      <template v-slot:prepend>
        <q-toggle v-model="config.CONFIG_RUNJS!.white.enable" />
      </template>
    </q-input>
  </q-card-section>
  <q-card-section>
    <div class="row">
      <div class="col-12 col-md-4">
        <q-checkbox
          v-model="config.CONFIG_RUNJS!.jslogfile"
          label="保存日志"
          color="teal"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-checkbox
          v-model="config.CONFIG_RUNJS!.eaxioslog"
          label="保存网络请求 URL 到日志中"
          :model-value="false"
          color="teal"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-checkbox
          v-model="config.CONFIG_RUNJS!.proxy"
          label="使用网络请求相关设置中的代理(如有)"
          :model-value="true"
          color="teal"
        />
      </div>
    </div>
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
