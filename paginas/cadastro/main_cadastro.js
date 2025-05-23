// Constantes para elementos reutilizáveis
const ELEMENTS = {
  form: document.getElementById('formCadastro'),
  nome: document.getElementById('nome'),
  sobrenome: document.getElementById('sobrenome'),
  dtNascimento: document.getElementById('dt_nascimento'),
  cpfCnpj: document.getElementById('CPF_CNPJ'),
  email: document.getElementById('email'),
  senha: document.getElementById('senha'),
  confirmacao: document.getElementById('confirmacao'),
  termo: document.getElementById('termo'),
  erro: document.getElementById('erro'),
  btnCadastrar: document.querySelector('.botao'),
  iconSenha: document.getElementById('icon-senha'),
  iconConfirmacao: document.getElementById('icon-confirmacao')
};

// Objeto com mensagens de erro
const ERROR_MESSAGES = {
  camposObrigatorios: 'Preencha todos os campos e aceite os termos',
  cpfInvalido: 'CPF deve ter 11 dígitos',
  cnpjInvalido: 'CNPJ deve ter 14 dígitos',
  emailInvalido: 'Email inválido (exemplo@dominio.com)',
  senhaCurta: 'Senha deve ter no mínimo 6 caracteres',
  senhasDiferentes: 'As senhas não coincidem',
  termosNaoAceitos: 'Você deve aceitar os termos',
  erroCadastro: 'Erro ao cadastrar. Tente novamente.',
  erroConexao: 'Erro de conexão com o servidor'
};

/**
* Alterna a visibilidade da senha
* @param {HTMLInputElement} input - Campo de senha
* @param {HTMLImageElement} icon - Ícone de visibilidade
*/
function togglePasswordVisibility(input, icon) {
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  icon.src = isPassword ? '../../imgs/icones/hide.png' : '../../imgs/icones/show.png';
  icon.alt = isPassword ? 'Ocultar senha' : 'Mostrar senha';
}

/**
* Valida CPF/CNPJ
* @param {string} value - Valor do campo
* @returns {boolean} - True se válido
*/
function validarCpfCnpj(value) {
  const numeros = value.replace(/\D/g, '');
  return numeros.length === 11 || numeros.length === 14;
}

/**
* Formata CPF/CNPJ automaticamente
* @param {string} value - Valor do campo
* @returns {string} - Valor formatado
*/
function formatarCpfCnpj(value) {
  const numeros = value.replace(/\D/g, '');

  if (numeros.length <= 11) {
    return numeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    return numeros
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
}

/**
* Limpa estilos de erro dos campos
*/
function limparErros() {
  ELEMENTS.erro.textContent = '';
  const inputs = ELEMENTS.form.querySelectorAll('input');
  inputs.forEach(input => {
    input.style.borderColor = '';
    if (input.type === 'checkbox') {
      input.parentElement.style.color = '';
    }
  });
}

/**
* Mostra mensagem de erro e destaca campo
* @param {string} message - Mensagem de erro
* @param {string} fieldId - ID do campo (opcional)
*/
function mostrarErro(message, fieldId = null) {
  ELEMENTS.erro.textContent = message;
  ELEMENTS.erro.style.color = 'red';

  if (fieldId) {
    document.getElementById(fieldId).style.borderColor = 'red';
  }
}

/**
* Ativa estado de loading no botão
*/
function setLoadingState(isLoading) {
  if (isLoading) {
    ELEMENTS.btnCadastrar.disabled = true;
    ELEMENTS.btnCadastrar.textContent = 'Cadastrando...';
    ELEMENTS.btnCadastrar.style.opacity = '0.7';
  } else {
    ELEMENTS.btnCadastrar.disabled = false;
    ELEMENTS.btnCadastrar.textContent = 'Cadastrar';
    ELEMENTS.btnCadastrar.style.opacity = '1';
  }
}

/**
* Valida todos os campos do formulário
* @returns {boolean} - True se todos os campos são válidos
*/
function validarCampos() {
  const campos = {
    nome: ELEMENTS.nome.value.trim(),
    sobrenome: ELEMENTS.sobrenome.value.trim(),
    dtNascimento: ELEMENTS.dtNascimento.value,
    cpfCnpj: ELEMENTS.cpfCnpj.value.trim(),
    email: ELEMENTS.email.value.trim(),
    senha: ELEMENTS.senha.value,
    confirmacao: ELEMENTS.confirmacao.value,
    termo: ELEMENTS.termo.checked
  };

  // Campos obrigatórios
  if (!campos.nome || !campos.sobrenome || !campos.dtNascimento ||
    !campos.cpfCnpj || !campos.email || !campos.senha || !campos.confirmacao) {
    mostrarErro(ERROR_MESSAGES.camposObrigatorios);
    return false;
  }

  // Termos
  if (!campos.termo) {
    mostrarErro(ERROR_MESSAGES.termosNaoAceitos);
    return false;
  }

  // CPF/CNPJ
  if (!validarCpfCnpj(campos.cpfCnpj)) {
    const message = campos.cpfCnpj.replace(/\D/g, '').length <= 11 ?
      ERROR_MESSAGES.cpfInvalido : ERROR_MESSAGES.cnpjInvalido;
    mostrarErro(message, 'CPF_CNPJ');
    return false;
  }

  // Email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) {
    mostrarErro(ERROR_MESSAGES.emailInvalido, 'email');
    return false;
  }

  // Senha
  if (campos.senha.length < 6) {
    mostrarErro(ERROR_MESSAGES.senhaCurta, 'senha');
    return false;
  }

  // Confirmação de senha
  if (campos.senha !== campos.confirmacao) {
    mostrarErro(ERROR_MESSAGES.senhasDiferentes);
    ELEMENTS.senha.style.borderColor = 'red';
    ELEMENTS.confirmacao.style.borderColor = 'red';
    return false;
  }

  return true;
}

/**
* Envia os dados para a API
*/
async function enviarParaAPI() {
  try {
    const response = await fetch('https://go-wash-api.onrender.com/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${ELEMENTS.nome.value.trim()} ${ELEMENTS.sobrenome.value.trim()}`,
        email: ELEMENTS.email.value.trim(),
        user_type_id: 1,
        password: ELEMENTS.senha.value,
        cpf_cnpj: ELEMENTS.cpfCnpj.value.replace(/\D/g, ''),
        terms: 1,
        birthday: ELEMENTS.dtNascimento.value
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || ERROR_MESSAGES.erroCadastro);
    }

    alert('Cadastro realizado com sucesso!');
    window.location.href = '../entrar/index_entrar.html';
  } catch (error) {
    console.error('Erro no cadastro:', error);
    mostrarErro(error.message || ERROR_MESSAGES.erroConexao);
  }
}

/**
* Função principal de cadastro
*/
async function cadastrar() {
  limparErros();

  if (!validarCampos()) {
    return;
  }

  setLoadingState(true);
  await enviarParaAPI();
  setLoadingState(false);
}

// Configurações iniciais quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Configurar botões de mostrar senha
  window.mostrar_senha = () => togglePasswordVisibility(ELEMENTS.senha, ELEMENTS.iconSenha);
  window.mostrar_confirmacao = () => togglePasswordVisibility(ELEMENTS.confirmacao, ELEMENTS.iconConfirmacao);

  // Adicionar máscara para CPF/CNPJ
  if (ELEMENTS.cpfCnpj) {
    ELEMENTS.cpfCnpj.addEventListener('input', (e) => {
      e.target.value = formatarCpfCnpj(e.target.value);
    });
  }
});