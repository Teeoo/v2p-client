<template>
  <q-page v-touch-hold.mouse="() => (swipe = !swipe)">
    <Table v-model="rule" v-model:pagination="pagination" />
    <q-page-sticky
      v-show="swipe"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-fab
        v-model="fab"
        color="purple"
        icon="keyboard_arrow_left"
        direction="left"
      >
        <q-fab-action
          @click="insert"
          label-position="top"
          external-label
          color="purple"
          icon="add"
          label="新增"
        />
        <q-fab-action
          @click="save"
          label-position="top"
          external-label
          color="purple"
          icon="save"
          label="保存"
        />
      </q-fab>
    </q-page-sticky>
  </q-page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { QTableProps, useQuasar } from 'quasar';
import Table from '../components/rule/table.vue';
import { Rules } from '../components/rule/rule';

const $q = useQuasar();
const rule = ref<Partial<Rules>>({});
const fab = ref(false);
const swipe = ref(false);
const pagination = ref<QTableProps['pagination']>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: $q.localStorage.getItem<number>('rulePerPage') ?? 5,
});
onMounted(async () => {
  try {
    rule.value = await api.get('data?type=rules');
    $q.notify({
      position: 'top',
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      message: `成功获取规则列表 ${rule.value.eplists!.total} / ${
        rule.value.eplists!.active
      } `,
    });
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '获取数据失败!',
    });
  }
});


const save = async () => {
  try {
    const result: Record<'message', string> = await api.put('data', {
      type: 'rules',
      eplists: rule.value.eplists?.list,
    });
    $q.notify({
      position: 'top',
      message: result.message,
    });
  } catch (e) {
    $q.notify({
      type: 'negative',
      message: '保存数据失败!',
    });
  }
};
const insert = () => {
  rule.value.eplists?.list.push({
    mtype: 'host',
    match: 'host.com',
    ctype: 'hold',
    target: 'body.js',
    stage: 'res',
    enable: true,
  });
  pagination.value!.page = Math.ceil(
    rule.value.eplists!.list.length / (pagination.value?.rowsPerPage ?? 0)
  );
};
</script>
