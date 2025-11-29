<template>
  <div class="col">
    <h4 class="col-title">{{ title }}</h4>

    <div v-if="variant === 'social'">
      <SocialIcons :icons="icons" />
    </div>

    <ul v-else class="col-list">
      <li v-for="(item, idx) in items" :key="idx">
        <a v-if="item.href" :href="item.href">{{ item.label }}</a>
        <span v-else>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SocialIcons from "./SocialIcons.vue";
export default defineComponent({
  name: "FooterColumn",
  components: { SocialIcons },
  props: {
    title: { type: String, required: true },
    items: { type: Array, default: () => [] },
    variant: { type: String, default: "default" },
    icons: { type: Array, default: () => [] },
  },
});
</script>

<style scoped lang="scss">
.col {
  display: flex;
  flex-direction: column;
}
.col-title {
  margin: 0 0 12px;
  font-family: $font-family-inter;
  font-weight: 700;
  font-size: $text-lg;
  line-height: 100%;
  letter-spacing: 0px;
}
.col-list {
  list-style: none;
  padding: 0;
  margin: 0;
  color: $titleColor;
  font-family: $font-family-inter;
  font-weight: 400;
  font-size: $text-sm;
  line-height: 30px;
  letter-spacing: 0px;
}
.col-list li {
  margin: 8px 0;
  color: $titleColor;
}
.col-list a {
  color: inherit;
  text-decoration: none;
  color: $titleColor;
}
</style>