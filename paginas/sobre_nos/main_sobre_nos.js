/**
 * GERENCIADOR DA PÁGINA "SOBRE NÓS"
 */
class GerenciadorSobreNos {
  constructor() {
    // Elementos que vamos usar
    this.elementos = {
      cards: document.querySelectorAll('.card'),
      ano: document.getElementById('year'),
      menuOffline: document.querySelector('nav.menu#offline'),
      menuOnline: document.querySelector('nav.menu#online'),
      botaoSair: document.querySelector('[onclick="logout()"]')
    };

    // Inicia todas as funcionalidades
    this.iniciar();
  }

  iniciar() {
    this.configurarCards();
    this.verificarLogin();
    this.atualizarAno();
    this.prepararLogout();
  }

  // 1. Efeitos nos cards quando o mouse passa por cima
  configurarCards() {
    this.elementos.cards.forEach(card => {
      // Configura animação suave
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

      // Quando mouse entra
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
      });

      // Quando mouse sai
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
      });
    });
  }

  // 2. Mostra o menu correto (online/offline)
  verificarLogin() {
    const usuarioLogado = localStorage.getItem('User');

    if (this.elementos.menuOffline && this.elementos.menuOnline) {
      this.elementos.menuOffline.style.display = usuarioLogado ? 'none' : 'flex';
      this.elementos.menuOnline.style.display = usuarioLogado ? 'flex' : 'none';
    }
  }

  // 3. Atualiza o ano no rodapé automaticamente
  atualizarAno() {
    if (this.elementos.ano) {
      this.elementos.ano.textContent = new Date().getFullYear();
    }
  }

  // 4. Prepara a função de logout
  prepararLogout() {
    if (this.elementos.botaoSair) {
      this.elementos.botaoSair.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Tem certeza que deseja sair?')) {
          localStorage.removeItem('User');
          window.location.href = '../../index.html';
        }
      });
    }
  }
}

// Função global para logout (usada no HTML)
window.logout = function () {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.removeItem('User');
    window.location.href = '../../index.html';
  }
};

// Inicia tudo quando a página carregar
document.addEventListener('DOMContentLoaded', () => new GerenciadorSobreNos());