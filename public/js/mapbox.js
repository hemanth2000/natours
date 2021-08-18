/*eslint-disable*/

// Task: Add pop-up when hover

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9oYW4tMTIzIiwiYSI6ImNrcDN6aTZheDBnNGgycHIya2JiMHlxNWMifQ.5oErNHl-nREOPSW5iym8bA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mohan-123/ckp40dh3i1jpy18qnjihwlqxk',
    scrollZoom: false,
    //   center: [-118.2437, 34.0522],
    //   zoom: 8,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ closeButton: false, offset: 25 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day} : ${loc.description}</p>`)
      .addTo(map);
    //Extend map bounds
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 100,
      right: 200,
      left: 200,
    },
  });
};
