<template>
  <footer class="app-footer">
    <div class="footer-top">
      <div class="brand">
        <BookLogo class="logo" />
        <span class="brand-name">Bookapp</span>
      </div>

      <div class="links-row">
        <div class="col col-links">
          <FooterColumn :title="data[0].title" :items="data[0].items" />
        </div>

        <div class="col col-links">
          <FooterColumn :title="data[1].title" :items="data[1].items" />
        </div>
      </div>

      <div class="col social-col">
        <FooterColumn title="Social" variant="social" :icons="socialIcons" />
      </div>
    </div>
    <div class="footer-divider" />
    <div class="footer-bottom">
      <div class="footer-bottom-left">
        <a v-for="(l, i) in bottomLinks" :key="i">{{ l }}</a>
      </div>
      <div class="footer-bottom-center">{{ address }}</div>
      <div class="footer-bottom-right">{{ copyright }}</div>
    </div>
  </footer>
</template>

<script>
import { defineComponent, ref } from "vue";
import BookLogo from "@/components/icons/BookLogo.vue";
import FooterColumn from "./FooterColumn.vue";

export default defineComponent({
  name: "AppFooter",
  components: { BookLogo, FooterColumn },
  setup() {
    const data = ref([
      {
        title: "Learn More",
        items: [
          { label: "About Bookshop" },
          { label: "Press Releases" },
          { label: "Environment" },
          { label: "Jobs" },
          { label: "Privacy Policy" },
          { label: "Contact Us" },
        ],
      },
      {
        title: "Menu",
        items: [
          { label: "Ebooks" },
          { label: "Gift Cards" },
          { label: "Special Offers" },
          { label: "New Books" },
          { label: "Best Sellers" },
        ],
      },
    ]);

    const socialIcons = ref(["facebook", "instagram", "youtube"]);
    const bottomLinks = ref([
      "Commercial Terms & Conditions",
      "Privacy Policy",
    ]);
    const address = ref("535 Mission St Fl 14 San Francisco, CA 94105");
    const copyright = ref("Copyright © 2022 entrapeer, All rights reserved.");

    return { data, socialIcons, bottomLinks, address, copyright };
  },
});
</script>

<style scoped lang="scss">
.brand {
  display: flex;
  align-items: center;
  &-name {
    font-family: $font-family-futura;
    font-weight: 700;
    font-size: $text-xl;
    color: $titleColor;
    line-height: 100%;
    letter-spacing: 0%;
    padding-left: 12px;
  }
}

.app-footer {
  position: relative;
  padding:40px 0 0 0;
  background: #fff;
  color: #111827;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial;
}
.app-footer::before {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  width: 100vw;
  height: 1px;
  background: #e6e8eb;
  z-index: 1;
}

.footer-top {
  display: flex;
  gap: 32px;
  padding-bottom: 28px;
  position: relative;
  z-index: 2;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap; 
}

.links-row {
  display: flex;
  gap: 24px;
  flex: 1 1 auto;
  min-width: 0;
}

.footer-top .brand {
  flex: 0 0 220px; 
  min-width: 160px;
}
.footer-top .col {
  flex: 1 1 220px;
  min-width: 180px;
}
.footer-top .social-col {
  flex: 0 0 145px; 
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

@media (max-width: 440px) {
  .footer-top {
    gap: 24px;
  }
  .footer-top .brand {
    flex: 0 0 100%;
    width: 100%;
    order: 1;
  }

  .links-row {
    flex-direction: column;
    flex-wrap: nowrap;
    order: 2;
    width: 100%;
  }

  .footer-top .social-col {
    flex: 0 0 100%;
    width: 100%;
    order: 3;
    justify-content: flex-start;
    margin-top: 8px;
    width: 200px;
  }
}

.footer-divider {
  height: 1px;
  background: #e6e8eb;
  margin: 20px 0;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 6px;
  color: $thirdColor;
  font-family: $font-family-roboto;
  font-weight: 400;
  font-size: $text-sm;
  line-height: 150%;
  letter-spacing: 0%;
  flex-wrap: nowrap;
}

.footer-bottom-left {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  align-items: center;
}
.footer-bottom-left a {
  color: inherit;
  text-decoration: none;
  font-size: inherit;
}

.footer-bottom-center {
  text-align: center;
  flex: 1 1 auto;
  min-width: 0;
  padding: 6px 12px;
}
.footer-bottom-right {
  text-align: right;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .footer-bottom {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding-top: 12px;
    text-align: center;
  }

  .footer-bottom-left {
    order: 1;
    margin-bottom: 6px;
    justify-content: center;
    width: 100%;
  }

  .footer-bottom-center {
    order: 2;
    width: 100%;
    margin-bottom: 6px;
    padding: 0 8px;
  }

  .footer-bottom-right {
    order: 3;
    width: 100%;
    white-space: normal;
    text-align: center;
  }

   .footer-bottom-left a {
    display: inline-block;
    margin: 6px 10px;
  }
}

@media (max-width: 440px) {
  .footer-bottom-left a {
    margin: 6px 8px;
    font-size: 13px;
  }
  .footer-bottom-center,
  .footer-bottom-right {
    font-size: 13px;
  }
}
</style>
