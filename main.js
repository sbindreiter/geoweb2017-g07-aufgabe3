import 'ol/ol.css';
import 'javascript-autocomplete/auto-complete.css'; //additional includes für UE4
// import View from 'ol/view';                      //ueberfluessiges include aus UE3
// import Map from 'ol/map';
// import TileLayer from 'ol/layer/tile';
// import Stamen from 'ol/source/stamen';
import VectorLayer from 'ol/layer/vector';
import Vector from 'ol/source/vector';           //ueberfluessiges include aus UE3
import VectorSource from 'ol/source/vector';
import GeoJSON from 'ol/format/geojson';
import Style from 'ol/style/style';
import IconStyle from 'ol/style/icon';
import Circle from 'ol/style/circle';            //ueberfluessiges include aus UE3
// import Text from 'ol/style/text';
import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import proj from 'ol/proj';
import {apply} from 'ol-mapbox-style';              //additional includes für UE4
import AutoComplete from 'javascript-autocomplete'; //additional includes für UE4
import Overlay from 'ol/overlay';
import coordinate from 'ol/coordinate';


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
  zIndex: 3 //
});

map.addLayer(searchResult);
searchResult.setStyle(new Style({
  image: new IconStyle({
    src: './data/marker1.png'
  })
}));

const bezirkeLayer = new VectorLayer({
  source: new Vector({
    url: 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:BEZIRKSGRENZEOGD&srsName=EPSG:4326&outputFormat=json',
    format: new GeoJSON()
  }),
  zIndex: 2
});
map.addLayer(bezirkeLayer);

const layer = new VectorLayer({
  source: new Vector({
    url: 'https://student.ifip.tuwien.ac.at/geoweb/2017/g07/map/postgis_geojson.php',
    format: new GeoJSON()
  }),
  zIndex: 4
});
map.addLayer(layer);

layer.setStyle(function(feature) {
  return new Style({
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color: 'rgba(232, 12, 12, 1)'
      }),
      stroke: new Stroke({
        color: 'rgba(127, 127, 127, 1)',
        width: 1
      })
    })
  });
});

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


map.on('singleclick', function(e) {
  var markup = '';
  map.forEachFeatureAtPixel(e.pixel, function(feature) {
    var properties = feature.getProperties();
    markup += `${markup && '<hr>'}<table>`;
    for (var property in properties) {
      if (property != 'geometry') {
        markup += `<tr><th>${property}</th><td>${properties[property]}</td></tr>`;
      }
    }
    markup += '</table>';
  }, {
    layerFilter: (l) => l === layer
  });
  if (markup) {
    document.getElementById('popup-content').innerHTML = markup;
    overlay.setPosition(e.coordinate);
  } else {
    overlay.setPosition();
    var pos = proj.toLonLat(e.coordinate);
    window.location.href =
        'https://student.ifip.tuwien.ac.at/geoweb/2017/g07/intranet/feedback.php?pos=' +
        pos.join(' ');
  }
});


function calculateStatistics() {
  const feedbacks = layer.getSource().getFeatures();
  const bezirke = bezirkeLayer.getSource().getFeatures();
  if (feedbacks.length > 0 && bezirke.length > 0) {
    for (var i = 0, ii = feedbacks.length; i < ii; ++i) {
      var feedback = feedbacks[i];
      for (var j = 0, jj = bezirke.length; j < jj; ++j) {
        var bezirk = bezirke[j];
        var count = bezirk.get('FEEDBACKS') || 0;
        var feedbackGeom = feedback.getGeometry();
        if (feedbackGeom &&
            bezirk.getGeometry().intersectsCoordinate(feedbackGeom.getCoordinates())) {
          ++count;
        }
        bezirk.set('FEEDBACKS', count);
      }
    }
  }
}
bezirkeLayer.getSource().once('change', calculateStatistics);
layer.getSource().once('change', calculateStatistics);

bezirkeLayer.setStyle(function(feature) {
  var fillColor;
  const feedbackCount = feature.get('FEEDBACKS');
  if (feedbackCount <= 1) {
    fillColor = 'rgba(247, 252, 185, 0.7';
  } else if (feedbackCount < 5) {
    fillColor = 'rgba(173, 221, 142, 0.7)';
  } else {
    fillColor = 'rgba(49, 163, 84, 0.7)';
  }
  return new Style({
    fill: new Fill({
      color: fillColor
    }),
    stroke: new Stroke({
      color: 'rgba(4, 4, 4, 1)',
      width: 1
    })
  });
});
