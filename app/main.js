import '/assets/sass/main.scss'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoicGF1bGFwemwiLCJhIjoiY2twYjZrMW9vMHV4eTJvbGxqYXZxcjF0diJ9.Yj6nBpHJD2RaqN6h6W5E5g';


// CARGAR PÁGINA
window.addEventListener('load', () => {
    loadMapView();
});

// vista mapa
const loadMapView = () => {
    loadMarkers();
    loadInfo();
    renderMapHeader();
    renderMapMain();
    renderMapFooter();
}

let markersPositions;
let mapPosition;
let map;
let weather;


const loadMarkers = () => {
    const localStorageMarkers = localStorage.getItem("markers");
    if (localStorageMarkers == null) {
        markersPositions = [];
    } else {
        markersPositions = JSON.parse(localStorageMarkers);
    };
}


const loadInfo = () => {
    const localStoragePosition = localStorage.getItem("info_map");
    if (localStoragePosition == null) {
        mapPosition = {
            center: [0,0],
            zoom: 11
        };
    } else {
        mapPosition = JSON.parse(localStoragePosition);
    };

}


const renderMapHeader = () => {
    const header = document.querySelector(".header");
    header.innerHTML = "<h1>¿Qué tiempo va a hacer hoy?</h1>";
}


const renderMapMain = () => {
    const main = document.querySelector(".main");
    main.innerHTML = "<div id='my_map'></div>";

    renderMap();
    renderMarkers();
    initMapEvents();
}


const renderMapFooter = () => {
    const footer = document.querySelector(".footer");
    footer.innerHTML = "<button>Ir a mi ubicación</button>";

    footer.addEventListener("click", () => {
        flyToLocation();
    });
}


const flyToLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        map.flyTo({
            center: [lng, lat],
            zoom: 9
        });
    });
}


// mapa
const renderMap = () => {
    map = new mapboxgl.Map({
        container: 'my_map',
        style: "mapbox://styles/paulapzl/ckpbd8cz52y7y17pk3njs5ei5",
        center: mapPosition.center, // [mapPosition.lgn, mapPosition.lat]
        zoom: mapPosition.zoom
    });
}


// markers
const renderMarkers = () => {
    markersPositions.forEach(m => {
    new mapboxgl.Marker().setLngLat([m.coord.lng, m.coord.lat]).addTo(map);
    });
}


// eventos del mapa
const initMapEvents = () => {
    map.on("move",(ev) => {
        const center = ev.target.getCenter();
        const zoom = ev.target.getZoom();
        const storingObj = {
           lat: center.lat,
           lgn: center.lgn,
           zoom: zoom
        };

        localStorage.setItem("info_map", JSON.stringify(storingObj));
    });

    map.on("click", async (ev) => {
        loadSingleView(ev.lngLat);
    });
}


// cargar single view
const loadSingleView = async (lngLat) => {
    loadSpinner();
    await fetchData(lngLat);
    unloadSpinner();
    renderSingleViewHeader();
    renderSingleViewMain();
    renderSingleViewFooter();
}


// spinner
const loadSpinner = () => {
    const spinner = document.querySelector(".spinner");
    spinner.classList.add("opened");
}

const unloadSpinner = () => {
    const spinner = document.querySelector(".spinner");
    spinner.classList.remove("opened");
}


// datos
const fetchData = async (lngLat) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lngLat.lat}&lon=${lngLat.lng}&appid=b92eb8a2e5fe79e7ea0cfcf4ebb3d1b8`;
    weather = await fetch(url).then(d => d.json()).then(d => d);
}


const renderSingleViewHeader = () => {
    const header = document.querySelector(".header");
    header.innerHTML = `<button><span class="fa fa-chevron-left"></span></button><h2>${weather.name}</h2>`;

    const buttonBack = header.querySelector("button");
    buttonBack.addEventListener("click", () => {
       loadMapView();
    });
}


const renderSingleViewMain = () => {
    const main = document.querySelector(".main");
    main.innerHTML = `
    <div class="weather_main_data">
        <div class="weather_main_time">17h</div>
        <div class="weather_main_temp">
          <span class="fa fa-thermometer-three-quarters"></span>
          <div class="temp">${weather.main.temp}º</div>
        </div>

        <div class="weather_main_wind">
          <span class="fa fa-wind"></span>
          <div class="wind">${weather.wind.speed}</div>
        </div>

        <div class="weather_main_humidity">
          <span class="fa fa-tint"></span>
          <div class="humidity">${weather.main.humidity}</div>
        </div>
    </div>


    <div class="weather_main_data">
        <div class="weather_main_time">18h</div>
        <div class="weather_main_temp">
          <span class="fa fa-thermometer-three-quarters"></span>
          <div class="temp">${weather.main.temp}</div>
        </div>

        <div class="weather_main_wind">
          <span class="fa fa-wind"></span>
          <div class="wind">${weather.wind.speed}</div>
        </div>

        <div class="weather_main_humidity">
          <span class="fa fa-tint"></span>
          <div class="humidity">${weather.main.humidity}</div>
        </div>
    </div>


    <div class="weather_main_data">
        <div class="weather_main_time">19h</div>
        <div class="weather_main_temp">
          <span class="fa fa-thermometer-three-quarters"></span>
          <div class="temp">${weather.main.temp}</div>
        </div>

        <div class="weather_main_wind">
          <span class="fa fa-wind"></span>
          <div class="wind">${weather.wind.speed}</div>
        </div>

        <div class="weather_main_humidity">
          <span class="fa fa-tint"></span>
          <div class="humidity">${weather.main.humidity}</div>
        </div>
    </div>
    `;
    
}

const renderSingleViewFooter = () => {
    const footer = document.querySelector(".footer");
    footer.innerHTML = "<div class='button_footer'><button class='save'>Guardar esta ubicación</button></div>";

    footer.addEventListener("click", () => {
        saveMarker();
        loadMapView();
    });
}

const saveMarker = () => {
    markersPositions.push(weather);
    localStorage.setItem("markers", JSON.stringify(markersPositions));

    const storingObj = {
        lat: center.lat,
        lgn: center.lng,
        zoom: 11
    };

    localStorage.setItem("info_map", JSON.stringify(storingObj));
}