// Configuración completa de países con validación y formateo de visualización
const phoneConfig = {
    // 8 dígitos (formato 4 - 4)
    '+503': { country: 'El Salvador', digits: '8', example: '7888 7794', hint: 'El Salvador: 8 dígitos', format: (d) => d.length <= 4 ? d : d.slice(0, 4) + ' ' + d.slice(4, 8) },
    '+502': { country: 'Guatemala', digits: '8', example: '2234 5678', hint: 'Guatemala: 8 dígitos', format: (d) => d.length <= 4 ? d : d.slice(0, 4) + ' ' + d.slice(4, 8) },
    '+504': { country: 'Honduras', digits: '8', example: '9234 5678', hint: 'Honduras: 8 dígitos', format: (d) => d.length <= 4 ? d : d.slice(0, 4) + ' ' + d.slice(4, 8) },
    '+505': { country: 'Nicaragua', digits: '8', example: '8234 5678', hint: 'Nicaragua: 8 dígitos', format: (d) => d.length <= 4 ? d : d.slice(0, 4) + ' ' + d.slice(4, 8) },
    '+506': { country: 'Costa Rica', digits: '8', example: '8888 8888', hint: 'Costa Rica: 8 dígitos', format: (d) => d.length <= 4 ? d : d.slice(0, 4) + ' ' + d.slice(4, 8) },
    '+507': { country: 'Panamá', digits: '8', example: '6234 5678', hint: 'Panamá: 8 dígitos', format: (d) => d.length <= 4 ? d : d.slice(0, 4) + ' ' + d.slice(4, 8) },
    '+591': { country: 'Bolivia', digits: '8', example: '7123 4567', hint: 'Bolivia: 8 dígitos', format: (d) => d.length <= 4 ? d : d.slice(0, 4) + ' ' + d.slice(4, 8) },
    '+53':  { country: 'Cuba', digits: '8', example: '5123 4567', hint: 'Cuba: 8 dígitos', format: (d) => d.length <= 4 ? d : d.slice(0, 4) + ' ' + d.slice(4, 8) },

    // 10 dígitos (formato 3 - 3 - 4)
    '+57':  { country: 'Colombia', digits: '10', example: '300 123 4567', hint: 'Colombia: 10 dígitos', format: (d) => d.length <= 3 ? d : (d.length <= 6 ? d.slice(0, 3) + ' ' + d.slice(3) : d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6, 10)) },
    '+58':  { country: 'Venezuela', digits: '10', example: '412 123 4567', hint: 'Venezuela: 10 dígitos', format: (d) => d.length <= 3 ? d : (d.length <= 6 ? d.slice(0, 3) + ' ' + d.slice(3) : d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6, 10)) },
    '+1':   { country: 'Rep. Dominicana / Puerto Rico', digits: '10', example: '809 123 4567', hint: '10 dígitos', format: (d) => d.length <= 3 ? d : (d.length <= 6 ? d.slice(0, 3) + ' ' + d.slice(3) : d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6, 10)) },

    // México: 10 dígitos (formato 2 - 4 - 4)
    '+52':  { country: 'México', digits: '10', example: '55 1234 5678', hint: 'México: 10 dígitos', format: (d) => d.length <= 2 ? d : (d.length <= 6 ? d.slice(0, 2) + ' ' + d.slice(2) : d.slice(0, 2) + ' ' + d.slice(2, 6) + ' ' + d.slice(6, 10)) },

    // Argentina: 10 dígitos (formato 2 - 4 - 4 o con 9 al inicio)
    '+54':  { country: 'Argentina', digits: '10-11', example: '11 2345 6789', hint: 'Argentina: 10 dígitos', format: (d) => {
        if (d.startsWith('9')) {
            const rest = d.slice(1);
            if (rest.length <= 2) return '9 ' + rest;
            if (rest.length <= 6) return '9 ' + rest.slice(0, 2) + ' ' + rest.slice(2);
            return '9 ' + rest.slice(0, 2) + ' ' + rest.slice(2, 6) + ' ' + rest.slice(6, 10);
        }
        if (d.length <= 2) return d;
        if (d.length <= 6) return d.slice(0, 2) + ' ' + d.slice(2);
        return d.slice(0, 2) + ' ' + d.slice(2, 6) + ' ' + d.slice(6, 10);
    }},

    // 9 dígitos (formato 3 - 3 - 3)
    '+51':  { country: 'Perú', digits: '9', example: '912 345 678', hint: 'Perú: 9 dígitos', format: (d) => d.length <= 3 ? d : (d.length <= 6 ? d.slice(0, 3) + ' ' + d.slice(3) : d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6, 9)) },
    '+595': { country: 'Paraguay', digits: '9', example: '961 234 567', hint: 'Paraguay: 9 dígitos', format: (d) => d.length <= 3 ? d : (d.length <= 6 ? d.slice(0, 3) + ' ' + d.slice(3) : d.slice(0, 3) + ' ' + d.slice(3, 6) + ' ' + d.slice(6, 9)) },
    '+598': { country: 'Uruguay', digits: '8-9', example: '91 234 567', hint: 'Uruguay: 8-9 dígitos', format: (d) => d.length <= 2 ? d : (d.length <= 5 ? d.slice(0, 2) + ' ' + d.slice(2) : d.slice(0, 2) + ' ' + d.slice(2, 5) + ' ' + d.slice(5, 9)) },

    // Chile: 9 dígitos móvil (1 - 4 - 4)
    '+56':  { country: 'Chile', digits: '9', example: '9 1234 5678', hint: 'Chile: 9 dígitos', format: (d) => d.length <= 1 ? d : (d.length <= 5 ? d.slice(0, 1) + ' ' + d.slice(1) : d.slice(0, 1) + ' ' + d.slice(1, 5) + ' ' + d.slice(5, 9)) },

    // Ecuador: 9 dígitos (2 - 3 - 4)
    '+593': { country: 'Ecuador', digits: '9', example: '99 123 4567', hint: 'Ecuador: 9 dígitos', format: (d) => d.length <= 2 ? d : (d.length <= 5 ? d.slice(0, 2) + ' ' + d.slice(2) : d.slice(0, 2) + ' ' + d.slice(2, 5) + ' ' + d.slice(5, 9)) },

    // Brasil: 10-11 dígitos (2 - 5 - 4 o 2 - 4 - 4)
    '+55':  { country: 'Brasil', digits: '10-11', example: '11 98765 4321', hint: 'Brasil: 10-11 dígitos', format: (d) => {
        if (d.length <= 2) return d;
        if (d.length <= 7) return d.slice(0, 2) + ' ' + d.slice(2);
        if (d.length <= 10) return d.slice(0, 2) + ' ' + d.slice(2, 6) + ' ' + d.slice(6, 10);
        return d.slice(0, 2) + ' ' + d.slice(2, 7) + ' ' + d.slice(7, 11);
    }}
};

// Formatear solo los dígitos según el país
function formatPhoneDigits(countryCode, digitsOnly) {
    const clean = String(digitsOnly || '').replace(/\D/g, '');
    const config = phoneConfig[countryCode];
    if (config && typeof config.format === 'function') {
        return config.format(clean);
    }
    // Formato por defecto según longitud
    if (clean.length === 8) {
        return clean.slice(0, 4) + (clean.length > 4 ? ' ' + clean.slice(4) : '');
    }
    if (clean.length === 9) {
        return clean.slice(0, 3) + (clean.length > 3 ? ' ' + clean.slice(3, 6) : '') + (clean.length > 6 ? ' ' + clean.slice(6) : '');
    }
    if (clean.length === 10) {
        return clean.slice(0, 3) + (clean.length > 3 ? ' ' + clean.slice(3, 6) : '') + (clean.length > 6 ? ' ' + clean.slice(6) : '');
    }
    return clean;
}

// Formatear número completo con código de país (ej: +503 7888 7794)
function formatFullPhoneNumber(rawString, explicitCountryCode) {
    if (!rawString || rawString === '-') return rawString;
    let str = String(rawString).trim();
    let countryCode = explicitCountryCode || '';
    let digits = '';

    if (!countryCode) {
        if (str.startsWith('+')) {
            const knownCodes = Object.keys(phoneConfig).sort((a, b) => b.length - a.length);
            for (const code of knownCodes) {
                if (str.startsWith(code)) {
                    countryCode = code;
                    digits = str.slice(code.length).replace(/\D/g, '');
                    break;
                }
            }
        }
    } else {
        if (str.startsWith(countryCode)) {
            digits = str.slice(countryCode.length).replace(/\D/g, '');
        } else {
            digits = str.replace(/\D/g, '');
        }
    }

    if (!countryCode) {
        return str;
    }

    const formattedDigits = formatPhoneDigits(countryCode, digits);
    return `${countryCode} ${formattedDigits}`.trim();
}

// Validar longitud del teléfono
function validatePhoneLength() {
    const countrySelect = document.getElementById('country');
    const phoneInput = document.getElementById('telefono');
    if (!countrySelect || !phoneInput) return true;
    const countryCode = countrySelect.value;
    const phoneNumber = phoneInput.value.replace(/\D/g, '');
    const config = phoneConfig[countryCode];
    if (!config) return phoneNumber.length >= 7 && phoneNumber.length <= 15;
    const lengths = config.digits.split('-').map(Number);
    const phoneLen = phoneNumber.length;
    if (lengths.length === 2) {
        return phoneLen >= lengths[0] && phoneLen <= lengths[1];
    }
    return phoneLen === lengths[0];
}

// Limitar y formatear entrada en tiempo real según el país
function setupPhoneInputLimiter() {
    const phoneInput = document.getElementById('telefono');
    const countrySelect = document.getElementById('country');
    if (!phoneInput || !countrySelect) return;
    
    phoneInput.addEventListener('input', function(e) {
        const countryCode = countrySelect.value;
        const config = countryCode ? phoneConfig[countryCode] : null;
        let onlyDigits = e.target.value.replace(/\D/g, '');
        
        if (config) {
            const lengths = config.digits.split('-').map(Number);
            const maxDigits = lengths.length === 2 ? lengths[1] : lengths[0];
            if (onlyDigits.length > maxDigits) {
                onlyDigits = onlyDigits.substring(0, maxDigits);
            }
            e.target.value = formatPhoneDigits(countryCode, onlyDigits);
        } else {
            e.target.value = onlyDigits;
        }
    });
}

// Actualizar placeholder y longitud según selección de país
function updatePhonePlaceholder() {
    const countrySelect = document.getElementById('country');
    const phoneInput = document.getElementById('telefono');
    if (!countrySelect || !phoneInput) return;
    const countryCode = countrySelect.value;
    const config = phoneConfig[countryCode];
    if (config) {
        phoneInput.placeholder = 'Ej: ' + config.example;
        const lengths = config.digits.split('-').map(Number);
        const maxDigits = lengths.length === 2 ? lengths[1] : lengths[0];
        phoneInput.maxLength = maxDigits + 5;
    } else {
        phoneInput.placeholder = 'Ej: 11 1234 5678';
        phoneInput.maxLength = 20;
    }
}

// Inicializar al cargar el DOM
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        setupPhoneInputLimiter();
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
            countrySelect.addEventListener('change', function() {
                updatePhonePlaceholder();
                const phoneInput = document.getElementById('telefono');
                if (phoneInput) {
                    phoneInput.value = '';
                    phoneInput.focus();
                }
            });
        }
    });
}

// Exponer en window si aplica
if (typeof window !== 'undefined') {
    window.phoneConfig = phoneConfig;
    window.formatPhoneDigits = formatPhoneDigits;
    window.formatFullPhoneNumber = formatFullPhoneNumber;
    window.validatePhoneLength = validatePhoneLength;
    window.updatePhonePlaceholder = updatePhonePlaceholder;
    window.setupPhoneInputLimiter = setupPhoneInputLimiter;
}
