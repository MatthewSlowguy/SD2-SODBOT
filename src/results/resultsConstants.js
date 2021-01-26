/**
For each value, there's a header (bit counter, typically 5 bits), and a body (actual value, size(s) encoded in header):
Deck code fragment example, 33 units:

|bool   |bool   | division     | card count |income |units encoding         ||header  |unit       |transport  ||header  |unit       |transport  |...
|00001|1|00001|0|01000|10000110|00110|100001|00001|0|00010|00010|00010|01011||01|00|01|00111111100|00101011010||01|00|00|00010001101|01110011001|...
|1    |1|1    |0|8    |<   8  >|6    |<  6 >|1    |1|2    |2    |2    |11   || <  2+2+2+11+11                >||
|1 bit|T|1 bit|F|8 bit|division|6 bit|cards |1 bit|$|count|phase|xp   |unit || unit card                      ||

for comparison, 1 unit deck:
|bool   |bool   | division     |crd cnt|income |units encoding         ||headr|unit       |transport  || padding
|00001|1|00001|0|01000|10000110|00001|1|00001|0|00001|00001|00001|01011||1|0|1|01100011100|00000000000||00000000
|1    |1|1    |0|8    |<   8  >|1    |1|1    |1|1    |1    |1    |11   ||< 1+1+1+11+11               >||
  
*/

const alliesDivs = {
  "10000100": "2nd Guards",
  "100000100": "3rd Guards Tank",
  "10000110": "29th Tank Corps",
  "10010000": "3rd Guards Mech",
  "10010100": "Group Tyurin",
  "10010011": "Group Bezugly",
  "10010110": "9th Guards",
  "10001111": "26th Guards",
  "10010001": "44th Guards",
  "10001110": "184th Guards",
  "1000110": "3rd Us Armored",
  "10011001": "2e Blindee",
  "10011000": "15th Infantry",
  "1000010": "3rd Canadian Infantry",
  "100001110": "84th Gvard. Strelkovy",
  "100000101": "Armia Krajowa",
  "11111111": "1st Polish Infantry",
  "101100101": "358 Strelkovy",
  "101100000": "126th Strelki",
  "101011111": "Gruppa Vyborg",
  "110101111": "97th Guards",
  "110110100": "3rd VDV",
  "110110101": "7th Mech Corps",
  "110110110": "MGB",
  "100001000": "1st Pancerna",
  "1001110011": "6th Airborne",
  "1001110100": "2nd US Infantry"
};

const axisDivs = {
  "1000111": "5th Panzer",
  "10000111": "20th Panzer",
  "10011011": "21st Panzer",
  "10011010": "116th Panzer",
  "10011101": "Pz Lehr",
  "10001010": "Gruppe Harteneck",
  "100000011": "1st Skijager",
  "10001001": "78th Sturm",
  "10010101": "14th Infanterie",
  "10001000": "28th Jager",
  "10011100": "352nd Infantry",
  "10001011": "Koruck 559",
  "10001100": "1st Lovas",
  "10001101": "12th Tartalekos",
  "100001101": "25th Panzergrenadier",
  "100000110": "5 Panzer Wiking",
  "100000111": "Fallschrim Panzer H G",
  "101100100": "122 Infantry",
  "101011110": "Panssaridivisioona",
  "101100010": "Ryhma Raapppana",
  "110101110": "16th Panzer",
  "110110001": "1st Blindata",
  "110110010": "4th Munte",
  "110110011": "5th Cavalerie",
  "1001101111": "12th SS",
  "1001110000": "17th SS",
  "1001110010": "3rd FSJ"
};

const incomeLevel = {
  0: "None",
  1: "Very Low",
  2: "Low",
  3: "Normal",
  4: "High",
  5: "Very High"
};

//Need to double check this - why missing numbers?
const mode = {
  2: "Conquest",
  3: "Closer Combat",
  5: "Breakthrough"
};

const victory = {
  0: "Total Defeat",
  1: "Major Defeat",
  2: "Minor Defeat",
  3: "Draw",
  4: "Minor Victory",
  5: "Major Victory",
  6: "Total Victory"
};

const scoreLimit = {
  1000: "Low",
  2000: "Normal",
  4000: "High"
};

const map = {
  _3x2_Zbuczyn_LD_1v1: "Zbuczyn",
  _3x2_Zbuczyn_LD_1v1_CQC: "Zbuczyn",
  _3x2_Zbuczyn_LD_1v1_BKT: "Zbuczyn",
  _3x2_Ilomantsi_LD_1v1: "Ilomantsi",
  _3x2_Ilomantsi_LD_1v1_BKT: "Ilomantsi",
  _3x2_Ilomantsi_LD_1v1_CQC: "Ilomantsi",
  _3x2_Tali_Ihantala_LD_1v1: "Tali_Ihantala",
  _3x2_Tali_Ihantala_LD_1v1_BKT: "Tali_Ihantala",
  _3x2_Tali_Ihantala_LD_1v1_CQC: "Tali_Ihantala",
  _4x2_Vistula_Gora_Kalwaria_LD_1v1: "Gora_Kalwaria",
  _4x2_Vistula_Gora_Kalwaria_LD_1v1_BKT: "Gora_Kalwaria",
  _4x2_Vistula_Gora_Kalwaria_LD_1v1_CQC: "Gora_Kalwaria",
  _3x2_West_Brest_LD_1v1: "Brest_West",
  _3x2_West_Brest_LD_1v1_CQC: "Brest_West",
  _3x2_West_Brest_LD_1v1_BKT: "Brest_West",
  _3x2_West_Brest_LD_3v3: "Brest_West",
  _3x2_West_Brest_LD_3v3_CQC: "Brest_West",
  _3x2_West_Brest_LD_3v3_BKT: "Brest_West",
  _3x2_Siedlce_LD_1v1: "Siedlce",
  _3x2_Siedlce_LD_1v1_CQC: "Siedlce",
  _3x2_Siedlce_LD_1v1_BKT: "Siedlce",
  _2x2_Urban_River_Bobr_LD_1v1: "Bobr",
  _2x2_Urban_River_Bobr_LD_1v1_BKT: "Bobr",
  _2x2_Urban_River_Bobr_LD_1v1_CQC: "Bobr",
  _2x2_Ville_Centrale_Haroshaje_LD_1v1: "Haroshaje",
  _2x2_Ville_Centrale_Haroshaje_LD_1v1_BKT: "Haroshaje",
  _2x2_Ville_Centrale_Haroshaje_LD_1v1_CQC: "Haroshaje",
  _2x2_River_Swamp_Krupa_LD_1v1: "Krupa",
  _2x2_River_Swamp_Krupa_LD_1v1_BKT: "Krupa",
  _2x2_River_Swamp_Krupa_LD_1v1_CQC: "Krupa",
  _2x2_Lenina_LD_1v1: "Lenina",
  _2x2_Lenina_LD_1v1_BKT: "Lenina",
  _2x2_Lenina_LD_1v1_CQC: "Lenina",
  _2x2_Plateau_Central_Orsha_E_LD_1v1: "Orsha_East",
  _2x2_Plateau_Central_Orsha_E_LD_1v1_BKT: "Orsha_East",
  _2x2_Plateau_Central_Orsha_E_LD_1v1_CQC: "Orsha_East",
  _2x1_Proto_levelBuild_Orsha_N_LD_1v1: "Orsha_North",
  _2x1_Proto_levelBuild_Orsha_N_LD_1v1_BKT: "Orsha_North",
  _2x1_Proto_levelBuild_Orsha_N_LD_1v1_CQC: "Orsha_North",
  _2x2_Ostrowno_LD_1v1: "Ostrowno",
  _2x2_Ostrowno_LD_1v1_BKT: "Ostrowno",
  _2x2_Ostrowno_LD_1v1_CQC: "Ostrowno",
  _2x2_Shchedrin_LD_1v1: "Shchedrin",
  _2x2_Shchedrin_LD_1v1_BKT: "Shchedrin",
  _2x2_Shchedrin_LD_1v1_CQC: "Shchedrin",
  _2x2_Lacs_Sianno_LD_1v1: "Sianno",
  _2x2_Lacs_Sianno_LD_1v1_BKT: "Sianno",
  _2x2_Lacs_Sianno_LD_1v1_CQC: "Sianno",
  _2x2_Slutsk_E_LD_1v1: "Slutsk_East",
  _2x2_Slutsk_E_LD_1v1_BKT: "Slutsk_East",
  _2x2_Slutsk_E_LD_1v1_CQC: "Slutsk_East",
  _2x2_Slutsk_W_LD_1v1: "Slutsk_West",
  _2x2_Slutsk_W_LD_1v1_BKT: "Slutsk_West",
  _2x2_Slutsk_W_LD_1v1_CQC: "Slutsk_West",
  _2x2_Slutsk_LD_1v1: "Slutsk",
  _2x2_Slutsk_LD_1v1_BKT: "Slutsk",
  _2x2_Slutsk_LD_1v1_CQC: "Slutsk",
  _2x2_Foret_Tsel_LD_1v1: "Tsel",
  _2x2_Foret_Tsel_LD_1v1_BKT: "Tsel",
  _2x2_Foret_Tsel_LD_1v1_CQC: "Tsel",
  _3x2_Highway_LD_CQC: "Autobahn_Zur_Holle",
  _3x2_Highway_LD_CQC_BKT: "Autobahn_Zur_Holle",
  _3x2_Highway_LD_CQC_CQC: "Autobahn_Zur_Holle",
  _3x2_Beshankovichy_LD_2v2: "Beshankovichy",
  _3x2_Beshankovichy_LD_2v2_BKT: "Beshankovichy",
  _3x2_Beshankovichy_LD_2v2_CQC: "Beshankovichy",
  _3x2_West_Bobrujsk_LD_2v2: "Bobrujsk_West",
  _3x2_West_Bobrujsk_LD_2v2_BKT: "Bobrujsk_West",
  _3x2_West_Bobrujsk_LD_2v2_CQC: "Bobrujsk_West",
  _3x2_West_Brest_LD_2v2: "Brest_West2",
  _3x2_West_Brest_LD_2v2_CQC: "Brest_West2",
  _3x2_West_Brest_LD_2v2_BKT: "Brest_West2",
  _3x2_Lenina_LD_2v2: "Lenina2",
  _3x2_Lenina_LD_2v2_CQC: "Lenina2",
  _3x2_Lenina_LD_2v2_BKT: "Lenina2",
  _3x2_Astrouna_Novka_LD_2v2: "Novka",
  _3x2_Astrouna_Novka_LD_2v2_CQC: "Novka",
  _3x2_Astrouna_Novka_LD_2v2_BKT: "Novka",
  _3x2_Ostrowno_LD_2v2: "Ostrowno2",
  _3x2_Ostrowno_LD_2v2_BKT: "Ostrowno2",
  _3x2_Ostrowno_LD_2v2_CQC: "Ostrowno2",
  _3x2_Shchedrin_LD_2v2: "Shchedrin2",
  _3x2_Shchedrin_LD_2v2_CQC: "Shchedrin2",
  _3x2_Shchedrin_LD_2v2_BKT: "Shchedrin2",
  _3x2_Slutsk_LD_2v2: "Slutsk2",
  _3x2_Slutsk_LD_2v2_CQC: "Slutsk2",
  _3x2_Slutsk_LD_2v2_BKT: "Slutsk2",
  _3x2_Veselovo_LD_2v2: "Veselovo",
  _3x2_Veselovo_LD_2v2_CQC: "Veselovo",
  _3x2_Veselovo_LD_2v2_BKT: "Veselovo",
  _3x2_East_Vitebsk_LD_2v2: "Vitebsk_East",
  _3x2_East_Vitebsk_LD_2v2_CQC: "Vitebsk_East",
  _3x2_East_Vitebsk_LD_2v2_BKT: "Vitebsk_East",
  _3x2_Urban_roads_Krupki_LD_3v3: "Krupki",
  _3x2_Urban_roads_Krupki_LD_3v3_CQC: "Krupki",
  _3x2_Urban_roads_Krupki_LD_3v3_BKT: "Krupki",
  _3x2_Lenina_LD_3v3: "Lenina3",
  _3x2_Lenina_LD_3v3_CQC: "Lenina3",
  _3x2_Lenina_LD_3v3_BKT: "Lenina3",
  _3x2_Lipen_LD_3v3: "Lipen",
  _3x2_Lipen_LD_3v3_BKT: "Lipen",
  _3x2_Lipen_LD_3v3_CQC: "Lipen",
  _3x2_Lyakhavichy_LD_3v3: "Lyakhavichy",
  _3x2_Lyakhavichy_LD_3v3_BKT: "Lyakhavichy",
  _3x2_Lyakhavichy_LD_3v3_CQC: "Lyakhavichy",
  _3x2_Zbuczyn_LD_2v2: "Zbuczyn2",
  _3x2_Zbuczyn_LD_2v2: "Zbuczyn2",
  _3x2_Zbuczyn_LD_2v2: "Zbuczyn2",
  _3x2_Mogilev_LD_3v3: "Mogilev",
  _3x2_Mogilev_LD_3v3_BKT: "Mogilev",
  _3x2_Mogilev_LD_3v3_CQC: "Mogilev",
  _3x2_Marecages_Naratch_lake_LD_3v3: "Naratch_Lake",
  _3x2_Marecages_Naratch_lake_LD_3v3_BKT: "Naratch_Lake",
  _3x2_Marecages_Naratch_lake_LD_3v3_CQC: "Naratch_Lake",
  _3x2_Ostrowno_LD_3v3: "Ostrowno3",
  _3x2_Ostrowno_LD_3v3_BKT: "Ostrowno3",
  _3x2_Ostrowno_LD_3v3_CQC: "Ostrowno3",
  _3x2_Rivers_Pleshchenitsy_S_LD_3v3: "Pleshchenitsy_South",
  _3x2_Rivers_Pleshchenitsy_S_LD_3v3_CQC: "Pleshchenitsy_South",
  _3x2_Rivers_Pleshchenitsy_S_LD_3v3_BKT: "Pleshchenitsy_South",
  _3x2_Shchedrin_LD_3v3: "Shchedrin3",
  _3x2_Shchedrin_LD_3v3_CQC: "Shchedrin3",
  _3x2_Shchedrin_LD_3v3_BKT: "Shchedrin3",
  _3x2_Slutsk_LD_3v3: "Slutsk3",
  _3x2_Slutsk_LD_3v3_CQC: "Slutsk3",
  _3x2_Slutsk_LD_3V3_BKT: "Slutsk3",
  _3x2_Bridges_Smolyany_LD_3v3: "Smolyany",
  _3x2_Bridges_Smolyany_LD_3v3_CQC: "Smolyany",
  _3x2_Bridges_Smolyany_LD_3v3_BKT: "Smolyany",
  _3x2_West_Brest_LD_3v3: "Brest_West3",
  _3x2_West_Brest_LD_3v3_CQC: "Brest_West3",
  _3x2_West_Brest_LD_3v3_BKT: "Brest_West3",
  _3x2_Siedlce_LD_2v2: "Siedlce",
  _3x2_Siedlce_LD_2v2_BKT: "Siedlce",
  _3x2_Siedlce_LD_2v2_CQC: "Siedlce",
  _4x2_Lenina_LD_4v4: "Lenina4",
  _4x2_Lenina_LD_4v4_CQC: "Lenina4",
  _4x2_Lenina_LD_4v4_BKT: "Lenina4",
  _3x2_Ostrowno_LD_4v4: "Ostrowno4",
  _3x2_Ostrowno_LD_4v4_BKT: "Ostrowno4",
  _3x2_Ostrowno_LD_4v4_CQC: "Ostrowno4",
  _3x2_Shchedrin_LD_4v4: "Shchedrin4",
  _3x2_Shchedrin_LD_4v4_CQC: "Shchedrin4",
  _3x2_Shchedrin_LD_4v4_BKT: "Shchedrin4",
  _4x2_Slutsk_LD_4v4: "Slutsk4",
  _4x2_Slutsk_LD_4v4_CQC: "Slutsk4",
  _4x2_Slutsk_LD_4v4_BKT: "Slutsk4",
  _4x2_Vistula_Gora_Kalwaria_LD_4v4: "Gora_Kalwaria4",
  _4x2_Vistula_Gora_Kalwaria_LD_4v4_CQC: "Gora_Kalwaria4",
  _4x2_Vistula_Gora_Kalwaria_LD_4v4_BKT: "Gora_Kalwaria4"
};

module.exports = {
  alliesDivs,
  axisDivs,
  incomeLevel,
  mode,
  victory,
  scoreLimit,
  map
};
