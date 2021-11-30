<template>
  <q-layout view='lHh Lpr lFf'>
    <q-page-container>
      <q-page>
        <q-card flat>
          <q-card-section>
            <q-tree
              :nodes='nodes'
              children-key='list'
              node-key='name'
              label-key='name'
              tick-strategy="leaf"
              v-model:selected="selectedKey"
              v-model:ticked="tickedKeys"
            >
              <template v-slot:default-header='prop'>
                <div class='row items-center'>
                  <div>
                    <q-icon v-if='prop.node.type==="directory"' color='blue'
                            :name='prop.expanded ? "mdi-folder-open":"mdi-folder"' />
                    <q-icon v-else :name='fileExtension(prop.node.name)' />
                    {{ prop.node.name }}
                    <q-tooltip anchor='center right' self='center left'>
                      {{ date.formatDate(prop.node.mtime, 'YYYY-MM-DD HH:mm:ss') }}
                    </q-tooltip>
                    <q-badge v-if='prop.node.type==="directory"' color='orange' class='q-ml-sm'>{{ prop.node.list.length }}</q-badge>
                    <q-menu
                      touch-position
                      context-menu
                    >

                      <q-list dense style="min-width: 100px">
                        <q-item clickable v-close-popup>
                          <q-item-section>复制</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>剪切</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item clickable v-close-popup>
                          <q-item-section>编辑</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>重命名</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>使用PM2运行</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>获取文件链接</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>删除该文件</q-item-section>
                        </q-item>
                      </q-list>

                    </q-menu>
                  </div>
                </div>
              </template>
            </q-tree>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { defineComponent, onMounted, ref } from 'vue';
import { useQuasar, date } from 'quasar';
import { api } from 'boot/axios';

export interface Sefss {
  list: List;
  config: Config;
}

export interface TreeNode {
  type: string;
  name: string;
  list?: TreeNode[];
  mtime: number;
  size?: string;
}

export interface List {
  type: string;
  name: string;
  list: TreeNode[];
  mtime: number;
}

export interface Config {
  enable: boolean;
  directory: string;
  dotshow: Dotshow;
  max: number;
  skip: Skip;
  favend: Favend;
  favendtimeout: number;
}

export interface Dotshow {
  enable: boolean;
}

export interface Skip {
  folder: string[];
  file: string[];
}

export interface Favend {
  test: Test;
  logs: Logs;
  shell: Shell;
}

export interface Test {
  key: string;
  name: string;
  type: string;
  target: string;
  enable: boolean;
}

export interface Logs {
  key: string;
  name: string;
  type: string;
  target: string;
  enable: boolean;
}

export interface Shell {
  key: string;
  name: string;
  type: string;
  target: string;
  enable: boolean;
}


export default defineComponent({
  setup() {
    const $q = useQuasar();
    const efss = ref<Partial<Sefss>>({});
    const nodes = ref<TreeNode[]>([]);
    const selectedKey = ref([]);
    const tickedKeys = ref([]);

    onMounted(async () => {
      try {
        efss.value = await api.get('sefss');
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        nodes.value = efss.value.list!.list;
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: '加载数据失败'
        });
      }
    });

    const fileExtension = (s: string): string => {
      let result = 'mdi-file';
      const ex = s.substring(s.lastIndexOf('.') + 1);
      if (ex === 'js') {
        result = 'mdi-nodejs';
      } else if (ex === 'ts') {
        result = 'mdi-language-typescript';
      } else if (ex === 'md') {
        result = 'mdi-language-markdown-outline';
      } else if (ex === 'png') {
        result = 'mdi-image';
      } else if (ex === 'json') {
        result = 'mdi-code-json';
      } else if (ex === 'log') {
        result = 'mdi-math-log';
      }
      return result;
    };

    return {
      efss,
      nodes,
      date,
      fileExtension,
      selectedKey,
      tickedKeys
    };
  }
});
</script>
