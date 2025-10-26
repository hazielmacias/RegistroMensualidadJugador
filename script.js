// ===================================
// IMPORTACIONES DE FIREBASE
// ===================================
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// ===================================
// PANTALLA DE CARGA INICIAL
// ===================================
window.addEventListener('load', () => {
    const initialLoading = document.getElementById('initialLoading');
    const body = document.body;
    
    // Ocultar pantalla de carga inicial después de 2 segundos
    setTimeout(() => {
        if (initialLoading) {
            initialLoading.classList.add('hidden');
        }
        if (body) {
            body.classList.remove('loading');
        }
    }, 2000);
});

// ===================================
// ELEMENTOS DEL DOM
// ===================================
const form = document.getElementById('registrationForm');
const fileInput = document.getElementById('comprobante');
const fileLabel = document.getElementById('fileLabel');
const filePreview = document.getElementById('filePreview');
const previewImage = document.getElementById('previewImage');
const fileNameText = document.getElementById('fileNameText');
const changeImageBtn = document.getElementById('changeImageBtn');
const deleteImageBtn = document.getElementById('deleteImageBtn');
const loadingScreen = document.getElementById('loadingScreen');
const successScreen = document.getElementById('successScreen');

// Nuevos elementos
const conceptoPagoSelect = document.getElementById('conceptoPago');
const otroConceptoContainer = document.getElementById('otroConceptoContainer');
const otroConceptoInput = document.getElementById('otroConcepto');
const fechaAsignadaContainer = document.querySelector('[for="fechaAsignada"]').closest('.form-field');
const tipoPagoSelect = document.getElementById('tipoPago');
const cantidadEfectivoContainer = document.getElementById('cantidadEfectivoContainer');
const recibioContainer = document.getElementById('recibioContainer');
const cantidadEfectivoInput = document.getElementById('cantidadEfectivo');
const recibioInput = document.getElementById('recibio');

// ===================================
// MOSTRAR/OCULTAR CAMPO "TIPO DE PAGO"
// ===================================
if (tipoPagoSelect) {
    tipoPagoSelect.addEventListener('change', (e) => {
        if (e.target.value === 'Efectivo') {
            cantidadEfectivoContainer.classList.remove('hidden');
            recibioContainer.classList.remove('hidden');
            cantidadEfectivoInput.setAttribute('required', 'required');
            recibioInput.setAttribute('required', 'required');
        } else {
            cantidadEfectivoContainer.classList.add('hidden');
            recibioContainer.classList.add('hidden');
            cantidadEfectivoInput.removeAttribute('required');
            recibioInput.removeAttribute('required');
            cantidadEfectivoInput.value = '';
            recibioInput.value = '';
            clearError('CantidadEfectivo');
            clearError('Recibio');
        }
    });
}

// ===================================
// MOSTRAR/OCULTAR CAMPO "OTRO CONCEPTO" Y FECHA ASIGNADA
// ===================================
if (conceptoPagoSelect) {
    conceptoPagoSelect.addEventListener('change', (e) => {
        const valorConcepto = e.target.value;
        
        // Mostrar "Otro Concepto" si selecciona "Otro"
        if (valorConcepto === 'Otro') {
            otroConceptoContainer.classList.remove('hidden');
            otroConceptoInput.setAttribute('required', 'required');
        } else {
            otroConceptoContainer.classList.add('hidden');
            otroConceptoInput.removeAttribute('required');
            otroConceptoInput.value = '';
            clearError('OtroConcepto');
        }
        
        // Mostrar "Fecha Asignada" SOLO si es "Mensualidad"
        if (valorConcepto === 'Mensualidad') {
            fechaAsignadaContainer.classList.remove('hidden');
            document.getElementById('fechaAsignada').setAttribute('required', 'required');
        } else {
            fechaAsignadaContainer.classList.add('hidden');
            document.getElementById('fechaAsignada').removeAttribute('required');
            document.getElementById('fechaAsignada').value = '';
            clearError('FechaAsignada');
        }
    });
}

// ===================================
// MOSTRAR PREVIEW DE IMAGEN
// ===================================
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Verificar que es una imagen
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona solo imágenes');
                fileInput.value = '';
                return;
            }

            // Crear preview
            const reader = new FileReader();
            reader.onload = (event) => {
                previewImage.src = event.target.result;
                fileNameText.textContent = file.name;
                fileLabel.style.display = 'none';
                filePreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });
}

// ===================================
// CAMBIAR IMAGEN
// ===================================
if (changeImageBtn) {
    changeImageBtn.addEventListener('click', () => {
        fileInput.click();
    });
}

// ===================================
// ELIMINAR IMAGEN
// ===================================
if (deleteImageBtn) {
    deleteImageBtn.addEventListener('click', () => {
        fileInput.value = '';
        previewImage.src = '';
        fileNameText.textContent = '';
        filePreview.classList.add('hidden');
        fileLabel.style.display = 'flex';
    });
}

// ===================================
// VALIDACIÓN DE TELÉFONO
// ===================================
const contactoInput = document.getElementById('contacto');

if (contactoInput) {
    contactoInput.addEventListener('input', (e) => {
        // Solo permite números
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        // Limita a 10 dígitos
        if (e.target.value.length > 10) {
            e.target.value = e.target.value.slice(0, 10);
        }
    });
}

// ===================================
// FUNCIONES DE VALIDACIÓN
// ===================================
function showError(fieldId, message) {
    const errorElement = document.getElementById(`error${fieldId}`);
    const inputElement = document.getElementById(fieldId.toLowerCase()) || 
                         document.getElementById(fieldId.charAt(0).toLowerCase() + fieldId.slice(1));
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
    
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(`error${fieldId}`);
    const inputElement = document.getElementById(fieldId.toLowerCase()) || 
                         document.getElementById(fieldId.charAt(0).toLowerCase() + fieldId.slice(1));
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('active');
    }
    
    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

function clearAllErrors() {
    const errorIds = ['Nombre', 'Categoria', 'Ciudad', 'Contacto', 'TipoPago', 'Concepto', 'OtroConcepto', 
                      'Monto', 'FechaAsignada', 'Fecha', 'Folio', 'Comprobante', 'CantidadEfectivo', 'Recibio'];
    errorIds.forEach(id => clearError(id));
}

function validateForm() {
    clearAllErrors();
    let isValid = true;
    
    // Validar nombre
    const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
    if (!nombreCompleto) {
        showError('Nombre', 'El nombre es obligatorio');
        isValid = false;
    } else if (nombreCompleto.length < 3) {
        showError('Nombre', 'El nombre debe tener al menos 3 caracteres');
        isValid = false;
    }
    
    // Validar categoría
    const categoria = document.getElementById('categoria').value;
    if (!categoria) {
        showError('Categoria', 'Debes seleccionar una categoría');
        isValid = false;
    }
    
    // Validar ciudad
    const ciudad = document.getElementById('ciudad').value.trim();
    if (!ciudad) {
        showError('Ciudad', 'La ciudad es obligatoria');
        isValid = false;
    } else if (ciudad.length < 2) {
        showError('Ciudad', 'La ciudad debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    // Validar contacto
    const contacto = document.getElementById('contacto').value.trim();
    if (!contacto) {
        showError('Contacto', 'El teléfono es obligatorio');
        isValid = false;
    } else if (contacto.length !== 10) {
        showError('Contacto', 'El teléfono debe tener exactamente 10 dígitos');
        isValid = false;
    } else if (!/^\d+$/.test(contacto)) {
        showError('Contacto', 'El teléfono solo debe contener números');
        isValid = false;
    }
    
    // Validar tipo de pago
    const tipoPago = document.getElementById('tipoPago').value;
    if (!tipoPago) {
        showError('TipoPago', 'Debes seleccionar el tipo de pago');
        isValid = false;
    }
    
    // Validar concepto de pago
    const conceptoPago = document.getElementById('conceptoPago').value;
    if (!conceptoPago) {
        showError('Concepto', 'Debes seleccionar el concepto de pago');
        isValid = false;
    }
    
    // Validar "Otro concepto" si está seleccionado
    if (conceptoPago === 'Otro') {
        const otroConcepto = document.getElementById('otroConcepto').value.trim();
        if (!otroConcepto) {
            showError('OtroConcepto', 'Debes especificar el concepto');
            isValid = false;
        } else if (otroConcepto.length < 3) {
            showError('OtroConcepto', 'El concepto debe tener al menos 3 caracteres');
            isValid = false;
        }
    }
    
    // Validar monto
    const monto = document.getElementById('monto').value;
    if (!monto || parseFloat(monto) <= 0) {
        showError('Monto', 'El monto debe ser mayor a 0');
        isValid = false;
    }
    
    // Validar fecha asignada solo si es "Mensualidad"
    if (conceptoPago === 'Mensualidad') {
        const fechaAsignada = document.getElementById('fechaAsignada').value;
        if (!fechaAsignada) {
            showError('FechaAsignada', 'Debes seleccionar la fecha asignada');
            isValid = false;
        }
    }
    
    // Validar fecha de pago
    const fechaPago = document.getElementById('fechaPago').value;
    if (!fechaPago) {
        showError('Fecha', 'La fecha de pago es obligatoria');
        isValid = false;
    }
    
    // Validar folio
    const folioComprobante = document.getElementById('folioComprobante').value.trim();
    if (!folioComprobante) {
        showError('Folio', 'El folio del comprobante es obligatorio');
        isValid = false;
    } else if (folioComprobante.length < 3) {
        showError('Folio', 'El folio debe tener al menos 3 caracteres');
        isValid = false;
    }
    
    // Validar comprobante
    const comprobanteFile = fileInput.files[0];
    if (!comprobanteFile) {
        showError('Comprobante', 'Debes seleccionar un comprobante de pago');
        isValid = false;
    } else if (!comprobanteFile.type.startsWith('image/')) {
        showError('Comprobante', 'El comprobante debe ser una imagen');
        isValid = false;
    }
    
    // Validar campos de efectivo solo si el tipo de pago es "Efectivo"
    if (tipoPago === 'Efectivo') {
        const cantidadEfectivo = document.getElementById('cantidadEfectivo').value;
        if (cantidadEfectivo === '' || cantidadEfectivo === null) {
            showError('CantidadEfectivo', 'Debes ingresar la cantidad en efectivo');
            isValid = false;
        } else if (parseFloat(cantidadEfectivo) < 0) {
            showError('CantidadEfectivo', 'La cantidad no puede ser negativa');
            isValid = false;
        }
        
        const recibio = document.getElementById('recibio').value;
        if (!recibio) {
            showError('Recibio', 'Debes seleccionar quién recibió el pago');
            isValid = false;
        }
    }
    
    return isValid;
}

// ===================================
// LIMPIAR ERRORES AL ESCRIBIR
// ===================================
const fieldsToWatch = [
    { id: 'nombreCompleto', error: 'Nombre' },
    { id: 'categoria', error: 'Categoria' },
    { id: 'ciudad', error: 'Ciudad' },
    { id: 'contacto', error: 'Contacto' },
    { id: 'tipoPago', error: 'TipoPago' },
    { id: 'conceptoPago', error: 'Concepto' },
    { id: 'otroConcepto', error: 'OtroConcepto' },
    { id: 'monto', error: 'Monto' },
    { id: 'fechaAsignada', error: 'FechaAsignada' },
    { id: 'fechaPago', error: 'Fecha' },
    { id: 'folioComprobante', error: 'Folio' },
    { id: 'comprobante', error: 'Comprobante' },
    { id: 'cantidadEfectivo', error: 'CantidadEfectivo' },
    { id: 'recibio', error: 'Recibio' }
];

fieldsToWatch.forEach(field => {
    const element = document.getElementById(field.id);
    if (element) {
        const eventType = element.tagName === 'SELECT' ? 'change' : 'input';
        element.addEventListener(eventType, () => clearError(field.error));
    }
});

// ===================================
// FUNCIONES DE PANTALLA
// ===================================
function showLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
}

function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

function showSuccessScreen() {
    if (successScreen) {
        successScreen.classList.remove('hidden');
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            successScreen.classList.add('hidden');
        }, 3000);
    }
}

// ===================================
// PREPARAR INFO DE IMAGEN SIN SUBIRLA
// ===================================
function prepareImageInfo(file) {
    return {
        nombreArchivo: file.name,
        tipo: file.type,
        tamano: file.size,
        ultimaModificacion: new Date(file.lastModified).toISOString()
    };
}

// ===================================
// GUARDAR REGISTRO EN FIRESTORE
// ===================================
async function saveRegistration(data) {
    try {
        // Referencia a la colección
        const registrosRef = collection(window.db, 'registros');
        
        // Agregar documento
        const docRef = await addDoc(registrosRef, {
            ...data,
            fechaRegistro: serverTimestamp(),
            estado: 'pendiente'
        });
        
        console.log('✅ Registro guardado con ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('❌ Error al guardar registro:', error);
        throw new Error('No se pudo guardar el registro. Por favor intenta de nuevo.');
    }
}

// ===================================
// MANEJAR ENVÍO DEL FORMULARIO
// ===================================
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('📋 Formulario enviado, iniciando proceso...');
        
        // Validar formulario
        if (!validateForm()) {
            console.log('❌ Validación fallida');
            // Scroll al primer error
            const firstError = document.querySelector('.error-message.active');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        console.log('✅ Validación exitosa');
        
        // Mostrar pantalla de carga
        showLoadingScreen();
        console.log('⏳ Pantalla de carga mostrada');
        
        try {
            // Obtener datos del formulario
            const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
            const categoria = document.getElementById('categoria').value;
            const ciudad = document.getElementById('ciudad').value.trim();
            const contacto = document.getElementById('contacto').value.trim();
            const tipoPago = document.getElementById('tipoPago').value;
            const conceptoPago = document.getElementById('conceptoPago').value;
            const otroConcepto = conceptoPago === 'Otro' ? document.getElementById('otroConcepto').value.trim() : '';
            const monto = parseFloat(document.getElementById('monto').value);
            const fechaAsignada = conceptoPago === 'Mensualidad' ? document.getElementById('fechaAsignada').value : null;
            const fechaPago = document.getElementById('fechaPago').value;
            const folioComprobante = document.getElementById('folioComprobante').value.trim();
            const cantidadEfectivo = tipoPago === 'Efectivo' ? parseFloat(document.getElementById('cantidadEfectivo').value) : 0;
            const recibio = tipoPago === 'Efectivo' ? document.getElementById('recibio').value : 'N/A';
            const comprobanteFile = fileInput.files[0];
            
            console.log('📝 Datos del formulario:', {
                nombreCompleto,
                categoria,
                ciudad,
                contacto,
                tipoPago,
                conceptoPago,
                otroConcepto,
                monto,
                fechaAsignada,
                fechaPago,
                folioComprobante,
                cantidadEfectivo,
                recibio,
                tieneArchivo: !!comprobanteFile
            });
            
            // Verificar que Firebase está inicializado
            if (!window.db) {
                hideLoadingScreen();
                alert('Error: Firebase no está inicializado. Por favor recarga la página.');
                console.error('❌ Firebase no inicializado:', { db: window.db });
                return;
            }
            
            console.log('✅ Firebase verificado, procediendo...');
            
            // 1. Preparar información del comprobante (sin subirlo)
            let comprobanteInfo = null;
            if (comprobanteFile) {
                console.log('📄 Preparando información del comprobante...');
                comprobanteInfo = prepareImageInfo(comprobanteFile);
                console.log('✅ Información del comprobante preparada:', comprobanteInfo);
            }
            
            // 2. Preparar datos para Firestore
            const registroData = {
                nombreCompleto,
                categoria,
                ciudad,
                contacto,
                tipoPago,
                conceptoPago: conceptoPago === 'Otro' ? otroConcepto : conceptoPago,
                conceptoPagoOriginal: conceptoPago,
                monto,
                fechaAsignada: fechaAsignada ? `Día ${fechaAsignada} de cada mes` : null,
                fechaPago,
                folioComprobante,
                cantidadEfectivo,
                recibio,
                comprobante: comprobanteInfo
            };
            
            console.log('💾 Datos preparados para Firestore:', registroData);
            
            // 3. Guardar en Firestore
            console.log('💾 Guardando registro en Firestore...');
            const docId = await saveRegistration(registroData);
            console.log('✅ Registro guardado con ID:', docId);
            
            // 4. Ocultar pantalla de carga
            hideLoadingScreen();
            console.log('✅ Pantalla de carga ocultada');
            
            // 5. Mostrar pantalla de éxito
            showSuccessScreen();
            console.log('🎉 Pantalla de éxito mostrada');
            
            // 6. Limpiar formulario después de mostrar éxito
            setTimeout(() => {
                form.reset();
                fileInput.value = '';
                previewImage.src = '';
                fileNameText.textContent = '';
                if (filePreview) {
                    filePreview.classList.add('hidden');
                }
                if (fileLabel) {
                    fileLabel.style.display = 'flex';
                }
                if (otroConceptoContainer) {
                    otroConceptoContainer.classList.add('hidden');
                }
                if (cantidadEfectivoContainer) {
                    cantidadEfectivoContainer.classList.add('hidden');
                }
                if (recibioContainer) {
                    recibioContainer.classList.add('hidden');
                }
                clearAllErrors();
                console.log('🧹 Formulario limpiado');
            }, 500);
            
            console.log('✅ Proceso completado exitosamente');
            
        } catch (error) {
            console.error('❌ Error en el proceso:', error);
            console.error('❌ Detalles del error:', {
                message: error.message,
                stack: error.stack,
                code: error.code
            });
            
            // Ocultar pantalla de carga
            hideLoadingScreen();
            
            // Mostrar error al usuario
            alert(`Error al guardar: ${error.message}\n\nPor favor intenta de nuevo.`);
        }
    });
    
    console.log('✅ Event listener del formulario registrado');
} else {
    console.error('❌ No se encontró el formulario con ID "registrationForm"');
}

// ===================================
// VALIDACIÓN EN TIEMPO REAL
// ===================================

// Validar monto (solo números positivos)
const montoInput = document.getElementById('monto');
if (montoInput) {
    montoInput.addEventListener('input', (e) => {
        if (e.target.value < 0) {
            e.target.value = 0;
        }
    });
}

// Validar cantidad efectivo (solo números positivos o cero)
cantidadEfectivoInput = document.getElementById('cantidadEfectivo');
if (cantidadEfectivoInput) {
    cantidadEfectivoInput.addEventListener('input', (e) => {
        if (e.target.value < 0) {
            e.target.value = 0;
        }
    });
}

// Establecer fecha máxima como hoy
const fechaPagoInput = document.getElementById('fechaPago');
if (fechaPagoInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaPagoInput.setAttribute('max', today);
}

// ===================================
// MENSAJE DE CONSOLA
// ===================================
console.log('%c🏈 Sistema de Registro - Teotihuacán', 'font-size: 16px; font-weight: bold; color: #E67E22;');
console.log('%c✅ Firebase inicializado correctamente', 'color: #10B981;');
console.log('%c📝 Formulario listo para recibir registros', 'color: #2C3E50;');