<template>
  <q-table
    flat
    separator="none"
    :rows="rule.eplists?.list"
    :columns="header"
    v-model:pagination="page"
    :filter="filter"
    no-results-label="说出来你可能不信,我没搜索到数据"
  >
    <template v-slot:top>
      <q-space />
      <q-input
        placeholder="搜索"
        v-model="filter"
        borderless
        dense
        debounce="300"
        color="primary"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td key="mtype" :props="props">
          <q-select
            color="pink"
            v-model="props.row.mtype"
            :options="mtype"
            label="匹配方式"
          />
        </q-td>

        <q-td key="match" :props="props">
          <q-input color="pink" v-model="props.row.match" label="匹配内容" />
        </q-td>

        <q-td key="ctype" :props="props">
          <q-select
            color="pink"
            v-model="props.row.ctype"
            :options="ctype"
            option-value="val"
            option-label="label"
            emit-value
            map-options
            label="修改方式"
          />
        </q-td>

        <q-td key="target" :props="props">
          <q-input color="pink" v-model="props.row.target" label="修改内容" />
        </q-td>

        <q-td key="stage" :props="props">
          <q-select
            color="pink"
            v-model="props.row.stage"
            :options="stage"
            option-value="val"
            option-label="label"
            emit-value
            map-options
            label="修改时间"
          />
        </q-td>

        <q-td key="enable" :props="props">
          <q-toggle v-model="props.row.enable" color="pink" />
        </q-td>

        <q-td key="action" :props="props">
          <q-btn
            @click="del(props.rowIndex)"
            size="sm"
            flat
            color="pink"
            label="删除"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { Rules, stage, ctype, mtype } from './rule';

const prop = defineProps<{
  modelValue: Partial<Rules>;
  pagination: QTableProps['pagination'];
}>();

const emit = defineEmits(['update:modelValue', 'update:pagination']);

const $q = useQuasar();
const rule = ref<Partial<Rules>>({});
const page = ref<QTableProps['pagination']>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: $q.localStorage.getItem<number>('rulePerPage') ?? 5,
});

const filter = ref('');

watch(
  () => prop.modelValue,
  () => {
    rule.value = prop.modelValue;
  }
);

watch(
  () => prop.pagination,
  () => {
    page.value = prop.pagination;
  }
);

watch(rule, (rule) => {
  emit('update:modelValue', rule);
});

watch(page, (page) => {
  emit('update:pagination', page);
});

watchEffect(() =>
  $q.localStorage.set('rulePerPage', page.value?.rowsPerPage ?? 5)
);

const header: QTableProps['columns'] = [
  { name: 'mtype', align: 'center', label: '匹配方式', field: 'mtype' },
  { name: 'match', align: 'center', label: '匹配内容（正则）', field: 'match' },
  { name: 'ctype', align: 'center', label: '修改方式', field: 'ctype' },
  { name: 'target', align: 'center', label: '修改内容', field: 'target' },
  { name: 'stage', align: 'center', label: '修改时间', field: 'stage' },
  { name: 'enable', align: 'center', label: '启用', field: 'enable' },
  { name: 'action', align: 'center', label: '操作', field: 'action' },
];

const del = (idx: number) => {
  rule.value.eplists?.list.splice(idx, 1);
};
</script>
