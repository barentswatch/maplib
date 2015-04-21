describe('BW.MapAPI.Parsers.Base', function(){
    var dummyXml = '<?xml version="1.0" encoding="UTF-8"?> <msGMLOutput xmlns:gml="http://www.opengis.net/gml" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <Norges_kontinentalsokkel_layer> <gml:name>Norges kontinentalsokkel</gml:name> <Norges_kontinentalsokkel_feature> <gml:boundedBy> <gml:Box srsName="EPSG:3575"> <gml:coordinates>-895046.438000,-3703045.484080 824271.936178,-553112.388594</gml:coordinates> </gml:Box> </gml:boundedBy> <navn>Norges kontinentalsokkel</navn> <informasjon>Sone som dekker den undersjoiske forlengelsen av landmassen ut til de store havdyp, og som regnes fra territorialgrensen 12 nm ved Fastlands-Norge, Svalbard og Jan Mayen og ut til yttergrensen for sokkel eller avtalt avgrensningslinje mot annen stat</informasjon> <vedtaksdato>27.11.2006</vedtaksdato> <ikrafttredelsesdato>27.03.2009</ikrafttredelsesdato> <status_navn>Vedtatt</status_navn> <land>Norge</land> <lovreferanse>Recommendations of the Commission on the Limits of the Continental Shelf in regard to the Submission made by Norway in respect of areas in the Arctic Ocean, the Barents Sea and the Norwegian Sea on 27 november 2006</lovreferanse> <lovreferanse2>Continental Shelf Submission of Norway in respect of areas in the Arctic Ocean, the Barents Sea and the Norwegian Sea</lovreferanse2> <link>http://www.un.org/Depts/los/clcs_new/submissions_files/nor06/nor_rec_summ.pdf</link> <link2>http://www.un.org/Depts/los/clcs_new/submissions_files/nor06/nor_exec_sum.pdf</link2> <areal_i_km2>2039951</areal_i_km2> </Norges_kontinentalsokkel_feature> </Norges_kontinentalsokkel_layer> </msGMLOutput>';

    var dummyJson = {"type":"FeatureCollection","totalFeatures":0,"features":[{"type":"Feature","id":"Nise_bw.1","geometry":{"type":"MultiPolygon","coordinates":[[[[55.23474463387841,72.46035693743907],[55.21370777809186,72.4439949384942],[55.13297843980404,72.45067787170414],[55.16888618430683,72.45915412920294],[55.23474463387841,72.46035693743907]]],[[[55.39275883277284,72.58325686991122],[55.37676548728655,72.57081760119989],[55.36610603309968,72.57138252310683],[55.266660690031124,72.58221626299196],[55.35388374348986,72.58442878699866],[55.39275883277284,72.58325686991122]]]]},"geometry_name":"the_geom","properties":{"DYREGRUPPE":"Sj?pattedyr","ART":"Nise","STADIUM":"Utbredelse","MENGDE":"10000","REFERANSE":"","TETTHET":"Lav","ARTSNAVN":"Nise","group":"sj?pattedyr/marine mammals","species":"harbour porpoise","latin":"Phocoena phocoena","stock":"","type":"Utbredelse","startDate":"0101","endDate":"1231","update":"04122007","source":"Institute of Marine Research","kilde":"Havforskningsinstituttet","url":"http://www.imr.no/temasider/sjopattedyr/hval/nise/nb-no","trans":0,"wms_code":1,"sort_nmb":10,"ET_ID":0,"ET_Source":"G:\\ArcGIS\\Prosjekt\\Barentswatch\\SIRI\\Sj?pattedyr\\080113\\Med gyldighetsomr?de\\Eraze\\Nise_Utbredelse.shp"}}],"crs":{"type":"EPSG","properties":{"code":"4326"}}};

    var dummyTxt = '"layer name":19 "FID":0 "Shape":Point "Region":Svalbard "Location":Julibukta  (sea) "Species":Razorbill "IndNoInt":1-10 "Art":Alke "Latin":Alca torda';

    var factory;
    var parser;
    var result;
    beforeEach(function(){
        factory = new BW.MapAPI.Parsers.Factory(
            new BW.MapAPI.Parsers.GeoJSON(),
            new BW.MapAPI.Parsers.GML(),
            new BW.MapAPI.Parsers.GeneralXmlGml(),
            new BW.MapAPI.Parsers.FiskeriDir());
        parser = new BW.MapAPI.Parsers.Base(factory);
    });

    it('Should retrieve the attributes from an xml source', function(){
        result = parser.Parse(dummyXml);
        expect(result).not.toBeUndefined();
        expect(result.length === 11);
        expect(result[0].attributes).not.toBeUndefined();
        expect(result[0].attributes[0][0]).toBe("NAVN");
        expect(result[0].attributes[0][1]).toBe("Norges kontinentalsokkel");
    });

    it('Should retrieve the attributes from a json source', function(){
        result = parser.Parse(dummyJson);
        expect(result).not.toBeUndefined();
        expect(result.length === 11);
        expect(result[0].attributes).not.toBeUndefined();
        expect(result[0].attributes[1][0]).toBe("ART");
        expect(result[0].attributes[1][1]).toBe("Nise");
    });

    it('Should retrieve the attributes from a txt-file source used by some data suppliers', function(){
        result = parser.Parse(dummyTxt);
        expect(result).not.toBeUndefined();
        expect(result.length === 9);
        expect(result[0].attributes).not.toBeUndefined();
        expect(result[0].attributes[3][0]).toBe("Region");
        expect(result[0].attributes[3][1]).toBe("Svalbard");
    });
});