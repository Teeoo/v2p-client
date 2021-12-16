<template>
  <q-card-section>
    <q-input color="purple-12" v-model="config.homepage" label="主页地址">
      <template v-slot:prepend>
        <q-icon name="mdi-link-variant" />
      </template>
      <template v-slot:after>
        <q-btn
          flat
          label="保存"
          color="pink"
          @click="save('homepage', config.homepage ?? '')"
        />
      </template>
    </q-input>
  </q-card-section>
  <q-card-section>
    <q-select
      v-model="config.gloglevel"
      color="purple-12"
      label="日志等级"
      :options="['error', 'notify', 'info', 'debug']"
    >
      <template v-slot:prepend>
        <q-icon name="mdi-dev-to " />
      </template>
      <template v-slot:after>
        <q-btn
          flat
          label="保存"
          color="pink"
          @click="save('gloglevel', config.gloglevel ?? '')"
        />
      </template>
    </q-select>
  </q-card-section>
  <q-card-section>
    <q-input color="purple-12" v-model="config.wbrtoken" label="WEBHOOK TOKEN">
      <template v-slot:prepend>
        <q-icon name="mdi-link-variant" />
      </template>
      <template v-slot:append>
        <q-btn round dense flat icon="mdi-restart" @click="uuid" />
      </template>
      <template v-slot:after>
        <q-btn
          flat
          label="保存"
          color="pink"
          @click="save('wbrtoken', config.wbrtoken ?? '')"
        />
      </template>
    </q-input>
  </q-card-section>
</template>
<script setup lang="ts">
import { Setting } from './setting';
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

const $q = useQuasar();

const prop = defineProps<{
  modelValue: Partial<Setting>;
}>();

const emit = defineEmits(['update:modelValue']);

const config = ref<Partial<Setting>>({});

watch(
  () => prop.modelValue,
  () => {
    config.value = prop.modelValue;
  }
);

watch(config, (config) => {
  emit('update:modelValue', config);
});

const save = async (type: string, data: string) => {
  try {
    const result: Record<'message', string> = await api.put('config', {
      type,
      data,
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

const uuid = () => {
  const url = URL.createObjectURL(new Blob());
  const uuid = url.toString();
  URL.revokeObjectURL(url);
  config.value.wbrtoken = uuid.substring(uuid.lastIndexOf('/') + 1);
};
</script>
