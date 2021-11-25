<template>
  <q-page>
    <q-card flat>
      <q-tabs
        v-model='tab'
        class='bg-purple text-white'
        align='justify'
        narrow-indicator
      >
        <q-tab name='1' label='基础设置' />
        <q-tab name='2' label='通知相关设置' />
        <!--        <q-tab name='3' label='默认通知相关设置' />-->
        <q-tab name='4' label='JS 运行相关设置' />
        <q-tab name='5' label='网络请求相关设置' />
        <q-tab name='6' label='初始化相关设置' />
        <q-tab name='7' label='限制可访问此后台管理页面的 IP' />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model='tab' animated>
        <q-tab-panel name='1'>
          <q-card-section>
            <q-input color='purple-12' v-model='config.homepage' label='主页地址'>
              <template v-slot:prepend>
                <q-icon name='mdi-link-variant' />
              </template>
              <template v-slot:after>
                <q-btn flat label='保存' color='pink' @click='saveBase("homepage",config.homepage)' />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-select v-model='config.gloglevel' color='purple-12' label='日志等级' :options='[
              "error","notify","info","debug"
            ]'>
              <template v-slot:prepend>
                <q-icon name='mdi-dev-to ' />
              </template>
              <template v-slot:after>
                <q-btn flat label='保存' color='pink' @click='saveBase("gloglevel",config.gloglevel)' />
              </template>
            </q-select>
          </q-card-section>
          <q-card-section>
            <q-input color='purple-12' v-model='config.wbrtoken' label='WEBHOOK TOKEN'>
              <template v-slot:prepend>
                <q-icon name='mdi-link-variant' />
              </template>
              <template v-slot:append>
                <q-btn round dense flat icon='mdi-restart' @click="$q.notify({
          position: 'top',
          message: '啊啊啊啊,这里还没写啊'
        })" />
              </template>
              <template v-slot:after>
                <q-btn flat label='保存' color='pink' @click='saveBase("wbrtoken",config.wbrtoken)' />
              </template>
            </q-input>
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name='2'>
          <q-card-section>
            <q-input v-model='config.CONFIG_FEED.iftttid.key' prefix='IFTTT KEY:'>
              <template v-slot:prepend>
                <q-toggle
                  v-model='config.CONFIG_FEED.iftttid.enable'
                  color='pink'
                />
              </template>
              <template v-slot:after>
                <q-btn flat label='保存' color='pink' @click='saveNotify("ifttt",config.CONFIG_FEED.iftttid)' />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-input v-model='config.CONFIG_FEED.barkkey.key' prefix='BARK KEY:'>
              <template v-slot:prepend>
                <q-toggle
                  v-model='config.CONFIG_FEED.barkkey.enable'
                  color='pink'
                />
              </template>
              <template v-slot:after>
                <q-btn flat label='保存' color='pink' @click='saveNotify("barkkey",config.CONFIG_FEED.barkkey)' />
              </template>
            </q-input>

          </q-card-section>
          <q-card-section>
            <q-input v-model='config.CONFIG_FEED.custnotify.url' prefix='自定义通知链接:'>
              <template v-slot:prepend>
                <q-toggle
                  v-model='config.CONFIG_FEED.custnotify.enable'
                  color='pink'
                />
                <q-select v-model='config.CONFIG_FEED.custnotify.type' :options='["GET","POST"]'
                          @update:model-value='isPost = config.CONFIG_FEED.custnotify.type === "POST"'
                />
              </template>
              <template v-slot:after>
                <q-btn flat label='保存' color='pink' @click='saveNotify("custnotify",config.CONFIG_FEED.custnotify)' />
              </template>
            </q-input>
            <q-input
              v-if='isPost'
              v-model='config.CONFIG_FEED.custnotify.data'
              type='textarea'
              placeholder='使用 $title$ 代表通知标题，$body$ 、代表通知内容，$url$ 代表附加链接。比如：
{
  "text": `$title$`,
  "desp": `$body$\n\n附加链接: $url$`
}
具体格式及使用参数，根据自定义通知的 API 说明进行调整（通知内容尽量使用反引号`包括'
            />
          </q-card-section>
          <q-card-section>
            <q-input color='purple-12' prefix='通知触发 JS:' v-model='config.CONFIG_FEED.runjs.list'
                     label='notify.js, test.js（多个 JS 使用英文逗号进行分隔，支持远程 JS）'>
              <template v-slot:prepend>
                <q-toggle v-model='config.CONFIG_FEED.runjs.enable' color='pink' />
              </template>
              <template v-slot:after>
                <q-btn flat label='保存' color='pink' @click='saveNotify("runjs",config.CONFIG_FEED.runjs)' />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-input v-model='config.CONFIG_FEED.maxbLength' type='number' prefix='当通知内容长度超过' suffix='时，分段发送'>
              <template v-slot:prepend>
                <!--                <q-icon name='mdi-av-timer'/>-->
                <q-toggle v-model='config.CONFIG_FEED.webmessage.enable' color='pink' label='是否在前端网页显示通知' />
                <q-toggle v-model='config.CONFIG_FEED.enable' color='pink' label='是否开启默认通知' />
              </template>
              <template v-slot:after>
                <q-btn flat label='保存' color='pink' @click='notifyConfig' />
              </template>
            </q-input>
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name='4'>
          <q-card-section>
            <q-input v-model='config.CONFIG_RUNJS.timeout' label='0 ms: 不设定超过时间，由 $done 控制返回' prefix='TIMEOUT(ms):' />
          </q-card-section>
          <q-card-section>
            <q-input v-model='config.CONFIG_RUNJS.intervals' label='0 秒: 表示如果有则不更新' prefix='远程 JS 更新间隔(秒):' />
          </q-card-section>
          <q-card-section>
            <q-input v-model='config.CONFIG_RUNJS.numtofeed' label='0 次: 表示不通知' type='number'
                     prefix='每运行' suffix='次, 添加一个默认通知' />
          </q-card-section>
          <q-card-section>
            <q-input v-model='CONFIG_RUNJS' prefix='白名单脚本:' label='完整的 JS 文件名，以逗号或空格进行分隔，比如: test.js,softupdate.js'
                     hint='该名单脚本内所有网络请求直接放行，不做屏蔽检测'>
              <template v-slot:prepend>
                <q-toggle v-model='config.CONFIG_RUNJS.white.enable' />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <div class='row'>
              <div class='col-12 col-md-4'>
                <q-checkbox v-model='config.CONFIG_RUNJS.jslogfile' label='保存日志' color='teal' />
              </div>
              <div class='col-12 col-md-4'>
                <q-checkbox v-model='config.CONFIG_RUNJS.eaxioslog' label='保存网络请求 URL 到日志中' :model-value='false'
                            color='teal' />
              </div>
              <div class='col-12 col-md-4'>
                <q-checkbox v-model='config.CONFIG_RUNJS.proxy' label='使用网络请求相关设置中的代理(如有)' :model-value='true'
                            color='teal' />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-page-sticky position='bottom-right' :offset='[18, 18]'>
              <q-btn @click='eAxios' fab icon='save' color='accent' />
            </q-page-sticky>
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name='5'>
          <q-card-section>
            <q-input v-model='config.CONFIG_Axios.timeout' prefix='TIMEOUT(ms):' />
          </q-card-section>
          <q-card-section>
            <q-select v-model='config.CONFIG_Axios.iPhone'
                      :options='Object.values(config.uagent)'
                      option-value='header'
                      option-label='name'
                      emit-value
                      map-options
                      prefix='User-Agent:'>
              <template v-slot:after>
                <q-btn color='pink' label='管理' flat />
              </template>
            </q-select>
          </q-card-section>
          <q-card-section>
            <q-input v-model='config.CONFIG_Axios.block.regexp'
                     prefix='阻止 URL'
                     label="匹配内容 比如: abc|123 匹配方式: new RegExp('该内容').test(url)"
                     hint='当网络请求 url 符合此正则表达式时，屏蔽该请求'>
              <template v-slot:prepend>
                <q-toggle v-model='config.CONFIG_Axios.block.enable' />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-input v-model='config.CONFIG_Axios.only.regexp'
                     prefix='仅允许 URL'
                     label='匹配内容 其他所有不符合该正则表达式的网络请求将被直接屏蔽掉'
                     hint='开启时，仅允许符合此正则表达式的网络请求通过'>
              <template v-slot:prepend>
                <q-toggle v-model='config.CONFIG_Axios.only.enable' />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-toggle v-model='config.CONFIG_Axios.proxy.enable' label='使用HTTP代理' />
          </q-card-section>
          <q-card-section>
            <q-page-sticky position='bottom-right' :offset='[18, 18]'>
              <q-btn @click='eAxios' fab icon='save' color='accent' />
            </q-page-sticky>
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name='6'>
          <q-card-section>
            TODO:
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel name='7'>
          <q-card-section>
            <q-checkbox v-model='config.security.enable' label='限制可访问此后台管理页面的 IP' color='teal' />
          </q-card-section>
          <q-card-section>
            <div class='row'>
              <div class='col-12 col-md-6'>
                <q-input
                  v-model='whitelist'
                  label='白名单'
                  type='textarea'
                  placeholder='127.0.0.1
192.168.1.101
182.xxx.x.125
(仅可设置为 IP 地址)
(白名单优先级高于黑名单)
'
                />
              </div>
              <div class='col-12 col-md-6'>
                <q-input
                  v-model='blacklist'
                  label='黑名单'
                  type='textarea'
                  placeholder='172.20.10.2
*
单独星号字符 * 表示屏蔽所有（只允许白名单中的 IP 通过）
如果设置为 *，请务必先记下 WEBHOOK TOKEN'
                />
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-page-sticky position='bottom-right' :offset='[18, 18]'>
              <q-btn @click='security' fab icon='save' color='accent' />
            </q-page-sticky>
          </q-card-section>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>
<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

export interface Setting {
  homepage: string;
  gloglevel: string;
  CONFIG_FEED: ConfigFeed;
  CONFIG_RUNJS: ConfigRunjs;
  CONFIG_Axios: ConfigAxios;
  uagent: Uagent;
  wbrtoken: string;
  minishell: boolean;
  security: Security;
  init: Init;
  anyproxy: Anyproxy;
  webUI: WebUi;
}

export interface ConfigFeed {
  enable: boolean;
  rss: Rss;
  iftttid: Iftttid;
  barkkey: Barkkey;
  custnotify: Custnotify;
  runjs: Runjs;
  merge: Merge;
  maxbLength: number;
  webmessage: Webmessage;
}

export interface Rss {
  enable: boolean;
  homepage: string;
}

export interface Iftttid {
  enable: boolean;
  key: string;
}

export interface Barkkey {
  enable: boolean;
  key: string;
}

export interface Custnotify {
  enable: boolean;
  url: string;
  type: string;
  data: string;
}

export interface Runjs {
  enable: boolean;
  list: string;
}

export interface Merge {
  enable: boolean;
  gaptime: number;
  number: number;
  andor: boolean;
}

export interface Webmessage {
  enable: boolean;
}

export interface ConfigRunjs {
  timeout: number;
  intervals: number;
  numtofeed: number;
  jslogfile: boolean;
  eaxioslog: boolean;
  proxy: boolean;
  white: White;
}

export interface White {
  enable: boolean;
  list: string[];
}

export interface ConfigAxios {
  proxy: Proxy;
  timeout: number;
  uagent: string;
  block: Block;
  only: Only;
}

export interface Proxy {
  enable: boolean;
}

export interface Block {
  enable: boolean;
  regexp: string;
}

export interface Only {
  enable: boolean;
  regexp: string;
}

export interface Uagent {
  iPhone: IPhone;
  Firefox: Firefox;
  chrome: Chrome;
  Quark: Quark;
  ucadroid: Ucadroid;
  SearchCraft: SearchCraft;
}

export interface IPhone {
  name: string;
  header: string;
}

export interface Firefox {
  name: string;
  header: string;
}

export interface Chrome {
  name: string;
  header: string;
}

export interface Quark {
  name: string;
  header: string;
}

export interface Ucadroid {
  name: string;
  header: string;
}

export interface SearchCraft {
  name: string;
  header: string;
}

export interface Security {
  enable: boolean
  whitelist: string[]
  blacklist: string[]
}

export interface Init {
  checkupdate: boolean;
  runjs: string;
}

export interface Anyproxy {
  enable: boolean;
  port: number;
  webPort: number;
}

export interface WebUi {
  port: number;
}


export default defineComponent({
  setup() {
    const $q = useQuasar();
    const config = ref<Partial<Setting>>({});
    const isPost = ref(false);
    const CONFIG_RUNJS = ref('');
    const whitelist = ref('');
    const blacklist = ref('');
    onMounted(async () => {
      try {
        config.value = await api.get('config?type=setting');
        if (!config.value.homepage) {
          config.value.homepage = window.location.origin;
        }
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        CONFIG_RUNJS.value = config.value.CONFIG_RUNJS!.white.list.toString();
        whitelist.value = config.value.security!.whitelist.toString();
        blacklist.value = config.value.security!.blacklist.toString();
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '获取数据失败!'
        });
      }
    });

    const saveBase = async (type: string, data: string) => {
      try {
        const result: Record<'message', string> = await api.put('config', {
          type, data
        });
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '保存失败咯!'
        });
      }
    };

    const saveNotify = async (type: string, data:
      {
        enable: boolean;
        key?: string;
        list?: string;
      } | Custnotify) => {
      try {
        const result: Record<'message', string> = await api.put('feed', {
          type, data
        });
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '保存失败咯!'
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
            webmessage: config.value.CONFIG_FEED?.webmessage
          }
        });
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '保存失败咯!'
        });
      }
    };

    const runjs = async () => {
      try {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        config.value.CONFIG_RUNJS!.white.list = CONFIG_RUNJS.value.split(',');
        const result: Record<'message', string> = await api.put('config', {
          type: 'runjs',
          data: config.value.CONFIG_RUNJS
        });
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '保存失败咯!'
        });
      }
    };

    const eAxios = async () => {
      try {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        config.value.CONFIG_RUNJS!.white.list = CONFIG_RUNJS.value.split(',');
        const result: Record<'message', string> = await api.put('config', {
          type: 'eAxios',
          data: config.value.CONFIG_Axios
        });
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '保存失败咯!'
        });
      }
    };

    const security =async () => {
      try {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        config.value.security!.whitelist = whitelist.value.split(',');
        config.value.security!.blacklist = blacklist.value.split(',');
        const result: Record<'message', string> = await api.put('config', {
          type: 'security',
          data: config.value.security
        });
        $q.notify({
          position: 'top',
          message: result.message
        });
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '保存失败咯!'
        });
      }
    }

    return {
      tab: ref('1'),
      splitterModel: ref(20),
      text: ref('Field content'),
      config,
      saveBase,
      saveNotify,
      isPost,
      notifyConfig,
      runjs, CONFIG_RUNJS, eAxios,blacklist,whitelist,security
    };
  }
});
</script>
