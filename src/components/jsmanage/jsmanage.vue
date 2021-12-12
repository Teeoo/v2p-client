<template>
  <q-card-section>
    <div class="text-h6 text-center" @click="dialog = true">
      当前服务器 JS 文件 - {{ manage.jslists?.length }}
      <q-tooltip> 单击则新增Js </q-tooltip>
    </div>
  </q-card-section>
  <q-card-section>
    <q-chip
      clickable
      @click="handle(item)"
      @remove="del(item, k)"
      icon="mdi-nodejs"
      v-for="(item, k) in manage.jslists"
      :key="item"
      removable
    >
      {{ item }}
    </q-chip>
  </q-card-section>
  <q-dialog v-model="dialog" seamless position="bottom">
    <q-card flat style="width: 420px" class="q-px-sm q-pb-md">
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
          <q-input label="文件名" v-model="key" />
          <Codemirror v-model="content" />
          <div>
            <q-btn @click="save" label="提交" flat color="pink" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { api } from '../../boot/axios';
import { ref, onMounted } from 'vue';
import { JsManage } from './jsmanage';
import { useQuasar } from 'quasar';
import Codemirror from '../codemirror.vue';

const $q = useQuasar();

const dialog = ref(false);

const manage = ref<Partial<JsManage>>({});

const key = ref('');

const content = ref('');

onMounted(async () => {
  try {
    manage.value = await api.get('jsmanage');
    $q.notify({
      position: 'top',
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      message: `成功获取JS列表 ${manage.value.jslists!.length}`,
    });
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '获取js失败!',
    });
  }
});

const handle = async (f: string) => {
  key.value = f;
  dialog.value = true;
  try {
    content.value = await api.get(`jsfile?jsfn=${f}`);
    if (typeof content.value === typeof 0) {
      content.value = String(content.value);
    }
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '获取数据失败',
    });
  }
};

const del = async (f: string, k: number) => {
  try {
    const result: Record<'message', string> = await api.request({
      method: 'delete',
      url: 'jsfile',
      data: { jsfn: f },
    });
    $q.notify({
      position: 'top',
      message: result.message,
    });
    manage.value.jslists?.splice(k, 1);
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '处理数据失败',
    });
  }
};

const save = async () => {
  try {
    const result: Record<'message', string> = await api.post('jsfile', {
      jscontent: content.value,
      jsname: key.value,
    });
    dialog.value = false;
    $q.notify({
      position: 'top',
      message: result.message,
    });
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '处理数据失败',
    });
  }
};
</script>
