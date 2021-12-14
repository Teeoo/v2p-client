<template>
  <q-card-section>
    <q-input v-model="config.CONFIG_FEED!.iftttid.key" prefix="IFTTT KEY:">
      <template v-slot:prepend>
        <q-toggle v-model="config.CONFIG_FEED!.iftttid.enable" color="pink" />
      </template>
      <template v-slot:after>
        <q-btn
          flat
          label="保存"
          color="pink"
          @click="saveNotify('ifttt', config.CONFIG_FEED!.iftttid)"
        />
      </template>
    </q-input>
  </q-card-section>
  <q-card-section>
    <q-input v-model="config.CONFIG_FEED!.barkkey.key" prefix="BARK KEY:">
      <template v-slot:prepend>
        <q-toggle v-model="config.CONFIG_FEED!.barkkey.enable" color="pink" />
      </template>
      <template v-slot:after>
        <q-btn
          flat
          label="保存"
          color="pink"
          @click="saveNotify('barkkey', config.CONFIG_FEED!.barkkey)"
        />
      </template>
    </q-input>
  </q-card-section>
  <q-card-section>
    <q-input
      v-model="config.CONFIG_FEED!.custnotify.url"
      prefix="自定义通知链接:"
    >
      <template v-slot:prepend>
        <q-toggle
          v-model="config.CONFIG_FEED!.custnotify.enable"
          color="pink"
        />
        <q-select
          v-model="config.CONFIG_FEED!.custnotify.type"
          :options="['GET', 'POST']"
          @update:model-value="
            post = config.CONFIG_FEED!.custnotify.type === 'POST'
          "
        />
      </template>
      <template v-slot:after>
        <q-btn
          flat
          label="保存"
          color="pink"
          @click="saveNotify('custnotify', config.CONFIG_FEED!.custnotify)"
        />
      </template>
    </q-input>
    <q-input
      v-if="post"
      v-model="config.CONFIG_FEED!.custnotify.data"
      type="textarea"
      placeholder='使用 $title$ 代表通知标题，$body$ 、代表通知内容，$url$ 代表附加链接。比如：
{
  "text": `$title$`,
  "desp": `$body$\n\n附加链接: $url$`
}
具体格式及使用参数，根据自定义通知的 API 说明进行调整（通知内容尽量使用反引号`包括'
    />
  </q-card-section>
  <q-card-section>
    <q-input
      color="purple-12"
      prefix="通知触发 JS:"
      v-model="config.CONFIG_FEED!.runjs.list"
      label="notify.js, test.js（多个 JS 使用英文逗号进行分隔，支持远程 JS）"
    >
      <template v-slot:prepend>
        <q-toggle v-model="config.CONFIG_FEED!.runjs.enable" color="pink" />
      </template>
      <template v-slot:after>
        <q-btn
          flat
          label="保存"
          color="pink"
          @click="saveNotify('runjs', config.CONFIG_FEED!.runjs)"
        />
      </template>
    </q-input>
  </q-card-section>
  <q-card-section>
    <q-input
      v-model="config.CONFIG_FEED!.maxbLength"
      type="number"
      prefix="当通知内容长度超过"
      suffix="时，分段发送"
    >
      <template v-slot:prepend>
        <!--                <q-icon name='mdi-av-timer'/>-->
        <q-toggle
          v-model="config.CONFIG_FEED!.webmessage.enable"
          color="pink"
          label="是否在前端网页显示通知"
        />
        <q-toggle
          v-model="config.CONFIG_FEED!.enable"
          color="pink"
          label="是否开启默认通知"
        />
      </template>
      <template v-slot:after>
        <q-btn flat label="保存" color="pink" @click="notifyConfig" />
      </template>
    </q-input>
  </q-card-section>
</template>
<script setup lang="ts">
import { Custnotify, Setting } from './setting';
import { ref, watchEffect } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar();

const prop = defineProps<{
  modelValue: Partial<Setting>;
}>();

const config = ref<Partial<Setting>>({});

const post = ref(false);

watchEffect(() => {
  config.value = prop.modelValue;
});

const saveNotify = async (
  type: string,
  data:
    | {
        enable: boolean;
        key?: string;
        list?: string;
      }
    | Custnotify
) => {
  try {
    const result: Record<'message', string> = await api.put('feed', {
      type,
      data,
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

const notifyConfig = async () => {
  try {
    const result: Record<'message', string> = await api.put('feed', {
      type: 'op',
      data: {
        enable: config.value.CONFIG_FEED?.enable,
        maxbLength: config.value.CONFIG_FEED?.maxbLength,
        webmessage: config.value.CONFIG_FEED?.webmessage,
      },
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
