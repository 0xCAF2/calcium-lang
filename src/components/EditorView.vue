<template>
  <v-switch v-model="running" color="blue" />
  <p>プログラムの先頭</p>
  <template v-for="(line, index) in code" :key="index">
    <expr-stmt v-if="line.cmd === 'expr'" :expr="line.expr" />
    <end-cmd v-if="line.cmd === 'end'" />
  </template>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Cmd } from "../types/Cmd";
import EndCmd from "./commands/EndCmd.vue";
import ExprStmt from "./commands/ExprStmt.vue";

export default defineComponent({
  name: "EditorView",
  components: {
    EndCmd,
    ExprStmt,
  },
  data: () => ({
    running: false,
  }),
  props: {
    code: Array as PropType<Cmd[]>,
  },
});
</script>
