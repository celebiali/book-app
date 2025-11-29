<template>
  <span
    class="status-badge"
    :class="variantClass"
    :style="customStyle"
    aria-hidden="false"
  >
    {{ displayText }}
  </span>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "StatusBadge",
  props: {
    variant: { type: String, default: "to_read" },
    color: { type: String, default: "" },
    textColor: { type: String, default: "" },
    small: { type: Boolean, default: false },
  },
  setup(props) {
    const displayText = computed(() => {
      const map = {
        to_read: "To Read",
        reading: "Reading",
        completed: "Completed",
      };
      return map[props.variant] || props.variant;
    });

    const variantClass = computed(() => `status-${props.variant}`);

    const customStyle = computed(() => {
      if (!props.color) return null;
      return {
        background: props.color,
        color: props.textColor || "#fff",
      };
    });

    return { displayText, variantClass, customStyle };
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/variables/_colors.scss";

.status-badge {
  display: inline-block;
  width: fit-content;
  border-radius: 8px;
  padding: 6px 10px;
  line-height: 1;
  white-space: nowrap;
  box-sizing: border-box;
  border: none;

  font-family: $font-family-inter;
  font-weight: 700;
  font-style: Bold;
  font-size: $text-sm;
  line-height: 100%;
  letter-spacing: 0%;
}

.status-badge.status-to_read {
  background: $toReadBtnBg;
  color: #fff;
}

.status-badge.status-reading {
  background: $readingBtnBg;
  color: #fff;
}

.status-badge.status-completed {
  background: $completedBtnBg;
  color: $completedBtnText;
}
.status-badge.small {
  padding: 4px 8px;
  font-size: $text-xs;
  font-weight: 600;
}
</style>