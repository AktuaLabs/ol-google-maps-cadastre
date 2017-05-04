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

    const _create = function (target, center, zoom) {
        let GMRaster = new olgm.layer.Google();

        let map = new ol.Map({
            // use OL3-Google-Maps recommended default interactions
            interactions: olgm.interaction.defaults(),
            layers: [
                GMRaster
            ],
            target: target,
            view: new ol.View({
                center: center,
                zoom: zoom,
                projection: 'EPSG:3857'
            })
        });

        const olGM = new olgm.OLGoogleMaps({map: map}); // map is the ol.Map instance
        olGM.activate();

        return map;
    }

    return {
        init(target, coords, zoom = 12) {
            return _map = _create(target, coords, zoom);
        },
        addVectorLayer,
        setCenter,
        setZoom
    }
})();

export default GMap;