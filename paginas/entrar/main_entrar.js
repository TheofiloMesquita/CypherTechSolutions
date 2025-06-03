const elementos = {
	form: document.getElementById('formLogin'),
	email: document.getElementById('email'),
	senha: document.getElementById('senha'),
	erro: document.getElementById('erro'),
	btnSubmit: document.querySelector('.botao_principal'),
	iconSenha: document.getElementById('icon-senha')
};

const ERROR_MESSAGES = {
	camposObrigatorios: 'Preencha todos os campos',
	emailInvalido: 'Insira um email válido (exemplo@dominio.com)',
	credenciaisInvalidas: 'Email ou senha incorretos',
	erroConexao: 'Erro de conexão. Tente novamente.'
};

function togglePasswordVisibility(input, icon) {
	const isPassword = input.type === 'password';
	input.type = isPassword ? 'text' : 'password';
	icon.src = isPassword ? '../../imgs/icones/hide.png' : '../../imgs/icones/show.png';
	icon.alt = isPassword ? 'Ocultar senha' : 'Mostrar senha';
}

function validarEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function limparErros() {
	elementos.erro.textContent = '';
	elementos.email.style.borderColor = '';
	elementos.senha.style.borderColor = '';
}

function mostrarErro(message, field = null) {
	elementos.erro.textContent = message;
	if (field) {
		document.getElementById(field).style.borderColor = 'red';
	}
}

function setLoadingState(isLoading) {
	elementos.btnSubmit.disabled = isLoading;
	elementos.btnSubmit.textContent = isLoading ? 'Entrando...' : 'Entrar';
	elementos.btnSubmit.style.opacity = isLoading ? '0.7' : '1';
}

function storeUserData(userData) {
	try {
		localStorage.setItem('User', JSON.stringify(userData));
		console.log('Dados do usuário armazenados com sucesso');
	} catch (error) {
		console.error('Erro ao armazenar dados:', error);
	}
}

response = null
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

async function handleLogin(event) {
	event.preventDefault();
	limparErros();

	const email = elementos.email.value.trim();
	const senha = elementos.senha.value;

	if (!email || !senha) {
		mostrarErro(ERROR_MESSAGES.camposObrigatorios);
		if (!email) elementos.email.style.borderColor = 'red';
		if (!senha) elementos.senha.style.borderColor = 'red';
		elementos.erro.style.color = 'red';
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
		window.location.href = '../endereco/index_endereco.html';
	} catch (error) {
		mostrarErro(error.message || ERROR_MESSAGES.erroConexao);
	} finally {
		setLoadingState(false);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	if (elementos.form) {
		elementos.form.addEventListener('submit', handleLogin);
	}

	window.mostrar_senha = () => {
		if (elementos.senha && elementos.iconSenha) {
			togglePasswordVisibility(elementos.senha, elementos.iconSenha);
		}
	};
});