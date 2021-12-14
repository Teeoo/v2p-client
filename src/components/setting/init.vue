<template>
  <q-card-section>
    <q-input
      v-model="config.init!.runjs"
      prefix="启动时运行脚本:"
      hint="python-install.js, feed.js, process.env.js（多个脚本请使用英文逗号进行分隔）"
    >
      <template v-slot:after>
        <q-btn
          flat
          label="保存"
          color="pink"
          @click="save('init', config.init)"
        />
      </template>
    </q-input>
  </q-card-section>
  <q-card-section>
    <q-input
      v-model="config.webUI!.port"
      prefix="webUI 主界面端口:"
      hint="端口类设置改变的是 elecV2P 相关端口，如使用 Docker，映射端口也应做相应修改"
    >
      <template v-slot:after>
        <q-btn
          flat
          label="保存"
          color="pink"
          @click="save('webUI', config.webUI)"
        />
      </template>
    </q-input>
  </q-card-section>

  <q-card-section>
    <div class="row">
      <div class="col-12 col-md-6">
        <q-input v-model="config.anyproxy!.port" prefix="代理端口:" />
      </div>
      <div class="col-12 col-md-6">
        <q-input v-model="config.anyproxy!.webPort" prefix="网络请求查看端口:">
          <template v-slot:after>
            <q-btn
              flat
              label="保存"
              color="pink"
              @click="save('anyproxy', config.anyproxy)"
            />
          </template>
        </q-input>
      </div>
    </div>
  </q-card-section>

  <q-card-section>
    <q-toggle
      @update:model-value="toggle"
      label="ANYPROXY 设置"
      v-model="config.anyproxy!.enable"
    />
  </q-card-section>

  <q-card-section>
    <q-page-sticky position="bottom-right" :offset="[50, 18]">
      <q-fab
        :model-value="true"
        color="purple"
        icon="keyboard_arrow_left"
        direction="up"
      >
        <q-fab-action
          @click="checkUpdate"
          color="primary"
          label="检测更新 elecV2P"
        />
        <q-fab-action
          color="secondary"
          label="重启 elecV2P"
          @click="action('restart')"
        />
        <q-fab-action
          color="red"
          label="关闭 elecV2P"
          @click="action('stop')"
        />
        <q-fab-action
          :href="`/config?token=${config.wbrtoken}`"
          color="purple"
          label="导出当前配置文件"
        />
        <q-fab-action color="amber" label="导入配置文件" />
      </q-fab>
    </q-page-sticky>
  </q-card-section>
  <q-dialog v-model="dialog" position="bottom">
    <q-card flat>
      <q-linear-progress :value="1" color="pink" />
      <q-card-section class="row items-center no-wrap">
        <div>
          <div class="text-weight-bold">
            请输入 webhook token，进行{{ stop ? '停止' : '重启' }}
          </div>
          <div class="text-grey">
            elecV2P 将尝试使用 pm2 命令进行{{ stop ? '停止' : '重启' }}操作
          </div>
          <div class="text-grey" v-show="stop">
            关闭后 webUI/定时任务/ANYPROXY 都将不可用
          </div>
          <q-input prefix="webhook token:" v-model="token" />
        </div>
        <q-space />
        <q-card-actions vertical>
          <q-btn flat color="pink" @click="webhook">确定</q-btn>
        </q-card-actions>
      </q-card-section>
      <q-card-section v-show="message">
        {{ message }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { Anyproxy, Init, Setting, WebUi } from './setting';
import { ref, watchEffect } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useInitStore } from 'src/store/init';

const $q = useQuasar();

const prop = defineProps<{
  modelValue: Partial<Setting>;
}>();

const config = ref<Partial<Setting>>({});

const $state = useInitStore();

const dialog = ref(false);

const stop = ref(false);

const token = ref('');

const message = ref('');

watchEffect(() => {
  config.value = prop.modelValue;
});

const save = async (type: string, data?: Init | WebUi | Anyproxy) => {
  try {
    let req: { CONFIG_init?: Init } | WebUi = { CONFIG_init: data as Init };
    if (type === 'webUI') {
      req = data as WebUi;
    } else if (type === 'anyproxy') {
      req = data as Anyproxy;
    }
    const result: Record<'message', string> = await api.put('config', {
      type,
      data: req,
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

const toggle = async (b: boolean) => {
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  config.value.anyproxy!.enable = b;
  void (await save('anyproxy', config.value.anyproxy as Anyproxy));
};

const checkUpdate = () => {
  if (config.value.newversion !== $state.getVersion) {
    $q.notify({
      message: `检测到新版本 v${
        config.value.newversion ?? ''
      }\n请手动运行 softupdate.js 或者使用 docker 命令进行更新\n（等 softupdate.js 稳定后将会集成到这里实现自动更新）`,
      multiLine: true,
      position: 'top',
    });
  } else {
    $q.notify({
      position: 'top',
      message: '无需更新',
    });
  }
};

const action = (type: string) => {
  dialog.value = true;
  if (type === 'stop') {
    stop.value = true;
  }
};

const webhook = async () => {
  try {
    message.value = JSON.stringify(
      await api.post('webhook', {
        token: token.value,
        type: 'shell',
        command: `${stop.value ? 'pm2 stop elecV2P' : 'pm2 restart elecV2P'}`,
      })
    );
  } catch (e) {
    message.value = JSON.stringify(e);
  }
  stop.value = false;
};
</script>
