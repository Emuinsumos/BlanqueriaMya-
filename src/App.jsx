import { useState, useEffect, useRef } from 'react';
import { db } from './firebase.js';

const NOMBRE_NEGOCIO = "Blanquería MyA";
// Imagen de respaldo cuando un producto/medida todavía no tiene foto cargada.
// Es un SVG embebido (no depende de ningún servicio externo, así nunca se ve "rota").
const IMG_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23F3E8DA'/%3E%3Cpath d='M55 135l32-42 24 28 22-26 26 40H55z' fill='%23D5B899'/%3E%3Ccircle cx='72' cy='78' r='13' fill='%23D5B899'/%3E%3C/svg%3E";
const LOGO_ALCOYANA = "data:image/jpeg;base64,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";
const LOGO_JEANCARTIER = "data:image/jpeg;base64,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";
  // Constantes y Helpers
const SALUDO_BOT_DEFECTO = "¡Hola! 👋 Bienvenido a Blanquería MyA. ¿En qué puedo ayudarte hoy?";
const DEFAULT_PREGUNTAS_BOT = [
  {id:'d1', pregunta:'¿Cómo hago un pedido?', respuesta:'Es muy fácil: elegís tus productos del catálogo, seleccionás la medida deseada y los agregás al carrito 🛒. Al finalizar, completás tus datos y nos enviás la orden directamente por WhatsApp para coordinar.', accion:''},
  {id:'d2', pregunta:'¿Tienen catálogo de medidas?', respuesta:'¡Sí! Podés hacer clic en el botón 📏 "Ver tabla de medidas" en el menú para revisar las dimensiones para 1 plaza, 2 plazas, Queen y King Size.', accion:'medidas'},
  {id:'d3', pregunta:'¿Realizan envíos?', respuesta:'¡Hacemos envíos a todo el país! Al enviarnos tu consulta por WhatsApp te pasamos el costo exacto según tu localidad.', accion:''}
];

function resizeImagen(file, callback, maxWidth = 800) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let scale = 1;
      if (img.width > maxWidth) scale = maxWidth / img.width;
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function imagenesDe(p){ if(p.imagenes && p.imagenes.length) return p.imagenes; if(p.imagen) return [p.imagen]; return []; }
function medidasDe(p){ if(p.medidas && p.medidas.length) return p.medidas; return []; }
function normalizarMedidasArr(arr){
  return (arr||[]).map(x => typeof x === 'string' ? {nombre:x, mostrarFiltro:true} : {nombre:x.nombre, mostrarFiltro: x.mostrarFiltro!==false});
}

// Carga un <script> externo una sola vez y devuelve una Promise que resuelve cuando ya está listo.
// Así XLSX y jsPDF (pesados, solo usados por el admin) no retrasan la carga del catálogo para los clientes.
const _scriptsPromesas = {};
function cargarScriptUnaVez(src){
  if(_scriptsPromesas[src]) return _scriptsPromesas[src];
  _scriptsPromesas[src] = new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => { delete _scriptsPromesas[src]; reject(new Error('No se pudo cargar ' + src)); };
    document.head.appendChild(el);
  });
  return _scriptsPromesas[src];
}
function asegurarXLSX(){
  return window.XLSX ? Promise.resolve() : cargarScriptUnaVez('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
}
function asegurarPDF(){
  return window.jspdf ? Promise.resolve() : cargarScriptUnaVez('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
    .then(() => cargarScriptUnaVez('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'));
}
function medidasDisponiblesDe(p){ return medidasDe(p).filter(m => m.disponible !== false); }
function pagadoDe(pedido){ return Object.values(pedido.pagos||{}).reduce((a,p)=>a+p.monto,0); }
function debeDe(pedido){ return pedido.total - pagadoDe(pedido); }
function fechaCorta(ts){ return new Date(ts).toLocaleDateString('es-AR'); }

function App(){
  const [productos, setProductos] = useState({});
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [medidas, setMedidas] = useState([]);
  const [colores, setColores] = useState([]);
  const [tablaMedidas, setTablaMedidas] = useState({});
  const [config, setConfig] = useState({whatsapp:'5491137606525', instagram:'blanqueriaa_mya', logo:''});
  const [pedidos, setPedidos] = useState({});
  const [clientes, setClientes] = useState({});
  const [bannerProductos, setBannerProductos] = useState([]);
  const [bannerIndice, setBannerIndice] = useState(0);
  
  // UI State
  const [categoria, setCategoria] = useState('Todos');
  const [search, setSearch] = useState('');
  const [filtroMedida, setFiltroMedida] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [productoVisto, setProductoVisto] = useState(null);
  const [indiceImagen, setIndiceImagen] = useState(0);
  const [videoAbierto, setVideoAbierto] = useState(null);
  const [modalMedidaSel, setModalMedidaSel] = useState(null);
  const [modalColorSel, setModalColorSel] = useState(null);
  const [historialChat, setHistorialChat] = useState([]);
  const chatFinRef = useRef(null);
  const touchStartX = useRef(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarTablaMedidas, setMostrarTablaMedidas] = useState(false);
  const [datosPedido, setDatosPedido] = useState({nombre:'', telefono:'', zona:''});
  const [notifAgregado, setNotifAgregado] = useState(false);
    // Admin Panel State
  const [isAdmin, setIsAdmin] = useState(false);
  const [claveAdmin, setClaveAdmin] = useState('');
  const [mostrarAdminModal, setMostrarAdminModal] = useState(false);
  const [adminTab, setAdminTab] = useState('tablero');
  const [form, setForm] = useState({nombre:'', categoria:'', descripcion:'', video:'', destacado:false, imagenes:[], medidas:[{medida:'', color:'', codigo:'', codigoBarras:'', precio:'', disponible:true, imagenes:[]}]});
  const [editandoId, setEditandoId] = useState(null);
  const [aumentoPorcentaje, setAumentoPorcentaje] = useState('');
  const [aumentoRedondeo, setAumentoRedondeo] = useState('100');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [whatsappInput, setWhatsappInput] = useState('');
  const [instagramInput, setInstagramInput] = useState('');

  // Presupuesto Público / Cotizador
  const [mostrarCotizador, setMostrarCotizador] = useState(false);
  const [pubProductoId, setPubProductoId] = useState('');
  const [pubVarianteIdx, setPubVarianteIdx] = useState(0);
  const [pubCantidad, setPubCantidad] = useState('1');
  const [pubItems, setPubItems] = useState([]);
  const [mostrarChat, setMostrarChat] = useState(false);
  const [chatbotSaludo, setChatbotSaludo] = useState(SALUDO_BOT_DEFECTO);
  const [chatbotPreguntas, setChatbotPreguntas] = useState({});

  // Admin: login
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  // Admin: medidas globales / importación / aumento
  const [nuevaMedida, setNuevaMedida] = useState('');
  const [nuevoColorNombre, setNuevoColorNombre] = useState('');
  const [nuevoColorCodigo, setNuevoColorCodigo] = useState('#A67C52');
  const [editandoColorNombre, setEditandoColorNombre] = useState(null);
  const [colorEditNombre, setColorEditNombre] = useState('');
  const [colorEditCodigo, setColorEditCodigo] = useState('#A67C52');
  const [colorEditEsColor, setColorEditEsColor] = useState(true);
  const [nuevoColorEsColor, setNuevoColorEsColor] = useState(true);
  const [guardandoColor, setGuardandoColor] = useState(false);
  const [driveLinksInput, setDriveLinksInput] = useState('');
  const [textoVincularFotos, setTextoVincularFotos] = useState('');
  const [previewVincularFotos, setPreviewVincularFotos] = useState(null);
  const [vinculandoFotos, setVinculandoFotos] = useState(false);
  const [resumenVincularFotos, setResumenVincularFotos] = useState(null);
  const [previewLimpiarFotos, setPreviewLimpiarFotos] = useState(null);
  const [limpiandoFotos, setLimpiandoFotos] = useState(false);
  const [resumenLimpiarFotos, setResumenLimpiarFotos] = useState(null);
  const [importando, setImportando] = useState(false);
  const [resumenImportacion, setResumenImportacion] = useState(null);

  // Admin: carga de productos nuevos (cambio de temporada)
  const [leyendoNuevos, setLeyendoNuevos] = useState(false);
  const [previewNuevos, setPreviewNuevos] = useState(null); // {productos, resumen}
  const [cargandoNuevos, setCargandoNuevos] = useState(false);
  const [resumenCargaNuevos, setResumenCargaNuevos] = useState(null);
  const [confirmacionBorrarTodo, setConfirmacionBorrarTodo] = useState('');
  const [borrandoTodo, setBorrandoTodo] = useState(false);

  // Admin: pedidos y pagos
  const [montoPagoInputs, setMontoPagoInputs] = useState({});

  // Admin: presupuestos con cliente + PDF
  const [presClienteNombre, setPresClienteNombre] = useState('');
  const [presClienteTelefono, setPresClienteTelefono] = useState('');
  const [presItems, setPresItems] = useState([]);
  const [presProductoId, setPresProductoId] = useState('');
  const [presVarianteIdx, setPresVarianteIdx] = useState(0);
  const [presCantidad, setPresCantidad] = useState('1');
  const [presOtroNombre, setPresOtroNombre] = useState('');
  const [presOtroPrecio, setPresOtroPrecio] = useState('');

  // Admin: chatbot
  const [saludoBotInput, setSaludoBotInput] = useState('');
  const [chatbotForm, setChatbotForm] = useState({pregunta:'', respuesta:'', accion:'', accionValor:''});
  const [editandoChatbotId, setEditandoChatbotId] = useState(null);

  useEffect(() => {
    // Datos públicos: necesarios para cualquiera que entra a mirar el catálogo.
    db.ref('productos').on('value', snap => { setProductos(snap.val() || {}); setCargandoProductos(false); });
    db.ref('categorias').on('value', snap => setCategorias(snap.val() || []));
    db.ref('medidas').on('value', snap => setMedidas(snap.val() || []));
    db.ref('colores').on('value', snap => setColores(snap.val() || []));
    db.ref('config').on('value', snap => {
      const c = snap.val() || {whatsapp:'5491137606525', instagram:'blanqueriaa_mya', logo:''};
      setConfig(c);
      setWhatsappInput(c.whatsapp || '');
      setInstagramInput(c.instagram || '');
    });
    db.ref('chatbot').on('value', snap => {
      const val = snap.val() || {};
      const saludo = val.saludo || SALUDO_BOT_DEFECTO;
      setChatbotSaludo(saludo);
      setSaludoBotInput(saludo);
      setChatbotPreguntas(val.preguntas || {});
    });
    // pedidos, clientes (solo las usa el admin) y tablaMedidas (pesa por las imágenes de la guía)
    // se piden aparte, más abajo, recién cuando hacen falta: así el catálogo carga liviano para
    // cualquier cliente que entra a mirar productos.
  }, []);

  // Pedidos y clientes: son datos exclusivos del panel de administración, no hace falta
  // bajarlos para un cliente que solo está mirando el catálogo. Se piden recién al loguearse como admin.
  useEffect(() => {
    if(!isAdmin) return;
    db.ref('pedidos').on('value', snap => setPedidos(snap.val() || {}));
    db.ref('clientes').on('value', snap => setClientes(snap.val() || {}));
  }, [isAdmin]);

  // Tabla de medidas: puede tener imágenes pesadas de la guía. Se pide recién la primera vez
  // que alguien la necesita (cliente que abre "📏 Medidas", o admin en esa pestaña), no de entrada.
  const tablaMedidasPedidaRef = useRef(false);
  useEffect(() => {
    const haceFalta = mostrarTablaMedidas || (mostrarAdminModal && isAdmin && adminTab === 'tablaMedidas');
    if(!haceFalta || tablaMedidasPedidaRef.current) return;
    tablaMedidasPedidaRef.current = true;
    db.ref('tablaMedidas').on('value', snap => setTablaMedidas(snap.val() || {}));
  }, [mostrarTablaMedidas, mostrarAdminModal, isAdmin, adminTab]);

  // Chat: saludo inicial al abrir por primera vez, y autoscroll al último mensaje
  useEffect(() => {
    if(mostrarChat && historialChat.length === 0){
      setHistorialChat([{tipo:'bot', texto: chatbotSaludo}]);
    }
  }, [mostrarChat]);
  useEffect(() => {
    if(chatFinRef.current) chatFinRef.current.scrollIntoView({behavior:'smooth', block:'nearest'});
  }, [historialChat, mostrarChat]);

  // Lógica del Carrito
  function agregarAlCarrito(producto, variante) {
    const cartId = producto.id + '_' + variante.medida + (variante.color ? '_' + variante.color : '');
    setCarrito(prev => {
      const existe = prev.find(i => i.cartId === cartId);
      if(existe) {
        return prev.map(i => i.cartId === cartId ? {...i, unidades: i.unidades + 1} : i);
      }
      return [...prev, {
        cartId,
        productoId: producto.id,
        nombre: producto.nombre,
        medida: variante.medida,
        color: variante.color || '',
        precio: Number(variante.precio),
        unidades: 1,
        imagen: (variante.imagenes && variante.imagenes.length ? variante.imagenes[0] : imagenesDe(producto)[0]) || ''
      }];
    });

    setNotifAgregado(true);
    setTimeout(() => setNotifAgregado(false), 2200);
  }

  function cambiarUnidades(cartId, delta){
    setCarrito(prev => prev.map(i => i.cartId===cartId ? {...i, unidades: i.unidades+delta} : i).filter(i => i.unidades>0));
  }

  function quitarDelCarrito(cartId){
    setCarrito(prev => prev.filter(i => i.cartId !== cartId));
  }

  function abrirProducto(p){
    setProductoVisto(p);
    setIndiceImagen(0);
    setModalMedidaSel(null);
    setModalColorSel(null);
    db.ref('productos/'+p.id+'/vistas').transaction(v => (v||0) + 1);
  }

  function compartirProductoWhatsapp(p){
    const disp = medidasDisponiblesDe(p);
    const precios = disp.map(v=>v.precio);
    const precioTexto = precios.length ? (Math.min(...precios)===Math.max(...precios) ? `$${precios[0]}` : `Desde $${Math.min(...precios)}`) : '';
    const lineas = [
      `¡Mirá este producto de ${NOMBRE_NEGOCIO}! 🛏️`,
      ``,
      `*${p.nombre}*`,
      precioTexto ? `Precio: ${precioTexto}` : '',
      ``,
      `Consultanos por acá si te interesa 👇`
    ].filter(Boolean);
    const mensaje = encodeURIComponent(lineas.join('\n'));
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  }

  function preguntarBot(q){
    setHistorialChat(prev => [...prev, {tipo:'usuario', texto:q.pregunta}, {tipo:'bot', texto:q.respuesta}]);
    if(q.accion === 'medidas'){ setMostrarTablaMedidas(true); setMostrarChat(false); }
    if(q.accion === 'abrir_presupuesto'){ setMostrarCotizador(true); setMostrarChat(false); }
    if(q.accion === 'contactar_whatsapp' && config.whatsapp){ window.open(`https://wa.me/${config.whatsapp}`, '_blank'); }
    if(q.accion === 'ver_categoria' && q.accionValor){
      setCategoria(q.accionValor);
      setMostrarChat(false);
      window.scrollTo({top:0, behavior:'smooth'});
    }
  }

  const totalCarrito = carrito.reduce((acc, i) => acc + (i.precio * i.unidades), 0);
  const cantidadTotalCarrito = carrito.reduce((a, i) => a + i.unidades, 0);

  function enviarPedidoWhatsApp() {
    if(!datosPedido.nombre || !datosPedido.telefono) {
      alert('Por favor completá tu Nombre y Teléfono');
      return;
    }
    if(carrito.length === 0) return;

    db.ref('pedidos').push().set({
      items: carrito,
      total: totalCarrito,
      nombre: datosPedido.nombre,
      telefono: datosPedido.telefono,
      zona: datosPedido.zona || 'No especificada',
      estado: 'recibido',
      creado: Date.now()
    });
    const lineas = [
      `✨ *NUEVO PEDIDO - ${NOMBRE_NEGOCIO}* ✨`,
      `👤 *Cliente:* ${datosPedido.nombre}`,
      `📞 *Teléfono:* ${datosPedido.telefono}`,
      `📍 *Zona/Dirección:* ${datosPedido.zona || '-'}\n`,
      `📦 *Detalle de Productos:*`
    ];

    carrito.forEach(it => {
      lineas.push(`• ${it.unidades}x ${it.nombre} (${it.medida}${it.color ? ' - ' + it.color : ''}) -> $${it.precio * it.unidades}`);
    });

    lineas.push(`\n💰 *Total a pagar:* $${totalCarrito}`);
    lineas.push(`_Enviado desde el catálogo web_`);

    const msg = encodeURIComponent(lineas.join('\n'));
    window.open(`https://wa.me/${config.whatsapp}?text=${msg}`, '_blank');
  }

  // Filtrado de productos
  const listaProductos = Object.entries(productos).map(([id, p]) => ({ id, ...p }));
  const productosFiltrados = listaProductos.filter(p => {
    const matchCat = categoria === 'Todos' || p.categoria === categoria;
    const matchSearch = !search || normalizarHeader(p.nombre).includes(normalizarHeader(search)) ||
                       normalizarHeader(p.categoria||'').includes(normalizarHeader(search)) ||
                       (p.descripcion && normalizarHeader(p.descripcion).includes(normalizarHeader(search)));
    const matchMedida = !filtroMedida || medidasDisponiblesDe(p).some(m => (m.medida||'').trim() === filtroMedida.trim());
    const tieneStock = medidasDisponiblesDe(p).length > 0;
    return matchCat && matchSearch && matchMedida && tieneStock;
  });

  const productosDestacados = listaProductos.filter(p => p.destacado && medidasDisponiblesDe(p).length > 0);

  // Banner rotativo: elige un puñado aleatorio de productos disponibles una vez por visita
  useEffect(() => {
    if(bannerProductos.length > 0) return;
    const disponibles = listaProductos.filter(p => medidasDisponiblesDe(p).length > 0);
    if(disponibles.length === 0) return;
    const mezclados = [...disponibles].sort(() => Math.random() - 0.5);
    setBannerProductos(mezclados.slice(0, Math.min(6, mezclados.length)));
  }, [productos]);

  useEffect(() => {
    if(bannerProductos.length < 2) return;
    const t = setInterval(() => setBannerIndice(i => (i + 1) % bannerProductos.length), 4000);
    return () => clearInterval(t);
  }, [bannerProductos]);

  const medidasEnCatalogo = [...new Set(
    listaProductos.flatMap(p => medidasDisponiblesDe(p).map(m => m.medida)).filter(Boolean)
  )].sort();

  const coloresEnCatalogo = [...new Set(
    listaProductos.flatMap(p => medidasDe(p).map(m => m.color)).filter(Boolean)
  )].sort();

  // Filtro público: solo las medidas que el admin curó en la pestaña "Medidas" Y que además
  // tienen productos reales disponibles (así no se llena de opciones muertas ni de ruido).
  const medidasFiltroPublico = normalizarMedidasArr(medidas)
    .filter(x => x.mostrarFiltro !== false && medidasEnCatalogo.includes(x.nombre))
    .map(x => x.nombre);

  const listaTablaMedidas = Object.entries(tablaMedidas).map(([id, v]) => ({ id, ...v }));

  function agregarItemPublico(){
    if(!pubProductoId) return;
    const p = productos[pubProductoId];
    const m = medidasDisponiblesDe(p)[pubVarianteIdx];
    if(!m) return;
    const cant = Number(pubCantidad) || 1;
    setPubItems(prev => [...prev, {nombre: `${p.nombre} (${m.medida}${m.color ? ' - '+m.color : ''})`, cantidad: cant, precio: m.precio}]);
    setPubCantidad('1');
  }
  function quitarItemPublico(idx){
    setPubItems(prev => prev.filter((_,i)=>i!==idx));
  }
  const pubTotal = pubItems.reduce((a,it)=>a+it.cantidad*it.precio,0);
  function enviarPresupuestoPublicoWhatsapp(){
    const lineas = ['✨ *Presupuesto personalizado web* ✨\n'];
    pubItems.forEach(it => lineas.push(`• ${it.cantidad}x ${it.nombre} = $${it.cantidad*it.precio}`));
    lineas.push(`\n💰 *Total estimado:* $${pubTotal}`);
    lineas.push('_Precios sujetos a confirmación y disponibilidad de envío._');
    const mensaje = encodeURIComponent(lineas.join('\n'));
    window.open(`https://wa.me/${config.whatsapp}?text=${mensaje}`, '_blank');
  }

  // ===================== ADMIN =====================
  const listaPedidos = Object.entries(pedidos).map(([id, p]) => ({id, ...p})).sort((a,b)=>(b.creado||0)-(a.creado||0));
  const listaClientes = Object.entries(clientes).map(([id, c]) => ({id, ...c}));
  const pedidosPendientes = listaPedidos.filter(p => p.estado === 'recibido').length;

  // Productos/variantes que todavía no tienen ninguna foto propia ni general
  const productosSinFotoInfo = listaProductos
    .filter(p => medidasDisponiblesDe(p).length > 0)
    .map(p => ({
      p,
      tieneGeneral: imagenesDe(p).length > 0,
      variantesFaltantes: medidasDisponiblesDe(p).filter(m => !(m.imagenes && m.imagenes.length))
    }))
    .filter(x => !x.tieneGeneral && x.variantesFaltantes.length > 0);

  function intentarLogin(){
    if(usuario === 'Guada' && contrasena === 'lupe'){
      setIsAdmin(true);
      setErrorLogin('');
      setUsuario(''); setContrasena('');
    } else {
      setErrorLogin('Usuario o contraseña incorrectos');
    }
  }
  function cerrarSesion(){
    setIsAdmin(false);
    setMostrarAdminModal(false);
  }

  function editarProducto(p){
    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
      descripcion: p.descripcion || '',
      video: p.video || '',
      destacado: !!p.destacado,
      imagenes: imagenesDe(p),
      medidas: medidasDe(p).length ? medidasDe(p).map(m=>({medida:m.medida, color:m.color||'', codigo:m.codigo||'', codigoBarras:m.codigoBarras||'', precio:String(m.precio), disponible: m.disponible!==false, imagenes: m.imagenes||[]})) : [{medida:'', color:'', codigo:'', codigoBarras:'', precio:'', disponible:true}]
    });
    setEditandoId(p.id);
    setAdminTab('productos');
  }
  function resetForm(){
    setForm({nombre:'', categoria:'', descripcion:'', video:'', destacado:false, imagenes:[], medidas:[{medida:'', color:'', codigo:'', codigoBarras:'', precio:'', disponible:true, imagenes:[]}]});
    setEditandoId(null);
  }
  function guardarProducto(){
    const medidasValidas = form.medidas.filter(m=>m.medida && m.precio).map(m=>({medida:m.medida, color:(m.color||'').trim(), codigo:(m.codigo||'').trim(), codigoBarras:(m.codigoBarras||'').trim(), precio:Number(m.precio), disponible: m.disponible!==false, imagenes: m.imagenes||[]}));
    if(!form.nombre || !form.categoria || medidasValidas.length===0) return;
    const id = editandoId || db.ref('productos').push().key;
    db.ref('productos/'+id).set({
      nombre: form.nombre,
      categoria: form.categoria,
      descripcion: form.descripcion || '',
      video: (form.video||'').trim(),
      destacado: !!form.destacado,
      imagenes: form.imagenes,
      medidas: medidasValidas
    });
    resetForm();
  }
  function eliminarProducto(id){
    if(confirm('¿Eliminar este producto?')) db.ref('productos/'+id).remove();
  }
  function handleImagenes(e){
    const files = Array.from(e.target.files);
    files.forEach(file => {
      resizeImagen(file, (dataUrl) => setForm(f => ({...f, imagenes: [...f.imagenes, dataUrl]})));
    });
    e.target.value = '';
  }
  function quitarImagenForm(idx){
    setForm(f => ({...f, imagenes: f.imagenes.filter((_,i)=>i!==idx)}));
  }
  function extraerIdDrive(link){
    const l = link.trim();
    if(!l) return null;
    let m = l.match(/\/d\/([a-zA-Z0-9_-]{15,})/); // .../file/d/ID/view
    if(m) return m[1];
    m = l.match(/[?&]id=([a-zA-Z0-9_-]{15,})/); // ...?id=ID
    if(m) return m[1];
    if(/^[a-zA-Z0-9_-]{15,}$/.test(l)) return l; // ya es un ID solo
    return null;
  }
  function agregarImagenesDesdeDrive(){
    const lineas = driveLinksInput.split(/[\n,]+/).map(l=>l.trim()).filter(Boolean);
    const nuevas = [];
    const noReconocidos = [];
    lineas.forEach(linea => {
      const id = extraerIdDrive(linea);
      if(id) nuevas.push(`https://drive.google.com/thumbnail?id=${id}&sz=w1200`);
      else noReconocidos.push(linea);
    });
    if(nuevas.length){
      setForm(f => ({...f, imagenes: [...f.imagenes, ...nuevas]}));
    }
    setDriveLinksInput(noReconocidos.join('\n'));
    if(noReconocidos.length){
      alert('No pude reconocer ' + noReconocidos.length + ' link(s) como de Google Drive. Los dejé en el cuadro para que los revises.');
    }
  }
  function cambiarMedidaForm(idx, campo, valor){
    setForm(f => ({...f, medidas: f.medidas.map((m,i)=> i===idx ? {...m, [campo]: valor} : m)}));
  }
  function quitarImagenMedida(idxMedida, idxImagen){
    setForm(f => ({...f, medidas: f.medidas.map((m,i)=> i===idxMedida ? {...m, imagenes: m.imagenes.filter((_,j)=>j!==idxImagen)} : m)}));
  }

  // ===== Vincular fotos en lote por código (de artículo o de barras) =====
  function previsualizarVincularFotos(){
    // Mapa código -> {id, nombre} de producto, usando tanto código de barras como código de artículo
    const mapaCodigos = {};
    Object.entries(productos).forEach(([id, p]) => {
      medidasDe(p).forEach(m => {
        if(m.codigoBarras) mapaCodigos[m.codigoBarras.trim()] = {id, nombre: p.nombre, matchedCode: m.codigoBarras.trim()};
        if(m.codigo) mapaCodigos[m.codigo.trim()] = {id, nombre: p.nombre, matchedCode: m.codigo.trim()};
      });
    });

    const lineas = textoVincularFotos.split('\n').map(l=>l.trim()).filter(Boolean);
    const encontradas = []; // {productoId, nombre, url, codigo}
    const noEncontrados = [];
    const linkInvalido = [];

    lineas.forEach(linea => {
      // separa por tab, o si no hay tab, por el primer bloque de espacios/comas
      let partes = linea.includes('\t') ? linea.split('\t') : linea.split(/[\s,]+/);
      partes = partes.map(x=>x.trim()).filter(Boolean);
      if(partes.length < 2) { linkInvalido.push(linea); return; }
      // el código puede venir primero o el link primero: detectamos cuál de las dos partes es el link
      let codigo, link;
      if(/drive\.google|^[a-zA-Z0-9_-]{20,}$/.test(partes[0]) && !/drive\.google/.test(partes[partes.length-1])){
        link = partes[0]; codigo = partes[partes.length-1];
      } else {
        codigo = partes[0]; link = partes[partes.length-1];
      }
      // saca extensión de archivo si el código viene como nombre de archivo (ej: 0876-1-6.jpg)
      codigo = codigo.replace(/\.(jpg|jpeg|png|webp|heic)$/i, '');
      const id = extraerIdDrive(link);
      if(!id){ linkInvalido.push(linea); return; }
      const match = mapaCodigos[codigo] || mapaCodigos[codigo.replace(/-/g,'/')];
      if(!match){ noEncontrados.push(codigo); return; }
      encontradas.push({productoId: match.id, nombre: match.nombre, url: `https://drive.google.com/thumbnail?id=${id}&sz=w1200`, codigo, matchedCode: match.matchedCode});
    });

    setPreviewVincularFotos({encontradas, noEncontrados, linkInvalido});
  }

  function confirmarVincularFotos(){
    if(!previewVincularFotos || previewVincularFotos.encontradas.length===0) return;
    setVinculandoFotos(true);
    // Agrupa por producto, y dentro de cada uno por el código exacto de la medida a la que corresponde la foto
    const porProducto = {}; // productoId -> { matchedCode -> Set(urls) }
    previewVincularFotos.encontradas.forEach(e => {
      if(!porProducto[e.productoId]) porProducto[e.productoId] = {};
      if(!porProducto[e.productoId][e.matchedCode]) porProducto[e.productoId][e.matchedCode] = new Set();
      porProducto[e.productoId][e.matchedCode].add(e.url);
    });
    const updates = {};
    Object.entries(porProducto).forEach(([id, porCodigo]) => {
      const nuevasMedidas = medidasDe(productos[id]).map(m => {
        const clave = (m.codigoBarras && porCodigo[m.codigoBarras]) ? m.codigoBarras : ((m.codigo && porCodigo[m.codigo]) ? m.codigo : null);
        if(!clave) return m;
        // Reemplaza las fotos de esta medida por las nuevas (no las suma a las viejas), para que un link
        // roto de una carga anterior no quede mezclado con el link bueno.
        return {...m, imagenes: Array.from(porCodigo[clave])};
      });
      updates['productos/'+id+'/medidas'] = nuevasMedidas;
    });
    db.ref().update(updates).then(() => {
      setVinculandoFotos(false);
      setResumenVincularFotos({
        productos: Object.keys(porProducto).length,
        fotos: previewVincularFotos.encontradas.length,
        noEncontrados: previewVincularFotos.noEncontrados.length
      });
      setPreviewVincularFotos(null);
      setTextoVincularFotos('');
    }).catch(err => {
      setVinculandoFotos(false);
      alert('No se pudo guardar: ' + err.message);
    });
  }

  // ===== Limpiar fotos pesadas (base64) guardadas antes de usar links de Drive =====
  function esFotoPesadaBase64(url){
    return typeof url === 'string' && url.startsWith('data:image');
  }
  function previsualizarLimpiarFotos(){
    const afectados = []; // {productoId, nombre, cantidadGeneral, cantidadMedidas, bytesAprox}
    let totalFotos = 0, totalBytes = 0;
    Object.entries(productos).forEach(([id, p]) => {
      const generales = imagenesDe(p).filter(esFotoPesadaBase64);
      let cantidadMedidas = 0;
      medidasDe(p).forEach(m => {
        cantidadMedidas += (m.imagenes||[]).filter(esFotoPesadaBase64).length;
      });
      const cantidad = generales.length + cantidadMedidas;
      if(cantidad > 0){
        const bytes = generales.reduce((a,u)=>a+u.length,0) +
          medidasDe(p).flatMap(m=>(m.imagenes||[]).filter(esFotoPesadaBase64)).reduce((a,u)=>a+u.length,0);
        afectados.push({productoId: id, nombre: p.nombre, cantidadGeneral: generales.length, cantidadMedidas, cantidad, bytes});
        totalFotos += cantidad;
        totalBytes += bytes;
      }
    });
    setPreviewLimpiarFotos({afectados, totalFotos, totalBytes, totalProductos: afectados.length});
  }
  function confirmarLimpiarFotos(){
    if(!previewLimpiarFotos || previewLimpiarFotos.afectados.length===0) return;
    setLimpiandoFotos(true);
    const updates = {};
    previewLimpiarFotos.afectados.forEach(a => {
      const p = productos[a.productoId];
      updates['productos/'+a.productoId+'/imagenes'] = imagenesDe(p).filter(u => !esFotoPesadaBase64(u));
      updates['productos/'+a.productoId+'/medidas'] = medidasDe(p).map(m => ({
        ...m,
        imagenes: (m.imagenes||[]).filter(u => !esFotoPesadaBase64(u))
      }));
    });
    db.ref().update(updates).then(() => {
      setLimpiandoFotos(false);
      setResumenLimpiarFotos({productos: previewLimpiarFotos.totalProductos, fotos: previewLimpiarFotos.totalFotos});
      setPreviewLimpiarFotos(null);
    }).catch(err => {
      setLimpiandoFotos(false);
      alert('No se pudo limpiar: ' + err.message);
    });
  }

  function toggleDisponibleForm(idx){
    setForm(f => ({...f, medidas: f.medidas.map((m,i)=> i===idx ? {...m, disponible: !(m.disponible!==false)} : m)}));
  }
  function agregarFilaMedida(){
    setForm(f => ({...f, medidas: [...f.medidas, {medida:'', color:'', codigo:'', codigoBarras:'', precio:'', disponible:true, imagenes:[]}]}));
  }
  function quitarFilaMedida(idx){
    setForm(f => ({...f, medidas: f.medidas.filter((_,i)=>i!==idx)}));
  }
  function toggleDisponibleProducto(productoId, idx, actual){
    db.ref(`productos/${productoId}/medidas/${idx}/disponible`).set(!actual);
  }
  function agregarMedidaGlobal(){
    const arr = normalizarMedidasArr(medidas);
    const nombre = nuevaMedida.trim();
    if(!nombre || arr.some(x=>x.nombre===nombre)) return;
    db.ref('medidas').set([...arr, {nombre, mostrarFiltro:true}])
      .then(() => setNuevaMedida(''))
      .catch(err => alert('No se pudo guardar la medida: ' + err.message));
  }
  function eliminarMedidaGlobal(nombre){
    db.ref('medidas').set(normalizarMedidasArr(medidas).filter(x => x.nombre !== nombre));
  }
  function toggleMedidaFiltro(nombre){
    db.ref('medidas').set(normalizarMedidasArr(medidas).map(x => x.nombre===nombre ? {...x, mostrarFiltro: !x.mostrarFiltro} : x));
  }
  function agregarColorGlobal(){
    if(!nuevoColorNombre || colores.some(c => c.nombre.toLowerCase() === nuevoColorNombre.toLowerCase())) return;
    db.ref('colores').set([...colores, {nombre: nuevoColorNombre.trim(), codigo: nuevoColorCodigo, esColor: nuevoColorEsColor}])
      .then(() => { setNuevoColorNombre(''); setNuevoColorEsColor(true); })
      .catch(err => alert('No se pudo guardar el color: ' + err.message));
  }
  function eliminarColorGlobal(nombre){
    db.ref('colores').set(colores.filter(c => c.nombre !== nombre));
  }
  function agregarColorRapido(nombre){
    if(colores.some(c=>c.nombre===nombre)) return;
    // Viene de una planilla/import sin confirmar: por default NO se muestra como círculo de color
    // hasta que el admin lo revise y confirme si es un color real o el nombre de un modelo/diseño.
    db.ref('colores').set([...colores, {nombre, codigo:'#A67C52', esColor:false}]);
  }
  function iniciarEdicionColor(c){
    setEditandoColorNombre(c.nombre);
    setColorEditNombre(c.nombre);
    setColorEditCodigo(c.codigo);
    setColorEditEsColor(c.esColor !== false);
  }
  function cancelarEdicionColor(){
    setEditandoColorNombre(null);
  }
  function guardarEdicionColor(){
    const nombreNuevo = colorEditNombre.trim();
    const nombreOriginal = editandoColorNombre;
    if(!nombreNuevo) return;
    if(nombreNuevo.toLowerCase() !== nombreOriginal.toLowerCase() && colores.some(c => c.nombre.toLowerCase() === nombreNuevo.toLowerCase())){
      alert('Ya existe un color con ese nombre.');
      return;
    }
    setGuardandoColor(true);
    const nuevaListaColores = colores.map(c => c.nombre === nombreOriginal ? {nombre: nombreNuevo, codigo: colorEditCodigo, esColor: colorEditEsColor} : c);
    const updates = {colores: nuevaListaColores};
    if(nombreNuevo !== nombreOriginal){
      Object.entries(productos).forEach(([id, p]) => {
        const meds = medidasDe(p);
        let cambio = false;
        const nuevasMedidas = meds.map(m => {
          if(m.color === nombreOriginal){
            cambio = true;
            return {...m, color: nombreNuevo};
          }
          return m;
        });
        if(cambio) updates['productos/'+id+'/medidas'] = nuevasMedidas;
      });
    }
    db.ref().update(updates).then(() => {
      setGuardandoColor(false);
      setEditandoColorNombre(null);
    }).catch(err => {
      setGuardandoColor(false);
      alert('No se pudo guardar el cambio: ' + err.message);
    });
  }
  function codigoDeColor(nombre){
    const c = colores.find(c => c.nombre === nombre);
    return c ? c.codigo : null;
  }
  function esColorReal(nombre){
    const c = colores.find(c => c.nombre === nombre);
    return c ? c.esColor !== false : false;
  }
  function handleTablaMedidas(e){
    const files = Array.from(e.target.files);
    files.forEach(file => {
      resizeImagen(file, (dataUrl) => db.ref('tablaMedidas').push().set({imagen: dataUrl}), 900);
    });
    e.target.value = '';
  }
  function eliminarImagenTablaMedidas(id){
    db.ref('tablaMedidas/'+id).remove();
  }

  function handleImportarPlanilla(e){
    const file = e.target.files[0];
    if(!file) return;
    setImportando(true);
    setResumenImportacion(null);
    asegurarXLSX().then(() => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try{
        const data = new Uint8Array(ev.target.result);
        const wb = XLSX.read(data, {type:'array'});

        let cols = null, filas = null, hojaUsada = null;
        const ordenHojas = wb.SheetNames.includes('PEDIDO') ? ['PEDIDO', ...wb.SheetNames.filter(n=>n!=='PEDIDO')] : wb.SheetNames;
        for(const nombreHoja of ordenHojas){
          const f = XLSX.utils.sheet_to_json(wb.Sheets[nombreHoja], {header:1, defval:null});
          const det = detectarPlanillaPedido(f);
          if(det && det.idxDisponibilidad >= 0){ cols = det; filas = f; hojaUsada = nombreHoja; break; }
        }
        if(!cols){
          throw new Error('No encontré las columnas "Rubro", "Codbarras" y "Disponibilidad" en ninguna hoja del archivo.');
        }

        const mapa = {};
        for(let r = cols.headerRow + 1; r < filas.length; r++){
          const fila = filas[r] || [];
          const codigo = normTxt(fila[cols.idxCodBarras]);
          const disp = normTxt(fila[cols.idxDisponibilidad]);
          if(codigo && (disp === 'Disponible' || disp === 'No disponible' || disp === 'Agotado')){
            mapa[codigo] = (disp === 'Disponible');
          }
        }

        let encontrados = 0;
        let actualizados = 0;
        const updates = {};
        Object.entries(productos).forEach(([id, p]) => {
          const meds = medidasDe(p);
          let cambio = false;
          const nuevasMedidas = meds.map(m => {
            if(m.codigoBarras && mapa.hasOwnProperty(m.codigoBarras.trim())){
              encontrados++;
              const nuevoDisp = mapa[m.codigoBarras.trim()];
              if(nuevoDisp !== (m.disponible !== false)){
                cambio = true;
                actualizados++;
              }
              return {...m, disponible: nuevoDisp};
            }
            return m;
          });
          if(cambio) updates['productos/'+id+'/medidas'] = nuevasMedidas;
        });

        if(Object.keys(updates).length > 0){
          db.ref().update(updates).then(() => {
            setImportando(false);
            setResumenImportacion({totalCodigos: Object.keys(mapa).length, encontrados, actualizados});
          }).catch(err => {
            setImportando(false);
            alert('Se leyó la planilla pero hubo un error al guardar los cambios: ' + err.message);
          });
        } else {
          setImportando(false);
          setResumenImportacion({totalCodigos: Object.keys(mapa).length, encontrados, actualizados});
        }
      } catch(err){
        setImportando(false);
        alert('No se pudo leer el archivo. Verificá que sea el .xlsx que te manda la fábrica. Error: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
    }).catch(() => {
      setImportando(false);
      alert('No se pudo cargar el lector de Excel. Revisá tu conexión e intentá de nuevo.');
      e.target.value = '';
    });
  }

  // ===== Carga de productos nuevos (planilla de catálogo tipo "Lista de precios") =====
  const CATEGORIA_PENDIENTE = '🆕 Sin categorizar';

  function normTxt(v){
    return (v===null || v===undefined) ? '' : String(v).trim();
  }
  function esMarca(texto){
    if(!texto) return false;
    const primera = texto.trim().split(/[\s·]+/)[0] || '';
    const letras = primera.replace(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]/g,'');
    return letras.length >= 2 && letras === letras.toUpperCase();
  }
  function limpiarNombreProd(texto){
    let t = texto.trim();
    t = t.replace(/^:{2}\s*/,'').replace(/\s*:{2}\s*$/,'');
    t = t.replace(/^·+\s*/,'').replace(/\s*·+\s*$/,'');
    t = t.replace(/\s+/g,' ').trim();
    t = t.replace(/^[·\-\s]+|[·\-\s]+$/g,'');
    return t;
  }
  function extraerMedidaTexto(texto){
    if(!texto) return '';
    let m = texto.match(/Talles?:.*/i);
    if(m) return m[0].trim().replace(/[·.\s]+$/,'');
    m = texto.match(/\d\s?1\s?\/\s?2\s?pl\.?/i);
    if(m) return m[0].trim().replace(/[·.\s]+$/,'');
    m = texto.match(/\b(King|Queen|Twin|Individual|Doble|Semi\s?Doble|Súper\s?King|Super\s?King)\b/i);
    if(m) return m[0].trim();
    m = texto.match(/\d+([.,]\d+)?\s*[xX]\s*\d+([.,]\d+)?(\s*[+xX]\s*\d+([.,]\d+)?)?\s*cm/i);
    if(m) return m[0].trim();
    return '';
  }
  function parseBloqueCatalogo(filas){
    // filas: array de [foto, codigo, detalle, precio]
    const productos = [];
    const idxPorNombre = {};
    let currentGroupName = null;
    let currentCategoria = '';
    let lastItemPending = false;
    let lastMedidaRef = null;

    filas.forEach(([foto, codigo, detalle, precio]) => {
      const fotoS = normTxt(foto), codigoS = normTxt(codigo), detalleS = normTxt(detalle);
      if(fotoS === 'FOTO' || codigoS === 'CÓDIGO' || detalleS === 'DETALLE') return;
      if(fotoS.startsWith('::')){
        currentCategoria = limpiarNombreProd(fotoS);
        currentGroupName = null;
        lastItemPending = false;
        lastMedidaRef = null;
        return;
      }
      if(!codigoS && detalleS && !precio){
        if(lastItemPending){
          if(esMarca(detalleS)){
            currentGroupName = limpiarNombreProd(detalleS);
            lastItemPending = false;
          } else if(lastMedidaRef){
            const extra = extraerMedidaTexto(detalleS);
            if(extra && !lastMedidaRef.medida) lastMedidaRef.medida = extra;
            lastMedidaRef.notas = (lastMedidaRef.notas ? lastMedidaRef.notas + ' | ' : '') + detalleS;
          }
        } else {
          if(currentGroupName === null || esMarca(detalleS)){
            currentGroupName = limpiarNombreProd(detalleS);
          }
        }
        return;
      }
      if(codigoS){
        const nombre = currentGroupName || limpiarNombreProd(detalleS);
        const medida = extraerMedidaTexto(detalleS);
        const clave = currentCategoria + ' | ' + nombre;
        if(!(clave in idxPorNombre)){
          idxPorNombre[clave] = productos.length;
          productos.push({nombre, categoria: currentCategoria, medidas: []});
        }
        const med = {codigo: codigoS, medida, precio: Number(precio)||0, notas: detalleS};
        productos[idxPorNombre[clave]].medidas.push(med);
        lastMedidaRef = med;
        lastItemPending = true;
      }
    });
    return productos;
  }

  function normalizarHeader(s){
    return String(s===null||s===undefined?'':s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
  }

  function detectarPlanillaPedido(filas){
    // Busca la fila de encabezados (contiene "Rubro" y "Codbarras") en las primeras filas de la hoja
    for(let i=0; i<Math.min(filas.length, 20); i++){
      const fila = filas[i] || [];
      const norm = fila.map(normalizarHeader);
      const idxCodBarras = norm.findIndex(v => v.includes('codbarras') || v.includes('cod barra'));
      const idxRubro = norm.findIndex(v => v.includes('rubro'));
      if(idxCodBarras >= 0 && idxRubro >= 0){
        const idxMedida = norm.findIndex(v => v.includes('medida'));
        const idxDiseno = norm.findIndex(v => v.includes('diseno') || v.includes('linea'));
        const idxDisponibilidad = norm.findIndex(v => v.includes('disponibilidad'));
        const idxArticulo = norm.findIndex(v => v.includes('articulo'));
        const idxColor = norm.findIndex(v => v.includes('modelo') || v.includes('color'));
        const filaSiguiente = (filas[i+1] || []).map(normalizarHeader);
        let idxPrecio = filaSiguiente.findIndex(v => v === 'l1');
        if(idxPrecio < 0) idxPrecio = norm.findIndex(v => v.includes('precio'));
        return {headerRow: i, idxRubro, idxMedida, idxCodBarras, idxDiseno, idxDisponibilidad, idxPrecio, idxArticulo, idxColor};
      }
    }
    return null;
  }

  function parsearPlanillaPedido(filas, cols){
    const productos = [];
    const idxPorClave = {};
    for(let r = cols.headerRow + 1; r < filas.length; r++){
      const fila = filas[r] || [];
      const rubro = normTxt(fila[cols.idxRubro]);
      const medida = normTxt(fila[cols.idxMedida]);
      const codBarras = normTxt(fila[cols.idxCodBarras]);
      const articulo = cols.idxArticulo >= 0 ? normTxt(fila[cols.idxArticulo]) : '';
      const color = cols.idxColor >= 0 ? normTxt(fila[cols.idxColor]) : '';
      let diseno = normTxt(fila[cols.idxDiseno]);
      const precio = cols.idxPrecio >= 0 ? fila[cols.idxPrecio] : null;
      const dispTexto = cols.idxDisponibilidad >= 0 ? normTxt(fila[cols.idxDisponibilidad]) : '';
      if(!codBarras || !diseno) continue; // saltea filas vacías o de portada/catálogo
      diseno = diseno.replace(/^["“”]+|["“”]+$/g,'').trim();
      const clave = rubro + '|' + diseno;
      if(!(clave in idxPorClave)){
        idxPorClave[clave] = productos.length;
        productos.push({nombre: diseno, categoria: rubro, medidas: []});
      }
      productos[idxPorClave[clave]].medidas.push({
        medida,
        color,
        codigo: articulo,
        codigoBarras: codBarras,
        precio: Number(precio) || 0,
        disponibleOrigen: dispTexto === 'Disponible'
      });
    }
    return productos;
  }

  function handleArchivoProductosNuevos(e){
    const file = e.target.files[0];
    if(!file) return;
    setLeyendoNuevos(true);
    setPreviewNuevos(null);
    setResumenCargaNuevos(null);
    asegurarXLSX().then(() => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try{
        const data = new Uint8Array(ev.target.result);
        const wb = XLSX.read(data, {type:'array'});

        // 1) Intentar formato "planilla de pedido" (tabla con columnas Rubro/Medida/Codbarras/Diseño-Línea)
        let cols = null, filasHoja = null, hojaUsada = null;
        const ordenHojas = wb.SheetNames.includes('PEDIDO') ? ['PEDIDO', ...wb.SheetNames.filter(n=>n!=='PEDIDO')] : wb.SheetNames;
        for(const nombreHoja of ordenHojas){
          const filas = XLSX.utils.sheet_to_json(wb.Sheets[nombreHoja], {header:1, defval:null});
          const det = detectarPlanillaPedido(filas);
          if(det){ cols = det; filasHoja = filas; hojaUsada = nombreHoja; break; }
        }

        let productosDetectados, hojaInfo;
        if(cols){
          productosDetectados = parsearPlanillaPedido(filasHoja, cols);
          hojaInfo = hojaUsada + ' (planilla de pedido: Rubro/Codbarras/Diseño-Línea)';
        } else if(wb.SheetNames.includes('Lista de precios')){
          // 2) Formato anterior tipo "Lista de precios" (catálogo en dos columnas por hoja)
          const nombreHoja = 'Lista de precios';
          const filas = XLSX.utils.sheet_to_json(wb.Sheets[nombreHoja], {header:1, defval:null});
          const izquierda = filas.map(f => [f[1], f[2], f[3], f[4]]);
          const derecha = filas.map(f => [f[6], f[7], f[8], f[9]]);
          productosDetectados = [...parseBloqueCatalogo(izquierda), ...parseBloqueCatalogo(derecha)];
          hojaInfo = nombreHoja + ' (formato catálogo)';
        } else {
          throw new Error('No reconocí el formato de esta planilla. Buscá que tenga una hoja con columnas "Rubro", "Codbarras" y "Diseño/Línea" (planilla de pedido) o una hoja llamada "Lista de precios" (catálogo). Hojas encontradas: ' + wb.SheetNames.join(', '));
        }

        // códigos ya usados en el catálogo actual (no se vuelven a cargar): por código de barras o, si no hay, por código de artículo
        const codigosExistentes = new Set();
        const mapaBarrasExistente = {}; // codigoBarras -> {productoId, nombre}
        Object.entries(productos || {}).forEach(([id, p]) => {
          medidasDe(p).forEach(m => {
            if(m.codigo) codigosExistentes.add(String(m.codigo).trim());
            if(m.codigoBarras) mapaBarrasExistente[String(m.codigoBarras).trim()] = {productoId: id, nombre: p.nombre};
          });
        });
        const codigosBarrasExistentes = new Set(Object.keys(mapaBarrasExistente));

        // Si el código de barras ya existe en el catálogo pero le falta el color, y la planilla sí lo trae,
        // lo completamos aparte (no crea un producto nuevo, solo rellena el color que faltaba).
        const actualizacionesColor = []; // {productoId, nombre, codigoBarras, color}
        productosDetectados.forEach(p => {
          p.medidas.forEach(m => {
            if(m.codigoBarras && m.color && mapaBarrasExistente[m.codigoBarras]){
              const prodExistente = productos[mapaBarrasExistente[m.codigoBarras].productoId];
              const medExistente = medidasDe(prodExistente).find(x => x.codigoBarras === m.codigoBarras);
              if(medExistente && !medExistente.color){
                actualizacionesColor.push({productoId: mapaBarrasExistente[m.codigoBarras].productoId, nombre: prodExistente.nombre, codigoBarras: m.codigoBarras, color: m.color});
              }
            }
          });
        });

        const vistosCodigo = new Set();
        const vistosBarras = new Set();
        let duplicadosArchivo = 0, yaExistentes = 0;
        productosDetectados = productosDetectados.map(p => {
          const medidasFiltradas = p.medidas.filter(m => {
            if(m.codigoBarras){
              if(codigosBarrasExistentes.has(m.codigoBarras)){ yaExistentes++; return false; }
              if(vistosBarras.has(m.codigoBarras)){ duplicadosArchivo++; return false; }
              vistosBarras.add(m.codigoBarras);
              return true;
            }
            if(m.codigo){
              if(codigosExistentes.has(m.codigo)){ yaExistentes++; return false; }
              if(vistosCodigo.has(m.codigo)){ duplicadosArchivo++; return false; }
              vistosCodigo.add(m.codigo);
              return true;
            }
            return true;
          });
          return {...p, medidas: medidasFiltradas};
        }).filter(p => p.medidas.length > 0);

        const totalMedidas = productosDetectados.reduce((acc,p)=>acc+p.medidas.length,0);
        setPreviewNuevos({
          productos: productosDetectados,
          actualizacionesColor,
          resumen: {
            hoja: hojaInfo,
            productosNuevos: productosDetectados.length,
            medidasNuevas: totalMedidas,
            duplicadosArchivo,
            yaExistentes,
            coloresCompletados: actualizacionesColor.length
          }
        });
      } catch(err){
        alert('No se pudo leer el archivo. Verificá que sea un .xlsx válido. Error: ' + err.message);
      } finally {
        setLeyendoNuevos(false);
        e.target.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
    }).catch(() => {
      setLeyendoNuevos(false);
      alert('No se pudo cargar el lector de Excel. Revisá tu conexión e intentá de nuevo.');
      e.target.value = '';
    });
  }

  function confirmarCargaProductosNuevos(){
    if(!previewNuevos) return;
    const hayNuevos = previewNuevos.productos.length > 0;
    const hayActualizacionesColor = (previewNuevos.actualizacionesColor||[]).length > 0;
    if(!hayNuevos && !hayActualizacionesColor) return;
    setCargandoNuevos(true);
    const updates = {};
    previewNuevos.productos.forEach(p => {
      const id = db.ref('productos').push().key;
      updates['productos/'+id] = {
        nombre: p.nombre,
        categoria: p.categoria || CATEGORIA_PENDIENTE,
        descripcion: '',
        imagenes: [],
        medidas: p.medidas.map(m => ({medida: m.medida || 'Única', color: m.color||'', codigo: m.codigo||'', codigoBarras: m.codigoBarras||'', precio: m.precio||0, disponible:false}))
      };
    });

    // Completa el color de medidas que ya existían en el catálogo y no lo tenían cargado
    const porProductoColor = {};
    (previewNuevos.actualizacionesColor||[]).forEach(a => {
      if(!porProductoColor[a.productoId]) porProductoColor[a.productoId] = {};
      porProductoColor[a.productoId][a.codigoBarras] = a.color;
    });
    Object.entries(porProductoColor).forEach(([id, colorPorBarras]) => {
      const nuevasMedidas = medidasDe(productos[id]).map(m =>
        (m.codigoBarras && colorPorBarras[m.codigoBarras]) ? {...m, color: colorPorBarras[m.codigoBarras]} : m
      );
      updates['productos/'+id+'/medidas'] = nuevasMedidas;
    });

    const tareas = [db.ref().update(updates)];
    const categoriasNuevasSet = new Set(categorias);
    previewNuevos.productos.forEach(p => categoriasNuevasSet.add(p.categoria || CATEGORIA_PENDIENTE));
    if(categoriasNuevasSet.size !== categorias.length){
      tareas.push(db.ref('categorias').set(Array.from(categoriasNuevasSet)));
    }
    // Nota: las medidas que trae la planilla NO se agregan automáticamente a la lista de filtro
    // del cliente, para no llenarla de opciones. Se pueden sumar a mano desde la pestaña "Medidas".

    Promise.all(tareas).then(() => {
      setCargandoNuevos(false);
      setResumenCargaNuevos(previewNuevos.resumen);
      setPreviewNuevos(null);
    }).catch(err => {
      setCargandoNuevos(false);
      alert('Se leyó la planilla pero hubo un error al guardar en la base de datos: ' + err.message);
    });
  }
  function cancelarPreviewNuevos(){
    setPreviewNuevos(null);
  }
  function borrarTodosLosProductos(){
    if(confirmacionBorrarTodo !== 'BORRAR') return;
    if(!window.confirm('¿Seguro? Se van a borrar TODOS los productos del catálogo. Esta acción no se puede deshacer.')) return;
    setBorrandoTodo(true);
    db.ref('productos').set(null).then(() => {
      setBorrandoTodo(false);
      setConfirmacionBorrarTodo('');
    }).catch(err => {
      setBorrandoTodo(false);
      alert('No se pudo borrar: ' + err.message);
    });
  }

  function agregarCategoria(){
    if(!nuevaCategoria || categorias.includes(nuevaCategoria)) return;
    db.ref('categorias').set([...categorias, nuevaCategoria])
      .then(() => setNuevaCategoria(''))
      .catch(err => alert('No se pudo guardar la categoría: ' + err.message));
  }
  function eliminarCategoria(cat){
    db.ref('categorias').set(categorias.filter(c => c !== cat));
  }

  function guardarConfig(){
    db.ref('config').set({...config, whatsapp: whatsappInput, instagram: instagramInput});
  }
  function handleLogo(e){
    const file = e.target.files[0];
    if(!file) return;
    resizeImagen(file, (dataUrl) => {
      db.ref('config').set({...config, whatsapp: whatsappInput, instagram: instagramInput, logo: dataUrl});
    }, 300);
  }

  function aplicarAumento(){
    const pct = Number(aumentoPorcentaje);
    const redondeo = Number(aumentoRedondeo);
    if(!pct || !redondeo) return;
    if(!window.confirm(`¿Aumentar todos los precios un ${pct}% redondeando a $${redondeo}? No se puede deshacer.`)) return;
    const actualizados = {};
    Object.entries(productos).forEach(([id,p]) => {
      const nuevasMedidas = medidasDe(p).map(m => {
        const nuevo = m.precio * (1 + pct/100);
        return {medida: m.medida, color: m.color||'', codigo: m.codigo||'', codigoBarras: m.codigoBarras||'', precio: Math.round(nuevo/redondeo)*redondeo, disponible: m.disponible!==false, imagenes: m.imagenes||[]};
      });
      actualizados[id] = {...p, medidas: nuevasMedidas};
    });
    db.ref('productos').set(actualizados);
    setAumentoPorcentaje('');
  }

  function cambiarEstadoPedido(id, estado){
    db.ref('pedidos/'+id+'/estado').set(estado);
  }
  function registrarPago(pedido){
    const monto = Number(montoPagoInputs[pedido.id]);
    if(!monto || monto<=0) return;
    db.ref('pedidos/'+pedido.id+'/pagos').push().set({monto, fecha: Date.now()});
    setMontoPagoInputs(prev => ({...prev, [pedido.id]: ''}));
  }
  function generarRecibo(pedido, pago){
    asegurarPDF().then(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(150,113,79);
    doc.text(NOMBRE_NEGOCIO, 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(80,80,80);
    doc.text('Recibo de pago', 14, 32);
    doc.setFontSize(11);
    doc.text(`Cliente: ${pedido.nombre}`, 14, 44);
    doc.text(`Fecha de pago: ${fechaCorta(pago.fecha)}`, 14, 51);
    doc.text(`Monto pagado: $${pago.monto}`, 14, 58);
    doc.text(`Total del pedido: $${pedido.total}`, 14, 65);
    doc.text(`Saldo restante: $${debeDe(pedido)}`, 14, 72);
    doc.save(`recibo-${pedido.nombre.replace(/\s+/g,'_')}-${fechaCorta(pago.fecha).replace(/\//g,'-')}.pdf`);
    }).catch(() => alert('No se pudo cargar el generador de PDF. Revisá tu conexión e intentá de nuevo.'));
  }

  function guardarClienteNuevo(){
    if(!presClienteNombre) return;
    const yaExiste = listaClientes.find(c => c.nombre.toLowerCase()===presClienteNombre.toLowerCase());
    if(yaExiste) return;
    db.ref('clientes').push().set({nombre: presClienteNombre, telefono: presClienteTelefono});
  }
  function elegirClienteExistente(id){
    if(!id) { setPresClienteNombre(''); setPresClienteTelefono(''); return; }
    const c = clientes[id];
    setPresClienteNombre(c.nombre);
    setPresClienteTelefono(c.telefono || '');
  }
  function agregarItemPresupuesto(){
    if(!presProductoId) return;
    const p = productos[presProductoId];
    const m = medidasDisponiblesDe(p)[presVarianteIdx];
    if(!m) return;
    const cant = Number(presCantidad) || 1;
    setPresItems(prev => [...prev, {nombre: `${p.nombre} (${m.medida}${m.color ? ' - '+m.color : ''})`, cantidad: cant, precio: m.precio}]);
    setPresCantidad('1');
  }
  function agregarItemLibre(){
    if(!presOtroNombre || !presOtroPrecio) return;
    setPresItems(prev => [...prev, {nombre: presOtroNombre, cantidad: 1, precio: Number(presOtroPrecio)}]);
    setPresOtroNombre(''); setPresOtroPrecio('');
  }
  function quitarItemPresupuesto(idx){
    setPresItems(prev => prev.filter((_,i)=>i!==idx));
  }
  const totalPresupuesto = presItems.reduce((a,it)=>a+it.cantidad*it.precio,0);
  function generarPresupuestoPDF(){
    if(!presClienteNombre || presItems.length===0) return;
    asegurarPDF().then(() => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    if(config.logo){
      try{
        const fmt = config.logo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        doc.addImage(config.logo, fmt, 160, 10, 35, 35);
      }catch(e){}
    }
    doc.setFontSize(20);
    doc.setTextColor(150,113,79);
    doc.text(NOMBRE_NEGOCIO, 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(90,90,90);
    doc.text(`Presupuesto para: ${presClienteNombre}`, 14, 32);
    if(presClienteTelefono) doc.text(`Teléfono: ${presClienteTelefono}`, 14, 38);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 14, 44);
    const filas = presItems.map(it => [it.nombre, String(it.cantidad), `$${it.precio}`, `$${it.cantidad*it.precio}`]);
    doc.autoTable({
      head: [['Producto','Cantidad','Precio unit.','Subtotal']],
      body: filas,
      startY: 52,
      theme: 'grid',
      headStyles: {fillColor:[176,137,104]}
    });
    doc.setFontSize(14);
    doc.setTextColor(150,113,79);
    doc.text(`Total: $${totalPresupuesto}`, 14, doc.lastAutoTable.finalY + 12);
    doc.setFontSize(10);
    doc.setTextColor(150,150,150);
    doc.text('¡Gracias por elegirnos! Cualquier consulta, escribinos.', 14, doc.lastAutoTable.finalY + 22);
    doc.save(`presupuesto-${presClienteNombre.replace(/\s+/g,'_')}.pdf`);
    }).catch(() => alert('No se pudo cargar el generador de PDF. Revisá tu conexión e intentá de nuevo.'));
  }

  function guardarSaludoBot(){
    db.ref('chatbot/saludo').set(saludoBotInput);
  }
  function editarPreguntaBot(item){
    setChatbotForm({pregunta:item.pregunta, respuesta:item.respuesta, accion:item.accion || '', accionValor:item.accionValor || ''});
    setEditandoChatbotId(item.id);
  }
  function resetFormChatbot(){
    setChatbotForm({pregunta:'', respuesta:'', accion:'', accionValor:''});
    setEditandoChatbotId(null);
  }
  function guardarPreguntaBot(){
    if(!chatbotForm.pregunta || !chatbotForm.respuesta) return;
    const id = editandoChatbotId || db.ref('chatbot/preguntas').push().key;
    db.ref('chatbot/preguntas/'+id).set({
      pregunta: chatbotForm.pregunta,
      respuesta: chatbotForm.respuesta,
      accion: chatbotForm.accion || '',
      accionValor: chatbotForm.accionValor || ''
    });
    resetFormChatbot();
  }
  function eliminarPreguntaBot(id){
    db.ref('chatbot/preguntas/'+id).remove();
  }
  const listaPreguntasBot = Object.entries(chatbotPreguntas).map(([id,p]) => ({id, ...p}));
  const preguntasBotMostradas = listaPreguntasBot.length ? listaPreguntasBot : DEFAULT_PREGUNTAS_BOT;

  const ESTADOS = [
    {key:'recibido', label:'Recibido', color:'bg-amber-400'},
    {key:'en_proceso', label:'En proceso', color:'bg-sky-400'},
    {key:'entregado', label:'Entregado', color:'bg-emerald-500'},
    {key:'rechazado', label:'Rechazado', color:'bg-rose-500'}
  ];
  const ahora = new Date();
  const pedidosConfirmados = listaPedidos.filter(p => p.estado==='en_proceso' || p.estado==='entregado');
  const pedidosDelMes = pedidosConfirmados.filter(p => {
    const d = new Date(p.creado||0);
    return d.getMonth()===ahora.getMonth() && d.getFullYear()===ahora.getFullYear();
  });
  const totalVendidoMes = pedidosDelMes.reduce((a,p)=>a+p.total,0);
  const totalCobradoGlobal = pedidosConfirmados.reduce((a,p)=>a+pagadoDe(p),0);
  const totalPendienteGlobal = pedidosConfirmados.reduce((a,p)=>a+Math.max(debeDe(p),0),0);
  const rankingProductos = (() => {
    const conteo = {};
    pedidosConfirmados.forEach(p => (p.items||[]).forEach(it => { conteo[it.nombre] = (conteo[it.nombre]||0) + it.unidades; }));
    return Object.entries(conteo).sort((a,b)=>b[1]-a[1]).slice(0,5);
  })();
  const maxRanking = rankingProductos.length ? rankingProductos[0][1] : 1;
  const rankingVistas = [...listaProductos].filter(p => p.vistas > 0).sort((a,b) => (b.vistas||0)-(a.vistas||0)).slice(0,5);
  const maxVistas = rankingVistas.length ? rankingVistas[0].vistas : 1;
  // =================== FIN ADMIN ====================

  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-100 selection:text-brand-800">
      
      {/* Toast Notificación Al Agregar */}
      {notifAgregado && (
        <div className="fixed top-20 right-5 z-50 bg-brand-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-down border border-brand-500">
          <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
          <div>
            <p className="text-xs font-semibold">¡Producto agregado!</p>
            <p className="text-[10px] text-brand-100">Se añadió a tu carrito de compras.</p>
          </div>
        </div>
      )}

      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200/60 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center gap-3">

            {/* Logo & Marca */}
            <div className="flex items-center gap-2.5 cursor-pointer min-w-0" onClick={() => { setCategoria('Todos'); setSearch(''); }}>
              {config.logo ? (
                <img src={config.logo} alt="Logo" className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-full border border-brand-200 shadow-sm flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-heading font-bold text-lg sm:text-xl shadow-inner flex-shrink-0">
                  M
                </div>
              )}
              <div className="min-w-0">
                <h1 className="text-base sm:text-2xl font-heading font-bold tracking-tight bg-gradient-to-r from-brand-800 via-brand-600 to-amber-700 bg-clip-text text-transparent truncate leading-tight">
                  {NOMBRE_NEGOCIO}
                </h1>
                <p className="text-[10px] tracking-wider uppercase text-stone-400 font-medium hidden sm:block">Textiles para Soñar</p>
              </div>
            </div>

            {/* Acciones principales */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button 
                onClick={() => setMostrarCarrito(true)}
                className="relative bg-brand-600 hover:bg-brand-700 text-white pl-3.5 pr-4 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/25 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95">
                <i className="fa-solid fa-bag-shopping"></i>
                <span>Tus compras</span>
                {cantidadTotalCarrito > 0 && (
                  <span className="bg-amber-400 text-brand-900 font-bold w-5 h-5 rounded-full flex items-center justify-center text-[10px] animate-pulse-slow">
                    {cantidadTotalCarrito}
                  </span>
                )}
              </button>

              {/* Admin Key */}
              <button 
                onClick={() => setMostrarAdminModal(true)} 
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center text-xs transition flex-shrink-0">
                <i className="fa-solid fa-lock"></i>
              </button>
            </div>
          </div>

          {/* Acciones secundarias */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setMostrarTablaMedidas(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-[11px] font-semibold transition-all border border-stone-200">
              <span>📏</span> <span>Medidas</span>
            </button>

            <button 
              onClick={() => setMostrarCotizador(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-700 text-[11px] font-semibold border border-brand-200 transition-all">
              <span>🧮</span> <span>Presupuesto</span>
            </button>
          </div>
        </div>
      </header>

      {/* BANNER PROVEEDOR OFICIAL */}
      <section className="bg-brand-50/70 border-b border-brand-100/80 py-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 whitespace-nowrap">Proveedor oficial de:</p>
          <div className="flex items-center gap-4">
            <img src={LOGO_ALCOYANA} alt="Alcoyana" className="h-6 object-contain rounded-md shadow-sm"/>
            <img src={LOGO_JEANCARTIER} alt="Jean Cartier Hogar" className="h-6 object-contain rounded-md shadow-sm"/>
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS (versión compacta) */}
      {productosDestacados.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 w-full pt-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1.5">
            <span className="flex-shrink-0 text-xs font-bold uppercase tracking-wider text-brand-500 flex items-center gap-1.5">
              <span>⭐</span> Destacados
            </span>
            {productosDestacados.map(p => {
              const variantes = medidasDisponiblesDe(p);
              const variantesConFoto = variantes.filter(v => v.imagenes && v.imagenes.length);
              const img = imagenesDe(p)[0] || (variantesConFoto[0] && variantesConFoto[0].imagenes[0]) || IMG_PLACEHOLDER;
              return (
                <button key={p.id} onClick={() => abrirProducto(p)}
                  className="flex-shrink-0 flex items-center gap-2.5 bg-white border border-stone-200 rounded-full pl-1.5 pr-4 py-1.5 hover:border-brand-300 hover:shadow-sm transition-all">
                  <img src={img} alt={p.nombre} onError={e => { e.target.onerror=null; e.target.src=IMG_PLACEHOLDER; }} className="w-9 h-9 rounded-full object-cover flex-shrink-0"/>
                  <span className="text-xs font-semibold text-stone-700 whitespace-nowrap max-w-[140px] truncate">{p.nombre}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden py-10 sm:py-14 px-4 bg-gradient-to-b from-brand-100/40 via-stone-50/50 to-transparent">
        <div className="max-w-5xl mx-auto text-center space-y-4 animate-fade-in relative z-10">
          
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-brand-200 text-brand-700 text-xs font-semibold shadow-sm backdrop-blur-md">
            <span>✨</span> Colección Blancos y Confort 2026
          </span>

          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-stone-800 tracking-tight leading-tight">
            Vestí tu hogar con la dulzura y textura que merecés
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Sábanas de suave algodón, acolchados abrigo súper fluff, toallas de alta absorción y cortinas para transformar cada rincón.
          </p>

          {/* Buscador Estilizado */}
          <div className="max-w-xl mx-auto pt-3 relative">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por producto (ej. Sábanas 600 hilos, Cubrecama, Toallón)..."
                className="w-full bg-white border border-stone-200 rounded-full py-3.5 pl-12 pr-10 text-xs sm:text-sm shadow-xl shadow-stone-200/50 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all placeholder:text-stone-400"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-4 text-stone-400 text-sm"></i>
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 text-stone-400 hover:text-stone-600 text-xs">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Badges distintivos */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-[11px] text-stone-500 pt-2 font-medium">
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-truck-fast text-brand-500"></i> Envíos a todo el país</span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5"><i className="fa-solid fa-award text-brand-500"></i> Calidad Garantizada</span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5"><i className="fa-brands fa-whatsapp text-emerald-500"></i> Atención personalizada</span>
          </div>

        </div>
      </section>

      {/* BANNER ROTATIVO DE PRODUCTOS ALEATORIOS (destacado, grande) */}
      {bannerProductos.length > 0 && (() => {
        const p = bannerProductos[bannerIndice];
        const variantes = medidasDisponiblesDe(p);
        const variantesConFoto = variantes.filter(v => v.imagenes && v.imagenes.length);
        const img = imagenesDe(p)[0] || (variantesConFoto[0] && variantesConFoto[0].imagenes[0]) || IMG_PLACEHOLDER;
        const precioMin = variantes.length ? Math.min(...variantes.map(v => Number(v.precio))) : 0;
        return (
          <section className="max-w-7xl mx-auto px-4 w-full mb-8">
            <div
              key={p.id}
              onClick={() => abrirProducto(p)}
              className="cursor-pointer rounded-3xl overflow-hidden border border-brand-200 bg-gradient-to-r from-brand-50 via-white to-amber-50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in flex flex-col sm:flex-row items-stretch">
              <div className="w-full sm:w-80 h-52 sm:h-auto flex-shrink-0 bg-white">
                <img src={img} alt={p.nombre} onError={e => { e.target.onerror=null; e.target.src=IMG_PLACEHOLDER; }} className="w-full h-full object-cover"/>
              </div>
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold uppercase tracking-wider">
                  ✨ Te puede interesar
                </span>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-stone-800">{p.nombre}</h2>
                <p className="text-sm text-stone-500">{p.categoria}</p>
                {precioMin > 0 && (
                  <p className="font-heading italic font-bold text-brand-700 text-xl sm:text-2xl mt-1">Desde ${precioMin}</p>
                )}
                <div className="flex gap-1.5 mt-3">
                  {bannerProductos.map((_, idx) => (
                    <span key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === bannerIndice ? 'bg-brand-600 w-6' : 'bg-stone-300 w-1.5'}`}></span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      <div className="trama-textil"></div>

      {/* CATEGORÍAS & FILTROS */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-6">
        
        {/* Pills de Categorías */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          {['Todos', ...categorias].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-xs font-semibold transition-all duration-300 ${
                categoria === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 scale-105'
                  : 'bg-white/80 text-stone-600 border border-stone-200/70 hover:border-brand-300 hover:bg-brand-50/50'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Filtro secundario por Medida */}
        {medidasFiltroPublico.length > 0 && (
          <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-stone-400 font-medium text-[11px] whitespace-nowrap">Filtrar por medida:</span>
            <button
              onClick={() => setFiltroMedida('')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition ${
                !filtroMedida ? 'bg-stone-800 text-white' : 'bg-white text-stone-500 border border-stone-200'
              }`}>
              Todas
            </button>
            {medidasFiltroPublico.map(m => (
              <button
                key={m}
                onClick={() => setFiltroMedida(m)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition whitespace-nowrap ${
                  filtroMedida === m ? 'bg-stone-800 text-white' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
                }`}>
                {m}
              </button>
            ))}
          </div>
        )}

      </section>
            {/* CATÁLOGO DE PRODUCTOS (GRID) */}
      <main className="max-w-7xl mx-auto px-4 flex-1 w-full pb-16">
        {cargandoProductos ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {[...Array(8)].map((_,i) => (
              <div key={i} className="rounded-2xl border border-stone-200/80 overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-stone-200"></div>
                <div className="p-4 space-y-2">
                  <div className="h-3.5 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-100 rounded w-1/2"></div>
                  <div className="h-5 bg-stone-200 rounded w-1/3 mt-3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-stone-200/60 p-8 shadow-sm my-6">
            <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="font-heading font-bold text-lg text-stone-700">No encontramos productos</h3>
            <p className="text-xs text-stone-400 mt-1">Intentá cambiar la búsqueda o el filtro de categoría.</p>
            <button 
              onClick={() => { setCategoria('Todos'); setSearch(''); setFiltroMedida(''); }}
              className="mt-4 px-4 py-2 bg-brand-500 text-white text-xs font-semibold rounded-full hover:bg-brand-600 transition">
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productosFiltrados.map(p => {
              const imgs = imagenesDe(p);
              const variantes = medidasDisponiblesDe(p);
              const precioMin = variantes.length ? Math.min(...variantes.map(v => Number(v.precio))) : 0;
              const variantesConFoto = variantes.filter(v => v.imagenes && v.imagenes.length);
              const imgPrincipal = imgs[0] || (variantesConFoto[0] && variantesConFoto[0].imagenes[0]) || IMG_PLACEHOLDER;

              return (
                <div 
                  key={p.id}
                  className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
                  
                  {/* Contenedor Imagen */}
                  <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => abrirProducto(p)}>
                    <img 
                      src={imgPrincipal} 
                      alt={p.nombre}
                      loading="lazy"
                      onError={e => { e.target.onerror=null; e.target.src=IMG_PLACEHOLDER; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badge Categoría */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-stone-700 text-[10px] font-semibold px-3 py-1 rounded-full shadow-sm border border-white/60">
                      {p.categoria || 'Blanquería'}
                    </span>

                    {/* Botón Vista Rápida */}
                    <button className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md hover:bg-brand-600 hover:text-white text-stone-700 w-9 h-9 rounded-full flex items-center justify-center text-xs shadow-md transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                  </div>

                  {/* Cuerpo Card */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 
                        onClick={() => abrirProducto(p)}
                        className="font-heading font-semibold text-base text-stone-800 line-clamp-1 hover:text-brand-600 cursor-pointer transition">
                        {p.nombre}
                      </h3>
                      {p.descripcion && (
                        <p className="text-xs text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                          {p.descripcion}
                        </p>
                      )}
                    </div>

                    {/* Variantes & Precio */}
                    <div className="pt-2 border-t border-stone-100 space-y-3">

                      {variantes.length > 0 ? (
                        <div className="space-y-2">
                          <p className="flex items-baseline gap-1.5">
                            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Desde</span>
                            <span className="font-heading italic font-bold text-2xl text-brand-700">${precioMin}</span>
                          </p>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Medidas disponibles:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {[...new Set(variantes.map(v => v.medida))].map((med, idx) => (
                              <button
                                key={idx}
                                onClick={() => { abrirProducto(p); setModalMedidaSel(med); }}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-50 hover:bg-brand-50 text-stone-700 hover:text-brand-700 border border-stone-200 hover:border-brand-300 transition">
                                {med}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-xs text-stone-400 italic">
                          Sin stock momentáneo
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
            {/* FOOTER MODERNIZADO */}
      <footer className="mt-auto bg-white border-t border-stone-200/80 py-8 px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-4">
          <h3 className="font-heading font-bold text-lg text-stone-800">{NOMBRE_NEGOCIO}</h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Hacé tus consultas directamente por nuestras redes sociales o WhatsApp. ¡Estamos para ayudarte a equipar tu hogar!
          </p>

          <div className="flex justify-center items-center gap-4 pt-2">
            {config.whatsapp && (
              <a 
                href={"https://wa.me/" + config.whatsapp + "?text=Hola!%20Quisiera%20consultar%20por%20los%20productos%20del%20cat%C3%A1logo"} 
                target="_blank" 
                className="btn-red btn-whatsapp" 
                title="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            )}

            {config.instagram && (
              <a 
                href={"https://instagram.com/" + config.instagram} 
                target="_blank" 
                className="btn-red btn-instagram" 
                title="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
            )}
          </div>

          <p className="text-[10px] text-stone-400 pt-4 border-t border-stone-100">
            © 2026 {NOMBRE_NEGOCIO} • Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* DRAWER / MODAL DEL CARRITO */}
      {mostrarCarrito && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex justify-end animate-fade-in" onClick={() => setMostrarCarrito(false)}>
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
            
            {/* Header Carrito */}
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bag-shopping text-brand-600 text-lg"></i>
                <h2 className="font-heading font-bold text-lg text-stone-800">Mi Carrito de Compras</h2>
              </div>
              <button onClick={() => setMostrarCarrito(false)} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center transition">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Lista de Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
              {carrito.length === 0 ? (
                <div className="text-center py-16 text-stone-400 space-y-2">
                  <i className="fa-solid fa-cart-flatbed text-4xl text-stone-300 mb-2"></i>
                  <p className="text-xs font-medium">Tu carrito está vacío</p>
                  <p className="text-[11px] text-stone-300">¡Explorá el catálogo y sumá tus productos favoritos!</p>
                </div>
              ) : (
                carrito.map(item => (
                  <div key={item.cartId} className="flex gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100 items-center justify-between">
                    <img src={item.imagen || IMG_PLACEHOLDER} loading="lazy" onError={e => { e.target.onerror=null; e.target.src=IMG_PLACEHOLDER; }} className="w-14 h-14 object-cover rounded-xl border border-stone-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-stone-800 truncate">{item.nombre}</h4>
                      <p className="text-[10px] text-stone-400">{item.medida} {item.color ? `• ${item.color}` : ''}</p>
                      <p className="font-bold text-xs text-brand-600 mt-0.5">${item.precio * item.unidades}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-stone-200 rounded-lg bg-white">
                        <button onClick={() => cambiarUnidades(item.cartId, -1)} className="w-6 h-6 flex items-center justify-center text-xs text-stone-500 hover:bg-stone-100 font-bold">-</button>
                        <span className="px-2 text-xs font-bold text-stone-700">{item.unidades}</span>
                        <button onClick={() => cambiarUnidades(item.cartId, 1)} className="w-6 h-6 flex items-center justify-center text-xs text-stone-500 hover:bg-stone-100 font-bold">+</button>
                      </div>
                      <button onClick={() => quitarDelCarrito(item.cartId)} className="text-stone-300 hover:text-rose-500 text-xs">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Carrito & Formulario */}
            {carrito.length > 0 && (
              <div className="border-t border-stone-100 pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-stone-700 font-heading">Total Estimado:</span>
                  <span className="text-brand-600 font-heading text-2xl">${totalCarrito}</span>
                </div>

                <div className="space-y-2 bg-brand-50/50 p-4 rounded-2xl border border-brand-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700 mb-1">Tus Datos para la Entrega</p>
                  <input 
                    type="text" 
                    value={datosPedido.nombre} 
                    onChange={e => setDatosPedido({...datosPedido, nombre: e.target.value})}
                    placeholder="Tu nombre completo *"
                    className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                  <input 
                    type="text" 
                    value={datosPedido.telefono} 
                    onChange={e => setDatosPedido({...datosPedido, telefono: e.target.value})}
                    placeholder="Teléfono de contacto (WhatsApp) *"
                    className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                  <input 
                    type="text" 
                    value={datosPedido.zona} 
                    onChange={e => setDatosPedido({...datosPedido, zona: e.target.value})}
                    placeholder="Zona o localidad de entrega"
                    className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                  />
                </div>

                <button 
                  onClick={enviarPedidoWhatsApp}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-2xl text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2">
                  <i className="fa-brands fa-whatsapp text-base"></i> Confirmar Pedido por WhatsApp
                </button>
              </div>
            )}

          </div>
        </div>
      )}
          {/* MODAL DETALLE DE PRODUCTO */}
      {productoVisto && (() => {
        const variantes = medidasDisponiblesDe(productoVisto);
        const medidasUnicas = [...new Set(variantes.map(v => v.medida))];
        const variantesDeMedida = modalMedidaSel ? variantes.filter(v => v.medida === modalMedidaSel) : [];
        const coloresDeMedida = [...new Set(variantesDeMedida.map(v => v.color).filter(Boolean))];
        const preciosDeMedida = variantesDeMedida.map(v => v.precio);
        const precioMedidaTexto = preciosDeMedida.length ? (
          Math.min(...preciosDeMedida) === Math.max(...preciosDeMedida)
            ? `$${preciosDeMedida[0]}`
            : `Desde $${Math.min(...preciosDeMedida)}`
        ) : '';
        const varianteFinal = !modalMedidaSel ? null : (
          coloresDeMedida.length > 0
            ? variantesDeMedida.find(v => v.color === modalColorSel)
            : variantesDeMedida[0]
        );
        // Si la variante elegida (medida+color) tiene sus propias fotos, se muestran esas;
        // si no se eligió nada todavía, se arma una galería con las fotos generales del producto
        // más las de todas sus variantes, para que se pueda ver algo y deslizar desde que se abre.
        const galeriaCompleta = [...new Set([
          ...imagenesDe(productoVisto),
          ...variantes.flatMap(v => v.imagenes || [])
        ])];
        const imgs = (varianteFinal && varianteFinal.imagenes && varianteFinal.imagenes.length)
          ? varianteFinal.imagenes
          : galeriaCompleta;
        const productosRelacionados = listaProductos
          .filter(x => x.id !== productoVisto.id && x.categoria === productoVisto.categoria && medidasDisponiblesDe(x).length > 0)
          .slice(0, 3);

        function irAImagen(nuevoIdx){
          if(nuevoIdx < 0) nuevoIdx = imgs.length - 1;
          if(nuevoIdx > imgs.length - 1) nuevoIdx = 0;
          setIndiceImagen(nuevoIdx);
        }
        function onTouchStartImg(e){ touchStartX.current = e.touches[0].clientX; }
        function onTouchEndImg(e){
          if(touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if(Math.abs(dx) > 40){
            if(dx < 0) irAImagen(indiceImagen + 1);
            else irAImagen(indiceImagen - 1);
          }
          touchStartX.current = null;
        }

        return (
          <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setProductoVisto(null)}>
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-slide-up border border-stone-100" onClick={e => e.stopPropagation()}>
              
              <div className="relative aspect-square bg-stone-100 overflow-hidden touch-pan-y" onTouchStart={onTouchStartImg} onTouchEnd={onTouchEndImg}>
                <img src={imgs[indiceImagen] || IMG_PLACEHOLDER} className="w-full h-full object-cover select-none pointer-events-none" draggable="false" />
                <button onClick={() => setProductoVisto(null)} className="absolute top-4 right-4 bg-white/80 hover:bg-white text-stone-700 w-9 h-9 rounded-full flex items-center justify-center shadow-md z-10">
                  <i className="fa-solid fa-xmark"></i>
                </button>
                {imgs.length > 1 && (
                  <>
                    <button onClick={() => irAImagen(indiceImagen - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-700 w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                      <i className="fa-solid fa-chevron-left text-xs"></i>
                    </button>
                    <button onClick={() => irAImagen(indiceImagen + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-stone-700 w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                      {imgs.map((_, idx) => (
                        <button key={idx} onClick={() => setIndiceImagen(idx)} className={`w-2 h-2 rounded-full transition ${idx === indiceImagen ? 'bg-white scale-125' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{productoVisto.categoria}</span>
                    <h3 className="font-heading font-bold text-xl text-stone-800">{productoVisto.nombre}</h3>
                    {productoVisto.descripcion && <p className="text-xs text-stone-500 mt-2 leading-relaxed">{productoVisto.descripcion}</p>}
                    {productoVisto.video && (
                      <button onClick={() => setVideoAbierto(productoVisto.video)}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-full border border-brand-200 transition">
                        <i className="fa-solid fa-circle-play"></i> Mirá en detalle
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => compartirProductoWhatsapp(productoVisto)}
                      title="Compartir por WhatsApp"
                      className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 transition">
                      <i className="fa-brands fa-whatsapp text-base"></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-t border-stone-100 pt-3">
                  <p className="text-xs font-bold text-stone-700">1. Elegí la medida</p>
                  <div className="flex flex-wrap gap-2">
                    {medidasUnicas.map(med => (
                      <button key={med} onClick={() => { setModalMedidaSel(med); setModalColorSel(null); setIndiceImagen(0); }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition ${
                          modalMedidaSel === med ? 'bg-brand-600 text-white border-brand-600 shadow-sm' : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-brand-300'
                        }`}>
                        {med}
                      </button>
                    ))}
                  </div>
                </div>

                {modalMedidaSel && (
                  <div className="space-y-1 border-t border-stone-100 pt-3">
                    <p className="text-xs font-bold text-stone-700">2. Precio</p>
                    <p className="text-2xl font-heading italic font-bold text-brand-700">{precioMedidaTexto}</p>
                  </div>
                )}

                {modalMedidaSel && coloresDeMedida.length > 0 && (() => {
                  const hayColorReal = coloresDeMedida.some(c => esColorReal(c));
                  const etiqueta = hayColorReal ? 'color' : 'modelo';
                  return (
                  <div className="space-y-2 border-t border-stone-100 pt-3">
                    <p className="text-xs font-bold text-stone-700">3. Elegí el {etiqueta}</p>
                    <div className="flex flex-wrap gap-2">
                      {coloresDeMedida.map(col => (
                        <button key={col} onClick={() => { setModalColorSel(col); setIndiceImagen(0); }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                            modalColorSel === col ? 'bg-brand-50 border-brand-500 text-brand-800' : 'bg-white border-stone-200 text-stone-700 hover:border-brand-300'
                          }`}>
                          {esColorReal(col) && codigoDeColor(col) && <span className="w-3.5 h-3.5 rounded-full border border-stone-300 flex-shrink-0" style={{backgroundColor: codigoDeColor(col)}}></span>}
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                  );
                })()}

                <button
                  disabled={!varianteFinal}
                  onClick={() => { agregarAlCarrito(productoVisto, varianteFinal); setProductoVisto(null); }}
                  className={`w-full py-3 rounded-2xl text-sm font-bold transition ${
                    varianteFinal ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-md' : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}>
                  {varianteFinal ? '+ Agregar al carrito' : (modalMedidaSel ? (coloresDeMedida.some(c=>esColorReal(c)) ? 'Elegí un color' : 'Elegí un modelo') : 'Elegí una medida')}
                </button>

                {productosRelacionados.length > 0 && (
                  <div className="border-t border-stone-100 pt-4">
                    <p className="text-xs font-bold text-stone-700 mb-2.5">También te puede interesar</p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {productosRelacionados.map(rel => {
                        const relImgs = imagenesDe(rel);
                        const relVariantesConFoto = medidasDisponiblesDe(rel).filter(v => v.imagenes && v.imagenes.length);
                        const relImgPrincipal = relImgs[0] || (relVariantesConFoto[0] && relVariantesConFoto[0].imagenes[0]) || IMG_PLACEHOLDER;
                        const relPrecios = medidasDisponiblesDe(rel).map(v=>v.precio);
                        const relPrecioMin = relPrecios.length ? Math.min(...relPrecios) : 0;
                        return (
                          <button key={rel.id} onClick={() => abrirProducto(rel)} className="text-left group">
                            <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                              <img src={relImgPrincipal} loading="lazy" onError={e => { e.target.onerror=null; e.target.src=IMG_PLACEHOLDER; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                            </div>
                            <p className="text-[10px] font-medium text-stone-700 mt-1 line-clamp-2 leading-tight">{rel.nombre}</p>
                            <p className="text-[10px] font-bold text-brand-600">Desde ${relPrecioMin}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })()}

      {/* VISOR DE VIDEO DEL PRODUCTO */}
      {videoAbierto && (
        <div className="fixed inset-0 z-[60] bg-black/85 flex items-center justify-center p-4 animate-fade-in" onClick={() => setVideoAbierto(null)}>
          <button onClick={() => setVideoAbierto(null)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center z-10">
            <i className="fa-solid fa-xmark"></i>
          </button>
          <video
            src={videoAbierto}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl bg-black"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* MODAL COTIZADOR RÁPIDO (PÚBLICO) */}
      {mostrarCotizador && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex justify-end animate-fade-in" onClick={()=>setMostrarCotizador(false)}>
          <div className="bg-white w-full max-w-md h-full p-6 overflow-y-auto flex flex-col shadow-2xl animate-slide-up" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <h2 className="text-xl font-heading font-bold text-stone-800">🧮 Cotizador Rápido</h2>
              <button onClick={()=>setMostrarCotizador(false)} className="text-stone-400 hover:text-stone-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="py-4 space-y-3">
              <select value={pubProductoId} onChange={e=>{setPubProductoId(e.target.value); setPubVarianteIdx(0);}} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs bg-white">
                <option value="">Elegir producto del catálogo</option>
                {listaProductos.filter(p=>medidasDisponiblesDe(p).length>0).map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>

              {pubProductoId && (
                <select value={pubVarianteIdx} onChange={e=>setPubVarianteIdx(Number(e.target.value))} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs bg-white">
                  {medidasDisponiblesDe(productos[pubProductoId]).map((m,idx)=>(
                    <option key={idx} value={idx}>{m.medida}{m.color ? ` — ${m.color}` : ''} — ${m.precio}</option>
                  ))}
                </select>
              )}

              <div className="flex gap-2">
                <input value={pubCantidad} onChange={e=>setPubCantidad(e.target.value)} type="number" min="1" placeholder="Cantidad" className="border border-stone-200 rounded-xl p-2.5 text-xs w-28"/>
                <button onClick={agregarItemPublico} className="flex-1 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition">Agregar al borrador</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border-t border-b border-stone-100 py-3 space-y-2">
              {pubItems.length===0 && <p className="text-stone-400 text-xs text-center py-6">Seleccioná ítems para calcular el presupuesto estimado.</p>}
              {pubItems.map((it,idx)=>(
                <div key={idx} className="flex justify-between items-center text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <span>{it.cantidad}x {it.nombre} — <b>${it.cantidad*it.precio}</b></span>
                  <button onClick={()=>quitarItemPublico(idx)} className="text-stone-300 hover:text-rose-500"><i className="fa-solid fa-trash-can"></i></button>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-700 text-sm">Total Estimado:</span>
                <span className="text-brand-600 font-heading text-xl font-bold">${pubTotal}</span>
              </div>

              {pubItems.length>0 && config.whatsapp && (
                <button onClick={enviarPresupuestoPublicoWhatsapp}
                  className="w-full bg-emerald-500 text-white py-3 rounded-2xl text-xs font-bold shadow-md hover:bg-emerald-600 transition flex items-center justify-center gap-2">
                  <i className="fa-brands fa-whatsapp text-base"></i> Consultar este presupuesto por WhatsApp
                </button>
              )}

              <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                * Los precios son de carácter orientativo y están sujetos a confirmación.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TABLA DE MEDIDAS */}
      {mostrarTablaMedidas && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setMostrarTablaMedidas(false)}>
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-stone-100" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-stone-100">
              <h3 className="font-heading font-bold text-lg text-stone-800">📏 Guía y Tabla de Medidas</h3>
              <button onClick={() => setMostrarTablaMedidas(false)} className="text-stone-400 hover:text-stone-600">
                <i className="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-4">
              {listaTablaMedidas.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-8">Aún no se han cargado imágenes de la guía de medidas.</p>
              ) : (
                listaTablaMedidas.map(item => (
                  <img key={item.id} src={item.imagen} className="w-full rounded-2xl border border-stone-100 shadow-sm" />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL LOGIN / PANEL DE ADMINISTRACIÓN */}
      {mostrarAdminModal && !isAdmin && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setMostrarAdminModal(false)}>
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-stone-100 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-lg text-stone-800">Acceso administrador</h3>
              <button onClick={() => setMostrarAdminModal(false)} className="text-stone-400 hover:text-stone-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="space-y-2.5">
              <input value={usuario} onChange={e=>setUsuario(e.target.value)} placeholder="Usuario" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40"/>
              <input value={contrasena} onChange={e=>setContrasena(e.target.value)} type="password" placeholder="Contraseña" onKeyDown={e=>e.key==='Enter' && intentarLogin()} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/40"/>
              {errorLogin && <p className="text-rose-500 text-[11px] font-medium">{errorLogin}</p>}
              <button onClick={intentarLogin} className="w-full bg-brand-600 hover:bg-brand-700 text-white py-2.5 rounded-xl text-xs font-bold transition">Ingresar</button>
            </div>
          </div>
        </div>
      )}

      {mostrarAdminModal && isAdmin && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in" onClick={() => setMostrarAdminModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-100 overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b border-stone-100 bg-gradient-to-r from-brand-700 to-brand-500 text-white">
              <h3 className="font-heading font-bold text-lg">Panel de administración</h3>
              <div className="flex items-center gap-3">
                <button onClick={cerrarSesion} className="text-[11px] font-semibold underline underline-offset-2 opacity-90 hover:opacity-100">Cerrar sesión</button>
                <button onClick={() => setMostrarAdminModal(false)} className="text-white/90 hover:text-white">
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
            </div>

            <div className="px-4 pt-3 flex gap-1.5 overflow-x-auto no-scrollbar border-b border-stone-100 pb-3">
              {['tablero','productos','medidas','colores','categorias','importar','cargarNuevos','vincularFotos','sinFotos','negocio','pedidos','presupuestos','tablaMedidas','chatbot'].map(tab=>(
                <button key={tab} onClick={()=>setAdminTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition ${
                    adminTab===tab ? 'bg-brand-600 text-white shadow-sm' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                  }`}>
                  {tab==='tablero'?'📊 Tablero':tab==='productos'?'Productos':tab==='medidas'?'Medidas':tab==='colores'?'🎨 Colores':tab==='categorias'?'Categorías':tab==='importar'?'📥 Importar planilla':tab==='cargarNuevos'?'📦 Productos nuevos':tab==='vincularFotos'?'🖼️ Vincular fotos':tab==='sinFotos'?`📷 Sin fotos (${productosSinFotoInfo.length})`:tab==='negocio'?'Config':tab==='pedidos'?`Pedidos (${pedidosPendientes})`:tab==='presupuestos'?'Presupuestos':tab==='tablaMedidas'?'📏 Tabla de medidas':'🤖 Bot'}
                </button>
              ))}
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {adminTab==='tablero' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-brand-500 to-amber-400 rounded-2xl p-4 text-white shadow-sm">
                      <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Ventas del mes</p>
                      <p className="text-2xl font-heading font-bold">${totalVendidoMes}</p>
                      <p className="text-[11px] opacity-90">💰 {pedidosDelMes.length} pedidos</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl p-4 text-white shadow-sm">
                      <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Total Cobrado</p>
                      <p className="text-2xl font-heading font-bold">${totalCobradoGlobal}</p>
                      <p className="text-[11px] opacity-90">✅ Acumulado</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl p-4 text-white shadow-sm col-span-2">
                      <p className="text-[10px] uppercase font-bold tracking-wider opacity-80">Pendiente de cobro</p>
                      <p className="text-2xl font-heading font-bold">${totalPendienteGlobal}</p>
                      <p className="text-[11px] opacity-90">⏳ Entre pedidos activos</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {ESTADOS.map(e=>(
                      <div key={e.key} className={`${e.color} rounded-xl p-2.5 text-white text-center shadow-sm`}>
                        <p className="text-base font-bold font-heading">{listaPedidos.filter(p=>p.estado===e.key).length}</p>
                        <p className="text-[10px] uppercase font-semibold">{e.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3">🏆 Lo más vendido</h3>
                    {rankingProductos.length===0 && <p className="text-stone-400 text-xs">Sin información de ventas aún.</p>}
                    {rankingProductos.map(([nombre,cant])=>(
                      <div key={nombre} className="mb-2.5">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-stone-700">{nombre}</span>
                          <span className="font-bold text-stone-500">{cant} u.</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2">
                          <div className="bg-brand-500 h-2 rounded-full" style={{width: `${(cant/maxRanking)*100}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-3">👀 Productos más vistos</h3>
                    {rankingVistas.length===0 && <p className="text-stone-400 text-xs">Todavía no hay vistas registradas.</p>}
                    {rankingVistas.map(p=>(
                      <div key={p.id} className="mb-2.5">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-stone-700">{p.nombre}</span>
                          <span className="font-bold text-stone-500">{p.vistas} vistas</span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-2">
                          <div className="bg-sky-500 h-2 rounded-full" style={{width: `${(p.vistas/maxVistas)*100}%`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab==='productos' && (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-purple-700 mb-2">💲 Aumento Masivo</h3>
                    <div className="flex gap-2 mb-2">
                      <input value={aumentoPorcentaje} onChange={e=>setAumentoPorcentaje(e.target.value)} type="number" placeholder="% Aumento" className="border border-stone-200 rounded-xl p-2 text-xs flex-1 bg-white"/>
                      <select value={aumentoRedondeo} onChange={e=>setAumentoRedondeo(e.target.value)} className="border border-stone-200 rounded-xl p-2 text-xs bg-white">
                        <option value="500">Redondear a $500</option>
                        <option value="1000">Redondear a $1000</option>
                      </select>
                    </div>
                    <button onClick={aplicarAumento} className="w-full bg-purple-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-purple-700 transition">Aplicar cambio general</button>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-600 mb-3">{editandoId ? 'Editar producto' : 'Nuevo producto'}</h3>
                    <input value={form.nombre} onChange={e=>setForm({...form, nombre:e.target.value})} placeholder="Nombre del producto" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs mb-2 bg-white"/>
                    <select value={form.categoria} onChange={e=>setForm({...form, categoria:e.target.value})} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs mb-2 bg-white">
                      <option value="">Seleccionar categoría</option>
                      {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea value={form.descripcion} onChange={e=>setForm({...form, descripcion:e.target.value})} placeholder="Descripción detallada" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs mb-3 bg-white" rows="2"></textarea>
                    <input value={form.video} onChange={e=>setForm({...form, video:e.target.value})} placeholder="Link del video (.mp4) - opcional" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs mb-3 bg-white"/>

                    <label className="flex items-center gap-2 mb-3 text-xs font-semibold text-stone-600 cursor-pointer">
                      <input type="checkbox" checked={!!form.destacado} onChange={e=>setForm({...form, destacado:e.target.checked})} className="w-4 h-4 accent-brand-600"/>
                      ⭐ Destacar este producto en el banner de la home
                    </label>

                    <label className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block mb-1">Medidas y precios</label>
                    {medidas.length===0 && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2 mb-2">Primero cargá las medidas del comercio en la pestaña "Medidas".</p>
                    )}
                    {form.medidas.map((m,idx)=>(
                      <div key={idx} className="border border-stone-100 rounded-xl p-2 mb-2 bg-white space-y-1.5">
                        <div className="flex gap-2 items-center">
                          <select value={m.medida} onChange={e=>cambiarMedidaForm(idx,'medida',e.target.value)} className="border border-stone-200 rounded-xl p-2 text-xs flex-1 bg-white">
                            <option value="">Medida</option>
                            {m.medida && !normalizarMedidasArr(medidas).some(md=>md.nombre===m.medida) && (
                              <option value={m.medida}>{m.medida} (sin curar)</option>
                            )}
                            {normalizarMedidasArr(medidas).map(md => <option key={md.nombre} value={md.nombre}>{md.nombre}</option>)}
                          </select>
                          <div className="flex items-center gap-1.5 flex-1">
                            {m.color && esColorReal(m.color) && codigoDeColor(m.color) && (
                              <span className="w-4 h-4 rounded-full border border-stone-300 flex-shrink-0" style={{backgroundColor: codigoDeColor(m.color)}}></span>
                            )}
                            <select value={m.color||''} onChange={e=>cambiarMedidaForm(idx,'color',e.target.value)} className="border border-stone-200 rounded-xl p-2 text-xs flex-1 bg-white">
                              <option value="">Color / Modelo (opcional)</option>
                              {m.color && !colores.some(c=>c.nombre===m.color) && (
                                <option value={m.color}>{m.color} (sin curar)</option>
                              )}
                              {colores.map(c => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
                            </select>
                          </div>
                          {form.medidas.length>1 && <button onClick={()=>quitarFilaMedida(idx)} className="text-rose-500 text-xs"><i className="fa-solid fa-xmark"></i></button>}
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-stone-400">$</span>
                          <input value={m.precio} onChange={e=>cambiarMedidaForm(idx,'precio',e.target.value)} type="number" placeholder="Precio" className="border border-stone-200 rounded-xl p-2 text-xs w-24 bg-white"/>
                          <label className="flex items-center gap-1 text-[10px] text-stone-500 whitespace-nowrap">
                            <input type="checkbox" checked={m.disponible!==false} onChange={()=>toggleDisponibleForm(idx)} className="rounded text-brand-500 focus:ring-brand-500"/>
                            Disp.
                          </label>
                          <input value={m.codigo||''} onChange={e=>cambiarMedidaForm(idx,'codigo',e.target.value)} placeholder="Código de artículo" className="border border-stone-200 rounded-xl p-2 text-xs flex-1 bg-white"/>
                        </div>
                        <div className="flex gap-2 items-center">
                          <i className="fa-solid fa-barcode text-stone-300 text-xs w-4 text-center"></i>
                          <input value={m.codigoBarras||''} onChange={e=>cambiarMedidaForm(idx,'codigoBarras',e.target.value)} placeholder="Código de barras (para actualizar disponibilidad por color)" className="border border-stone-200 rounded-xl p-2 text-xs flex-1 bg-white"/>
                        </div>
                        {m.imagenes && m.imagenes.length > 0 && (
                          <div className="flex gap-1.5 flex-wrap pt-1">
                            {m.imagenes.map((img, imgIdx) => (
                              <div key={imgIdx} className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200">
                                <img src={img} className="w-full h-full object-cover"/>
                                <button onClick={()=>quitarImagenMedida(idx, imgIdx)} className="absolute -top-1 -right-1 bg-rose-500 text-white w-3.5 h-3.5 rounded-full text-[8px] flex items-center justify-center">✕</button>
                              </div>
                            ))}
                            <span className="text-[10px] text-stone-400 self-center">Foto{m.imagenes.length>1?'s':''} de esta medida/color (se cargan desde "🖼️ Vincular fotos")</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <button onClick={agregarFilaMedida} className="text-xs text-brand-600 font-semibold mb-3 block">+ Agregar medida</button>

                    <input type="file" accept="image/*" multiple onChange={handleImagenes} className="w-full text-xs text-stone-500 mb-2"/>

                    <div className="border border-dashed border-stone-300 rounded-xl p-2.5 mb-2 bg-stone-50/50">
                      <p className="text-[10px] text-stone-500 mb-1.5 leading-relaxed">
                        O pegá acá los links para compartir de Google Drive de las fotos (uno por línea o separados por coma). El archivo tiene que estar compartido como "Cualquier persona con el enlace".
                      </p>
                      <textarea value={driveLinksInput} onChange={e=>setDriveLinksInput(e.target.value)} placeholder="https://drive.google.com/file/d/XXXXX/view..." className="w-full border border-stone-200 rounded-lg p-2 text-[11px] bg-white mb-1.5" rows="2"></textarea>
                      <button onClick={agregarImagenesDesdeDrive} disabled={!driveLinksInput.trim()} className="text-xs text-brand-600 font-semibold disabled:opacity-40">+ Agregar fotos desde Drive</button>
                    </div>

                    <div className="flex gap-2 flex-wrap mb-3">
                      {form.imagenes.map((img,idx)=>(
                        <div key={idx} className="relative w-14 h-14">
                          <img src={img} className="w-full h-full object-cover rounded-xl border border-stone-200"/>
                          <button onClick={()=>quitarImagenForm(idx)} className="absolute -top-1 -right-1 bg-rose-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center">✕</button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={guardarProducto} className="flex-1 bg-brand-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-brand-700 transition">{editandoId ? 'Guardar Cambios' : 'Crear Producto'}</button>
                      {editandoId && <button onClick={resetForm} className="px-4 bg-stone-200 text-stone-600 rounded-xl text-xs">Cancelar</button>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-400">Catálogo actual</h3>
                    <p className="text-[11px] text-stone-400">Tocá una medida para marcarla Disponible / No disponible sin tener que editar el producto.</p>
                    {listaProductos.map(p => (
                      <div key={p.id} className="border border-stone-100 rounded-xl p-3 bg-white space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-stone-700">{p.destacado && '⭐ '}{p.nombre} <span className="text-stone-400">({p.categoria})</span></span>
                          <div className="flex gap-2 text-sm">
                            <button onClick={()=>editarProducto(p)} className="text-sky-600"><i className="fa-solid fa-pen"></i></button>
                            <button onClick={()=>eliminarProducto(p.id)} className="text-rose-500"><i className="fa-solid fa-trash-can"></i></button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {medidasDe(p).map((m,idx)=>(
                            <button key={idx} onClick={()=>toggleDisponibleProducto(p.id, idx, m.disponible!==false)}
                              title={m.codigo ? `Código: ${m.codigo}` : ''}
                              className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full transition ${
                                m.disponible!==false
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                                  : 'bg-stone-200 text-stone-400 border border-stone-300 line-through'
                              }`}>
                              {m.color && esColorReal(m.color) && codigoDeColor(m.color) && (
                                <span className="w-2.5 h-2.5 rounded-full border border-white/60 flex-shrink-0" style={{backgroundColor: codigoDeColor(m.color)}}></span>
                              )}
                              {m.medida}{m.color ? ` · ${m.color}` : ''} · ${m.precio}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab==='medidas' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-400">Esta es la lista de medidas para elegir al cargar un producto (siempre completa, no se toca). El tilde "Mostrar en filtro" controla si esa medida aparece como opción de filtro para el cliente — <b>borrarla de acá no la borra de ningún producto</b>, en el detalle del producto siempre se ve igual.</p>
                  <div className="flex gap-2">
                    <input value={nuevaMedida} onChange={e=>setNuevaMedida(e.target.value)} placeholder="Ej: Queen" className="border border-stone-200 rounded-xl flex-1 p-2.5 text-xs"/>
                    <button onClick={agregarMedidaGlobal} className="bg-brand-600 text-white px-4 rounded-xl text-xs font-bold hover:bg-brand-700">Agregar</button>
                  </div>
                  <div className="space-y-1.5">
                    {normalizarMedidasArr(medidas).map(m => (
                      <div key={m.nombre} className="flex justify-between items-center border border-stone-100 p-2.5 rounded-xl text-xs gap-2">
                        <span className="text-stone-700 font-medium">{m.nombre}</span>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <label className="flex items-center gap-1.5 text-[11px] text-stone-500 cursor-pointer whitespace-nowrap">
                            <input type="checkbox" checked={m.mostrarFiltro !== false} onChange={()=>toggleMedidaFiltro(m.nombre)} className="w-3.5 h-3.5 accent-brand-600"/>
                            Mostrar en filtro
                          </label>
                          <button onClick={()=>eliminarMedidaGlobal(m.nombre)} className="text-rose-500 font-semibold">Borrar</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {medidasEnCatalogo.filter(m => !normalizarMedidasArr(medidas).some(x=>x.nombre===m)).length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-2">
                      <p className="text-[11px] text-amber-900 font-semibold">Medidas que tenés en productos pero todavía no están en esta lista (por eso no aparecen como filtro):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {medidasEnCatalogo.filter(m => !normalizarMedidasArr(medidas).some(x=>x.nombre===m)).map(m => (
                          <button key={m} onClick={() => db.ref('medidas').set([...normalizarMedidasArr(medidas), {nombre:m, mostrarFiltro:true}])}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100">
                            + {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {adminTab==='colores' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-400">Cargá acá los colores o modelos/variantes de diseño del comercio (ej: Rojo, o "Nativa Cherry" si el nombre del modelo hace de variante): ponele un nombre y, si es un color real, elegí el tono — si es un nombre de modelo, dejá el tono como está, no se va a mostrar el círculo de color. Después vas a poder asignarlo a cada medida de tus productos.</p>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={nuevoColorCodigo} onChange={e=>setNuevoColorCodigo(e.target.value)} className="w-11 h-10 rounded-xl border border-stone-200 p-0.5 bg-white cursor-pointer"/>
                    <input value={nuevoColorNombre} onChange={e=>setNuevoColorNombre(e.target.value)} placeholder="Nombre del color (ej: Rojo)" className="border border-stone-200 rounded-xl flex-1 p-2.5 text-xs"/>
                    <button onClick={agregarColorGlobal} className="bg-brand-600 text-white px-4 rounded-xl text-xs font-bold hover:bg-brand-700">Agregar</button>
                  </div>
                  <label className="flex items-center gap-1.5 text-[11px] text-stone-500 cursor-pointer">
                    <input type="checkbox" checked={nuevoColorEsColor} onChange={e=>setNuevoColorEsColor(e.target.checked)} className="w-3.5 h-3.5 accent-brand-600"/>
                    Es un color real (mostrar el círculo de color al cliente)
                  </label>
                  <div className="space-y-1.5">
                    {colores.map(c => (
                      editandoColorNombre === c.nombre ? (
                        <div key={c.nombre} className="flex flex-wrap gap-2 items-center border border-brand-200 bg-brand-50/50 p-2.5 rounded-xl text-xs">
                          <input type="color" value={colorEditCodigo} onChange={e=>setColorEditCodigo(e.target.value)} className="w-9 h-8 rounded-lg border border-stone-200 p-0.5 bg-white cursor-pointer flex-shrink-0"/>
                          <input value={colorEditNombre} onChange={e=>setColorEditNombre(e.target.value)} className="border border-stone-200 rounded-lg flex-1 p-2 text-xs bg-white"/>
                          <label className="flex items-center gap-1 text-[10px] text-stone-500 cursor-pointer whitespace-nowrap">
                            <input type="checkbox" checked={colorEditEsColor} onChange={e=>setColorEditEsColor(e.target.checked)} className="w-3.5 h-3.5 accent-brand-600"/>
                            Es color real
                          </label>
                          <button onClick={guardarEdicionColor} disabled={guardandoColor} className="text-emerald-600 font-semibold px-2 disabled:opacity-50">Guardar</button>
                          <button onClick={cancelarEdicionColor} disabled={guardandoColor} className="text-stone-400 font-semibold px-1">Cancelar</button>
                        </div>
                      ) : (
                        <div key={c.nombre} className="flex justify-between items-center border border-stone-100 p-2.5 rounded-xl text-xs">
                          <span className="flex items-center gap-2 text-stone-700 font-medium">
                            {c.esColor !== false ? (
                              <span className="w-4 h-4 rounded-full border border-stone-300 shadow-sm inline-block" style={{backgroundColor: c.codigo}}></span>
                            ) : (
                              <span className="text-[9px] font-bold uppercase tracking-wide text-stone-400 border border-stone-300 rounded px-1 py-0.5">Modelo</span>
                            )}
                            {c.nombre}
                          </span>
                          <div className="flex items-center gap-3">
                            <button onClick={()=>iniciarEdicionColor(c)} className="text-brand-600 font-semibold">Editar</button>
                            <button onClick={()=>eliminarColorGlobal(c.nombre)} className="text-rose-500 font-semibold">Borrar</button>
                          </div>
                        </div>
                      )
                    ))}
                    {colores.length===0 && <p className="text-stone-400 text-xs">Todavía no cargaste colores.</p>}
                  </div>

                  {coloresEnCatalogo.filter(c => !colores.some(x=>x.nombre===c)).length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 space-y-2">
                      <p className="text-[11px] text-amber-900 font-semibold">Colores que tenés en productos pero todavía no están cargados acá (se agregan con un tono genérico, después les elegís el tono real con "Editar"):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {coloresEnCatalogo.filter(c => !colores.some(x=>x.nombre===c)).map(c => (
                          <button key={c} onClick={() => agregarColorRapido(c)}
                            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-amber-300 text-amber-800 hover:bg-amber-100">
                            + {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {adminTab==='categorias' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input value={nuevaCategoria} onChange={e=>setNuevaCategoria(e.target.value)} placeholder="Nombre de categoría" className="border border-stone-200 rounded-xl flex-1 p-2.5 text-xs"/>
                    <button onClick={agregarCategoria} className="bg-brand-600 text-white px-4 rounded-xl text-xs font-bold hover:bg-brand-700">Agregar</button>
                  </div>
                  <div className="space-y-1.5">
                    {categorias.map(c => (
                      <div key={c} className="flex justify-between items-center border border-stone-100 p-2.5 rounded-xl text-xs">
                        <span className="text-stone-700 font-medium">{c}</span>
                        <button onClick={()=>eliminarCategoria(c)} className="text-rose-500 font-semibold">Borrar</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab==='importar' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-800">📥 Cómo funciona</h3>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Subí acá el archivo .xlsx tal cual te lo manda la fábrica (hoja "PEDIDO"). La app lee la columna de disponibilidad de cada artículo y actualiza automáticamente la disponibilidad de tus medidas.
                    </p>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Para que una medida se actualice, tiene que tener cargado su <b>Código de barras</b> (el de la columna "Codbarras" de la planilla — es el que distingue color, a diferencia del código de artículo que puede repetirse entre colores). Eso se carga en la pestaña "Productos", en el segundo campo de cada fila de medida.
                    </p>
                  </div>
                  <input type="file" accept=".xlsx,.xls" onChange={handleImportarPlanilla} disabled={importando} className="w-full text-xs text-stone-500"/>
                  {importando && <p className="text-xs text-brand-600 font-semibold">Leyendo planilla...</p>}
                  {resumenImportacion && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
                      <p className="text-xs text-emerald-800 font-bold">✅ Importación completada</p>
                      <p className="text-[11px] text-emerald-700">Códigos leídos en la planilla: {resumenImportacion.totalCodigos}</p>
                      <p className="text-[11px] text-emerald-700">Coincidencias con tu catálogo: {resumenImportacion.encontrados}</p>
                      <p className="text-[11px] text-emerald-700">Medidas actualizadas: {resumenImportacion.actualizados}</p>
                    </div>
                  )}
                </div>
              )}

              {adminTab==='cargarNuevos' && (
                <div className="space-y-4">
                  <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-sky-800">📦 Cargar productos de una temporada nueva</h3>
                    <p className="text-[11px] text-sky-900 leading-relaxed">
                      Subí la planilla que te manda la fábrica (funciona tanto con la planilla de pedido por sucursal como con la lista de precios en catálogo). Agrupa las variaciones de un mismo producto por su diseño/línea, y carga <b>nombre, categoría, tamaño, color/modelo, código de barras y precio</b> tal como figuran en la planilla (si la planilla trae columna Modelo/Color).
                    </p>
                    <p className="text-[11px] text-sky-900 leading-relaxed">
                      Quedan marcados como <b>No disponible</b> hasta que vos completes la foto desde la pestaña "Productos" y actives cada medida cuando esté lista para mostrarse. Los colores que traiga la planilla y no tengas cargados en la pestaña "Colores" te van a aparecer ahí para sumarlos con un clic. Los códigos de barras que ya existan en tu catálogo actual no se vuelven a cargar de nuevo. Una vez cargados, podés ir a "Importar planilla" con la misma planilla para que la disponibilidad se sincronice automáticamente por código de barras.
                    </p>
                  </div>

                  <input type="file" accept=".xlsx,.xls" onChange={handleArchivoProductosNuevos} disabled={leyendoNuevos || cargandoNuevos} className="w-full text-xs text-stone-500"/>
                  {leyendoNuevos && <p className="text-xs text-brand-600 font-semibold">Leyendo planilla...</p>}

                  {previewNuevos && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                      <p className="text-xs text-amber-800 font-bold">👀 Vista previa (todavía no se cargó nada)</p>
                      <p className="text-[11px] text-amber-900">Hoja leída: {previewNuevos.resumen.hoja}</p>
                      <p className="text-[11px] text-amber-900">Productos nuevos detectados: <b>{previewNuevos.resumen.productosNuevos}</b></p>
                      <p className="text-[11px] text-amber-900">Medidas/códigos a cargar: <b>{previewNuevos.resumen.medidasNuevas}</b></p>
                      <p className="text-[11px] text-amber-900">Códigos que ya estaban en tu catálogo (omitidos): {previewNuevos.resumen.yaExistentes}</p>
                      <p className="text-[11px] text-amber-900">Códigos repetidos dentro de la misma planilla (omitidos): {previewNuevos.resumen.duplicadosArchivo}</p>
                      {previewNuevos.resumen.coloresCompletados > 0 && (
                        <p className="text-[11px] text-emerald-700 font-semibold">✨ Además, se va a completar el color en {previewNuevos.resumen.coloresCompletados} medidas que ya tenías cargadas y les faltaba.</p>
                      )}

                      <div className="max-h-60 overflow-y-auto border border-amber-100 rounded-xl bg-white/60 p-2 space-y-1.5">
                        {previewNuevos.productos.map((p,i)=>(
                          <div key={i} className="text-[11px] border-b border-amber-100 pb-1">
                            <span className="font-semibold text-stone-700">{p.nombre}</span>
                            <span className="text-stone-400"> ({p.categoria || 'sin categoría'})</span>
                            <div className="text-stone-500">
                              {p.medidas.map((m,j)=>(
                                <span key={j} className="mr-2">{m.medida||'Única'}{m.color ? ` (${m.color})` : ''} · ${m.precio}{j < p.medidas.length-1 ? ',' : ''}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button onClick={confirmarCargaProductosNuevos} disabled={cargandoNuevos || (previewNuevos.productos.length===0 && previewNuevos.resumen.coloresCompletados===0)} className="flex-1 bg-brand-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-brand-700 transition disabled:opacity-50">
                          {cargandoNuevos ? 'Cargando...' : `Confirmar (${previewNuevos.resumen.medidasNuevas} medidas nuevas${previewNuevos.resumen.coloresCompletados > 0 ? ` + ${previewNuevos.resumen.coloresCompletados} colores` : ''})`}
                        </button>
                        <button onClick={cancelarPreviewNuevos} disabled={cargandoNuevos} className="px-4 bg-stone-200 text-stone-600 rounded-xl text-xs">Cancelar</button>
                      </div>
                    </div>
                  )}

                  {resumenCargaNuevos && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
                      <p className="text-xs text-emerald-800 font-bold">✅ Carga completada</p>
                      <p className="text-[11px] text-emerald-700">Productos creados: {resumenCargaNuevos.productosNuevos}</p>
                      <p className="text-[11px] text-emerald-700">Medidas/códigos cargados: {resumenCargaNuevos.medidasNuevas}</p>
                      {resumenCargaNuevos.coloresCompletados > 0 && (
                        <p className="text-[11px] text-emerald-700">Colores completados en medidas existentes: {resumenCargaNuevos.coloresCompletados}</p>
                      )}
                      <p className="text-[11px] text-emerald-700">Ya podés ir a la pestaña "Productos", filtrar por categoría "{CATEGORIA_PENDIENTE}" y completar foto, precio y categoría de cada uno.</p>
                    </div>
                  )}
                </div>
              )}

              {adminTab==='vincularFotos' && (
                <div className="space-y-4">
                  <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-sky-800">🖼️ Vincular fotos en lote desde Drive</h3>
                    <p className="text-[11px] text-sky-900 leading-relaxed">
                      Para vincular muchas fotos de una sola vez sin entrar producto por producto:
                    </p>
                    <ol className="text-[11px] text-sky-900 leading-relaxed list-decimal pl-4 space-y-1">
                      <li>En Google Drive, renombrá cada foto con el <b>código de artículo o código de barras</b> del producto al que pertenece (ej: <code>0876-1-6.jpg</code>, reemplazando la "/" por "-").</li>
                      <li>Seleccioná todas esas fotos → Compartir → asegurate que sea "Cualquiera con el enlace" → Copiar enlaces.</li>
                      <li>Pegá acá abajo lo que te copió (una línea por foto, con el nombre y el link).</li>
                    </ol>
                    <p className="text-[11px] text-sky-900 leading-relaxed">
                      Cada foto queda vinculada específicamente a esa medida/color (no a todo el producto), así que en la ficha del producto, cuando el cliente elige el modelo o color, va a ver la foto que corresponde a esa variante puntual.
                    </p>
                  </div>

                  <textarea value={textoVincularFotos} onChange={e=>setTextoVincularFotos(e.target.value)} placeholder={"0876-1-6.jpg   https://drive.google.com/file/d/xxxxx/view\n0876-1-1.jpg   https://drive.google.com/file/d/yyyyy/view"} className="w-full border border-stone-200 rounded-xl p-3 text-xs bg-white font-mono" rows="8"></textarea>

                  <button onClick={previsualizarVincularFotos} disabled={!textoVincularFotos.trim()} className="w-full bg-brand-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-brand-700 disabled:opacity-40">Revisar</button>

                  {previewVincularFotos && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                      <p className="text-xs text-amber-800 font-bold">👀 Vista previa (todavía no se guardó nada)</p>
                      <p className="text-[11px] text-amber-900">Fotos que se van a vincular: <b>{previewVincularFotos.encontradas.length}</b></p>
                      <p className="text-[11px] text-amber-900">Códigos no encontrados en tu catálogo: {previewVincularFotos.noEncontrados.length}</p>
                      {previewVincularFotos.noEncontrados.length > 0 && (
                        <p className="text-[10px] text-amber-700">{previewVincularFotos.noEncontrados.join(', ')}</p>
                      )}
                      <p className="text-[11px] text-amber-900">Líneas que no pude leer: {previewVincularFotos.linkInvalido.length}</p>

                      {previewVincularFotos.encontradas.length > 0 && (
                        <div className="max-h-48 overflow-y-auto border border-amber-100 rounded-xl bg-white/60 p-2 space-y-1">
                          {previewVincularFotos.encontradas.map((e,i)=>(
                            <p key={i} className="text-[11px] text-stone-600">{e.codigo} → <span className="font-semibold">{e.nombre}</span></p>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 pt-1">
                        <button onClick={confirmarVincularFotos} disabled={vinculandoFotos || previewVincularFotos.encontradas.length===0} className="flex-1 bg-brand-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-brand-700 disabled:opacity-50">
                          {vinculandoFotos ? 'Guardando...' : `Confirmar (${previewVincularFotos.encontradas.length} fotos)`}
                        </button>
                        <button onClick={()=>setPreviewVincularFotos(null)} disabled={vinculandoFotos} className="px-4 bg-stone-200 text-stone-600 rounded-xl text-xs">Cancelar</button>
                      </div>
                    </div>
                  )}

                  {resumenVincularFotos && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
                      <p className="text-xs text-emerald-800 font-bold">✅ Listo</p>
                      <p className="text-[11px] text-emerald-700">Productos actualizados: {resumenVincularFotos.productos}</p>
                      <p className="text-[11px] text-emerald-700">Fotos vinculadas: {resumenVincularFotos.fotos}</p>
                    </div>
                  )}

                  <div className="border-t border-stone-200 pt-4 mt-2 space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-rose-700">🧹 Limpiar fotos pesadas viejas</h3>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Las fotos que subiste como archivo (antes de usar Drive) quedan guardadas como texto larguísimo adentro de la base de datos, y son las que hacen que la web cargue lenta. Esto las busca y las borra, sin tocar ninguna foto que ya sea un link (Drive, etc.).
                    </p>
                    <button onClick={previsualizarLimpiarFotos} className="w-full bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-rose-700">Buscar fotos pesadas</button>

                    {previewLimpiarFotos && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                        {previewLimpiarFotos.totalFotos === 0 ? (
                          <p className="text-xs text-amber-900">No encontré fotos pesadas guardadas. Ya está todo limpio.</p>
                        ) : (
                          <>
                            <p className="text-xs text-amber-800 font-bold">👀 Vista previa (todavía no se borró nada)</p>
                            <p className="text-[11px] text-amber-900">Productos afectados: <b>{previewLimpiarFotos.totalProductos}</b></p>
                            <p className="text-[11px] text-amber-900">Fotos pesadas a borrar: <b>{previewLimpiarFotos.totalFotos}</b> (~{Math.round(previewLimpiarFotos.totalBytes/1024/1024*10)/10} MB)</p>
                            <div className="max-h-40 overflow-y-auto border border-amber-100 rounded-xl bg-white/60 p-2 space-y-1">
                              {previewLimpiarFotos.afectados.map(a => (
                                <p key={a.productoId} className="text-[11px] text-stone-600">{a.nombre}: {a.cantidad} foto{a.cantidad>1?'s':''}</p>
                              ))}
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button onClick={confirmarLimpiarFotos} disabled={limpiandoFotos} className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-rose-700 disabled:opacity-50">
                                {limpiandoFotos ? 'Borrando...' : `Borrar ${previewLimpiarFotos.totalFotos} fotos pesadas`}
                              </button>
                              <button onClick={()=>setPreviewLimpiarFotos(null)} disabled={limpiandoFotos} className="px-4 bg-stone-200 text-stone-600 rounded-xl text-xs">Cancelar</button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {resumenLimpiarFotos && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
                        <p className="text-xs text-emerald-800 font-bold">✅ Limpieza completa</p>
                        <p className="text-[11px] text-emerald-700">Productos limpiados: {resumenLimpiarFotos.productos}</p>
                        <p className="text-[11px] text-emerald-700">Fotos pesadas borradas: {resumenLimpiarFotos.fotos}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {adminTab==='sinFotos' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-800">📷 Productos sin foto</h3>
                    <p className="text-[11px] text-amber-900 leading-relaxed">
                      Esta lista se arma sola con lo que hay cargado ahora mismo: son los productos (o medidas/colores puntuales) que todavía no tienen ninguna foto propia ni una foto general que los cubra. Un producto con al menos una foto general ya no aparece acá, aunque le falten fotos de algún color en particular.
                    </p>
                  </div>

                  {productosSinFotoInfo.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-8">🎉 Todos los productos disponibles tienen al menos una foto.</p>
                  ) : (
                    <div className="space-y-2">
                      {productosSinFotoInfo.map(({p, variantesFaltantes}) => (
                        <div key={p.id} className="bg-white border border-stone-200 rounded-2xl p-3.5">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-xs text-stone-800">{p.nombre}</p>
                            <span className="text-[10px] text-stone-400">{p.categoria}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {variantesFaltantes.map((m, idx) => (
                              <span key={idx} className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2.5 py-1">
                                {m.medida}{m.color ? ` • ${m.color}` : ''}{(m.codigo || m.codigoBarras) ? ` (${m.codigo || m.codigoBarras})` : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}


              {adminTab==='negocio' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Logo Negocio</label>
                    {config.logo && <img src={config.logo} className="w-16 h-16 object-cover rounded-2xl mb-2 border border-stone-200"/>}
                    <input type="file" accept="image/*" onChange={handleLogo} className="w-full text-xs text-stone-500"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">WhatsApp (Número internacional)</label>
                    <input value={whatsappInput} onChange={e=>setWhatsappInput(e.target.value)} placeholder="Ej: 5491122334455" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Instagram (Usuario sin @)</label>
                    <input value={instagramInput} onChange={e=>setInstagramInput(e.target.value)} placeholder="Ej: blanqueriaa_mya" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs"/>
                  </div>
                  <button onClick={guardarConfig} className="w-full bg-brand-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-brand-700">Guardar Configuración</button>

                  <div className="border border-rose-200 bg-rose-50 rounded-2xl p-4 space-y-2 mt-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-rose-700">⚠️ Zona de peligro</h3>
                    <p className="text-[11px] text-rose-800 leading-relaxed">Borra TODOS los productos del catálogo. Usalo si una importación cargó datos mal y querés empezar de cero. No se puede deshacer.</p>
                    <input value={confirmacionBorrarTodo} onChange={e=>setConfirmacionBorrarTodo(e.target.value)} placeholder='Escribí BORRAR para confirmar' className="w-full border border-rose-300 rounded-xl p-2.5 text-xs bg-white"/>
                    <button onClick={borrarTodosLosProductos} disabled={confirmacionBorrarTodo!=='BORRAR' || borrandoTodo} className="w-full bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed">
                      {borrandoTodo ? 'Borrando...' : `Borrar los ${Object.keys(productos).length} productos del catálogo`}
                    </button>
                  </div>
                </div>
              )}

              {adminTab==='pedidos' && (
                <div className="space-y-3">
                  {listaPedidos.length===0 && <p className="text-stone-400 text-xs text-center py-6">No hay pedidos registrados.</p>}
                  {listaPedidos.map(ped => {
                    const pagado = pagadoDe(ped);
                    const debe = debeDe(ped);
                    const pagosArr = Object.entries(ped.pagos||{}).map(([id,pg])=>({id,...pg})).sort((a,b)=>a.fecha-b.fecha);
                    return (
                      <div key={ped.id} className="border border-stone-100 rounded-2xl p-4 bg-stone-50/50 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-xs text-stone-800">{ped.nombre}</p>
                            <p className="text-[11px] text-stone-400">{ped.telefono} · {ped.zona}</p>
                          </div>
                          <span className="text-[10px] bg-stone-200 text-stone-600 font-bold px-2 py-0.5 rounded-full">{fechaCorta(ped.creado)}</span>
                        </div>

                        <div className="text-xs text-stone-600 bg-white p-2 rounded-xl border border-stone-100 space-y-1">
                          {(ped.items||[]).map((it,idx)=>(
                            <p key={idx}>{it.unidades}x {it.nombre} — {it.medida}{it.color ? ` (${it.color})` : ''}</p>
                          ))}
                        </div>

                        <div className="flex justify-between text-xs pt-1">
                          <span className="font-bold text-stone-700">Total: ${ped.total}</span>
                          <span className={debe>0 ? 'text-rose-500 font-bold' : 'text-emerald-600 font-bold'}>
                            {debe>0 ? `Debe: $${debe}` : 'Saldado ✓'}
                          </span>
                        </div>

                        {pagosArr.length>0 && (
                          <div className="space-y-1">
                            {pagosArr.map(pg=>(
                              <div key={pg.id} className="flex justify-between items-center text-[11px] bg-white p-1.5 rounded-lg border border-stone-100">
                                <span>{fechaCorta(pg.fecha)} — ${pg.monto}</span>
                                <button onClick={()=>generarRecibo(ped,pg)} className="text-sky-600 font-semibold">Recibo 🧾</button>
                              </div>
                            ))}
                          </div>
                        )}

                        {debe>0 && (
                          <div className="flex gap-2">
                            <input value={montoPagoInputs[ped.id]||''} onChange={e=>setMontoPagoInputs(prev=>({...prev,[ped.id]:e.target.value}))} type="number" placeholder="Monto pago" className="border border-stone-200 rounded-xl p-2 text-xs flex-1 bg-white"/>
                            <button onClick={()=>registrarPago(ped)} className="bg-emerald-500 text-white px-3 rounded-xl text-xs font-bold hover:bg-emerald-600">Registrar</button>
                          </div>
                        )}

                        <div className="flex gap-1.5 flex-wrap pt-2">
                          {ESTADOS.map(e=>(
                            <button key={e.key} onClick={()=>cambiarEstadoPedido(ped.id, e.key)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white transition ${ped.estado===e.key ? e.color : 'bg-stone-300'}`}>
                              {e.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {adminTab==='presupuestos' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <select onChange={e=>elegirClienteExistente(e.target.value)} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs bg-white">
                      <option value="">-- Seleccionar cliente guardado --</option>
                      {listaClientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                    <input value={presClienteNombre} onChange={e=>setPresClienteNombre(e.target.value)} placeholder="Nombre cliente" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs"/>
                    <input value={presClienteTelefono} onChange={e=>setPresClienteTelefono(e.target.value)} placeholder="Teléfono" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs"/>
                    <button onClick={guardarClienteNuevo} className="text-xs text-brand-600 font-semibold">+ Guardar en directorio</button>
                  </div>

                  <div className="border-t border-stone-100 pt-3 space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">Agregar del catálogo</h4>
                    <select value={presProductoId} onChange={e=>{setPresProductoId(e.target.value); setPresVarianteIdx(0);}} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs bg-white">
                      <option value="">Seleccionar producto</option>
                      {listaProductos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                    {presProductoId && (
                      <select value={presVarianteIdx} onChange={e=>setPresVarianteIdx(Number(e.target.value))} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs bg-white">
                        {medidasDisponiblesDe(productos[presProductoId]).map((m,idx)=>(
                          <option key={idx} value={idx}>{m.medida}{m.color ? ` — ${m.color}` : ''} — ${m.precio}</option>
                        ))}
                      </select>
                    )}
                    <div className="flex gap-2">
                      <input value={presCantidad} onChange={e=>setPresCantidad(e.target.value)} type="number" placeholder="Cant." className="border border-stone-200 rounded-xl p-2 text-xs w-20"/>
                      <button onClick={agregarItemPresupuesto} className="flex-1 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700">Agregar</button>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-3 space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">Agregar ítem libre</h4>
                    <div className="flex gap-2">
                      <input value={presOtroNombre} onChange={e=>setPresOtroNombre(e.target.value)} placeholder="Ej: Envío personalizado" className="border border-stone-200 rounded-xl p-2 text-xs flex-1"/>
                      <input value={presOtroPrecio} onChange={e=>setPresOtroPrecio(e.target.value)} type="number" placeholder="Precio" className="border border-stone-200 rounded-xl p-2 text-xs w-20"/>
                      <button onClick={agregarItemLibre} className="bg-brand-600 text-white px-3 rounded-xl text-xs font-bold">+</button>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-3 space-y-2">
                    {presItems.map((it,idx)=>(
                      <div key={idx} className="flex justify-between items-center text-xs bg-stone-50 p-2 rounded-xl">
                        <span>{it.cantidad}x {it.nombre} — ${it.cantidad*it.precio}</span>
                        <button onClick={()=>quitarItemPresupuesto(idx)} className="text-rose-500"><i className="fa-solid fa-trash-can"></i></button>
                      </div>
                    ))}
                    <p className="font-bold text-sm text-right text-stone-800">Total: ${totalPresupuesto}</p>
                    <button onClick={generarPresupuestoPDF} className="w-full bg-brand-600 text-white py-3 rounded-2xl text-xs font-bold hover:bg-brand-700 transition shadow-md">📄 Generar PDF del presupuesto</button>
                  </div>
                </div>
              )}

              {adminTab==='tablaMedidas' && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400">Subí las imágenes de la guía de medidas para que tus clientes puedan ver cómo tomar cada medida antes de comprar.</p>
                  <input type="file" accept="image/*" multiple onChange={handleTablaMedidas} className="w-full text-xs text-stone-500"/>
                  <div className="space-y-2">
                    {listaTablaMedidas.length===0 && <p className="text-stone-400 text-xs">Todavía no subiste imágenes.</p>}
                    {listaTablaMedidas.map(item => (
                      <div key={item.id} className="relative">
                        <img src={item.imagen} className="w-full rounded-2xl border border-stone-100"/>
                        <button onClick={()=>eliminarImagenTablaMedidas(item.id)} className="absolute top-2 right-2 bg-rose-500 text-white w-6 h-6 rounded-full text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab==='chatbot' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Mensaje de saludo</label>
                    <textarea value={saludoBotInput} onChange={e=>setSaludoBotInput(e.target.value)} rows="2" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs"></textarea>
                    <button onClick={guardarSaludoBot} className="mt-2 w-full bg-brand-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-brand-700">Guardar saludo</button>
                  </div>

                  <div className="border-t border-stone-100 pt-3 space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">{editandoChatbotId ? 'Editar pregunta' : 'Nueva pregunta'}</h4>
                    <input value={chatbotForm.pregunta} onChange={e=>setChatbotForm({...chatbotForm, pregunta:e.target.value})} placeholder="Pregunta (ej: ¿Hacen envíos?)" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs"/>
                    <textarea value={chatbotForm.respuesta} onChange={e=>setChatbotForm({...chatbotForm, respuesta:e.target.value})} placeholder="Respuesta" rows="3" className="w-full border border-stone-200 rounded-xl p-2.5 text-xs"></textarea>
                    <label className="text-xs font-bold text-stone-600 block mb-1">Al responder, además...</label>
                    <select value={chatbotForm.accion} onChange={e=>setChatbotForm({...chatbotForm, accion:e.target.value})} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs bg-white">
                      <option value="">No hacer nada más</option>
                      <option value="medidas">Abrir la guía de medidas</option>
                      <option value="abrir_presupuesto">Abrir el cotizador rápido</option>
                      <option value="contactar_whatsapp">Llevar a WhatsApp</option>
                      <option value="ver_categoria">Mostrar una categoría del catálogo</option>
                    </select>
                    {chatbotForm.accion === 'ver_categoria' && (
                      <select value={chatbotForm.accionValor} onChange={e=>setChatbotForm({...chatbotForm, accionValor:e.target.value})} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs bg-white">
                        <option value="">Seleccionar categoría</option>
                        {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )}
                    <div className="flex gap-2">
                      <button onClick={guardarPreguntaBot} className="flex-1 bg-brand-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-brand-700">{editandoChatbotId ? 'Guardar cambios' : 'Agregar pregunta'}</button>
                      {editandoChatbotId && <button onClick={resetFormChatbot} className="px-4 bg-stone-100 rounded-xl text-xs font-bold">Cancelar</button>}
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-3 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">Preguntas cargadas</h4>
                    {listaPreguntasBot.length===0 && <p className="text-stone-400 text-xs">Todavía no cargaste preguntas propias — se están usando las de ejemplo.</p>}
                    {listaPreguntasBot.map(item => (
                      <div key={item.id} className="flex justify-between items-center border border-stone-100 p-2.5 rounded-xl text-xs">
                        <span className="text-stone-700 font-medium truncate pr-2">{item.pregunta}</span>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={()=>editarPreguntaBot(item)} className="text-sky-600"><i className="fa-solid fa-pen"></i></button>
                          <button onClick={()=>eliminarPreguntaBot(item.id)} className="text-rose-500"><i className="fa-solid fa-trash-can"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ASISTENTE VIRTUAL FLOTANTE */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        
        {mostrarChat && (
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200/80 w-80 sm:w-96 overflow-hidden flex flex-col animate-slide-up">
            <div className="bg-gradient-to-r from-brand-700 to-brand-500 p-4 text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                  🤖
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs">{NOMBRE_NEGOCIO}</h4>
                  <p className="text-[10px] text-brand-100">Asistente Virtual 24/7</p>
                </div>
              </div>
              <button onClick={() => setMostrarChat(false)} className="text-white/80 hover:text-white">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-4 h-72 overflow-y-auto space-y-2.5 bg-stone-50/50 text-xs">
              {historialChat.map((m, idx) => (
                <div key={idx} className={`flex ${m.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[82%] p-2.5 rounded-2xl shadow-sm leading-relaxed ${
                    m.tipo === 'usuario' 
                      ? 'bg-brand-600 text-white rounded-br-sm' 
                      : 'bg-white border border-stone-100 text-stone-700 rounded-bl-sm'
                  }`}>
                    {m.texto}
                  </div>
                </div>
              ))}
              <div ref={chatFinRef}></div>
            </div>

            <div className="p-3 border-t border-stone-100 bg-white flex-shrink-0">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5 px-1">Preguntas frecuentes</p>
              <div className="space-y-1.5 max-h-28 overflow-y-auto no-scrollbar">
                {preguntasBotMostradas.map(q => (
                  <button 
                    key={q.id}
                    onClick={() => preguntarBot(q)}
                    className="w-full text-left bg-stone-50 hover:bg-brand-50 text-brand-800 p-2 rounded-xl border border-stone-200/70 text-xs transition font-medium">
                    {q.pregunta}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => setMostrarChat(!mostrarChat)}
          className="bg-brand-600 hover:bg-brand-700 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 animate-float ring-4 ring-brand-200/60"
          title="Asistente de Consultas">
          💬
        </button>
      </div>

    </div>
  );
}

export default App;
