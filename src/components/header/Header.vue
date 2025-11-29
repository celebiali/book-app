<template>
  <header class="app-header" :class="{ 'menu-open': ui.menuOpen }">
    <div class="header-inner">
      <div class="left">
        <div class="brand">
          <BookLogo class="brand-icon" />
          <span class="brand-title">Bookapp</span>
        </div>
        <nav :class="['nav', { 'is-open': ui.menuOpen }]">
          <template v-if="hasRouter">
            <RouterLink
              class="nav-link"
              :to="{ name: 'about' }"
              :class="{ active: route && route.name === 'about' }"
              >About</RouterLink
            >
            <RouterLink
              class="nav-link"
              :to="{ name: 'books' }"
              :class="{ active: route && route.name === 'books' }"
              >Books</RouterLink
            >
          </template>
          <template v-else>
            <a
              class="nav-link"
              href="#"
              @click.prevent="fallbackNavigate('about')"
              :class="{ active: ui.currentPage === 'about' }"
              >About</a
            >
            <a
              class="nav-link"
              href="#"
              @click.prevent="fallbackNavigate('books')"
              :class="{ active: ui.currentPage === 'books' }"
              >Books</a
            >
          </template>
        </nav>
      </div>
      <div class="right">
        <BaseButton
          variant="outline"
          :width="133"
          :height="48"
          @click="openDialog"
          >Add book form</BaseButton
        >
        <BaseButton variant="primary" :width="120" :height="48"
          >Login</BaseButton
        >

        <button
          class="hamburger"
          @click="toggleMenu"
          :aria-expanded="ui.menuOpen"
          aria-label="Toggle menu"
        >
          <span class="hamburger-box">
            <span
              class="hamburger-inner"
              :class="{ 'is-active': ui.menuOpen }"
            ></span>
          </span>
        </button>
      </div>
    </div>
    <MobileMenu :open="ui.menuOpen" @update:open="ui.setMenuOpen" />
    <InfoBanner
      :books="booksCount"
      :pages="pagesCount"
      v-if="
        (route && route.name === 'books') ||
        (!hasRouter && ui.currentPage === 'books')
      "
    />
  </header>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useUiStore } from "@/stores/ui";
import { useBooksStore } from "@/stores/books";
import BookLogo from "@/components/icons/BookLogo.vue";
import BaseButton from "@/components/shared/BaseButton.vue";
import MobileMenu from "@/components/header/MobileMenu.vue";
import InfoBanner from "@/components/shared/InfoBanner.vue";
import { useRoute, RouterLink } from "vue-router";
export default defineComponent({
  name: "AppHeader",
  components: { BookLogo, BaseButton, MobileMenu, InfoBanner, RouterLink },
  setup() {
    const ui = useUiStore();
    const booksStore = useBooksStore();
    let route = null;
    let hasRouter = false;
    try {
      route = useRoute();
      hasRouter = true;
    } catch (e) {
      route = null;
      hasRouter = false;
    }

    const booksCount = computed(() => {
      const arr =
        booksStore.books && booksStore.books.value
          ? booksStore.books.value
          : Array.isArray(booksStore.books)
          ? booksStore.books
          : booksStore.raw && booksStore.raw.value
          ? booksStore.raw.value.map((b) => ({ id: b.id }))
          : [];
      return Array.isArray(arr) ? arr.length : 0;
    });

    const pagesCount = computed(() => {
      const rawArr =
        booksStore.raw && booksStore.raw.value
          ? booksStore.raw.value
          : Array.isArray(booksStore.raw)
          ? booksStore.raw
          : [];
      const total = rawArr.reduce(
        (sum, it) => sum + (Number(it.pages_read) || 0),
        0
      );
      return total.toLocaleString();
    });

    const bannerText = computed(
      () =>
        `${booksCount.value} books and ${pagesCount.value} pages have been read.`
    );

    function toggleMenu() {
      if (typeof window === "undefined") return;
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      if (!isMobile) {
        ui.setMenuOpen(false);
        return;
      }
      ui.setMenuOpen(!ui.menuOpen);
    }

    function openDialog() {
      if (ui && typeof ui.setDialog === "function") {
        ui.setDialog("add-book", null);
      } else {
        ui.dialogType = "add-book";
        ui.dialogPayload = null;
        ui.dialogOpen = true;
      }
    }

    function fallbackNavigate(name) {
      if (ui && typeof ui.setCurrentPage === "function")
        ui.setCurrentPage(name);
      else ui.currentPage = name;
    }

    return {
      ui,
      bannerText,
      booksCount,
      pagesCount,
      toggleMenu,
      openDialog,
      route,
      hasRouter,
      fallbackNavigate,
    };
  },
});
</script>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 60;
  background: #fff;
  padding: 18px 0;
  .header-inner {
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 24px;
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      .brand-icon {
        width: 28px;
        height: 28px;
      }
      &-title {
        font-family: $font-family-futura;
        font-weight: 700;
        color: $titleColor;
        font-size: $text-xl;
      }
    }

    .nav {
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      font-family: $font-family-inter;
      font-size: $text-md;

      &-link {
        color: $titleColor;
        text-decoration: none;
        padding: 8px 6px;
        font-weight: 600;
        width: 71px;
        text-align: center;
        &.active {
          color: $mainColor;
          border-bottom: 2px solid $mainColor;
        }
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hamburger {
    display: none;
    background: transparent;
    border: none;
    padding: 8px;
    cursor: pointer;
  }
  .hamburger-box {
    display: inline-block;
    width: 28px;
    height: 18px;
    position: relative;
  }
  .hamburger-inner {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    background: $iconColor;
    transform: translateY(-50%);
    transition: transform 0.18s, background 0.18s;
  }
  .hamburger-inner::before,
  .hamburger-inner::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    background: $iconColor;
    transition: transform 0.18s, opacity 0.18s;
  }
  .hamburger-inner::before {
    transform: translateY(-8px);
  }
  .hamburger-inner::after {
    transform: translateY(8px);
  }
  .hamburger-inner.is-active {
    background: transparent;
  }
  .hamburger-inner.is-active::before {
    transform: rotate(45deg);
    top: 0;
  }
  .hamburger-inner.is-active::after {
    transform: rotate(-45deg);
    top: 0;
  }

  @media (max-width: 768px) {
    .header-inner {
      padding: 12px 16px;
    }
    .left {
      gap: 12px;
      .brand {
        gap: 8px;
        .brand-icon {
          width: 24px;
          height: 24px;
        }
        &-title {
          font-size: $text-md;
        }
      }
    }

    .right {
      .base-button {
        display: none !important;
      }
    }
    .hamburger {
      display: inline-flex !important;
    }

    .left .nav {
      display: none !important;
    }

    .menu-open {
      .header-inner {
        .left .nav {
          display: none !important;
        }
        .right .base-button {
          display: none !important;
        }
      }
    }

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
      padding: 16px;
      box-shadow: -8px 0 24px rgba(20, 27, 46, 0.08);
      transform: translateX(0);
      animation: slideIn 0.18s ease-out;

      .mobile-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        .brand {
          display: flex;
          gap: 8px;
          align-items: center;
          .brand-icon {
            width: 24px;
            height: 24px;
          }
          &-title {
            font-size: $text-md;
          }
        }
        .mobile-close {
          background: transparent;
          border: none;
          font-size: $text-2xl;
          line-height: 1;
          padding: 8px;
          cursor: pointer;
        }
      }

      .mobile-panel-nav {
        display: flex;
        flex-direction: column;
        gap: 12px;
        .nav-link {
          padding: 12px 6px;
          font-weight: 600;
        }
        .mobile-actions {
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
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
  }
}
</style>