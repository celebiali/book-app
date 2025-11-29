import { defineStore } from 'pinia';

let _successTimer = null;

export const useUiStore = defineStore('ui', {
  state: () => ({
    menuOpen: false,
    dialogOpen: false,
    dialogType: null,
    dialogPayload: null,
    currentPage: 'books',
    successVisible: false,
  }),
  actions: {
    setCurrentPage(page) {
      this.currentPage = page || 'books';
    },
    setMenuOpen(val) {
      this.menuOpen = val;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    toggleIfMobile() {
      if (typeof window === 'undefined') return;
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!isMobile) {
        this.menuOpen = false;
        return;
      }
      this.menuOpen = !this.menuOpen;
    },
    setDialogOpen(val) {
      this.dialogOpen = !!val;
    },
    setDialog(type, payload = null) {
      this.dialogType = type || null;
      this.dialogPayload = payload || null;
      this.dialogOpen = true;
    },
    clearDialog() {
      this.dialogType = null;
      this.dialogPayload = null;
      this.dialogOpen = false;
    },
    showSuccess() {
        this.clearDialog();
      if (this.successVisible) return false;
      this.successVisible = true;
        if (_successTimer) {
          clearTimeout(_successTimer);
          _successTimer = null;
        }
        _successTimer = setTimeout(() => {
            this.clearSuccess();
         
          _successTimer = null;
        }, 2000);
    
      return true;
    },
    clearSuccess() {
      this.successVisible = false;
    },
  },
});
