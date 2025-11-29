<template>
  <div class="books-container">
    <div class="book-list">
      <div class="book-list-title">Books</div>
      <div class="book-list-search">
        <BaseInput
          v-model="inputValue"
          :width="350"
          :height="44"
          placeholder="Search"
          type="search"
        />
        <BaseDropdown
          :items="statusDropdownItems"
          v-model="selectedStatus"
          :width="200"
          :height="44"
          placeholder="Reading status"
        />
      </div>
    </div>
    <div
      v-if="filteredCount > 0"
      :class="[
        'book-cards',
        { 'book-cards--justify-start': filteredCount < 6 },
      ]"
    >
      <BookCard
        v-for="(book, idx) in pagedBooks"
        :key="book.id || idx"
        :id="book.id"
        :cover-src="book.coverSrc"
        :title="book.title"
        :author="book.author"
        :pages="book.pages"
        :status="book.status"
        :favorite="book.favorite"
        @update:favorite="(val) => toggleFav(book.id, val)"
      />
    </div>

    <div v-else class="empty-state">
      <EmptyPageIcon />
      <div class="empty-state-text">
        No search results for
        <span class="empty-state-text-span">“Autonomous forklifts”</span>
      </div>
      <div class="empty-state-text-secondary">
        Make sure all words are spelled correctly.
      </div>
    </div>

    <BookListFooter
      v-if="filteredCount > 0"
      :selected-count="selectedCount"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-size="pageSize"
      :from="from"
      :to="to"
      :total="total"
      @change-page="onChangePage"
      @update:pageSize="onUpdatePageSize"
    />
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import BookCard from "@/components/books/BookCard.vue";
import BaseInput from "@/components/shared/BaseInput.vue";
import BaseDropdown from "@/components/shared/BaseDropdown.vue";
import BookListFooter from "./BookListFooter.vue";
import EmptyPageIcon from "@/components/icons/EmptyPageIcon.vue";
import { useBooksStore } from "@/stores/books";

export default defineComponent({
  name: "BookList",
  components: {
    BookCard,
    BaseInput,
    BaseDropdown,
    BookListFooter,
    EmptyPageIcon,
  },
  setup() {
    const inputValue = ref("");
    const selectedStatus = ref("all");
    const statusDropdownItems = [
      { label: "All", value: "all" },
      { label: "To Read", value: "to_read" },
      { label: "Reading", value: "reading" },
      { label: "Completed", value: "completed" },
    ];

    const store = useBooksStore();

    if (!store.books || !store.books.value || store.books.value.length === 0) {
      store.reloadFromStorage();
    }

    const books = computed(() => {
      const normalized =
        store.books && store.books.value
          ? store.books.value
          : Array.isArray(store.books)
          ? store.books
          : [];
      if (normalized && normalized.length) return normalized;

      const rawArr =
        store.raw && store.raw.value
          ? store.raw.value
          : Array.isArray(store.raw)
          ? store.raw
          : [];
      return rawArr.map((r) => ({
        id: r.id,
        coverSrc: r.image || r.coverSrc || null,
        title: r.title,
        author: r.author,
        pages: r.total_pages || r.pages || 0,
        status: (() => {
          const rs = (r.reading_status || "").toString().toLowerCase();
          if (rs === "in progress" || rs === "reading") return "reading";
          if (rs === "completed" || rs === "read") return "completed";
          return "to_read";
        })(),
        favorite: !!r.favorite,
      }));
    });

    const booksCount = computed(() => (books.value ? books.value.length : 0));

    const currentPage = ref(1);
    const pageSize = ref(24);

    const filteredBooks = computed(() => {
      const q = (inputValue.value || "").trim().toLowerCase();
      const status = selectedStatus.value || "all";
      const src = books.value || [];
      let out = src.slice();
      if (q) {
        out = out.filter((b) => {
          const title = (b.title || "").toLowerCase();
          const author = (b.author || "").toLowerCase();
          return title.includes(q) || author.includes(q);
        });
      }
      if (status && status !== "all") {
        out = out.filter((b) => (b.status || "to_read") === status);
      }
      return out;
    });

    const filteredCount = computed(() =>
      filteredBooks.value ? filteredBooks.value.length : 0
    );

    const total = computed(() => filteredCount.value);

    const totalPages = computed(() =>
      Math.max(1, Math.ceil(total.value / pageSize.value))
    );

    const from = computed(() =>
      filteredCount.value === 0
        ? 0
        : (currentPage.value - 1) * pageSize.value + 1
    );
    const to = computed(() =>
      Math.min(total.value, currentPage.value * pageSize.value)
    );

    const pagedBooks = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return filteredBooks.value.slice(start, start + pageSize.value);
    });

    function onChangePage(page) {
      currentPage.value = page;
    }
    function onUpdatePageSize(size) {
      pageSize.value = size;
      currentPage.value = 1;
    }

    watch(filteredCount, (val) => {
      if (val === 0) {
        currentPage.value = 1;
      }
    });

    watch(totalPages, (newVal) => {
      if (currentPage.value > newVal) {
        currentPage.value = 1;
      }
    });

    const selectedCount = ref(3);

    function toggleFav(id, val) {
      store.toggleFavoriteById(id, val);
    }

    function addBook(raw) {
      return store.addBook(raw);
    }

    return {
      inputValue,
      statusDropdownItems,
      selectedStatus,
      currentPage,
      totalPages,
      pageSize,
      from,
      to,
      total,
      selectedCount,
      books,
      booksCount,
      filteredBooks,
      filteredCount,
      pagedBooks,
      toggleFav,
      onChangePage,
      onUpdatePageSize,
      addBook,
    };
  },
});
</script>

<style scoped lang="scss">
.books-container {
  margin: 20px clamp(16px, 6vw, 166px) 0 clamp(16px, 6vw, 166px);
}

.book-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 60px;
  margin-bottom: 20px;
  &-title {
    font-size: $text-3xl;
    font-family: $font-family-inter;
    font-weight: 700;
    leading-trim: NONE;
    line-height: 100%;
    letter-spacing: 0px;
  }
  &-search {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 0 0 auto;
  }
}

.book-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 28px;
  align-items: start;
  width: 100%;
}

.book-cards.book-cards--justify-start {
  justify-content: flex-start;
}

.book-cards > * {
  width: 200px;
  margin-bottom: 28px;
}

@media (max-width: 520px) {
  .book-cards {
    justify-content: flex-start;
    gap: 18px;
  }
  .book-cards > * {
    width: 100%;
    margin-bottom: 18px;
  }
}

.book-cards > * {
  justify-self: flex-start;
  width: 200px;
  @media (max-width: 520px) {
    width: 100%;
  }
}

.list-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 40px 0 60px;
}
.list-footer-left {
  flex: 1;
}
.list-footer-center {
  flex: 1;
  display: flex;
  justify-content: center;
}
.list-footer-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;

  &-text {
    margin-top: 18px;
    color: $titleColor;
    font-size: $text-md;
    text-align: center;
    font-family: $font-family-inter;
    font-weight: 400;
    font-style: Regular;
    font-size: $text-md;
    line-height: 100%;
    letter-spacing: 0%;
    text-align: center;

    &-span {
      font-weight: 600;
      color: $titleColor;
    }

    &-secondary {
      margin-top: 20px;
      color: $textColor;
      font-size: $text-sm;
      text-align: center;
      font-family: $font-family-inter;
      font-weight: 400;
      font-size: 15px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: center;
    }
  }
}
.empty-state .empty-text {
  margin-top: 18px;
  color: #8b9096;
  font-size: $text-md;
}

.empty-state-icon {
  display: block;
  margin: 0 auto;
  opacity: 0.6;
  height: 200px;
}

@media (max-width: 900px) {
  .book-list {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .book-list .book-list-title {
    order: 1;
  }
  .book-list .book-list-search {
    order: 2;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .book-list .book-list-search > * {
    width: 100% !important;
    max-width: 100% !important;
  }

  .list-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .list-footer-left,
  .list-footer-center,
  .list-footer-right {
    justify-content: flex-start;
  }
  .list-footer-center {
    order: 2;
  }
  .list-footer-right {
    order: 3;
  }
}

@media (max-width: 520px) {
  .book-cards {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .books-container {
    margin: 16px 12px 0 12px;
  }
}

@media (min-width: 900px) and (max-width: 1199px) {
  .book-cards {
    gap: 22px;
  }
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
  .pagination {
    justify-content: flex-start;
    overflow: auto;
  }
}
</style>