import { concept, standard, type Concept } from '../concept.ts';
import type { LevelId } from '../levels.ts';
import type { SourceId } from '../sources.ts';

/**
 * Inside the power supply.
 *
 * A switching supply always has the same spine: filter the mains, rectify it to
 * high-voltage DC, chop that at high frequency through a transformer, then
 * rectify and smooth the low-voltage side. Every block below is one step of
 * that chain, and the layout follows it left to right.
 *
 * Exterior dimensions, fan diameter, output rating and cable architecture follow
 * ASUS product documentation. Internal placement and circuit populations remain
 * illustrative; ASUS does not publish a service-level board layout.
 */
export const psuConcepts: Concept[] = [
  concept({
    id: 'psucase',
    name: 'Vỏ nguồn TUF Gaming 850W Gold',
    shortName: 'Vỏ nguồn 850W',
    category: 'Chassis',
    // An alternative to the 1000W the tower carries, so like the other
    // alternatives it stands under the machine, not the tower's PSU.
    parent: 'pc',
    level: 'psu',
    open: 'psu',
    description:
      'Lớp vỏ thép dập kích thước 150 × 150 × 86 mm của bộ nguồn ASUS TUF Gaming 850W Gold.',
    purpose:
      'Bao bọc các linh kiện điện áp lưới, nối đất an toàn và dẫn luồng khí hút qua toàn bộ bo mạch trước khi thoát ra ngoài.',
    quantity: '1 vỏ nguồn mô phỏng',
    specifications: {
      'Chuẩn kích thước': 'ATX',
      'Kích thước': '150 × 150 × 86 mm',
      'Công suất': '850 W',
      'Hiệu suất': '80 PLUS Gold',
      'Cáp nguồn': 'Modular toàn phần (Full-modular)',
    },
    representationType: 'physical',
    physicalAccuracy:
      'Kích thước và đặc điểm bên ngoài theo thông số công bố của ASUS TUF Gaming 850W Gold; cấu trúc hình học và vị trí linh kiện bên trong chỉ mang tính minh họa.',
    sources: ['tuf850g', 'psu'],
    searchTerms: [
      'psu',
      'case',
      'shell',
      'housing',
      'enclosure',
      'vỏ nguồn',
      'bộ nguồn',
    ],
  }),
  concept({
    id: 'psuintake',
    name: 'Quạt bộ nguồn',
    shortName: 'Quạt nguồn',
    category: 'Cooling',
    parent: 'psucase',
    level: 'psu',
    description:
      'Quạt hướng trục 135 mm nằm sau lưới tản nhiệt lớn ở mặt trên, hút gió thổi qua bo mạch và thoát ra mặt sau.',
    purpose:
      'Giải nhiệt cho các linh kiện đóng cắt, biến áp và mạch chỉnh lưu với độ ồn thấp.',
    quantity: '1 quạt mô phỏng',
    specifications: {
      'Đường kính': '135 mm',
      'Cửa hút gió': 'Mặt trên có lưới bảo vệ',
      'Điều khiển': 'Tự điều tốc theo nhiệt độ',
    },
    representationType: 'physical',
    sources: ['tuf850fan', 'fanconstruction', 'bldc'],
    searchTerms: ['fan', 'intake', 'cooling', 'airflow', 'quạt nguồn', 'tản nhiệt'],
  }),
  concept({
    id: 'psuboard',
    name: 'Bo mạch nguồn',
    shortName: 'Bo mạch',
    category: 'Board',
    parent: 'psucase',
    level: 'psu',
    description:
      'Một bo mạch duy nhất chứa toàn bộ chuỗi chuyển đổi điện áp, với khe cách ly rộng ở chính giữa.',
    purpose:
      'Tách biệt hoàn toàn về mặt vật lý và điện học giữa phía điện áp lưới (sơ cấp) và phía điện áp thấp (thứ cấp) cấp cho máy tính.',
    quantity: '1 bo mạch mô phỏng',
    specifications: { 'Cách ly': 'Ranh giới sơ cấp / thứ cấp' },
    representationType: 'physical',
    sources: ['acdc', 'psu'],
    searchTerms: [
      'pcb',
      'board',
      'isolation',
      'primary',
      'secondary',
      'bo mạch nguồn',
      'cách ly',
    ],
  }),
  concept({
    id: 'psuinlet',
    name: 'Ổ cắm nguồn AC và công tắc',
    shortName: 'Ổ cắm AC',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Ổ cắm ba chấu và công tắc bập bênh nơi điện lưới đi vào bộ nguồn, có sẵn chân nối đất.',
    purpose:
      'Đưa dòng điện xoay chiều vào qua đầu nối có khấc định hướng và chân tiếp địa, tránh cắm nhầm chiều.',
    quantity: '1 ổ cắm mô phỏng',
    specifications: {
      'Loại': 'Ổ cắm thiết bị C14',
      'Chân tiếp xúc': 'Dây nóng · dây nguội · tiếp địa',
    },
    representationType: 'physical',
    physicalAccuracy: standard,
    sources: ['psu'],
    searchTerms: ['iec', 'c14', 'mains', 'inlet', 'switch', 'ac', 'ổ cắm', 'công tắc'],
  }),
  concept({
    id: 'psufilter',
    name: 'Mạch lọc nhiễu đầu vào (EMI)',
    shortName: 'Lọc EMI',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Các cuộn cảm chế độ chung và cụm tụ an toàn nằm ngay phía sau ổ cắm nguồn.',
    purpose:
      'Ngăn nhiễu đóng cắt từ bộ nguồn dội ngược ra lưới điện, đồng thời làm dịu các xung áp đột biến từ bên ngoài.',
    quantity: '2 cuộn cảm mô phỏng',
    specifications: { 'Linh kiện': 'Cuộn cảm chế độ chung · tụ X và tụ Y' },
    representationType: 'physical',
    sources: ['acdc'],
    searchTerms: ['emi', 'filter', 'choke', 'noise', 'x capacitor', 'lọc nhiễu'],
  }),
  concept({
    id: 'psubridge',
    name: 'Cầu chỉnh lưu',
    shortName: 'Cầu chỉnh lưu',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Khối bốn đi-ốt gắn chặt vào phiến tản nhiệt, biến đổi dòng xoay chiều thành dòng một chiều nhấp nhô.',
    purpose:
      'Chuyển dạng sóng xoay chiều đầu vào thành dòng điện một chiều để các tầng sau của bộ nguồn xử lý.',
    quantity: '1 cầu chỉnh lưu mô phỏng',
    specifications: { 'Cấu tạo': '4 đi-ốt trong một vỏ' },
    representationType: 'physical',
    sources: ['acdc'],
    searchTerms: ['bridge', 'rectifier', 'diode', 'ac to dc', 'cầu chỉnh lưu', 'đi-ốt'],
  }),
  concept({
    id: 'psupfc',
    name: 'Mạch hiệu chỉnh hệ số công suất (PFC)',
    shortName: 'Tầng PFC',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Cuộn cảm quấn dây cỡ lớn cùng linh kiện đóng cắt và đi-ốt, nâng điện áp lưới đã chỉnh lưu lên mức đường điện một chiều cao áp.',
    purpose:
      'Giúp bộ nguồn rút dòng đồng pha với dạng sóng điện lưới thay vì giật cục theo xung nhọn, đồng thời cấp đường điện cao áp ổn định.',
    quantity: '1 tầng tăng áp mô phỏng',
    specifications: { 'Cấu trúc mạch': 'Mạch tăng áp (Boost converter), minh họa' },
    representationType: 'physical',
    sources: ['acdc'],
    searchTerms: ['pfc', 'power factor', 'boost', 'inductor', 'choke', 'hệ số công suất'],
  }),
  concept({
    id: 'psubulk',
    name: 'Tụ lọc chính (Bulk capacitor)',
    shortName: 'Tụ chính',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Tụ hóa hình trụ lớn ở phía cao áp, là linh kiện đơn lẻ to nhất trên bo mạch.',
    purpose:
      'Tích trữ đủ năng lượng để nuôi hệ thống qua các khoảng trống giữa những đỉnh sóng điện lưới và qua các lần sụt áp thoáng qua.',
    quantity: '1 tụ điện mô phỏng',
    specifications: { 'Vai trò': 'Tích trữ năng lượng cao áp' },
    representationType: 'physical',
    sources: ['acdc'],
    searchTerms: ['capacitor', 'bulk', 'hold-up', 'electrolytic', 'can', 'tụ chính', 'tụ lọc'],
  }),
  concept({
    id: 'psuswitch',
    name: 'Linh kiện đóng cắt sơ cấp',
    shortName: 'Mạch đóng cắt',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Các bóng bán dẫn gắn trên phiến tản nhiệt sơ cấp cao, băm xung đường điện cao áp hàng chục nghìn lần mỗi giây.',
    purpose:
      'Biến dòng một chiều ổn định trở lại thành xoay chiều tần số cao — cách duy nhất để truyền qua một biến áp nhỏ gọn như vậy.',
    quantity: '4 linh kiện mô phỏng',
    specifications: { 'Vai trò': 'Đóng cắt phía cao / phía thấp' },
    representationType: 'physical',
    sources: ['acdc'],
    searchTerms: ['mosfet', 'switch', 'transistor', 'primary', 'inverter', 'đóng cắt', 'sơ cấp'],
  }),
  concept({
    id: 'psutransformer',
    name: 'Biến áp chính',
    shortName: 'Biến áp',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Lõi ferit quấn băng cách điện bắc ngang qua khe cách ly, với các cuộn dây nằm ở cả hai phía.',
    purpose:
      'Hạ điện áp cao đã băm xung xuống khoảng 12 V, đồng thời là rào cản cách ly điện lưới khỏi máy tính.',
    quantity: '1 biến áp mô phỏng',
    specifications: { 'Lõi': 'Ferit', 'Vai trò': 'Hạ áp và cách ly' },
    representationType: 'physical',
    sources: ['acdc'],
    searchTerms: ['transformer', 'ferrite', 'isolation', 'winding', 'core', 'biến áp', 'cách ly'],
  }),
  concept({
    id: 'psusinks',
    name: 'Tản nhiệt mạch đóng cắt',
    shortName: 'Phiến tản nhiệt',
    category: 'Cooling',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Hai vách nhôm có lá tản nhiệt cao ở hai bên biến áp, mỗi bên phục vụ một phía điện áp.',
    purpose:
      'Dẫn nhiệt từ các linh kiện đóng cắt và mạch chỉnh lưu ra luồng gió do quạt thổi qua.',
    quantity: '2 phiến tản nhiệt mô phỏng',
    specifications: { 'Vị trí': 'Phía sơ cấp và thứ cấp' },
    representationType: 'physical',
    sources: ['acdc'],
    searchTerms: ['heatsink', 'fins', 'cooling', 'aluminium', 'tản nhiệt'],
  }),
  concept({
    id: 'psusecondary',
    name: 'Mạch chỉnh lưu thứ cấp',
    shortName: 'Chỉnh lưu thứ cấp',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Các bóng bán dẫn điện áp thấp đóng mở đồng bộ với biến áp, nằm ở phía máy tính của rào cản cách ly.',
    purpose:
      'Chỉnh lưu đầu ra của biến áp với mức hao phí ít hơn nhiều so với đi-ốt, tạo ra đường nguồn +12 V.',
    quantity: '6 linh kiện mô phỏng',
    specifications: { 'Phương pháp': 'Chỉnh lưu đồng bộ (Synchronous rectification)' },
    representationType: 'physical',
    sources: ['acdc'],
    searchTerms: ['synchronous', 'rectifier', 'secondary', '12v', 'mosfet', 'chỉnh lưu thứ cấp'],
  }),
  concept({
    id: 'psudcdc',
    name: 'Mạch chuyển đổi DC-DC đường phụ',
    shortName: 'DC-DC',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Các bo mạch con nhỏ dựng đứng trên bo mạch chính, lấy nguồn từ đường 12 V.',
    purpose:
      'Tạo ra các đường nguồn +5 V và +3.3 V cục bộ, giúp ổn định điện áp tốt hơn so với việc lấy thêm cuộn dây phụ trên biến áp.',
    quantity: '2 mạch chuyển đổi mô phỏng',
    specifications: { 'Đường nguồn': '+5 V · +3.3 V' },
    representationType: 'physical',
    sources: ['multiphase', 'psu'],
    searchTerms: ['dc-dc', 'buck', '5v', '3.3v', 'rail', 'daughterboard', 'đường phụ'],
  }),
  concept({
    id: 'psuoutput',
    name: 'Tụ lọc đầu ra',
    shortName: 'Tụ đầu ra',
    category: 'Power',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Dãy tụ trở kháng thấp và cuộn cảm nhỏ ở đầu ra của bo mạch.',
    purpose:
      'Làm phẳng phần gợn sóng đóng cắt còn sót lại và cấp dòng tức thời khi tải tăng đột ngột.',
    quantity: '8 tụ điện mô phỏng',
    specifications: { 'Loại': 'Tụ hóa Low-ESR và tụ rắn polymer' },
    representationType: 'physical',
    sources: ['acdc'],
    searchTerms: ['capacitor', 'output', 'ripple', 'filter', 'esr', 'tụ đầu ra'],
  }),
  concept({
    id: 'psusupervisor',
    name: 'Mạch giám sát và điều khiển',
    shortName: 'Mạch giám sát',
    category: 'Board',
    parent: 'psuboard',
    level: 'psu',
    description:
      'Bộ điều khiển vận hành quá trình đóng cắt, cùng mạch bảo vệ theo dõi từng đường điện áp.',
    purpose:
      'Giữ các đường nguồn ổn định, phát tín hiệu sẵn sàng (Power-good) khi điện áp đạt chuẩn và ngắt nguồn khi quá dòng, quá áp hoặc quá nhiệt.',
    quantity: '2 bộ điều khiển mô phỏng',
    specifications: { 'Tín hiệu': 'Power-on · Power-good' },
    representationType: 'physical',
    sources: ['psu', 'acdc'],
    searchTerms: [
      'supervisor',
      'controller',
      'protection',
      'power good',
      'ocp',
      'giám sát',
      'bảo vệ',
    ],
  }),
  concept({
    id: 'psumodular',
    name: 'Bảng đầu cắm cáp rời (Modular)',
    shortName: 'Đầu cắm modular',
    category: 'Power',
    parent: 'psucase',
    level: 'psu',
    description:
      'Các ổ cắm có khấc định hướng ở mặt hướng vào trong thùng máy, mỗi ổ đều ghi nhãn rõ loại cáp được phép cắm.',
    purpose:
      'Chỉ lắp đúng những sợi cáp mà cấu hình máy thực sự cần, tránh dây thừa chiếm chỗ trong thùng máy.',
    quantity: '8 cụm ổ cắm mô phỏng',
    specifications: {
      'Đầu ra': '24-pin · EPS · PCIe 16-pin · PCIe 8-pin · SATA',
    },
    representationType: 'physical',
    physicalAccuracy:
      'Nhóm ổ cắm theo tài liệu của ASUS; hình dạng và vị trí từng ổ cắm chỉ mang tính minh họa.',
    sources: ['tuf850g', 'psu'],
    searchTerms: ['modular', 'connector', 'socket', 'cable', 'output', 'đầu cắm', 'cáp rời'],
  }),
  concept({
    id: 'psugrille',
    name: 'Lưới thoát gió mặt sau',
    shortName: 'Lưới thoát gió',
    category: 'Cooling',
    parent: 'psucase',
    level: 'psu',
    description: 'Mặt lưới lỗ lục giác dạng tổ ong dập trên mặt sau của bộ nguồn.',
    purpose:
      'Cho khí nóng thoát ra ít cản trở nhất có thể trong khi vẫn ngăn ngón tay chạm vào các linh kiện điện lưới bên trong.',
    quantity: '1 lưới mô phỏng',
    specifications: { 'Kiểu lỗ': 'Đục lỗ lục giác tổ ong' },
    representationType: 'physical',
    sources: ['psu'],
    searchTerms: ['grille', 'vent', 'exhaust', 'honeycomb', 'mesh', 'lưới thoát gió'],
  }),
];

/**
 * One of the TUF Gaming supplies, as the builder and the catalogue draw it.
 * Every model in the family is a 150 × 150 × 86 mm box with a 135 mm fan, so
 * they share the 850W Gold's conversion chain and differ in their rating,
 * their efficiency class, and whether the leads plug in or are fixed.
 */
export interface SupplyModel {
  /** The supply's own scale. */
  level: LevelId;
  /** Put in front of every part id; the 850W Gold's parts carry none. */
  prefix: string;
  watts: number;
  efficiency: 'Gold' | 'Bronze';
  modular: boolean;
  /** ASUS's specification page, and the product page for the fan. */
  spec: SourceId;
  fan: SourceId;
  /** The outputs ASUS lists, for the socket panel or the fixed harness. */
  outputs: string;
  /** The ATX revision ASUS states, where it states one. */
  atx?: string;
  /** More for the housing: a claim the maker's pages do not make. */
  housing?: { sources: SourceId[]; note: string };
  /**
   * The supply the tower carries, and the one a build starts on: its housing
   * hangs under the tower's PSU. The others stand under the machine.
   */
  installed?: true;
}

export const supplyModels = {
  psu650: {
    level: 'psu650',
    prefix: 'tuf650',
    watts: 650,
    efficiency: 'Bronze',
    modular: false,
    spec: 'tuf650b',
    fan: 'tuf650fan',
    outputs: '24-pin · 2 × CPU 4+4-pin · 2 × PCIe 6+2-pin · 4 × SATA',
    housing: {
      sources: ['tuf650cabling'],
      note: 'ASUS không nêu rõ kiểu cáp; mô hình thể hiện dạng cáp liền theo mô tả từ các nhà bán lẻ.',
    },
  },
  psubronze: {
    level: 'psubronze',
    prefix: 'bronze',
    watts: 750,
    efficiency: 'Bronze',
    modular: false,
    spec: 'tuf750b',
    fan: 'tuf750fan',
    outputs: '24-pin · EPS · PCIe 6+2-pin · SATA',
  },
  psu: {
    level: 'psu',
    prefix: '',
    watts: 850,
    efficiency: 'Gold',
    modular: true,
    spec: 'tuf850g',
    fan: 'tuf850fan',
    outputs: '24-pin · EPS · PCIe 16-pin · PCIe 8-pin · SATA',
  },
  psu1000: {
    level: 'psu1000',
    prefix: 'tuf1000',
    watts: 1000,
    efficiency: 'Gold',
    modular: true,
    spec: 'tuf1000g',
    fan: 'tuf1000fan',
    outputs:
      '24-pin · 2 × CPU 4+4-pin · PCIe 16-pin · 4 × PCIe 8-pin · 5 × SATA',
    atx: 'ATX 3.1',
    installed: true,
  },
  psu1200: {
    level: 'psu1200',
    prefix: 'tuf1200',
    watts: 1200,
    efficiency: 'Gold',
    modular: true,
    spec: 'tuf1200g',
    fan: 'tuf1200fan',
    outputs:
      '24-pin · 2 × CPU 4+4-pin · 2 × PCIe 16-pin · 3 × PCIe 8-pin · 5 × SATA',
    atx: 'ATX 3.1',
  },
} satisfies Record<string, SupplyModel>;

/** A part's id in a model: its prefix, and a harness where sockets would be. */
export const supplyPartId = (model: SupplyModel, id: string) =>
  model.prefix + (!model.modular && id === 'psumodular' ? 'psuharness' : id);

/**
 * Another model's catalogue, from the 850W Gold's: the same conversion chain
 * under its own identities, with its own housing, outputs and fan source, and
 * permanent leads in place of the socket panel on a fixed-cable unit.
 */
export function supplyConcepts(model: SupplyModel): Concept[] {
  const name = `TUF Gaming ${model.watts}W ${model.efficiency}`;
  const fixed = !model.modular;
  // What a model says differently about each kind of part: its housing, its
  // cable face (a socket panel, or a fixed harness in its place) and its fan.
  const housing = (original: Concept): Partial<Concept> => ({
    parent: model.installed ? 'psu' : 'pc',
    open: model.level,
    name: `Vỏ nguồn ${name}`,
    shortName: `Vỏ nguồn ${model.watts}W`,
    description: `Lớp vỏ thép dập kích thước 150 × 150 × 86 mm của bộ nguồn ASUS ${name}.`,
    specifications: {
      'Chuẩn kích thước': model.atx ?? 'ATX',
      'Kích thước': '150 × 150 × 86 mm',
      'Công suất': `${model.watts} W`,
      'Hiệu suất': `80 PLUS ${model.efficiency}`,
      'Cáp nguồn': fixed ? 'Cáp liền (Non-modular)' : 'Modular toàn phần (Full-modular)',
    },
    physicalAccuracy:
      `Kích thước và đặc điểm bên ngoài theo thông số công bố của ASUS ${name}; cấu trúc hình học và vị trí linh kiện bên trong chỉ mang tính minh họa.` +
      (model.housing ? ' ' + model.housing.note : ''),
    sources: [model.spec, ...(model.housing?.sources ?? []), 'psu'],
    searchTerms: [
      ...original.searchTerms,
      `${model.watts}w`,
      model.efficiency.toLowerCase(),
      fixed ? 'non-modular' : 'modular',
      fixed ? 'cáp liền' : 'cáp rời',
      'asus',
      'tuf',
    ],
  });
  const cables: Partial<Concept> = fixed
    ? {
        name: 'Bó cáp nguồn liền',
        shortName: 'Cáp liền',
        description:
          'Các bó cáp bọc lưới cố định đi ra khỏi bộ nguồn qua lỗ bảo vệ, không có ổ cắm tháo rời ở phía nguồn.',
        purpose:
          'Cấp điện qua các dây dẫn gắn cố định tới bo mạch chủ, CPU, card đồ họa và ổ lưu trữ.',
        quantity: '4 bó cáp mô phỏng',
        specifications: { 'Đầu ra': model.outputs },
        physicalAccuracy:
          'Nhóm đầu cáp theo tài liệu của ASUS; đường đi của bó cáp và hình dạng đầu cắm chỉ mang tính minh họa.',
        sources: [model.spec, 'psu'],
        searchTerms: ['fixed', 'non-modular', 'cable', 'harness', 'loom', 'cáp liền'],
      }
    : {
        specifications: { 'Đầu ra': model.outputs },
        sources: [model.spec, 'psu'],
      };
  const override = (original: Concept): Partial<Concept> =>
    original.id === 'psucase'
      ? housing(original)
      : original.id === 'psumodular'
        ? cables
        : original.id === 'psuintake'
          ? { sources: [model.fan, 'fanconstruction', 'bldc'] }
          : {};
  return psuConcepts.map((original) =>
    concept({
      ...original,
      id: supplyPartId(model, original.id),
      parent:
        original.parent === 'psucase' || original.parent === 'psuboard'
          ? model.prefix + original.parent
          : original.parent,
      children: [],
      level: model.level,
      open: undefined,
      ...override(original),
    }),
  );
}

export const bronzePsuConcepts = supplyConcepts(supplyModels.psubronze);
export const tuf650Concepts = supplyConcepts(supplyModels.psu650);
export const tuf1000Concepts = supplyConcepts(supplyModels.psu1000);
export const tuf1200Concepts = supplyConcepts(supplyModels.psu1200);
