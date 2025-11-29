<template>
  <div class="update-book-form">
    <h3>Update book</h3>
    <p>Update the fields then press Save to update this book.</p>

    <BaseInput
      v-model="title"
      placeholder="Book title"
      width="100%"
      height="44px"
    />
    <BaseInput
      v-model="author"
      placeholder="Author"
      width="100%"
      height="44px"
    />
    <BaseInput
      v-model="pages"
      placeholder="Total number of pages"
      width="100%"
      height="44px"
    />
    <BaseDropdown :items="statusItems" v-model="status" />

    <div style="margin-top: 20px; display: flex; gap: 8px">
      <BaseButton
        title="Save"
        :width="'60%'"
        height="44px"
        :disabled="!dirty"
        @click="onSave"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch, computed } from "vue";
import { useUiStore } from "@/stores/ui";
import { useBooksStore } from "@/stores/books";
import BaseInput from "@/components/shared/BaseInput.vue";
import BaseDropdown from "@/components/shared/BaseDropdown.vue";
import BaseButton from "@/components/shared/BaseButton.vue";

export default defineComponent({
  name: "UpdateBookForm",
  components: { BaseInput, BaseDropdown, BaseButton },
  setup() {
    const ui = useUiStore();
    const books = useBooksStore();

    const title = ref("");
    const author = ref("");
    const pages = ref("");
    const readPages = ref("");
    const status = ref(null);

    function normalizeToUiStatus(val) {
      const s = (val || "").toString().toLowerCase();
      if (!s) return "to_read";
      if (s.includes("in progress") || s === "reading") return "reading";
      if (s.includes("completed") || s === "read") return "completed";
      return "to_read";
    }

    const statusItems = [
      { label: "To Read", value: "to_read" },
      { label: "Reading", value: "reading" },
      { label: "Completed", value: "completed" },
    ];

    watch(
      () => ui.dialogPayload,
      (p) => {
        if (!p) return;
        title.value = p.title || "";
        author.value = p.author || "";
        pages.value = p.pages || "";
        readPages.value = p.readPages || "";
        status.value = p.status
          ? normalizeToUiStatus(p.status)
          : normalizeToUiStatus(p.reading_status || p.status);
      },
      { immediate: true }
    );

    const dirty = computed(() => {
      const p = ui.dialogPayload || {};
      const originalStatus = normalizeToUiStatus(
        p.status || p.reading_status || ""
      );
      return (
        p.title !== title.value ||
        p.author !== author.value ||
        String(p.pages) !== String(pages.value) ||
        (p.readPages || "") !== (readPages.value || "") ||
        originalStatus !== status.value
      );
    });

    function closeDialog() {
      if (ui && typeof ui.clearDialog === "function") {
        ui.clearDialog();
        return;
      }
        ui.dialogOpen = false;
        ui.dialogType = null;
        ui.dialogPayload = null;
      
    }

    function onSave() {
      const p = ui.dialogPayload || {};
      if (!p || p.id == null) return;
      const changes = {
        title: title.value,
        author: author.value,
        total_pages: Number(pages.value) || 0,
        pages_read: Number(readPages.value) || 0,
        reading_status: status.value,
      };
      books.updateBook(p.id, changes);
      closeDialog();
    }

    function onCancel() {
      closeDialog();
    }

    return {
      title,
      author,
      pages,
      readPages,
      status,
      statusItems,
      dirty,
      onSave,
      onCancel,
    };
  },
});
</script>

<style scoped lang="scss">
.update-book-form > h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2f7;
  margin-top: 12px;
}

.update-book-form > p {
  margin: 20px 0 20px 0;
  color: #6b7280;
}

.update-book-form > * + * {
  margin-top: 16px;
}

.update-book-form .base-button.base-button-primary,
.update-book-form .base-button-primary,
.update-book-form .base-button[title="Update book"] {
  width: 100% !important;
  display: inline-flex;
  justify-content: center;
}

.update-book-form input,
.update-book-form select,
.update-book-form textarea {
  width: 100%;
  box-sizing: border-box;
}
</style>
