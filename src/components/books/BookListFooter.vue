<template>
  <div class="list-footer">
    <div class="list-footer-row">
      <div class="list-footer-col list-footer-col--left">
        <BulkActions :selected-count="selectedCount" />
      </div>

      <div class="list-footer-col list-footer-col--right">
        <PageSizeSummary
          :page-size="pageSize"
          :from="from"
          :to="to"
          :total="total"
          @update:pageSize="$emit('update:pageSize', $event)"
        />
      </div>
      <div class="list-footer-col list-footer-col--center">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change-page="$emit('change-page', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import BulkActions from "./BulkActions.vue";
import Pagination from "./Pagination.vue";
import PageSizeSummary from "./PageSizeSummary.vue";

export default defineComponent({
  name: "BookListFooter",
  components: { BulkActions, Pagination, PageSizeSummary },
  props: {
    selectedCount: { type: Number, default: 3 },
    currentPage: { type: Number, default: 1 },
    totalPages: { type: Number, default: 20 },
    pageSize: { type: Number, default: 100 },
    from: { type: Number, default: 1 },
    to: { type: Number, default: 100 },
    total: { type: Number, default: 433 },
  },
});
</script>

<style scoped lang="scss">
.list-footer {
  display: block;
  margin: 40px 0 60px;
  width: 100%;
}

.list-footer-row {
  display: flex;
  align-items: center; /* keep left/right vertically centered */
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  flex-wrap: wrap;
}

.list-footer-col {
  min-width: 0;
}
.list-footer-col--left {
  flex: 1 1 40%;
  order: 1;
}
.list-footer-col--center {
  /* make pagination span full width and sit below left/right */
  flex: 0 0 100%;
  order: 2;
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
.list-footer-col--right {
  flex: 1 1 40%;
  order: 1;
  display: flex;
  justify-content: flex-end;
}

.list-footer-col > * {
  min-width: 0;
}

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

.page-size {
  height: 40px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e6e8eb;
}
.summary {
  color: #8b9096;
  font-size: $text-sm;
}

@media (max-width: 900px) {
  .list-footer-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .list-footer-col--left,
  .list-footer-col--center,
  .list-footer-col--right {
    width: 100%;
    justify-content: flex-start;
  }
  .list-footer-col--center {
    display: flex;
    justify-content: center;
  }
  .list-footer-col--right > * {
    width: 100% !important;
  }
  .pagination {
    justify-content: center;
    overflow: auto;
  }
}

.pagination {
  justify-content: center;
  overflow: auto;
}

@media (max-width: 440px) {
  .pagination .page {
    min-width: 40px;
    height: 40px;
  }
}
</style>