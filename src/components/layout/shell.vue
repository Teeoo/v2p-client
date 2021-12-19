<template>
  <q-dialog
    v-model="minishell"
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-bar :class="$q.dark.isActive ? 'q-dark' : 'bg-white text-white'">
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
        <q-space />
        <Status />
        <q-space />
      </q-bar>
      <Message />
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import Status from './status.vue';
import Message from './message.vue';
import { defineProps, watch, ref } from 'vue';
const prop = defineProps<{ modelValue: boolean }>();
const minishell = ref(false);
const maximizedToggle = ref(true);
watch(
  () => prop.modelValue,
  () => {
    minishell.value = prop.modelValue;
  }
);
</script>
