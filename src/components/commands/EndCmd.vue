<template>
  <insert-above />
  <p>プログラムの終わり</p>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import InsertAbove from "../InsertAbove.vue";

export default defineComponent({
  name: "EndCmd",
  components: { InsertAbove },
});
</script>
