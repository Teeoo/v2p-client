<template>
  <q-card flat>
    <q-card-section>
      <div class="row">
        <div class="col-12 col-md-3">
          <q-btn
            @click="dialog = true"
            flat
            class="full-width"
            color="purple"
            label="查看程序运行日志"
            icon="mdi-bug"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-btn
            target="_blank"
            to="/efss"
            flat
            class="full-width"
            color="purple"
            label="EFSS 文件管理界面"
            icon="folder"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-btn-dropdown
            v-model="dropdown"
            flat
            class="full-width"
            auto-close
            rounded
            color="purple"
            :label="`ANYPROXY 端口: ${view.anyproxy?.port}`"
            icon="router"
          >
            <q-list padding>
              <q-item>
                <q-item-section>
                  <q-btn
                    @click="proxy(view.anyproxy!.enable)"
                    :disable="view.anyproxy?.enable"
                    flat
                    color="pink"
                    label="开启"
                  />
                  <q-btn
                    @click="proxy(view.anyproxy!.enable)"
                    :disable="!view.anyproxy?.enable"
                    flat
                    color="pink"
                    label="关闭"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="col-12 col-md-3">
          <q-btn
            flat
            class="full-width"
            color="purple"
            :disable="!view.anyproxy?.enable"
            :label="`网络请求查看端口: ${view.anyproxy?.webPort}`"
            icon="language"
            target="_blank"
            type="a"
            :href="`${host}:${view.anyproxy?.webPort}`"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-12 col-md-2">
          <q-btn
            flat
            class="full-width"
            color="purple"
            :label="`RULES 规则数: ${view.ruleslen}`"
            to="rules"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-btn
            flat
            class="full-width"
            color="purple"
            :label="`REWRITE 规则数: ${view.rewriteslen}`"
            to="rewrite"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-btn
            flat
            class="full-width"
            color="purple"
            :label="`JS 文件数: ${view.jslistslen}`"
            to="jsmanage"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-btn
            flat
            class="full-width"
            color="purple"
            :label="`TASK 定时: ${view.taskstatus?.running}/${view.taskstatus?.total}/${view.taskstatus?.sub}`"
            to="task"
          />
        </div>
        <div class="col-12 col-md-3">
          <q-btn
            flat
            class="full-width"
            color="purple"
            :label="`MITM HOST 数: ${view.mitmhostlen}`"
            to="mitm"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
  <Logs v-model="dialog" />
</template>
<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { defineProps, inject, ref } from 'vue';
import { Overview } from './overview';
import Logs from './logger.vue';

const $q = useQuasar();

const ws = inject('ws') as WebSocket;

const dialog = ref(false);

const dropdown = ref(false);

const host = ref<string>(`${location.protocol}//${location.hostname}`);

defineProps<{ view: Partial<Overview> }>();

const proxy = (status: boolean) => {
  $q.loadingBar.start();
  ws.send(
    JSON.stringify({
      type: 'eproxy',
      data: `${!status ? 'start' : 'close'}`,
    })
  );
};
</script>
