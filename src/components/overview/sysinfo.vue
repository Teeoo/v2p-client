<template lang="">
  <q-card flat>
    <q-card-section>
      <q-card-section>
        <div class="text-h6 text-center">
          客户端连接数: {{ status.data?.clients }}
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col">
            <q-list>
              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="local_bar" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ view.sysinfo?.arch }}</q-item-label>
                  <q-item-label caption>架构</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="red" name="mdi-linux" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ view.sysinfo?.platform }}</q-item-label>
                  <q-item-label caption>平台</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="amber" name="mdi-memory " />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ view.sysinfo?.memory }}</q-item-label>
                  <q-item-label caption>内存</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="primary" name="schedule" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ view.sysinfo?.uptime }}</q-item-label>
                  <q-item-label caption>UPTIME</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-icon color="accent" name="mdi-nodejs " />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ view.sysinfo?.nodever }}</q-item-label>
                  <q-item-label caption>NODEJS</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col">
            <q-list>
              <q-item clickable>
                <q-item-section avatar>
                  <q-spinner-audio color="secondary" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      width="25%"
                      v-show="!status.data?.memoryusage.rss"
                    />
                    {{ status.data?.memoryusage.rss }}
                  </q-item-label>
                  <q-item-label caption>
                    <q-item-label caption>rss</q-item-label>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-spinner-ball color="red" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      width="25%"
                      v-show="!status.data?.memoryusage.heapTotal"
                    />
                    {{ status.data?.memoryusage.heapTotal }}
                  </q-item-label>
                  <q-item-label caption>heapTotal</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-spinner-bars color="purple" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      width="25%"
                      v-show="!status.data?.memoryusage.heapUsed"
                    />
                    {{ status.data?.memoryusage.heapUsed }}
                  </q-item-label>
                  <q-item-label caption>heapUsed</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-spinner-pie color="orange" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      width="25%"
                      v-show="!status.data?.memoryusage.external"
                    />
                    {{ status.data?.memoryusage.external }}
                  </q-item-label>
                  <q-item-label caption>external</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable>
                <q-item-section avatar>
                  <q-spinner-puff color="deep-orange" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    <q-skeleton
                      type="text"
                      width="25%"
                      v-show="!status.data?.memoryusage.arrayBuffers"
                    />
                    {{ status.data?.memoryusage.arrayBuffers }}
                  </q-item-label>
                  <q-item-label caption>arrayBuffers</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
<script lang="ts" setup>
import { ref, inject } from 'vue';
import { V2Pstatus } from '../layout/layout';
import { Overview } from './overview';

defineProps<{ view: Partial<Overview> }>();

const ws = inject('ws') as WebSocket;

const status = ref<Partial<V2Pstatus>>({});

ws.addEventListener('message', (e) => {
  let result = JSON.parse(e.data) as V2Pstatus;
  if (result.type === 'elecV2Pstatus') {
    status.value = result;
  }
});
</script>
