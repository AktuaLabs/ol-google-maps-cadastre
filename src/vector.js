import bootstrap from 'bootstrap-webpack';
import $ from 'jquery';
import * as cadaster from '../lib/cadaster';

// Coords are for Madrid in EPSG:3857 Projection
const initialCenter = [-413524.323023, 4925754.976753];
const map = cadaster.GMap.init(initialCenter);

cadaster.Cadaster.init(map);

$('#search-form').on('submit', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const reference = $(this).find('[name=refcat]').val();
    cadaster.Cadaster.fetchFeature(reference, (feature) => {
        cadaster.GMap.addVectorLayer(feature.coords);
        cadaster.GMap.setCenter(feature.center);
        cadaster.GMap.setZoom(18);
    });
});








