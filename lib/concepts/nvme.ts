import { concept, type Category, type Concept } from '../concept.ts';
import type { SourceId } from '../sources.ts';

const accuracy =
  'Ổ SSD M.2 2280 đại diện. Tài liệu nhà sản xuất xác nhận kiểu dáng và vai trò linh kiện; số lượng chip, chi tiết chân tiếp xúc và vị trí bố trí mang tính minh họa, không phải bản sao chép PCB của Samsung.';

const parts: {
  id: string;
  name: string;
  category: Category;
  description: string;
  purpose: string;
  quantity: string;
  specifications: Record<string, string>;
  sources: SourceId[];
}[] = [
  {
    id: 'nvmeboard',
    name: 'Bảng mạch M.2',
    category: 'Board',
    description:
      'Bảng mạch mỏng cắm trực tiếp vào khe M.2 trên bo mạch chủ.',
    purpose:
      'Kết nối bộ điều khiển, chip nhớ flash và bộ nhớ đệm mà không cần khay ổ đĩa hay dây cáp SATA.',
    quantity: '1 bảng mạch mô phỏng',
    specifications: { 'Kiểu dáng': 'M.2 2280 · chuẩn 22 × 80 mm' },
    sources: ['samsungnvme'],
  },
  {
    id: 'nvmecontroller',
    name: 'Bộ điều khiển flash NVMe',
    category: 'Compute',
    description:
      'Vi xử lý nằm giữa liên kết máy chủ PCIe và các kênh nhớ NAND flash.',
    purpose:
      'Xử lý tập lệnh NVMe, ánh xạ địa chỉ logic-vật lý, sửa lỗi dữ liệu và cân bằng hao mòn ô nhớ.',
    quantity: '1 bộ điều khiển mô phỏng',
    specifications: {
      'Giao tiếp máy chủ': 'NVMe qua PCIe',
      'Giao tiếp flash': 'Các kênh NAND song song',
    },
    sources: ['samsungnvme', 'ssdarchitecture', 'nvme'],
  },
  {
    id: 'nvmenand',
    name: 'Chip nhớ 3D NAND flash',
    category: 'Storage',
    description:
      'Các gói bộ nhớ flash không bay hơi chứa các ô nhớ xếp chồng theo chiều dọc.',
    purpose:
      'Lưu giữ tệp tin ngay cả khi ngắt nguồn điện. Số lượng chip thay đổi tùy theo dòng ổ và mức dung lượng.',
    quantity: '2 chip minh họa',
    specifications: { 'Bộ nhớ': '3D NAND · không bay hơi' },
    sources: ['samsungnvme', 'ssdarchitecture'],
  },
  {
    id: 'nvmedram',
    name: 'Bộ nhớ đệm DRAM NVMe',
    category: 'Memory',
    description:
      'Bộ nhớ bay hơi đặt cạnh bộ điều khiển trong thiết kế SSD đại diện này.',
    purpose:
      'Lưu đệm bảng ánh xạ cho bộ điều khiển. Một số dòng SSD khác dùng bộ nhớ máy chủ (HMB) hoặc bỏ qua DRAM riêng.',
    quantity: '1 chip mô phỏng',
    specifications: { 'Vai trò': 'Bộ nhớ đệm bảng ánh xạ cho bộ điều khiển' },
    sources: ['samsungnvme', 'ssdarchitecture'],
  },
  {
    id: 'nvmecontacts',
    name: 'Chân tiếp xúc cạnh M-key',
    category: 'Storage',
    description:
      'Các chân đồng mạ vàng có rãnh khuyết định hướng ở đầu cắm vào bo mạch chủ.',
    purpose:
      'Truyền tín hiệu PCIe và nguồn điện qua khe M.2; vị trí rãnh khuyết giúp chống cắm nhầm chuẩn cơ khí.',
    quantity: '1 dải tiếp điểm minh họa',
    specifications: {
      'Kết nối': 'M.2 M-key',
      'Liên kết': 'PCIe ×4',
      'Nguồn điện': '3.3 V',
    },
    sources: ['samsungnvme', 'mainboardmanual'],
  },
  {
    id: 'nvmefastener',
    name: 'Ốc giữ M.2',
    category: 'Board',
    description:
      'Con ốc nhỏ gắn tại rãnh bán nguyệt ở đầu đối diện với đầu cắm.',
    purpose:
      'Giữ thanh SSD áp sát cố định vào trụ đỡ trên bo mạch chủ. Một số bo mạch dùng lẫy gài không cần ốc thay thế.',
    quantity: '1 ốc mô phỏng',
    specifications: { 'Vị trí': 'Điểm bắt ốc chuẩn 2280' },
    sources: ['mainboardmanual'],
  },
];

export const nvmeConcepts: Concept[] = parts.map((part) =>
  concept({
    ...part,
    parent: 'nvme',
    level: 'nvme',
    representationType: 'physical',
    physicalAccuracy: accuracy,
    searchTerms: ['nvme', 'ssd', 'm.2', 'ổ cứng', part.name],
  }),
);
