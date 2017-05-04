import axios from 'axios';
import convert from 'xml-js';
import _ from 'lodash';

export const GMap = (function () {
    let _map;

    const addVectorLayer = function (coords) {
        if (typeof _map === 'undefined') {
            throw 'Map is not initialized';
        }
        let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: []
            }),
            visible: true,
        });
        let polygon = new ol.Feature(new ol.geom.Polygon([coords]));

        layer.getSource().addFeature(polygon);
        _map.addLayer(layer);
    }

    const setCenter = function (coords) {
        _map.getView().setCenter(coords);
    }

    const setZoom = function (zoom) {
        _map.getView().setZoom(zoom);
    }

    const _create = function (center, zoom) {
        let GMRaster = new olgm.layer.Google();

        _map = new ol.Map({
            // use OL3-Google-Maps recommended default interactions
            interactions: olgm.interaction.defaults(),
            layers: [
                GMRaster
            ],
            target: 'vector-map',
            view: new ol.View({
                center: center,
                zoom: zoom,
                projection: 'EPSG:3857'
            })
        });

        var olGM = new olgm.OLGoogleMaps({map: _map}); // map is the ol.Map instance
        olGM.activate();

        return _map;
    }

    return {
        init(coords, zoom = 12) {
            return _create(coords, zoom);
        },
        addVectorLayer,
        setCenter,
        setZoom
    }
})();

export const Cadaster = (function () {
    var _map;
    const posListPath = ['cp:CadastralParcel', 'cp:geometry', 'gml:MultiSurface', 'gml:surfaceMember', 'gml:Surface', 'gml:patches', 'gml:PolygonPatch', 'gml:exterior', 'gml:LinearRing', 'gml:posList'];
    const posPath = ['cp:CadastralParcel', 'cp:referencePoint', 'gml:Point', 'gml:pos'];

    const _getCoordsFromString = function (coords) {
        let formattedCoords = [], xyPair = [];
        _.each(coords, (value, key) => {
            xyPair.push(value);
            if (xyPair.length === 2) {
                formattedCoords.push(xyPair);
                xyPair = [];
            }
        });

        return formattedCoords;
    }

    let _getXYArray = function (pos) {
        return _.split(pos, ' ');
    };
    const fetchFeature = function (ref, callback) {
        let url = `http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx`;

        axios.get(url, {
            params: {
                service: 'wfs',
                version: '2',
                request: 'getfeature',
                STOREDQUERIE_ID: 'GetParcel',
                refcat: ref,
                srsname: 'EPSG::3857'
            }
        }).then(function (response) {
            let dataObject = convert.xml2js(response.data, {compact: true});
            console.log(dataObject);

            let features = _.get(dataObject, ['gml:FeatureCollection', 'gml:featureMember']);

            if (features instanceof Array) {
                throw 'Multiple features not implemented';
            }
            let pos = _.get(features, posPath);
            let posList = _.get(features, posListPath);

            posList = _.split(_.trim(posList._text), ' ');

            let feature = {
                coords: _getCoordsFromString(posList),
                center: _getXYArray(_.trim(pos._text)),
            }

            if (callback instanceof Function) {
                callback(feature);
            }

            return feature;
        });
    }

    return {
        fetchFeature,
        init(map){
            _map = map;
        }
    }
})();

export default {
    Cadaster,
    GMap,
}