var center = [-241192.1, 4499632.92];

var googleLayer = new olgm.layer.Google();

var tileWMSLayerParcel = new ol.layer.Tile({
    extent: [-241386.84, 4499447.03, -241018.79, 4499817.59],
    source: new ol.source.TileWMS({
        crossOrigin: 'anonymous',
        url: 'http://ovc.catastro.meh.es/cartografia/INSPIRE/spadgcwms.aspx',
        params: {
            'LAYERS': 'cp.cadastralparcel',
            'VERSION': '2',
        },
        serverType: 'mapserver',
    }),
    visible: false
});

var tileWMSLayerFull = new ol.layer.Tile({
    extent: [-241386.84, 4499447.03, -241018.79, 4499817.59],
    source: new ol.source.TileWMS({
        crossOrigin: 'anonymous',
        url: 'http://ovc.catastro.meh.es/cartografia/INSPIRE/spadgcwms.aspx',
        params: {
            'LAYERS': 'cp.cadastralparcel,bu.building,bu.buildingpart,ad.address,au.administrativeunit,au.administrativeboundary,cp.cadastralzoning',
            'VERSION': '2',
            'STYLES': 'elfcadastre,elfcadastre,elfcadastre,number.elfcadastre,elfcadastre,elfcadastre,elfcadastre'
        },
        serverType: 'mapserver',
    }),
    visible: false
});

var imageWMSLayerFull = new ol.layer.Image({
    extent: [-241386.84, 4499447.03, -241018.79, 4499817.59],
    source: new ol.source.ImageWMS({
        crossOrigin: 'anonymous',
        url: 'http://ovc.catastro.meh.es/cartografia/INSPIRE/spadgcwms.aspx',
        params: {
            'LAYERS': 'cp.cadastralparcel,bu.building,bu.buildingpart,ad.address,au.administrativeunit,au.administrativeboundary,cp.cadastralzoning',
            'VERSION': '2',
            'STYLES': 'elfcadastre,elfcadastre,elfcadastre,number.elfcadastre,elfcadastre,elfcadastre,elfcadastre',
            'FORMAT': 'image/png'
        },
        serverType: 'mapserver',
    }),
    visible: true
});

var imageWMSLayerParcel = new ol.layer.Image({
    extent: [-241386.84, 4499447.03, -241018.79, 4499817.59],
    source: new ol.source.ImageWMS({
        crossOrigin: 'anonymous',
        url: 'http://ovc.catastro.meh.es/cartografia/INSPIRE/spadgcwms.aspx',
        params: {
            'LAYERS': 'cp.cadastralparcel,bu.building,bu.buildingpart,ad.address,au.administrativeunit,au.administrativeboundary,cp.cadastralzoning',
            'VERSION': '2',
            'FORMAT': 'image/png'
        },
        serverType: 'mapserver',
    }),
    visible: false,
});

var imageWMSLayerZoning = new ol.layer.Image({
    extent: [-241386.84, 4499447.03, -241018.79, 4499817.59],
    source: new ol.source.ImageWMS({
        crossOrigin: 'anonymous',
        url: 'http://ovc.catastro.meh.es/cartografia/INSPIRE/spadgcwms.aspx',
        params: {
            'LAYERS': 'cp.cadastralzoning',
            'VERSION': '2',
            'FORMAT': 'image/png'
        },
        serverType: 'mapserver',
    }),
    visible: false
});

var map = new ol.Map({
    // use OL3-Google-Maps recommended default interactions
    interactions: olgm.interaction.defaults(),
    layers: [
        googleLayer,
        tileWMSLayerParcel,
        tileWMSLayerFull,
        imageWMSLayerFull,
        imageWMSLayerParcel,
        imageWMSLayerZoning,
    ],
    target: 'map',
    view: new ol.View({
        center: center,
        zoom: 14
    })
});

var olGM = new olgm.OLGoogleMaps({map: map}); // map is the ol.Map instance
olGM.activate();

$(document).ready(function () {
    $('controls').find('button').click(function () {
        $(this).addClass('active');
        $(this).siblings('button').removeClass('active');
    });

    $('#show-full').click(function () {
        olGM.ol3map.getLayers().forEach(function (layer) {
            if (!(layer instanceof olgm.layer.Google)) {
                layer.setVisible(false);
            }
        });
        imageWMSLayerFull.setVisible(true);
    });

    $('#show-parcel').click(function () {
        olGM.ol3map.getLayers().forEach(function (layer) {
            if (!(layer instanceof olgm.layer.Google)) {
                layer.setVisible(false);
            }
        });
        imageWMSLayerParcel.setVisible(true);
    });

    $('#show-zoning').click(function () {
        olGM.ol3map.getLayers().forEach(function (layer) {
            if (!(layer instanceof olgm.layer.Google)) {
                layer.setVisible(false);
            }
        });
        imageWMSLayerZoning.setVisible(true);
    });

    $('#show-tile-parcel').click(function () {
        olGM.ol3map.getLayers().forEach(function (layer) {
            if (!(layer instanceof olgm.layer.Google)) {
                layer.setVisible(false);
            }
        });
        tileWMSLayerParcel.setVisible(true);
    });

    $('#show-tile-full').click(function () {
        olGM.ol3map.getLayers().forEach(function (layer) {
            if (!(layer instanceof olgm.layer.Google)) {
                layer.setVisible(false);
            }
        });
        tileWMSLayerFull.setVisible(true);
    });
});
