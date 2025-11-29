<template>
  <section class="books-page">
    <FavoriteCard />
    <BookList ref="bookListRef" />
  </section>
</template>

<script>
import { defineComponent, ref } from "vue";
import FavoriteCard from "@/components/books/FavoriteCard.vue";
import BookList from "@/components/books/BookList.vue";
export default defineComponent({
  name: "BooksPage",
  components: { FavoriteCard, BookList },
  setup() {
    const bookListRef = ref(null);
    return { bookListRef };
  },
});
</script>

<style scoped lang="scss">
.books-page {
  display: block;
}
</style>
