import {
  concept,
  type Category,
  type Concept,
  type Entry,
} from '../concept.ts';
import type { LevelId } from '../levels.ts';
import type { SourceId } from '../sources.ts';

/**
 * The two small NVIDIA cards: the ASUS Dual GeForce RTX 5060 Ti and the MSI
 * GeForce RTX 5060 INSPIRE ITX, built by `compact-card.ts`.
 *
 * They are written from one list because they are the same kind of card, and
 * each entry takes what differs from that card's own sources: the size, the
 * fans, the heatsink, the backplate. What neither maker publishes (the board
 * layout, heat pipe count, phase count) is drawn and labelled as such.
 *
 * Every id carries a `dual` or `itx` prefix so nothing collides with the
 * other cards. Neither card has chip scales: the GPU package is the deepest
 * part either opens to.
 */

interface CardFacts {
  prefix: 'dual' | 'itx';
  level: LevelId;
  name: string;
  shortName: string;
  maker: SourceId[];
  /** The maker's own description of the cooler, and NVIDIA's chip figures. */
  design: SourceId[];
  card: Record<string, string>;
  description: string;
  envelope: string;
  memory: { capacity: string; note: string };
  fans: Pick<Entry, 'description' | 'quantity' | 'specifications'>;
  heatsink: Pick<Entry, 'name' | 'description' | 'specifications'>;
  backplate: string;
  phases: string;
  searchTerms: string[];
}

const dual: CardFacts = {
  prefix: 'dual',
  level: 'rtx5060ti',
  name: 'ASUS Dual GeForce RTX 5060 Ti 16GB',
  shortName: 'RTX 5060 Ti',
  maker: ['dual5060ti'],
  design: ['dual5060tidesign'],
  card: {
    'Kiến trúc': 'NVIDIA Blackwell',
    'Nhân CUDA': '4.608',
    'Bộ nhớ': '16 GB GDDR7 · 128-bit · 28 Gbps',
    'Tổng công suất đồ họa': '180 W theo thông số NVIDIA',
    'Nguồn khuyến nghị': '550 W (ASUS)',
    'Cấp nguồn': '1 × 8-pin',
    'Giao tiếp': 'PCI Express 5.0',
    'Cổng xuất hình': '3 × DisplayPort 2.1b · 1 × HDMI 2.1b',
    'Kích thước': '229 × 120 × 50 mm · 2.5 khe',
  },
  description:
    'Mẫu card đồ họa hai quạt nhỏ gọn dùng kiến trúc NVIDIA Blackwell, trang bị 16 GB GDDR7 trên bus 128-bit.',
  envelope:
    'Kích thước 229 × 120 × 50 mm (2.5 khe), hai quạt Axial-tech, một đầu cắm 8-pin và bốn cổng xuất hình tuân theo thông số của ASUS.',
  memory: {
    capacity: '16 GB',
    note: 'Bốn chip nhớ được vẽ trên mặt trước bo mạch, mỗi chip ứng với một kênh 32-bit. Phiên bản 16 GB chứa dung lượng gấp đôi bốn chip 2 GB; cách ASUS phân bổ chip giữa hai mặt bo mạch không được mô hình hóa.',
  },
  fans: {
    description:
      'Hai quạt Axial-tech: phần trục nhỏ để tăng chiều dài cánh quạt, cùng vòng chắn bao quanh đầu cánh.',
    quantity: '2 quạt mô phỏng',
    specifications: {
      'Loại': 'Axial-tech, có vòng chắn',
      'Ổ trục': 'Vòng bi kép (Dual ball bearings)',
      'Chế độ dừng quạt': 'Dưới 50 °C khi tải nhẹ',
      'Số cánh quạt': 'Minh họa',
    },
  },
  heatsink: {
    name: 'Khối lá tản nhiệt',
    description:
      'Một khối lá nhôm chạy dọc chiều dài card, luồn qua các ống dẫn nhiệt nối từ đế tiếp xúc GPU.',
    specifications: {
      'Ống dẫn nhiệt': 'Có trang bị theo ASUS; vẽ minh họa 3 ống, hãng không công bố số lượng',
      'Số lá tản nhiệt thực tế': 'Không công bố',
    },
  },
  backplate:
    'Tấm ốp lưng có khe thoát gió giúp gia cố bo mạch; khe hở vượt quá đuôi bo mạch cho phép luồng gió từ quạt thứ hai thổi xuyên qua.',
  phases:
    'Vẽ minh họa sáu pha nguồn GPU và một pha nguồn bộ nhớ; ASUS không công bố số pha chính xác.',
  searchTerms: [
    'asus',
    'dual',
    '5060 ti',
    'blackwell',
    'geforce',
    'compact',
    'nhỏ gọn',
    'card đồ họa',
  ],
};

const itx: CardFacts = {
  prefix: 'itx',
  level: 'rtx5060',
  name: 'MSI GeForce RTX 5060 8G INSPIRE ITX',
  shortName: 'RTX 5060',
  maker: ['inspire5060'],
  design: ['inspirecooler'],
  card: {
    'Kiến trúc': 'NVIDIA Blackwell',
    'Nhân CUDA': '3.840',
    'Bộ nhớ': '8 GB GDDR7 · 128-bit · 28 Gbps',
    'Công suất tiêu thụ': '145 W (MSI)',
    'Nguồn khuyến nghị': '550 W (MSI)',
    'Cấp nguồn': '1 × 8-pin',
    'Giao tiếp': 'PCI Express 5.0 ×16, chạy ở chế độ ×8',
    'Cổng xuất hình': '3 × DisplayPort 2.1b · 1 × HDMI 2.1b',
    'Kích thước': '145 × 120 × 45 mm',
    'Trọng lượng': '581 g',
  },
  description:
    'Một trong những mẫu RTX 5060 nhỏ nhất: một quạt duy nhất trên cụm tản nhiệt lõi đồng, đủ ngắn để lắp vào thùng máy ITX.',
  envelope:
    'Kích thước 145 × 120 × 45 mm, một quạt bảy cánh, tản nhiệt tỏa tròn lõi đồng, tấm ốp lưng có khe thoáng, một đầu cắm 8-pin và bốn cổng xuất hình tuân theo bảng thông số và mô tả công bố của MSI.',
  memory: {
    capacity: '8 GB',
    note: 'Bốn chip nhớ 2 GB, mỗi chip ứng với một kênh 32-bit của bus 128-bit.',
  },
  fans: {
    description:
      'Một quạt STORMFORCE: bảy cánh có vân vuốt được liên kết ở đầu cánh bằng một vòng cung tròn.',
    quantity: '1 quạt mô phỏng',
    specifications: {
      'Số cánh': '7',
      'Chế độ dừng quạt': 'Zero Frozr, tự dừng khi nhiệt độ thấp',
    },
  },
  heatsink: {
    name: 'Tản nhiệt tỏa tròn (Sunflower)',
    description:
      'Các lá nhôm đùn tỏa ra từ một lõi đồng trung tâm giống cánh hoa hướng dương, thay thế cho ống dẫn nhiệt.',
    specifications: {
      'Lõi': 'Đồng',
      'Lá tản nhiệt': 'Nhôm đùn, dạng tỏa tròn',
      'Số lá tản nhiệt thực tế': 'Không công bố',
    },
  },
  backplate:
    'Tấm ốp lưng gia cố có khe thoát khí, giúp khí nóng thoát ra từ mặt sau card trong không gian thùng máy chật hẹp.',
  phases:
    'Vẽ minh họa năm pha nguồn GPU và một pha nguồn bộ nhớ dùng tầng công suất DrMOS; MSI không công bố số pha chính xác.',
  searchTerms: [
    'msi',
    'inspire',
    'itx',
    '5060',
    'blackwell',
    'geforce',
    'small form factor',
    'nhỏ gọn',
    'card đồ họa',
  ],
};

const board = (f: CardFacts) =>
  `Vị trí minh họa trên một bảng mạch mô phỏng. ${f.prefix === 'dual' ? 'ASUS' : 'MSI'} không công bố sơ đồ bo mạch; vị trí, giá trị và đường đi dây được dựng sao cho nhất quán với nhau chứ không sao chép từ mạch thật.`;

function cardConcepts(f: CardFacts): Concept[] {
  const exterior = `Hình học minh họa phỏng theo ${f.name}. ${f.envelope} Hình dạng chi tiết, số lá tản nhiệt và đường đi dây chỉ mang tính ước lượng.`;
  const id = (name: string) => f.prefix + name;
  const part = (
    name: string,
    e: Omit<Entry, 'id' | 'level' | 'representationType' | 'parent'> & {
      parent?: string;
      sources: SourceId[];
      accuracy?: 'board';
    },
  ) =>
    concept({
      ...e,
      id: id(name),
      parent: e.parent ? id(e.parent) : id('card'),
      level: f.level,
      representationType: 'physical',
      physicalAccuracy: e.accuracy === 'board' ? board(f) : exterior,
    });
  const onBoard = (
    name: string,
    category: Category,
    e: Omit<
      Entry,
      'id' | 'level' | 'representationType' | 'parent' | 'category'
    > & {
      sources: SourceId[];
      parent?: string;
    },
  ) =>
    part(name, {
      ...e,
      category,
      parent: e.parent ?? 'pcb',
      accuracy: 'board',
    });

  return [
    concept({
      id: id('card'),
      name: f.name,
      shortName: f.shortName,
      category: 'Graphics',
      parent: 'graphicscard',
      level: f.level,
      open: f.level,
      description: f.description,
      purpose:
        'Dựng hình game và xử lý tính toán song song lẫn tác vụ AI, với nhân RT cho dò tia và nhân Tensor cho tính toán ma trận.',
      quantity: '1 mẫu tham chiếu',
      specifications: f.card,
      representationType: 'physical',
      physicalAccuracy: exterior,
      sources: [...f.maker, ...f.design, 'rtx5060family'],
      searchTerms: f.searchTerms,
    }),
    part('shroud', {
      name: 'Vỏ ốp tản nhiệt',
      category: 'Cooling',
      description:
        f.prefix === 'dual'
          ? 'Phần vỏ tối màu có hai lỗ quạt tròn cùng cặp thanh trang trí màu xám ở giữa.'
          : 'Phần vỏ màu sâm-panh có một lỗ quạt tròn và viền sáng bao quanh quạt.',
      purpose: 'Giữ cố định các quạt và hướng luồng gió thổi xuống khối tản nhiệt.',
      quantity: '1 vỏ ốp mô phỏng',
      specifications: { 'Số quạt': f.prefix === 'dual' ? '2' : '1' },
      sources: [...f.maker, ...f.design],
      searchTerms: ['cover', 'exterior', 'vỏ ốp'],
    }),
    part('fan', {
      name: f.prefix === 'dual' ? 'Quạt Axial-tech' : 'Quạt STORMFORCE',
      shortName: 'Quạt',
      category: 'Cooling',
      ...f.fans,
      purpose: 'Ép luồng gió đi xuống qua các lá tản nhiệt rồi thoát ra khỏi card.',
      sources: [...f.design, 'fanconstruction'],
      searchTerms: ['cooling', 'airflow', 'blades', 'quạt', 'tản nhiệt'],
    }),
    part('fanmotor', {
      name: 'Mô-tơ quạt không chổi than',
      shortName: 'Mô-tơ quạt',
      category: 'Cooling',
      parent: 'fan',
      description: 'Stato quấn dây và ổ trục nằm dưới trục của mỗi cánh quạt.',
      purpose: 'Làm quay cánh quạt đúng theo tốc độ mà bo mạch yêu cầu.',
      quantity: f.prefix === 'dual' ? '2 mô-tơ mô phỏng' : '1 mô-tơ mô phỏng',
      specifications: { 'Truyền động': 'Không chổi than DC (BLDC)' },
      sources: ['bldc', 'bearing'],
      searchTerms: ['motor', 'stator', 'bearing', 'mô-tơ quạt'],
    }),
    part('heatsink', {
      ...f.heatsink,
      shortName: 'Tản nhiệt',
      category: 'Cooling',
      purpose:
        'Phân tán nhiệt lượng của GPU ra bề mặt kim loại đủ rộng để luồng gió quạt mang đi.',
      quantity: '1 cụm hoàn chỉnh',
      sources: f.design,
      searchTerms: ['fins', 'radiator', 'heat sink', 'tản nhiệt', 'lá tản nhiệt'],
    }),
    ...(f.prefix === 'dual'
      ? [
          part('coldplate', {
            name: 'Đế tiếp xúc (Cold plate)',
            shortName: 'Đế tiếp xúc',
            category: 'Cooling',
            description:
              'Khối đồng áp lên GPU, gắn trên khung đồng thời ép vào miếng tản nhiệt của bộ nhớ và mạch nguồn.',
            purpose: 'Thu nhiệt từ die GPU truyền sang các ống dẫn nhiệt.',
            quantity: '1 đế mô phỏng',
            specifications: { 'Bề mặt tiếp xúc': 'Đồng' },
            sources: f.design,
            searchTerms: ['base', 'copper', 'contact', 'đế đồng', 'đế tiếp xúc'],
          }),
          part('heatpipe', {
            name: 'Ống dẫn nhiệt (Heatpipe)',
            shortName: 'Ống dẫn nhiệt',
            category: 'Cooling',
            description:
              'Các ống đồng kín chạy từ đế tiếp xúc dọc theo khối lá tản nhiệt.',
            purpose:
              'Truyền nhiệt từ GPU ra tận hai đầu của khối lá tản nhiệt bằng cơ chế bay hơi và ngưng tụ chất lỏng bên trong.',
            quantity: '3 ống mô phỏng',
            specifications: { 'Số lượng': 'Không công bố; vẽ minh họa 3 ống' },
            sources: f.design,
            searchTerms: ['heatpipe', 'copper', 'vapor', 'ống dẫn nhiệt'],
          }),
        ]
      : [
          part('core', {
            name: 'Lõi đồng',
            shortName: 'Lõi đồng',
            category: 'Cooling',
            parent: 'heatsink',
            description:
              'Trụ đồng đặc đặt trên GPU, làm trục chính để các lá tản nhiệt tỏa tròn xung quanh.',
            purpose:
              'Dẫn nhiệt của GPU đi thẳng lên và tỏa đều ra mọi lá tản nhiệt cùng lúc mà không cần ống dẫn nhiệt.',
            quantity: '1 lõi mô phỏng',
            specifications: { 'Chất liệu': 'Đồng dẫn nhiệt cao' },
            sources: f.design,
            searchTerms: ['copper', 'core', 'base', 'lõi đồng'],
          }),
        ]),
    part('backplate', {
      name: 'Tấm ốp lưng có khe thoáng',
      shortName: 'Ốp lưng',
      category: 'Cooling',
      description: f.backplate,
      purpose:
        'Chống cong xệ card và cho phép khí nóng thoát ra từ mặt sau.',
      quantity: '1 tấm mô phỏng',
      specifications: {
        'Khe thoát gió':
          f.prefix === 'dual'
            ? 'Vượt quá đuôi bo mạch'
            : 'Xẻ rãnh phía trên bo mạch',
      },
      sources: [...f.maker, ...f.design],
      searchTerms: ['back plate', 'vent', 'ốp lưng', 'backplate'],
    }),
    part('bracket', {
      name: 'Thanh chắn I/O',
      shortName: 'Thanh chắn',
      category: 'Chassis',
      description:
        'Tấm thép bắt vít vào thùng máy và giữ các cổng xuất hình.',
      purpose: 'Cố định card vào thùng máy và để lộ các cổng xuất hình ảnh.',
      quantity: '1 thanh chắn mô phỏng',
      specifications: { 'Độ rộng': f.prefix === 'dual' ? '2.5 khe' : '2 khe' },
      sources: f.maker,
      searchTerms: ['bracket', 'pci bracket', 'slot cover', 'thanh chắn'],
    }),
    part('fastener', {
      name: 'Ốc vít',
      shortName: 'Ốc vít',
      category: 'Chassis',
      description:
        'Các ốc vít giữ vỏ ốp vào khối tản nhiệt và cố định tấm ốp lưng vào bo mạch.',
      purpose:
        'Giữ toàn bộ cụm linh kiện liền khối và ép chặt bộ tản nhiệt lên GPU.',
      quantity: '8 ốc vít mô phỏng',
      specifications: { 'Vị trí': 'Minh họa' },
      sources: [...f.maker, ...f.design],
      searchTerms: ['screw', 'fastener', 'ốc vít'],
    }),
    part('thermalpad', {
      name: 'Miếng dán tản nhiệt (Thermal pad)',
      shortName: 'Thermal pad',
      category: 'Cooling',
      description:
        'Các miếng đệm mềm đặt giữa từng chip nhớ và khối tản nhiệt phía trên.',
      purpose: 'Lấp đầy khe hở để nhiệt từ bộ nhớ truyền sang khối kim loại.',
      quantity: '4 miếng mô phỏng',
      specifications: { 'Vị trí': 'Một miếng cho mỗi chip nhớ' },
      sources: f.design,
      searchTerms: ['pad', 'thermal', 'miếng tản nhiệt'],
    }),
    part('tim', {
      name: 'Keo tản nhiệt',
      shortName: 'Keo tản nhiệt',
      category: 'Cooling',
      description: 'Một lớp hợp chất mỏng phủ trên bề mặt die GPU trần.',
      purpose: 'Lấp đầy các khe hở siêu nhỏ giữa bề mặt die và đế tản nhiệt.',
      quantity: '1 lớp mô phỏng',
      specifications: { 'Vị trí': 'Bề mặt die GPU' },
      sources: [...f.maker, ...f.design],
      searchTerms: ['paste', 'thermal interface', 'keo tản nhiệt'],
    }),
    part('retention', {
      name: 'Ngàm giữ chữ X',
      shortName: 'Ngàm chữ X',
      category: 'Chassis',
      description: 'Thanh lò xo chữ thập ở mặt sau bo mạch ngay phía sau GPU.',
      purpose: 'Kéo cụm tản nhiệt ép xuống bề mặt die với lực đều nhau.',
      quantity: '1 ngàm mô phỏng',
      specifications: { 'Hình dạng': 'Chữ thập' },
      sources: [...f.maker, ...f.design],
      searchTerms: ['x bracket', 'mounting pressure', 'ngàm giữ'],
    }),
    part('standoff', {
      name: 'Trụ đệm tản nhiệt',
      shortName: 'Trụ đệm',
      category: 'Chassis',
      parent: 'pcb',
      description:
        'Các trụ có ren xung quanh GPU để bắt vít cụm tản nhiệt xuống.',
      purpose: 'Cố định khoảng hở chiều cao của tản nhiệt phía trên die.',
      quantity: '4 trụ mô phỏng',
      specifications: { 'Vị trí': 'Minh họa' },
      sources: [...f.maker, ...f.design],
      searchTerms: ['standoff', 'mount', 'trụ đệm'],
    }),
    part('pcb', {
      name: 'Bảng mạch in của card (PCB)',
      shortName: 'PCB',
      category: 'Board',
      description:
        f.prefix === 'dual'
          ? 'Bo mạch ngắn nằm dưới quạt thứ nhất và GPU; quá phần đuôi mạch, quạt thứ hai thổi xuyên qua tấm ốp lưng có khe thoáng.'
          : 'Bo mạch dài gần hết chiều dài card, mang GPU, bộ nhớ, các tầng công suất và cổng xuất hình.',
      purpose: 'Kết nối GPU với bộ nhớ, nguồn điện và khe cắm PCIe.',
      quantity: '1 bo mạch mô phỏng',
      specifications: { 'Chiều dài': 'Minh họa' },
      accuracy: 'board',
      sources: f.maker,
      searchTerms: ['pcb', 'circuit board', 'bảng mạch'],
    }),
    onBoard('package', 'Board', {
      name: 'Gói chip GPU',
      shortName: 'Gói GPU',
      description:
        'Đế mạch mang die GPU Blackwell và tỏa các đường kết nối của nó ra bảng mạch.',
      purpose:
        'Làm cầu nối từ các chân tiếp xúc siêu nhỏ của die ra đường nguồn và tín hiệu trên bo mạch.',
      quantity: '1 gói GPU',
      specifications: {
        'Kiến trúc': 'Blackwell',
        'Nhân CUDA': f.card['Nhân CUDA'],
        'Kích thước gói': 'Minh họa',
      },
      sources: ['rtx5060family', 'whitepaper'],
      searchTerms: ['gpu', 'processor', 'chip', 'gói gpu'],
    }),
    onBoard('silicon', 'Compute', {
      name: 'Die GPU',
      shortName: 'Die GPU',
      parent: 'package',
      description:
        'Bộ xử lý đồ họa Blackwell, nằm ở chính giữa gói chip.',
      purpose:
        'Chứa các nhân shader, nhân RT, nhân Tensor, bộ nhớ đệm và bộ điều khiển bộ nhớ.',
      quantity: '1 die',
      specifications: { 'Kiến trúc': 'Blackwell', 'Kích thước die': 'Minh họa' },
      sources: ['rtx5060family', 'whitepaper'],
      searchTerms: ['silicon', 'die', 'chip'],
    }),
    onBoard('bga', 'Board', {
      name: 'Mối hàn bi BGA',
      shortName: 'BGA',
      parent: 'package',
      description: 'Lưới các viên bi hàn nằm bên dưới gói chip.',
      purpose: 'Truyền nguồn điện, tín hiệu và gắn chặt gói chip vào bo mạch.',
      quantity: '1 lưới bi hàn mô phỏng',
      specifications: { 'Số lượng': 'Minh họa' },
      sources: ['packaging'],
      searchTerms: ['solder', 'balls', 'mối hàn bi'],
    }),
    onBoard('gddr7', 'Memory', {
      name: 'Bộ nhớ GDDR7',
      shortName: 'GDDR7',
      description: f.memory.note,
      purpose: 'Lưu trữ texture, dữ liệu hình học và dữ liệu khung hình ngay sát GPU.',
      quantity: '4 chip nhớ mô phỏng',
      specifications: {
        'Dung lượng': f.memory.capacity,
        'Giao tiếp': '128-bit · 4 kênh 32-bit',
        'Tốc độ dữ liệu': '28 Gbps',
        'Băng thông': '448 GB/s',
      },
      sources: [...f.maker, 'rtx5060family', 'whitepaper'],
      searchTerms: ['vram', 'memory', 'framebuffer', 'bộ nhớ đồ họa'],
    }),
    onBoard('vrm', 'Power', {
      name: 'Cuộn cảm VRM',
      shortName: 'Cuộn cảm',
      description: 'Các cuộn cảm giúp làm phẳng đầu ra của từng pha nguồn.',
      purpose: 'Tích trữ và giải phóng năng lượng để GPU luôn nhận điện áp thấp ổn định.',
      quantity: 'Bộ linh kiện đại diện',
      specifications: { 'Số pha': f.phases },
      sources: ['multiphase'],
      searchTerms: ['inductor', 'choke', 'vrm', 'cuộn cảm'],
    }),
    onBoard('powerstage', 'Power', {
      name: f.prefix === 'itx' ? 'Tầng công suất DrMOS' : 'Tầng công suất',
      shortName: 'Power stage',
      description:
        'Mạch kích và các bóng bán dẫn đóng cắt tích hợp trong một gói, đặt dưới mỗi cuộn cảm.',
      purpose:
        'Đóng cắt điện áp 12 V đủ nhanh để các cuộn cảm biến đổi thành điện áp lõi cho GPU.',
      quantity: 'Bộ linh kiện đại diện',
      specifications: {
        'Loại': f.prefix === 'itx' ? 'DrMOS (MSI)' : 'Tầng công suất tích hợp',
      },
      sources: f.prefix === 'itx' ? [...f.maker, 'mpsphase'] : ['mpsphase'],
      searchTerms: ['mosfet', 'drmos', 'vrm', 'tầng công suất'],
    }),
    onBoard('pwm', 'Power', {
      name: 'IC điều khiển pha',
      shortName: 'PWM',
      description: 'Bộ điều khiển định thời gian hoạt động cho mọi pha nguồn.',
      purpose: 'Điều phối xen kẽ các pha và giữ đúng mức điện áp mà GPU yêu cầu.',
      quantity: '1 bộ điều khiển mô phỏng',
      specifications: { 'Vị trí': 'Minh họa' },
      sources: ['mpscontroller'],
      searchTerms: ['controller', 'pwm', 'điều khiển pha'],
    }),
    onBoard('capacitor', 'Power', {
      name: 'Tụ rắn polymer',
      shortName: 'Tụ điện',
      description: 'Hàng tụ rắn đặt tại đầu ra của mạch ổn áp.',
      purpose: 'Hứng các biến động tải nhanh trước khi mạch ổn áp kịp phản ứng.',
      quantity: 'Bộ linh kiện đại diện',
      specifications: { 'Loại': 'Tụ rắn polymer' },
      sources: ['multiphase'],
      searchTerms: ['capacitor', 'cap', 'tụ rắn'],
    }),
    onBoard('mlcc', 'Power', {
      name: 'Tụ gốm',
      shortName: 'MLCC',
      description: 'Các tụ gốm đa lớp siêu nhỏ rải đều trên bo mạch.',
      purpose: 'Lọc nhiễu nguồn ngay sát các chân linh kiện cần dòng sạch.',
      quantity: 'Rải đều đại diện',
      specifications: { 'Vị trí': 'Đại diện' },
      sources: ['multiphase'],
      searchTerms: ['mlcc', 'ceramic', 'decoupling', 'tụ gốm'],
    }),
    onBoard('resistor', 'Board', {
      name: 'Điện trở',
      shortName: 'Điện trở',
      description: 'Các điện trở dán bề mặt nằm xen kẽ cùng linh kiện thụ động khác.',
      purpose: 'Thiết lập điểm phân cực, điện trở kéo lên và mức đo dòng.',
      quantity: 'Rải đều đại diện',
      specifications: { 'Vị trí': 'Đại diện' },
      sources: ['multiphase'],
      searchTerms: ['resistor', 'passive', 'điện trở'],
    }),
    onBoard('pcie', 'Board', {
      name: 'Chân cắm PCIe',
      shortName: 'PCIe',
      description:
        'Chân cắm ×16 dài đủ chuẩn nhưng các tiếp điểm mạ vàng dừng lại sau làn thứ tám.',
      purpose:
        'Truyền dữ liệu tới bộ xử lý qua tám làn PCIe và nhận tối đa 75 W nguồn điện từ khe cắm.',
      quantity: '1 giao tiếp',
      specifications: {
        'Kết nối':
          f.prefix === 'itx'
            ? 'PCI Express 5.0 ×8 trên chân cắm ×16'
            : 'PCI Express 5.0',
      },
      sources: ['pcie', ...f.maker],
      searchTerms: ['bus', 'slot', 'connector', 'x8', 'chân cắm pcie'],
    }),
    onBoard('power', 'Power', {
      name: 'Đầu cắm nguồn 8-pin',
      shortName: 'Đầu cắm nguồn',
      description: 'Một ổ cắm nguồn PCIe 8-pin duy nhất ở cạnh trên của card.',
      purpose: 'Cung cấp thêm công suất vượt ngoài mức khe cắm PCIe có thể cấp.',
      quantity: '1 ổ cắm',
      specifications: { 'Đầu cắm': '1 × 8-pin', 'Nguồn khuyến nghị': '550 W' },
      sources: [...f.maker, 'rtx5060family', 'psu'],
      searchTerms: ['8 pin', 'pcie power', 'đầu nguồn'],
    }),
    onBoard('bios', 'Board', {
      name: 'Bộ nhớ Flash VBIOS',
      shortName: 'VBIOS',
      description: 'Chip nhớ flash nối tiếp chứa firmware của card.',
      purpose: 'Lưu trữ mã khởi động và cấu hình bo mạch.',
      quantity: '1 chip mô phỏng',
      specifications: { 'Vị trí': 'Minh họa' },
      sources: ['flash'],
      searchTerms: ['firmware', 'bios'],
    }),
    onBoard('displayport', 'Board', {
      name: 'Cổng xuất hình DisplayPort',
      shortName: 'DisplayPort',
      description: 'Ba ổ cắm DisplayPort 2.1b gắn xuyên qua thanh chắn I/O.',
      purpose: 'Xuất hình ra màn hình ở tần số quét và độ phân giải cao.',
      quantity: '3 ổ cắm',
      specifications: { 'Phiên bản': 'DisplayPort 2.1b' },
      sources: f.maker,
      searchTerms: ['dp', 'display', 'monitor', 'cổng xuất hình'],
    }),
    onBoard('hdmi', 'Board', {
      name: 'Cổng xuất hình HDMI',
      shortName: 'HDMI',
      description: 'Một ổ cắm HDMI 2.1b nằm cạnh các cổng DisplayPort.',
      purpose: 'Xuất hình và âm thanh ra TV hoặc màn hình qua chuẩn HDMI.',
      quantity: '1 ổ cắm',
      specifications: { 'Phiên bản': 'HDMI 2.1b' },
      sources: f.maker,
      searchTerms: ['hdmi', 'tv', 'cổng hdmi'],
    }),
    onBoard('fanheader', 'Cooling', {
      name: 'Chân cắm quạt',
      shortName: 'Chân cắm quạt',
      description: 'Đầu nối trên bo mạch để cắm dây dẫn từ quạt.',
      purpose: 'Cấp nguồn cho quạt và đọc tốc độ quay của quạt.',
      quantity: '1 chân cắm mô phỏng',
      specifications: { 'Số chân': '4' },
      sources: ['bldc'],
      searchTerms: ['fan connector', 'pwm', 'chân cắm quạt'],
    }),
    part('fancable', {
      name: 'Dây dẫn quạt',
      shortName: 'Dây quạt',
      category: 'Cooling',
      parent: 'fanheader',
      description: 'Các sợi dây 4 lõi nối từ chân cắm lên mô-tơ quạt.',
      purpose: 'Cấp nguồn cho quạt, truyền tín hiệu điều tốc và đưa xung đo tốc độ về.',
      quantity: f.prefix === 'dual' ? '2 dây mô phỏng' : '1 dây mô phỏng',
      specifications: { 'Số lõi dây': '4' },
      accuracy: 'board',
      sources: ['bldc'],
      searchTerms: ['cable', 'wire', 'dây quạt'],
    }),
    onBoard('esd', 'Board', {
      name: 'Mạch bảo vệ tĩnh điện (ESD)',
      shortName: 'ESD',
      description: 'Các linh kiện bảo vệ nhỏ nằm ngay sau các cổng xuất hình.',
      purpose:
        'Hấp thụ xung phóng tĩnh điện từ dây cáp cắm ngoài trước khi xung đó chạm tới GPU.',
      quantity: '4 linh kiện mô phỏng',
      specifications: { 'Vị trí': 'Phía sau các cổng xuất hình' },
      sources: ['esd'],
      searchTerms: ['esd', 'protection', 'tvs', 'chống tĩnh điện'],
    }),
    onBoard('crystal', 'Board', {
      name: 'Thạch anh tạo dao động',
      shortName: 'Thạch anh',
      description: 'Bộ tạo xung tham chiếu thạch anh bọc vỏ kim loại.',
      purpose:
        'Cung cấp tần số chuẩn ổn định cho GPU để tạo ra mọi xung nhịp khác.',
      quantity: '1 thạch anh mô phỏng',
      specifications: { 'Vị trí': 'Minh họa' },
      sources: ['crystal'],
      searchTerms: ['clock', 'quartz', 'thạch anh'],
    }),
    ...(f.prefix === 'itx'
      ? [
          onBoard('fuse', 'Power', {
            name: 'Cầu chì trên bo mạch',
            shortName: 'Cầu chì',
            description:
              'Các cầu chì dán bề mặt nằm cạnh ổ cắm 8-pin, được MSI tích hợp sẵn trên bo mạch.',
            purpose:
              'Ngắt mạch trước khi sự cố trên đường nguồn đầu vào kịp làm hỏng phần còn lại của card.',
            quantity: '2 cầu chì mô phỏng',
            specifications: { 'Vị trí': 'Minh họa' },
            sources: [...f.maker, 'fuse'],
            searchTerms: ['fuse', 'protection', 'cầu chì'],
          }),
        ]
      : []),
  ];
}

export const dualCardConcepts = cardConcepts(dual);
export const itxCardConcepts = cardConcepts(itx);
