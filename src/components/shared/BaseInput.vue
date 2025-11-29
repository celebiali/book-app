<template>
  <label
    class="base-input"
    :class="{ 'base-input--search': type === 'search' }"
    :style="{ width: computedWidth }"
  >
    <div class="base-input-field">
      <span v-if="type === 'search'" class="base-input-field-icon">
        <SearchIcon />
      </span>
      <input
        class="base-input-field-control"
        :type="type"
        :value="modelValue"
        @input="onInput"
        :style="{ height: computedHeight }"
        :placeholder="placeholder"
      />
    </div>
  </label>
</template>

<script>
import { computed, defineComponent } from "vue";
import SearchIcon from "@/components/icons/SearchIcon.vue";

export default defineComponent({
  name: "BaseInput",
  components: { SearchIcon },
  props: {
    modelValue: { type: [String, Number], default: "" },
    width: { type: [String, Number], default: "100%" },
    height: { type: [String, Number], default: "40px" },
    placeholder: { type: String, default: "" },
    type: { type: String, default: "text" },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const computedWidth = computed(() =>
      typeof props.width === "number" ? props.width + "px" : props.width
    );
    const computedHeight = computed(() =>
      typeof props.height === "number" ? props.height + "px" : props.height
    );
    function onInput(e) {
      const target = e.target;
      emit("update:modelValue", target.value);
    }
    return {
      computedWidth,
      computedHeight,
      onInput,
    };
  },
});
</script>

<style scoped lang="scss">
.base-input {
  display: block;
  width: 100%;
  max-width: 460px;

  &-field {
    position: relative;
    display: flex;
    align-items: center;
    color: $textColor !important;
  }

  &-field-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: $textColor;
    pointer-events: none;
  }

  &-field-control {
    width: 100%;
    padding: 10px 12px;
    padding-left: 12px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    font-size: $text-sm;
    color: $textColor;
    background: #fff;
    box-sizing: border-box;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;

    &::placeholder {
      color: $placeholderTextColor;
    }
    &::-webkit-input-placeholder {
      color: $placeholderTextColor;
    }
    &::-moz-placeholder {
      color: $placeholderTextColor;
    }
    &:-ms-input-placeholder {
      color: $placeholderTextColor;
    }

    &:focus {
      outline: none;
      border-color: $mainColor;
      box-shadow: 0 6px 18px rgba(127, 72, 209, 0.08);
    }
  }

  &--search &-field-control {
    padding-left: 44px;
  }
}
</style>