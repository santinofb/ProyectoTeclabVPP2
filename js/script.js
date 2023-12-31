let productos = [];

fetch("../js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    });

const contenedorProductos = document.querySelector("#contenedor-productos");
const btnCategorias = document.querySelectorAll(".boton-categoria");
const titulosCategorias = document.querySelector("#titulo-principal");
let btnAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");


function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">

            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <div class="producto-informacion">
                    <p class="producto-talle">Talle ${producto.talle}</p>
                    <p class="producto-precio">$${producto.precio}</p>
                </div>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

        contenedorProductos.append(div);
    })

    actualizarBtnAgregar();
}

btnCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        btnCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            titulosCategorias.innerText = productoCategoria.categoria.nombre;
            const btnProductos = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(btnProductos);
        } else {
            titulosCategorias.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    })
})

function actualizarBtnAgregar() {
    btnAgregar = document.querySelectorAll(".producto-agregar");
    btnAgregar.forEach(boton => {
        boton.addEventListener("click", agregarCarrito);
    });
}

let productosCarrito;

const productosCarritoLS = JSON.parse(localStorage.getItem("productos-carrito"));

if (productosCarritoLS) {
    productosCarrito = productosCarritoLS;
    actualizarNumerito();
} else {
    productosCarrito = [];
}

function agregarCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 1000,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: false, // Prevents dismissing of toast on hover
        style: {
          background: "#ddd000",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem",
          cursor: "default"
        },
        offset: {
            x: "1rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: "1rem" // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function(){} // Callback after click
    }).showToast();

    const btnId = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === btnId);

    if(productosCarrito.some(producto => producto.id === btnId)) {
        const index = productosCarrito.findIndex(producto => producto.id === btnId);
        productosCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-carrito", JSON.stringify(productosCarrito));
}

function actualizarNumerito() {
    let numeritoCarrito = productosCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = numeritoCarrito;
}