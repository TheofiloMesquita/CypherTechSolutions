document.addEventListener('DOMContentLoaded', () => {
    // 1. Configuração do Carrossel (mantido igual)
    const carrossel = document.querySelector('.carrossel');
    const slides = document.querySelectorAll('.slide');
    const indicadores = document.querySelectorAll('.indicador');
    
    if (carrossel && slides.length && indicadores.length) {
        let slideAtual = 0;
        let intervalo = null;
        const tempoTransicao = 5000;

        const atualizarCarrossel = () => {
            carrossel.style.transform = `translateX(-${slideAtual * 100}%)`;
            indicadores.forEach((ind, i) => {
                const isAtivo = i === slideAtual;
                ind.classList.toggle('ativo', isAtivo);
                ind.setAttribute('aria-selected', isAtivo);
                slides[i].setAttribute('aria-hidden', !isAtivo);
            });
        };

        const reiniciarIntervalo = () => {
            clearInterval(intervalo);
            intervalo = setInterval(() => {
                slideAtual = (slideAtual + 1) % slides.length;
                atualizarCarrossel();
            }, tempoTransicao);
        };

        indicadores.forEach(ind => {
            ind.addEventListener('click', () => {
                slideAtual = parseInt(ind.dataset.indice);
                atualizarCarrossel();
                reiniciarIntervalo();
            });
        });

        reiniciarIntervalo();
    }

    // 2. Menu de Perfil (somente hover)
    const perfilHover = document.querySelector('.perfil_hover');
    const menuHover = document.querySelector('.menu_hover');
    
    if (perfilHover && menuHover) {
        perfilHover.addEventListener('mouseenter', () => {
            menuHover.style.display = 'flex';
            perfilHover.setAttribute('aria-expanded', 'true');
        });

        perfilHover.addEventListener('mouseleave', () => {
            menuHover.style.display = 'none';
            perfilHover.setAttribute('aria-expanded', 'false');
        });
    }

    // 3. Controle de Login/Logout (simplificado)
    const menuOffline = document.getElementById("offline");
    const menuOnline = document.getElementById("online");
    
    if (menuOffline && menuOnline) {
        const isLoggedIn = localStorage.getItem("User");
        menuOffline.style.display = isLoggedIn ? "none" : "flex";
        menuOnline.style.display = isLoggedIn ? "flex" : "none";
    }

    // 4. Atualização do ano no footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 5. Logout global
    window.logout = () => {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem("User");
            window.location.href = "index.html";
        }
    };
});