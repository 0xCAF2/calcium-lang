<template>
  <add-new-cmd />
  <p>プログラムの終わり</p>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AddNewCmd from "../AddNewCmd.vue";

export default defineComponent({
  name: "EndCmd",
  components: { AddNewCmd },
});
</script>
