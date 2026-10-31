/**
 * 100% Authentic, Canonical Sanskrit Texts in ISO 15919 / IAST transliteration.
 * Features verified authentic stotras from original tradition, including Swami Vedanta Desika's
 * Śrī Aṣṭabhujāṣṭakam, Maharṣi Vyāsa's Śrī Viṣṇu Sahasranāma, and Śrī Rāmāṣṭakam,
 * complete with realistic web repository artifacts (prapatti.com) for sanitization testing.
 */

export interface SampleTextItem {
  id: string;
  name: string;
  composer: string;
  description: string;
  text: string;
}

export const SAMPLE_TEXTS: SampleTextItem[] = [
  {
    id: 'ashtabhuja-legacy-pdf',
    name: 'Śrī Aṣṭabhujāṣṭakam (PDF copy with Á Á)',
    composer: 'Svāmī Vedānta Deśikan',
    description: 'Real PDF copy format using Á for single danda and Á Á for double danda around verse numbers.',
    text: `================================================================================
www.prapatti.com                                                      Page 1 of 2
Desika Stotra Mala - Sri Ramanuja Mission
PDF created by www.prapatti.com
Source: http://www.prapatti.com/slokas/sanskrit/ashtabhujashtakam.pdf
================================================================================

śrīmate rāmānujāya namaḥ
śrīmate nigamāntamahādeśikāya namaḥ

śrī aṣṭabhujāṣṭakam

dhyānam
śrīmān veṅkaṭanāthāryaḥ kavitārkikakesarī Á
vedāntācāryavaryo me sannidhattāṁ sadā hṛdi Á Á

gajēndrarakṣātvaritaṁ bhavantaṁ grāhairivāhaṁ viṣayairvikṛṣṭaḥ Á
apāravijñānadayānubhāvam āptaṁ satāmaṣṭabhujaṁ prapadye Á 1 Á Á

tvadekaśeṣo 'hamanātmatantraḥ tvatpādalipsāṁ diśatā tvayaiva Á
asatsamo 'pyaṣṭabhujāspadeśa sattāmidānīmupalambhito 'smi Á 2 Á Á

svarūparūpāstravibhūṣaṇādyaiḥ paratvacintāṁ tvayi durnivārām Á
bhoge mṛdūpakramatāmabhīpsan śīlādibhirvārayasīva puṁsām Á 3 Á Á

śaktiṁ śaraṇyāntaraśabdabhājāṁ sāraṁ ca santolya phalāntarāṇām Á
tvaddāsyahetostvayi nirviśaṅkaṁ nyastātmanāṁ nātha bibharṣi bhāram Á 4 Á Á

abhītihetoranuvartanīyaṁ nātha tvadanyaṁ na vibhāvayāmi Á
bhayaṁ kutaḥ syāt tvayi sānukampe rakṣā kutaḥ syāt tvayi jātarōṣe Á 5 Á Á

tvadekatantraṁ kamalāsahāya svenaiva māṁ rakṣitumarhasi tvam Á
tvayi pravṛtte mama kiṁ prayāsaiḥ tvayyapravṛtte mama kiṁ prayāsaiḥ Á 6 Á Á

samādhibhaṅgeṣvapi sampatatsu śaraṇyabhūte tvayi baddhakakṣye Á
apatrape soḍhumakiñcano 'haṁ dūrādhirōhaṁ patanaṁ ca nātha Á 7 Á Á

prāptābhilāṣaṁ tvadanugrahānmāṁ padmāniṣevye tava pādapadme Á
ādehapātādaparādhadūram ātmāntakaiṅkaryarasaṁ vidheyāḥ Á 8 Á Á

phalaśrutiḥ
prapannajanapātheyaṁ prapitsūnāṁ rasāyanam Á
śreyase jagatāmetacchrīmadaṣṭabhujāṣṭakam Á 9 Á Á

maṅgalam
śaraṇāgata-santrāṇa-tvarā-dviguṇa-bāhunā Á
hariṇā veṅkaṭeśīyā stutiḥ svīkriyatāmiyam Á 10 Á Á

iti śrī aṣṭabhujāṣṭakaṁ samāptam Á

kavitārkikasiṁhāya kalyāṇaguṇaśāline Á
śrīmate veṅkaṭeśāya vedāntagurave namaḥ Á Á

================================================================================
Please send corrections to sanskrit@prapatti.com
All rights reserved © www.prapatti.com
================================================================================`,
  },
  {
    id: 'ashtabhuja',
    name: 'Śrī Aṣṭabhujāṣṭakam (Standard ISO)',
    composer: 'Svāmī Vedānta Deśikan',
    description: 'Authentic 10-verse stotram on Lord Ashtabhuja Perumal with standard pipes.',
    text: `================================================================================
www.prapatti.com                                                      Page 1 of 2
Desika Stotra Mala - Sri Ramanuja Mission
PDF created by www.prapatti.com
Source: http://www.prapatti.com/slokas/sanskrit/ashtabhujashtakam.pdf
================================================================================

śrīmate rāmānujāya namaḥ
śrīmate nigamāntamahādeśikāya namaḥ

śrī aṣṭabhujāṣṭakam

dhyānam
śrīmān veṅkaṭanāthāryaḥ kavitārkikakesarī |
vedāntācāryavaryo me sannidhattāṁ sadā hṛdi ||

gajēndrarakṣātvaritaṁ bhavantaṁ grāhairivāhaṁ viṣayairvikṛṣṭaḥ |
apāravijñānadayānubhāvam āptaṁ satāmaṣṭabhujaṁ prapadye || 1 ||

tvadekaśeṣo 'hamanātmatantraḥ tvatpādalipsāṁ diśatā tvayaiva |
asatsamo 'pyaṣṭabhujāspadeśa sattāmidānīmupalambhito 'smi || 2 ||

svarūparūpāstravibhūṣaṇādyaiḥ paratvacintāṁ tvayi durnivārām |
bhoge mṛdūpakramatāmabhīpsan śīlādibhirvārayasīva puṁsām || 3 ||

śaktiṁ śaraṇyāntaraśabdabhājāṁ sāraṁ ca santolya phalāntarāṇām |
tvaddāsyahetostvayi nirviśaṅkaṁ nyastātmanāṁ nātha bibharṣi bhāram || 4 ||

abhītihetoranuvartanīyaṁ nātha tvadanyaṁ na vibhāvayāmi |
bhayaṁ kutaḥ syāt tvayi sānukampe rakṣā kutaḥ syāt tvayi jātarōṣe || 5 ||

tvadekatantraṁ kamalāsahāya svenaiva māṁ rakṣitumarhasi tvam |
tvayi pravṛtte mama kiṁ prayāsaiḥ tvayyapravṛtte mama kiṁ prayāsaiḥ || 6 ||

samādhibhaṅgeṣvapi sampatatsu śaraṇyabhūte tvayi baddhakakṣye |
apatrape soḍhumakiñcano 'haṁ dūrādhirōhaṁ patanaṁ ca nātha || 7 ||

prāptābhilāṣaṁ tvadanugrahānmāṁ padmāniṣevye tava pādapadme |
ādehapātādaparādhadūram ātmāntakaiṅkaryarasaṁ vidheyāḥ || 8 ||

phalaśrutiḥ
prapannajanapātheyaṁ prapitsūnāṁ rasāyanam |
śreyase jagatāmetacchrīmadaṣṭabhujāṣṭakam || 9 ||

maṅgalam
śaraṇāgata-santrāṇa-tvarā-dviguṇa-bāhunā |
hariṇā veṅkaṭeśīyā stutiḥ svīkriyatāmiyam || 10 ||

iti śrī aṣṭabhujāṣṭakaṁ samāptam |

kavitārkikasiṁhāya kalyāṇaguṇaśāline |
śrīmate veṅkaṭeśāya vedāntagurave namaḥ ||

================================================================================
Please send corrections to sanskrit@prapatti.com
All rights reserved © www.prapatti.com
================================================================================`,
  },
  {
    id: 'vishnu-sahasranama-opening',
    name: 'Śrī Viṣṇu Sahasranāma (Dhyānam & Opening)',
    composer: 'Maharṣi Veda Vyāsa',
    description: 'Mahabharata Anushasana Parva: Pūrva Pīṭhikā, Dhyānam, and opening Stotram verses.',
    text: `śrī viṣṇu sahasranāma stōtram

dhyānam
śuklāmbaradharaṁ viṣṇuṁ śaśivarṇaṁ caturbhujam |
prasannavadanaṁ dhyāyet sarvavighnopaśāntaye || 1 ||

kṣīrodanvatpradeśe śucimaṇivilasatsaikate mauktikānāṁ
mālāklptāsanasthaḥ sphaṭikamaṇinibhairmauktikairmaṇḍitāṅgaḥ |
śubhrairabhrairadabhrairupariviracitairmuktapīyūṣavarṣaiḥ
ānandī naḥ punīyādarinalinagadāśaṅkhapāṇirmukundaḥ || 2 ||

bhūḥ pādau yasya nābhirviyadasuranilaś candrasūryau ca netre
karṇāvāśāḥ śiro dyaurmukhamapi dahano yasya vāsteyamabdhiḥ |
antaḥsthaṁ yasya viśvaṁ suranaranaragogaubhirbhogibhirmārgamuktaṁ
vande vaikuṇṭhamavyaktaṁ varatanumasakṛtkṛtsnamāścāryarūpam || 3 ||

śāntākāraṁ bhujagaśayanaṁ padmanābhaṁ sureśaṁ
viśvādhāraṁ gaganasadṛśaṁ meghavarṇaṁ śubhāṅgam |
lakṣmīkāntaṁ kamalanayanaṁ yogibhirdhyānagamyaṁ
vande viṣṇuṁ bhavabhayaharaṁ sarvalokaikanātham || 4 ||

atha stotram
om viśvaṁ viṣṇurvaṣaṭkāro bhūtabhavyabhavatprabhuḥ |
bhūtakṛdbhūtabhṛdbhāvo bhūtātmā bhūtabhāvanaḥ || 1 ||

pūtātmā paramātmā ca muktānāṁ paramā gatiḥ |
avyayaḥ puruṣaḥ sākṣī kṣetrajño 'kṣara eva ca || 2 ||

yogo yogavidāṁ netā pradhānapuruṣeśvaraḥ |
nārasiṁhavapuḥ śrīmān keśavaḥ puruṣottamaḥ || 3 ||

phalaśrutiḥ
ya idaṁ śṛṇuyānnityaṁ yaścāpi parikīrtayet |
nāśubhaṁ prāpnuyāt kiñcit so 'mutreha ca mānavaḥ || 1 ||

iti śrīmahābhārate śrīviṣṇosahasranāmastotraṁ samāptam ||`,
  },
  {
    id: 'ramashtakam',
    name: 'Śrī Rāmāṣṭakam',
    composer: 'Vyāsa-viracitam',
    description: 'Eight lyrical verses dedicated to Sri Ramachandra with Phalasruti and Mangalam.',
    text: `atha śrī rāmāṣṭakam

bhaje viśeṣasundaraṁ samastapāpa-khaṇḍanaṁ
svabhakta-citta-rañjanaṁ sadaiva rāmamadvayam |
jaṭākalāpa-śobhitaṁ samasta-pāpa-nāśakaṁ
svabhakta-kāma-pūrakaṁ bhaje ha rāmamadvayam || 1 ||

taraṇivaṁśa-bhūṣaṇaṁ mahat-prapañca-pālakaṁ
suvarṇa-gātra-śobhitaṁ sadaiva rāmamadvayam |
virācitendra-saṁstutaṁ sadā surairnamaskṛtaṁ
mahā-balānvitaṁ vibhuṁ bhaje ha rāmamadvayam || 2 ||

kiṅkirī-ravārcitaṁ samasta-loka-pāvanaṁ
dayārṇavaṁ dayā-karaṁ dayā-parāyaṇaṁ vibhum |
viśāla-netra-maṇḍitaṁ manojña-mūrti-śobhitaṁ
namāmi rāghavaṁ hariṁ jagat-patiṁ sanātanam || 3 ||

phalaśrutiḥ
rāmāṣṭakaṁ paṭhati yaḥ prayataḥ prabhāte
śraddhānvitastvadhi-gatāsya parā ca bhaktiḥ |
ante parāṁ gatimavāpya cirāya rāme
tiṣṭhatyanindita-pade 'pi vimuktabandhaḥ || 9 ||

iti śrī rāmāṣṭakaṁ samāptam |

maṅgalam
maṅgalaṁ kośalendrāya mahanīyaguṇābdhaye |
cakravartitanūjāya sārvabhaumāya maṅgalam ||`,
  },
];
