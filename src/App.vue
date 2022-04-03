<template>
  <v-app>
    <v-main id="main">
      <editor-view :code="code" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditorView from "./components/EditorView.vue";
import type { Cmd, ExprStmt } from "./types/Cmd";

export default defineComponent({
  name: "App",
  data: () => ({
    code: [
      {
        cmd: "expr",
        indent: 1,
        expr: {
          kw: "call",
          ref: {
            kind: "var",
            name: "print",
          },
          args: ["Hello, World."],
        },
      } as ExprStmt,
      {
        cmd: "end",
        indent: 1,
      } as Cmd,
    ],
  }),
  components: { EditorView },
});
</script>
<style scoped>
#main {
  margin-left: 20px;
  margin-top: 20px;
}
</style>
