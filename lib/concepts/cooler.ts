import { concept, type Concept } from '../concept.ts';

/**
 * Inside the processor cooler.
 *
 * A tower cooler is one idea repeated: get heat off a small hot lid, spread it
 * along pipes into a large area of thin metal, and blow air through that metal.
 * Each part below is one step of it.
 *
 * Fin count, pipe count and the mounting hardware vary between coolers; these
 * are representative of the category, not a specific product.
 */
export const coolerConcepts: Concept[] = [
  concept({
    id: 'coolerbase',
    name: 'Đế tiếp xúc',
    shortName: 'Đế tiếp xúc',
    category: 'Cooling',
    parent: 'cpucooler',
    level: 'cooler',
    description:
      'Khối đồng được mài phẳng, thường mạ niken, ép chặt vào nắp bộ xử lý.',
    purpose:
      'Thu nhiệt từ nắp CPU nhỏ nhưng rất nóng và truyền sang các ống dẫn nhiệt trên diện tích tiếp xúc lớn nhất có thể.',
    quantity: '1 khối mô phỏng',
    specifications: { 'Vật liệu': 'Đồng mạ niken' },
    representationType: 'physical',
    sources: ['aircooler'],
    searchTerms: ['coldplate', 'base', 'copper', 'contact', 'lapped', 'đế đồng', 'đế tản nhiệt'],
  }),
  concept({
    id: 'coolerpaste',
    name: 'Keo tản nhiệt',
    shortName: 'Keo tản nhiệt',
    category: 'Cooling',
    parent: 'coolerbase',
    level: 'cooler',
    description:
      'Lớp hợp chất mỏng điền đầy giữa nắp bộ xử lý và đế tiếp xúc.',
    purpose:
      'Lấp đầy các khe hở không khí siêu nhỏ giữa hai bề mặt tưởng phẳng nhưng thực chất gồ ghề. Không khí chính là lớp cách nhiệt cần được đẩy ra.',
    quantity: '1 lớp mô phỏng',
    specifications: { 'Độ dày': 'Mỏng nhất có thể khi ép chặt' },
    representationType: 'physical',
    sources: ['aircooler'],
    searchTerms: ['paste', 'compound', 'tim', 'thermal', 'grease', 'keo tản nhiệt'],
  }),
  concept({
    id: 'coolerpipes',
    name: 'Ống đồng dẫn nhiệt',
    shortName: 'Ống dẫn nhiệt',
    category: 'Cooling',
    parent: 'cpucooler',
    level: 'cooler',
    description:
      'Các ống đồng hàn kín chứa bấc mao dẫn và một lượng nhỏ chất lỏng làm việc, được ép dẹt tại đoạn đi qua đế tiếp xúc.',
    purpose:
      'Chất lỏng sôi ở đầu nóng, bay hơi lên đầu lạnh, ngưng tụ truyền nhiệt vào các lá nhôm rồi theo bấc quay lại. Cơ chế này dẫn nhiệt nhanh hơn nhiều so với đồng đặc cùng trọng lượng.',
    quantity: '4 ống mô phỏng',
    specifications: { 'Cấu tạo': 'Đồng hàn kín, có bấc mao dẫn' },
    representationType: 'physical',
    sources: ['aircooler'],
    searchTerms: [
      'heat pipe',
      'copper',
      'vapour',
      'wick',
      'phase change',
      'ống đồng',
      'ống dẫn nhiệt',
    ],
  }),
  concept({
    id: 'coolerfins',
    name: 'Khối lá tản nhiệt',
    shortName: 'Lá tản nhiệt',
    category: 'Cooling',
    parent: 'cpucooler',
    level: 'cooler',
    description:
      'Hàng chục lá nhôm mỏng ép chặt vào các ống dẫn nhiệt theo khoảng cách cố định.',
    purpose:
      'Biến nhiệt lượng từ các ống dẫn thành diện tích bề mặt cực lớn để luồng gió thổi qua. Khoảng cách giữa các lá là sự đánh đổi: càng khít diện tích càng lớn nhưng cần áp suất gió cao hơn để thổi xuyên qua.',
    quantity: '48 lá mô phỏng',
    specifications: { 'Vật liệu': 'Nhôm', 'Bước lá': 'Minh họa' },
    representationType: 'physical',
    sources: ['aircooler'],
    searchTerms: [
      'fins',
      'stack',
      'aluminium',
      'surface area',
      'radiator',
      'lá tản nhiệt',
      'lá nhôm',
    ],
  }),
  concept({
    id: 'coolercap',
    name: 'Nắp che đỉnh',
    shortName: 'Nắp đỉnh',
    category: 'Cooling',
    parent: 'coolerfins',
    level: 'cooler',
    description: 'Tấm kim loại phay xước đậy trên đỉnh tháp tản nhiệt, thường có đèn.',
    purpose:
      'Hoàn thiện thẩm mỹ phần đỉnh tháp tản nhiệt và tạo bề mặt in logo thương hiệu. Nắp trang trí này là chi tiết minh họa bổ sung; tài liệu tham chiếu mô tả phần tháp ống đồng bên dưới.',
    quantity: '1 nắp mô phỏng',
    specifications: { 'Hoàn thiện': 'Phay xước, minh họa' },
    representationType: 'physical',
    sources: ['aircooler'],
    searchTerms: ['cover', 'cap', 'top', 'plate', 'lid', 'nắp tản nhiệt'],
  }),
  concept({
    id: 'coolerfan',
    name: 'Quạt tản nhiệt',
    shortName: 'Quạt',
    category: 'Cooling',
    parent: 'cpucooler',
    level: 'cooler',
    description:
      'Quạt gắn vào mặt trước của khối lá tản nhiệt, thổi gió xuyên qua các khe lá.',
    purpose:
      'Liên tục thay mới lớp không khí tiếp xúc với các lá nhôm. Nếu không có gió lưu thông, cả khối tản nhiệt sẽ nhanh chóng nóng bằng nhiệt độ CPU.',
    quantity: '1 quạt mô phỏng',
    specifications: { 'Kích thước': '120 mm', 'Điều khiển': '4 chân PWM' },
    representationType: 'physical',
    sources: ['fanconstruction'],
    searchTerms: ['fan', 'airflow', 'pwm', '120mm', 'quạt tản nhiệt'],
  }),
  concept({
    id: 'coolerclip',
    name: 'Ngàm kẹp quạt',
    shortName: 'Ngàm kẹp',
    category: 'Cooling',
    parent: 'coolerfan',
    level: 'cooler',
    description: 'Các thanh thép đàn hồi móc giữ quạt áp sát vào khối lá tản nhiệt.',
    purpose:
      'Giữ quạt áp chặt vào các lá tản nhiệt nhưng vẫn cho phép tháo lắp hoặc thay thế không cần dụng cụ.',
    quantity: '2 ngàm mô phỏng',
    specifications: { 'Vật liệu': 'Thép lò xo' },
    representationType: 'physical',
    sources: ['aircooler'],
    searchTerms: ['clip', 'wire', 'spring', 'bracket', 'mount', 'ngàm quạt', 'kẹp quạt'],
  }),
  concept({
    id: 'coolermount',
    name: 'Bộ ngàm lắp đặt',
    shortName: 'Ngàm bắt vít',
    category: 'Cooling',
    parent: 'cpucooler',
    level: 'cooler',
    description:
      'Tấm đệm sau bo mạch chủ, các trụ đỡ xuyên qua bo mạch và thanh ngang kéo ép đế tiếp xúc xuống.',
    purpose:
      'Tạo lực ép đồng đều, đúng tiêu chuẩn lên nắp CPU và truyền tải trọng đó vào bo mạch chủ thay vì đè lên socket.',
    quantity: '1 bộ mô phỏng',
    specifications: {
      'Lực ép': 'Giới hạn bằng lò xo',
      'Tương thích': 'Ngàm theo chuẩn socket',
    },
    representationType: 'physical',
    sources: ['aircooler', 'mainboardmanual'],
    searchTerms: [
      'backplate',
      'bracket',
      'screw',
      'standoff',
      'mount',
      'clamp',
      'ngàm tản nhiệt',
      'gông tản',
    ],
  }),
];
