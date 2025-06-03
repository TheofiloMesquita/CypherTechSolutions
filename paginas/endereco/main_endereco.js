let usuario = JSON.parse(localStorage.getItem("User"));
let token = usuario?.access_token;
let forms = document.getElementById("formulario");

let elementos = {
    tabela: document.querySelector(".campos"),
    tbody: document.querySelector(".campos tbody"),
    modeloLinha: document.getElementById("campo_endereco"),
    btnSubmit: document.querySelector('.formulario .botao_principal'),
    formulario: {
        title: document.getElementById("title"),
        cep: document.getElementById("cep"),
        endereco: document.getElementById("endereco"),
        numero: document.getElementById("numero"),
        complemento: document.getElementById("complemento")
    }
};

function resetarFormulario() {
    Object.values(elementos.formulario).forEach(input => {
        input.value = '';
    });
    forms.style.display = "none";
}

async function fazerRequisicao(url, metodo, corpo = null) {
    let config = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    if (corpo) config.body = JSON.stringify(corpo);

    let response = await fetch(url, config);
    console.log("Dados Recebidos", response)

    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    return response.json();
}

async function buscandoApi() {
    try {
        console.log("Iniciando busca de endereços...");
        let response = await fetch('https://go-wash-api.onrender.com/api/auth/address', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("Status da resposta:", response.status);

        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }

        let responseData = await response.json();
        console.log("Dados recebidos:", responseData);

        elementos.tbody.innerHTML = '';

        let enderecos = responseData.data || responseData;
        console.log(enderecos)

        if (Array.isArray(enderecos) && enderecos.length > 0) {
            enderecos.forEach((item, index) => {
                let newRow = elementos.modeloLinha.cloneNode(true);
                newRow.id = `endereco_${item.id}`;
                newRow.style.display = "";

                // Remove IDs duplicados
                newRow.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));

                newRow.querySelector(".dados_id").textContent = index + 1;
                newRow.querySelector(".dados_titulo").value = item.title || '';
                newRow.querySelector(".dados_cep").value = item.cep || '';
                newRow.querySelector(".dados_endereco").value = item.address || '';
                newRow.querySelector(".dados_numero").value = item.number || '';
                newRow.querySelector(".dados_complemento").value = item.complement || '';

                newRow.querySelector(".atualizar").onclick = () => atualizar(item.id);
                newRow.querySelector(".excluir").onclick = () => excluir(item.id);

                elementos.tbody.appendChild(newRow);
            });
        } else {
            console.log("Sem dados cadastrados...");
            let tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="7">Nenhum endereço cadastrado</td>';
            elementos.tbody.appendChild(tr);
        }
    } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        let tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7">Erro ao carregar endereços</td>';
        elementos.tbody.appendChild(tr);
    }
}

async function cadastrar() {
    try {
        setLoadingState(true);

        let dados = {
            title: elementos.formulario.title.value,
            cep: elementos.formulario.cep.value,
            address: elementos.formulario.endereco.value,
            number: elementos.formulario.numero.value,
            complement: elementos.formulario.complemento.value
        };

        await fazerRequisicao('https://go-wash-api.onrender.com/api/auth/address', 'POST', dados);
        alert("Endereço cadastrado com sucesso!");

        resetarFormulario();
        await buscandoApi();
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar endereço. Verifique os dados e tente novamente.");
    } finally {
        setLoadingState(false);
    }
}

function setLoadingState(isLoading) {
    elementos.btnSubmit.disabled = isLoading;
    elementos.btnSubmit.textContent = isLoading ? 'Entrando...' : 'Entrar';
    elementos.btnSubmit.style.opacity = isLoading ? '0.7' : '1';
}

async function atualizar(id) {
    try {
        let linha = document.getElementById(`endereco_${id}`);
        let dadosAtualizados = {
            title: linha.querySelector(".dados_titulo").value,
            cep: linha.querySelector(".dados_cep").value,
            address: linha.querySelector(".dados_endereco").value,
            number: linha.querySelector(".dados_numero").value,
            complement: linha.querySelector(".dados_complemento").value
        };

        await fazerRequisicao(
            `https://go-wash-api.onrender.com/api/auth/address/${id}`,
            'POST',
            dadosAtualizados
        );

        alert("Endereço atualizado com sucesso!");
        await buscandoApi();
    } catch (error) {
        console.error("Erro ao atualizar:", error);
        alert("Erro ao atualizar endereço.");
    }
}

async function excluir(id) {
    if (!confirm('Tem certeza que deseja excluir este endereço?')) return;

    try {
        await fazerRequisicao(
            `https://go-wash-api.onrender.com/api/auth/address/${id}`,
            'DELETE'
        );

        alert("Endereço excluído com sucesso!");
        await buscandoApi();
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir endereço.");
    }
}

function chamar_formulario() {
    forms.style.display = forms.style.display === "none" ? "flex" : "none";
}

function configurarMenu() {
    let menuOffline = document.getElementById("offline");
    let menuOnline = document.getElementById("online");

    if (menuOffline && menuOnline) {
        let isLoggedIn = localStorage.getItem("User");
        menuOffline.style.display = isLoggedIn ? "none" : "flex";
        menuOnline.style.display = isLoggedIn ? "flex" : "none";
    }
}

window.logout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem("User");
        window.location.href = "../../index.html";
    }
};

document.addEventListener('DOMContentLoaded', () => {
    configurarMenu();
    resetarFormulario();
    buscandoApi();
});