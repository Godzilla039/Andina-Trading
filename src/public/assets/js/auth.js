//JAVASCRIPT PARA EL LOGIN

 // Toggle para mostrar/ocultar contraseña
  document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const wrapper = toggle.closest('.ath-input-wrapper');
      const input = wrapper.querySelector('input');
      const icon = toggle.querySelector('i');
      
      // Cambiar tipo de input
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      
      // Cambiar icono y texto accesible
      if (isPassword) {
        icon.classList.replace('fa-eye', 'fa-eye-slash');
        toggle.setAttribute('aria-label', 'Ocultar contraseña');
      } else {
        icon.classList.replace('fa-eye-slash', 'fa-eye');
        toggle.setAttribute('aria-label', 'Mostrar contraseña');
      }
    });
  });

  // Manejar el estado del botón de enviar
  document.querySelector('.ath-auth-form')?.addEventListener('submit', function(e) {
    const button = this.querySelector('.ath-primary-btn');
    if (button) {
      button.disabled = true;
      const span = button.querySelector('span:first-child');
      if (span) {
        span.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
      }
          // Después de 7 segundos, restaurar el botón
     setTimeout(() => {
      button.disabled = false;
      if (span) {
        span.textContent = 'Ingresar';
      }
     }, 5000);
    }
  });

    window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('registrationSuccess');
    if (message) {
      const successDiv = document.getElementById('success-message');
      successDiv.textContent = message;
      successDiv.style.display = 'block';

      // Opcional: borrar el parámetro de la URL para no mostrar el mensaje si refrescan
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Detiene el envío normal del formulario

    const submitBtn = form.querySelector('.ath-primary-btn');
    const submitSpan = submitBtn?.querySelector('span:first-child');

    // Desactiva el botón y muestra cargando
    if (submitBtn) submitBtn.disabled = true;
    if (submitSpan) submitSpan.innerHTML = 'Cargando...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = '/dashboard';
      } else {
        showLoginModal(result.message || 'Error desconocido.');
      }
    } catch (error) {
      showLoginModal('Error en la conexión. Intenta de nuevo.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitSpan) submitSpan.innerHTML = 'Ingresar';
    }
  });
});

function showLoginModal(message) {
  const modal = document.getElementById('login-modal');
  const msgBox = document.getElementById('login-modal-message');
  if (modal && msgBox) {
    msgBox.textContent = message;
    modal.style.display = 'flex';
  }
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'none';
}

//JAVASCRIPT PARA EL REGISTRO

document.addEventListener('DOMContentLoaded', function () {
  const phoneInput = document.getElementById('phone');

  phoneInput.addEventListener('input', function () {
    // Eliminar todo lo que no sea número
    let cleaned = this.value.replace(/\D/g, '');

    // Limitar a 15 caracteres
    if (cleaned.length > 15) {
      cleaned = cleaned.substring(0, 15);
    }

    this.value = cleaned;
  });
});

  // Busca todos los toggles de contraseña
document.querySelectorAll('.toggle-password').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const wrapper = toggle.closest('.ath-register-input-wrapper');
    const input = wrapper.querySelector('input');
    const icon = toggle.querySelector('i');

    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    // Alterna la clase 'masked' para enmascarar/desenmascarar
    input.classList.toggle('masked');

    // Cambia el icono
    if (input.classList.contains('masked')) {
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    } else {
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    }
  });
});

// Función para cargar los países desde la API (VERSIÓN CORREGIDA)
async function loadCountries() {
  const container = document.querySelector('.country-options');
  const selectedOption = document.querySelector('.selected-option');
  const hiddenInput = document.getElementById('country');
  
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,translations,cca2,flags');
    const countries = await response.json();
    
    countries.sort((a, b) => {
    const nameA = a.translations?.spa?.common || a.name.common;
    const nameB = b.translations?.spa?.common || b.name.common;
    return nameA.localeCompare(nameB);
     });
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    countries.forEach(country => {
      const option = document.createElement('div');
      option.className = 'country-option';
      option.innerHTML = `
        <span class="flag" style="background-image: url(${country.flags.svg})"></span>
        <span class="text">${country.translations?.spa?.common || country.name.common}</span>
      `;
      
      option.addEventListener('click', () => {
        hiddenInput.value = country.cca2;
        selectedOption.querySelector('.text').textContent = country.translations?.spa?.common || country.name.common;
        selectedOption.querySelector('.flag').style.backgroundImage = `url(${country.flags.svg})`;
        container.classList.remove('show');
        selectedOption.querySelector('i').classList.remove('rotate');
      });
      
      container.appendChild(option);
    });
    
    // Manejar clic en el selector
    selectedOption.addEventListener('click', (e) => {
      e.stopPropagation();
      container.classList.toggle('show');
      selectedOption.querySelector('i').classList.toggle('rotate');
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', () => {
      container.classList.remove('show');
      selectedOption.querySelector('i').classList.remove('rotate');
    });
    
  } catch (error) {
    console.error('Error al cargar los países:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadCountries);

//CALENDARIO

  // Esperar a que el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', function() {

    // Inicializar el selector de fecha
    const birthdateInput = document.getElementById('birthdate');
    if(birthdateInput) {
      // Calcular fecha máxima (hoy - 18 años)
      const today = new Date();
      const minDate = new Date();

      minDate.setFullYear(today.getFullYear() - 100); // Máximo 100 años atrás
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() - 18); // Mínimo 18 años atrás

      const flatpickrInstance =flatpickr(birthdateInput, {
        dateFormat: "Y-m-d",
        minDate: minDate,
        maxDate: maxDate,
        locale: "es",
        disableMobile: true,
        allowInput: false,
        clickOpens: false,
        defaultDate: null, 
        static: false,
        inline: false, 
        theme: "light",
        onOpen: function() {
          hideTooltip(document.getElementById('birthdate-tooltip'));
        }
      });

      birthdateInput.addEventListener('click', function(e) {
        e.preventDefault(); // evita comportamiento predeterminado
        if (flatpickrInstance) {
            flatpickrInstance.open();
        } 
      });
    }

    // Función para verificar fortaleza de contraseña
    window.checkStrength = function(password) {
      const strengthBar = document.getElementById('password-strength-bar');
      const strengthText = document.getElementById('password-strength-text');

      const criteria = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>/=_<>]/.test(password)
      };

      document.getElementById('length').className = criteria.length ? 'valid' : 'invalid';
      document.getElementById('lowercase').className = criteria.lowercase ? 'valid' : 'invalid';
      document.getElementById('uppercase').className = criteria.uppercase ? 'valid' : 'invalid';
      document.getElementById('number').className = criteria.number ? 'valid' : 'invalid';
      document.getElementById('validchars').className = criteria.special ? 'valid' : 'invalid';

      let passedCriteria = Object.values(criteria).filter(Boolean).length;

      // Limpia clases anteriores
      strengthBar.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

      if (password.length === 0) {
        strengthText.textContent = '';
        return;
      }

      if (passedCriteria <= 2) {
        strengthBar.classList.add('strength-weak');
        strengthText.textContent = 'Contraseña débil';
        strengthText.style.color = '#e74c3c';
      } else if (passedCriteria === 3 || passedCriteria === 4) {
        strengthBar.classList.add('strength-medium');
        strengthText.textContent = 'Contraseña media';
        strengthText.style.color = '#f39c12';
      } else {
        strengthBar.classList.add('strength-strong');
        strengthText.textContent = 'Contraseña fuerte';
        strengthText.style.color = '#393d5d';
      }
    };

    // Función para validar el formulario
  
    window.validateForm = function () {
      let valid = true;
      const strengthTextContent = document.getElementById('password-strength-text').textContent.trim();

      const terms = document.getElementById('terms').checked;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm_password').value;
      const birthdate = document.getElementById('birthdate').value;
      const country = document.getElementById('country').value;

      const birthdateInput = document.getElementById('birthdate');
      const birthdateTooltip = document.getElementById('birthdate-tooltip');
      const countryInput = document.getElementById('country');
      const countryTooltip = document.getElementById('country-tooltip');
      const termsInput = document.getElementById('terms');
      const termsTooltip = document.getElementById('terms-tooltip');
      const passwordInput = document.getElementById('password');
      const passwordTooltip = document.getElementById('weak-password-tooltip');
      const confirmPasswordInput = document.getElementById('confirm_password');
      const confirmPasswordTooltip = document.getElementById('dont-match-password-tooltip');

      if (!terms) {
        showTooltip(termsTooltip, termsInput);
        termsInput.focus();
        valid = false;
      } else {
        hideTooltip(termsTooltip);
      }

      if (!birthdate) {
        showTooltip(birthdateTooltip, birthdateInput);
        birthdateInput.focus();
        valid = false;
      } else {
        hideTooltip(birthdateTooltip);
      }

      if (!country) {
        showTooltip(countryTooltip, countryInput);
        countryInput.focus();
        valid = false;
      } else {
        hideTooltip(countryTooltip);
      }

      if (password !== confirmPassword) {
        showTooltip(confirmPasswordTooltip, confirmPasswordInput);
        confirmPasswordInput.focus();
        valid = false;
      } else {
        hideTooltip(confirmPasswordTooltip);
      }

      if (strengthTextContent === 'Contraseña débil') {
        console.log('Contraseña débil detectada');
        showTooltip(passwordTooltip, passwordInput);
        passwordInput.focus();
        valid = false;
      } else {
        console.log('Contraseña aceptable');
        hideTooltip(passwordTooltip);
      }

      if (!valid) {
        return false;
      }

      const button = document.getElementById('register-button');
      button.disabled = true;
      button.querySelector('.button-text').textContent = 'Creando cuenta...';
      button.insertAdjacentHTML('beforeend', '<i class="fas fa-spinner fa-spin ms-2"></i>');

      setTimeout(() => {
        button.disabled = false;
        if (buttonText) {
            buttonText.textContent = 'Crear cuenta';  // texto original
        }
        // Quitar el spinner (el ícono <i> que agregaste)
        const spinner = button.querySelector('i.fas.fa-spinner');
        if (spinner) {
            spinner.remove();
        }
    }, 3000);

      return true;
    };
 });

 window.hideTooltip = function(tooltipEl) {
  if(tooltipEl) {
    tooltipEl.style.opacity = 0;
    tooltipEl.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      tooltipEl.style.display = 'none';
    }, 300);
  }
};

window.showTooltip = function(tooltipEl, targetInput) {
  if(tooltipEl) {
    tooltipEl.style.display = 'flex';
    setTimeout(() => {
      tooltipEl.style.opacity = 1;
      tooltipEl.style.transform = 'translateY(0)';
    }, 10);
  }
};

 document.getElementById('birthdate').addEventListener('click', () => {
  hideTooltip(document.getElementById('birthdate-tooltip'));
});

 document.querySelector('.selected-option').addEventListener('click', () => {
  hideTooltip(document.getElementById('country-tooltip'));
});

 document.getElementById('terms').addEventListener('change', () => {
  hideTooltip(document.getElementById('terms-tooltip'));
});

 document.getElementById('password').addEventListener('click', () => {
  hideTooltip(document.getElementById('weak-password-tooltip'));
});

 document.getElementById('confirm_password').addEventListener('click', () => {
  hideTooltip(document.getElementById('dont-match-password-tooltip'));
});

 document.getElementById('email').addEventListener('click', () => {
  hideTooltip(document.getElementById('email-tooltip'));
});