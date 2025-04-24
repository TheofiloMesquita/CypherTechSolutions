/**
 * Função para alternar a visibilidade da senha
 * @param {HTMLElement} senha - Campo de entrada da senha
 * @param {HTMLElement} iconSenha - Ícone que controla a visibilidade
 */
function togglePasswordVisibility(senha, iconSenha) {
    if (senha.type === "password") {
        senha.type = "text";
        iconSenha.src = "../imgs/hide.png";
        iconSenha.alt = "Ocultar senha";
    } else {
        senha.type = "password";
        iconSenha.src = "../imgs/show.png";
        iconSenha.alt = "Mostrar senha";
    }
}

/**
 * Função para mostrar/ocultar a senha principal
 */
function mostrar_senha() {
    let senha = document.getElementById("senha");
    let iconSenha = document.getElementById("icon-senha");
    togglePasswordVisibility(senha, iconSenha);
}

/**
 * Função para mostrar/ocultar a confirmação de senha
 */
function mostrar_confirmacao() {
    let confirmacao = document.getElementById("confirmacao");
    let iconConfirmacao = document.getElementById("icon-confirmacao");
    togglePasswordVisibility(confirmacao, iconConfirmacao);
}

/**
 * Função para limpar os estilos de erro dos campos do formulário
 */
function limparEstilosErro() {
    let campos = ["nome", "sobrenome", "dt_nascimento", "CPF_CNPJ", "email", "senha", "confirmacao"];
    
    campos.forEach(campo => {
        let elemento = document.getElementById(campo);
        elemento.style.color = 'black';
        elemento.style.borderColor = 'black';
    });
    
    document.getElementById("erro").textContent = "";
}

/**
 * Função para validar o formato do CPF/CNPJ
 * @param {string} cpf_cnpj - Valor do campo CPF/CNPJ
 * @returns {boolean} - Retorna true se o formato for válido
 */
function validarCpfCnpj(cpf_cnpj) {
    // Remove caracteres não numéricos
    let numeros = cpf_cnpj.replace(/\D/g, '');
    
    // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
    return numeros.length === 11 || numeros.length === 14;
}

/**
 * Função para validar o formato do email
 * @param {string} email - Valor do campo email
 * @returns {boolean} - Retorna true se o formato for válido
 */
function validarEmail(email) {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Função principal para cadastrar o usuário
 */
async function cadastrar() {
    // Obter valores dos campos
    let nome = document.getElementById("nome").value.trim();
    let sobrenome = document.getElementById("sobrenome").value.trim();
    let dt_nascimento = document.getElementById("dt_nascimento").value;
    let cpf_cnpj = document.getElementById("CPF_CNPJ").value.trim();
    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value;
    let confirmacao = document.getElementById("confirmacao").value; // Corrigido: estava pegando senha novamente
    let termo = document.getElementById("termo").checked;
    
    // Elemento para exibir mensagens de erro
    let erroElement = document.getElementById("erro");
    
    // Limpar estilos de erro anteriores
    limparEstilosErro();
    
    // Validação dos campos obrigatórios
    if (!nome || !sobrenome || !dt_nascimento || !cpf_cnpj || !email || !senha || !confirmacao || !termo) {
        erroElement.textContent = "Preencha todos os campos e aceite os termos";
        erroElement.style.color = 'red';
        
        // Destacar campos não preenchidos
        if (!nome) document.getElementById("nome").style.borderColor = 'red';
        if (!sobrenome) document.getElementById("sobrenome").style.borderColor = 'red';
        if (!dt_nascimento) document.getElementById("dt_nascimento").style.borderColor = 'red';
        if (!cpf_cnpj) document.getElementById("CPF_CNPJ").style.borderColor = 'red';
        if (!email) document.getElementById("email").style.borderColor = 'red';
        if (!senha) document.getElementById("senha").style.borderColor = 'red';
        if (!confirmacao) document.getElementById("confirmacao").style.borderColor = 'red';
        
        return;
    }
    
    // Validação do CPF/CNPJ
    if (!validarCpfCnpj(cpf_cnpj)) {
        erroElement.textContent = "Insira um CPF (11 dígitos) ou CNPJ (14 dígitos) válido";
        erroElement.style.color = 'red';
        document.getElementById("CPF_CNPJ").style.color = 'red';
        document.getElementById("CPF_CNPJ").style.borderColor = 'red';
        return;
    }
    
    // Validação do email
    if (!validarEmail(email)) {
        erroElement.textContent = "Insira um email válido (exemplo@dominio.com)";
        erroElement.style.color = 'red';
        document.getElementById("email").style.color = 'red';
        document.getElementById("email").style.borderColor = 'red';
        return;
    }
    
    // Validação do tamanho da senha
    if (senha.length < 6) {
        erroElement.textContent = "Sua senha deve ter no mínimo 6 caracteres";
        erroElement.style.color = 'red';
        document.getElementById("senha").style.color = 'red';
        document.getElementById("senha").style.borderColor = 'red';
        return;
    }
    
    // Validação de confirmação de senha
    if (senha !== confirmacao) {
        erroElement.textContent = "Suas senhas não conferem";
        erroElement.style.color = 'red';
        document.getElementById("senha").style.color = 'red';
        document.getElementById("senha").style.borderColor = 'red';
        document.getElementById("confirmacao").style.color = 'red';
        document.getElementById("confirmacao").style.borderColor = 'red';
        return;
    }
    
    // Preparar dados para a API
    let url = 'https://go-wash-api.onrender.com/api/user';
    let parametros = {
        "name": `${nome} ${sobrenome}`,
        "email": email,
        "user_type_id": 1,
        "password": senha,
        "cpf_cnpj": cpf_cnpj.replace(/\D/g, ''), // Remove caracteres não numéricos
        "terms": 1,
        "birthday": dt_nascimento
    };
    
    try {
        // Enviar requisição para a API
        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(parametros),
            headers: {
                "Content-Type": "application/json"
            },
        });
        
        let data = await response.json();
        
        if (response.ok) {
            // Sucesso no cadastro
            alert("Usuário cadastrado com sucesso!");
            console.log("Resposta da API:", data);
            
            // Redirecionar ou limpar formulário
            // window.location.href = '../entrar/index_entrar.html';
        } else {
            // Tratar erros da API
            console.error("Erro na API:", data);
            
            if (data.data && data.data.errors) {
                if (data.data.errors.email && data.data.errors.cpf_cnpj) {
                    erroElement.textContent = "O Email e o CPF/CNPJ já estão cadastrados";
                } else if (data.data.errors.email) {
                    erroElement.textContent = "O Email já está cadastrado";
                } else if (data.data.errors.cpf_cnpj) {
                    erroElement.textContent = "O CPF/CNPJ já está cadastrado";
                } else if (data.data.errors === "cpf_cnpj invalid") {
                    erroElement.textContent = "Insira um CPF ou CNPJ válido";
                } else {
                    erroElement.textContent = "Erro ao cadastrar. Tente novamente.";
                }
            } else {
                erroElement.textContent = "Erro desconhecido ao cadastrar";
            }
            
            erroElement.style.color = 'red';
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        erroElement.textContent = "Erro de conexão. Tente novamente.";
        erroElement.style.color = 'red';
    }
}

// Evento DOMContentLoaded para garantir que o DOM está carregado
document.addEventListener('DOMContentLoaded', function() {
    // Tornar funções acessíveis globalmente
    window.mostrar_senha = mostrar_senha;
    window.mostrar_confirmacao = mostrar_confirmacao;
    
    // Adicionar máscara para CPF/CNPJ (opcional)
    // document.getElementById('CPF_CNPJ').addEventListener('input', formatarCpfCnpj);
});