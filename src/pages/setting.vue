<template>
  <q-page>
    <q-card flat>
      <q-tabs
        v-model="tab"
        :class="$q.dark.isActive ? 'q-dark text-white' : 'bg-purple text-white'"
        align="justify"
        narrow-indicator
      >
        <q-tab name="1" label="基础设置" />
        <q-tab name="2" label="通知相关设置" />
        <!--        <q-tab name='3' label='默认通知相关设置' />-->
        <q-tab name="4" label="JS 运行相关设置" />
        <q-tab name="5" label="网络请求相关设置" />
        <q-tab name="6" label="初始化相关设置" />
        <q-tab name="7" label="限制可访问此后台管理页面的 IP" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="1">
          <Base v-model="config" />
        </q-tab-panel>
        <q-tab-panel name="2">
          <Notice v-model="config" />
        </q-tab-panel>
        <q-tab-panel name="4">
          <Js-Config v-model="config" />
        </q-tab-panel>
        <q-tab-panel name="5">
          <Network v-model="config" />
        </q-tab-panel>
        <q-tab-panel name="6">
          <Init v-model="config" />
        </q-tab-panel>
        <q-tab-panel name="7">
          <Security v-model="config" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { Setting } from 'src/components/setting/setting';
import Base from 'src/components/setting/base.vue';
import Notice from 'src/components/setting/notice.vue';
import JsConfig from 'src/components/setting/jsconfig.vue';
import Network from 'src/components/setting/network.vue';
import Security from 'src/components/setting/security.vue';
import Init from 'src/components/setting/init.vue';

export default defineComponent({
  components: {
    Base,
    Notice,
    'Js-Config': JsConfig,
    Network,
    Security,
    Init,
  },
  setup() {
    const $q = useQuasar();
    const config = ref<Partial<Setting>>({});
    onMounted(async () => {
      try {
        config.value = await api.get('config?type=setting');
        if (!config.value.homepage) {
          config.value.homepage = window.location.origin;
        }
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '获取数据失败!',
        });
      }
    });

    return { tab: ref('1'), config };
  },
});
</script>
