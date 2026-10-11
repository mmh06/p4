const testing = window.location.pathname.split("/").pop();
console.log(testing);
if (!testing) {
    console.log("empty string");
}
if (testing === "index.html" || !testing) {
    $(document).foundation();

    // Select the button and the container element
    const button = document.getElementById('reverse-btn');
    const container = document.getElementById('edlist');

    // Toggle the class on button click
    button.addEventListener('click', () => {
        container.classList.toggle('reversed-order');
    });

    const button2 = document.getElementById('reverse-work');
    const container2 = document.getElementById('wlist');

    // Toggle the class on button click
    button2.addEventListener('click', () => {
        container2.classList.toggle('reversed-order');
    });
}
// Get the current HTML file name
let mapElement;
const currentFile = window.location.pathname.split("/").pop();
// Only execute code if the user is on "startupplan.html"
if (currentFile === "startupplan.html") {
    console.log("This code only runs on startupplan.html");
    const mediaQuery = window.matchMedia('(min-width: 350px)');
    function displayMessage(e) {
        //shows different dialogue for different device types
        if (e.matches) {
            // display message for non mobile device
            console.log("Most probably not a a mobile device");
            messageNonMobile();
        } else {
            //dislay code for probable mobile device
            console.log("Most probably a mobie device based on th browser width.");
            messageMobile();
        }
    }
    // coding for  the listener to detect screen resizing
    mediaQuery.addEventListener('change', displayMessage);
    // Run the function on page start
    displayMessage(mediaQuery);
    function messageNonMobile() {
        const mb = document.getElementById("message-box");
        mb.style.display = "block";
        mb.style.textAlign = "center";
        mb.style.backgroundColor = "yellow";
        mb.style.color = "black";
        mb.style.padding = "5px";
        mb.textContent = "Nice!Not Mobile::Enjoy the cool css.";
    }
    function messageMobile() {
        const mb = document.getElementById("message-box");
        mb.style.display = "block";
        mb.textContent = "Boo!Mobile:Trading cool css for speed and low data usage.";
        mb.style.fontFamily = "Verdana, sans-serif";
    }
    const mq = window.matchMedia('(min-width: 1025px)');
    function dm(e) {
        //shows different dialogue for different device types
        if (e.matches) {
            // display message for non mobile device
            console.log("Definitely a desktop");
            messageDesktop();
        } else {
            /*dislay code for probable mobile device
            console.log("Most probably a mobie device based on th browser width.");
            messageMobile();*/
        }
    }
    // coding for  the listener to detect screen resizing
    mq.addEventListener('change', dm);
    // Run the function on page start
    dm(mq);
    function messageDesktop() {
        const mb = document.getElementById("message-box");
        mb.style.display = "block";
        mb.style.textAlign = "center";
        mb.style.backgroundColor = "yellow";
        mb.style.color = "black";
        mb.style.padding = "5px";
        mb.textContent = "Feel the power of desktop";
    }
}
else if (currentFile === "m.html") {

    console.log("This code only runs on m.html");
    // 1. Check if the Geolocation API is supported by the browser
    if ("geolocation" in navigator) {
        // 2. Request the current position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Success callback: extraction of coordinates
                const latitude = parseFloat(position.coords.latitude.toFixed(4));
                const longitude = parseFloat(position.coords.longitude.toFixed(4));
                console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                // 1. Select the <gmp-map> element by its ID
                mapElement = document.getElementById('dmap');
                // 2. Wait for the custom element to be defined, then access its innerMap property
                const innerMap = mapElement.innerMap;
                // 3. Set the new coordinates using setCenter() or setOptions()
                innerMap.setCenter({
                    lat: latitude, lng: longitude
                }
                );
                innerMap.setZoom(4);
                addMarkerToMap(latitude, longitude, "Your lcocation");
                //redCirc(latitude,longitude,500);
                getHighestEarthquake(latitude, longitude, 500).then(result => console.log(result));
                innerMap.addListener('click', (event) => {
                    // 4. Extract the latitude and longitude from the event
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
                    getHighestEarthquake(lat, lng, 100).then(result => console.log(result));
                }
                );
            }
            ,
            (error) => {
                // Error callback: handling issues (e.g., user denied permission)
                console.error("Error retrieving location:", error.message);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
    async function redCirc(lati, long, radius) {
        // 1. Initialize the map centered on your coordinate
        mapElement = new google.maps.Map(document.getElementById('dmap'), {
            center: { lat: 38.7946, lng: 106.5348 },
            zoom: 4,
        });

        // 2. Add the red border circle
        let rad = radius * 1000;
        const redCircle = new google.maps.Circle({
            strokeColor: "#FF0000",   // Red border outline
            strokeOpacity: 0.8,       // Opacity of the border
            strokeWeight: 2,          // Thickness of the border
            fillColor: "#FF0000",     // Fill color (same or different)
            fillOpacity: 0.1,         // Low opacity to make it see-through
            map: mapElement,
            center: { lat: lati, lng: long },
            radius: rad,             // Radius size in METERS (e.g., 5km)
        });




    }
    //display eartquake info
    async function getHighestEarthquake(latitude, longitude, maxRadiusKm = 100) {
        // USGS API endpoint for querying events
        const baseUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
        // Define query parameters to filter by location and get the maximum magnitude first
        const params = new URLSearchParams({
            format: 'geojson',
            latitude: latitude,
            longitude: longitude,
            maxradiuskm: maxRadiusKm, // Distance window around your coordinates
            orderby: 'magnitude',     // Sort highest magnitude first
            limit: 1                  // Only return the top 1 result
        }
        );
        try {
            const response = await fetch(`${baseUrl}?${params}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const highestQuake = data.features[0].geometry.coordinates;
                lati = highestQuake[1];
                lang = highestQuake[0];
                console.table(data.features[0]);
                place = data.features[0].properties.place;
                const eqemo = String.fromCodePoint(0x1F6D8);

                place = place + eqemo;
                place = place + "of magnitude" + data.features[0].properties.mag;

                addMarkerToMap(lati, lang, place);
                return {
                    magnitude: highestQuake.mag,
                    place: highestQuake.place,
                    cord: highestQuake.longitude,
                    time: new Date(highestQuake.time).toLocaleString()
                }
                    ;
            } else {
                alert("No strong quakes recorded in this 500km radius");
                return "No strong quakes recorded in this 500km radius.";
            }
        } catch (error) {
            console.error("Failed to fetch earthquake data:", error);
            return null;
        }
    }
    // Example usage: Searching a 500km radius around Los Angeles (34.05, -118.24)
    async function addMarkerToMap(lati, lang, td) {
        // 1. Select the gmp-map element by ID
        me = document.getElementById('dmap');
        // 2. Load the marker library
        const {
            AdvancedMarkerElement
        }
            = await google.maps.importLibrary("marker");
        // 3. Create the advanced marker instance
        const pinText = document.createElement('div');
        pinText.textContent = td;
        pinText.className = 'mlabelclass';
        const customPin = new google.maps.marker.PinElement({
            background: '#FBBC04',  // Changes pin background color
            borderColor: '#137333', // Changes border color
            glyphText: td,         // Places text inside the pin (replaces default dot)
            scale: 1.2,             // Resizes the pin
        });
        const marker = new AdvancedMarkerElement({
            position: {
                lat: lati, lng: lang
            }
            ,
            title: "My Marker Location",
            content: customPin
        }
        );
        /* 4. Append the marker to the <gmp-map> element
        const position = { lat: lati, lng: lang };
        const { Circle } = await google.maps.importLibrary("maps");
        const circle = new google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map: me,
      center: position, // Matches the marker position directly
      radius: 1000      // Radius in meters
    });*/
        me.append(marker);


    }

}
else if (currentFile === "cssdemo.html") {
    console.log("js working");

    $(document).ready(function () {
        let currentIndex = 0;
        const totalSlides = $('.slide').length;

        function updateSlide() {
            const offset = -currentIndex * 300; // Match box width
            $('.slider-wrapper').css('transform', `translateX(${offset}px)`);
        }

        $('#nextBtn').click(function () {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlide();
        });

        $('#prevBtn').click(function () {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlide();
        });
    });




}
