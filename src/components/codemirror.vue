<template>
  <textarea ref='codeEditor'></textarea>
</template>

<script lang='ts'>
import { defineComponent, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
// codemirror基础资源引入
import _CodeMirror, { Editor } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js';

// 折叠资源引入:开始
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/foldgutter.js';
// 折叠资源引入:结束

// 搜索资源引入:开始
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/search/jump-to-line.js';

import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
// 搜索资源引入:结束

// 启用placeholder
import 'codemirror/addon/display/placeholder.js';

import 'codemirror/addon/selection/active-line.js';

const CodeMirror = window.CodeMirror || _CodeMirror;

export default defineComponent({
  props: {
    modelValue: String || Object || Array,
    defaultValue: String,
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const { modelValue, defaultValue, readOnly } = toRefs(props);
    const codeEditor = ref();
    let editor: Editor;
    watch(modelValue, () => {
      if (null != editor && modelValue.value && modelValue.value !== editor.getValue()) {
        // 触发v-model的双向绑定
        editor.setValue(modelValue.value);
      }
    });
    watch(readOnly, () => {
      if (null != editor) {
        editor.setOption('readOnly', readOnly.value);
      }
    });
    onMounted(() => {
      editor = CodeMirror.fromTextArea(codeEditor.value, {
        value: modelValue.value,
        indentWithTabs: false,
        smartIndent: true,
        lineNumbers: false,
        readOnly: readOnly.value,
        foldGutter: true,
        lineWrapping: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
        styleActiveLine: true,
      });
      // 监听编辑器的change事件
      editor.on('change', () => {
        // 触发v-model的双向绑定
        context.emit('update:modelValue', editor.getValue());
      });
      if (defaultValue.value) {
        editor.setValue(defaultValue.value);
      }
    });
    onBeforeUnmount(() => {
      if (null != editor) {
        // editor.toTextArea();
        // editor = null;
      }
    });
    return { codeEditor };
  }
});
</script>
