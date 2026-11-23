import { concept, type Category, type Concept } from '../concept.ts';
import { notebookLevels, type NotebookLevel } from '../notebook-levels.ts';
import type { SourceId } from '../sources.ts';

const physical =
  'Các thông số kỹ thuật đã công bố xác định đối tượng mẫu. Đường nét bên trong, vị trí linh kiện, mật độ đóng gói và chi tiết ốc vít là hình học minh họa phục vụ giáo dục, không phải bản vẽ bảo trì hay bản sao PCB chính xác.';
const logical =
  'Sơ đồ chức năng giải thích nguyên lý. Vị trí khối, diện tích và các ví dụ thực thi / DRAM tổng quát không phải là sơ đồ mặt bằng bán dẫn, bố cục transistor hay tài liệu mật chưa công bố của hãng.';
export const notebookConcepts: Concept[] = [];

function part(
  level: NotebookLevel,
  suffix: string,
  name: string,
  category: Category,
  description: string,
  purpose: string,
  specifications: Record<string, string> = {},
  sources: SourceId[] = [],
  open?: NotebookLevel,
  quantity = '1 nhóm chức năng minh họa',
) {
  const id = open ?? `${level}-${suffix}`;
  notebookConcepts.push(
    concept({
      id,
      level,
      parent: level,
      name,
      category,
      description,
      purpose,
      specifications,
      sources,
      representationType: notebookLevels[level].kind,
      physicalAccuracy:
        notebookLevels[level].kind === 'physical' ? physical : logical,
      quantity,
      open,
      searchTerms: [
        level.startsWith('legion')
          ? 'Lenovo Legion laptop notebook máy tính xách tay'
          : 'Apple MacBook M1 Pro laptop notebook máy tính xách tay',
        name,
      ],
      ...(suffix === 'cover' || suffix === 'deck' || suffix === 'mold'
        ? { opensFirst: true }
        : {}),
    }),
  );
}

const legionSpecs = {
  'Mẫu máy': 'Legion 5 15ACH6H (2021)',
  'Vi xử lý': 'AMD Ryzen 7 5800H · 8 nhân / 16 luồng',
  'Đồ họa': 'GeForce RTX 3060 Laptop GPU · 6 GB GDDR6',
  'Bộ nhớ': '16 GB DDR4-3200 · hai khe SO-DIMM',
  'Lưu trữ': '512 GB M.2 PCIe NVMe · có thể thay thế',
  'Màn hình': '15.6-inch IPS · 1920 × 1080 · tùy chọn 165 Hz',
  Pin: 'Tùy chọn 80 Wh',
  'Kích thước': '362.56 × 260.61 × 22.5–25.75 mm',
};
const macSpecs = {
  'Mẫu máy': 'MacBook Pro 14-inch (2021)',
  'Vi xử lý': 'M1 Pro · CPU 10 nhân (8 hiệu năng cao + 2 tiết kiệm điện)',
  'Đồ họa': 'M1 Pro · GPU tích hợp 16 nhân',
  'Bộ nhớ': '16 GB bộ nhớ hợp nhất · không dùng khe cắm rời',
  'Lưu trữ': '512 GB flash hàn trên bo mạch · không phải mô-đun M.2',
  'Màn hình': '14.2-inch Liquid Retina XDR · 3024 × 1964 · tối đa 120 Hz',
  Pin: '70 Wh',
  'Kích thước': '312.6 × 221.2 × 15.5 mm',
};

for (const [id, specs, source] of [
  ['legion', legionSpecs, 'legionpsref'],
  ['macbook', macSpecs, 'macbookspec'],
] as const) {
  notebookConcepts.push(
    concept({
      id,
      level: id,
      parent: null,
      open: id,
      name: notebookLevels[id].name,
      category: 'Chassis',
      description: notebookLevels[id].summary,
      purpose:
        'Khám phá toàn bộ một chiếc máy tính xách tay, sau đó mở từng linh kiện và kiến trúc bên trong của chúng.',
      quantity: '1 cấu hình được chọn',
      specifications: specs,
      sources: [source],
      representationType: 'physical',
      physicalAccuracy: physical,
      searchTerms: [
        id,
        'laptop',
        'notebook',
        'portable computer',
        'máy tính xách tay',
      ],
    }),
  );
}

for (const mac of [false, true]) {
  const root = mac ? 'macbook' : 'legion';
  const board = mac ? 'macboard' : 'legionboard';
  const cooling = mac ? 'maccooling' : 'legioncooling';
  const battery = mac ? 'macbattery' : 'legionbattery';
  const display = mac ? 'macdisplay' : 'legiondisplay';
  const storage = mac ? 'macstorage' : 'legionstorage';
  const spec: SourceId = mac ? 'macbookspec' : 'legionpsref';
  const service: SourceId = mac ? 'macbookservice' : 'legionservice';
  part(
    root,
    'cover',
    'Nắp đáy',
    'Chassis',
    'Mặt đáy có thể tháo rời giúp đóng kín thân máy.',
    'Bảo vệ các cụm linh kiện bên trong và cho phép tiếp cận để bảo trì, nâng cấp.',
    {},
    [service],
  );
  part(
    root,
    'deck',
    'Bàn phím và chiếu nghỉ tay',
    'Chassis',
    mac
      ? 'Bàn phím có đèn nền, không có cụm phím số.'
      : 'Bàn phím có đèn nền, kèm cụm phím số.',
    'Hỗ trợ nhập liệu và tạo bề mặt kết cấu phía trên thân máy.',
    {},
    [spec, service],
  );
  part(
    root,
    'trackpad',
    mac ? 'Bàn di chuột Force Touch' : 'Bàn di chuột (Touchpad)',
    'Board',
    'Bề mặt cảm ứng trỏ nằm bên dưới bàn phím.',
    'Chuyển đổi chuyển động ngón tay thành thao tác con trỏ và cử chỉ.',
    {},
    [spec],
  );
  part(
    root,
    'hinges',
    'Bản lề màn hình',
    'Chassis',
    'Hai trục xoay nối phần màn hình với thân máy.',
    'Giữ màn hình cố định ở góc nhìn phù hợp.',
    {},
    [service],
    undefined,
    '2 bản lề',
  );
  part(
    root,
    'display',
    notebookLevels[display].name,
    'Graphics',
    'Cụm màn hình gồm tấm nền LCD và hệ thống đèn nền.',
    'Hiển thị hình ảnh do hệ thống đồ họa xuất ra.',
    { 'Màn hình': (mac ? macSpecs : legionSpecs)['Màn hình'] },
    [spec, service],
    display,
  );
  part(
    root,
    'board',
    notebookLevels[board].name,
    'Board',
    'Bo mạch chính chứa các mạch xử lý và giao tiếp I/O.',
    'Kết nối vi xử lý, bộ nhớ, lưu trữ và các thiết bị ngoại vi.',
    {},
    [service],
    board,
  );
  part(
    root,
    'cooling',
    notebookLevels[cooling].name,
    'Cooling',
    'Hệ thống tản nhiệt dùng chung dẫn nhiệt từ các chip nóng tới khe thoát gió cưỡng bức.',
    'Truyền nhiệt lượng vào luồng khí thổi ra khỏi thân máy.',
    {},
    [service],
    cooling,
  );
  part(
    root,
    'battery',
    notebookLevels[battery].name,
    'Power',
    'Cụm pin lithium-polymer có thể sạc lại.',
    'Cung cấp năng lượng khi máy không cắm sạc.',
    { 'Dung lượng': mac ? '70 Wh' : 'Cấu hình 80 Wh' },
    [spec, service],
    battery,
  );
  part(
    root,
    'speakers',
    'Cụm loa',
    'Board',
    'Hộp cộng hưởng dẫn âm thanh từ các loa của máy.',
    'Chuyển đổi tín hiệu âm thanh thành sóng âm.',
    {},
    [spec, service],
    undefined,
    '2 hộp loa minh họa; lược bỏ chi tiết màng loa',
  );
  part(
    root,
    'fasteners',
    'Ốc vít vỏ máy',
    'Chassis',
    'Các ốc vít nhỏ giữ chặt nắp đáy.',
    'Cố định vỏ máy vào khung đỡ bên trong.',
    { 'Phạm vi': 'Vị trí và số lượng mang tính minh họa' },
    [service],
  );

  part(
    board,
    'io',
    'Bo mạch phụ I/O và cáp dẻo',
    'Board',
    'Các bo mạch cổng kết nối nhỏ và cáp nối mềm nằm dọc các cạnh vỏ máy.',
    'Đưa cổng kết nối ra mép vỏ máy đồng thời liên kết về bo mạch chính.',
    {
      'Phạm vi': 'Quan hệ giữa các cụm linh kiện bảo trì; đường mạch bên trong mang tính minh họa',
    },
    [service],
  );
  part(
    board,
    'passives',
    'Mạch phụ trợ dán bề mặt',
    'Board',
    'Các điện trở, tụ điện nhỏ và linh kiện hỗ trợ bao quanh các chip lớn.',
    'Lọc nhiễu nguồn và duy trì toàn vẹn tín hiệu.',
    { 'Phạm vi': 'Mật độ linh kiện mang tính đại diện' },
    ['multiphase', service],
  );
  part(
    board,
    'fasteners',
    'Ốc cố định bo mạch',
    'Board',
    'Các ốc vít giữ chặt bo mạch tại các điểm bắt vít.',
    'Cố định phần điện tử vào khung vỏ máy.',
    {},
    [service],
  );
  if (!mac)
    part(
      board,
      'sockets',
      'Khe cắm SO-DIMM và ngàm giữ',
      'Memory',
      'Các khe cắm có rãnh khóa giữ hai thanh RAM laptop.',
      'Kết nối bộ nhớ đồng thời cho phép tháo lắp, thay thế mô-đun.',
      { 'Khe cắm': '2 khe DDR4 SO-DIMM' },
      ['legionpsref', 'legionservice'],
    );
  part(
    cooling,
    'housing',
    'Vỏ quạt lồng sóc và ống dẫn gió',
    'Cooling',
    'Cửa hút khí hình khuyên và đường xả khí kín bao quanh mỗi cánh quạt ly tâm.',
    'Hướng luồng gió từ quạt đi xuyên qua cụm lá tản nhiệt thay vì để khí quẩn lại.',
    {},
    [service, 'fanconstruction'],
  );
  part(
    cooling,
    'pads',
    'Vật liệu tiếp xúc nhiệt',
    'Cooling',
    'Các lớp đệm mỏng đàn hồi nối bề mặt chip với tấm tiếp xúc tản nhiệt.',
    'Giảm trở nhiệt tiếp xúc trên đường truyền nhiệt.',
    {},
    [service, 'aircooler'],
  );
  part(
    cooling,
    'fasteners',
    'Ốc cố định cụm tản nhiệt',
    'Cooling',
    'Các ốc vít giữ chặt vỏ quạt và tấm tiếp xúc nhiệt.',
    'Duy trì lực ép tiếp xúc và độ thẳng hàng cơ khí.',
    {},
    [service],
  );
  part(
    battery,
    'carrier',
    'Khung đỡ pin và tai bắt ốc',
    'Power',
    'Khung đỡ giữ cố định nhóm cell pin dạng túi (pouch cell).',
    'Định vị cụm pin bên trong vỏ máy.',
    {},
    [service],
  );
  part(
    display,
    'diffuser',
    'Cụm tấm tán quang',
    'Graphics',
    'Các tấm phim quang học phân tán ánh sáng đèn nền đều khắp màn hình LCD.',
    'Giúp độ sáng đồng đều hơn trước khi đi qua lớp tạo hình ảnh.',
    {},
    [spec, service],
  );
  part(
    display,
    'controller',
    'Bo mạch định thời và điều khiển màn hình',
    'Board',
    'Một bo mạch hẹp cùng các chip lái tấm nền phân phối tín hiệu hiển thị.',
    'Điều phối việc cập nhật điểm ảnh và giao tiếp tấm nền.',
    { 'Phạm vi': 'Mạch điện tử tấm nền mang tính đại diện, không phải sơ đồ mạch hãng' },
    [service],
  );
  part(
    display,
    'mounts',
    'Phần cứng gắn màn hình',
    'Chassis',
    'Các ốc vít nhỏ định vị cụm màn hình và vỏ nắp lưng.',
    'Giữ cố định cụm màn hình.',
    {},
    [service],
  );
  part(
    board,
    'pcb',
    'Bo mạch hệ thống (PCB)',
    'Board',
    'Bo mạch nhiều lớp liên kết các linh kiện được lắp đặt.',
    'Truyền tải nguồn điện và các tín hiệu tốc độ cao.',
    {},
    [service],
  );
  part(
    board,
    'power',
    'Mạch ổn áp',
    'Power',
    'Các mạch chuyển đổi nguồn tại chỗ cấp điện áp thấp cho chip.',
    'Điều chỉnh nguồn điện cấp cho khối tính toán và bộ nhớ.',
    {},
    ['multiphase'],
  );
  part(
    board,
    'ports',
    'Cổng giao tiếp ngoài',
    'Board',
    mac
      ? 'Thunderbolt 4, HDMI, khe SDXC, cổng âm thanh và MagSafe kết nối với bên ngoài.'
      : 'USB, HDMI, Ethernet, cổng âm thanh và cổng nguồn DC kết nối với bên ngoài.',
    'Kết nối màn hình ngoài, thiết bị ngoại vi, mạng và sạc pin.',
    {},
    [spec],
  );
  part(
    board,
    'wireless',
    'Kết nối không dây',
    'Board',
    'Mạch thu phát vô tuyến giao tiếp với các thiết bị không dây xung quanh.',
    'Cung cấp kết nối Wi-Fi và Bluetooth.',
    {},
    [spec],
  );
  part(
    board,
    'storage',
    notebookLevels[storage].name,
    'Storage',
    mac
      ? 'Các chip nhớ flash được hàn trực tiếp trên bo mạch logic.'
      : 'Một mô-đun M.2 tháo lắp được cắm vào bo mạch hệ thống.',
    'Lưu giữ hệ điều hành, phần mềm và tệp tin khi tắt nguồn.',
    { 'Lưu trữ': (mac ? macSpecs : legionSpecs)['Lưu trữ'] },
    [spec, service],
    storage,
  );

  part(
    cooling,
    'fans',
    'Quạt lồng sóc ly tâm',
    'Cooling',
    'Hai quạt ly tâm đẩy không khí qua các cụm lá tản nhiệt lân cận.',
    'Tạo lưu lượng gió đi qua cụm tản nhiệt nhỏ gọn.',
    {},
    [service, 'fanconstruction'],
    undefined,
    '2 quạt lồng sóc',
  );
  part(
    cooling,
    'pipes',
    'Cụm ống dẫn nhiệt',
    'Cooling',
    'Các ống dẫn nhiệt kín nối tấm tiếp xúc lạnh tới cụm lá tản nhiệt.',
    'Chuyển nhiệt từ các chip tới khu vực thoát gió.',
    { 'Phạm vi': 'Đường đi ống dẫn nhiệt mang tính minh họa' },
    [service, 'aircooler'],
  );
  part(
    cooling,
    'fins',
    'Cụm lá tản nhiệt xả gió',
    'Cooling',
    'Các lá kim loại mỏng tạo diện tích tiếp xúc lớn với luồng khí chuyển động.',
    'Truyền nhiệt từ cụm tản nhiệt ra không khí.',
    {},
    ['aircooler'],
  );
  part(
    cooling,
    'plates',
    'Tấm tiếp xúc nhiệt',
    'Cooling',
    'Các bề mặt tiếp xúc phẳng ghép bộ tản nhiệt với mặt chip xử lý.',
    'Thu nhiệt qua lớp vật liệu tiếp xúc nhiệt.',
    {},
    [service, 'aircooler'],
  );

  part(
    battery,
    'cells',
    'Cell pin dạng túi (Pouch cell)',
    'Power',
    'Các cell pin sạc dẹt lưu trữ năng lượng hóa học.',
    'Cung cấp nguồn năng lượng dự trữ cho hoạt động di động.',
    {
      'Phạm vi': 'Cách bố trí cell túi mang tính minh họa; không phải sơ đồ đấu nối điện',
    },
    [service],
    undefined,
    'Nhóm cell minh họa',
  );
  part(
    battery,
    'controller',
    'Mạch quản lý pin',
    'Power',
    'Một bo mạch nhỏ theo dõi và quản lý khối pin.',
    'Điều phối bảo vệ an toàn và báo cáo trạng thái sạc.',
    {},
    [service],
  );
  part(
    battery,
    'connector',
    'Đầu nối pin',
    'Power',
    'Dây cáp nối khối pin với bo mạch hệ thống.',
    'Truyền tải nguồn pin và các tín hiệu quản lý.',
    {},
    [service],
  );

  part(
    display,
    'cover',
    'Nắp lưng màn hình',
    'Chassis',
    'Lớp vỏ ngoài bảo vệ cụm màn hình.',
    'Đỡ tấm nền màn hình và liên kết với bản lề.',
    {},
    [service],
  );
  part(
    display,
    'panel',
    'Tấm nền LCD',
    'Graphics',
    'Các điểm ảnh tinh thể lỏng điều biến ánh sáng truyền qua.',
    'Tạo nên hình ảnh màu sắc hiển thị.',
    { 'Độ phân giải': mac ? '3024 × 1964' : 'Tùy chọn 1920 × 1080' },
    [spec],
  );
  part(
    display,
    'backlight',
    mac ? 'Đèn nền Mini-LED' : 'Đèn nền LED',
    'Graphics',
    'Lớp chiếu sáng nằm phía sau tấm nền LCD.',
    'Cung cấp nguồn sáng để tấm nền LCD điều tiết.',
    {},
    [spec],
  );
  part(
    display,
    'camera',
    'Cụm camera',
    'Board',
    'Một camera nhỏ nằm phía trên màn hình.',
    'Thu hình ảnh cho các cuộc gọi video.',
    { 'Độ phân giải': mac ? '1080p' : '720p' },
    [spec],
  );
  part(
    display,
    'cable',
    'Cáp màn hình',
    'Board',
    'Đường kết nối mềm đi xuyên qua khu vực bản lề.',
    'Truyền tín hiệu hiển thị giữa bo mạch chính và màn hình.',
    {},
    [service],
  );

  part(
    storage,
    'substrate',
    mac ? 'Khu vực trên bo mạch logic' : 'Bo mạch M.2',
    'Board',
    mac
      ? 'Các chip flash được hàn trực tiếp lên bo mạch logic.'
      : 'Một bảng mạch PCB mảnh mang chip điều khiển và các chip nhớ flash.',
    'Cung cấp kết nối điện cho bộ nhớ lưu trữ.',
    {},
    [service],
  );
  part(
    storage,
    'nand',
    'Bộ nhớ NAND flash',
    'Storage',
    'Bộ nhớ flash không bay hơi lưu giữ dữ liệu.',
    'Giữ lại phần mềm và tệp tin ngay cả khi mất điện.',
    { 'Phạm vi': 'Số lượng chip đóng gói và mật độ die mang tính minh họa' },
    ['ssdarchitecture', spec],
  );
  if (!mac) {
    part(
      storage,
      'controller',
      'Bộ điều khiển NVMe',
      'Compute',
      'Bộ điều khiển trên bo mạch quản lý việc truy xuất bộ nhớ flash.',
      'Biên dịch lệnh từ máy chủ thành thao tác đọc/ghi flash và sửa lỗi.',
      {},
      ['nvme', 'ssdarchitecture'],
    );
    part(
      storage,
      'contacts',
      'Đầu nối M.2',
      'Storage',
      'Các chân tiếp xúc cạnh kết nối ổ đĩa tháo lắp được với khe cắm.',
      'Truyền tải giao tiếp PCIe và nguồn điện.',
      {},
      [service, 'nvme'],
    );
  } else {
    part(
      storage,
      'link',
      'Kết nối tới Apple Silicon',
      'Storage',
      'Bộ nhớ flash tích hợp được quản lý bởi chip hệ thống.',
      'Kết nối bộ nhớ lưu trữ lâu dài với bộ điều khiển lưu trữ tích hợp.',
      { 'Khả năng thay thế': 'Không có khe M.2 tháo rời' },
      [service],
    );
  }
}

part(
  'legionboard',
  'cpu',
  'Ryzen 7 5800H',
  'Compute',
  'Vi xử lý di động kiến trúc Zen 3 được hàn trên bo mạch.',
  'Chạy hệ điều hành và các luồng ứng dụng.',
  { 'Số nhân': '8 nhân / 16 luồng', 'Bộ nhớ đệm': '4 MB L2 / 16 MB L3' },
  ['legionpsref'],
  'legioncpu',
);
part(
  'legionboard',
  'gpu',
  'RTX 3060 Laptop GPU',
  'Graphics',
  'Một GPU rời kiến trúc Ampere được hàn trên bo mạch.',
  'Tăng tốc xử lý đồ họa và các tác vụ tính toán song song.',
  { 'Bộ nhớ': '6 GB GDDR6 chuyên dụng' },
  ['legionpsref'],
  'legiongpu',
);
part(
  'legionboard',
  'memory',
  'DDR4 SO-DIMM',
  'Memory',
  'Hai mô-đun bộ nhớ laptop có thể thay thế.',
  'Lưu giữ các chương trình và dữ liệu đang hoạt động cho CPU.',
  { Chuẩn: 'DDR4-3200', 'Dung lượng': 'Cấu hình 16 GB được chọn' },
  ['legionpsref', 'legionservice'],
  'legionmemory',
  '2 thanh SO-DIMM',
);
part(
  'legionboard',
  'vram',
  'GDDR6 chuyên dụng',
  'Memory',
  'Bộ nhớ đồ họa tách biệt khỏi các thanh SO-DIMM của hệ thống.',
  'Cung cấp không gian lưu trữ làm việc cục bộ cho GPU rời.',
  { 'Dung lượng': '6 GB' },
  ['legionpsref', 'gddr6'],
);
part(
  'legioncpu',
  'cores',
  'Nhân CPU Zen 3',
  'Compute',
  'Tám nhân CPU hỗ trợ mười sáu luồng phần cứng.',
  'Thực thi các luồng lệnh đa dụng.',
  { 'Số nhân': '8', 'Số luồng': '16' },
  ['legionpsref'],
  'legioncore',
  '8 nhân',
);
part(
  'legioncpu',
  'cache',
  'Bộ nhớ đệm L3 dùng chung',
  'Memory',
  'Bộ nhớ đệm dùng chung giữ dữ liệu vừa truy cập gần các nhân xử lý.',
  'Giảm số lần phải truy xuất ra bộ nhớ ngoài.',
  { 'Dung lượng': '16 MB' },
  ['legionpsref'],
);
part(
  'legioncpu',
  'igpu',
  'Đồ họa tích hợp Radeon',
  'Graphics',
  'Vi xử lý di động cũng tích hợp sẵn nhân đồ họa.',
  'Cung cấp đường xuất đồ họa thay thế cho GPU rời.',
  {},
  ['legionpsref'],
);
part(
  'legioncpu',
  'io',
  'Giao diện bộ nhớ và I/O',
  'Board',
  'Các giao diện kết nối tài nguyên tính toán với thiết bị bên ngoài.',
  'Luân chuyển dữ liệu tới bộ nhớ và các thiết bị ngoại vi.',
  {},
  ['legionpsref'],
);
part(
  'legiongpu',
  'sm',
  'Bộ đa xử lý luồng (SM)',
  'Graphics',
  'Kiến trúc Ampere nhóm các tài nguyên thực thi song song thành các SM.',
  'Lập lịch và thực thi các tác vụ GPU.',
  { 'Phạm vi': 'Các nhóm logic vẽ theo sơ đồ; không phải bản đồ mặt bằng die vật lý' },
  ['ampereguide'],
  'legionsm',
);
part(
  'legiongpu',
  'memory',
  'Giao diện GDDR6',
  'Memory',
  'Các bộ điều khiển bộ nhớ kết nối tới VRAM chuyên dụng bên ngoài.',
  'Cung cấp dữ liệu đồ họa cho các đơn vị thực thi.',
  { 'Dung lượng': '6 GB GDDR6' },
  ['legionpsref', 'gddr6'],
);
part(
  'legiongpu',
  'cache',
  'Bộ nhớ đệm GPU',
  'Memory',
  'Bộ nhớ trên chip lưu giữ dữ liệu có thể tái sử dụng.',
  'Giảm các lượt truy cập lặp lại ra bộ nhớ ngoài.',
  {},
  ['ampereguide'],
);
part(
  'legiongpu',
  'frontend',
  'Khối tiền xử lý đồ họa',
  'Graphics',
  'Tác vụ đồ họa được chuẩn bị trước khi đưa vào các đơn vị thực thi.',
  'Tổ chức và điều phối các tác vụ dựng hình.',
  {},
  ['ampereguide'],
);

part(
  'macboard',
  'soc',
  'Apple M1 Pro',
  'Compute',
  'Hệ thống trên một vi mạch (SoC) kết hợp xử lý đa dụng và các bộ tăng tốc chuyên biệt.',
  'Xử lý tác vụ CPU, GPU và bộ tăng tốc trong cùng một thiết kế tích hợp.',
  { CPU: '10 nhân được chọn', GPU: '16 nhân được chọn' },
  ['m1proarchitecture'],
  'm1pro',
);
part(
  'm1pro',
  'cpu',
  'CPU M1 Pro',
  'Compute',
  'Con chip được chọn có tám nhân hiệu năng cao và hai nhân tiết kiệm điện.',
  'Chạy các luồng ứng dụng ở các mức hiệu năng và điện năng khác nhau.',
  { 'Số nhân': '8 hiệu năng cao + 2 tiết kiệm điện' },
  ['m1proarchitecture'],
  'maccpu',
);
part(
  'm1pro',
  'gpu',
  'GPU M1 Pro',
  'Graphics',
  'Mười sáu nhân đồ họa dùng chung vùng nhớ của hệ thống.',
  'Thực thi các tác vụ đồ họa và tính toán song song.',
  { 'Số nhân': '16' },
  ['m1proarchitecture'],
  'macgpu',
);
part(
  'm1pro',
  'memory',
  'Bộ nhớ hợp nhất (Unified memory)',
  'Memory',
  'CPU, GPU và các bộ tăng tốc cùng sử dụng một vùng nhớ chung.',
  'Chia sẻ dữ liệu mà không cần sao chép qua lại giữa bộ nhớ CPU và GPU riêng biệt.',
  { 'Dung lượng': '16 GB được chọn', 'Băng thông': '200 GB/s' },
  ['m1proarchitecture'],
  'macmemory',
);
part(
  'm1pro',
  'neural',
  'Neural Engine',
  'Compute',
  'Bộ tăng tốc mạng nơ-ron chuyên dụng.',
  'Tăng tốc các phép toán học máy được hỗ trợ.',
  { 'Số nhân': '16' },
  ['macbookspec'],
);
part(
  'm1pro',
  'media',
  'Bộ xử lý đa phương tiện (Media engine)',
  'Graphics',
  'Phần cứng chuyên dụng hỗ trợ xử lý video.',
  'Tăng tốc các quy trình làm việc với H.264, HEVC và ProRes.',
  {},
  ['m1proarchitecture'],
);
part(
  'm1pro',
  'io',
  'I/O và lưu trữ',
  'Board',
  'Các bộ điều khiển tích hợp kết nối SoC với phần còn lại của máy.',
  'Luân chuyển dữ liệu tới bộ nhớ lưu trữ và các giao diện ngoài.',
  {},
  ['macbookservice'],
);
part(
  'maccpu',
  'performance',
  'Nhân hiệu năng cao',
  'Compute',
  'Tám nhân ưu tiên các tác vụ CPU đòi hỏi thông lượng cao.',
  'Thực thi các luồng ứng dụng nặng.',
  { 'Số lượng': '8' },
  ['m1proarchitecture'],
  'maccore',
  '8 nhân',
);
part(
  'maccpu',
  'efficiency',
  'Nhân tiết kiệm điện',
  'Compute',
  'Hai nhân ưu tiên hiệu quả sử dụng năng lượng.',
  'Xử lý các tác vụ phù hợp ở mức tiêu thụ điện thấp hơn.',
  { 'Số lượng': '2' },
  ['m1proarchitecture'],
  undefined,
  '2 nhân',
);
part(
  'maccpu',
  'memory',
  'Truy cập bộ nhớ dùng chung',
  'Memory',
  'CPU truy xuất vào bộ nhớ hợp nhất của hệ thống.',
  'Cung cấp dữ liệu ứng dụng cho các nhân thực thi.',
  {},
  ['m1proarchitecture'],
);
part(
  'macgpu',
  'cores',
  'Nhân GPU',
  'Graphics',
  'Mười sáu nhân tích hợp thực thi đồ họa song song.',
  'Xử lý các tác vụ đồ họa và tính toán.',
  { 'Số lượng': '16' },
  ['m1proarchitecture'],
  'macgpucore',
  '16 nhân',
);
part(
  'macgpu',
  'memory',
  'Truy cập bộ nhớ hợp nhất',
  'Memory',
  'GPU sử dụng cùng vùng nhớ với CPU.',
  'Chia sẻ tài nguyên đồ họa và dữ liệu tính toán.',
  {},
  ['m1proarchitecture'],
);

for (const level of ['legioncore', 'maccore'] as const) {
  for (const [id, name, description, purpose] of [
    [
      'fetch',
      'Nạp lệnh (Fetch)',
      'Các lệnh được lấy ra để chuẩn bị thực thi.',
      'Cung cấp các thao tác tiếp theo cho nhân xử lý.',
    ],
    [
      'decode',
      'Giải mã lệnh (Decode)',
      'Các lệnh đã mã hóa được phân tích.',
      'Xác định phép toán và toán hạng cần thiết.',
    ],
    [
      'execute',
      'Tài nguyên thực thi',
      'Khối số học và logic thực hiện tính toán trên các giá trị.',
      'Tính toán ra kết quả cho chương trình.',
    ],
    [
      'registers',
      'Thanh ghi (Registers)',
      'Bộ nhớ nhỏ siêu nhanh lưu giữ các giá trị đang làm việc.',
      'Giữ toán hạng và kết quả ở ngay sát khối thực thi.',
    ],
    [
      'loadstore',
      'Truy cập bộ nhớ',
      'Thao tác nạp và lưu trao đổi dữ liệu với bộ nhớ.',
      'Kết nối quá trình thực thi chương trình với dữ liệu của nó.',
    ],
  ])
    part(
      level,
      id,
      name,
      'Compute',
      description,
      purpose,
      {
        'Phạm vi':
          'Mô hình giảng dạy CPU tổng quát; không khẳng định độ rộng đường ống hay số tầng của hãng',
      },
      ['cpuprinciples'],
    );
}
for (const level of ['legionsm', 'macgpucore'] as const) {
  for (const [id, name, description, purpose] of [
    [
      'schedule',
      'Lập lịch luồng',
      'Các nhóm tác vụ GPU được chọn để đưa vào thực thi.',
      'Duy trì nguồn việc liên tục cho các đơn vị thực thi.',
    ],
    [
      'arithmetic',
      'Tính toán song song',
      'Nhiều làn xử lý áp dụng phép toán đồng thời lên dữ liệu.',
      'Thực thi các lệnh shader hoặc tính toán song song.',
    ],
    [
      'registers',
      'Thanh ghi làm việc',
      'Bộ nhớ cục bộ tốc độ cao lưu giữ các giá trị đang hoạt động.',
      'Giữ trạng thái luồng ở ngay sát khối thực thi.',
    ],
    [
      'memory',
      'Truy cập bộ nhớ',
      'Dữ liệu di chuyển giữa khối thực thi và bộ nhớ.',
      'Cấp toán hạng đầu vào và lưu kết quả đầu ra.',
    ],
    [
      'texture',
      'Lấy mẫu vân bề mặt (Texture)',
      'Các tác vụ đồ họa lấy mẫu dữ liệu hình ảnh.',
      'Hỗ trợ truy xuất có lọc đối với tài nguyên texture.',
    ],
  ])
    part(
      level,
      id,
      name,
      'Graphics',
      description,
      purpose,
      {
        'Phạm vi':
          level === 'macgpucore'
            ? 'Khái niệm GPU tổng quát; không phải công bố vi kiến trúc của Apple'
            : 'Sơ đồ chức năng Ampere SM; không phải bản vẽ mặt bằng chip',
      },
      [level === 'macgpucore' ? 'metalprinciples' : 'ampereguide'],
    );
}
part(
  'legionmemory',
  'board',
  'Bo mạch SO-DIMM',
  'Board',
  'Bo mạch bộ nhớ ngắn vừa với khe cắm trên laptop.',
  'Kết nối các chip DRAM với hệ thống.',
  { 'Phạm vi': 'Mô-đun DDR4 laptop mang tính minh họa' },
  ['legionservice'],
);
part(
  'legionmemory',
  'dram',
  'Chip đóng gói DDR4 FBGA',
  'Memory',
  'Các chip bộ nhớ khả biến lưu giữ dữ liệu đang làm việc.',
  'Lưu trữ dữ liệu chương trình đang chạy khi có nguồn điện.',
  {},
  ['micron16gbddr4'],
  'legionpackage',
);
part(
  'legionmemory',
  'contacts',
  'Chân tiếp xúc SO-DIMM',
  'Memory',
  'Cạnh chân tiếp xúc có rãnh khóa lắp vừa vào khe bộ nhớ.',
  'Truyền tải tín hiệu bộ nhớ và nguồn điện.',
  {},
  ['legionservice'],
);
part(
  'legionmemory',
  'spd',
  'Nhận dạng mô-đun (SPD)',
  'Memory',
  'Một linh kiện nối tiếp nhỏ mô tả thông số thanh RAM.',
  'Cung cấp thông tin cấu hình trong quá trình khởi tạo.',
  {},
  ['micronddr4design'],
);
part(
  'macmemory',
  'pool',
  'Vùng nhớ DRAM dùng chung',
  'Memory',
  'Chiếc máy được chọn trang bị 16 GB bộ nhớ hợp nhất.',
  'Lưu giữ dữ liệu dùng chung cho nhiều bộ xử lý trên chip.',
  { 'Dung lượng': '16 GB' },
  ['m1proarchitecture'],
  'macdram',
);
part(
  'macmemory',
  'cpu',
  'Truy cập của CPU',
  'Compute',
  'Các tác vụ CPU đọc và ghi dữ liệu dùng chung.',
  'Phục vụ tập dữ liệu làm việc của ứng dụng.',
  {},
  ['m1proarchitecture'],
);
part(
  'macmemory',
  'gpu',
  'Truy cập của GPU',
  'Graphics',
  'Các tác vụ GPU sử dụng chung một vùng nhớ.',
  'Tránh cần đến một vùng nhớ VRAM tách biệt.',
  {},
  ['m1proarchitecture'],
);
part(
  'macmemory',
  'fabric',
  'Kết nối liên thông bộ nhớ',
  'Board',
  'Hệ thống điều phối việc truy cập giữa các bộ xử lý và bộ nhớ.',
  'Luân chuyển dữ liệu giữa các tài nguyên dùng chung.',
  {},
  ['m1proarchitecture'],
);
for (const [dram, cell] of [
  ['legiondram', 'legioncell'],
  ['macdram', 'maccell'],
] as const) {
  part(
    dram,
    'cells',
    'Các bank bộ nhớ DRAM',
    'Memory',
    'Một mảng lưu trữ các bit dưới dạng điện tích.',
    'Lưu giữ dữ liệu theo các hàng và cột.',
    {
      'Phạm vi':
        'Mảng khái niệm; dung lượng và số lượng bank vật lý không suy ra từ hình vẽ',
    },
    ['dramfundamentals'],
    dram === 'legiondram' ? 'legionbank' : 'macbank',
  );
  part(
    dram,
    'row',
    'Bộ giải mã hàng',
    'Memory',
    'Địa chỉ hàng chọn một đường wordline.',
    'Kích hoạt một hàng để truy cập.',
    {},
    ['dramfundamentals'],
  );
  part(
    dram,
    'sense',
    'Bộ khuếch đại cảm biến',
    'Memory',
    'Các chênh lệch điện tích nhỏ được khuếch đại lên.',
    'Đọc và khôi phục các giá trị đã lưu.',
    {},
    ['dramfundamentals'],
  );
  part(
    dram,
    'column',
    'Chọn cột',
    'Memory',
    'Địa chỉ cột chọn dữ liệu từ hàng đang mở.',
    'Truyền các bit đã chọn ra giao diện dữ liệu.',
    {},
    ['dramfundamentals'],
  );
  part(
    cell,
    'transistor',
    'Transistor truy cập',
    'Memory',
    'Một transistor đóng mở quyền truy cập vào nút lưu trữ.',
    'Nối tụ điện với đường bitline khi được chọn.',
    {},
    ['dramfundamentals'],
  );
  part(
    cell,
    'capacitor',
    'Tụ lưu trữ',
    'Memory',
    'Một tụ điện tích trữ điện tích đại diện cho một bit.',
    'Lưu giữ thông tin giữa các lần làm tươi.',
    {},
    ['dramfundamentals'],
  );
  part(
    cell,
    'wordline',
    'Đường wordline',
    'Memory',
    'Dây điều khiển hàng dẫn động các transistor truy cập.',
    'Chọn các ô nhớ để đọc hoặc ghi.',
    {},
    ['dramfundamentals'],
  );
  part(
    cell,
    'bitline',
    'Đường bitline',
    'Memory',
    'Dây dọc cột trao đổi điện tích với các ô nhớ được chọn.',
    'Dẫn tín hiệu về mạch cảm biến.',
    {},
    ['dramfundamentals'],
  );
  part(
    cell,
    'refresh',
    'Thao tác làm tươi',
    'Memory',
    'Điện tích lưu trữ phải được khôi phục định kỳ.',
    'Bảo toàn dữ liệu khả biến khi điện tích bị rò rỉ dần.',
    {},
    ['dramfundamentals'],
  );
}

part(
  'legionmemory',
  'passives',
  'Linh kiện lọc nguồn SO-DIMM',
  'Memory',
  'Các tụ điện nhỏ nằm sát chân nguồn của chip nhớ.',
  'Ổn định nguồn cấp cục bộ trong quá trình đóng ngắt.',
  {},
  ['sodimmkingston'],
);
part(
  'legionstorage',
  'cache',
  'Bộ nhớ đệm điều khiển SSD',
  'Memory',
  'Một ổ SSD điển hình có DRAM cục bộ để lưu bảng ánh xạ.',
  'Lưu đệm siêu dữ liệu ánh xạ flash; thiết kế SSD thực tế có thể khác nhau.',
  { 'Phạm vi': 'Thiết kế SSD minh họa, không phải danh mục linh kiện của Lenovo' },
  ['ssdarchitecture'],
);
part(
  'legionstorage',
  'fastener',
  'Ốc giữ M.2',
  'Storage',
  'Mô-đun được cố định tại điểm bắt ốc chuẩn 2280.',
  'Giữ ổ SSD tháo lắp được nằm chắc chắn trong khe cắm.',
  {},
  ['legionservice'],
);
part(
  'legionsm',
  'tensor',
  'Nhân Tensor (Tensor Cores)',
  'Compute',
  'Các đơn vị chuyên biệt của Ampere tăng tốc các phép toán ma trận được hỗ trợ.',
  'Xử lý phép toán ma trận dùng trong các tác vụ AI và đồ họa được hỗ trợ.',
  { 'Số lượng': '4 nhân Tensor thế hệ thứ ba mỗi SM (compute capability 8.6)' },
  ['amperega102'],
);
part(
  'legionsm',
  'rt',
  'Nhân dò tia (Ray tracing core)',
  'Graphics',
  'Một đơn vị chuyên dụng tăng tốc duyệt tia và kiểm tra giao điểm.',
  'Giảm chi phí tính toán của các tác vụ dò tia được hỗ trợ.',
  { 'Số lượng': '1 nhân RT thế hệ thứ hai mỗi SM' },
  ['amperega102'],
);

// Configuration-specific facts are kept alongside the authored entries. The
// geometry tests verify these quantities against rendered instances.
const specificationUpdates: Record<
  string,
  {
    specifications?: Record<string, string>;
    quantity?: string;
    sources?: SourceId[];
    description?: string;
  }
> = {
  legioncore: {
    specifications: { 'Số nhân': '8', 'Số luồng': '16', 'Kiến trúc': 'Zen 3' },
    quantity: '8 nhân / 16 luồng phần cứng',
  },
  legionsm: {
    specifications: {
      'Số SM': '30',
      'Nhân CUDA': '3,840',
      'Làn FP32 mỗi SM': '128',
      'Bộ nhớ': '6 GB GDDR6',
      'Phạm vi':
        '30 SM suy ra từ thông số công bố 3,840 làn và 128 làn mỗi SM Ampere 8.6',
    },
    quantity: '30 bộ đa xử lý luồng (SM)',
    sources: ['rtx3060laptop', 'amperega102'],
  },
  'legiongpu-memory': {
    specifications: { 'Bộ nhớ': '6 GB GDDR6', 'Giao diện': '192-bit' },
    sources: ['rtx3060laptop'],
  },
  legionmemory: {
    specifications: {
      Chuẩn: 'DDR4-3200',
      'Dung lượng': '8 GB mỗi thanh · đã lắp 16 GB',
      'Định dạng': '260-pin SO-DIMM',
      'Tổ chức': '1Rx8 · tám chip 8 Gbit x8',
      'Điện áp': '1.2 V',
      'Kích thước': 'PCB 69.6 × 30 × 1.2 mm',
      'Phạm vi':
        'Hình học đại diện của Kingston KVR32S22S8/8; không khẳng định là mã linh kiện gốc theo máy',
    },
    sources: ['sodimmkingston', 'legionpsref'],
    quantity: '2 thanh × 8 GB',
  },
  'legionmemory-board': {
    specifications: {
      'Kích thước': '69.6 × 30 × 1.2 mm',
      'Định dạng': '260-pin DDR4 SO-DIMM',
    },
    sources: ['sodimmkingston'],
  },
  'legionmemory-contacts': {
    specifications: {
      'Chân tiếp xúc': '260 · 130 mỗi mặt',
      'Bước chân': '0.5 mm trong mỗi dãy',
      'Rãnh khóa': 'Khuyết lệch chuẩn DDR4; không cắm lẫn được với DIMM máy bàn',
    },
    quantity: '260 chân tiếp xúc',
    sources: ['sodimmkingston'],
  },
  legionpackage: {
    specifications: {
      'Tổ chức': '1G × 8 · 8 Gbit mỗi chip',
      'Số bank': '16 · 4 nhóm × 4 bank',
      'Cụm truyền': 'BL8',
      'Phạm vi': '8 chip đóng gói tạo thành một mô-đun 8 GB',
    },
    quantity: '8 chip đóng gói · 4 chip mỗi mặt',
    sources: ['sodimmkingston', 'dramfundamentals'],
  },
  legionbank: {
    specifications: {
      'Số bank': '16 trên mỗi die 8 Gbit x8',
      'Phạm vi':
        'Tổ chức bank theo tài liệu kỹ thuật; góc nhìn ô nhớ nhỏ là ví dụ giảng dạy',
    },
    quantity: '16 bank trong góc nhìn die',
    sources: ['sodimmkingston', 'dramfundamentals'],
  },
  'legionsm-arithmetic': {
    specifications: { 'Làn FP32': 'Tổng 128 · 4 phân vùng × 32' },
    quantity: '4 phân vùng xử lý',
    sources: ['amperega102'],
  },
  'legionsm-schedule': {
    specifications: { 'Bộ lập lịch': '4 mỗi SM' },
    quantity: '4 bộ lập lịch warp',
    sources: ['amperega102'],
  },
  'legionsm-registers': {
    specifications: { 'Tổ chức': '4 tập thanh ghi cục bộ theo phân vùng' },
    quantity: '4 nhóm tập thanh ghi',
    sources: ['amperega102'],
  },
  'legionsm-texture': {
    specifications: { 'Đơn vị': '4 mỗi SM' },
    quantity: '4 đơn vị texture',
    sources: ['amperega102'],
  },
};
for (const entry of notebookConcepts) {
  const update = specificationUpdates[entry.id];
  if (update) Object.assign(entry, update);
}

part(
  'legionpackage',
  'substrate',
  'Đế mạch đóng gói',
  'Memory',
  'Lớp mạch mỏng định tuyến tín hiệu từ die ra lưới bi hàn.',
  'Tỏa các kết nối của die ra bo mạch.',
  {},
  ['packaging'],
);
part(
  'legionpackage',
  'balls',
  'Mối hàn bi FBGA',
  'Memory',
  'Lưới bi hàn gắn chip đóng gói lên thanh SO-DIMM.',
  'Cung cấp kết nối điện và giữ chặt cơ khí.',
  { 'Phạm vi': 'Lưới 78 bi hàn minh họa; số lượng chân thực tế có thể khác' },
  ['packaging'],
  undefined,
  '78 mối hàn minh họa',
);
part(
  'legionpackage',
  'mold',
  'Vỏ nhựa epoxy bảo vệ',
  'Memory',
  'Lớp nhựa bọc bảo vệ die và các kết nối bên trong.',
  'Bọc kín các cấu trúc mỏng manh bên trong.',
  {},
  ['packaging'],
);
part(
  'legionpackage',
  'wires',
  'Kết nối bên trong vỏ chip',
  'Memory',
  'Các dây dẫn mảnh nối các tiếp điểm trên die với đế mạch.',
  'Truyền dữ liệu, lệnh và nguồn điện qua vỏ đóng gói.',
  { 'Phạm vi': 'Cấu trúc hàn dây (wire-bond) minh họa' },
  ['packaging'],
);
part(
  'legionpackage',
  'die',
  'Đế bán dẫn DDR4 DRAM',
  'Memory',
  'Một die 8 Gbit x8 cung cấp không gian lưu trữ bên trong chip đóng gói đại diện.',
  'Chứa các mảng bank và mạch truy xuất.',
  { 'Dung lượng': '8 Gbit', 'Tổ chức': '1G × 8', 'Số bank': '16 · 4 nhóm gồm 4 bank' },
  ['sodimmkingston', 'dramfundamentals'],
  'legiondram',
);
for (const [level, cell] of [
  ['legionbank', 'legioncell'],
  ['macbank', 'maccell'],
] as const) {
  part(
    level,
    'cells',
    'Mảng con ô nhớ',
    'Memory',
    'Một bank chia mảng lưu trữ thành các ma trận ô nhớ (mat) cục bộ.',
    'Rút ngắn dây dẫn cục bộ và ghép nối lưu trữ với mạch cảm biến.',
    { 'Phạm vi': 'Số lượng mat minh họa; không phải bản tái tạo die vật lý' },
    ['dramfundamentals'],
    cell,
    '6 mat ô nhớ minh họa',
  );
  part(
    level,
    'row',
    'Giải mã hàng',
    'Memory',
    'Mạch logic chọn hàng kích hoạt một đường wordline trong mat ô nhớ.',
    'Chọn các ô nhớ có điện tích cần đọc.',
    {},
    ['dramfundamentals'],
  );
  part(
    level,
    'sense',
    'Bộ khuếch đại cảm biến cục bộ',
    'Memory',
    'Các bộ khuếch đại cục bộ phân giải chênh lệch điện tích nhỏ trên đường bitline.',
    'Đọc và khôi phục hàng đã chọn.',
    {},
    ['dramfundamentals'],
  );
  part(
    level,
    'column',
    'Đường dẫn dữ liệu toàn cục',
    'Memory',
    'Khối chọn cột luân chuyển dữ liệu giữa các mảng cục bộ và giao diện bank.',
    'Truyền các bit đã chọn tới hoặc từ bus dữ liệu.',
    {},
    ['dramfundamentals'],
  );
}
