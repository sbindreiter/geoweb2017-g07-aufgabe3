import 'ol/ol.css';
import 'javascript-autocomplete/auto-complete.css'; //additional includes für UE4
// import View from 'ol/view';                      //ueberfluessiges include aus UE3
// import Map from 'ol/map';
// import TileLayer from 'ol/layer/tile';
// import Stamen from 'ol/source/stamen';
import VectorLayer from 'ol/layer/vector';
// import Vector from 'ol/source/vector';           //ueberfluessiges include aus UE3
import VectorSource from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson';
import Style from 'ol/style/style';
import IconStyle from 'ol/style/icon';
// import Circle from 'ol/style/circle';            //ueberfluessiges include aus UE3
// import Text from 'ol/style/text';
// import Fill from 'ol/style/fill';
// import Stroke from 'ol/style/stroke';
import proj from 'ol/proj';
import {apply} from 'ol-mapbox-style';              //additional includes für UE4
import AutoComplete from 'javascript-autocomplete'; //additional includes für UE4
import Overlay from 'ol/overlay';
import coordinate from 'ol/coordinate';


/*ehemals code der ue3*/
/*ue3 part replaced by style.json*/
// const map = new Map({
//   target: 'map',
//   view: new View({
//     center: proj.fromLonLat([16.37, 48.2]),
//     zoom: 13
//   })
// });
// map.addLayer(new TileLayer({
//   source: new Stamen({
//     layer: 'watercolor'
//   })
// }));
//
// const home_addresses = new VectorLayer({   //ue 3
//   source: new Vector({
//     url: 'data/map.geojson',
//     format: new GeoJSON(),
//     zIndex: 9999999
//   })
// });
// map.addLayer(home_addresses);
//
// home_addresses.setStyle(function(feature) {
//   var image = new Circle({
//     radius: 5,
//     fill: new Fill({
//       color: '#31a354'
//     }),
//     stroke: new Stroke({color: 'red', width: 1})
//   });
//   return new Style({
//     image: image,
//     text: new Text({
//       text: feature.get('Name'),
//       font: 'Bold 12pt Verdana'
//     })
//   });
// });


/*ersetzt durch sandbox ausschnitt aus ue4*/
var map = apply(
  'map',
  'style.json'
);


function fit() {
  map.getView().fit(source.getExtent(), {
    maxZoom: 19,
    duration: 250
  });
}

var selected;
function getAddress(feature) {
  var properties = feature.getProperties();
  return (
    (properties.city || properties.name || '') +
    ' ' +
    (properties.street || '') +
    ' ' +
    (properties.housenumber || '')
  );
}

/*suchfunktion UE4*/
var searchResult = new VectorLayer({
  zIndex: 1 //
});

map.addLayer(searchResult);
searchResult.setStyle(new Style({
  image: new IconStyle({
    src: './data/marker1.png'
  })
}));

var onload, source;
new AutoComplete({
  selector: 'input[name="q"]',
  source: function(term, response) {
    if (onload) {
      source.un('change', onload);
    }
    searchResult.setSource(null);
    source = new VectorSource({
      format: new GeoJSON(),
      url: 'https://photon.komoot.de/api/?q=' + term
    });
    onload = function(e) {
      var texts = source.getFeatures().map(function(feature) {
        return getAddress(feature);
      });
      response(texts);
      fit();
    };
    source.once('change', onload);
    searchResult.setSource(source);
  },
  onSelect: function(e, term, item) {
    selected = item.getAttribute('data-val');
    source.getFeatures().forEach(function(feature) {
      if (getAddress(feature) !== selected) {
        source.removeFeature(feature);
      }
    });
    fit();
  }
});
var overlay = new Overlay({
  element: document.getElementById('popup-container'),
  positioning: 'bottom-center',
  offset: [0, -10]
});
map.addOverlay(overlay);

map.on('click', function(e) {
  overlay.setPosition();
  var features = map.getFeaturesAtPixel(e.pixel);
  if (features) {
    var coords = features[0].getGeometry().getCoordinates();
    var hdms = coordinate.toStringHDMS(proj.toLonLat(coords));
    overlay.getElement().innerHTML = hdms;
    overlay.setPosition(coords);
  }
});
