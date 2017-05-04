import bootstrap from 'bootstrap-webpack';
import jQuery from 'jquery';
import * as cadaster from '../lib/cadaster';

// Coords are for Madrid in EPSG:3857 Projection
const initialCenter = [-413524.323023, 4925754.976753];
const map = cadaster.GMap.init(initialCenter, 19);

cadaster.Cadaster.init(map);

cadaster.Cadaster.fetchFeature('0484061WF5708S0001SO', (feature) => {
    cadaster.GMap.addVectorLayer(feature.coords);
    cadaster.GMap.setCenter(feature.center);
});






