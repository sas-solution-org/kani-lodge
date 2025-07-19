// ===== CONTACT JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFormValidation();
    initMapInteraction();
    
    console.log('📧 Contact functionality loaded successfully!');
});

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            submitForm(this);
        }
    });
    
    // Auto-resize textarea
    const textarea = contactForm.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', autoResizeTextarea);
    }
    
    // Format phone number input
    const phoneInput = contactForm.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
    
    // Dynamic form behavior based on selections
    const lodgeSelect = contactForm.querySelector('#lodge');
    const travelersSelect = contactForm.querySelector('#travelers');
    
    if (lodgeSelect && travelersSelect) {
        lodgeSelect.addEventListener('change', updateFormBasedOnLodge);
        travelersSelect.addEventListener('change', updatePricingEstimate);
    }
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional validations
    const email = form.querySelector('#email');
    if (email && email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Veuillez entrer une adresse email valide');
        isValid = false;
    }
    
    const phone = form.querySelector('#phone');
    if (phone && phone.value && !isValidPhone(phone.value)) {
        showFieldError(phone, 'Veuillez entrer un numéro de téléphone valide');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Ce champ est requis');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Veuillez entrer une adresse email valide');
        return false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Veuillez entrer un numéro de téléphone valide');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#dc3545';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// ===== FORM SUBMISSION =====
function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    submitButton.style.opacity = '0.7';
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    data.page = 'Contact';
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => {
        // Mock successful submission
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.opacity = '1';
        
        // Log submission (for demo purposes)
        console.log('📨 Form submitted:', data);
        
        // In a real implementation, you would send this to your backend:
        // sendToBackend(data);
        
    }, 2000);
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #6B8E23, #8BAE3B);
        color: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 2000;
        max-width: 90vw;
        animation: fadeInScale 0.5s ease;
    `;
    
    successDiv.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: white;">✅ Message Envoyé !</h3>
        <p style="margin-bottom: 1.5rem; color: rgba(255,255,255,0.9);">
            Merci pour votre demande. Notre équipe vous contactera dans les 24 heures.
        </p>
        <button onclick="this.parentElement.remove()" 
                style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer;">
            Fermer
        </button>
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
    
    // Add the animation keyframes
    if (!document.querySelector('#successAnimation')) {
        const style = document.createElement('style');
        style.id = 'successAnimation';
        style.textContent = `
            @keyframes fadeInScale {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== FORM HELPERS =====
function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 10) {
        // Format as: +33 1 23 45 67 89
        if (value.startsWith('33')) {
            value = '+' + value.substring(0, 2) + ' ' + value.substring(2, 3) + ' ' + 
                   value.substring(3, 5) + ' ' + value.substring(5, 7) + ' ' + 
                   value.substring(7, 9) + ' ' + value.substring(9, 11);
        } else if (value.startsWith('0')) {
            // French mobile format
            value = value.substring(0, 2) + ' ' + value.substring(2, 4) + ' ' + 
                   value.substring(4, 6) + ' ' + value.substring(6, 8) + ' ' + 
                   value.substring(8, 10);
        }
    }
    
    e.target.value = value;
}

function updateFormBasedOnLodge() {
    const lodgeSelect = document.getElementById('lodge');
    const selectedLodge = lodgeSelect.value;
    
    // Update pricing estimates based on selected lodge
    const priceGuide = {
        'masai': { min: 320, max: 450, currency: '€' },
        'baobab': { min: 280, max: 380, currency: '€' },
        'zambeze': { min: 450, max: 650, currency: '€' },
        'all': { min: 280, max: 650, currency: '€' }
    };
    
    const pricing = priceGuide[selectedLodge];
    if (pricing) {
        // You could show a price estimate here
        console.log(`Prix estimé: ${pricing.min}-${pricing.max}${pricing.currency} par personne/nuit`);
    }
}

function updatePricingEstimate() {
    const lodgeSelect = document.getElementById('lodge');
    const travelersSelect = document.getElementById('travelers');
    const budgetSelect = document.getElementById('budget');
    
    const lodge = lodgeSelect.value;
    const travelers = travelersSelect.value;
    
    if (lodge && travelers) {
        // Generate helpful suggestions
        generateTravelSuggestions(lodge, travelers);
    }
}

function generateTravelSuggestions(lodge, travelers) {
    const suggestions = {
        'masai': {
            '1': 'Safari privé recommandé pour une expérience personnalisée',
            '2': 'Parfait pour un voyage romantique ou une lune de miel',
            '3-4': 'Idéal pour une famille ou un petit groupe d\'amis',
            '5-8': 'Excellent pour un voyage en groupe avec guides dédiés',
            '9+': 'Contactez-nous pour un devis groupe personnalisé'
        },
        'baobab': {
            '1': 'Retraite nature parfaite pour la reconnexion',
            '2': 'Expérience immersive dans la nature tanzanienne',
            '3-4': 'Aventure familiale écologique inoubliable',
            '5-8': 'Camp parfait pour groupes d\'amis aventuriers',
            '9+': 'Privatisation possible, contactez-nous'
        },
        'zambeze': {
            '1': 'Luxe et nature pour un séjour d\'exception',
            '2': 'Romance au bord du fleuve mythique',
            '3-4': 'Confort familial avec activités aquatiques',
            '5-8': 'Groupe premium avec spa et gastronomie',
            '9+': 'Événement privé possible, devis sur mesure'
        }
    };
    
    const suggestion = suggestions[lodge]?.[travelers];
    if (suggestion) {
        // You could display this suggestion in the UI
        console.log(`💡 Suggestion: ${suggestion}`);
    }
}

// ===== MAP INTERACTION =====
function initMapInteraction() {
    const mapPlaceholders = document.querySelectorAll('.map-placeholder');
    
    mapPlaceholders.forEach(map => {
        map.addEventListener('click', function() {
            // In a real implementation, this would open Google Maps
            const address = "123 Avenue des Champs-Élysées, 75008 Paris, France";
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            
            // Show confirmation before opening external link
            if (confirm('Ouvrir dans Google Maps ?')) {
                window.open(mapsUrl, '_blank');
            }
        });
        
        // Add hover effect
        map.style.cursor = 'pointer';
        map.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        map.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ===== EMERGENCY CONTACT =====
function initEmergencyContact() {
    const emergencyNumbers = document.querySelectorAll('.emergency-contact strong');
    
    emergencyNumbers.forEach(number => {
        number.style.cursor = 'pointer';
        number.addEventListener('click', function() {
            const phoneNumber = this.textContent.replace(/\s/g, '');
            
            if (confirm(`Appeler ${this.textContent} ?`)) {
                window.location.href = `tel:${phoneNumber}`;
            }
        });
    });
}

// ===== FORM AUTO-SAVE =====
function initFormAutoSave() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Load saved data
        const savedValue = localStorage.getItem(`contactForm_${input.name}`);
        if (savedValue && input.type !== 'checkbox') {
            input.value = savedValue;
        } else if (savedValue && input.type === 'checkbox') {
            input.checked = savedValue === 'true';
        }
        
        // Save on input
        input.addEventListener('input', function() {
            if (this.type === 'checkbox') {
                localStorage.setItem(`contactForm_${this.name}`, this.checked);
            } else {
                localStorage.setItem(`contactForm_${this.name}`, this.value);
            }
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`contactForm_${input.name}`);
        });
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function initAccessibilityFeatures() {
    // Add ARIA labels and descriptions
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Add form description
    const formDescription = document.createElement('div');
    formDescription.id = 'form-description';
    formDescription.className = 'sr-only';
    formDescription.textContent = 'Formulaire de contact pour demander des informations sur nos lodges et camps écologiques en Afrique';
    form.parentNode.insertBefore(formDescription, form);
    
    form.setAttribute('aria-describedby', 'form-description');
    
    // Add field descriptions
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    requiredFields.forEach(field => {
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label && !label.textContent.includes('*')) {
            label.innerHTML += ' <span aria-label="obligatoire">*</span>';
        }
    });
    
    // Add error announcements
    const errorContainer = document.createElement('div');
    errorContainer.id = 'form-errors';
    errorContainer.setAttribute('aria-live', 'polite');
    errorContainer.setAttribute('aria-atomic', 'true');
    errorContainer.className = 'sr-only';
    form.appendChild(errorContainer);
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    initEmergencyContact();
    initFormAutoSave();
    initAccessibilityFeatures();
});

// ===== UTILITY FUNCTIONS =====

// Send data to backend (mock function)
function sendToBackend(data) {
    // Mock API call
    return fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('✅ Form submitted successfully:', result);
        return result;
    })
    .catch(error => {
        console.error('❌ Form submission error:', error);
        throw error;
    });
}

// ===== MODULE EXPORTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initContactForm,
        initFormValidation,
        initMapInteraction,
        validateForm,
        submitForm
    };
}