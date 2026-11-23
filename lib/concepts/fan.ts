import { concept, type Concept } from '../concept.ts';

/**
 * Inside a case fan.
 *
 * A fan is a brushless motor turned inside out: the magnet spins with the
 * impeller around a stator that stays still. Everything below is one of the
 * eight or so parts that makes that work.
 *
 * Blade count, bearing type and winding arrangement vary between fans; these
 * are representative of the category rather than a specific product.
 */
export const fanConcepts: Concept[] = [
  concept({
    id: 'fanframe',
    name: 'Khung quạt',
    shortName: 'Khung quạt',
    category: 'Cooling',
    parent: 'casefan',
    level: 'fan',
    open: 'fan',
    description:
      'Khung vuông đúc nguyên khối với lòng tròn, bốn lỗ bắt vít và các thanh đỡ cụm động cơ.',
    purpose:
      'Giữ động cơ đồng tâm trong luồng gió và cung cấp chuẩn lỗ ốc tiêu chuẩn để lắp đặt.',
    quantity: '1 khung mô phỏng',
    specifications: { 'Kích thước': '120 mm', 'Độ dày': '25 mm' },
    representationType: 'physical',
    sources: ['fanconstruction'],
    searchTerms: ['frame', 'housing', 'body', 'mount', 'khung quạt'],
  }),
  concept({
    id: 'fanpads',
    name: 'Đệm chống rung',
    shortName: 'Đệm cao su',
    category: 'Cooling',
    parent: 'fanframe',
    level: 'fan',
    description: 'Các miếng cao su mềm gắn ở bốn góc của khung quạt.',
    purpose:
      'Ngăn rung động do mất cân bằng của quạt truyền sang vỏ máy và gây cộng hưởng ồn.',
    quantity: '4 đệm mô phỏng',
    specifications: { 'Vật liệu': 'Cao su đàn hồi, minh họa' },
    representationType: 'physical',
    sources: ['fanconstruction'],
    searchTerms: [
      'rubber',
      'pad',
      'vibration',
      'noise',
      'damping',
      'chống rung',
      'đệm cao su',
    ],
  }),
  concept({
    id: 'fanimpeller',
    name: 'Cụm cánh quạt',
    shortName: 'Cánh quạt',
    category: 'Cooling',
    parent: 'casefan',
    level: 'fan',
    description:
      'Chụp trục giữa cùng vòng cánh quạt uốn cong, xoắn góc, đúc liền một khối.',
    purpose:
      'Mỗi cánh hoạt động như một cánh máy bay thu nhỏ: khi quay sẽ đẩy không khí dọc theo trục thay vì văng ra xung quanh.',
    quantity: '9 cánh mô phỏng',
    specifications: { 'Số cánh': '9', 'Kiểu dáng': 'Uốn cong và vát khí động học' },
    representationType: 'physical',
    sources: ['fanconstruction'],
    searchTerms: [
      'impeller',
      'blade',
      'rotor',
      'propeller',
      'airflow',
      'cánh quạt',
    ],
  }),
  concept({
    id: 'fanmagnet',
    name: 'Nam châm rotor',
    shortName: 'Nam châm',
    category: 'Cooling',
    parent: 'fanimpeller',
    level: 'fan',
    description:
      'Vòng nam châm vĩnh cửu gắn bên trong chụp trục cánh quạt, với các cực từ xen kẽ nhau.',
    purpose:
      'Là phần chuyển động của động cơ: stator sẽ hút đẩy các cực từ này để làm quay cụm cánh quạt.',
    quantity: '1 vòng mô phỏng',
    specifications: { 'Bố trí': 'Các cực từ xen kẽ quanh vòng' },
    representationType: 'physical',
    sources: ['bldc'],
    searchTerms: ['magnet', 'rotor', 'poles', 'motor', 'ring', 'nam châm'],
  }),
  concept({
    id: 'fanstator',
    name: 'Stator và cuộn dây',
    shortName: 'Stator',
    category: 'Cooling',
    parent: 'casefan',
    level: 'fan',
    description:
      'Khối lá thép ghép đặt trên trụ giữa, với dây đồng quấn quanh từng nhánh cực.',
    purpose:
      'Cấp điện lần lượt cho các cuộn dây để tạo ra từ trường quay, kéo vòng nam châm rotor quay theo.',
    quantity: '4 cực mô phỏng',
    specifications: { 'Lõi': 'Thép lá ghép', 'Dây quấn': 'Đồng' },
    representationType: 'physical',
    sources: ['bldc'],
    searchTerms: [
      'stator',
      'coil',
      'winding',
      'copper',
      'motor',
      'lamination',
      'cuộn dây',
      'động cơ',
    ],
  }),
  concept({
    id: 'fanbearing',
    name: 'Ổ trục và trục quay',
    shortName: 'Ổ trục',
    category: 'Cooling',
    parent: 'fanstator',
    level: 'fan',
    description:
      'Trục thép chạy dọc tâm trụ giữa, quay trong ống bạc lót có phe cài giữ ở phía dưới.',
    purpose:
      'Đỡ cụm cánh quạt với ma sát thấp nhất có thể, quyết định tuổi thọ và độ êm của quạt theo thời gian.',
    quantity: '1 ổ trục mô phỏng',
    specifications: {
      'Loại': 'Bạc lót (sleeve), minh họa; tài liệu so sánh các kiểu ổ trục',
    },
    representationType: 'physical',
    sources: ['bearing'],
    searchTerms: [
      'bearing',
      'shaft',
      'sleeve',
      'friction',
      'clip',
      'ổ trục',
      'bạc đạn',
      'trục quay',
    ],
  }),
  concept({
    id: 'fanboard',
    name: 'Mạch điều khiển',
    shortName: 'Mạch driver',
    category: 'Board',
    parent: 'fanstator',
    level: 'fan',
    description:
      'Bảng mạch hình vành khuyên nằm dưới stator, mang IC điều khiển và cảm biến theo dõi vị trí rotor đi qua.',
    purpose:
      'Đóng ngắt các cuộn dây đúng thời điểm, thực thi lệnh điều tốc và báo ngược tốc độ quay thực tế.',
    quantity: '1 mạch mô phỏng',
    specifications: { 'Cảm biến': 'Vị trí rotor', 'Ngõ ra': 'Tín hiệu vòng tua (Tachometer)' },
    representationType: 'physical',
    sources: ['bldc'],
    searchTerms: [
      'driver',
      'hall',
      'sensor',
      'pcb',
      'tacho',
      'commutation',
      'mạch điều khiển',
      'cảm biến',
    ],
  }),
  concept({
    id: 'fanlead',
    name: 'Dây nguồn quạt',
    shortName: 'Dây quạt',
    category: 'Cooling',
    parent: 'fanboard',
    level: 'fan',
    description:
      'Dây bọc lưới bốn lõi đi ra từ một góc khung quạt, kết thúc bằng đầu cắm có ngàm định hướng.',
    purpose:
      'Cấp nguồn 12 V và mass vào quạt, truyền lệnh điều tốc xuống và gửi tín hiệu vòng tua trở về.',
    quantity: '1 dây mô phỏng',
    specifications: { 'Chân tiếp xúc': '4 chân PWM' },
    representationType: 'physical',
    sources: ['mainboardmanual', 'bldc'],
    searchTerms: ['cable', 'lead', 'wire', 'connector', 'pwm', '4-pin', 'dây quạt'],
  }),
];
