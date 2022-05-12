const CriptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const Formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


//objeto de busqueda que se llena cuando el usuario llena los campos
const objBusqueda = {

    moneda: '',
    criptomoneda: ''

}


//creadno promise, resuelve y descarga las criptomonedas disponibles
const ObtenerCriptomoneda = criptomonedas => new Promise (resolve => {
    resolve(criptomonedas);
});

// cuando el documento cargue realizara lo siguiente...
document.addEventListener('DOMContentLoaded', () => {
    ConsultarCriptomonedas();
    Formulario.addEventListener('submit', EnviarFormulario);
    CriptomonedaSelect.addEventListener('change', LeerValor);
    monedaSelect.addEventListener('change', LeerValor);
})


//envia los valores del formulario y valida que no haya campos vacios
function EnviarFormulario(e) {
    e.preventDefault();

    //validacion del formulario 
    const {moneda, criptomoneda} = objBusqueda;

    if (moneda ==="" || criptomoneda === "") {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    //consultar resultados a la API
    ConsultarApi();
    
}

function ConsultarApi() {
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            MostrarCotizacioHtml(cotizacion.DISPLAY[criptomoneda][moneda])
        });
}


function MostrarCotizacioHtml(cotizacion){

    LimpiarHtml();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}<span>`;
    

    const PrecioAlto = document.createElement('p');
    PrecioAlto.innerHTML = `<p>El precio mas alto del dia es: <span>${HIGHDAY}<span>`;

    const PrecioBajo = document.createElement('p');
    PrecioBajo.innerHTML = `<p>El precio mas bajo del dia es: <span>${LOWDAY}<span>`;
    
    const CambioHoras = document.createElement('p');
    CambioHoras.innerHTML = `<p>Variacion las ultimas 24 Horas: <span>${CHANGEPCT24HOUR}%<span>`;

    const UlrimaActualizacion = document.createElement('p');
    UlrimaActualizacion.innerHTML = `<p>Ultima actualizacion de precio fue: <span>${LASTUPDATE}<span>`;

    resultado.appendChild(precio);
    resultado.appendChild(PrecioAlto);
    resultado.appendChild(PrecioBajo);
    resultado.appendChild(CambioHoras);
    resultado.appendChild(UlrimaActualizacion);

}


//lee los valores enviados y se los asigna a objBusqueda
function LeerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    
}


//consular cripto monedas a la API
function ConsultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => ObtenerCriptomoneda(resultado.Data))
        .then(criptomonedas => SelectCriptomonedas(criptomonedas))
}


//lista de la api las criptomonedas que vamos a dejar disponiles
function SelectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        CriptomonedaSelect.appendChild(option)
    });
}

//muestra los mensajes de error
function mostrarAlerta(mensaje) {

    const ExisteError = document.querySelector('.error');

    if (!ExisteError) {
        const divError = document.createElement('div');
        divError.classList.add('error');
        divError.textContent = mensaje;
        Formulario.appendChild(divError);
     
        setTimeout(() => {
          divError.remove()
        }, 4000);
    }
  
}

//agregar un spiner de carga 
function mostrarSpinner() {
    LimpiarHtml();

    const spinner = document.createElement('div');
    spinner.classList.add('sk-fading-circle');

    spinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
    `;

    resultado.appendChild(spinner);
}



function LimpiarHtml() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
}