<template>
  <div class="custom-container">
    <SuccessAlert
      v-if="ui.successVisible"
      :show="ui.successVisible"
      :topFixed="true"
      @close="ui.clearSuccess"
    />
    <Header />
    <BaseDialog>
      <component
        :is="ui.dialogType === 'update-book' ? 'UpdateBookForm' : 'AddBookForm'"
        v-if="ui.dialogType === 'update-book' || ui.dialogType === 'add-book'"
        @submit="onAddBook"
      />
    </BaseDialog>
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/header/Header.vue";
import Footer from "./components/footer/Footer.vue";
import BaseDialog from "@/components/shared/BaseDialog.vue";
import AddBookForm from "@/components/books/AddBookForm.vue";
import UpdateBookForm from "@/components/books/UpdateBookForm.vue";
import SuccessAlert from "@/components/shared/SuccessAlert.vue";
import { useUiStore } from "@/stores/ui";
import { useBooksStore } from "@/stores/books";
export default {
  name: "App",
  components: {
    Header,
    Footer,
    BaseDialog,
    AddBookForm,
    UpdateBookForm,
    SuccessAlert,
  },
  setup() {
    const ui = useUiStore();
    const books = useBooksStore();

    function onAddBook(payload) {
      const newRaw = {
        title: payload.title,
        author: payload.author,
        total_pages:
          Number(payload.pages) || Number(payload.pages) === 0
            ? Number(payload.pages)
            : undefined,
        reading_status: payload.status || "to_read",
        favorite: false,
        image: payload.image || undefined,
      };
      if (typeof books.addBook === "function") books.addBook(newRaw);
      if (ui && typeof ui.clearDialog === "function") ui.clearDialog();
      else ui.dialogOpen = false;
    }

    return {
      onAddBook,
      ui,
    };
  },
};
</script>
<style scoped lang="scss"></style>
