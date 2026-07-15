function initContactForm() {
    const form = document.querySelector('#contactForm');
    if (!form) return;

    const messageTextarea = form.querySelector('textarea[name="message"]');
    const charCountEl = document.querySelector('#charCount');

    if (messageTextarea && charCountEl) {
        messageTextarea.addEventListener('input', () => {
            charCountEl.textContent = messageTextarea.value.length;
            if (messageTextarea.value.length > 500) {
                charCountEl.parentElement.classList.add('warning');
            } else {
                charCountEl.parentElement.classList.remove('warning');
            }
        });
        messageTextarea.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 300) + 'px';
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(form);
    });
}

function setupCharCounter(textarea, counter) {
    const maxLength = textarea.getAttribute('maxlength') || 500;

    textarea.addEventListener('input', () => {
        const remaining = maxLength - textarea.value.length;
        counter.textContent = `${remaining} characters remaining`;

        if (remaining < 50) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }

        if (remaining < 0) {
            counter.classList.add('error');
        } else {
            counter.classList.remove('error');
        }
    });
}

function setupAutoResize(textarea) {
    textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 300) + 'px';
    });
}

function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const validation = validateForm(data);

    if (!validation.isValid) {
        showValidationErrors(form, validation.errors);
        return;
    }

    clearValidationErrors(form);

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        form.reset();

        const messageTextarea = form.querySelector('textarea[name="message"]');
        if (messageTextarea) {
            messageTextarea.style.height = 'auto';
        }

        const charCounter = form.querySelector('.char-counter');
        if (charCounter) {
            charCounter.textContent = '';
        }

        showToast('Message sent successfully! I will get back to you soon.', 'success');
    }, 1500);
}

function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Please enter a valid name (min 2 characters)' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    if (data.phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
        }
    }

    if (!data.subject || data.subject.trim().length < 3) {
        errors.push({ field: 'subject', message: 'Please enter a subject (min 3 characters)' });
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push({ field: 'message', message: 'Please enter a message (min 10 characters)' });
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

function showValidationErrors(form, errors) {
    errors.forEach(error => {
        const field = form.querySelector(`[name="${error.field}"]`);
        if (field) {
            field.classList.add('error');
            let errorEl = field.parentElement.querySelector('.field-error');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'field-error';
                field.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = error.message;
        }
    });
}

function clearValidationErrors(form) {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    form.querySelectorAll('.field-error').forEach(el => el.remove());
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    toast.querySelector('.toast-close').addEventListener('click', () => {
        removeToast(toast);
    });

    setTimeout(() => {
        removeToast(toast);
    }, 5000);
}

function removeToast(toast) {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
}

function redirectToWhatsApp(phone, message) {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(url, '_blank');
}
