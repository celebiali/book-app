<template>
  <label ref="root" class="base-dropdown" :style="{ width: computedWidth }">
    <div
      class="base-dropdown-control"
      :style="{ height: computedHeight }"
      @click.stop="toggle"
      tabindex="0"
      @keydown.enter.prevent="toggle"
    >
      <span class="base-dropdown-placeholder">{{
        selectedLabel || placeholderText
      }}</span>
      <span class="base-dropdown-icon">▾</span>
    </div>

    <ul v-if="open" class="base-dropdown-menu">
      <li
        v-for="(item, index) in itemsList"
        :key="index"
        class="base-dropdown-item"
        :class="{ 'is-active': index === selectedIndex }"
        @click.stop="select(item, index)"
      >
        {{ itemLabel(item) }}
      </li>
    </ul>
  </label>
</template>

<script>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  defineComponent,
} from "vue";

export default defineComponent({
  name: "BaseDropdown",
  props: {
    width: { type: [String, Number], default: "100%" },
    height: { type: [String, Number], default: "40px" },
    items: { type: Array, default: () => [] },
    modelValue: { type: [String, Number, Object], default: null },
    placeholder: { type: String, default: "Select" },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const root = ref(null);
    const open = ref(false);
    const selectedIndex = ref(-1);

    const computedWidth = computed(() =>
      typeof props.width === "number" ? props.width + "px" : props.width
    );
    const computedHeight = computed(() =>
      typeof props.height === "number" ? props.height + "px" : props.height
    );

    function itemLabel(item) {
      return item && typeof item === "object" && "label" in item
        ? item.label
        : item;
    }

    const selectedLabel = computed(() => {
      if (props.modelValue === null || props.modelValue === undefined)
        return "";
      const foundIndex = props.items.findIndex((it) =>
        typeof it === "object"
          ? it.value === props.modelValue
          : it === props.modelValue
      );
      return foundIndex > -1 ? itemLabel(props.items[foundIndex]) : "";
    });

    function syncSelectedIndex(value, items) {
      const found = (items || props.items).findIndex((it) =>
        typeof it === "object" ? it.value === value : it === value
      );
      selectedIndex.value = found;
    }

    watch(
      () => props.modelValue,
      (newVal) => syncSelectedIndex(newVal, props.items),
      { immediate: true }
    );

    watch(
      () => props.items,
      (newItems) => syncSelectedIndex(props.modelValue, newItems),
      { immediate: true }
    );

    function toggle() {
      open.value = !open.value;
    }

    function select(item, idx) {
      const value =
        typeof item === "object" && "value" in item ? item.value : item;
      selectedIndex.value = idx;
      emit("update:modelValue", value);
      emit("change", item);
      open.value = false;
    }

    function onDocClick(e) {
      if (!root.value) return;
      if (!root.value.contains(e.target)) open.value = false;
    }

    onMounted(() => document.addEventListener("click", onDocClick));
    onBeforeUnmount(() => document.removeEventListener("click", onDocClick));

    return {
      root,
      open,
      selectedIndex,
      computedWidth,
      computedHeight,
      itemLabel,
      selectedLabel,
      toggle,
      select,
      itemsList: props.items,
      placeholderText: props.placeholder,
    };
  },
});
</script>

<style scoped lang="scss">
@import "@/assets/variables/_colors.scss";

.base-dropdown {
  display: block;
  position: relative;
  width: 100%;
  max-width: 460px;

  &-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
    height: 40px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    background: #fff;
    color: $textColor;
    box-sizing: border-box;
    cursor: pointer;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;

    &:focus {
      outline: none;
      border-color: $mainColor;
      box-shadow: 0 6px 18px rgba(127, 72, 209, 0.08);
    }
  }

  &-placeholder {
    color: $placeholderTextColor;
  }

  &-icon {
    color: $iconColor;
    margin-left: 8px;
  }

  &-menu {
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 8px;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(20, 27, 46, 0.08);
    z-index: 40;
    overflow: hidden;
    list-style: none;
    padding: 8px 0;
  }

  &-item {
    padding: 12px 16px;
    color: $textColor;
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease;

    &:hover {
      background: $dropdownHoverBg; 
      color: $mainColor;
    }

    &.is-active {
      background: $secondaryColor;
      color: $mainColor;
      font-weight: 600;
    }
  }
}
</style>