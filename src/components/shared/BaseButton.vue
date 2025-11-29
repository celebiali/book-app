<template>
  <button
    :class="['base-button', variantClass, { 'is-disabled': disabled }]"
    :style="buttonStyle"
    :disabled="disabled"
    @click="$emit('click')"
    type="button"
  >
    <slot>
      <span class="base-button-title">{{ title }}</span>
    </slot>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    title: { type: String, default: "" },
    variant: { type: String, default: "primary" },
    disabled: { type: Boolean, default: false },
    width: { type: [String, Number], default: "fit-content" },
    height: { type: [String, Number], default: "48px" },
  },
  computed: {
    computedWidth() {
      return typeof this.width === "number" ? this.width + "px" : this.width;
    },
    computedHeight() {
      return typeof this.height === "number" ? this.height + "px" : this.height;
    },
    buttonStyle() {
      const style = {
        width: this.computedWidth,
        height: this.computedHeight,
      };
      Object.keys(style).forEach(
        (k) => style[k] === undefined && delete style[k]
      );
      return style;
    },
    variantClass() {
      return `base-button-${this.variant}`;
    },
  },
};
</script>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 12px;
  font-family: $font-family-inter;
  font-size: $text-md;
  font-weight: 700;
  cursor: pointer;
  box-sizing: border-box;
  border: 2px solid $mainColor;

  &-title {
    font-size: $text-sm;
    color: inherit;
    line-height: 1;
  }

  &-primary {
    background: $mainColor;
    color: #fff;
    &:hover {
      background: $buttonHover;
      border: 2px solid $buttonHover;
    }
  }
  &-outline {
    background: white;
    color: $mainColor;
  }

  &.is-disabled {
    cursor: default;
    opacity: 1;
    &.base-button-primary {
      background: #e6e8eb;
      color: $paginationTextColor;
      border-color: #e6e8eb;
    }
    &.base-button-outline {
      background: white;
      color: $paginationTextColor;
      border-color: #e6e8eb;
    }
  }
}
</style>