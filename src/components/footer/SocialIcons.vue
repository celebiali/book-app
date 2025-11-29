<template>
  <div class="social-icons">
    <component
      v-for="(ic, i) in mappedIcons"
      :is="ic.component"
      :key="i"
      class="icon"
    />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import FacebookIcon from "@/components/icons/FacebookIcon.vue";
import InstagramIcon from "@/components/icons/InstagramIcon.vue";
import YoutubeIcon from "@/components/icons/YoutubeIcon.vue";

const map = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
};

export default defineComponent({
  name: "SocialIcons",
  props: {
    icons: { type: Array, default: () => ["facebook", "instagram", "youtube"] },
  },
  setup(props) {
    const mappedIcons = props.icons.map((k) => ({
      name: k,
      component: map[k] || FacebookIcon,
    }));
    return { mappedIcons };
  },
});
</script>

<style scoped lang="scss">
.social-icons {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
}

</style>
