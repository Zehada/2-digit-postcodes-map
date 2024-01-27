var map = L.map('map').setView([46.238643094963344, 5.62950599668754], 8);


var CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);


L.Routing.control({
    geocoder: L.Control.Geocoder.nominatim(),
    router: new L.Routing.osrmv1({
        language: 'fr'
    })
}).addTo(map)



let union = "https://raw.githubusercontent.com/Zehada/2-digit-postcodes-geojson/main/union2.geojson";

fetch(union)
    .then(response => response.json())
    .then(data => {


        var style = (properties) => {

            if (properties.layer == 'france') {
                return {
                    "color": "#00487C",
                    "fillOpacity": 0.01,
                    "weight": 1
                };
            } else if (properties.layer == 'germany') {
                return {
                    "color": "#695958",
                    "fillOpacity": 0.01,
                    "weight": 1
                };
            } else if (properties.layer == 'switzerland') {
                return {
                    "color": "#086b40",
                    "fillOpacity": 0.01,
                    "weight": 1
                };
            } else if (properties.layer == 'spain') {
                return {
                    "color": "#8B728E",
                    "fillOpacity": 0.01,
                    "weight": 1
                };
            } else if (properties.layer == 'netherlands') {
                return {
                    "color": "#1b6d43",
                    "fillOpacity": 0.01,
                    "weight": 1
                };
            }
        }

        var options = {

            maxZoom: 14,  // max zoom to preserve detail on; can't be higher than 24
            tolerance: 3, // simplification tolerance (higher means simpler)
            extent: 4096, // tile extent (both width and height)
            buffer: 64,   // tile buffer on each side
            debug: 0,     // logging level (0 to disable, 1 or 2)
            lineMetrics: false, // whether to enable line metrics tracking for LineString/MultiLineString features
            promoteId: null,    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
            generateId: false,  // whether to generate feature ids. Cannot be used with `promoteId`
            indexMaxZoom: 5,       // max zoom in the initial tile index
            indexMaxPoints: 100000, // max number of points per tile in the index
            style: style,
        }

        let geojsonLayer = L.geoJSON.vt(data, options).addTo(map);



        data.features.forEach(feature => {



            // feature.bindPopup(feature.properties.code)

            let max_area_polygon;
            let max_area = 0;


            for (poly in (feature.geometry.coordinates)) {
                polygon = turf.polygon((feature.geometry.coordinates)[poly])
                area = turf.area(polygon);

                if (area > max_area) {
                    max_area = area
                    max_area_polygon = polygon // polygon with the largest area
                }
            }

            centerReversed = turf.centerOfMass(max_area_polygon);

            center = [centerReversed.geometry.coordinates[1], centerReversed.geometry.coordinates[0]]


            var tooltip = L.tooltip(center,
                {
                    content: feature.properties.code,
                    permanent: true,
                    direction: "center",
                }
            ).addTo(map);

        })

    })
    .catch(error => {
        console.error('Erreur lors du chargement des données GeoJSON :', error);
    });

