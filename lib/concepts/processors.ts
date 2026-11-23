import { concept, type Concept } from '../concept.ts';

/**
 * Two desktop processors, and why they do not look alike.
 *
 * These are the only named parts in the machine besides the graphics card, and
 * they are here because the contrast is the lesson. Both are 2024 flagships on
 * the same class of process, both plug into a socket on the same board, and
 * they are built on opposite answers to the same question: what do you do when
 * one piece of silicon gets too big and too expensive to yield well?
 *
 * AMD splits the processor into several small dies and wires them together
 * across the package. Two identical eight core complex dies, plus one older
 * and cheaper die carrying everything that does not benefit from a leading
 * edge process: the memory controllers, the PCIe lanes, the display outputs.
 * Two of the same part, made in volume, binned and paired.
 *
 * Intel splits it differently. Four tiles of different kinds, each on the
 * process that suits it, stacked face down onto a base tile that carries the
 * wiring between them. Not repeated units but specialised ones, and the cores
 * themselves come in two sizes: eight wide ones for latency, sixteen small
 * ones for throughput, interleaved rather than grouped.
 *
 * Everything below is the published specification. The floorplans in the 3D
 * view are arranged from public die shots and vendor diagrams: block positions
 * are illustrative, not a mask layout.
 */

export const processorConcepts: Concept[] = [
  // ── AMD Ryzen 9 9950X ────────────────────────────────────────────────────
  concept({
    id: 'ryzenpackage',
    name: 'AMD Ryzen 9 9950X',
    shortName: 'Ryzen 9 9950X',
    category: 'Compute',
    parent: 'cpu',
    level: 'ryzen',
    open: 'ryzen',
    description:
      'Mười sáu nhân Zen 5 nằm trên hai die phức hợp nhân (CCD), cùng một I/O die riêng biệt đảm nhận bộ nhớ và PCIe, tất cả trên cùng một đế cắm AM5.',
    purpose:
      'Chia bộ xử lý thành các die nhỏ lặp lại giúp giữ tỷ lệ sản xuất đạt chuẩn cao và cho phép các thành phần không cần tiến trình đắt đỏ nằm trên tiến trình rẻ hơn.',
    quantity: '1 gói xử lý mô phỏng',
    specifications: {
      'Kiến trúc': 'Zen 5 · chiplet',
      'Số nhân': '16 nhân, 32 luồng',
      'Xung nhịp': '4.3 GHz cơ bản, tối đa 5.7 GHz boost',
      'Bộ nhớ đệm': '64 MB L3, 16 MB L2, 1280 KB L1',
      'Tiến trình': 'Nhân TSMC 4 nm, I/O die TSMC 6 nm',
      Socket: 'AM5',
      'TDP mặc định': '170 W',
    },
    representationType: 'logical',
    physicalAccuracy:
      'Thông số kỹ thuật theo số liệu công bố của AMD. Cách bố trí die dựa theo ảnh chụp gói xử lý công khai; vị trí các khối bên trong mỗi die chỉ mang tính minh họa, không phải bản vẽ mặt nạ bán dẫn.',
    sources: ['ryzen', 'zen5'],
    searchTerms: [
      'ryzen',
      'amd',
      '9950x',
      'zen 5',
      'am5',
      'chiplet',
      'vi xử lý',
      'bộ xử lý',
    ],
  }),
  concept({
    id: 'zenccd',
    name: 'Die phức hợp nhân (CCD)',
    shortName: 'CCD',
    category: 'Compute',
    parent: 'ryzenpackage',
    level: 'ryzen',
    description:
      'Một die nhỏ chứa tám nhân Zen 5 và 32 MB bộ nhớ đệm L3 dùng chung. Gói xử lý mang hai die như vậy, giống hệt nhau.',
    purpose:
      'Die nhỏ cho tỷ lệ thành phẩm cao hơn nhiều so với die lớn, và làm hai phần giống nhau rẻ hơn làm một phần lớn gấp đôi. Đổi lại, một luồng trên die này chỉ có thể giao tiếp với die kia qua gói xử lý.',
    quantity: '2 die mô phỏng',
    specifications: {
      'Số lượng': '2 mỗi gói xử lý',
      'Số nhân': '8 nhân mỗi die',
      'L3 mỗi die': '32 MB',
      'Tiến trình': 'TSMC 4 nm',
      'Diện tích die': 'Khoảng 70.6 mm²',
    },
    representationType: 'logical',
    sources: ['zen5', 'ryzen'],
    searchTerms: [
      'ccd',
      'chiplet',
      'core complex',
      'die',
      'zen',
      'die phức hợp nhân',
    ],
  }),
  concept({
    id: 'zencore',
    name: 'Nhân Zen 5',
    shortName: 'Nhân Zen 5',
    category: 'Compute',
    parent: 'zenccd',
    level: 'ryzen',
    description:
      'Một nhân thực thi không theo thứ tự (out-of-order) đầy đủ với 80 KB L1 và 1 MB L2 riêng, chạy hai luồng xử lý.',
    purpose:
      'Mọi nhân ở đây đều có cùng kích thước và thiết kế, nên hệ điều hành có thể coi bất kỳ nhân nào trong số mười sáu nhân là tương đương khi phân phối tác vụ.',
    quantity: '16 nhân mô phỏng',
    specifications: {
      'Số lượng': 'Tổng 16 nhân, 8 mỗi die',
      'L1 mỗi nhân': '80 KB (48 KB dữ liệu và 32 KB lệnh)',
      'L2 mỗi nhân': '1 MB',
      'Số luồng': '2 luồng mỗi nhân',
    },
    representationType: 'logical',
    sources: ['zen5'],
    searchTerms: ['core', 'zen', 'smt', 'thread', 'out of order', 'nhân', 'luồng'],
  }),
  concept({
    id: 'zenl3',
    name: 'Bộ nhớ đệm L3 dùng chung',
    shortName: 'L3',
    category: 'Memory',
    parent: 'zenccd',
    level: 'ryzen',
    description:
      'Vùng đệm 32 MB trên mỗi die phức hợp nhân, được tám nhân trên die đó dùng chung và không chia sẻ với tám nhân còn lại.',
    purpose:
      'Lưu giữ dữ liệu mà các nhân đang xử lý để phần lớn truy cập không phải ra tới RAM. Vì nằm riêng theo từng die, các luồng dùng chung dữ liệu chạy tốt nhất khi bộ lập lịch giữ chúng trên cùng một die.',
    quantity: '2 vùng đệm mô phỏng',
    specifications: { 'Tổng dung lượng': '64 MB', 'Mỗi die': '32 MB' },
    representationType: 'logical',
    sources: ['ryzen'],
    searchTerms: ['l3', 'cache', 'shared', 'victim', 'bộ nhớ đệm'],
  }),
  concept({
    id: 'zeniod',
    name: 'I/O die',
    shortName: 'I/O die',
    category: 'Board',
    parent: 'ryzenpackage',
    level: 'ryzen',
    open: 'ryzenio',
    description:
      'Một die lớn hơn nằm riêng trên tiến trình cũ hơn, chứa bộ điều khiển bộ nhớ, các làn PCIe, khối xuất hình ảnh và mạch kết nối liên thông mọi thành phần.',
    purpose:
      'Giao tiếp bộ nhớ và PCIe hầu như không hưởng lợi từ tiến trình tiên tiến nhất, nên đặt chúng lên tiến trình rẻ hơn không làm giảm hiệu năng mà tiết kiệm rất nhiều diện tích wafer đắt đỏ.',
    quantity: '1 die mô phỏng',
    specifications: {
      'Tiến trình': 'TSMC 6 nm',
      'Bộ nhớ': 'DDR5 kênh đôi, tối đa 256 GB',
      'Vai trò': 'Bộ nhớ, PCIe, xuất hình, kết nối nội bộ',
    },
    representationType: 'logical',
    sources: ['ryzen', 'ddr5'],
    searchTerms: [
      'iod',
      'io die',
      'memory controller',
      'pcie',
      'uncore',
      'bộ điều khiển bộ nhớ',
    ],
  }),
  concept({
    id: 'zeniomemory',
    name: 'Bộ điều khiển bộ nhớ DDR5',
    shortName: 'Điều khiển DDR5',
    category: 'Memory',
    parent: 'zeniod',
    level: 'ryzenio',
    description:
      'Hai khối điều khiển ở rìa I/O die kết nối gói bộ xử lý với bộ nhớ DDR5 kênh đôi.',
    purpose:
      'Lập lịch đọc/ghi, hiệu chỉnh đường truyền điện và chuyển đổi yêu cầu từ fabric thành lệnh DDR5.',
    quantity: '2 khối điều khiển mô phỏng',
    specifications: {
      'Bộ nhớ': 'DDR5 kênh đôi',
      'Dung lượng': 'Tối đa 256 GB',
    },
    representationType: 'logical',
    sources: ['ryzen', 'ddr5'],
    searchTerms: [
      'memory controller',
      'ddr5',
      'dram',
      'channel',
      'bộ điều khiển bộ nhớ',
      'kênh đôi',
    ],
  }),
  concept({
    id: 'zeniopcie',
    name: 'Tổ hợp gốc PCI Express',
    shortName: 'PCIe root',
    category: 'Board',
    parent: 'zeniod',
    level: 'ryzenio',
    description:
      'Các giao tiếp nối tiếp tốc độ cao giúp bộ xử lý đóng vai trò gốc của hệ thống phân cấp PCI Express trên nền tảng.',
    purpose:
      'Kết nối trực tiếp card đồ họa, ổ cứng NVMe và chipset bo mạch chủ với gói bộ xử lý.',
    quantity: '2 vùng giao tiếp mô phỏng',
    specifications: { 'Thế hệ': 'PCI Express 5.0', 'Vai trò': 'Tổ hợp gốc (Root complex)' },
    representationType: 'logical',
    sources: ['ryzen', 'pcie'],
    searchTerms: ['pcie', 'root complex', 'nvme', 'graphics lanes', 'làn pcie'],
  }),
  concept({
    id: 'zeniofabric',
    name: 'Mạch kết nối I/O die',
    shortName: 'I/O fabric',
    category: 'Board',
    parent: 'zeniod',
    level: 'ryzenio',
    description:
      'Mạch định tuyến trung tâm bên trong I/O die nối bộ nhớ, PCIe và các đường liên kết trên gói xử lý tới cả hai die nhân.',
    purpose:
      'Luân chuyển yêu cầu giữa các giao tiếp và cung cấp đường dẫn cho mọi cụm nhân tới bộ nhớ và thiết bị ngoại vi.',
    quantity: '1 mạch kết nối mô phỏng',
    specifications: { 'Cấu trúc liên kết': 'Ma trận chéo trung tâm minh họa' },
    representationType: 'logical',
    sources: ['ryzen', 'zen5'],
    searchTerms: ['infinity fabric', 'crossbar', 'interconnect', 'data fabric', 'kết nối'],
  }),
  concept({
    id: 'zeniodisplay',
    name: 'Khối xử lý hiển thị',
    shortName: 'Khối hiển thị',
    category: 'Graphics',
    parent: 'zeniod',
    level: 'ryzenio',
    description:
      'Một vùng đồ họa tích hợp và xuất hình ảnh nhỏ đủ để chạy màn hình desktop mà không cần card đồ họa rời.',
    purpose:
      'Cung cấp ngõ ra hiển thị cơ bản, tác vụ đa phương tiện và phương án dự phòng khi chẩn đoán lỗi hoặc làm việc văn phòng.',
    quantity: '1 vùng mô phỏng',
    specifications: { 'Vai trò': 'Hiển thị và đa phương tiện tích hợp' },
    representationType: 'logical',
    sources: ['ryzen'],
    searchTerms: ['display', 'igpu', 'integrated graphics', 'media', 'đồ họa tích hợp', 'xuất hình'],
  }),
  concept({
    id: 'zeniousb',
    name: 'USB và I/O nền tảng',
    shortName: 'I/O nền tảng',
    category: 'Board',
    parent: 'zeniod',
    level: 'ryzenio',
    description:
      'Logic điều khiển tốc độ thấp phục vụ USB và các chức năng quản lý gói xử lý nằm xung quanh các đường truyền tốc độ cao.',
    purpose:
      'Xử lý thiết bị ngoại vi gắn ngoài và các giao tiếp quản trị hệ thống không cần đặt trong các die nhân.',
    quantity: '1 vùng mô phỏng',
    specifications: { 'Vai trò': 'USB và dịch vụ nền tảng' },
    representationType: 'logical',
    sources: ['ryzen'],
    searchTerms: ['usb', 'platform io', 'peripheral', 'controller', 'ngoại vi'],
  }),
  concept({
    id: 'zenfabric',
    name: 'Infinity Fabric',
    shortName: 'Fabric',
    category: 'Board',
    parent: 'ryzenpackage',
    level: 'ryzen',
    description:
      'Các đường liên kết chạy trên đế gói xử lý nối từng die phức hợp nhân với I/O die.',
    purpose:
      'Truyền tải mọi truy cập bộ nhớ và trao đổi bộ nhớ đệm giữa các die. Đây là cái giá của việc tách nhỏ bộ xử lý: một die muốn truy cập RAM hoặc nói chuyện với die kia đều phải đi qua đây trước.',
    quantity: '2 đường liên kết mô phỏng',
    specifications: { 'Cấu trúc liên kết': 'Từ mỗi die nhân tới I/O die' },
    representationType: 'logical',
    sources: ['zen5'],
    searchTerms: ['infinity fabric', 'interconnect', 'link', 'substrate', 'liên kết'],
  }),

  // ── Intel Core Ultra 9 285K ──────────────────────────────────────────────
  concept({
    id: 'corepackage',
    name: 'Intel Core Ultra 9 285K',
    shortName: 'Core Ultra 9 285K',
    category: 'Compute',
    parent: 'cpu',
    level: 'corei9',
    open: 'corei9',
    description:
      'Hai mươi bốn nhân với hai kích thước khác nhau trên một compute tile, xếp chồng cùng ba tile khác lên một base tile đảm nhận kết nối giữa chúng.',
    purpose:
      'Trong khi AMD lặp lại một die nhỏ, Intel chuyên môn hóa: mỗi tile được chế tạo trên tiến trình phù hợp với nhiệm vụ, và base tile bên dưới dẫn các đường kết nối giữa chúng.',
    quantity: '1 gói xử lý mô phỏng',
    specifications: {
      'Kiến trúc': 'Arrow Lake · Lion Cove + Skymont',
      'Số nhân': '24 nhân, 24 luồng (8 P-core và 16 E-core)',
      'Xung nhịp': '3.7 GHz cơ bản (P-core), tối đa 5.7 GHz turbo',
      'Bộ nhớ đệm': '36 MB dùng chung, tổng 40 MB L2',
      'Tiến trình': 'Compute tile TSMC N3B',
      Socket: 'LGA 1851',
      'Công suất': '125 W cơ bản, tối đa 250 W turbo',
    },
    representationType: 'logical',
    physicalAccuracy:
      'Thông số kỹ thuật theo số liệu công bố của Intel. Kích thước tile dựa theo diện tích die công bố; vị trí các khối bên trong compute tile chỉ mang tính minh họa, không phải bản vẽ mặt nạ bán dẫn.',
    sources: ['corei9', 'arrowlake'],
    searchTerms: [
      'intel',
      'core ultra',
      '285k',
      'arrow lake',
      'lga1851',
      'tile',
      'vi xử lý',
      'bộ xử lý',
    ],
  }),
  concept({
    id: 'arrowcompute',
    name: 'Compute tile (Tile tính toán)',
    shortName: 'Compute tile',
    category: 'Compute',
    parent: 'corepackage',
    level: 'corei9',
    description:
      'Tile chứa toàn bộ hai mươi bốn nhân và bộ nhớ đệm dùng chung, được sản xuất trên tiến trình tiên tiến nhất trong gói xử lý.',
    purpose:
      'Chỉ các nhân xử lý mới xứng đáng với chi phí của tiến trình đầu bảng, nên chỉ có chúng được chế tạo trên đó. Mọi thứ khác trong gói đều nằm trên tiến trình rẻ hơn.',
    quantity: '1 tile mô phỏng',
    specifications: { 'Tiến trình': 'TSMC N3B', 'Diện tích': 'Khoảng 117 mm²' },
    representationType: 'logical',
    sources: ['arrowlake'],
    searchTerms: ['compute tile', 'die', 'n3b', 'cores', 'tile tính toán'],
  }),
  concept({
    id: 'arrowpcore',
    name: 'Nhân hiệu năng cao (P-core)',
    shortName: 'P-core',
    category: 'Compute',
    parent: 'arrowcompute',
    level: 'corei9',
    description:
      'Nhân Lion Cove cỡ lớn với 3 MB L2 riêng, được xây dựng cho những tác vụ cần một luồng hoàn thành nhanh nhất.',
    purpose:
      'Rộng, sâu và tốn diện tích. Các nhân này gánh những luồng bạn đang chờ kết quả, còn các nhân nhỏ lo mọi tác vụ chạy nền.',
    quantity: '8 nhân mô phỏng',
    specifications: {
      'Số lượng': '8',
      'Kiến trúc': 'Lion Cove',
      'L2 mỗi nhân': '3 MB',
      'Số luồng': '1 luồng mỗi nhân',
    },
    representationType: 'logical',
    sources: ['arrowlake', 'corei9'],
    searchTerms: ['p-core', 'performance', 'lion cove', 'big core', 'nhân hiệu năng cao'],
  }),
  concept({
    id: 'arrowecore',
    name: 'Nhân tiết kiệm điện (E-core)',
    shortName: 'E-core',
    category: 'Compute',
    parent: 'arrowcompute',
    level: 'corei9',
    description:
      'Nhân Skymont nhỏ hơn, gom thành từng cụm bốn nhân quanh 4 MB L2 dùng chung. Mười sáu nhân này chỉ chiếm diện tích tương đương khoảng bốn nhân lớn.',
    purpose:
      'Ưu tiên thông lượng trên mỗi milimét vuông thay vì tốc độ đơn luồng. Ở thế hệ này, các cụm E-core nằm xen kẽ giữa các nhân lớn thay vì gom thành một khối riêng ở một bên.',
    quantity: '16 nhân mô phỏng, chia làm 4 cụm',
    specifications: {
      'Số lượng': '16 nhân, chia theo cụm 4 nhân',
      'Kiến trúc': 'Skymont',
      'L2 mỗi cụm': '4 MB',
    },
    representationType: 'logical',
    sources: ['arrowlake', 'corei9'],
    searchTerms: ['e-core', 'efficient', 'skymont', 'cluster', 'atom', 'nhân tiết kiệm điện'],
  }),
  concept({
    id: 'arrowl3',
    name: 'Bộ nhớ đệm dùng chung',
    shortName: 'Bộ nhớ đệm chung',
    category: 'Memory',
    parent: 'arrowcompute',
    level: 'corei9',
    description:
      'Một vùng đệm 36 MB nằm trên mạch vòng (ring) kết nối mọi nhân, cả nhân lớn lẫn nhân nhỏ.',
    purpose:
      'Khác với vùng đệm tách rời, mọi nhân đều có thể dùng toàn bộ dung lượng này, giúp bộ lập lịch tự do chuyển luồng giữa nhân lớn và nhân nhỏ mà không làm mất tập dữ liệu đang làm việc.',
    quantity: '1 vùng đệm mô phỏng',
    specifications: { 'Dung lượng': '36 MB', 'Chia sẻ': 'Tất cả 24 nhân' },
    representationType: 'logical',
    sources: ['corei9'],
    searchTerms: ['cache', 'smart cache', 'l3', 'ring', 'bộ nhớ đệm'],
  }),
  concept({
    id: 'arrowsoc',
    name: 'SoC tile',
    shortName: 'SoC tile',
    category: 'Board',
    parent: 'corepackage',
    level: 'corei9',
    description:
      'Tile chứa bộ điều khiển bộ nhớ, mạch kết nối và vùng tiết kiệm điện vẫn duy trì hoạt động khi compute tile ở trạng thái nghỉ.',
    purpose:
      'Cho phép tắt hoàn toàn compute tile đắt đỏ khi chạy tác vụ nhẹ trong khi máy vẫn phản hồi mượt mà.',
    quantity: '1 tile mô phỏng',
    specifications: {
      'Tiến trình': 'TSMC N6',
      'Diện tích': 'Khoảng 87 mm²',
      'Bộ nhớ': 'DDR5 kênh đôi lên tới 6400 MT/s',
    },
    representationType: 'logical',
    sources: ['arrowlake', 'ddr5'],
    searchTerms: ['soc tile', 'memory controller', 'fabric', 'low power', 'bộ điều khiển bộ nhớ'],
  }),
  concept({
    id: 'arrowgpu',
    name: 'Graphics tile (Tile đồ họa)',
    shortName: 'Graphics tile',
    category: 'Compute',
    parent: 'corepackage',
    level: 'corei9',
    description:
      'Một tile đồ họa tích hợp nhỏ, đủ sức xuất màn hình và giải mã video mà không cần lắp card rời.',
    purpose:
      'Giúp máy vẫn dùng được khi không có card đồ họa trong khe cắm, đồng thời xử lý mã hóa và giải mã video bằng phần cứng chuyên dụng ngay cả khi có card rời.',
    quantity: '1 tile mô phỏng',
    specifications: { 'Tiến trình': 'TSMC N5P', 'Diện tích': 'Khoảng 23 mm²' },
    representationType: 'logical',
    sources: ['arrowlake'],
    searchTerms: ['graphics tile', 'igpu', 'integrated', 'display', 'đồ họa tích hợp'],
  }),
  concept({
    id: 'arrowio',
    name: 'I/O extender tile (Tile mở rộng I/O)',
    shortName: 'I/O tile',
    category: 'Board',
    parent: 'corepackage',
    level: 'corei9',
    open: 'coreio',
    description:
      'Một tile nhỏ chứa các đường truyền tốc độ cao ra ngoài không đặt vừa trên SoC tile, chủ yếu là PCIe và Thunderbolt.',
    purpose:
      'Những giao tiếp như thế này chủ yếu gồm mạch tương tự (analogue) vốn không thu nhỏ hiệu quả trên tiến trình mới, nên được đẩy ra một tile riêng có chi phí rẻ.',
    quantity: '1 tile mô phỏng',
    specifications: { 'Tiến trình': 'TSMC N6', 'Diện tích': 'Khoảng 24 mm²' },
    representationType: 'logical',
    sources: ['arrowlake', 'pcie'],
    searchTerms: ['io tile', 'extender', 'pcie', 'thunderbolt', 'mở rộng io'],
  }),
  concept({
    id: 'arrowiopcie',
    name: 'Giao tiếp PCI Express',
    shortName: 'Giao tiếp PCIe',
    category: 'Board',
    parent: 'arrowio',
    level: 'coreio',
    description:
      'Các giao tiếp vật lý tốc độ cao trên tile mở rộng kết nối các đường PCI Express bên ngoài vào mạch liên kết của bộ xử lý.',
    purpose:
      'Luân chuyển lưu lượng đồ họa và lưu trữ qua các mạch đầu cuối tương tự ngắn mà không tốn diện tích của compute tile tiên tiến.',
    quantity: '2 vùng giao tiếp mô phỏng',
    specifications: { 'Thế hệ': 'PCI Express 5.0', Tile: 'I/O extender' },
    representationType: 'logical',
    sources: ['arrowlake', 'pcie'],
    searchTerms: ['pcie', 'phy', 'root port', 'graphics', 'nvme', 'giao tiếp pcie'],
  }),
  concept({
    id: 'arrowiothunderbolt',
    name: 'Giao tiếp Thunderbolt',
    shortName: 'Thunderbolt',
    category: 'Board',
    parent: 'arrowio',
    level: 'coreio',
    description:
      'Mạch I/O tốc độ cao gắn ngoài được gom trên tile mở rộng cùng với các giao tiếp vật lý PCI Express.',
    purpose:
      'Cung cấp kết nối băng thông cao gọn nhẹ dùng chung cho màn hình, ổ lưu trữ và các dock ngoại vi.',
    quantity: '2 vùng giao tiếp mô phỏng',
    specifications: { 'Vai trò': 'I/O tốc độ cao gắn ngoài' },
    representationType: 'logical',
    sources: ['arrowlake'],
    searchTerms: ['thunderbolt', 'usb4', 'dock', 'external io', 'ngoại vi'],
  }),
  concept({
    id: 'arrowiod2d',
    name: 'Giao tiếp giữa các die (Die-to-die)',
    shortName: 'Liên kết die-to-die',
    category: 'Board',
    parent: 'arrowio',
    level: 'coreio',
    description:
      'Một giao tiếp nội bộ mật độ cao ở mép tile dẫn lưu lượng đi xuống qua Foveros base tile tới mạch kết nối của SoC.',
    purpose:
      'Giúp I/O tile tách rời hoạt động như một phần của cùng một bộ xử lý thay vì như thiết bị ngoại vi.',
    quantity: '1 dải giao tiếp mô phỏng',
    specifications: { 'Đường dẫn': 'Từ I/O tile qua đế Foveros' },
    representationType: 'logical',
    sources: ['arrowlake'],
    searchTerms: ['die to die', 'foveros', 'interconnect', 'base tile', 'liên kết'],
  }),
  concept({
    id: 'arrowioclock',
    name: 'Xung nhịp và điều hòa tín hiệu',
    shortName: 'Mạch xung nhịp',
    category: 'Board',
    parent: 'arrowio',
    level: 'coreio',
    description:
      'Logic hỗ trợ tương tự dùng chung giúp điều hòa xung nhịp tham chiếu và tín hiệu tốc độ cao cho các giao tiếp trên tile.',
    purpose:
      'Giữ cho các đường truyền nối tiếp luôn đồng bộ và ổn định về điện khi dữ liệu đi qua ranh giới gói xử lý.',
    quantity: '1 vùng hỗ trợ mô phỏng',
    specifications: { 'Vai trò': 'Logic hỗ trợ PHY minh họa' },
    representationType: 'logical',
    sources: ['arrowlake', 'pcie'],
    searchTerms: ['clock', 'pll', 'signal conditioning', 'phy', 'xung nhịp', 'tín hiệu'],
  }),
  concept({
    id: 'arrowbase',
    name: 'Foveros base tile (Tile đế Foveros)',
    shortName: 'Base tile',
    category: 'Board',
    parent: 'corepackage',
    level: 'corei9',
    description:
      'Một die lớn, được thiết kế đơn giản có chủ đích nằm bên dưới các tile khác, dẫn nguồn điện và đường dây kết nối giữa chúng. Bốn tile xử lý được xếp úp mặt lên trên nó.',
    purpose:
      'Đây là thứ biến các tile thành một bộ xử lý thống nhất. Kết nối giữa các tile đi xuyên qua silicon tại đây thay vì chạy qua đế mạch, giúp đường dẫn ngắn hơn, dày đặc hơn và tiết kiệm điện hơn.',
    quantity: '1 tile đế mô phỏng',
    specifications: {
      'Tiến trình': 'Intel 22FFL',
      'Diện tích': 'Khoảng 303 mm²',
      'Vai trò': 'Đi dây giữa các die và cấp nguồn',
    },
    representationType: 'logical',
    sources: ['arrowlake'],
    searchTerms: ['foveros', 'base tile', 'interposer', 'stacking', '3d', 'tile đế'],
  }),
];
