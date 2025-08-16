using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tipo_Datos.Data;
using Tipo_Datos.Models.Entidades;

namespace Tipo_Datos.Controllers
{
    public class ClientesController : Controller
    {
        private readonly DatosDbContext _dbContext;
        public ClientesController(DatosDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<IActionResult> Index()
        {
            return View(await _dbContext.Clientes.ToListAsync());
        }

        public IActionResult Nuevo() {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> 
            Nuevo([Bind("Nombres,Email,Telefono,Direccion,Cedula_RUC,isDelete")] ClientesModel cliente)
        {
            if (ModelState.IsValid)
            {
                cliente.Create_At = DateTime.Now;
                _dbContext.Add(cliente);
                await _dbContext.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return  View(cliente);
        }
        public async Task<IActionResult> Editar(int? Id)
        {
            if (Id == null) return NotFound();

            var cliente = await _dbContext.Clientes.FindAsync(Id);
            if (cliente == null) return NotFound();

            return View(cliente);
        }

        [HttpPost]
        
        public async Task<IActionResult> Editar(int id, [Bind("Id,Nombres,Email,Telefono,Direccion,Cedula_RUC,isDelete")] ClientesModel cliente) {
            if (id != cliente.Id) return NotFound();

            if (ModelState.IsValid) {
                try
                {
                    cliente.Update_At = DateTime.Now;
                    _dbContext.Update(cliente);
                    await _dbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ClienteExiste(cliente.Id))
                    {
                        return NotFound();
                    }
                    else {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(cliente);
    
        }


        public async Task<IActionResult> Eliminar(int? Id)
        {
            if (Id == null) return NotFound();

            var cliente = await _dbContext.Clientes.FindAsync(Id);
            if (cliente == null) return NotFound();

            return View(cliente);
        }

        [HttpDelete, ActionName("Eliminar")]
        public async Task<IActionResult> ConfirmacionEliminar(int Id) {
            var cliente = await _dbContext.Clientes.FindAsync(Id);
            if (cliente != null) {
                _dbContext.Clientes.Remove(cliente);
                await _dbContext.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }


        public bool ClienteExiste(int id) { 
            return _dbContext.Clientes.Any(c => c.Id == id);
        }

        //JS Views Solo se usa una view sin model para trabajar todo con JS usando la API
        public IActionResult ListaClientesJS()
        {
            return View();
        }
        
        //El parametro es obtenido internamente para usar la API hacer todo mediante JS y la misma vista se usa para Nuevo/Ver/Modificar/Eliminar
        public IActionResult AccionClienteJS(int id=0, int accion = 0)
        {
            ViewData["Id"] = id;
            switch (accion) 
            {
                case 0:
                    ViewData["Accion"] = "Nuevo Cliente";
                break;
                case 1:
                    ViewData["Accion"] = "Modificar Cliente";
                break;
                case 2:
                    ViewData["Accion"] = "Eliminar Cliente";
                break;

            }

            return View();
        }

    }
}


