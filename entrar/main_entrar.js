/**
 * Alterna a visibilidade da senha no campo de input
 * @param {HTMLInputElement} campoInput - Campo de senha
 * @param {HTMLImageElement} icone - Ícone de visibilidade
 */
function togglePasswordVisibility(campoInput, icone) {
    let isPassword = campoInput.type === "password";
    campoInput.type = isPassword ? "text" : "password";
    icone.src = isPassword ? "../imgs/hide.png" : "../imgs/show.png";
    icone.alt = isPassword ? "Ocultar senha" : "Mostrar senha";
}

/**
 * Valida o formato do email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - Retorna true se o email for válido
 */
function validarEmail(email) {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Limpa os estilos de erro dos campos
 */
function limparEstilosErro() {
    document.getElementById("erro").textContent = "";
    document.getElementById("email").style.borderColor = "";
    document.getElementById("senha").style.borderColor = "";
}

/**
 * Manipula o envio do formulário de login
 * @param {Event} event - Evento de submit
 */
async function handleLogin(event) {
    event.preventDefault();
    
    // Obter elementos do DOM
    let emailInput = document.getElementById("email");
    let senhaInput = document.getElementById("senha");
    let erroElement = document.getElementById("erro");
    
    // Obter valores dos campos
    let email = emailInput.value.trim();
    let senha = senhaInput.value;
    
    // Limpar erros anteriores
    limparEstilosErro();
    
    // Validação dos campos
    if (!email || !senha) {
        erroElement.textContent = "Preencha todos os campos";
        if (!email) emailInput.style.borderColor = "red";
        if (!senha) senhaInput.style.borderColor = "red";
        return;
    }
    
    if (!validarEmail(email)) {
        erroElement.textContent = "Insira um email válido";
        emailInput.style.borderColor = "red";
        return;
    }
    
    try {
        // Configuração da requisição
        let url = "https://go-wash-api.onrender.com/api/login";
        let parametros = {
            email: email,
            password: senha,
            user_type_id: 1
        };
        
        // Enviar requisição
        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(parametros),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        // Processar resposta
        if (response.ok) {
            let data = await response.json();
            console.log("Login bem-sucedido:", data);
            alert("Login realizado com sucesso!");
            // Redirecionar ou executar ações pós-login
        } else {
            let errorData = await response.json();
            console.error("Erro no login:", errorData);
            erroElement.textContent = "E-mail ou senha incorretos";
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        erroElement.textContent = "Erro de conexão. Tente novamente.";
    }
}

// Configuração inicial quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
    // Configurar evento de submit do formulário
    document.getElementById("formLogin").addEventListener("submit", handleLogin);
    
    // Configurar função global para mostrar senha
    window.mostrar_senha = () => {
        let senhaInput = document.getElementById("senha");
        let iconeSenha = document.getElementById("icon-senha");
        togglePasswordVisibility(senhaInput, iconeSenha);
    };
});