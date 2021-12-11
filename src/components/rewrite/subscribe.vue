<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="maximizedToggle"
    transition-show="rotate"
    transition-hide="rotate"
  >
    <q-card flat>
      <q-bar class="bg-white text-white">
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="red"
          v-close-popup
        >
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="yellow"
          @click="maximizedToggle = false"
          :disable="!maximizedToggle"
        >
          <q-tooltip v-if="maximizedToggle" class="bg-white text-primary"
            >Minimize</q-tooltip
          >
        </q-btn>
        <q-btn
          dense
          flat
          round
          icon="lens"
          size="8.5px"
          color="green"
          @click="maximizedToggle = true"
          :disable="maximizedToggle"
        >
          <q-tooltip v-if="!maximizedToggle" class="bg-white text-primary"
            >Maximize</q-tooltip
          >
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-table
          flat
          separator="none"
          :rows="Object.values(sub)"
          :columns="header"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  flat
                  color="accent"
                  round
                  dense
                  @click="props.row.collapse = !props.row.collapse"
                  :icon="props.expand ? 'mdi-chevron-down' : 'mdi-chevron-up'"
                />
              </q-td>
              <q-td key="name" :props="props">
                <q-input
                  color="pink"
                  v-model="props.row.name"
                  label="订阅名称"
                />
              </q-td>
              <q-td key="resource" :props="props">
                <q-input
                  color="pink"
                  v-model="props.row.resource"
                  label="订阅地址"
                />
              </q-td>
              <q-td key="enable" :props="props">
                <q-toggle v-model="props.row.enable" color="pink" />
              </q-td>
              <q-td key="action" :props="props">
                <q-btn
                  @click="content(props)"
                  size="sm"
                  flat
                  color="pink"
                  label="获取内容"
                />
                <q-btn
                  @click="del(props.row.key)"
                  size="sm"
                  flat
                  color="pink"
                  label="删除"
                />
              </q-td>
            </q-tr>
            <q-tr v-show="props.row.collapse" :props="props">
              <q-td colspan="100%">
                <q-table
                  flat
                  :rows="props.row.list"
                  :columns="[
                    {
                      name: 'match',
                      align: 'center',
                      label: '匹配链接（正则表达式）',
                      field: 'match',
                    },
                    {
                      name: 'stage',
                      align: 'center',
                      label: '匹配阶段',
                      field: 'stage',
                    },
                    {
                      name: 'target',
                      align: 'center',
                      label: '对应重写目标',
                      field: 'target',
                    },
                    {
                      name: 'enable',
                      align: 'center',
                      label: '启用',
                      field: 'enable',
                    },
                    {
                      name: 'action',
                      align: 'center',
                      label: '操作',
                      field: 'action',
                    },
                  ]"
                  no-data-label="未获取到有效数据哦!"
                >
                  <template v-slot:body="p">
                    <q-tr :props="p">
                      <q-td key="match" :props="p">
                        <q-input
                          color="pink"
                          v-model="p.row.match"
                          label="订阅名称"
                        />
                      </q-td>
                      <q-td key="stage" :props="p">
                        <q-select
                          color="pink"
                          v-model="p.row.stage"
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
                      </q-td>
                      <q-td key="target" :props="p">
                        <q-input
                          color="pink"
                          v-model="p.row.target"
                          label="订阅地址"
                        />
                      </q-td>
                      <q-td key="enable" :props="p">
                        <q-toggle v-model="p.row.enable" color="pink" />
                      </q-td>
                      <q-td key="action" :props="p">
                        <q-btn
                          @click="delResource(props.row.key, p.rowIndex)"
                          size="sm"
                          flat
                          color="pink"
                          label="删除"
                        />
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
          v-model="draggingFab"
          color="purple"
          icon="keyboard_arrow_left"
          direction="left"
          title="订阅"
        >
          <q-fab-action
            @click="save"
            label-position="top"
            external-label
            color="purple"
            icon="save"
            label="保存"
          />
          <q-fab-action
            @click="insert"
            label-position="top"
            external-label
            color="purple"
            icon="add"
            label="新增"
          />
        </q-fab>
      </q-page-sticky>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { QTableProps } from 'quasar';
import { List, Rewritesub } from './rewrite';
import { ref, watch } from 'vue';
import { api } from '../../boot/axios';

const prop = defineProps<{
  modelValue: boolean;
  subscribe: Partial<Rewritesub>;
  // pagination: QTableProps['pagination'];
}>();

const emit = defineEmits(['update:modelValue', 'update:subscribe', 'save']);

const dialog = ref(false);

const maximizedToggle = ref(true);

const draggingFab = ref(false);

const sub = ref<Partial<Rewritesub>>({});

const content = async (item: Record<'pageIndex', number>) => {
  const result: {
    name: string;
    author: string;
    mitmhost: string[];
    rewrite: [
      {
        match: string;
        target: string;
        enable: boolean;
      }
    ];
  } = await api.get(
    Object.values(sub.value as Rewritesub)[item.pageIndex].resource
  );
  Object.values(sub.value as Rewritesub)[item.pageIndex].list =
    result.rewrite as unknown as List[];
  Object.values(sub.value as Rewritesub)[item.pageIndex].collapse = true;
};

watch(
  () => prop.modelValue,
  () => {
    dialog.value = prop.modelValue;
  }
);

watch(
  () => prop.subscribe,
  () => {
    sub.value = prop.subscribe;
  }
);

watch(dialog, (dialog) => {
  emit('update:modelValue', dialog);
});

watch(sub, (sub) => {
  emit('update:subscribe', sub);
});

const save = () => {
  emit('save');
};

const insert = () => {
  Object.assign(sub.value, {
    [Math.random().toString(36).slice(-6)]: {
      name: 'elecV2P 重写订阅',
      resource:
        'https://raw.githubusercontent.com/shaolin-kongfu/js_scripts/main/zq/zqcx.json',
      type: 'rewrite',
      note: '',
      date: '',
      total: 0,
      active: 0,
      enable: true,
      bkcolor: '#c55890',
      collapse: false,
      list: [],
    },
  });
};

const del = (key: string) => {
  delete sub.value[key];
};

const delResource = (key: string, s: number) => {
  sub.value[key]?.list.splice(s, 1);
};

const header: QTableProps['columns'] = [
  { name: 'collapse', align: 'center', label: '折叠', field: 'collapse' },
  { name: 'name', align: 'center', label: '订阅名称', field: 'name' },
  { name: 'resource', align: 'center', label: '订阅地址', field: 'resource' },
  { name: 'enable', align: 'center', label: '启用', field: 'enable' },
  { name: 'action', align: 'center', label: '操作', field: 'action' },
];
</script>
