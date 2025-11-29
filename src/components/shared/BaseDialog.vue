<template>
  <div v-if="isOpen" class="dialog-backdrop" @click.self="close">
    <div class="dialog-panel">
      <button class="dialog-close" @click="close">×</button>
      <div class="dialog-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useUiStore } from "@/stores/ui";

const ui = useUiStore();
const isOpen = computed(() => ui.dialogOpen);
function close() {
  ui.dialogOpen = false;
}
</script>

<style scoped lang="scss">
.dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 120;
}
.dialog-panel {
  background: #fff;
  border-radius: 12px;
  padding: 0 20px 20px 20px;
  max-width: calc(100% - 40px);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.6);
  position: relative;
}
.dialog-close {
  position: absolute;
  right: 20px;
  top: 20px;
  background: transparent;
  border: none;
  font-size: $text-xl;
  cursor: pointer;
}
.dialog-body {
  padding-top: 8px;
}
</style>
