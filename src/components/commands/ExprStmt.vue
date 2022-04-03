<template>
  <insert-above />
  <div>{{ expr }}</div>
</template>
<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Expr } from "../../types/Expr";
import InsertAbove from "../InsertAbove.vue";

export default defineComponent({
  name: "ExprStmt",
  props: {
    expr: Object as PropType<Expr>,
  },
  components: { InsertAbove },
});
</script>
