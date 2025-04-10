document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Remover mensagens de erro anteriores
            clearErrorMessages();
            
            // Validar campos
            let isValid = true;
            
            // Nome
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Por favor, informe seu nome');
                isValid = false;
            }
            
            // Email
            const emailInput = document.getElementById('email');
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Por favor, informe um email válido');
                isValid = false;
            }
            
            // Telefone
            const phoneInput = document.getElementById('phone');
            if (!validatePhone(phoneInput.value)) {
                showError(phoneInput, 'Por favor, informe um telefone válido');
                isValid = false;
            }
            
            // Mensagem
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Por favor, escreva sua mensagem');
                isValid = false;
            }
            
            // Se todos os campos forem válidos, simular envio
            if (isValid) {
                // Mostrar indicador de loading
                const submitButton = contactForm.querySelector('.submit-button');
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitButton.disabled = true;
                
                // Simular resposta do servidor (após 2 segundos)
                setTimeout(function() {
                    contactForm.reset();
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Enviado!';
                    
                    // Restaurar botão após 3 segundos
                    setTimeout(function() {
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                    }, 3000);
                    
                    // Mostrar mensagem de sucesso
                    showSuccessMessage('Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.');
                }, 2000);
            }
        });
        
        // Adicionar validação em tempo real
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                // Remover classe de erro quando o usuário começa a digitar novamente
                this.classList.remove('error');
                const errorElement = this.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
            });
        });
    }
    
    // Função para validar email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Função para validar telefone
    function validatePhone(phone) {
        // Permite formatos (99) 9999-9999 ou (99) 99999-9999 ou variações sem parênteses e hifens
        const re = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
        return re.test(String(phone));
    }
    
    // Função para validar um campo individual
    function validateInput(input) {
        // Remover mensagem de erro existente
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Validar de acordo com o tipo de campo
        if (input.id === 'name') {
            if (!input.value.trim()) {
                showError(input, 'Por favor, informe seu nome');
            }
        } else if (input.id === 'email') {
            if (!validateEmail(input.value)) {
                showError(input, 'Por favor, informe um email válido');
            }
        } else if (input.id === 'phone') {
            if (!validatePhone(input.value)) {
                showError(input, 'Por favor, informe um telefone válido');
            }
        } else if (input.id === 'message') {
            if (!input.value.trim()) {
                showError(input, 'Por favor, escreva sua mensagem');
            }
        }
    }
    
    // Função para mostrar erro
    function showError(input, message) {
        input.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--primary-color)';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        input.parentElement.appendChild(errorElement);
    }
    
    // Função para limpar todas as mensagens de erro
    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(element => {
            element.remove();
        });
        
        const errorInputs = document.querySelectorAll('.error');
        errorInputs.forEach(input => {
            input.classList.remove('error');
        });
    }
    
    // Função para mostrar mensagem de sucesso
    function showSuccessMessage(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        successElement.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        successElement.style.color = '#28a745';
        successElement.style.padding = '15px';
        successElement.style.borderRadius = 'var(--border-radius-sm)';
        successElement.style.marginTop = '20px';
        successElement.style.textAlign = 'center';
        
        // Inserir a mensagem após o formulário
        contactForm.insertAdjacentElement('afterend', successElement);
        
        // Remover a mensagem após alguns segundos
        setTimeout(function() {
            successElement.remove();
        }, 5000);
    }
});
