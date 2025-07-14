let carrito = [];
 
const botonesAgregarCarrito = document.querySelectorAll('.agregar-carrito-btn');
const carritoContador = document.getElementById('carrito-contador');
const carritoLista = document.getElementById('carrito-lista');
const mensajeCarritoVacio = document.getElementById('carrito-vacio-msg');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito-btn');
 
function agregarProductoAlCarrito(nombre, precio, imagen) {
    const productoExistente = carrito.find(item => item.nombre === nombre);
 
    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1,
            completado: false
        });
    }
 
    actualizarCarritoUI();
    guardarCarritoEnLocalStorage();
}
 
function eliminarItemDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    actualizarCarritoUI();
    guardarCarritoEnLocalStorage();
}
 
function vaciarTodoElCarrito() {
    carrito = [];
    actualizarCarritoUI();
    guardarCarritoEnLocalStorage();
}
 
function marcarItemCompletado(nombre) {
    const item = carrito.find(p => p.nombre === nombre);
    if (item) {
        item.completado = !item.completado;
        actualizarCarritoUI();
        guardarCarritoEnLocalStorage();
    }
}
 
function actualizarCarritoUI() {
    carritoContador.textContent = carrito.length;
    carritoLista.innerHTML = '';
 
    if (carrito.length === 0) {
        mensajeCarritoVacio.style.display = 'block';
        vaciarCarritoBtn.style.display = 'none';
    } else {
        mensajeCarritoVacio.style.display = 'none';
        vaciarCarritoBtn.style.display = 'block';
 
        carrito.forEach(item => {
            const divItem = document.createElement('div');
            divItem.classList.add('carrito-item');
            divItem.innerHTML = `
                <span>${item.nombre} (x${item.cantidad}) - $${item.precio * item.cantidad}</span>
                <div>
                    <button class="marcar-completado-btn" data-nombre="${item.nombre}">✓</button>
                    <button class="eliminar-item-btn" data-nombre="${item.nombre}">X</button>
                </div>
            `;
 
            if (item.completado) {
                divItem.querySelector('span').classList.add('tachado');
            }
 
            carritoLista.appendChild(divItem);
        });
    }
}
 
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carritoCompras', JSON.stringify(carrito));
}
 
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carritoCompras');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    actualizarCarritoUI();
}
 
botonesAgregarCarrito.forEach(button => {
    button.addEventListener('click', (event) => {
        const filaProducto = event.target.closest('.producto-fila');
        const nombreProducto = filaProducto.dataset.nombre;
        const precioProducto = parseFloat(filaProducto.dataset.precio);
        const imagenProducto = filaProducto.dataset.imagen;
 
        agregarProductoAlCarrito(nombreProducto, precioProducto, imagenProducto);
    });
});
 
vaciarCarritoBtn.addEventListener('click', vaciarTodoElCarrito);
 
carritoLista.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-item-btn')) {
        const nombre = event.target.dataset.nombre;
        eliminarItemDelCarrito(nombre);
    }
    else if (event.target.classList.contains('marcar-completado-btn')) {
        const nombre = event.target.dataset.nombre;
        marcarItemCompletado(nombre);
    }
});
 
document.addEventListener('DOMContentLoaded', cargarCarritoDesdeLocalStorage);