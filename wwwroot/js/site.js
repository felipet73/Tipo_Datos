
var unCliente = () => {
    var clienteid = document.getElementById("ClientesModelId").value;
    //fetch("/api/ProductosApi/"+ clienteid)

    /*fetch(`/api/ClientesApi/${clienteid}`)
        .then(
            uncliente => {
                if (!uncliente.ok) {
                    alert("Error al obtener el cliente")
                }
                return uncliente.json();
            })
        .then(datos => {
            console.log(datos)
            document.getElementById("Correo").value = datos.email;
            document.getElementById("Cedula_RUC").value = datos.cedula_RUC;
            document.getElementById("Telefono").value = datos.telefono;
            document.getElementById("Direccion").value = datos.direccion;
        }).catch(
            error => {
                alert("Ocucion un error:", error)
            }
        )*/

    $.get(`/api/ClientesApi/${clienteid}`, (uncliente) => {
        document.getElementById("Correo").value = uncliente.email;
        document.getElementById("Cedula_RUC").value = uncliente.cedula_RUC;
        document.getElementById("Telefono").value = uncliente.telefono;
        document.getElementById("Direccion").value = uncliente.direccion;
    })
}

var Lista_Productos = () => {
    $.get(`/api/ProductosApi`,async (listaproductos) => {
        html = "";
        $.each(listaproductos, (index, producto) => {
            html += `<tr>
                <td> ${producto.nombre} </td>
                <td> ${producto.precio} </td>
                <td> <input type='number' min="1" value="0" id="qty_${producto.id}"/> </td>
                <td> <button type="button"
                data-id="${producto.id}"
                data-nombre="${producto.nombre}"
                data-precio="${producto.precio}"
                onclick="cargarproducto(this)"
                class="btn-success">+</button> </td>
            `;
        })
        await $("#Lista_prodcutos").html(html)
    })
}

var cargarproducto = (producto) => {
    const id = producto.dataset.id
    const nombre = producto.dataset.nombre
    const precio = parseFloat(producto.dataset.precio)
    const cantidad = document.getElementById(`qty_${id}`).value


    //const tabla = document.getElementById("productosTable")
   // const tbody = tabla.querySelector('tbody')
   // const btnAdd = document.getElementById("btnAgregarFila")
    //const subTotal = document.getElementById("Sub_total")

    
}

//Cargar data en tabla desde JS
$(document).ready(function () {

    //Ejecutar solo para la opcion de listarClientes JS
    if (window.location.href.toLocaleLowerCase().includes('listaclientesjs'))
    $.ajax({
        url: '/api/ClientesApi',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            console.log(data, 'Mi data de Clientes Get desde API Usando JS');
            var tableBody = $('#DetalleClientes');
            tableBody.empty(); // Limpiar el contenido previo
            $.each(data, function (index, cliente) {
                var row = `<tr>
                        <td>${cliente.id}</td>
                        <td>${cliente.nombres}</td>
                        <td>${cliente.cedula_RUC}</td>
                        <td>${cliente.telefono}</td>
                        <td>${cliente.email}</td>
                        <td>
                            <a href="/Clientes/AccionClienteJS?id=${cliente.id}&accion=1" class="btn btn-outline-success">Editar</a>
                            ${cliente.isDelete ? `<a href="/Clientes/AccionClienteJS?id=${cliente.id}&accion=2" class="btn btn-outline-danger">Delete</a>` : ''}
                        </td>
                    </tr>`;
                tableBody.append(row);
            });
        },
        error: function (xhr, status, error) {
            console.error('Error al cargar los clientes:', error);
        }
    });

    //Ejecutar solo para la opcion de Acccion Eliminar/Modificar cargar datos en Formulario JS
    if (window.location.href.toLocaleLowerCase().includes('accionclientejs') && ($('#Titulo').text() === 'Modificar Cliente' || $('#Titulo').text() === 'Eliminar Cliente'))
        $.ajax({
            url: `/api/ClientesApi/${$('#IdCliente').text()}`,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                console.log(data, 'Mi data de Cliente Get desde API Usando JS');
                $('#Nombres').val(data.nombres);
                $('#Cedula_RUC').val(data.cedula_RUC);
                $('#Telefono').val(data.telefono);
                $('#Email').val(data.email);
                $('#Direccion').val(data.direccion);
                $('#isDelete').prop('checked', data.isDelete);                
            },
            error: function (xhr, status, error) {
                console.error('Error al cargar los clientes:', error);
            }
        });
});

var RealizaAccion = () => {
    let accion = $('#Titulo').text();

    //Validaciones manuales con JS
    if ($('#Nombres').val() === '') {
        $('#ValidateNombres').text('Nombre no valido')
    }
    if ($('#Cedula_RUC').val() === '') {
        $('#ValidateCedula_RUC').text('Cedula/RUC no valido')
    }
    if ($('#Telefono').val() === '') {
        $('#ValidateTelefono').text('Telefono no valido')
    }
    if ($('#Email').val() === '') {
        $('#ValidateEmail').text('Email no valido')
    }
    if ($('#Direccion').val() === '') {
        $('#ValidateDireccion').text('Direccion no valida')
    }
    if ($('#Nombres').val() === '' ||
        $('#Cedula_RUC').val() === '' ||
        $('#Telefono').val() === '' ||
        $('#Email').val() === '' ||
        $('#Direccion').val() === ''
    ) {
        return;
    }

    //Obteniendo nuestro objeto cliente
    let cliente = {
        id: $('#IdCliente').text(),
        nombres: $('#Nombres').val(),
        cedula_RUC: $('#Cedula_RUC').val(),
        telefono: $('#Telefono').val(),
        email: $('#Email').val(),
        direccion: $('#Direccion').val(),
        isDelete: $('#isDelete').is(':checked')
    };
    let JSONcliente = JSON.stringify(cliente);

    //Realizando la accion dependiendo del titulo del formulario
    switch (accion) {
        case 'Nuevo Cliente':
            $.ajax({
                url: `/api/ClientesApi`,
                type: 'POST',
                data: JSONcliente,
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (result) {
                    window.location.href = '/Clientes/ListaClientesJS';
                },
                error: function (xhr, status, error) {
                    console.error('Error al agregar el cliente:', error);
                }
            });    
            break;
        case 'Modificar Cliente':
            $.ajax({
                url: `/api/ClientesApi/${$('#IdCliente').text()}`,
                type: 'PUT',
                data: JSONcliente,
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (result) {
                    window.location.href = '/Clientes/ListaClientesJS';
                },
                error: function (xhr, status, error) {
                    console.error('Error al modificar el cliente:', error);
                }
            });            
            break;
        case 'Eliminar Cliente':
            $.ajax({
                url: `/api/ClientesApi/${$('#IdCliente').text()}`,
                type: 'DELETE',
                success: function (result) {
                    window.location.href = '/Clientes/ListaClientesJS';
                },
                error: function (xhr, status, error) {
                    console.error('Error al eliminar el cliente:', error);
                }
            });
            break;
    }
}