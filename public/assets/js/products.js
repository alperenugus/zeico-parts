/* Zeico catalog data — edit this file to manage products, prices and reviews.
 * price: EUR, excl. VAT. Use null to show "Ask for price".
 * stock: 'in' | 'low' | 'order'
 * IMPORTANT: prices and reviews below are SAMPLE DATA — replace with real values before going live.
 */
window.CATEGORIES = [
  { id: 'injectors', img: '/assets/img/cat-injectors.webp', tr: 'Enjektörler', en: 'Injectors',
    dtr: 'Common rail, pompa-enjektör ve mekanik', den: 'Common rail, unit & mechanical' },
  { id: 'spare', img: '/assets/img/cat-spare.webp', tr: 'Meme & Yedek Parça', en: 'Nozzles & Spare Parts',
    dtr: 'Meme, iğne, gövde, somun', den: 'Nozzle, needle, body, nut' },
  { id: 'valves', img: '/assets/img/valve-delphi-9308.webp', tr: 'Valfler', en: 'Valves',
    dtr: 'Kontrol valfleri ve plakalar', den: 'Control valves & plates' },
  { id: 'seals', img: '/assets/img/cat-orings.webp', tr: 'O-Ring & Contalar', en: 'O-Rings & Seals',
    dtr: 'Yakıt sistemi, yüksek basınç, setler', den: 'Fuel system, high pressure, kits' },
  { id: 'shims', img: '/assets/img/cat-shims.webp', tr: 'Şimler', en: 'Shims',
    dtr: 'Kalibrasyon ve ayar şimleri', den: 'Calibration & adjustment shims' },
  { id: 'other', img: '/assets/img/cat-other.webp', tr: 'Pompa & Diğer', en: 'Pumps & Other',
    dtr: 'Pompalar, sensörler, konnektörler, kitler', den: 'Pumps, sensors, connectors, kits' }
];

window.PRODUCTS = [
  { id: 'bosch-0445116059', cat: 'injectors', brand: 'Bosch', pn: '0445116059', price: 289, oldPrice: 329, stock: 'in', tag: 'best', featured: true,
    img: ['/assets/img/inj-bosch-0445116059.webp'],
    tr: { name: 'Common Rail Piezo Enjektör', desc: 'Bosch piezo common rail enjektör. Yüksek basınçlı dizel motorlar için hassas püskürtme, düşük emisyon ve uzun servis ömrü.' },
    en: { name: 'Common Rail Piezo Injector', desc: 'Bosch piezo common rail injector. Precise atomisation, lower emissions and long service life for high-pressure diesel engines.' },
    specs: [['type', 'Piezo CR'], ['system', 'Common Rail'], ['quality', { tr: 'Orijinal / Yenilenmiş', en: 'Original / Remanufactured' }]] },

  { id: 'bosch-0445110351', cat: 'injectors', brand: 'Bosch', pn: '0445110351', price: 219, stock: 'in', featured: true,
    img: ['/assets/img/inj-opar-351.webp'],
    tr: { name: 'Common Rail Enjektör (Solenoid)', desc: 'Solenoid valfli Bosch common rail enjektör. Binek ve hafif ticari dizel uygulamalar için.' },
    en: { name: 'Common Rail Injector (Solenoid)', desc: 'Solenoid-valve Bosch common rail injector for passenger car and light commercial diesel applications.' },
    specs: [['type', 'Solenoid CR'], ['system', 'Common Rail'], ['quality', { tr: 'Orijinal', en: 'Original' }]] },

  { id: 'delphi-cr-set', cat: 'injectors', brand: 'Delphi', pn: 'EJBR-SET', price: 245, stock: 'low', tag: 'new', featured: true,
    img: ['/assets/img/inj-delphi-set.webp', '/assets/img/valve-delphi-9308.webp'],
    tr: { name: 'Delphi Common Rail Enjektör & Meme', desc: 'Delphi common rail enjektör ve uyumlu meme. Kalibre edilmiş, test edilmiş ve kullanıma hazır.' },
    en: { name: 'Delphi Common Rail Injector & Nozzle', desc: 'Delphi common rail injector with matching nozzle. Calibrated, tested and ready to fit.' },
    specs: [['type', 'Solenoid CR'], ['system', 'Common Rail'], ['quality', { tr: 'OEM eşdeğeri', en: 'OEM equivalent' }]] },

  { id: 'mech-injector-hd', cat: 'injectors', brand: 'Bosch', pn: 'KBEL-HD', price: 159, stock: 'in', featured: true,
    img: ['/assets/img/inj-mb-classic.webp', '/assets/img/inj-mb-classic-2.webp', '/assets/img/inj-mb-classic-3.webp'],
    tr: { name: 'Mekanik Dizel Enjektör (Ağır Vasıta)', desc: 'Kamyon, otobüs ve iş makineleri için mekanik (pompa-meme) dizel enjektör. Dayanıklı gövde, yüksek debi.' },
    en: { name: 'Mechanical Diesel Injector (Heavy Duty)', desc: 'Mechanical (pump-nozzle) diesel injector for trucks, buses and construction machinery. Robust body, high flow.' },
    specs: [['type', { tr: 'Mekanik', en: 'Mechanical' }], ['system', { tr: 'Sıra tipi pompa', en: 'Inline pump' }], ['app', { tr: 'Ağır vasıta', en: 'Heavy duty' }]] },

  { id: 'delphi-9308-621c', cat: 'valves', brand: 'Delphi', pn: '9308-621C', price: 39, oldPrice: 46, stock: 'in', tag: 'best', featured: true,
    img: ['/assets/img/valve-delphi-9308.webp', '/assets/img/spare-mix.webp'],
    tr: { name: 'Enjektör Kontrol Valfi', desc: 'Delphi common rail enjektörler için kontrol valfi. Hassas işlenmiş yüzeyler, sızdırmaz çalışma.' },
    en: { name: 'Injector Control Valve', desc: 'Control valve for Delphi common rail injectors. Precision-machined surfaces for leak-free operation.' },
    specs: [['system', 'Delphi CR'], ['material', { tr: 'Sertleştirilmiş çelik', en: 'Hardened steel' }], ['quality', { tr: 'OEM eşdeğeri', en: 'OEM equivalent' }]] },

  { id: 'valve-plate-cr', cat: 'valves', brand: 'Delphi', pn: 'VP-28', price: 24, stock: 'in',
    img: ['/assets/img/valve-plate.webp'],
    tr: { name: 'Valf Plakası (Ara Plaka)', desc: 'Common rail enjektör valf plakası. Doğru basınç kontrolü için mikron hassasiyetinde üretim.' },
    en: { name: 'Valve Plate (Intermediate Plate)', desc: 'Common rail injector valve plate. Micron-precision manufacturing for accurate pressure control.' },
    specs: [['system', 'Common Rail'], ['material', { tr: 'Takım çeliği', en: 'Tool steel' }]] },

  { id: 'valve-cap-h', cat: 'valves', brand: 'Bosch', pn: 'F00V-C', price: 29, stock: 'low',
    img: ['/assets/img/valve-cap.webp'],
    tr: { name: 'Kontrol Valf Seti (Kapak)', desc: 'Bosch common rail enjektörler için valf kapağı ve bilye seti.' },
    en: { name: 'Control Valve Set (Cap)', desc: 'Valve cap and ball set for Bosch common rail injectors.' },
    specs: [['system', 'Bosch CR'], ['quality', { tr: 'OEM eşdeğeri', en: 'OEM equivalent' }]] },

  { id: 'nozzle-cr', cat: 'spare', brand: 'Bosch', pn: 'DLLA-SERIES', price: 34, stock: 'in', featured: true,
    img: ['/assets/img/cat-spare.webp'],
    tr: { name: 'Common Rail Enjektör Memesi (Nozzle)', desc: 'DLLA / DSLA serisi common rail memeleri. Uygulamaya göre doğru meme kodunu birlikte belirleyelim.' },
    en: { name: 'Common Rail Injector Nozzle', desc: 'DLLA / DSLA series common rail nozzles. We help you determine the right nozzle code for your application.' },
    specs: [['system', 'Common Rail'], ['series', 'DLLA / DSLA']] },

  { id: 'nozzle-nut', cat: 'spare', brand: 'Delphi', pn: 'NN-3601', price: 19, stock: 'in',
    img: ['/assets/img/nozzle-nut.webp'],
    tr: { name: 'Enjektör Meme Somunu / Gövde', desc: 'Lazer kodlu enjektör meme somunu. Yüksek basınca dayanıklı, hassas tolerans.' },
    en: { name: 'Injector Nozzle Nut / Body', desc: 'Laser-coded injector nozzle nut. High-pressure resistant with tight tolerances.' },
    specs: [['material', { tr: 'Çelik', en: 'Steel' }], ['system', 'Common Rail']] },

  { id: 'actuator', cat: 'spare', brand: 'Delphi', pn: 'ACT-CR', price: 49, stock: 'order',
    img: ['/assets/img/actuator.webp'],
    tr: { name: 'Enjektör Aktüatörü / Solenoid', desc: 'Common rail enjektör aktüatörü (solenoid bobin). Hızlı tepki süresi, stabil performans.' },
    en: { name: 'Injector Actuator / Solenoid', desc: 'Common rail injector actuator (solenoid coil). Fast response time, stable performance.' },
    specs: [['type', 'Solenoid'], ['system', 'Common Rail']] },

  { id: 'spare-assortment', cat: 'spare', brand: 'Zeico', pn: 'ZK-SPARE', price: 129, stock: 'in', tag: 'kit',
    img: ['/assets/img/spare-mix.webp', '/assets/img/actuator.webp', '/assets/img/valve-plate.webp'],
    tr: { name: 'Enjektör Yedek Parça Seti', desc: 'Valf, plaka, somun ve aktüatörden oluşan atölye seti. Sık kullanılan parçaları tek pakette bulundurun.' },
    en: { name: 'Injector Spare Parts Assortment', desc: 'Workshop set including valve, plate, nut and actuator. Keep frequently used parts in a single pack.' },
    specs: [['content', { tr: 'Çoklu parça', en: 'Multi-part' }], ['app', { tr: 'Atölye', en: 'Workshop' }]] },

  { id: 'oring-kit', cat: 'seals', brand: 'Zeico', pn: 'ZK-OR-200', price: 22, stock: 'in', tag: 'kit', featured: true,
    img: ['/assets/img/cat-orings.webp'],
    tr: { name: 'O-Ring & Conta Seti (Yakıt Sistemi)', desc: 'Yakıta dayanıklı Viton/NBR O-ring, bakır pul ve conta seti. Sızdırmaz çalışma ve uzun ömür.' },
    en: { name: 'O-Ring & Seal Kit (Fuel System)', desc: 'Fuel-resistant Viton/NBR O-rings, copper washers and seals. Leak-free operation and long life.' },
    specs: [['material', 'Viton / NBR / Cu'], ['content', { tr: 'Karışık ölçü', en: 'Assorted sizes' }]] },

  { id: 'hp-seals', cat: 'seals', brand: 'Zeico', pn: 'ZK-HPS', price: 14, stock: 'in',
    img: ['/assets/img/cat-orings.webp'],
    tr: { name: 'Yüksek Basınç Conta Seti', desc: 'Enjektör yuvası için yüksek basınç ve sıcaklığa dayanıklı conta ve pullar.' },
    en: { name: 'High-Pressure Seal Set', desc: 'Seals and washers for the injector seat, resistant to high pressure and temperature.' },
    specs: [['material', 'Viton / Cu'], ['system', 'Common Rail']] },

  { id: 'shim-kit', cat: 'shims', brand: 'Zeico', pn: 'ZK-SHIM-100', price: 36, stock: 'in', tag: 'kit', featured: true,
    img: ['/assets/img/cat-shims.webp'],
    tr: { name: 'Kalibrasyon Şim Seti', desc: 'Enjektör ayarı için hassas kalınlıklarda şim seti. Optimum motor performansı için doğru ayar.' },
    en: { name: 'Calibration Shim Kit', desc: 'Shim kit in precise thicknesses for injector adjustment. Accurate setting for optimum engine performance.' },
    specs: [['content', { tr: 'Çeşitli ölçüler', en: 'Various sizes' }], ['material', { tr: 'Çelik / Bakır', en: 'Steel / Copper' }]] },

  { id: 'delphi-7135-108', cat: 'other', brand: 'Delphi', pn: '7135-108', price: 18, stock: 'in',
    img: ['/assets/img/kit-7135-108.webp'],
    tr: { name: 'Pompa Tamir Kiti 7135-108', desc: 'Delphi dizel pompa tamir kiti: plakalar ve yaylar.' },
    en: { name: 'Pump Repair Kit 7135-108', desc: 'Delphi diesel pump repair kit: plates and springs.' },
    specs: [['content', { tr: 'Plaka + yay', en: 'Plates + springs' }]] },

  { id: 'delphi-7135-476', cat: 'other', brand: 'Delphi', pn: '7135-476', price: 16, stock: 'low',
    img: ['/assets/img/kit-7135-476.webp'],
    tr: { name: 'Pompa Tamir Kiti 7135-476', desc: 'Delphi dizel pompa tamir kiti: pabuç, yaylar ve pim.' },
    en: { name: 'Pump Repair Kit 7135-476', desc: 'Delphi diesel pump repair kit: shoe, springs and pin.' },
    specs: [['content', { tr: 'Pabuç + yay + pim', en: 'Shoe + springs + pin' }]] },

  { id: 'bosch-cp4', cat: 'other', brand: 'Bosch', pn: 'CP4-0445010', price: null, stock: 'order', featured: true,
    img: ['/assets/img/pump-bosch.webp', '/assets/img/pump-iveco.webp'],
    tr: { name: 'Yüksek Basınç Yakıt Pompası (CP4)', desc: 'Bosch CP4 common rail yüksek basınç pompası. Uygulamanıza göre fiyat ve stok için bize ulaşın.' },
    en: { name: 'High-Pressure Fuel Pump (CP4)', desc: 'Bosch CP4 common rail high-pressure pump. Contact us for pricing and stock for your application.' },
    specs: [['system', 'Common Rail'], ['type', 'CP4']] },

  { id: 'iveco-pump', cat: 'other', brand: 'Bosch', pn: 'CP4-IVECO', price: null, stock: 'order',
    img: ['/assets/img/pump-iveco.webp'],
    tr: { name: 'Iveco Yakıt Pompası', desc: 'Iveco uygulamaları için common rail yüksek basınç yakıt pompası.' },
    en: { name: 'Iveco Fuel Pump', desc: 'Common rail high-pressure fuel pump for Iveco applications.' },
    specs: [['system', 'Common Rail'], ['app', 'Iveco']] }
];

window.SPEC_LABELS = {
  tr: { type: 'Tip', system: 'Sistem', quality: 'Kalite', app: 'Uygulama', material: 'Malzeme', series: 'Seri', content: 'İçerik' },
  en: { type: 'Type', system: 'System', quality: 'Quality', app: 'Application', material: 'Material', series: 'Series', content: 'Contents' }
};

window.TAGS = {
  best: { tr: 'Çok satan', en: 'Best seller' },
  new: { tr: 'Yeni', en: 'New' },
  kit: { tr: 'Set', en: 'Kit' }
};

/* SAMPLE testimonials — replace with genuine customer feedback before launch. */
window.REVIEWS = [
  { name: 'M. K.', role: { tr: 'Enjektör Servisi • Almanya', en: 'Injector Workshop • Germany' }, rating: 5,
    tr: 'Kontrol valfi ve meme siparişlerimiz her seferinde eksiksiz ve hızlı ulaştı. Parça numarası eşleştirmede çok yardımcı oluyorlar.',
    en: 'Our control valve and nozzle orders always arrive complete and fast. They are very helpful with part number matching.' },
  { name: 'A. R.', role: { tr: 'Yedek Parça Distribütörü • Irak', en: 'Parts Distributor • Iraq' }, rating: 5,
    tr: 'Rekabetçi fiyat ve aynı gün sevkiyat bizim için büyük avantaj. Ekip her zaman ulaşılabilir.',
    en: 'Competitive pricing and same-day shipping are a big advantage for us. The team is always reachable.' },
  { name: 'S. D.', role: { tr: 'Filo Bakım Müdürü • İstanbul', en: 'Fleet Maintenance Manager • Istanbul' }, rating: 5,
    tr: 'Ağır vasıta filomuz için mekanik enjektörleri Zeico\'dan alıyoruz. Kalite ve dayanıklılıktan çok memnunuz.',
    en: 'We buy mechanical injectors for our heavy-duty fleet from Zeico. Very happy with the quality and durability.' },
  { name: 'J. P.', role: { tr: 'Dizel Atölyesi • Polonya', en: 'Diesel Workshop • Poland' }, rating: 4,
    tr: 'O-ring ve şim setleri atölyemizin vazgeçilmezi oldu. Paketleme çok özenli.',
    en: 'Their O-ring and shim kits have become essentials in our workshop. Packaging is very careful.' }
];
