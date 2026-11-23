import { concept, type Concept } from '../concept.ts';

/**
 * Inside an all-in-one liquid cooler.
 *
 * The idea is the same as an air tower: take heat off a small hot lid and give
 * it to a large area of thin metal with air moving through it. The difference
 * is what carries the heat between those two places. A tower uses sealed heat
 * pipes and has to put the fin stack directly above the socket. A liquid loop
 * pumps coolant through flexible tubing, so the radiator can go wherever the
 * case has room for it, which is why these are usually mounted in the roof.
 *
 * Radiator length, fan count and fitting style vary between products; this is a
 * 360 mm three-fan unit as a representative example, not a specific model.
 */
export const liquidConcepts: Concept[] = [
  concept({
    id: 'aioradiator',
    name: 'Két nước tản nhiệt (Radiator)',
    shortName: 'Két nước',
    category: 'Cooling',
    parent: 'aio',
    level: 'liquid',
    description:
      'Lõi nhôm gồm các ống dẫn chất lỏng dẹt luồn qua mạng lưới lá tản nhiệt gấp dày đặc, bịt kín hai đầu bằng hai khoang chứa.',
    purpose:
      'Truyền nhiệt từ chất lỏng làm mát ra không khí. Các ống dẫn mang chất lỏng, hệ lá gấp ở giữa nhân rộng diện tích tiếp xúc với gió, còn hai khoang đầu giúp đảo chiều dòng chảy đi qua lõi nhiều lần.',
    quantity: '1 lõi 360 mm mô phỏng',
    specifications: {
      'Chiều dài': '360 mm, ba vị trí lắp quạt',
      'Lõi': 'Nhôm, lá tản nhiệt gấp',
      'Độ dày': 'Tiêu chuẩn 27 mm',
    },
    representationType: 'physical',
    sources: ['aio'],
    searchTerms: [
      'radiator',
      'rad',
      'core',
      'fins',
      '360',
      'aluminium',
      'két nước',
      'lá tản nhiệt',
    ],
  }),
  concept({
    id: 'aiofans',
    name: 'Quạt két nước',
    shortName: 'Quạt rad',
    category: 'Cooling',
    parent: 'aioradiator',
    level: 'liquid',
    description:
      'Ba quạt 120 mm bắt vít vào két nước, thường có áp suất tĩnh cao hơn quạt vỏ máy thông thường.',
    purpose:
      'Đẩy gió xuyên qua mạng lưới lá tản nhiệt dày. Két nước cản gió lớn hơn nhiều so với lưới thoáng, nên cánh quạt được thiết kế để duy trì luồng gió trước lực cản thay vì thổi lượng gió tối đa ở không gian mở.',
    quantity: '3 quạt mô phỏng',
    specifications: {
      'Kích thước': '120 mm mỗi quạt',
      'Đặc tính': 'Tối ưu áp suất tĩnh',
    },
    representationType: 'physical',
    sources: ['aio'],
    searchTerms: [
      'fan',
      'fans',
      'static pressure',
      '120mm',
      'airflow',
      'quạt két nước',
      'áp suất tĩnh',
    ],
  }),
  concept({
    id: 'aiopump',
    name: 'Cụm bơm và block nước',
    shortName: 'Bơm & block',
    category: 'Cooling',
    parent: 'aio',
    level: 'liquid',
    description:
      'Một khối vỏ tích hợp cả máy bơm lẫn block nước, đặt trực tiếp lên bộ xử lý.',
    purpose:
      'Luân chuyển chất lỏng làm mát quanh vòng tuần hoàn. Đặt bơm ngay trên block thay vì ở két nước giúp toàn bộ cụm chỉ cần hai ống dẫn và một dây nguồn.',
    quantity: '1 khối mô phỏng',
    specifications: {
      'Loại': 'Bơm và block tản nhiệt tích hợp',
      'Truyền động': 'Không chổi than, chuyển mạch điện tử',
    },
    representationType: 'physical',
    sources: ['aio'],
    searchTerms: [
      'pump',
      'block',
      'waterblock',
      'head',
      'impeller',
      'bơm',
      'block nước',
    ],
  }),
  concept({
    id: 'aioimpeller',
    name: 'Cánh bơm',
    shortName: 'Cánh bơm',
    category: 'Cooling',
    parent: 'aiopump',
    level: 'liquid',
    description:
      'Rô-to có cánh nhỏ quay trong khoang riêng phía trên đế tiếp xúc, được truyền động xuyên qua vách vỏ.',
    purpose:
      'Văng chất lỏng ra cửa thoát theo lực ly tâm. Động cơ kéo nó bằng từ trường xuyên qua vách kín, nên vòng tuần hoàn không có trục xuyên vỏ và không có khe hở rò rỉ.',
    quantity: '1 rô-to mô phỏng',
    specifications: { 'Loại': 'Ly tâm, truyền động từ tính' },
    representationType: 'physical',
    sources: ['aio'],
    searchTerms: [
      'impeller',
      'rotor',
      'centrifugal',
      'magnetic',
      'pump',
      'cánh bơm',
    ],
  }),
  concept({
    id: 'aiocoldplate',
    name: 'Đế đồng và vi rãnh tản nhiệt',
    shortName: 'Đế tiếp xúc',
    category: 'Cooling',
    parent: 'aiopump',
    level: 'liquid',
    description:
      'Tấm đồng có mặt trong được cắt gọt thành dày đặc các rãnh siêu nhỏ, còn mặt ngoài phẳng áp chặt vào nắp CPU.',
    purpose:
      'Truyền nhiệt vào chất lỏng làm mát. Các vi rãnh giúp nhân rộng diện tích tiếp xúc với nước và tạo dòng chảy xoáy, vì chất lỏng chảy êm dọc theo thành truyền nhiệt chậm hơn nhiều so với dòng chảy xoáy va đập vào rãnh.',
    quantity: '1 tấm mô phỏng',
    specifications: {
      'Vật liệu': 'Đồng, thường mạ niken',
      'Cấu trúc': 'Hệ vi rãnh cắt gọt hoặc bào mỏng (skived)',
    },
    representationType: 'physical',
    sources: ['aio'],
    searchTerms: [
      'coldplate',
      'microfin',
      'copper',
      'jet',
      'contact',
      'đế đồng',
      'vi rãnh',
    ],
  }),
  concept({
    id: 'aiotubes',
    name: 'Ống dẫn nước',
    shortName: 'Ống dẫn',
    category: 'Cooling',
    parent: 'aio',
    level: 'liquid',
    description:
      'Hai đoạn ống mềm gia cường, thường làm từ cao su có lớp lót chống thấm bay hơi, bọc lưới chống mài mòn bên ngoài.',
    purpose:
      'Dẫn chất lỏng đi ra két nước và quay trở lại. Lớp lót bên trong quan trọng hơn vỏ bọc ngoài: ống cao su trần sẽ thất thoát hơi nước qua thành ống sau nhiều năm, trong khi hệ thống kín không thể châm thêm.',
    quantity: '2 ống mô phỏng',
    specifications: {
      'Số lượng': 'Đường cấp và đường hồi',
      'Thành ống': 'Lớp lót ít thấm hơi, bọc lưới',
    },
    representationType: 'physical',
    sources: ['aio'],
    searchTerms: ['tube', 'tubing', 'hose', 'sleeve', 'flexible', 'ống dẫn nước'],
  }),
  concept({
    id: 'aiocoolant',
    name: 'Dung dịch làm mát',
    shortName: 'Dung dịch',
    category: 'Cooling',
    parent: 'aiotubes',
    level: 'liquid',
    description:
      'Chủ yếu là nước pha chất chống ăn mòn và chất diệt khuẩn, được nạp sẵn tại nhà máy và không thiết kế để mở ra.',
    purpose:
      'Nước là môi chất truyền nhiệt vì hầu như không có chất nào khác tích trữ nhiều nhiệt trên mỗi đơn vị khối lượng như nước. Các phụ gia giúp ngăn hai kim loại khác nhau trong vòng tuần hoàn ăn mòn lẫn nhau và ngăn rêu mốc phát triển.',
    quantity: '1 lượng dung dịch mô phỏng',
    specifications: {
      'Nền': 'Nước',
      'Phụ gia': 'Chất chống ăn mòn, chất diệt khuẩn',
    },
    representationType: 'physical',
    sources: ['aio'],
    searchTerms: [
      'coolant',
      'water',
      'fluid',
      'liquid',
      'inhibitor',
      'nước làm mát',
      'dung dịch',
    ],
  }),
  concept({
    id: 'aiofittings',
    name: 'Đầu nối ống (Fitting)',
    shortName: 'Đầu nối',
    category: 'Cooling',
    parent: 'aiotubes',
    level: 'liquid',
    description:
      'Các vòng kẹp ép hoặc đầu ngạnh tại nơi mỗi ống nối vào block bơm và khoang két nước, thường gắn trên khớp xoay.',
    purpose:
      'Giữ kín mối nối suốt vòng đời sản phẩm. Khớp xoay cho phép xoay hướng ống về phía két nước khi lắp đặt mà không làm xoắn bản thân ống dẫn, tránh gây lực căng lên mối niêm kín.',
    quantity: '4 đầu nối mô phỏng',
    specifications: { 'Khớp nối': 'Khớp xoay, làm kín' },
    representationType: 'physical',
    sources: ['aio'],
    searchTerms: ['fitting', 'barb', 'collar', 'rotary', 'seal', 'đầu nối', 'cút nối'],
  }),
];
