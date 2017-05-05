import axios from 'axios';
import convert from 'xml-js';
import _ from 'lodash';

export const Cadaster = (function () {
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
    };

    const _getXYArray = pos => _.split(pos, ' ');

    const fetchFeature = function (ref, referenceSystem = 'EPSG::3857') {
        const url = 'http://ovc.catastro.meh.es/INSPIRE/wfsCP.aspx';
        const posListPath = ['cp:CadastralParcel', 'cp:geometry', 'gml:MultiSurface', 'gml:surfaceMember', 'gml:Surface', 'gml:patches', 'gml:PolygonPatch', 'gml:exterior', 'gml:LinearRing', 'gml:posList'];
        const posPath = ['cp:CadastralParcel', 'cp:referencePoint', 'gml:Point', 'gml:pos'];
        const areaPath = ['cp:CadastralParcel', 'cp:areaValue'];
        const envelopePath = ['cp:CadastralParcel', 'gml:boundedBy', 'gml:Envelope'];

        return new Promise(function (resolve, reject) {
            axios.get(url, {
                params: {
                    service: 'wfs',
                    version: '2',
                    request: 'getfeature',
                    STOREDQUERIE_ID: 'GetParcel',
                    refcat: ref,
                    srsname: referenceSystem
                }
            }).then(response => {
                let dataObject = convert.xml2js(response.data, {compact: true});

                let features = _.get(dataObject, ['gml:FeatureCollection', 'gml:featureMember']);

                if (typeof features === 'undefined') {
                    throw 'Invalid data';
                }
                if (features instanceof Array) {
                    throw 'Multiple features not implemented';
                }
                let pos = _.get(features, posPath);
                pos = _.trim(pos._text);
                let posList = _.get(features, posListPath);
                posList = _.split(_.trim(posList._text), ' ');
                let area = _.get(features, areaPath);
                let envelope = _.get(features, envelopePath);
                let lowerCorner = _.get(envelope, ['gml:lowerCorner']);
                lowerCorner = _.trim(lowerCorner._text);
                let upperCorner = _.get(envelope, ['gml:upperCorner']);
                upperCorner = _.trim(upperCorner._text);

                let feature = {
                    area: area._text,
                    posList: _getCoordsFromString(posList),
                    pos: _getXYArray(pos),
                    area: area,
                    bounds: {
                        lowerCorner: _getXYArray(lowerCorner),
                        upperCorner: _getXYArray(upperCorner),
                    }
                };

                resolve(feature);
            }, (error) => {
                reject(error);
            });
        });
    };

    return {
        fetchFeature,
    }
})();

export default Cadaster;