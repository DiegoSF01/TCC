forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    const submitBtn = forgotPasswordForm.querySelector('.btn-primary');
  
    setButtonLoading(submitBtn, true);
  
    try {
      const result = await callApi('/api/password/email', 'POST', { email });
  
      if (result.success) {
        showToast('Email de recuperação enviado!', 'success');
        forgotPasswordForm.reset();
        switchView('login');
      } else {
        showToast(result.message || 'Erro ao enviar email', 'error');
      }
      setButtonLoading(submitBtn, false);
    } catch (error) {
      showToast('Erro ao conectar com a API', 'error');
      setButtonLoading(submitBtn, false);
    }
  });
  