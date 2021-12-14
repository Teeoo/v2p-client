<template>
  <q-card-section>
    <q-checkbox
      v-model="config.security!.enable"
      label="限制可访问此后台管理页面的 IP"
      color="teal"
    />
  </q-card-section>
  <q-card-section>
    <div class="row">
      <div class="col-12 col-md-6">
        <q-input
          v-model="whitelist"
          label="白名单"
          type="textarea"
          placeholder="127.0.0.1
192.168.1.101
182.xxx.x.125
(仅可设置为 IP 地址)
(白名单优先级高于黑名单)
"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="blacklist"
          label="黑名单"
          type="textarea"
          placeholder="172.20.10.2
*
单独星号字符 * 表示屏蔽所有（只允许白名单中的 IP 通过）
如果设置为 *，请务必先记下 WEBHOOK TOKEN"
        />
      </div>
    </div>
  </q-card-section>
  <q-card-section>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="security" fab icon="save" color="accent" />
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

const whitelist = ref('');

const blacklist = ref('');

watchEffect(() => {
  config.value = prop.modelValue;
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  whitelist.value = prop.modelValue.security!.whitelist.toString();
  blacklist.value = prop.modelValue.security!.blacklist.toString();
});

const security = async () => {
  try {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    config.value.security!.whitelist = whitelist.value.split(',');
    config.value.security!.blacklist = blacklist.value.split(',');
    const result: Record<'message', string> = await api.put('config', {
      type: 'security',
      data: config.value.security,
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
