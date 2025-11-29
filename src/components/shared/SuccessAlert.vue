<template>
  <div
    v-if="show"
    :class="['success-alert', { 'top-fixed': topFixed }]"
    role="status"
    aria-live="polite"
  >
    <div class="success-alert-inner">
      <SuccessIcon />
      <span class="message">Book has been successfully removed from list.</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SuccessIcon from "@/components/icons/SuccessIcon.vue";

export default defineComponent({
  name: "SuccessAlert",
  emits: ["close"],
  components: { SuccessIcon },
  props: {
    show: { type: Boolean, default: false },
    closable: { type: Boolean, default: true },
    topFixed: { type: Boolean, default: false },
  },
});
</script>

<style scoped lang="scss">
.success-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  background: $successBgColor; 
  color: $successTextColor; 
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: none;
  width: 100%;
  box-sizing: border-box;

  &.top-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    transform: none;
    width: 100vw; 
    z-index: 1400;
    border-radius: 0; 
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }

  .success-alert-inner {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    .message {
      font-family: $font-family-roboto;
      font-weight: 700;
      font-size: 15px;
      leading-trim: NONE;
      line-height: 100%;
      letter-spacing: 0%;
    }
  }

  .close {
    background: transparent;
    border: none;
    color: $successTextColor;
    cursor: pointer;
    font-size: $text-md;
    padding: 4px 8px;
  }
}
</style>