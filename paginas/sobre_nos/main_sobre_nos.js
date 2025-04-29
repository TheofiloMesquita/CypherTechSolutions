class SobreNosApp {
    constructor() {
      this.selectors = {
        CARDS: '.card',
        YEAR_ELEMENT: '#year',
        NAV_OFFLINE: 'nav.menu#offline',
        NAV_ONLINE: 'nav.menu#online',
        LOGOUT_BUTTON: '[onclick="logout()"]'
      };
  
      this.init();
    }
  
    init() {
      this.setupCardEffects();
      this.updateFooterYear();
      this.updateNavigation();
      this.setupLogout();
    }
  
    // 1. Efeito Hover nos Cards (destaque visual)
    setupCardEffects() {
      const cards = document.querySelectorAll(this.selectors.CARDS);
      
      cards.forEach(card => {
        card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-10px)';
          card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
      });
    }
  
    // 2. Controle de Login/Logout
    updateNavigation() {
      const isLoggedIn = Boolean(localStorage.getItem('User'));
      document.querySelector(this.selectors.NAV_OFFLINE).style.display = isLoggedIn ? 'none' : 'flex';
      document.querySelector(this.selectors.NAV_ONLINE).style.display = isLoggedIn ? 'flex' : 'none';
    }
  
    setupLogout() {
      const logoutBtn = document.querySelector(this.selectors.LOGOUT_BUTTON);
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('User');
            window.location.href = '../../index.html';
          }
        });
      }
    }
  
    // 3. Atualização do Ano no Footer
    updateFooterYear() {
      const yearElement = document.querySelector(this.selectors.YEAR_ELEMENT);
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    }
  }
  
  // Inicializa quando a página carregar
  document.addEventListener('DOMContentLoaded', () => new SobreNosApp());