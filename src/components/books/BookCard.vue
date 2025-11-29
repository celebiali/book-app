<template>
  <div class="book-card">
    <div class="cover-wrap">
      <img :src="imgSrc" alt="Book Cover" @error="onImgError" />
      <button class="fav-btn" @click="toggleFav" :aria-pressed="isFav">
        <FavoriteIcon v-if="isFav" />
        <UnFavoriteIcon v-else />
      </button>
    </div>
    <div class="content">
      <StatusBadge :variant="status" />
      <span class="title">{{ title ? title : "Unknown Title" }}</span>

      <div class="meta">
        <div class="meta-item">
          <UserIcon />
          <span class="meta-text">{{
            author ? author : "Unknown Author"
          }}</span>
        </div>
        <div class="meta-item">
          <DocumentIcon />
          <span class="meta-text">{{ pages ? pages : 0 }} Pages</span>
        </div>
      </div>
      <BaseButton
        width="100%"
        height="37px"
        :title="'Update info'"
        @click="openUpdateDialog"
      />
      <BaseButton
        style="margin-top: 8px"
        width="100%"
        height="37px"
        variant="outline"
        :title="isDeleting ? 'Deleting...' : 'Delete'"
        :disabled="isDeleting"
        @click="onDelete"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from "vue";
import { useBooksStore } from "@/stores/books";
import { useUiStore } from "@/stores/ui";
import StatusBadge from "@/components/books/StatusBadge.vue";
import FavoriteIcon from "@/components/icons/FavoriteIcon.vue";
import UnFavoriteIcon from "@/components/icons/UnFavoriteIcon.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import DocumentIcon from "@/components/icons/DocumentIcon.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import defaultCover from "@/assets/img/book_img.webp";

export default defineComponent({
  name: "BookCard",
  components: {
    StatusBadge,
    FavoriteIcon,
    UnFavoriteIcon,
    UserIcon,
    DocumentIcon,
    BaseButton,
  },
  props: {
    id: { type: [String, Number], required: false },
    coverSrc: { type: String, default: null },
    title: { type: String, default: "Book Title" },
    author: { type: String, default: "John Doe" },
    pages: { type: [String, Number], default: 115 },
    status: { type: String, default: "to_read" },
    favorite: { type: Boolean, default: false },
  },
  emits: ["update:favorite"],
  setup(props, { emit }) {
    const store = useBooksStore();
    const ui = useUiStore();
    const isFav = ref(props.favorite);
    const isDeleting = ref(false);
    watch(
      () => props.favorite,
      (v) => {
        isFav.value = v;
      }
    );
    function toggleFav() {
      if (props.id != null) {
        const newVal = !isFav.value;
        store.toggleFavoriteById(props.id, newVal);
        isFav.value = newVal;
        emit("update:favorite", isFav.value);
        return;
      }
      isFav.value = !isFav.value;
      emit("update:favorite", isFav.value);
    }

    function openUpdateDialog() {
      const payload = {
        id: props.id,
        title: props.title,
        author: props.author,
        pages: props.pages,
        status: props.status,
      };
      if (ui && typeof ui.setDialog === "function") {
        ui.setDialog("update-book", payload);
        return;
      }
      ui.dialogType = "update-book";
      ui.dialogPayload = payload;
      ui.dialogOpen = true;
    }

    async function onDelete() {
      if (isDeleting.value) return;
      if (props.id == null) return;
      isDeleting.value = true;
      try {
        const confirmMsg =
          "Bu kitabı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.";
        const confirmed =
          typeof window !== "undefined" ? window.confirm(confirmMsg) : true;
        if (!confirmed) return;

        const ok = store.removeBookById(props.id);
        if (ok) {
          if (ui && typeof ui.showSuccess === "function") {
            ui.showSuccess("Kitap silindi.");
          }
        }
      } catch (e) {
        console.warn("delete failed", e);
      } finally {
        setTimeout(() => {
          isDeleting.value = false;
        }, 120);
      }
    }

    const displayedCover = computed(() => {
      return props.coverSrc && props.coverSrc !== ""
        ? props.coverSrc
        : defaultCover;
    });

    const imgSrc = ref(displayedCover.value);
    watch(
      displayedCover,
      (v) => {
        imgSrc.value = v;
      },
      { immediate: true }
    );

    function onImgError() {
      if (imgSrc.value !== defaultCover) imgSrc.value = defaultCover;
    }

    return {
      isFav,
      toggleFav,
      openUpdateDialog,
      onDelete,
      isDeleting,
      displayedCover,
      imgSrc,
      onImgError,
    };
  },
});
</script>

<style scoped lang="scss">
.book-card {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid #64748b33;

  .cover-wrap {
    position: relative;

    img {
      width: 100%;
      height: 260px;
      object-fit: cover;
      display: block;
    }

    .fav-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.9);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(20, 27, 46, 0.08);
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    padding: 8px;

    .status-badge {
      display: inline-block;
      margin-bottom: 4px;
    }

    .title {
      margin: 0;
      font-weight: 700;
      color: $titleColor;
      font-family: $font-family-inter;
      font-weight: 700;
      font-size: $text-sm;
      line-height: 100%;
      letter-spacing: 0%;
      padding-top: 18px;
    }

    .meta {
      display: flex;
      align-items: center;
      padding-top: 12px;
      margin-bottom: 12px;
      justify-content: space-between;
      font-size: $text-sm;
      .meta-item {
        display: inline-flex;
        align-items: center;
        color: $thirdColor;
        .meta-text {
          font-family: $font-family-inter;
          font-weight: 500;
          font-size: $text-xs;
          font-style: Medium;
          line-height: 100%;
          letter-spacing: 0%;
          padding-left: 2px;
        }
      }
    }
  }
}
</style>
