async function callApi(endpoint, method = 'POST', data = {}) {
    try {
        let options = { method };
        let hasFile = Object.values(data).some(value => value instanceof File);

        if (hasFile) {
            const formData = new FormData();
            for (const key in data) {
                if (data[key] !== undefined && data[key] !== null) {
                    formData.append(key, data[key]);
                }
            }
            options.body = formData;
            // Não definir Content-Type, o browser faz sozinho
        } else {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`http:// 172.28.16.1:8000${endpoint}`, options);
        return await response.json(); // sempre retorna JSON
    } catch (error) {
        console.error('Erro na API:', error);
        throw error;
    }
}
