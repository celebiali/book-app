<template>
  <div class="favorite-card">
    <div class="favorite-card-header">
      <div class="favorite-card-header-title">Favorite Books</div>
      <div class="favorite-card-header-actions" v-if="books.length > 0">
        <a class="view-all" href="#">View All ({{ books.length }})</a>
        <div class="pager">
          <button
            :disabled="books.length === 0"
            class="arrow"
            aria-label="previous"
            @click="scrollPrev"
          >
            <LeftIcon />
          </button>
          <button
            :disabled="books.length === 0"
            class="arrow"
            aria-label="next"
            @click="scrollNext"
          >
            <RightIcon />
          </button>
        </div>
      </div>
    </div>

    <div class="favorite-card-section">
      <div class="favorite-card-section-text">{{ description }}</div>
      <div class="favorite-card-section-content">
        <div class="pager pager-mobile">
          <button class="arrow" aria-label="previous" @click="scrollPrev">
            <LeftIcon />
          </button>
          <button class="arrow" aria-label="next" @click="scrollNext">
            <RightIcon />
          </button>
        </div>

        <div ref="scrollRef" class="scroll-area">
          <FavoriteBook
            v-for="(b, idx) in books"
            :key="b.id || idx"
            :id="b.id"
            :cover="b.cover"
            :title="b.title"
            :author="b.author"
            :pages="b.pages"
            :status="b.status"
            :is-fav="b.isFav"
            :percent="b.percent"
            @toggle="() => toggleFav(b.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import FavoriteBook from "./FavoriteBook.vue";
import LeftIcon from "@/components/icons/LeftIcon.vue";
import RightIcon from "@/components/icons/RightIcon.vue";
import { useBooksStore } from "@/stores/books";

export default defineComponent({
  name: "FavoriteCard",
  components: { FavoriteBook, LeftIcon, RightIcon },
  props: { coverSrc: { type: String, default: "" } },
  setup() {
    const description = ref(
      `When Maya’s brother decides to get married in Taormina, she and Conor end up stuck together in a romantic Sicilian villa for over a week. There, on the beautiful Ionian coast, between ancient ruins, delicious foods, and natural caves, Maya realizes that Conor might be hiding something from her. And as the destination wedding begins to erupt out of control, she decides that a summer fling might be just what she needs—even if it’s a problematic one.`
    );

    const store = useBooksStore();

    const books = computed(() => {
      const normalized =
        store.books && store.books.value
          ? store.books.value
          : Array.isArray(store.books)
          ? store.books
          : [];
      const rawArr =
        store.raw && store.raw.value
          ? store.raw.value
          : Array.isArray(store.raw)
          ? store.raw
          : [];

      const source =
        normalized && normalized.length
          ? normalized
          : rawArr.map((r) => ({
              id: r.id,
              coverSrc: r.image || r.coverSrc || null,
              title: r.title,
              author: r.author,
              pages: r.total_pages || r.pages || 0,
              status:
                r.reading_status === "In Progress"
                  ? "reading"
                  : r.reading_status === "Completed"
                  ? "read"
                  : "to_read",
              favorite: !!r.favorite,
              pages_read: r.pages_read || 0,
            }));

      return source
        .filter((b) => !!b.favorite)
        .map((b) => ({
          id: b.id,
          cover: b.coverSrc || b.image || null,
          title: b.title,
          author: b.author,
          pages: b.pages || 0,
          status: b.status || "to_read",
          isFav: !!b.favorite,
          percent:
            b.status === "reading" && b.pages
              ? `${Math.round(((b.pages_read || 0) / b.pages) * 100)}%`
              : "",
        }));
    });

    const overallPercent = computed(() => {
      const p = books.value.find((b) => b.status === "reading");
      return (p && p.percent) || "";
    });

    function toggleFav(id) {
      if (id == null) return;
      store.toggleFavoriteById(id, false);
    }

    const scrollRef = ref(null);

    function scrollToChild(child, vertical) {
      if (!child || !scrollRef.value) return;
      if (vertical) {
        scrollRef.value.scrollTo({ top: child.offsetTop, behavior: "smooth" });
      } else {
        scrollRef.value.scrollTo({
          left: child.offsetLeft,
          behavior: "smooth",
        });
      }
    }

    function scrollNext() {
      const el = scrollRef.value;
      if (!el) return;
      const style = getComputedStyle(el);
      const vertical =
        style.flexDirection.startsWith("column") ||
        window.matchMedia("(max-width: 980px)").matches;
      if (vertical) {
        const children = Array.from(el.children);
        const current = el.scrollTop;
        const next = children.find((c) => c.offsetTop > current + 5);
        if (next) scrollToChild(next, true);
        else el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 363, behavior: "smooth" });
      }
    }

    function scrollPrev() {
      const el = scrollRef.value;
      if (!el) return;
      const style = getComputedStyle(el);
      const vertical =
        style.flexDirection.startsWith("column") ||
        window.matchMedia("(max-width: 980px)").matches;
      if (vertical) {
        const children = Array.from(el.children);
        const current = el.scrollTop;
        const prev = children
          .slice()
          .reverse()
          .find((c) => c.offsetTop < current - 5);
        if (prev) scrollToChild(prev, true);
        else el.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: -363, behavior: "smooth" });
      }
    }

    return {
      description,
      books,
      toggleFav,
      scrollRef,
      scrollNext,
      scrollPrev,
      overallPercent,
    };
  },
});
</script>

<style scoped lang="scss">
.favorite-card {
  margin: 20px clamp(16px, 6vw, 166px) 0 clamp(16px, 6vw, 166px);
  padding: 36px;
  border: 1px solid rgba(20, 27, 46, 0.04);
  background-color: #f7f9fb;
  border-radius: 18px;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-title {
      color: #111827;
      font-family: $font-family-inter;
      font-weight: 700;
      font-size: 28px;
      line-height: 1;
    }

    &-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  &-section {
    margin-top: 20px;
    display: flex;
    gap: 24px;
    align-items: stretch;

    &-text {
      font-size: $text-md;
      color: #6b7280;
      font-family: $font-family-inter;
      line-height: 1.8;
      font-weight: 400;
      width: 100%;
    }

    &-content {
      display: flex;
      gap: 36px;
      align-items: flex-start;
      justify-content: center;

      .fav-book {
        display: flex;
        gap: 18px;
        align-items: flex-start;
        min-width: 360px;
        height: 100%;
      }

      .cover-wrap {
        position: relative;
        width: 160px;
        flex: 0 0 160px;

        img {
          width: 160px;
          height: 260px;
          object-fit: cover;
          display: block;
        }

        .fav-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(20, 27, 46, 0.06);
        }
      }

      .meta {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: flex-start;
        justify-content: center;
      }

      .book-title {
        margin: 0;
        font-size: $text-lg;
        font-weight: 700;
        color: #111827;
      }
      .meta-line {
        color: #6b7280;
        display: flex;
        gap: 14px;
        align-items: center;
        font-size: $text-sm;
      }
      .btn.update {
        background: #7f48d1;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 700;
      }
    }

    &-extra {
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;

      .percent {
        font-size: $text-xl;
        font-weight: 700;
        color: #111827;
      }
    }
  }

  .view-all {
    color: $textColor;
    text-decoration: none;
    font-family: $font-family-inter;
    font-weight: 400;
    font-style: Regular;
    font-size: $text-md;
    line-height: 100%;
    letter-spacing: 0px;
  }
  .pager {
    display: flex;
    gap: 8px;
  }
  .arrow {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(20, 27, 46, 0.08);
    background: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: $text-lg;
  }
  .arrow:hover {
    background: #ebeff1;
  }

  .scroll-area {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 8px;
    align-items: stretch;

    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }

    max-width: 720px;
    @media (max-width: 1400px) {
      max-width: 360px;
    }

    @media (max-width: 980px) {
      max-width: 100%;
    }
  }

  .scroll-area > * {
    flex: 0 0 auto;
    min-width: 360px;
    height: 100%;
  }

  @media (max-width: 1200px) {
    &-section {
      grid-template-columns: 1fr 520px 100px;
      gap: 18px;
    }
    .cover-wrap img {
      width: 140px;
      height: 220px;
    }
  }

  @media (max-width: 980px) {
    padding: 24px;
    &-section {
      grid-template-columns: 1fr;
    }
    &-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
    &-section {
      gap: 16px;
    }
    &-content {
      flex-direction: column;
      gap: 18px;
      align-items: stretch;
    }
    .favorite-card-section-extra {
      justify-content: flex-start;
    }
    .cover-wrap img {
      width: 140px;
      height: 200px;
    }
    .btn.update {
      width: 100%;
    }

    &-section {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .favorite-card-section-text {
      order: 1;
    }

    .favorite-card-section-content {
      order: 2;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }

    .favorite-card-header-actions .pager {
      display: none;
    }

    .pager-mobile {
      display: flex;
      justify-content: space-between;
      width: 100%;
      gap: 8px;
      margin-bottom: 6px;
    }

    .scroll-area {
      display: flex;
      gap: 18px;
      overflow-x: auto;
      padding-bottom: 8px;
      align-items: stretch;

      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }

    .scroll-area > * {
      flex: 0 0 auto;
      min-width: 360px;
      height: 100%;
    }
  }

  .pager-mobile {
    display: none;
  }

  @media (max-width: 640px) {
    margin: 12px 12px 0 12px;
    padding: 16px;
    &-header &-title {
      font-size: $text-xl;
    }
    &-section-text {
      font-size: 15px;
      line-height: 1.6;
    }
    .cover-wrap img {
      width: 120px;
      height: 170px;
    }
    .favorite-card-section-content {
      gap: 14px;
    }
    .meta-line {
      font-size: 13px;
      gap: 10px;
    }
    .pager .arrow {
      width: 36px;
      height: 36px;
    }
  }
}
</style>
