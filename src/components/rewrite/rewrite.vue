<template>
  <q-table
    flat
    separator="none"
    :rows="list"
    :columns="header"
    v-model:pagination="page"
    :filter="filter"
    no-results-label="他喵的,找不到这条数据我能咋办!"
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
        <q-td key="match" :props="props">
          {{ props.row.match }}
          <q-popup-edit v-model="props.row.match">
            <q-input
              type="textarea"
              v-model="props.row.match"
              dense
              autofocus
              counter
              label="匹配方式"
            />
          </q-popup-edit>
        </q-td>

        <q-td key="stage" :props="props">
          {{ props.row.stage === 'req' ? '网络请求前' : '数据返回前' }}
          <q-popup-edit v-model="props.row.stage">
            <q-select
              color="pink"
              v-model="props.row.stage"
              :options="[
                { label: '网络请求前', value: 'req' },
                { label: '数据返回前', value: 'res' },
              ]"
              label="匹配阶段"
              option-value="value"
              option-label="label"
              emit-value
              map-options
            />
          </q-popup-edit>
        </q-td>

        <q-td key="target" :props="props">
          {{ props.row.target }}
          <q-popup-edit v-model="props.row.target">
            <q-input
              type="textarea"
              counter
              color="pink"
              v-model="props.row.target"
              label="匹配内容"
            />
          </q-popup-edit>
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
import { QTableProps, useQuasar } from 'quasar';
import { List } from './rewrite';
import { watch, ref, watchEffect } from 'vue';

const $q = useQuasar();
const emit = defineEmits(['update:modelValue', 'update:pagination']);
const prop = defineProps<{
  modelValue: Partial<List[]>;
  pagination: QTableProps['pagination'];
}>();
const list = ref<Partial<List[]>>([]);
const page = ref<QTableProps['pagination']>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: $q.localStorage.getItem<number>('rewritePerPage') ?? 5,
});

const filter = ref('');

watch(
  () => prop.modelValue,
  () => {
    list.value = prop.modelValue;
  }
);

watch(
  () => prop.pagination,
  () => {
    page.value = prop.pagination;
  }
);

watch(list, (list) => {
  emit('update:modelValue', list);
});

watch(page, (page) => {
  emit('update:pagination', page);
});

watchEffect(() =>
  $q.localStorage.set('rewritePerPage', page.value?.rowsPerPage ?? 5)
);

const del = (idx: number) => {
  list.value.splice(idx, 1);
};

const header: QTableProps['columns'] = [
  {
    name: 'match',
    align: 'center',
    label: '匹配链接（正则表达式）',
    field: 'match',
  },
  { name: 'stage', align: 'center', label: '匹配阶段', field: 'stage' },
  { name: 'target', align: 'center', label: '对应重写目标', field: 'target' },
  { name: 'enable', align: 'center', label: '启用', field: 'enable' },
  { name: 'action', align: 'center', label: '操作', field: 'action' },
];
</script>
