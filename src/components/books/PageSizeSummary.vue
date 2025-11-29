<template>
  <div class="list-footer-right">
    <div class="show-size">
      <div class="label">Show</div>
      <BaseDropdown
        :items="options.map((o) => ({ label: String(o), value: o }))"
        v-model="internalPageSize"
        :width="60"
        :height="40"
      />
    </div>
    <div class="summary">
      Showing {{ from }} to {{ to }} of {{ total }} entries
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import BaseDropdown from "@/components/shared/BaseDropdown.vue";
export default defineComponent({
  name: "PageSizeSummary",
  components: { BaseDropdown },
  props: {
    pageSize: { type: Number, default: 24 },
    from: { type: Number, default: 1 },
    to: { type: Number, default: 24 },
    total: { type: Number, default: 433 },
    options: { type: Array, default: () => [24, 72, 120] },
  },
  emits: ["update:pageSize"],
  setup(props, { emit }) {
    const internalPageSize = ref(props.pageSize);
    watch(
      () => props.pageSize,
      (v) => (internalPageSize.value = v)
    );
    watch(internalPageSize, (v) => emit("update:pageSize", v));
    return { internalPageSize };
  },
});
</script>

<style scoped lang="scss">
.list-footer-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: flex-end;
  font-family: $font-family-inter;
  font-weight: 400;
  font-style: Regular;
  font-size: $text-sm;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: right;
  flex-direction: column;
}
.page-size {
  height: 40px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e6e8eb;
}
.summary {
  color: $paginationTextColor;
  font-size: $text-sm;
}

.show-size {
  display: flex;
  align-items: center;
  gap: 8px;

  .label {
    font-family: $font-family-inter;
    font-weight: 400;
    font-style: Regular;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0%;
    color: $paginationTextColor;
  }
}
</style>