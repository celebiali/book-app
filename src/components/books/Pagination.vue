<template>
  <nav class="pagination" aria-label="Pagination">
    <button
      class="ctrl"
      @click="goTo(1)"
      :disabled="isFirst"
      :aria-disabled="isFirst"
    >
      <ChevronDoubleLeftIcon />
    </button>
    <button
      class="ctrl"
      @click="prev"
      :disabled="isFirst"
      :aria-disabled="isFirst"
    >
      <ChevronLeftIcon />
    </button>

    <button
      v-for="page in pagesToShow"
      :key="page"
      :class="['page', { active: page === currentPage }]"
      @click="goTo(page)"
    >
      {{ page }}
    </button>

    <button
      class="ctrl"
      @click="next"
      :disabled="isLast"
      :aria-disabled="isLast"
    >
      <ChevronRightIcon />
    </button>
    <button
      class="ctrl"
      @click="goTo(totalPages)"
      :disabled="isLast"
      :aria-disabled="isLast"
    >
      <ChevronDoubleRightIcon />
    </button>
  </nav>
</template>

<script>
import { defineComponent, computed } from "vue";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon.vue";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon.vue";
import ChevronDoubleLeftIcon from "@/components/icons/ChevronDoubleLeftIcon.vue";
import ChevronDoubleRightIcon from "@/components/icons/ChevronDoubleRightIcon.vue";

export default defineComponent({
  name: "ListPagination",
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
  },
  props: {
    currentPage: { type: Number, default: 1 },
    totalPages: { type: Number, default: 20 },
    maxPagesToShow: { type: Number, default: 7 },
  },
  emits: ["change-page"],
  setup(props, { emit }) {
    const pagesToShow = computed(() => {
      const pages = [];
      const half = Math.floor(props.maxPagesToShow / 2);
      let start = Math.max(1, props.currentPage - half);
      let end = Math.min(props.totalPages, start + props.maxPagesToShow - 1);
      if (end - start + 1 < props.maxPagesToShow) {
        start = Math.max(1, end - props.maxPagesToShow + 1);
      }
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    });

    const isFirst = computed(() => props.currentPage <= 1);
    const isLast = computed(() => props.currentPage >= props.totalPages);

    function goTo(page) {
      if (page === props.currentPage) return;
      if (page < 1 || page > props.totalPages) return;
      emit("change-page", page);
    }
    function prev() {
      if (props.currentPage > 1) emit("change-page", props.currentPage - 1);
    }
    function next() {
      if (props.currentPage < props.totalPages)
        emit("change-page", props.currentPage + 1);
    }

    return { pagesToShow, goTo, prev, next, isFirst, isLast };
  },
});
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pagination .ctrl {
  background: transparent;
  border: none;
  color: #8b9096;
  font-size: $text-xl;
  padding: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.pagination .ctrl:disabled {
  opacity: 0.38; 
  cursor: default;
  pointer-events: none;
}
.pagination .page {
  min-width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #e6e8eb;
  background: #fff;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
}
.pagination .page.active {
  background: #222;
  color: #fff;
  box-shadow: none;
  border: none;
}
</style>
