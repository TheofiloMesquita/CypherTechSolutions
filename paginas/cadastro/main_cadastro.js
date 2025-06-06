let ELEMENTS = {
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
	btnCadastrar: document.getElementById('btnCadastrar'),
	iconSenha: document.getElementById('icon-senha'),
	iconConfirmacao: document.getElementById('icon-confirmacao')
};

let ERROR_MESSAGES = {
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

function togglePasswordVisibility(input, icon) {
	let isPassword = input.type === 'password';
	input.type = isPassword ? 'text' : 'password';
	icon.src = isPassword ? '../../imgs/icones/hide.png' : '../../imgs/icones/show.png';
	icon.alt = isPassword ? 'Ocultar senha' : 'Mostrar senha';
}

function validarCpfCnpj(value) {
	let numeros = value.replace(/\D/g, '');
	return numeros.length === 11 || numeros.length === 14;
}

function formatarCpfCnpj(value) {
	let numeros = value.replace(/\D/g, '');

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

function limparErros() {
	ELEMENTS.erro.textContent = '';
	let inputs = ELEMENTS.form.querySelectorAll('input');
	inputs.forEach(input => {
		input.style.borderColor = '';
		if (input.type === 'checkbox') {
			input.parentElement.style.color = '';
		}
	});
}

function mostrarErro(message, fieldId = null) {
	ELEMENTS.erro.textContent = message;
	ELEMENTS.erro.style.color = 'red';

	if (fieldId) {
		document.getElementById(fieldId).style.borderColor = 'red';
	}
}

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

function validarCampos() {
	let campos = {
		nome: ELEMENTS.nome.value.trim(),
		sobrenome: ELEMENTS.sobrenome.value.trim(),
		dtNascimento: ELEMENTS.dtNascimento.value,
		cpfCnpj: ELEMENTS.cpfCnpj.value.trim(),
		email: ELEMENTS.email.value.trim(),
		senha: ELEMENTS.senha.value,
		confirmacao: ELEMENTS.confirmacao.value,
		termo: ELEMENTS.termo.checked
	};

	if (!campos.nome || !campos.sobrenome || !campos.dtNascimento ||
		!campos.cpfCnpj || !campos.email || !campos.senha || !campos.confirmacao) {
		mostrarErro(ERROR_MESSAGES.camposObrigatorios);
		return false;
	}

	if (!campos.termo) {
		mostrarErro(ERROR_MESSAGES.termosNaoAceitos);
		return false;
	}

	if (!validarCpfCnpj(campos.cpfCnpj)) {
		let message = campos.cpfCnpj.replace(/\D/g, '').length <= 11 ?
			ERROR_MESSAGES.cpfInvalido : ERROR_MESSAGES.cnpjInvalido;
		mostrarErro(message, 'CPF_CNPJ');
		return false;
	}

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email)) {
		mostrarErro(ERROR_MESSAGES.emailInvalido, 'email');
		return false;
	}

	if (campos.senha.length < 6) {
		mostrarErro(ERROR_MESSAGES.senhaCurta, 'senha');
		return false;
	}

	if (campos.senha !== campos.confirmacao) {
		mostrarErro(ERROR_MESSAGES.senhasDiferentes);
		ELEMENTS.senha.style.borderColor = 'red';
		ELEMENTS.confirmacao.style.borderColor = 'red';
		return false;
	}

	return true;
}

async function enviarParaAPI() {
	try {
		let response = await fetch('https://go-wash-api.onrender.com/api/user', {
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
			let errorData = await response.json();
			throw new Error(errorData.message || ERROR_MESSAGES.erroCadastro);
		}

		alert('Cadastro realizado com sucesso!');
		window.location.href = '../entrar/index_entrar.html';
	} catch (error) {
		console.error('Erro no cadastro:', error);
		mostrarErro(error.message || ERROR_MESSAGES.erroConexao);
	}
}

async function cadastrar() {
	limparErros();

	if (!validarCampos()) {
		return;
	}

	setLoadingState(true);
	await enviarParaAPI();
	setLoadingState(false);
}

document.addEventListener('DOMContentLoaded', () => {
	window.mostrar_senha = () => togglePasswordVisibility(ELEMENTS.senha, ELEMENTS.iconSenha);
	window.mostrar_confirmacao = () => togglePasswordVisibility(ELEMENTS.confirmacao, ELEMENTS.iconConfirmacao);

	if (ELEMENTS.cpfCnpj) {
		ELEMENTS.cpfCnpj.addEventListener('input', (e) => {
			e.target.value = formatarCpfCnpj(e.target.value);
		});
	}
});