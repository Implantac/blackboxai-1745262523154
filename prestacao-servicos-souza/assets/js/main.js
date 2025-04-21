// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initFormValidation();
    initFAQAccordion();
    initPriceCalculator();
    initBackToTop();
    initCookieConsent();
    initScrollAnimations();
});

// Mobile Menu
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            menuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
            mobileMenu.setAttribute('aria-hidden', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                menuButton.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }
}

// Form Validation
function initFormValidation() {
    const form = document.querySelector('form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', validateInput);
    });

    form.addEventListener('submit', handleSubmit);
}

function validateInput(e) {
    const input = e.target;
    const errorDiv = input.nextElementSibling?.classList.contains('form-error') 
        ? input.nextElementSibling 
        : document.createElement('div');
    
    if (!input.nextElementSibling?.classList.contains('form-error')) {
        errorDiv.classList.add('form-error');
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    }

    input.classList.remove('input-error', 'input-success');
    errorDiv.textContent = '';

    if (input.required && !input.value) {
        input.classList.add('input-error');
        errorDiv.textContent = 'Este campo é obrigatório';
        return false;
    }

    if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            input.classList.add('input-error');
            errorDiv.textContent = 'Email inválido';
            return false;
        }
    }

    if (input.type === 'tel' && input.value) {
        const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
        if (!phoneRegex.test(input.value)) {
            input.classList.add('input-error');
            errorDiv.textContent = 'Formato: (99) 99999-9999';
            return false;
        }
    }

    input.classList.add('input-success');
    return true;
}

function handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateInput({ target: input })) {
            isValid = false;
        }
    });

    if (isValid) {
        showLoadingState(form);
        // Simulate form submission
        setTimeout(() => {
            hideLoadingState(form);
            showSuccessMessage();
            form.reset();
        }, 2000);
    }
}

function showLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner mr-2"></span>Enviando...';
    submitButton.dataset.originalText = originalText;
}

function hideLoadingState(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.innerHTML = submitButton.dataset.originalText;
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
        <div class="text-center">
            <i class="fas fa-check-circle text-5xl text-primary-600 mb-4"></i>
            <h3 class="text-2xl font-bold mb-2">Agendamento Recebido!</h3>
            <p class="text-gray-600">Entraremos em contato em breve para confirmar seu agendamento.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="mt-6 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Fechar</button>
        </div>
    `;
    document.body.appendChild(successMessage);
    setTimeout(() => successMessage.classList.add('visible'), 100);
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all items
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                    const faqAnswer = faq.querySelector('.faq-answer');
                    if (faqAnswer) {
                        faqAnswer.style.maxHeight = '0';
                    }
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });
}

// Price Calculator
function initPriceCalculator() {
    const calculator = document.querySelector('.calculator-form');
    if (!calculator) return;

    const serviceSelect = document.getElementById('calc-service');
    const areaInput = document.getElementById('calc-area');
    const frequencySelect = document.getElementById('calc-frequency');
    const resultDiv = document.querySelector('.calculator-result');

    if (serviceSelect && areaInput && frequencySelect && resultDiv) {
        [serviceSelect, areaInput, frequencySelect].forEach(input => {
            input.addEventListener('change', calculatePrice);
            input.addEventListener('input', calculatePrice);
        });
    }
}

function calculatePrice() {
    const serviceType = document.getElementById('calc-service').value;
    const area = parseFloat(document.getElementById('calc-area').value) || 0;
    const frequency = document.getElementById('calc-frequency').value;
    const resultDiv = document.querySelector('.calculator-result');

    if (!serviceType || !area) {
        resultDiv.innerHTML = `
            <p class="text-center text-gray-600">Preencha os campos para calcular o valor</p>
        `;
        return;
    }

    let basePrice = 0;
    switch(serviceType) {
        case 'residencial':
            basePrice = 120;
            break;
        case 'comercial':
            basePrice = 150;
            break;
        case 'pos-obra':
            basePrice = 200;
            break;
    }

    let areaMultiplier = Math.ceil(area / 50);
    let frequencyDiscount = 1;
    switch(frequency) {
        case 'semanal':
            frequencyDiscount = 0.85;
            break;
        case 'quinzenal':
            frequencyDiscount = 0.9;
            break;
        case 'mensal':
            frequencyDiscount = 0.95;
            break;
    }

    const finalPrice = basePrice * areaMultiplier * frequencyDiscount;
    
    resultDiv.innerHTML = `
        <div class="text-center">
            <p class="text-2xl font-semibold text-primary-600">R$ ${finalPrice.toFixed(2)}</p>
            <p class="text-sm text-gray-600 mt-2">*Valor aproximado. O orçamento final pode variar conforme avaliação presencial.</p>
            ${frequency !== 'unica' ? `<p class="text-sm text-primary-600 mt-1">Desconto aplicado: ${((1 - frequencyDiscount) * 100).toFixed(0)}%</p>` : ''}
        </div>
    `;
}

// Cookie Consent
function initCookieConsent() {
    if (localStorage.getItem('cookieConsent')) return;

    const banner = document.getElementById('cookie-banner');
    if (banner) {
        setTimeout(() => banner.classList.add('visible'), 1000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookie-banner')?.remove();
}

function rejectCookies() {
    localStorage.setItem('cookieConsent', 'rejected');
    document.getElementById('cookie-banner')?.remove();
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => observer.observe(element));
}

// Phone number mask
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
                e.target.value = value;
            }
        });
    });
});
