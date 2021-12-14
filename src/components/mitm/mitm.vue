<template>
  <q-table
    flat
    separator="none"
    :columns="header"
    :rows="mitm.host"
    v-model:pagination="page"
    :filter="filter"
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
        <q-td key="host" :props="props">
          <q-input v-model="props.row.host" />
        </q-td>
        <q-td key="note" :props="props">
          <q-input v-model="props.row.note" />
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
import { Mitm } from './mitm';
import { ref, watch, watchEffect } from 'vue';

const prop = defineProps<{
  modelValue: Partial<Mitm>;
  pagination: QTableProps['pagination'];
}>();

const emit = defineEmits(['update:modelValue', 'update:pagination']);

const $q = useQuasar();
const mitm = ref<Partial<Mitm>>({});
const page = ref<QTableProps['pagination']>({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: $q.localStorage.getItem<number>('mitmPerPage') ?? 5,
});

const filter = ref('');

watch(
  () => prop.modelValue,
  () => {
    mitm.value = prop.modelValue;
  }
);

watch(
  () => prop.pagination,
  () => {
    page.value = prop.pagination;
  }
);

watch(mitm, (mitm) => {
  emit('update:modelValue', mitm);
});

watch(page, (page) => {
  emit('update:pagination', page);
});

watchEffect(() =>
  $q.localStorage.set('mitmPerPage', page.value?.rowsPerPage ?? 5)
);

const del = (idx: number) => {
  mitm.value.host?.splice(idx, 1);
};

const header: QTableProps['columns'] = [
  { name: 'host', align: 'center', label: '解析域名', field: 'host' },
  { name: 'note', align: 'center', label: '备注', field: 'note' },
  { name: 'enable', align: 'center', label: '启用', field: 'enable' },
  { name: 'action', align: 'center', label: '操作', field: 'action' },
];
</script>
