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
// import Circle from 'ol/style/circle';            //ueberfluessiges include aus UE3
// import Style from 'ol/style/style';
// import Text from 'ol/style/text';
// import Fill from 'ol/style/fill';
// import Stroke from 'ol/style/stroke';
// import proj from 'ol/proj';
import {apply} from 'ol-mapbox-style';              //additional includes für UE4
import AutoComplete from 'javascript-autocomplete'; //additional includes für UE4


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

/*suchfunktion UE4*/
var searchResult = new VectorLayer({
  zIndex: 1 //
});

map.addLayer(searchResult);

new AutoComplete({
  selector: 'input[name="q"]',
  source: function(term, response) {
    var source = new VectorSource({
      format: new GeoJSON(),
      url: 'https://photon.komoot.de/api/?q=' + term
    });
    source.on('change', function() {
      var texts = source.getFeatures().map(function(feature) {
        var properties = feature.getProperties();
        return (properties.city || properties.name || '') + ', ' +
          (properties.street || '') + ' ' +
          (properties.housenumber || '');
      });
      response(texts);
      map.getView().fit(source.getExtent(), {
        maxZoom: 19,
        duration: 250
      });
    });
    searchResult.setSource(source);
  }
});
