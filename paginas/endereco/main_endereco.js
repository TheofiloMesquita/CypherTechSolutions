// 1. Organização das variáveis globais
const usuario = JSON.parse(localStorage.getItem("User"));
const token = usuario?.access_token;
const forms = document.getElementById("formulario");

// 2. Objeto de elementos DOM centralizado
const elementos = {
    tabela: document.querySelector(".campos"),
    tbody: document.querySelector(".campos tbody"),
    modeloLinha: document.getElementById("campo_endereco"),
    formulario: {
        title: document.getElementById("title"),
        cep: document.getElementById("cep"),
        endereco: document.getElementById("endereco"),
        numero: document.getElementById("numero"),
        complemento: document.getElementById("complemento")
    }
};

// 3. Função para limpar e resetar o formulário
function resetarFormulario() {
    Object.values(elementos.formulario).forEach(input => {
        input.value = '';
    });
    forms.style.display = "none";
}

// 4. Função genérica para requisições API
async function fazerRequisicao(url, metodo, corpo = null) {
    const config = {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    if (corpo) config.body = JSON.stringify(corpo);
    
    const response = await fetch(url, config);
    console.log("Dados Recebidos", response)
    
    if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
}

// 5. Função principal para buscar endereços
async function buscandoApi() {
    try {
        console.log("Iniciando busca de endereços...");
        const response = await fetch('https://go-wash-api.onrender.com/api/auth/address', {
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

        const responseData = await response.json();
        console.log("Dados recebidos:", responseData);

        // Limpa o tbody completamente
        elementos.tbody.innerHTML = '';
        
        // Verifica se há dados - ATENÇÃO AO FORMATO ESPECÍFICO
        const enderecos = responseData.data || responseData; // Tenta ambos os formatos
        
        if (Array.isArray(enderecos) && enderecos.length > 0) {
            enderecos.forEach((item, index) => {
                const newRow = elementos.modeloLinha.cloneNode(true);
                newRow.id = `endereco_${item.id}`;
                newRow.style.display = "";
                
                // Remove IDs duplicados
                newRow.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
                
                // Preenche os dados - ATUALIZADO COM OS NOMES DE CAMPOS CORRETOS
                newRow.querySelector(".dados_id").textContent = index + 1;
                newRow.querySelector(".dados_titulo").value = item.title || '';
                newRow.querySelector(".dados_cep").value = item.cep || item.cop || ''; // Note o fallback para 'cop'
                newRow.querySelector(".dados_endereco").value = item.address || '';
                newRow.querySelector(".dados_numero").value = item.number || '';
                newRow.querySelector(".dados_complemento").value = item.complement || '';
                
                // Configura os botões
                newRow.querySelector(".atualizar").onclick = () => atualizar(item.id);
                newRow.querySelector(".excluir").onclick = () => excluir(item.id);
                
                elementos.tbody.appendChild(newRow);
            });
        } else {
            console.log("Sem dados cadastrados...");
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="7">Nenhum endereço cadastrado</td>';
            elementos.tbody.appendChild(tr);
        }
    } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="7">Erro ao carregar endereços</td>';
        elementos.tbody.appendChild(tr);
    }
}

// 6. Função para criar uma linha de endereço
function criarLinhaEndereco(item, index) {
    const newRow = elementos.modeloLinha.cloneNode(true);
    newRow.id = `endereco_${item.id}`;
    newRow.style.display = "";
    
    // Remove os IDs dos inputs ou os torna únicos
    const inputs = newRow.querySelectorAll('input');
    inputs.forEach(input => {
        const oldId = input.id;
        if (oldId) {
            input.id = `${oldId}_${item.id}`; // Torna o ID único
            input.removeAttribute('id'); // Ou simplesmente remove o ID
        }
    });

    // Preenche os dados usando classes em vez de IDs
    newRow.querySelector(".dados_id").textContent = index + 1;
    newRow.querySelector(".dados_titulo").value = item.title || '';
    // ... (mesmo para outros campos)
    
    elementos.tbody.appendChild(newRow);
}

// 7. Função para cadastrar novo endereço
async function cadastrar() {
    try {
        const dados = {
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
    }
}

// 8. Funções de atualizar e excluir
async function atualizar(id) {
    try {
        const linha = document.getElementById(`endereco_${id}`);
        const dadosAtualizados = {
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

// 9. Controle de interface
function chamar_formulario() {
    forms.style.display = forms.style.display === "none" ? "flex" : "none";
}

// 10. Controle de login/logout
function configurarMenu() {
    const menuOffline = document.getElementById("offline");
    const menuOnline = document.getElementById("online");
    
    if (menuOffline && menuOnline) {
        const isLoggedIn = localStorage.getItem("User");
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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    configurarMenu();
    resetarFormulario();
    buscandoApi();
});