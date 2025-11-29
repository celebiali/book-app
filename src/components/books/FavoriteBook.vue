<template>
  <div class="fav-book">
    <div class="cover-wrap">
      <img :src="imgSrc" :alt="title" @error="onImgError" />
      <button
        class="fav-btn"
        @click="toggle"
        :aria-pressed="isFav"
        :aria-label="isFav ? 'remove favorite' : 'add favorite'"
      >
        <FavoriteIcon v-if="isFav" />
        <UnFavoriteIcon v-else />
      </button>
    </div>

    <div class="meta">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <StatusBadge :variant="status" />
        <div v-if="status === 'reading' && percent" class="book-percent">
          {{ percent }}
        </div>
      </div>

      <h4 class="book-title">{{ title }}</h4>
      <div class="meta-line">
        <span class="author"><UserIcon /> {{ author }}</span>
        <span class="pages"><DocumentIcon /> {{ pages }} Pages</span>
      </div>
      <BaseButton
        :width="'100%'"
        :height="'37px'"
        title="Update info"
        @click="openUpdateDialog"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useBooksStore } from "@/stores/books";
import StatusBadge from "@/components/books/StatusBadge.vue";
import FavoriteIcon from "@/components/icons/FavoriteIcon.vue";
import UnFavoriteIcon from "@/components/icons/UnFavoriteIcon.vue";
import UserIcon from "@/components/icons/UserIcon.vue";
import DocumentIcon from "@/components/icons/DocumentIcon.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import defaultCover from "@/assets/img/book_img.png";
import { useUiStore } from "@/stores/ui";

export default defineComponent({
  name: "FavoriteBook",
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
    cover: { type: String, default: null },
    title: { type: String, default: "Book Title" },
    author: { type: String, default: "John Doe" },
    pages: { type: [String, Number], default: 115 },
    status: { type: String, default: "to_read" },
    isFav: { type: Boolean, default: false },
    percent: { type: [String, Number], default: "" },
  },
  emits: ["toggle"],
  setup(props, { emit }) {
    const store = useBooksStore();
    const ui = useUiStore();

    const imgSrc = ref(props.cover || defaultCover);
    watch(
      () => props.cover,
      (v) => {
        imgSrc.value = v || defaultCover;
      }
    );

    function openUpdateDialog() {
      console.log("openUpdateDialog called");
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

    function toggle() {
      if (props.id != null) {
        const newVal = !props.isFav;
        store.toggleFavoriteById(props.id, newVal);
        emit("toggle", props.id);
        emit("update:favorite", newVal);
        return;
      }
      emit("toggle");
    }
    function onImgError() {
      if (imgSrc.value !== defaultCover) imgSrc.value = defaultCover;
    }
    return { toggle, imgSrc, onImgError, openUpdateDialog };
  },
});
</script>

<style scoped lang="scss">
.fav-book {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  width: 320px;
  position: relative;
  padding: 12px 8px;
  box-sizing: border-box;
  border-radius: 8px;
}

.cover-wrap {
  position: relative;
  flex: 0 0 160px;
}
.cover-wrap img {
  width: 160px;
  height: 260px;
  object-fit: cover;
  display: block;
}

.fav-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(20, 27, 46, 0.06);
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 auto;
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
  gap: 12px;
  align-items: center;
  font-size: $text-sm;
}

.book-percent {
  margin-left: 8px;
  align-self: flex-start;
  font-size: $text-md;
  font-weight: 700;
  color: #111827;
  white-space: nowrap;
}

@media (max-width: 980px) {
  .fav-book {
    width: 100%;
    padding: 8px 0;
    border: none;
    background: transparent;
  }
  .cover-wrap img {
    width: 140px;
    height: 220px;
  }
}

@media (max-width: 640px) {
  .cover-wrap img {
    width: 170px;
    height: 170px;
  }
}
</style>