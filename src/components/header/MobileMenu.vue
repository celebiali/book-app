<template>
  <div v-if="open">
    <div class="mobile-backdrop" @click="close" aria-hidden="true"></div>
    <aside
      class="mobile-panel"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
    >
      <div class="mobile-panel-header">
        <div class="brand">
          <BookLogo class="brand-icon" />
          <span class="brand-title">Bookapp</span>
        </div>
        <button class="mobile-close" @click="close" aria-label="Close menu">
          ✕
        </button>
      </div>

      <nav class="mobile-panel-nav">
        <button
          class="nav-link"
          @click.prevent="
            (async () => {
              router && router.push({ name: 'about' }).catch(() => {});
              close();
            })()
          "
          :class="{
            active:
              (route && route.name === 'about') || ui.currentPage === 'about',
          }"
        >
          About
        </button>
        <button
          class="nav-link"
          @click.prevent="
            (async () => {
              router && router.push({ name: 'books' }).catch(() => {});
              close();
            })()
          "
          :class="{
            active:
              (route && route.name === 'books') || ui.currentPage === 'books',
          }"
        >
          Books
        </button>

        <div class="mobile-actions">
          <BaseButton
            variant="outline"
            width="100%"
            height="48"
            @click="openAddDialog"
            >Add book form</BaseButton
          >
          <BaseButton variant="primary" width="100%" height="48"
            >Login</BaseButton
          >
        </div>
      </nav>
    </aside>
  </div>
</template>

<script>
import { defineComponent, watch, onMounted, onBeforeUnmount } from "vue";
import { useUiStore } from "@/stores/ui";
import BookLogo from "@/components/icons/BookLogo.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "MobileMenu",
  components: { BookLogo, BaseButton },
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ["update:open"],
  setup(props, { emit }) {
    const ui = useUiStore();
    let router = null;
    let route = null;
    try {
      router = useRouter();
      route = useRoute();
    } catch (e) {
      router = null;
      route = null;
    }
    function close() {
      emit("update:open", false);
    }

    function openAddDialog() {
      if (ui && typeof ui.setDialog === "function") {
        ui.setDialog("add-book", null);
      } else if (ui) {
        ui.dialogType = "add-book";
        ui.dialogPayload = null;
        ui.dialogOpen = true;
      }
      emit("update:open", false);
      if (ui && typeof ui.setMenuOpen === "function") ui.setMenuOpen(false);
      else if (ui) ui.menuOpen = false;
    }

    const stop = watch(
      () => props.open,
      (open) => {
        if (typeof document !== "undefined" && document.body) {
          if (open) document.body.style.overflow = "hidden";
          else document.body.style.overflow = "";
        }
      }
    );

    function onKeydown(e) {
      if (e.key === "Escape" && props.open) close();
    }

    let mq = null;
    function mqHandler(e) {
      if (!e.matches) close();
    }

    onMounted(() => {
      if (typeof window !== "undefined") {
        window.addEventListener("keydown", onKeydown);
        mq = window.matchMedia("(max-width: 768px)");
        if (!mq.matches && props.open) close();
        if (mq.addEventListener) mq.addEventListener("change", mqHandler);
        else if (mq.addListener) mq.addListener(mqHandler);
      }
    });

    onBeforeUnmount(() => {
      if (typeof window !== "undefined") {
        window.removeEventListener("keydown", onKeydown);
      }
      if (typeof stop === "function") stop();
      if (typeof document !== "undefined" && document.body) {
        document.body.style.overflow = "";
      }
      if (mq) {
        if (mq.removeEventListener) mq.removeEventListener("change", mqHandler);
        else if (mq.removeListener) mq.removeListener(mqHandler);
      }
    });

    return { close, openAddDialog, ui, route, router };
  },
});
</script>

<style scoped lang="scss">
.mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 65;
}

.mobile-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(92vw, 360px);
  background: #fff;
  z-index: 70;
  display: flex;
  flex-direction: column;
  padding: 20px 18px;
  box-shadow: -8px 0 24px rgba(20, 27, 46, 0.08);
  transform: translateX(0);
  animation: slideIn 0.18s ease-out;

  .mobile-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 4px 0 18px 0;
    .brand {
      display: flex;
      gap: 12px;
      align-items: center;
      .brand-icon {
        width: 28px;
        height: 28px;
      }
      &-title {
        font-size: $text-lg;
        font-weight: 700;
        color: $titleColor;
        font-family: $font-family-futura;
      }
    }
    .mobile-close {
      background: transparent;
      border: none;
      font-size: $text-3xl;
      line-height: 1;
      padding: 8px;
      cursor: pointer;
    }
  }

  .mobile-panel-nav {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding-top: 8px;

    .nav-link {
      padding: 6px 0;
      font-weight: 700;
      text-align: center;
      font-size: $text-md;
      font-family: $font-family-futura;
      color: $titleColor;
      text-decoration: none;
      background: transparent;
      border: none;
      cursor: pointer;
      &.active {
        color: $mainColor;
        border-bottom: 3px solid $mainColor;
        width: fit-content;
        margin: 0 auto;
        padding-bottom: 8px;
      }
    }

    .mobile-actions {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .base-button {
        width: 100% !important;
        height: 48px !important;
        border-radius: 999px !important;
        font-weight: 700 !important;
        font-size: $text-md !important;
        padding: 0 18px !important;
        box-shadow: none !important;
      }

      .base-button--outline {
        background: transparent !important;
        border: 2px solid $mainColor !important;
        color: $mainColor !important;
      }

      .base-button--primary {
        background: $mainColor !important;
        color: $completedBtnText !important;
      }
    }
  }
}

@keyframes slideIn {
  from {
    transform: translateX(8px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>