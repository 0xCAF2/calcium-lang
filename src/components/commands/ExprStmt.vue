<template>
  <add-new-cmd />
  <div>{{ expr }}</div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Expr } from "../../types/Expr";
import AddNewCmd from "../AddNewCmd.vue";

export default defineComponent({
  name: "ExprStmt",
  props: {
    expr: Object as PropType<Expr>,
  },
  components: { AddNewCmd },
});
</script>
