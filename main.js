// Espera o carregamento completo do DOM antes de executar o script
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o elemento do carrossel
    let carrossel = document.querySelector('.carrossel');
    // Seleciona todos os slides individuais
    let slides = document.querySelectorAll('.slide');
    // Seleciona todos os indicadores (bolinhas de navegação)
    let indicadores = document.querySelectorAll('.indicador');
    
    // criando variavel pra contar o slide atual
    let slideAtual = 0;

    // armazena todos os slides
    let totalSlides = slides.length;
    
    // Função que atualiza a posição do carrossel e o estado dos indicadores
    function atualizarCarrossel() {
        // Move o carrossel horizontalmente com transform (translação em X)
        // O cálculo -${slideAtual * 100}% move o carrossel para mostrar o slide atual
        carrossel.style.transform = `translateX(-${slideAtual * 100}%)`;
        
        // Atualiza a aparência dos indicadores
        indicadores.forEach((ind, index) => {
            // Adiciona a classe 'ativo' ao indicador do slide atual
            // Remove dos demais (toggle com segundo parâmetro)
            ind.classList.toggle('ativo', index === slideAtual);
        });
    }
    
    // Função para saltar diretamente para um slide específico
    function irParaSlide(index) {
        // Atualiza o slide atual para o índice recebido
        slideAtual = index;
        // Chama a função para atualizar a exibição
        atualizarCarrossel();
    }
    
    // Adiciona eventos de clique a cada indicador
    indicadores.forEach(indicador => {
        indicador.addEventListener('click', function() {
            // Obtém o índice do slide a partir do atributo data-indice
            let indice = parseInt(this.getAttribute('data-indice'));
            // Chama a função para ir para o slide correspondente
            irParaSlide(indice);
        });
    });
    
    // Configura o auto-play contínuo (sem pausa)
    setInterval(() => {
        // Avança para o próximo slide (se for o último, volta ao primeiro)
        slideAtual = (slideAtual < totalSlides - 1) ? slideAtual + 1 : 0;
        // Atualiza a exibição
        atualizarCarrossel();
    }, 5000); // Executa a cada 5000 milissegundos (3 segundos)
});