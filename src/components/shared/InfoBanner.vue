<template>
  <div v-if="show" class="info-banner" role="region">
    <div class="inner">
      {{ books }} books <span class="separator">and</span> {{ pages }} pages
      have been read.
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "InfoBanner",
  props: {
    books: { type: [String, Number], required: true },
    pages: { type: [String, Number], required: true },
    show: { type: Boolean, default: true },
  },
});
</script>

<style scoped lang="scss">
.info-banner {
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $secondaryColor;
  color: $mainColor;
  text-align: center;
  font-weight: 700;
  font-size: $text-md;
  font-family: $font-family-inter;
  margin-top: 21px;
  height: 48px;
  line-height: 100%;
  letter-spacing: 0%;

  .inner {
    max-width: 1200px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

    .separator {
      color: $titleColor;
      font-family: $font-family-inter;
      font-weight: 400;
      font-style: Regular;
      font-size: $text-md;
      line-height: 100%;
      letter-spacing: 0%;
    }
  }
}
</style>
