// Objeto com seletores DOM
const DOM = {
  form: document.getElementById('formLogin'),
  email: document.getElementById('email'),
  senha: document.getElementById('senha'),
  erro: document.getElementById('erro'),
  btnSubmit: document.querySelector('.botao'),
  iconSenha: document.getElementById('icon-senha')
};

// Mensagens de erro centralizadas
const ERROR_MESSAGES = {
  camposObrigatorios: 'Preencha todos os campos',
  emailInvalido: 'Insira um email válido (exemplo@dominio.com)',
  credenciaisInvalidas: 'Email ou senha incorretos',
  erroConexao: 'Erro de conexão. Tente novamente.'
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
* Valida o formato do email
* @param {string} email - Email a ser validado
* @returns {boolean} - True se válido
*/
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
* Limpa os estilos de erro
*/
function limparErros() {
  DOM.erro.textContent = '';
  DOM.email.style.borderColor = '';
  DOM.senha.style.borderColor = '';
}

/**
* Mostra mensagem de erro e destaca campo
* @param {string} message - Mensagem de erro
* @param {string} [field] - Campo relacionado (opcional)
*/
function mostrarErro(message, field = null) {
  DOM.erro.textContent = message;
  if (field) {
      document.getElementById(field).style.borderColor = 'red';
  }
}

/**
* Ativa/desativa estado de loading no botão
* @param {boolean} isLoading - Se está carregando
*/
function setLoadingState(isLoading) {
  DOM.btnSubmit.disabled = isLoading;
  DOM.btnSubmit.textContent = isLoading ? 'Entrando...' : 'Entrar';
  DOM.btnSubmit.style.opacity = isLoading ? '0.7' : '1';
}

/**
* Armazena dados do usuário no localStorage
* @param {object} userData - Dados do usuário
*/
function storeUserData(userData) {
  try {
      localStorage.setItem('User', JSON.stringify(userData));
      console.log('Dados do usuário armazenados com sucesso');
  } catch (error) {
      console.error('Erro ao armazenar dados:', error);
  }
}

/**
* Envia os dados de login para a API
* @param {string} email 
* @param {string} senha 
* @returns {Promise<object>} - Resposta da API
*/
async function loginAPI(email, senha) {
  try {
      const response = await fetch('https://go-wash-api.onrender.com/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              email,
              password: senha,
              user_type_id: 1
          })
      });

      if (!response.ok) {
          throw new Error(ERROR_MESSAGES.credenciaisInvalidas);
      }

      return await response.json();
  } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
  }
}

/**
* Manipula o envio do formulário
* @param {Event} event - Evento de submit
*/
async function handleLogin(event) {
  event.preventDefault();
  limparErros();

  const email = DOM.email.value.trim();
  const senha = DOM.senha.value;

  // Validação básica
  if (!email || !senha) {
      mostrarErro(ERROR_MESSAGES.camposObrigatorios);
      if (!email) DOM.email.style.borderColor = 'red';
      if (!senha) DOM.senha.style.borderColor = 'red';
      return;
  }

  if (!validarEmail(email)) {
      mostrarErro(ERROR_MESSAGES.emailInvalido, 'email');
      return;
  }

  setLoadingState(true);

  try {
      const userData = await loginAPI(email, senha);
      storeUserData(userData);
      alert('Login realizado com sucesso!');
      window.location.href = '../../index.html';
  } catch (error) {
      mostrarErro(error.message || ERROR_MESSAGES.erroConexao);
  } finally {
      setLoadingState(false);
  }
}

// Configurações iniciais quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Configurar evento de submit
  if (DOM.form) {
      DOM.form.addEventListener('submit', handleLogin);
  }

  // Configurar função global para mostrar senha
  window.mostrar_senha = () => {
      if (DOM.senha && DOM.iconSenha) {
          togglePasswordVisibility(DOM.senha, DOM.iconSenha);
      }
  };
});