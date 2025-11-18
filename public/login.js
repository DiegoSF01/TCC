// login.js

// Função para mostrar botão em loading
function setButtonLoading(button, isLoading) {
    if (!button) return;
    if (isLoading) {
        button.disabled = true;
        button.textContent = 'Carregando...';
    } else {
        button.disabled = false;
        button.textContent = 'Entrar';
    }
}

// Função genérica para mostrar toast
function showToast(message, type = 'info') {
    // Implemente conforme sua função atual
    alert(`${type.toUpperCase()}: ${message}`);
}

// Função genérica para chamar API (igual cadastro.js)
async function callApi(endpoint, method = 'POST', data = {}) {
    try {
        const response = await fetch(`http:// 172.28.16.1:8000${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}

// ------------------- LOGIN -------------------
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail')?.value;
        const password = document.getElementById('loginPassword')?.value;
        const submitBtn = loginForm.querySelector('.btn-primary');

        if (!email || !password) {
            showToast('Preencha todos os campos', 'error');
            return;
        }

        setButtonLoading(submitBtn, true);

        try {
            const result = await callApi('/api/login', 'POST', { email, password });

            // Verifica se login foi bem sucedido e se cadastro está completo
            if (result.access_token && result.user?.cadastro_completo) {
                // Salvar token e dados no localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', result.access_token);

                showToast('Login realizado com sucesso!', 'success');

                // Redirecionar para Home/dashboard
                window.location.href = 'Home/index.html';
            } else if (result.access_token && !result.user?.cadastro_completo) {
                showToast('Complete seu cadastro antes de acessar', 'warning');
                // Pode redirecionar para a Parte 2 do cadastro
                window.location.href = '/Parte1/index.html';
            } else {
                showToast(result.error || 'Email ou senha incorretos', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Erro ao conectar com a API', 'error');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
}
