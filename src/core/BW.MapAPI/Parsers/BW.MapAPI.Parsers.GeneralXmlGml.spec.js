describe('BW.MapAPI.Parsers.GeneralXmlGml', function(){
    var dummyXml = '<?xml version="1.0" encoding="UTF-8"?> <msGMLOutput xmlns:gml="http://www.opengis.net/gml" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <Norges_kontinentalsokkel_layer> <gml:name>Norges kontinentalsokkel</gml:name> <Norges_kontinentalsokkel_feature> <gml:boundedBy> <gml:Box srsName="EPSG:3575"> <gml:coordinates>-895046.438000,-3703045.484080 824271.936178,-553112.388594</gml:coordinates> </gml:Box> </gml:boundedBy> <navn>Norges kontinentalsokkel</navn> <informasjon>Sone som dekker den undersjoiske forlengelsen av landmassen ut til de store havdyp, og som regnes fra territorialgrensen 12 nm ved Fastlands-Norge, Svalbard og Jan Mayen og ut til yttergrensen for sokkel eller avtalt avgrensningslinje mot annen stat</informasjon> <vedtaksdato>27.11.2006</vedtaksdato> <ikrafttredelsesdato>27.03.2009</ikrafttredelsesdato> <status_navn>Vedtatt</status_navn> <land>Norge</land> <lovreferanse>Recommendations of the Commission on the Limits of the Continental Shelf in regard to the Submission made by Norway in respect of areas in the Arctic Ocean, the Barents Sea and the Norwegian Sea on 27 november 2006</lovreferanse> <lovreferanse2>Continental Shelf Submission of Norway in respect of areas in the Arctic Ocean, the Barents Sea and the Norwegian Sea</lovreferanse2> <link>http://www.un.org/Depts/los/clcs_new/submissions_files/nor06/nor_rec_summ.pdf</link> <link2>http://www.un.org/Depts/los/clcs_new/submissions_files/nor06/nor_exec_sum.pdf</link2> <areal_i_km2>2039951</areal_i_km2> </Norges_kontinentalsokkel_feature> </Norges_kontinentalsokkel_layer> </msGMLOutput>';
    beforeEach(function(){
    });

    it('Should retrieve the attributes', function(){
        var parser = new BW.MapAPI.Parsers.GeneralXmlGml();
        var result = parser.Parse(dummyXml);
        expect(result).not.toBeUndefined();
        expect(result.length === 11);
        expect(result[0].attributes).not.toBeUndefined();
        expect(result[0].attributes[0][0]).toBe("NAVN");
        expect(result[0].attributes[0][1]).toBe("Norges kontinentalsokkel");
    });

});