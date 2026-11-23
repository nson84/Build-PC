import { concept, type Category, type Concept } from '../concept.ts';
import type { LevelId } from '../levels.ts';
import type { SourceId } from '../sources.ts';

/**
 * Inside the memory modules.
 *
 * Two retail modules from one line, chosen so the only difference between
 * them is the generation: the Kingston FURY Beast DDR5-6000 16 GB
 * (KF560C36BBE-16) that is installed in the machine, and the FURY Beast
 * DDR4-3200 16 GB (KF432C16BB/16) beside it for comparison. Both are single
 * rank, built from eight 16 Gb x8 packages.
 *
 * Each branch dives five scales: module, package, die, bank and cell.
 * The generations differ most at the module and the die; a DDR4 bank and
 * cell are the DDR5 ones with the numbers that differ swapped in (see the end
 * of this file).
 *
 * Kingston builds the modules; it buys the DRAM from the chip makers and does
 * not name them, so the package and die scales follow Micron's data sheets
 * for the same organisation and stay otherwise vendor-neutral.
 */

type Entry = Parameters<typeof concept>[0];
const make = (c: Entry) => concept(c);

// ── Accuracy statements ───────────────────────────────────────────────────

const moduleAccuracy = (product: string) =>
  `${product}: chiều dài, chiều cao tính cả tản nhiệt, độ dày, khoảng cách chân 0.85 mm và số lượng 288 chân tiếp xúc tuân theo chuẩn JEDEC và tài liệu kỹ thuật của hãng. Vị trí linh kiện, linh kiện thụ động, độ lệch chính xác của rãnh khóa và các đường vát tản nhiệt mang tính minh họa.`;
const ddr5Module = moduleAccuracy('Kingston FURY Beast DDR5 KF560C36BBE-16');
const ddr4Module = moduleAccuracy('Kingston FURY Beast DDR4 KF432C16BB/16');
const packageAccuracy =
  'Số lượng bi hàn, bước chân 0.8 mm, ma trận 13 × (3 + 3) với các cột trống ở giữa và kích thước thân 7.5 × 11 mm tuân theo bản vẽ FBGA của hãng sản xuất DRAM. Độ dày được vẽ phóng đại 2.5 lần; kích thước die, số lượng đệm hàn, dây nối và độ dày các lớp mang tính minh họa.';
const dieAccuracy =
  'Số lượng và tính năng theo tài liệu kỹ thuật. Kích thước và vị trí các khối mang tính minh họa: bố cục die thực tế do hãng thiết kế và không công bố.';
const bankAccuracy =
  'Hệ thống phân cấp tuân theo các nghiên cứu kiến trúc DRAM đã công bố. Một bank 16 Gb thực tế chứa 65,536 hàng trong các mảng con khoảng 512 hàng mỗi mảng; hình vẽ minh họa 6 mảng con gồm 6 mat.';
const cellAccuracy =
  'Sơ đồ nguyên lý, không phải bố cục vật lý: các ô nhớ hiện đại được xếp so le với đường wordline chìm và tụ điện hình trụ cao. Hình vẽ minh họa 48 ô nhớ trong một mat chứa hàng trăm nghìn ô.';

// ── Shared module parts, per generation ───────────────────────────────────

type Gen = 'ddr5' | 'ddr4';
const moduleIds = {
  ddr5: {
    level: 'dimm',
    parent: 'ram',
    board: 'dimmboard',
    chip: 'dramchip',
    spd: 'dimmspd',
    decap: 'dimmdecap',
    contacts: 'dimmcontacts',
    pad: 'dimmpad',
    spreader: 'dimmspreader',
    spreaderBack: 'dimmspreaderback',
    open: 'dram',
  },
  ddr4: {
    level: 'ddr4',
    parent: 'ddr4module',
    board: 'ddr4board',
    chip: 'ddr4chip',
    spd: 'ddr4spd',
    decap: 'ddr4decap',
    contacts: 'ddr4contacts',
    pad: 'ddr4pad',
    spreader: 'ddr4spreader',
    spreaderBack: 'ddr4spreaderback',
    open: 'ddr4dram',
  },
} as const;

function moduleParts(gen: Gen): Concept[] {
  const id = moduleIds[gen];
  const five = gen === 'ddr5';
  const level = id.level as LevelId;
  const parent = id.parent;
  const accuracy = five ? ddr5Module : ddr4Module;
  const product: SourceId = five ? 'kf560' : 'kf432';
  const family: SourceId = five ? 'kingstonfury' : 'kingstonddr4';
  return [
    make({
      id: id.board,
      name: 'Bo mạch mô-đun',
      shortName: 'Bo mạch mô-đun',
      category: 'Board',
      parent,
      level,
      description: five
        ? 'Bo mạch nhiều lớp dài 133.35 mm và cao 31.25 mm, có rãnh khóa DDR5, khuyết ngàm khóa ở hai đầu và cạnh chân tiếp xúc thẳng.'
        : 'Bo mạch nhiều lớp dài 133.35 mm và cao 31.25 mm, có rãnh khóa DDR4, khuyết ngàm khóa ở hai đầu và cạnh chân tiếp xúc hơi cong xuống ở giữa.',
      purpose: five
        ? 'Dẫn hai kênh phụ 32-bit độc lập từ chân tiếp xúc tới các chip DRAM, đồng thời đưa nguồn 5 V vào mạch ổn áp ở chính giữa.'
        : 'Dẫn một kênh 64-bit từ chân tiếp xúc tới các chip DRAM, và đưa bus lệnh đi qua cả tám chip theo chuỗi nối tiếp (fly-by).',
      quantity: '1 bo mạch',
      specifications: {
        'Kích thước': '133.35 × 31.25 mm (JEDEC)',
        'Độ dày': 'Khoảng 1.27 mm',
        'Bố trí chip': 'Tám chip ở mặt trước; mặt sau để trống',
        'Ký hiệu': five ? 'PC5-48000 · 1Rx8' : 'PC4-25600 · 1Rx8',
      },
      representationType: 'physical',
      physicalAccuracy: accuracy,
      sources: five
        ? ['jedecmo329', 'micronudimm', product]
        : ['kingstonddr4', product],
      searchTerms: [
        'dimm',
        'udimm',
        'module',
        'pcb',
        'board',
        'bo mạch',
        'mô-đun',
        gen,
      ],
    }),
    make({
      id: id.chip,
      name: five ? 'Chip đóng gói DDR5 DRAM' : 'Chip đóng gói DDR4 DRAM',
      shortName: 'Chip DRAM',
      category: 'Memory',
      parent,
      level,
      open: id.open as LevelId,
      description: five
        ? 'Tám chip 16 Gb x8 trong một rank. Bốn chip bên trái thuộc kênh phụ A và bốn chip bên phải thuộc kênh phụ B; mỗi kênh phụ có tín hiệu chọn chip và bus lệnh riêng.'
        : 'Tám chip 16 Gb x8 trong một rank, cùng nằm trên một kênh 64-bit: mỗi chip cung cấp 8 trong số 64 bit dữ liệu ở mỗi lần truyền.',
      purpose: five
        ? 'Lưu trữ các bit dữ liệu. Một lần đọc trên một kênh phụ thực hiện 16 lượt truyền 32 bit từ bốn chip: 64 byte, bằng đúng một dòng cache của CPU.'
        : 'Lưu trữ các bit dữ liệu. Một lần đọc thực hiện 8 lượt truyền 64 bit từ cả tám chip: 64 byte, bằng đúng một dòng cache của CPU.',
      quantity: '8 chip',
      specifications: {
        'Tổ chức': '2G × 8 mỗi chip · 16 Gb',
        'Đóng gói': '78-ball FBGA · 7.5 × 11 mm',
        Rank: 'Single rank (1Rx8)',
        'Độ rộng': five ? '2 × kênh phụ 32-bit' : '1 × kênh 64-bit',
      },
      representationType: 'physical',
      physicalAccuracy: accuracy,
      sources: five
        ? [product, 'micronudimm', 'micron16gbddr5', 'ddr5architecture']
        : [product, 'micron16gbddr4'],
      searchTerms: [
        'dram',
        'chip',
        'package',
        'fbga',
        'x8',
        'rank',
        'đóng gói',
        gen,
      ],
    }),
    make({
      id: id.spd,
      name: five ? 'Chip SPD hub' : 'Chip SPD EEPROM',
      shortName: five ? 'SPD hub' : 'SPD',
      category: 'Board',
      parent,
      level,
      description: five
        ? 'Một bộ điều khiển nhỏ lưu hồ sơ 1,024 byte của thanh RAM, tích hợp cảm biến nhiệt độ, giao tiếp qua bus phụ của mô-đun.'
        : 'Một bộ nhớ EEPROM nối tiếp lưu hồ sơ của thanh RAM trên nguồn cấp 2.2–3.6 V riêng.',
      purpose:
        'Thông báo cho firmware khi khởi động biết thông số thanh RAM — dung lượng, tổ chức, độ trễ JEDEC và các cấu hình ép xung XMP, EXPO — để quá trình huấn luyện bộ nhớ bắt đầu đúng thiết lập.',
      quantity: '1 IC',
      specifications: five
        ? {
            'Dung lượng': '1,024 byte',
            'Cảm biến': 'Tích hợp cảm biến nhiệt độ',
            Bus: 'I3C Basic / I²C sideband',
          }
        : {
            'Nguồn cấp': 'VDDSPD 2.2–3.6 V',
            'Cấu hình': 'JEDEC 2400 · XMP 3200 / 3000',
          },
      representationType: 'physical',
      physicalAccuracy: accuracy,
      sources: five ? ['micronudimm', 'ddr5architecture'] : [product],
      searchTerms: [
        'spd',
        'eeprom',
        'profile',
        'xmp',
        'expo',
        'training',
        'cấu hình',
      ],
    }),
    make({
      id: id.decap,
      name: 'Tụ lọc nguồn',
      shortName: 'Tụ lọc',
      category: 'Power',
      parent,
      level,
      description: five
        ? 'Các hàng tụ gốm nhỏ dưới mỗi chip DRAM, cùng các tụ lớn hơn quanh mạch ổn áp.'
        : 'Các hàng tụ gốm nhỏ dưới mỗi chip DRAM và bên cạnh các cụm điện trở kết cuối.',
      purpose:
        'Tích trữ điện tích ngay sát từng chip, giúp dòng điện đột ngột khi truyền dữ liệu theo cụm được cấp tại chỗ thay vì làm sụt áp đường nguồn.',
      quantity: five ? '30 linh kiện mô hình hóa' : '26 linh kiện mô hình hóa',
      specifications: { Loại: 'Tụ gốm đa lớp (MLCC), dán bề mặt' },
      representationType: 'physical',
      physicalAccuracy: `${accuracy} Số lượng và vị trí tụ mang tính đại diện.`,
      sources: ['micronddr4design'],
      searchTerms: ['capacitor', 'mlcc', 'decoupling', 'bypass', 'tụ lọc', 'tụ'],
    }),
    make({
      id: id.contacts,
      name: 'Chân tiếp xúc cạnh',
      shortName: 'Chân tiếp xúc',
      category: 'Memory',
      parent,
      level,
      description: five
        ? '288 chân mạ vàng, 144 chân mỗi mặt với bước chân 0.85 mm, trên một cạnh thẳng. Rãnh khóa nằm ở vị trí riêng của DDR5.'
        : '288 chân mạ vàng, 144 chân mỗi mặt với bước chân 0.85 mm. Cạnh bo mạch hơi cong để các chân ở giữa chạm trước, giúp cắm thanh RAM nhẹ nhàng hơn thay vì ép cả 288 chân cùng lúc.',
      purpose: five
        ? 'Truyền tải cả hai kênh phụ, bus lệnh, nguồn 5 V và bus phụ qua khe cắm. Rãnh khóa ngăn không cho cắm nhầm thanh DDR4 vào khe DDR5.'
        : 'Truyền tải kênh dữ liệu, bus lệnh, nguồn 1.2 V, 2.5 V và bus SPD qua khe cắm. Rãnh khóa ngăn không cho cắm nhầm thanh DDR5 vào khe DDR4.',
      quantity: '288 chân tiếp xúc',
      specifications: {
        'Số lượng': '288 · 144 mỗi mặt',
        'Bước chân': '0.85 mm',
        Cạnh: five ? 'Thẳng' : 'Cong nhẹ, giảm lực cắm',
        'Rãnh khóa': five ? 'Vị trí DDR5' : 'Vị trí DDR4',
      },
      representationType: 'physical',
      physicalAccuracy: `${accuracy} Độ lệch rãnh khóa mang tính minh họa và khác nhau giữa các thế hệ như hình vẽ.`,
      sources: five
        ? ['jedecmo329', 'ddr5architecture']
        : ['kingstonddr4', 'micron16gbddr4'],
      searchTerms: [
        'contacts',
        'pins',
        'gold',
        'edge',
        'key',
        'notch',
        '288',
        'chân tiếp xúc',
        'rãnh khóa',
      ],
    }),
    make({
      id: id.pad,
      name: 'Miếng tản nhiệt',
      shortName: 'Miếng tản nhiệt',
      category: 'Cooling',
      parent,
      level,
      description: five
        ? 'Các miếng đệm mềm phủ lên mặt trên của chip DRAM, một miếng đệm xanh riêng cho mạch ổn áp ở mặt chính, và một dải băng keo ở mặt sau để trống.'
        : 'Một miếng đệm mềm phủ lên mặt trên của chip DRAM ở mặt chính, và một dải băng keo ở mặt sau để trống.',
      purpose:
        'Lấp đầy khe hở giữa các chip và tấm tản nhiệt để dẫn nhiệt qua, đồng thời giữ chặt hai tấm tản nhiệt vào bo mạch.',
      quantity: five ? '3 miếng đệm và 1 dải băng keo' : '2 miếng đệm và 1 dải băng keo',
      specifications: { 'Vật liệu': 'Đệm dẫn nhiệt (thermal pad) và băng keo dán' },
      representationType: 'physical',
      physicalAccuracy: `${accuracy} Hình dạng và độ dày miếng đệm mang tính minh họa.`,
      sources: five ? ['kingstonfuryreview', 'aphnetworks'] : [product],
      searchTerms: ['pad', 'thermal', 'tape', 'adhesive', 'miếng tản nhiệt'],
    }),
    make({
      id: id.spreader,
      name: 'Tản nhiệt nhôm, mặt trước',
      shortName: 'Tản nhiệt',
      category: 'Cooling',
      parent,
      level,
      opensFirst: true,
      description: five
        ? 'Tấm nhôm đen phủ lên các chip DRAM, đủ thấp để không cấn các tản nhiệt khí cỡ lớn, gập mép trên để khớp với tấm đối diện.'
        : 'Tấm nhôm đen phủ lên các chip DRAM với phần gờ bậc thang dọc theo mép trên.',
      purpose:
        'Phân tán nhiệt lượng từ tám chip DRAM ra bề mặt rộng hơn để luồng khí trong vỏ máy thổi đi.',
      quantity: '1 tấm',
      specifications: {
        'Chiều cao': five ? '34.9 mm tính cả mô-đun' : '34 mm tính cả mô-đun',
        'Độ dày': five
          ? '6.62 mm tính cả hai tấm'
          : '7.2 mm tính cả hai tấm',
        'Hoàn thiện': 'Màu đen',
      },
      representationType: 'physical',
      physicalAccuracy: `${accuracy} Các đường vát mô phỏng kiểu dáng dòng sản phẩm nhưng không tái tạo họa tiết hay logo thương hiệu.`,
      sources: five ? [product, family, 'aphnetworks'] : [product],
      searchTerms: [
        'heat spreader',
        'heatsink',
        'spreader',
        'fury',
        'beast',
        'kingston',
        'tản nhiệt',
      ],
    }),
    make({
      id: id.spreaderBack,
      name: 'Tản nhiệt nhôm, mặt sau',
      shortName: 'Tấm lưng',
      category: 'Cooling',
      parent,
      level,
      opensFirst: true,
      description: 'Tấm nhôm tương ứng ở mặt sau, có dán tem thông số kỹ thuật.',
      purpose:
        'Đóng kín thanh RAM và mang mã sản phẩm, tốc độ cùng điện áp để người lắp máy đối chiếu với danh sách hỗ trợ của bo mạch chủ.',
      quantity: '1 tấm',
      specifications: {
        Tem: five
          ? 'KF560C36BBE-16 · DDR5-6000 CL36 1.35 V'
          : 'KF432C16BB/16 · DDR4-3200 CL16 1.35 V',
      },
      representationType: 'physical',
      physicalAccuracy: accuracy,
      sources: [product],
      searchTerms: [
        'back plate',
        'label',
        'sticker',
        'part number',
        'tấm lưng',
        'tem',
      ],
    }),
  ];
}

// ── Shared package parts, per generation ──────────────────────────────────

const packageIds = {
  ddr5: {
    level: 'dram',
    parent: 'dramchip',
    mold: 'drammold',
    die: 'dramdie',
    pads: 'drampads',
    adhesive: 'dramadhesive',
    substrate: 'dramsubstrate',
    wire: 'drambondwire',
    encap: 'dramencap',
    ball: 'dramball',
    open: 'banks',
  },
  ddr4: {
    level: 'ddr4dram',
    parent: 'ddr4chip',
    mold: 'ddr4mold',
    die: 'ddr4die',
    pads: 'ddr4pads',
    adhesive: 'ddr4adhesive',
    substrate: 'ddr4substrate',
    wire: 'ddr4bondwire',
    encap: 'ddr4encap',
    ball: 'ddr4ball',
    open: 'ddr4banks',
  },
} as const;

function packageParts(gen: Gen): Concept[] {
  const id = packageIds[gen];
  const five = gen === 'ddr5';
  const level = id.level as LevelId;
  const parent = id.parent;
  const sheet: SourceId = five ? 'micron16gbddr5' : 'micron16gbddr4';
  const part = (
    key: keyof typeof id,
    name: string,
    shortName: string,
    category: Category,
    description: string,
    purpose: string,
    quantity: string,
    specifications: Record<string, string>,
    sources: SourceId[],
    searchTerms: string[],
    open?: LevelId,
  ) =>
    make({
      id: id[key],
      name,
      shortName,
      category,
      parent,
      level,
      open,
      description,
      purpose,
      quantity,
      specifications,
      representationType: 'physical',
      physicalAccuracy: packageAccuracy,
      sources,
      searchTerms: [...searchTerms, gen],
    });
  return [
    part(
      'mold',
      'Vỏ nhựa epoxy',
      'Vỏ epoxy',
      'Chassis',
      'Lớp epoxy đen đúc phủ lên mặt lưng của die, khắc laser ở mặt trên kèm một chấm định vị tại bi hàn A1.',
      'Bảo vệ die khỏi độ ẩm và va chạm, đồng thời tạo mặt phẳng phía trên cho đầu hút lắp ráp và miếng tản nhiệt.',
      '1 nắp vỏ',
      { 'Vật liệu': 'Nhựa epoxy có chất độn', 'Ký hiệu': 'Khắc laser, có chấm định vị chân 1' },
      ['bocpackage', 'packaging'],
      ['mold', 'epoxy', 'marking', 'package', 'vỏ epoxy'],
    ),
    part(
      'die',
      five ? 'Đế bán dẫn DDR5 SDRAM' : 'Đế bán dẫn DDR4 SDRAM',
      'Die',
      'Memory',
      'Một die silicon 16 Gb được gắn úp ngược: mặt mạch hướng về phía đế mạch còn mặt lưng hướng ra lớp vỏ epoxy. Các đệm hàn chạy dọc theo chính giữa mặt mạch.',
      five
        ? 'Chứa 32 bank ô nhớ và các mạch logic điều khiển chúng.'
        : 'Chứa 16 bank ô nhớ và các mạch logic điều khiển chúng.',
      '1 die',
      {
        'Mật độ': '16 Gb',
        'Tổ chức': five ? '2G × 8 · 32 bank' : '2G × 8 · 16 bank',
        'Gắn kết': 'Úp mặt, đệm hàn ở giữa',
      },
      [sheet, 'bocpackage'],
      ['die', 'silicon', 'dram', 'chip', 'đế bán dẫn'],
      id.open as LevelId,
    ),
    part(
      'pads',
      'Đệm hàn trung tâm',
      'Đệm hàn',
      'Memory',
      'Hai hàng đệm kim loại chạy dọc theo đường giữa của mặt die: mọi tín hiệu và nguồn cấp của die đều đi qua đây.',
      'Là kết nối duy nhất của die ra bên ngoài. Đặt ở giữa giúp mọi dây nối đều ngắn và chỉ cần một khe trên đế mạch để tiếp cận toàn bộ.',
      '2 hàng',
      { 'Vị trí': 'Dải chính giữa mặt die' },
      ['bocpackage'],
      ['pad', 'bond pad', 'centre pad', 'đệm hàn'],
    ),
    part(
      'adhesive',
      'Keo dán die',
      'Keo dán die',
      'Chassis',
      'Hai dải phim keo giữ mặt die vào đế mạch, nằm hai bên khe hở.',
      'Cố định die trước khi hàn dây và giảm chấn giữa die với đế mạch.',
      '2 dải',
      { 'Vật liệu': 'Phim keo dán, minh họa' },
      ['bocpackage'],
      ['adhesive', 'die attach', 'tape', 'keo dán'],
    ),
    part(
      'substrate',
      'Đế mạch đóng gói',
      'Đế mạch',
      'Board',
      'Một bo mạch mỏng có khoét khe ở chính giữa, ngay dưới dải đệm hàn của die. Các chân hàn dây nằm dọc hai mép khe ở mặt dưới; phần còn lại là các điểm đặt bi hàn.',
      'Tỏa các đệm hàn ở giữa die ra 78 bi hàn với khoảng cách mà bo mạch mô-đun có thể gia công được.',
      '1 đế mạch',
      {
        Khe: 'Nằm dưới dải đệm hàn giữa die',
        'Định tuyến': 'Từ chân hàn dây ra điểm đặt bi hàn',
      },
      ['bocpackage', sheet],
      [
        'substrate',
        'laminate',
        'slot',
        'window',
        'board on chip',
        'đế mạch',
      ],
    ),
    part(
      'wire',
      'Dây nối vàng',
      'Dây nối',
      'Memory',
      'Những sợi dây vàng mảnh đi từ từng đệm hàn trên die, xuyên qua khe và nối vào chân hàn ở mặt dưới đế mạch.',
      'Kết nối die với vỏ đóng gói. Nhờ die úp mặt xuống dưới, dây nối không cần phải vòng qua mép ngoài của die.',
      '1 dây mỗi đệm',
      { 'Vật liệu': 'Dây vàng, tiết diện minh họa' },
      ['bocpackage'],
      ['wire', 'bond wire', 'wire bond', 'gold', 'dây nối'],
    ),
    part(
      'encap',
      'Nhựa bọc khe',
      'Nhựa bọc',
      'Chassis',
      'Một dải nhựa lấp đầy khe và phủ kín các dây nối ở mặt dưới, được vẽ bán trong suốt ở đây để nhìn thấy dây.',
      'Bảo vệ các dây nối. Đây cũng là lý do lưới bi hàn có ba cột trống ở chính giữa: dải nhựa nằm tại vị trí đó.',
      '1 dải nhựa',
      { 'Vị trí': 'Dọc chính giữa mặt dưới' },
      ['bocpackage'],
      ['encapsulant', 'resin', 'glob top', 'nhựa bọc'],
    ),
    part(
      'ball',
      'Bi hàn',
      'Bi hàn',
      'Memory',
      '78 bi hàn trên lưới 0.8 mm: 13 hàng × 3 cột ở mỗi bên của dải nhựa bọc.',
      'Hàn chip đóng gói vào bo mạch mô-đun và truyền toàn bộ tín hiệu cùng nguồn cấp vào chip.',
      '78 bi hàn',
      {
        'Số lượng': '78',
        'Bước chân': '0.8 × 0.8 mm',
        'Ma trận': '13 hàng × 6 cột, bỏ trống 3 cột giữa',
        'Thân vỏ': '7.5 × 11 mm',
      },
      [sheet],
      ['ball', 'bga', 'fbga', 'solder', 'bi hàn'],
    ),
  ];
}

// ── The die, per generation ───────────────────────────────────────────────

const dieSources = (five: boolean): SourceId[] =>
  five ? ['micron16gbddr5', 'jedecddr5', 'micronddr5'] : ['micron16gbddr4'];

function dieParts(gen: Gen): Concept[] {
  const five = gen === 'ddr5';
  const level = (five ? 'banks' : 'ddr4banks') as LevelId;
  const parent = five ? 'dramdie' : 'ddr4die';
  const p = (
    c: Omit<
      Entry,
      'parent' | 'level' | 'representationType' | 'physicalAccuracy'
    >,
  ) =>
    make({
      ...c,
      parent,
      level,
      representationType: 'logical',
      physicalAccuracy: dieAccuracy,
      searchTerms: [...(c.searchTerms ?? []), gen],
    });
  const x = <V>(ddr5: V, ddr4: V): V => (five ? ddr5 : ddr4);
  type Specs = Record<string, string>;
  return [
    p({
      id: x('drambank', 'ddr4bank'),
      name: 'Các bank bộ nhớ',
      shortName: 'Bank',
      category: 'Memory',
      open: five ? 'bank' : 'ddr4array',
      description: x(
        '32 mảng ô nhớ độc lập. Mỗi bank có thể mở một hàng tại một thời điểm, nên có thể mở tối đa 32 hàng cùng lúc trên toàn die.',
        '16 mảng ô nhớ độc lập, mỗi bank có thể giữ một hàng ở trạng thái mở.',
      ),
      purpose:
        'Cho phép die xử lý nhiều yêu cầu cùng lúc: trong khi một bank đang mở hàng, bank khác có thể thực hiện đọc dữ liệu.',
      quantity: x('32 bank', '16 bank'),
      specifications: x<Specs>(
        {
          'Số bank': '32 trên một die 16 Gb x8',
          Nhóm: '8 nhóm bank × 4 bank',
          Hàng: '65,536 mỗi bank (R0–R15)',
          Trang: '1 KiB (1,024 cột × 8 bit)',
        },
        {
          'Số bank': '16 trên một die 16 Gb x8',
          Nhóm: '4 nhóm bank × 4 bank',
          Hàng: '131,072 mỗi bank (A0–A16)',
          Trang: '1 KiB (1,024 cột × 8 bit)',
        },
      ),
      sources: dieSources(five),
      searchTerms: ['bank', 'array', 'row', 'page', 'mảng', 'hàng'],
    }),
    p({
      id: x('drambankgroup', 'ddr4bankgroup'),
      name: 'I/O nhóm bank',
      shortName: 'Nhóm bank',
      category: 'Memory',
      description: x(
        'Mỗi nhóm bốn bank dùng chung một đường dữ liệu cục bộ dẫn về trung tâm die. DDR5 tăng gấp đôi số nhóm lên tám.',
        'Mỗi nhóm bốn bank dùng chung một đường dữ liệu cục bộ dẫn về trung tâm die. DDR4 giới thiệu cấu trúc này với bốn nhóm mỗi die.',
      ),
      purpose:
        'Hai lượt đọc ở các nhóm khác nhau có thể nối tiếp nhau với khoảng cách ngắn (tCCD_S); hai lượt đọc trong cùng một nhóm phải chờ khoảng trễ dài hơn (tCCD_L) để đường dữ liệu phục hồi.',
      quantity: x('8 nhóm', '4 nhóm'),
      specifications: {
        'Độ trễ': 'tCCD_S giữa các nhóm · tCCD_L trong cùng nhóm',
      },
      sources: dieSources(five),
      searchTerms: ['bank group', 'tccd', 'group', 'nhóm bank'],
    }),
    p({
      id: x('dramcmd', 'ddr4cmd'),
      name: x('Ngõ vào lệnh và địa chỉ', 'Ngõ vào lệnh và địa chỉ'),
      shortName: 'Lệnh',
      category: 'Compute',
      description: x(
        '14 chân CA dùng chung, lấy mẫu ở cả hai cạnh xung nhịp, truyền toàn bộ lệnh và địa chỉ trong một hoặc hai chu kỳ.',
        'Các chân lệnh chuyên biệt — ACT_n, cùng RAS_n, CAS_n, WE_n kiêm nhiệm bit địa chỉ — cộng thêm các đường nhóm bank, bank và địa chỉ, có tùy chọn kiểm tra chẵn lẻ.',
      ),
      purpose:
        'Giải mã các lệnh kích hoạt, đọc, ghi, nạp trước và làm tươi, đồng thời điều hướng địa chỉ đến đúng bank, hàng và cột.',
      quantity: '1 khối',
      specifications: x<Specs>(
        {
          Chân: 'CA[13:0], CS_n, CK_t/CK_c',
          'Kết cuối': 'Trên die, điều khiển theo lệnh',
        },
        {
          Chân: 'ACT_n, A[16:0], BG[1:0], BA[1:0]',
          'Kiểm tra': 'Kiểm tra chẵn lẻ CA (parity)',
        },
      ),
      sources: five ? dieSources(five) : ['micron16gbddr4', 'micronddr4design'],
      searchTerms: ['command', 'address', 'ca', 'decoder', 'lệnh', 'địa chỉ'],
    }),
    p({
      id: x('drammoderegs', 'ddr4moderegs'),
      name: 'Thanh ghi chế độ',
      shortName: 'Thanh ghi chế độ',
      category: 'Compute',
      description: x(
        'Các thanh ghi mà bộ điều khiển ghi vào để thiết lập độ trễ, độ dài cụm truyền (burst length), điện trở kết cuối, điện áp tham chiếu nội và các chế độ huấn luyện.',
        'Các thanh ghi MR0–MR6 thiết lập độ trễ, độ dài cụm truyền, điện trở kết cuối và điện áp tham chiếu.',
      ),
      purpose:
        'Lưu giữ các thiết lập mà quá trình huấn luyện bộ nhớ tìm ra khi khởi động.',
      quantity: '1 tập thanh ghi',
      specifications: x<Specs>(
        {
          'Huấn luyện':
            'VREF nội cho DQ, CA và CS · loopback · chỉnh chu kỳ nhiệm vụ',
        },
        { 'Thanh ghi': 'MR0–MR6', 'Huấn luyện': 'VREF nội cho DQ' },
      ),
      sources: dieSources(five),
      searchTerms: [
        'mode register',
        'mr',
        'training',
        'vref',
        'thanh ghi chế độ',
      ],
    }),
    p({
      id: x('dramrefresh', 'ddr4refresh'),
      name: 'Điều khiển làm tươi',
      shortName: 'Làm tươi',
      category: 'Power',
      description: x(
        'Đếm qua các hàng để mọi ô nhớ được ghi lại trong vòng 32 ms. Chế độ làm tươi cùng bank có thể làm tươi một bank trong mỗi nhóm trong khi các bank khác vẫn hoạt động.',
        'Đếm qua các hàng để mọi ô nhớ được ghi lại trong vòng 64 ms. Mỗi lệnh làm tươi áp dụng cho tất cả các bank cùng lúc hoặc một phần chia nhỏ hơn.',
      ),
      purpose:
        'Các ô nhớ bị rò điện tích. Nếu không làm tươi, giá trị 1 lưu trữ sẽ mờ dần thành 0 chỉ trong một phần nhỏ của giây.',
      quantity: '1 khối',
      specifications: x<Specs>(
        {
          'Chu kỳ': '32 ms, 8,192 lệnh (≤ 85 °C)',
          'Khoảng cách': 'tREFI 3.9 µs',
          'Chế độ': 'Toàn bộ bank · cùng bank',
        },
        {
          'Chu kỳ': '64 ms, 8,192 lệnh (≤ 85 °C)',
          'Khoảng cách': 'tREFI 7.8 µs',
          'Chế độ': 'Toàn bộ bank · phân giải mịn',
        },
      ),
      sources: dieSources(five),
      searchTerms: ['refresh', 'retention', 'trefi', 'làm tươi'],
    }),
    ...(five
      ? [
          p({
            id: 'dramecc',
            name: 'ECC trên die',
            shortName: 'ECC',
            category: 'Compute',
            description:
              'Mỗi 128 bit dữ liệu ghi vào sẽ có 8 bit kiểm tra lưu kèm; mỗi lần đọc đều được kiểm tra và sửa một bit bị lật trước khi dữ liệu rời khỏi die.',
            purpose:
              'Khắc phục tình trạng ô nhớ yếu khi thu nhỏ tiến trình. Tính năng này chỉ bảo vệ mảng ô nhớ: lỗi trên đường dây dẫn về CPU vẫn cần thanh RAM ECC chuyên dụng.',
            quantity: '1 bộ xử lý',
            specifications: {
              'Mã hóa': '128 bit dữ liệu + 8 bit kiểm tra',
              'Sửa lỗi': 'Lỗi đơn bit trong mảng ô nhớ',
              'Không giống với': 'Module ECC (x72/x80 ECC DIMM)',
            },
            sources: ['micron16gbddr5', 'micronddr5', 'ddr5architecture'],
            searchTerms: ['ecc', 'error correction', 'on-die ecc', 'sửa lỗi'],
          }),
        ]
      : [
          p({
            id: 'ddr4dll',
            name: 'Vòng khóa pha trễ (DLL)',
            shortName: 'DLL',
            category: 'Compute',
            description:
              'Mạch vòng giúp căn chỉnh thời điểm xuất dữ liệu khớp với xung nhịp đầu vào.',
            purpose:
              'Giữ dữ liệu đọc luôn đồng bộ với cạnh xung nhịp mà bộ điều khiển mong đợi, bất chấp thay đổi nhiệt độ và điện áp.',
            quantity: '1 mạch vòng',
            specifications: { 'Chế độ': 'DLL bật / DLL tắt' },
            sources: ['micron16gbddr4'],
            searchTerms: ['dll', 'clock', 'delay locked loop'],
          }),
        ]),
    p({
      id: x('dramprefetch', 'ddr4prefetch'),
      name: 'Nạp trước và đường dẫn dữ liệu',
      shortName: 'Nạp trước',
      category: 'Memory',
      description: x(
        'Một lần truy cập cột lấy ra 128 bit cùng lúc từ hàng đang mở, sau đó gửi qua 8 chân dữ liệu trong 16 lượt truyền.',
        'Một lần truy cập cột lấy ra 64 bit cùng lúc từ hàng đang mở, sau đó gửi qua 8 chân dữ liệu trong 8 lượt truyền.',
      ),
      purpose:
        'Giúp mảng ô nhớ chậm theo kịp giao diện tốc độ cao: mảng xử lý từ dữ liệu rộng ở một phần nhỏ của tốc độ chân cắm.',
      quantity: '1 đường dẫn',
      specifications: x<Specs>(
        { 'Nạp trước': '16n', 'Cụm truyền': 'BL16 · 128 bit mỗi lần truy cập x8' },
        { 'Nạp trước': '8n', 'Cụm truyền': 'BL8 · 64 bit mỗi lần truy cập x8' },
      ),
      sources: dieSources(five),
      searchTerms: [
        'prefetch',
        'burst',
        'serialiser',
        'data path',
        'nạp trước',
      ],
    }),
    p({
      id: x('dramdqio', 'ddr4dqio'),
      name: 'Ngõ vào/ra dữ liệu (DQ I/O)',
      shortName: 'DQ I/O',
      category: 'Memory',
      description: x(
        'Tám chân dữ liệu và một cặp xung định thời (strobe), tích hợp mạch cân bằng phản hồi quyết định (DFE) ở bộ thu và kiểm tra CRC khi đọc/ghi.',
        'Tám chân dữ liệu và một cặp xung định thời (strobe), tích hợp đảo bus dữ liệu (DBI) và kiểm tra CRC khi ghi.',
      ),
      purpose: x(
        'Truyền dữ liệu ở tốc độ 6000 MT/s mỗi chân trên thanh RAM này; bộ cân bằng làm sạch tín hiệu bị suy hao ở cuối đường mạch.',
        'Truyền dữ liệu lên tới 3200 MT/s mỗi chân; đảo bus dữ liệu giúp giảm số chân chuyển trạng thái cùng lúc.',
      ),
      quantity: '8 DQ + strobe',
      specifications: x<Specs>(
        {
          Chân: 'DQ[7:0], DQS_t/DQS_c, DM_n',
          'Bộ thu': 'DFE',
          'Kiểm tra': 'CRC khi đọc và ghi',
        },
        {
          Chân: 'DQ[7:0], DQS_t/DQS_c, DM_n/DBI_n',
          'Tính năng': 'DBI · CRC khi ghi',
        },
      ),
      sources: dieSources(five),
      searchTerms: ['dq', 'data', 'io', 'strobe', 'dqs', 'dữ liệu'],
    }),
    p({
      id: x('dramzq', 'ddr4zq'),
      name: 'Hiệu chuẩn ZQ và điện trở kết cuối',
      shortName: 'ZQ',
      category: 'Power',
      description:
        'Đo lường các điện trở mạch lái và kết cuối so với một điện trở chính xác trên chân ZQ rồi tinh chỉnh chúng.',
      purpose:
        'Giữ trở kháng đầu ra và điện trở kết cuối trên die luôn chính xác khi die nóng lên, đảm bảo tín hiệu sạch.',
      quantity: '1 khối',
      specifications: { 'Tham chiếu': 'Điện trở chính xác gắn ngoài trên chân ZQ' },
      sources: dieSources(five),
      searchTerms: ['zq', 'calibration', 'odt', 'termination', 'hiệu chuẩn'],
    }),
  ];
}

// ── The catalogue ─────────────────────────────────────────────────────────

const bankSources: SourceId[] = ['salp', 'dramfundamentals', 'micron16gbddr5'];
const bankPart = (
  c: Omit<
    Entry,
    'parent' | 'level' | 'representationType' | 'physicalAccuracy'
  >,
) =>
  make({
    ...c,
    parent: 'drambank',
    level: 'bank',
    representationType: 'logical',
    physicalAccuracy: bankAccuracy,
  });
const cellSources: SourceId[] = ['dramfundamentals', 'salp'];
const cellPart = (
  c: Omit<
    Entry,
    'parent' | 'level' | 'representationType' | 'physicalAccuracy'
  >,
) =>
  make({
    ...c,
    parent: 'drammat',
    level: 'cell',
    representationType: 'logical',
    physicalAccuracy: cellAccuracy,
  });

export const ramConcepts: Concept[] = [
  // ── DDR5 module (physical) ──────────────────────────────────────────────
  ...moduleParts('ddr5'),
  make({
    id: 'dimmpmic',
    name: 'IC quản lý nguồn (PMIC)',
    shortName: 'PMIC',
    category: 'Power',
    parent: 'ram',
    level: 'dimm',
    description:
      'Mạch ổn áp xung nằm ở chính giữa thanh RAM. DDR5 đưa mạch này lên trực tiếp trên mô-đun; ở DDR4, bo mạch chủ đảm nhận việc này.',
    purpose:
      'Chuyển nguồn 5 V từ khe cắm thành các mức điện áp riêng cho DRAM ngay sát các chip, giúp nguồn cấp ổn định hơn so với việc dẫn từ bo mạch chủ.',
    quantity: '1 IC',
    specifications: {
      'Đầu vào': 'VIN_BULK 5 V',
      'Đầu ra': 'VDD 1.1 V · VDDQ 1.1 V · VPP 1.8 V (JEDEC)',
      'Ép xung': 'Tăng lên 1.35 V cho cấu hình XMP / EXPO',
    },
    representationType: 'physical',
    physicalAccuracy: ddr5Module,
    sources: ['micronudimm', 'ddr5architecture', 'kf560'],
    searchTerms: [
      'pmic',
      'power',
      'regulator',
      'voltage',
      'vin_bulk',
      'quản lý nguồn',
    ],
  }),
  make({
    id: 'dimminductor',
    name: 'Cuộn cảm mạch ổn áp',
    shortName: 'Cuộn cảm',
    category: 'Power',
    parent: 'ram',
    level: 'dimm',
    description:
      'Ba cuộn cảm công suất nhỏ nằm cạnh PMIC, mỗi cuộn ứng với một ngõ ra chuyển mạch.',
    purpose:
      'Tích trữ năng lượng giữa các xung đóng ngắt, làm phẳng đầu ra xung của mạch ổn áp thành dòng một chiều ổn định cho DRAM.',
    quantity: '3 cuộn cảm',
    specifications: { 'Vai trò': 'Bộ lọc đầu ra mạch hạ áp (buck converter)' },
    representationType: 'physical',
    physicalAccuracy: `${ddr5Module} Số lượng và vị trí cuộn cảm mang tính đại diện.`,
    sources: ['micronudimm'],
    searchTerms: ['inductor', 'coil', 'choke', 'buck', 'cuộn cảm'],
  }),

  // ── DDR5 package (physical) ─────────────────────────────────────────────
  ...packageParts('ddr5'),

  // ── DDR5 die (logical) ──────────────────────────────────────────────────
  ...dieParts('ddr5'),

  // ── One bank (logical) ──────────────────────────────────────────────────
  bankPart({
    id: 'drammat',
    name: 'Ma trận ô nhớ (Mat)',
    shortName: 'Mat',
    category: 'Memory',
    open: 'cell',
    description:
      'Các ô mảng tạo nên một bank, mỗi mat khoảng 512 hàng × 512 cột ô nhớ. Một hàng gồm nhiều mat chạy ngang qua bank gọi là một mảng con (subarray).',
    purpose:
      'Giữ cho mọi đường wordline và bitline đều ngắn. Một đường dây trải dài toàn bộ bank sẽ quá chậm và quá nặng tải để cảm nhận được điện tích của một ô nhớ đơn lẻ.',
    quantity: '36 khối minh họa',
    specifications: {
      'Kích thước': 'Khoảng 512 × 512 ô nhớ',
      Hàng: 'Mở xuyên qua mọi mat của một mảng con',
    },
    sources: bankSources,
    searchTerms: ['mat', 'subarray', 'tile', 'array', 'ma trận'],
  }),
  bankPart({
    id: 'dramlocalsa',
    name: 'Bộ khuếch đại cảm biến cục bộ',
    shortName: 'Sense amp cục bộ',
    category: 'Memory',
    description:
      'Một dải các bộ khuếch đại cảm biến nằm giữa mỗi cặp mảng con: đóng vai trò bộ đệm hàng cục bộ.',
    purpose:
      'Khi một hàng mở ra, các mạch này khuếch đại toàn bộ các đường bitline trong hàng đó cùng lúc và giữ nguyên cả hàng, giúp việc đọc phần còn lại của hàng đang mở diễn ra rất nhanh.',
    quantity: '7 dải minh họa',
    specifications: { 'Lưu giữ': 'Một hàng đang mở của mảng con' },
    sources: bankSources,
    searchTerms: [
      'sense amplifier',
      'row buffer',
      'local',
      'khuếch đại cảm biến',
    ],
  }),
  bankPart({
    id: 'dramswd',
    name: 'Mạch lái wordline phụ',
    shortName: 'SWD',
    category: 'Power',
    description: 'Các dải mạch lái hẹp nằm giữa các mat.',
    purpose:
      'Nhận tín hiệu từ đường wordline toàn cục và nâng mức điện áp đường wordline cục bộ trong từng mat lên mức VPP tăng áp để mở hoàn toàn các transistor truy cập.',
    quantity: '42 dải minh họa',
    specifications: { 'Điều khiển': 'Wordline cục bộ ở mức VPP, 1.8 V' },
    sources: bankSources,
    searchTerms: ['wordline driver', 'swd', 'vpp', 'mạch lái'],
  }),
  bankPart({
    id: 'dramgwl',
    name: 'Đường wordline toàn cục',
    shortName: 'Wordline toàn cục',
    category: 'Memory',
    description:
      'Các đường dây từ bộ giải mã hàng chạy ngang qua các mat của từng mảng con.',
    purpose:
      'Truyền tín hiệu hàng được chọn tới các mạch lái wordline phụ của mọi mat mà nó đi qua.',
    quantity: '6 đường minh họa',
    specifications: { 'Điều khiển': 'Bởi bộ giải mã hàng toàn cục' },
    sources: bankSources,
    searchTerms: ['global wordline', 'wordline'],
  }),
  bankPart({
    id: 'dramgbl',
    name: 'Đường bitline toàn cục',
    shortName: 'Bitline toàn cục',
    category: 'Memory',
    description:
      'Các đường dây chạy dọc theo bank qua mọi mảng con, nối các bộ đệm hàng cục bộ với bộ khuếch đại cảm biến toàn cục.',
    purpose:
      'Đưa các cột được chọn từ hàng đang mở ra khỏi mảng ô nhớ, mỗi lần một vài bit.',
    quantity: '12 đường minh họa',
    specifications: { 'Kết nối': 'Bộ đệm hàng cục bộ → bộ đệm hàng toàn cục' },
    sources: bankSources,
    searchTerms: ['global bitline', 'bitline', 'data line'],
  }),
  bankPart({
    id: 'dramrowdec',
    name: 'Bộ giải mã hàng toàn cục',
    shortName: 'Giải mã hàng',
    category: 'Compute',
    description:
      'Chuyển đổi địa chỉ hàng 16-bit của lệnh ACTIVATE thành một đường wordline toàn cục.',
    purpose: 'Chọn hàng nào trong số 65,536 hàng sẽ được mở.',
    quantity: '1 bộ giải mã',
    specifications: { 'Địa chỉ': 'R0–R15', 'Số hàng': '65,536' },
    sources: ['salp', 'micron16gbddr5'],
    searchTerms: ['row decoder', 'decoder', 'activate', 'giải mã hàng'],
  }),
  bankPart({
    id: 'dramgsa',
    name: 'Bộ khuếch đại cảm biến toàn cục',
    shortName: 'Sense amp toàn cục',
    category: 'Memory',
    description: 'Bộ đệm hàng toàn cục nằm ở cuối bank.',
    purpose:
      'Khuếch đại các tín hiệu nhỏ truyền tới trên đường bitline toàn cục và chuyển các bit đã chọn vào đường dẫn dữ liệu của nhóm bank.',
    quantity: '1 dải',
    specifications: { 'Tên khác': 'Bộ đệm hàng toàn cục' },
    sources: bankSources,
    searchTerms: ['global sense amplifier', 'row buffer', 'khuếch đại cảm biến'],
  }),
  bankPart({
    id: 'dramcoldec',
    name: 'Bộ giải mã cột',
    shortName: 'Giải mã cột',
    category: 'Compute',
    description:
      'Chuyển đổi địa chỉ cột 10-bit của lệnh READ hoặc WRITE thành các đường chọn cột.',
    purpose:
      'Chọn các bit nào của hàng 1 KiB đang mở sẽ được đưa ra ngoài — 128 bit mỗi lần truy cập trên die x8.',
    quantity: '1 bộ giải mã',
    specifications: { 'Địa chỉ': 'C0–C9', 'Số cột': '1,024' },
    sources: ['salp', 'micron16gbddr5'],
    searchTerms: ['column decoder', 'column select', 'csl', 'giải mã cột'],
  }),
  bankPart({
    id: 'drambankctl',
    name: 'Điều khiển bank',
    shortName: 'Điều khiển bank',
    category: 'Compute',
    description:
      'Chốt địa chỉ hàng và định thời chuỗi lệnh ACTIVATE, READ, WRITE và PRECHARGE của bank.',
    purpose:
      'Thực thi các tham số thời gian của bank: một hàng phải mở trong thời gian tRCD trước khi đọc và đóng trong thời gian tRP trước khi mở hàng khác.',
    quantity: '1 khối',
    specifications: { 'Chuỗi lệnh': 'ACTIVATE → READ / WRITE → PRECHARGE' },
    sources: ['salp', 'micron16gbddr5'],
    searchTerms: [
      'bank control',
      'trcd',
      'trp',
      'activate',
      'precharge',
      'điều khiển bank',
    ],
  }),

  // ── The cell (logical) ──────────────────────────────────────────────────
  cellPart({
    id: 'dramcapacitor',
    name: 'Tụ lưu trữ',
    shortName: 'Tụ lưu trữ',
    category: 'Memory',
    description:
      'Mỗi bit dùng một tụ điện siêu nhỏ. Tích điện là bit 1, xả điện là bit 0; các tụ phát sáng trong hình đang lưu một mẫu dữ liệu.',
    purpose:
      'Lưu giữ bit dưới dạng điện tích đo bằng femtocoulomb. Điện tích bị rò rỉ dần, đó là lý do DRAM phải làm tươi liên tục và được gọi là bộ nhớ “động” (dynamic).',
    quantity: '48 tụ minh họa',
    specifications: {
      'Ô nhớ': '1T1C: một transistor, một tụ điện',
      'Hình dạng': 'Hình trụ cao',
    },
    sources: cellSources,
    searchTerms: ['capacitor', 'cell', 'charge', 'bit', '1t1c', 'tụ lưu trữ'],
  }),
  cellPart({
    id: 'dramaccess',
    name: 'Transistor truy cập',
    shortName: 'Access FET',
    category: 'Memory',
    description:
      'Mỗi ô nhớ có một transistor nằm giữa tụ điện và đường bitline, được đóng mở bởi đường wordline.',
    purpose:
      'Cô lập tụ điện để giữ nguyên điện tích, và nối tụ vào bitline khi hàng tương ứng được mở.',
    quantity: '48 transistor minh họa',
    specifications: { 'Cực cổng': 'Đường wordline', 'Kênh dẫn': 'Tụ điện ↔ bitline' },
    sources: cellSources,
    searchTerms: ['transistor', 'access', 'fet'],
  }),
  cellPart({
    id: 'dramwordline',
    name: 'Đường wordline',
    shortName: 'Wordline',
    category: 'Memory',
    description: 'Đường điều khiển cực cổng chạy dọc theo hàng, mỗi hàng ô nhớ có một đường.',
    purpose:
      'Nâng điện áp một đường lên mức VPP sẽ mở toàn bộ các ô nhớ trong hàng đó vào đường bitline cùng lúc — đó là lý do DRAM luôn mở nguyên một hàng.',
    quantity: '6 đường minh họa',
    specifications: { 'Mức áp': 'Tăng áp lên VPP, 1.8 V, khi được chọn' },
    sources: cellSources,
    searchTerms: ['wordline', 'row', 'gate'],
  }),
  cellPart({
    id: 'drambitline',
    name: 'Đường bitline',
    shortName: 'Bitline',
    category: 'Memory',
    description:
      'Đường dây chạy dọc theo cột, mỗi cột ô nhớ có một đường, nối xuống bộ khuếch đại cảm biến.',
    purpose:
      'Được nạp trước ở mức điện áp giữa, sau đó bị đẩy lên hoặc kéo xuống nhẹ khi ô nhớ chia sẻ điện tích — mức dao động dưới một phần mười volt để bộ khuếch đại đọc.',
    quantity: '8 đường minh họa',
    specifications: { 'Trạng thái nghỉ': 'Nạp trước ở mức giữa' },
    sources: cellSources,
    searchTerms: ['bitline', 'column'],
  }),
  cellPart({
    id: 'dramplate',
    name: 'Bản cực chung',
    shortName: 'Bản cực',
    category: 'Power',
    description:
      'Điện cực phía trên dùng chung cho toàn bộ các tụ điện trong mảng.',
    purpose: 'Đóng vai trò cực còn lại của mọi tụ điện, giữ ở một điện áp cố định.',
    quantity: '1 bản cực',
    specifications: { 'Dùng chung': 'Cho tất cả các tụ điện trong mảng' },
    sources: ['dramfundamentals'],
    searchTerms: ['plate', 'electrode', 'bản cực'],
  }),
  cellPart({
    id: 'dramwldriver',
    name: 'Mạch lái wordline',
    shortName: 'Mạch lái WL',
    category: 'Power',
    description: 'Các mạch lái wordline phụ nằm ở rìa của mat.',
    purpose:
      'Kéo đường wordline được chọn lên mức VPP, và giữ mọi đường còn lại ở trạng thái tắt hoàn toàn.',
    quantity: '1 dải',
    specifications: { 'Nguồn cấp': 'VPP, 1.8 V' },
    sources: cellSources,
    searchTerms: ['wordline driver', 'driver', 'mạch lái'],
  }),
  cellPart({
    id: 'dramprecharge',
    name: 'Nạp trước và cân bằng',
    shortName: 'Precharge',
    category: 'Power',
    description:
      'Các công tắc nối tắt cặp đường bitline lại với nhau và đưa về mức điện áp giữa.',
    purpose:
      'Đưa các đường bitline về trạng thái ban đầu sau khi đóng hàng, để lần mở hàng kế tiếp bắt đầu từ mức chuẩn xác định. Lệnh PRECHARGE thực hiện bước này.',
    quantity: '1 dải',
    specifications: { Lệnh: 'PRECHARGE · tRP' },
    sources: cellSources,
    searchTerms: ['precharge', 'equalise', 'equalize', 'nạp trước'],
  }),
  cellPart({
    id: 'dramcellsa',
    name: 'Bộ khuếch đại cảm biến',
    shortName: 'Sense amp',
    category: 'Memory',
    description:
      'Mạch chốt ghép chéo cho mỗi đường bitline, so sánh với một đường bitline tham chiếu từ mat kế cận.',
    purpose:
      'Phát hiện độ lệch điện áp siêu nhỏ, kéo đường bitline lên mức cao hoặc thấp hoàn toàn, qua đó ghi trả lại giá trị vào ô nhớ vừa bị tiêu hao điện tích khi đọc.',
    quantity: '8 mạch minh họa',
    specifications: {
      'Đọc dữ liệu': 'Phá hủy điện tích, được bộ khuếch đại ghi lại',
      'Cấu trúc mảng': 'Bitline mở (Open bitline)',
    },
    sources: cellSources,
    searchTerms: ['sense amplifier', 'latch', 'sense amp', 'khuếch đại cảm biến'],
  }),
  cellPart({
    id: 'dramcolsel',
    name: 'Công tắc chọn cột',
    shortName: 'Chọn cột',
    category: 'Compute',
    description:
      'Các transistor nằm giữa mỗi bộ khuếch đại cảm biến và các đường I/O cục bộ.',
    purpose:
      'Chỉ mở cho các cột mà lệnh READ hoặc WRITE định địa chỉ để nối chúng vào đường dẫn dữ liệu.',
    quantity: '8 công tắc minh họa',
    specifications: { 'Điều khiển': 'Bởi các đường chọn cột' },
    sources: cellSources,
    searchTerms: ['column select', 'switch', 'chọn cột'],
  }),
  cellPart({
    id: 'dramlio',
    name: 'Đường I/O cục bộ',
    shortName: 'I/O cục bộ',
    category: 'Memory',
    description:
      'Một cặp đường tín hiệu vi sai chạy dọc theo dải bộ khuếch đại cảm biến.',
    purpose:
      'Đưa bit đã chọn ra các đường bitline toàn cục, hoặc nhận dữ liệu ghi từ đó đi vào.',
    quantity: '1 cặp',
    specifications: { 'Tín hiệu': 'Cặp vi sai' },
    sources: cellSources,
    searchTerms: ['local io', 'lio', 'data line', 'i/o cục bộ'],
  }),

  // ── DDR4 module (physical, alternative) ─────────────────────────────────
  make({
    id: 'ddr4module',
    name: 'Kingston FURY Beast DDR4',
    shortName: 'DDR4 RAM',
    category: 'Memory',
    parent: 'dimmslot',
    level: 'ddr4',
    open: 'ddr4',
    description:
      'Thanh RAM 16 GB DDR4-3200 UDIMM cùng dòng với thanh DDR5 đang lắp, dùng để đối chiếu. Thanh này không thể cắm vào khe DDR5 trên bo mạch chủ này.',
    purpose:
      'Lưu trữ bộ nhớ làm việc cho các nền tảng máy tính để bàn thế hệ trước.',
    quantity: '1 mẫu đối chiếu',
    specifications: {
      Chuẩn: 'DDR4 SDRAM · UDIMM',
      'Tốc độ dữ liệu': 'DDR4-3200 với XMP · DDR4-2400 mặc định JEDEC',
      'Độ trễ': 'CL16-20-20 ở 1.35 V',
      'Dung lượng': '16 GB · single rank · 8 × 16 Gb x8',
      Kênh: '1 × kênh 64-bit',
      'Số bank mỗi die': '16 · 4 nhóm × 4 bank',
      'Cụm truyền': 'BL8 · nạp trước 8n',
      'Cấp nguồn': 'Ổn áp trên bo mạch chủ',
      'Điện áp': 'VDD/VDDQ 1.2 V · VPP 2.5 V (JEDEC)',
      'ECC trên die': 'Không có',
      'Bank và ô nhớ':
        'Cùng thiết kế với DDR5 — các mat, bộ khuếch đại cảm biến, một transistor và một tụ điện mỗi bit — với 131,072 hàng mỗi bank và wordline tăng áp lên 2.5 V',
      'Kích thước': '133.35 × 34 × 7.2 mm',
      'Chân cắm': '288-pin',
    },
    representationType: 'physical',
    physicalAccuracy: ddr4Module,
    sources: ['kf432', 'kingstonddr4', 'micron16gbddr4'],
    searchTerms: [
      'ddr4',
      'ram',
      'memory',
      'dimm',
      'kingston',
      'fury',
      'beast',
      '3200',
      'bộ nhớ',
    ],
  }),
  ...moduleParts('ddr4'),
  make({
    id: 'ddr4term',
    name: 'Điện trở kết cuối bus lệnh',
    shortName: 'Kết cuối',
    category: 'Power',
    parent: 'ddr4module',
    level: 'ddr4',
    description:
      'Các cụm điện trở ở cuối đường bus lệnh nối tiếp (fly-by), phía sau chip DRAM cuối cùng.',
    purpose:
      'Các đường lệnh, địa chỉ và xung nhịp chạy lần lượt qua cả tám chip; điện trở nối về VTT ở cuối đường dây hấp thụ tín hiệu để tránh phản xạ ngược. DDR5 đã chuyển phần kết cuối này vào bên trong die.',
    quantity: '5 cụm điện trở',
    specifications: {
      'Cấu trúc': 'Fly-by, kết cuối về VTT',
      'Giá trị': 'Khoảng 30–47 Ω',
    },
    representationType: 'physical',
    physicalAccuracy: `${ddr4Module} Số lượng và vị trí cụm điện trở mang tính đại diện.`,
    sources: ['micronddr4design'],
    searchTerms: ['termination', 'resistor', 'vtt', 'fly-by', 'kết cuối'],
  }),
  ...packageParts('ddr4'),
  ...dieParts('ddr4'),
];

// ── DDR4 bank and cell (logical) ──────────────────────────────────────────
//
// A DDR4 bank and cell are built the same way as DDR5's, so these scales are
// the DDR5 ones under DDR4 ids, with the numbers that differ swapped in: a
// 17-bit row address and twice the rows, 64 bits per column access instead
// of 128, and wordlines boosted to 2.5 V instead of 1.8 V.

const ddr4Text = (text: string) =>
  text
    .replaceAll('65,536', '131,072')
    .replaceAll('R0–R15', 'A0–A16')
    .replaceAll('C0–C9', 'A0–A9')
    .replaceAll('địa chỉ hàng 16-bit', 'địa chỉ hàng 17-bit')
    .replaceAll('128 bit mỗi lần truy cập', '64 bit mỗi lần truy cập')
    .replaceAll('1.8 V', '2.5 V');
const ddr4Id = (id: string) => id.replace(/^dram/, 'ddr4');

ramConcepts.push(
  ...ramConcepts
    .filter((c) => c.level === 'bank' || c.level === 'cell')
    .map((c) =>
      concept({
        ...c,
        id: ddr4Id(c.id),
        parent: c.parent && ddr4Id(c.parent),
        children: [],
        level: c.level === 'bank' ? 'ddr4array' : 'ddr4cell',
        open: c.open === 'cell' ? 'ddr4cell' : undefined,
        description: ddr4Text(c.description),
        purpose: ddr4Text(c.purpose),
        specifications: Object.fromEntries(
          Object.entries(c.specifications).map(([k, v]) => [k, ddr4Text(v)]),
        ),
        physicalAccuracy: ddr4Text(c.physicalAccuracy),
        sources: c.sources.map((s) =>
          s === 'micron16gbddr5' ? 'micron16gbddr4' : s,
        ),
        searchTerms: [...c.searchTerms, 'ddr4'],
      }),
    ),
);
