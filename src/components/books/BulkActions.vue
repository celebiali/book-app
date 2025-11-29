<template>
  <div class="list-footer-left">
    <div class="bulk-actions">
      <BaseDropdown
        :items="options"
        v-model="selectedAction"
        :width="210"
        :height="44"
        placeholder="Bulk actions"
      />
      <span class="apply" @click="apply">Apply</span>
      <span class="selected-count">Selected {{ selectedCount }} entries</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import BaseDropdown from "@/components/shared/BaseDropdown.vue";
export default defineComponent({
  name: "BulkActions",
  components: { BaseDropdown },
  props: { selectedCount: { type: Number, default: 0 } },
  emits: ["apply"],
  setup(_, { emit }) {
    const options = ref([
      { label: "Mark as Read", value: "mark_read" },
      { label: "Add to Favorites", value: "add_fav" },
      { label: "Remove", value: "remove" },
    ]);
    const selectedAction = ref(null);
    function apply() {
      emit("apply", selectedAction.value);
    }
    return { options, selectedAction, apply };
  },
});
</script>

<style scoped lang="scss">
.list-footer-left {
  flex: 1;
}
.bulk-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bulk-select {
  height: 40px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e6e8eb;
  background: #fff;
}
.apply {
  font-family: $font-family-roboto;
  font-weight: 700;
  font-style: Bold;
  font-size: $text-sm;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  color: #d5d9e3;
  border: 1px solid #d5d9e3;
  padding: 12px 14px;
  border-radius: 8px;
}
.selected-count {
  color: $paginationTextColor;
  margin-left: 6px;
  font-family: $font-family-roboto;
  font-weight: 400;
  font-size: $text-sm;
  line-height: 100%;
  letter-spacing: 0%;
}
</style>