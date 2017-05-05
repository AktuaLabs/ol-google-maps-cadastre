import bootstrap from 'bootstrap-webpack';
import $ from 'jquery';
import cadaster from '../lib/cadaster';
import gmap from '../lib/gmap';

// Coords are for Madrid in EPSG:3857 Projection
const initialCenter = [-413524.323023, 4925754.976753];
const map = gmap.init('vector-map', initialCenter);

$('#search-form').on('submit', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const reference = $(this).find('[name=refcat]').val();
    cadaster.fetchFeature(reference, (feature) => {
        gmap.addVectorLayer(feature.posList);
        gmap.setCenter(feature.pos);
        gmap.setZoom(18);
    });
});








