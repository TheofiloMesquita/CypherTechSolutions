class GerenciadorSobreNos {
	constructor() {
		this.elementos = {
			cards: document.querySelectorAll('.card'),
			ano: document.getElementById('year'),
			menuOffline: document.querySelector('nav.menu#offline'),
			menuOnline: document.querySelector('nav.menu#online'),
			botaoSair: document.querySelector('[onclick="logout()"]')
		};

		this.iniciar();
	}

	iniciar() {
		this.configurarCards();
		this.verificarLogin();
		this.atualizarAno();
		this.prepararLogout();
	}

	configurarCards() {
		this.elementos.cards.forEach(card => {
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

	verificarLogin() {
		const usuarioLogado = localStorage.getItem('User');

		if (this.elementos.menuOffline && this.elementos.menuOnline) {
			this.elementos.menuOffline.style.display = usuarioLogado ? 'none' : 'flex';
			this.elementos.menuOnline.style.display = usuarioLogado ? 'flex' : 'none';
		}
	}

	atualizarAno() {
		if (this.elementos.ano) {
			this.elementos.ano.textContent = new Date().getFullYear();
		}
	}

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

window.logout = function () {
	if (confirm('Tem certeza que deseja sair?')) {
		localStorage.removeItem('User');
		window.location.href = '../../index.html';
	}
};

document.addEventListener('DOMContentLoaded', () => new GerenciadorSobreNos());