import bootstrap from 'bootstrap-webpack';
import $ from 'jquery';
import _ from 'lodash';
import cadaster from '../lib/cadaster';

var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 40.313043, lng: -3.603516},
});

$('#search-form').on('submit', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    const reference = $(this).find('[name=refcat]').val();
    cadaster.fetchFeature(reference, 'EPSG:4326').then((feature) => {
        let polygon = [];
        _.each(feature.posList, function (value) {
            polygon.push({lat: parseFloat(value[0]), lng: parseFloat(value[1])});
        });

        console.log(polygon);
        map.data.add({geometry: new google.maps.Data.Polygon([polygon])})
        map.setCenter({lat: parseFloat(feature.pos[0]), lng: parseFloat(feature.pos[1])});
        map.setZoom(18);
    });
});


