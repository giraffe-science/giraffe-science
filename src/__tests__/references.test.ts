import {expect} from 'chai';
import {parseReferences} from "../library/references";

describe('parseReferences()', () => {
    it('works', async () => {
        expect(parseReferences("Rowe, Peter C.; Marden, Colleen L.; Heinlein, Scott; Edwards, Charles C. (Feb 2, 2018). \"Improvement of severe myalgic encephalomyelitis/chronic fatigue syndrome symptoms following surgical treatment of cervical spinal stenosis\". Journal of Translational Medicine. 16. doi:10.1186/s12967-018-1397-7. ISSN 1479-5876. PMC 5796598 . PMID 29391028."))
            .deep.eq([
            {"type": "doi", "value": "10.1186/s12967-018-1397-7"},
            {"type": "issn", "value": "1479-5876"},
            {"type": "pmc", "value": "5796598"},
            {"type": "pmid", "value": "29391028"}]);
    });
});
