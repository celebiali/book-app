<template>
  <div class="add-book-form">
    <h3>Book entry form</h3>
    <p>Fill out the fields below to add a new book to the library system.</p>

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
    <BaseInput
      v-model="readPages"
      placeholder="Number of pages read"
      width="100%"
      height="44px"
    />

    <div class="image-upload">
      <label class="base-input" :style="{ width: '100%' }">
        <div class="base-input-field">
          <span
            class="base-input-field-control file-control"
            @click.prevent="triggerFileInput"
          >
            <button type="button" class="file-choose">Dosya Seç</button>
            <span class="file-name">{{ fileName || "Dosya seçilmedi" }}</span>
          </span>
          <input
            ref="fileInput"
            class="visually-hidden"
            type="file"
            accept="image/*"
            @change="onFileChange"
          />
        </div>
      </label>
    </div>
    <div style="margin-top: 12px">
      <BaseButton
        title="Add book"
        :width="'100%'"
        height="44px"
        :disabled="!canSubmit"
        @click="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { useUiStore } from "@/stores/ui";
import BaseInput from "@/components/shared/BaseInput.vue";
import BaseDropdown from "@/components/shared/BaseDropdown.vue";
import BaseButton from "@/components/shared/BaseButton.vue";

export default defineComponent({
  name: "AddBookForm",
  components: { BaseInput, BaseDropdown, BaseButton },
  setup(_, { emit }) {
    const ui = useUiStore();
    const title = ref("");
    const fileInput = ref(null);
    const fileName = ref("");
    const author = ref("");
    const pages = ref("");
    const readPages = ref("");
    const status = ref(null);

    const statusItems = [
      { label: "To Read", value: "to_read" },
      { label: "Reading", value: "reading" },
      { label: "Completed", value: "completed" },
    ];

    const canSubmit = computed(() => (title.value || "").trim().length > 0);

    // image handling
    const imageFile = ref(null);
    const imagePreview = ref("");
    const imageWebpData = ref(null);

    function readFileAsDataURL(file) {
      return new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
    }

    function convertImageToWebp(file, maxWidth = 600, quality = 0.8) {
      return readFileAsDataURL(file).then(
        (dataUrl) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              // calculate target size while preserving aspect ratio
              const ratio = img.width / img.height;
              let targetWidth = img.width;
              let targetHeight = img.height;
              if (maxWidth && img.width > maxWidth) {
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth / ratio);
              }
              const canvas = document.createElement("canvas");
              canvas.width = targetWidth;
              canvas.height = targetHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
              // convert to webp
              try {
                const webpDataUrl = canvas.toDataURL("image/webp", quality);
                resolve(webpDataUrl);
              } catch (e) {
                // fallback to original dataUrl if conversion fails
                resolve(dataUrl);
              }
            };
            img.onerror = (e) => reject(e);
            img.src = dataUrl;
          })
      );
    }

    async function onFileChange(e) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      fileName.value = f.name || "";
      imageFile.value = f;
      const tmpUrl = URL.createObjectURL(f);
      imagePreview.value = tmpUrl;
      const webp = await convertImageToWebp(f, 600, 0.85);
      imageWebpData.value = webp;
      imagePreview.value = webp;
      URL.revokeObjectURL(tmpUrl);
    }

    function triggerFileInput() {
      if (fileInput.value && typeof fileInput.value.click === "function") {
        fileInput.value.click();
      }
    }

    function onSubmit() {
      if (!canSubmit.value) return;
      const payload = {
        title: title.value,
        author: author.value,
        pages: pages.value,
        status: status.value,
        readPages: readPages.value,
        image: imageWebpData.value || null,
      };
      emit("submit", payload);
      ui.dialogOpen = false;
    }

    return {
      title,
      author,
      pages,
      readPages,
      status,
      statusItems,
      onSubmit,
      canSubmit,
      onFileChange,
      imagePreview,
      fileInput,
      fileName,
      triggerFileInput,
    };
  },
});
</script>

<style scoped lang="scss">
.add-book-form > h3 {
  margin: 0;
  font-size: $text-xl;
  font-weight: 700;
  color: #111827;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2f7;
  margin-top: 12px;
}

.add-book-form > p {
  margin: 20px 0 20px 0;
  color: #6b7280;
}

.add-book-form > * + * {
  margin-top: 16px;
}

.add-book-form .base-button.base-button-primary,
.add-book-form .base-button-primary,
.add-book-form .base-button[title="Add book"] {
  width: 100% !important;
  display: inline-flex;
  justify-content: center;
}

.add-book-form input,
.add-book-form select,
.add-book-form textarea {
  width: 100%;
  box-sizing: border-box;
}

.image-upload {
  margin-top: 12px;
}
.image-upload .base-input {
  max-width: 460px;
}
.image-upload .file-control {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  cursor: pointer;
}
.image-upload .file-choose {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
}
.image-upload .file-name {
  color: $textColor;
  font-size: $text-sm;
}
.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}
.image-preview--compact img {
  max-width: 120px;
  max-height: 160px;
  border-radius: 6px;
}
</style>
