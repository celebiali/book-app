<template>
  <section class="about-page">
    <div class="about-hero">
      <div class="about-hero-inner">
        <div class="hero-left">
          <h1>About Bookapp</h1>
          <p class="hero-sub">
            A small demo to manage your reading list — search, paginate, add,
            favorite and track progress.
          </p>
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-num">{{ formattedBooksCount }}</div>
              <div class="stat-label">books in library</div>
            </div>
            <div class="stat">
              <div class="stat-num">{{ formattedPagesRead }}</div>
              <div class="stat-label">pages read</div>
            </div>
          </div>
          <div class="hero-actions">
            <BaseButton
              title="Go to Books"
              variant="primary"
              :width="160"
              @click="goToBooks"
            />
            <BaseButton
              title="Add book"
              variant="outline"
              :width="140"
              @click="openAddDialog"
            />
          </div>
        </div>
        <div class="hero-right">
          <div class="card">
            <h3>Quick overview</h3>
            <p>
              Bookapp helps you keep track of the books you want to read, are
              reading, or have finished. Your entries stay saved in your browser
              so you can return to them later.
            </p>
            <ul class="features">
              <li>Easily manage your reading list in one place</li>
              <li>Save book entries and continue whenever you like</li>
              <li>Mark favorites and track your progress</li>
              <li>Quickly find books using filters and search</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useBooksStore } from "@/stores/books";
import { useUiStore } from "@/stores/ui";
import BaseButton from "@/components/shared/BaseButton.vue";

export default defineComponent({
  name: "AboutPage",
  components: { BaseButton },
  setup() {
    const books = useBooksStore();
    const ui = useUiStore();

    const booksCount = computed(() => {
      const arr =
        books.books && books.books.value
          ? books.books.value
          : Array.isArray(books.books)
          ? books.books
          : books.raw && books.raw.value
          ? books.raw.value.map((b) => ({ id: b.id }))
          : [];
      return Array.isArray(arr) ? arr.length : 0;
    });

    const pagesRead = computed(() => {
      const rawArr =
        books.raw && books.raw.value
          ? books.raw.value
          : Array.isArray(books.raw)
          ? books.raw
          : [];
      return rawArr.reduce((sum, it) => sum + (Number(it.pages_read) || 0), 0);
    });

    const formattedBooksCount = computed(() => {
      return Number(booksCount.value || 0).toLocaleString();
    });

    const formattedPagesRead = computed(() => {
      return Number(pagesRead.value || 0).toLocaleString();
    });

    function goToBooks() {
      if (ui && typeof ui.setCurrentPage === "function")
        ui.setCurrentPage("books");
      else ui.currentPage = "books";
    }

    function openAddDialog() {
      if (ui && typeof ui.setDialog === "function")
        ui.setDialog("add-book", null);
      else {
        ui.dialogType = "add-book";
        ui.dialogOpen = true;
      }
    }

    return {
      booksCount,
      pagesRead,
      formattedBooksCount,
      formattedPagesRead,
      goToBooks,
      openAddDialog,
    };
  },
});
</script>

<style scoped lang="scss">
.about-page {
  .about-hero {
    background: linear-gradient(
      180deg,
      rgba(127, 72, 209, 0.06) 0%,
      rgba(127, 72, 209, 0.03) 100%
    );
    padding: 48px 24px;
    border-radius: 16px;
    margin: 20px clamp(16px, 6vw, 166px);
    min-height: 220px;
    box-shadow: 0 4px 28px rgba(127, 72, 209, 0.04);
  }
  .about-hero-inner {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
  }
  .hero-left {
    flex: 1 1 62%;
    height: 320px;
    h1 {
      margin: 0 0 6px 0;
      font-size: 34px;
      font-weight: 800;
      color: #0f172a;
    }
    .hero-sub {
      margin: 18px 0;
      color: #6b7280;
      max-width: 680px;
      font-size: $text-md;
    }
    .hero-stats {
      display: flex;
      gap: 14px;
      margin: 18px 0;
      align-items: center;
      .stat {
        background: #fff;
        padding: 14px 18px;
        border-radius: 12px;
        box-shadow: 0 8px 20px rgba(20, 27, 46, 0.04);
        .stat-num {
          font-weight: 800;
          font-size: 22px;
          color: #111827;
        }
        .stat-label {
          color: #6b7280;
          font-size: 13px;
        }
      }
    }
    .hero-actions {
      display: flex;
      gap: 12px;
      margin-top: 6px;
      align-items: center;

      @media (max-width: 500px) {
        flex-direction: column;
        align-items: stretch;
      }
    }
  }
  .hero-right {
    flex: 0 0 320px;
    .card {
      background: #fff;
      padding: 20px;
      border-radius: 14px;
      box-shadow: 0 12px 36px rgba(15, 23, 42, 0.06);
      h3 {
        margin: 0 0 8px 0;
      }
      p {
        color: #6b7280;
        margin: 0 0 12px 0;
      }
      .features {
        list-style: disc;
        padding-left: 18px;
        color: #374151;
      }
    }
  }
  .about-inner {
    max-width: 900px;
    margin: 24px auto;
    padding: 0 16px;
  }
  .howto {
    color: #374151;
  }
}

@media (max-width: 900px) {
  .about-hero-inner {
    flex-direction: column;
  }
  .hero-right {
    width: 100%;
  }
}
</style>