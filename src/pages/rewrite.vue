<template>
  <q-page v-touch-hold.mouse="() => (handleSwipe = !handleSwipe)">
    <Rewrite-List v-model="rewrite" v-model:pagination="pagination" />
    <Subscribe v-model="dialog" v-model:subscribe="rewriteSub" @save="save" />
    <q-page-sticky
      v-show="handleSwipe"
      position="bottom-right"
      :offset="[18, 18]"
    >
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
          @click="dialog = true"
          label-position="top"
          external-label
          color="purple"
          icon="mdi-playlist-check "
          label="订阅"
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
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { QTableProps, useQuasar } from 'quasar';
import { List, RewriteLists, Rewritesub } from '../components/rewrite/rewrite';
import RewriteList from '../components/rewrite/rewrite.vue';
import Subscribe from '../components/rewrite/subscribe.vue';

export default defineComponent({
  components: { 'Rewrite-List': RewriteList, Subscribe },
  setup() {
    const $q = useQuasar();
    const rewrite = ref<Partial<List[]>>([]);
    const rewriteSub = ref<Partial<Rewritesub>>({});
    const handleSwipe = ref(false);
    const draggingFab = ref(false);
    const dialog = ref(false);
    const pagination = ref<QTableProps['pagination']>({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: $q.localStorage.getItem<number>('rewritePerPage') ?? 5,
    });
    onMounted(async () => {
      try {
        const data: RewriteLists = await api.get('data?type=rewritelists');
        rewrite.value = data.rewrite.list;
        rewriteSub.value = data.rewritesub;
        Object.keys(rewriteSub.value).forEach((key) => {
          /* eslint-disable @typescript-eslint/no-non-null-assertion */
          rewriteSub.value[key]!['key'] = key;
        });
        $q.notify({
          position: 'top',
          message: `成功获取 REWRITE 列表，规则 ${data.rewrite.total} 订阅 ${
            Object.values(data.rewritesub).length
          }`,
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子',
        });
      }
    });

    const save = async () => {
      try {
        const result: Record<'message', string> = await api.put('data', {
          type: 'rewrite',
          rewritelists: rewrite.value,
          rewritesub: rewriteSub.value,
        });
        $q.notify({
          position: 'top',
          message: result.message,
        });
        dialog.value = false;
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '处理中出了点幺蛾子',
        });
      }
    };

    const insert = () => {
      rewrite.value.push({
        match: '',
        stage: '',
        target: '',
        enable: true,
      });
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      pagination.value!.page = Math.ceil(
        rewrite.value.length / (pagination.value?.rowsPerPage ?? 5)
      );
    };

    return {
      rewrite,
      handleSwipe,
      pagination,
      draggingFab,
      dialog,
      rewriteSub,
      save,
      insert,
    };
  },
});
</script>
