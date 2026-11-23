import type { LevelDef } from './levels.ts';
import type { ComparisonCategoryId } from './comparison-catalogue.ts';

export type NotebookLevel =
  | 'legion'
  | 'legionboard'
  | 'legioncpu'
  | 'legioncore'
  | 'legiongpu'
  | 'legionsm'
  | 'legionmemory'
  | 'legionpackage'
  | 'legionbank'
  | 'legiondram'
  | 'legioncell'
  | 'legionstorage'
  | 'legioncooling'
  | 'legionbattery'
  | 'legiondisplay'
  | 'macbook'
  | 'macboard'
  | 'm1pro'
  | 'maccpu'
  | 'maccore'
  | 'macgpu'
  | 'macgpucore'
  | 'macmemory'
  | 'macbank'
  | 'macdram'
  | 'maccell'
  | 'macstorage'
  | 'maccooling'
  | 'macbattery'
  | 'macdisplay';

const phases = [
  ['Lắp ráp', 0],
  ['Giải phẫu', 50],
  ['Kiểm kê', 100],
] as const;
const branchCategories: Record<string, ComparisonCategoryId> = {
  'Bo mạch hệ thống': 'boards',
  'Bo mạch chủ (Logic)': 'boards',
  'Vi xử lý': 'processors',
  'Apple Silicon': 'processors',
  'Đồ họa': 'graphics',
  'Bộ nhớ': 'memory',
  'Lưu trữ': 'storage',
  'Tản nhiệt': 'cooling',
  Pin: 'power',
  'Màn hình': 'displays',
};
const scale = (
  id: NotebookLevel,
  parent: NotebookLevel | null,
  name: string,
  summary: string,
  kind: 'physical' | 'logical' = 'physical',
  branchLabel?: string,
): LevelDef => ({
  id,
  parent,
  name,
  title: name + '.',
  summary,
  caption:
    kind === 'logical' ? 'SƠ ĐỒ KIẾN TRÚC LOGIC' : 'PHẦN CỨNG LAPTOP MINH HỌA',
  kind,
  concept: id,
  camera:
    kind === 'logical'
      ? { padding: 0.98, direction: [0.16, 1.9, 0.6] }
      : {
          padding: 0.98,
          ...(id === 'legionpackage' ? { minimumDistance: 0.8 } : {}),
        },
  phases,
  detailed: true,
  branchLabel,
  comparisonCategory: branchLabel ? branchCategories[branchLabel] : undefined,
  millimetersPerUnit: kind === 'physical' ? 20 : undefined,
});

export const notebookLevels: Record<NotebookLevel, LevelDef> = {
  legion: scale(
    'legion',
    null,
    'Lenovo Legion 5',
    '15ACH6H · Ryzen 7 5800H · RTX 3060 Laptop GPU',
  ),
  legionboard: scale(
    'legionboard',
    'legion',
    'Bo mạch Legion',
    'Vi xử lý hàn liền, RAM và SSD M.2 có thể thay thế',
    'physical',
    'Bo mạch hệ thống',
  ),
  legioncpu: scale(
    'legioncpu',
    'legionboard',
    'Ryzen 7 5800H',
    '8 nhân Zen 3 và đồ họa tích hợp Radeon',
    'logical',
    'Vi xử lý',
  ),
  legioncore: scale(
    'legioncore',
    'legioncpu',
    'Nhân Zen 3',
    'Luồng thực thi lệnh qua một nhân CPU tiêu biểu',
    'logical',
  ),
  legiongpu: scale(
    'legiongpu',
    'legionboard',
    'RTX 3060 Laptop GPU',
    'Kiến trúc Ampere với bộ nhớ GDDR6 chuyên dụng',
    'logical',
    'Đồ họa',
  ),
  legionsm: scale(
    'legionsm',
    'legiongpu',
    'Ampere SM',
    'Lập lịch, tính toán số học, texture và ray tracing',
    'logical',
  ),
  legionmemory: scale(
    'legionmemory',
    'legionboard',
    'DDR4 SO-DIMM',
    'RAM laptop DDR4-3200 có thể thay thế',
    'physical',
    'Bộ nhớ',
  ),
  legionpackage: scale(
    'legionpackage',
    'legionmemory',
    'Vỏ chip DDR4 FBGA',
    'Lớp vỏ đúc, đế bán dẫn (die), đế mạch và chân bi hàn',
  ),
  legiondram: scale(
    'legiondram',
    'legionpackage',
    'Đế DDR4 DRAM',
    'Các bank nhớ, chọn hàng và truy xuất dữ liệu',
    'logical',
  ),
  legionbank: scale(
    'legionbank',
    'legiondram',
    'Bank nhớ DDR4',
    'Ma trận ô nhớ, bộ giải mã hàng, khuếch đại cảm biến và truy xuất dữ liệu',
    'logical',
  ),
  legioncell: scale(
    'legioncell',
    'legionbank',
    'Ô nhớ DDR4',
    'Một transistor, một tụ điện và chu kỳ làm tươi',
    'logical',
  ),
  legionstorage: scale(
    'legionstorage',
    'legionboard',
    'SSD M.2 Legion',
    'Lưu trữ PCIe NVMe tháo rời được',
    'physical',
    'Lưu trữ',
  ),
  legioncooling: scale(
    'legioncooling',
    'legion',
    'Tản nhiệt Legion',
    'Hai quạt lồng sóc và cụm ống đồng dẫn nhiệt chung',
    'physical',
    'Tản nhiệt',
  ),
  legionbattery: scale(
    'legionbattery',
    'legion',
    'Pin Legion',
    'Cấu hình 80 Wh · các cell pin và mạch bảo vệ',
    'physical',
    'Pin',
  ),
  legiondisplay: scale(
    'legiondisplay',
    'legion',
    'Màn hình Legion',
    '15.6 inch FHD IPS · cấu hình 165 Hz',
    'physical',
    'Màn hình',
  ),
  macbook: scale(
    'macbook',
    null,
    'MacBook Pro 14-inch',
    '2021 · M1 Pro · CPU 10 nhân / GPU 16 nhân',
  ),
  macboard: scale(
    'macboard',
    'macbook',
    'Bo mạch MacBook',
    'Apple Silicon, bộ nhớ flash hàn trên bo và cổng I/O',
    'physical',
    'Bo mạch chủ (Logic)',
  ),
  m1pro: scale(
    'm1pro',
    'macboard',
    'Apple M1 Pro',
    'CPU, GPU, Neural Engine và bộ nhớ hợp nhất',
    'logical',
    'Apple Silicon',
  ),
  maccpu: scale(
    'maccpu',
    'm1pro',
    'CPU M1 Pro',
    '8 nhân hiệu năng cao và 2 nhân tiết kiệm điện',
    'logical',
  ),
  maccore: scale(
    'maccore',
    'maccpu',
    'Nguyên lý nhân CPU',
    'Luồng lệnh khái niệm, không phải sơ đồ mạch thực tế của Apple',
    'logical',
  ),
  macgpu: scale(
    'macgpu',
    'm1pro',
    'GPU M1 Pro',
    '16 nhân GPU dùng chung bộ nhớ hợp nhất',
    'logical',
    'Đồ họa',
  ),
  macgpucore: scale(
    'macgpucore',
    'macgpu',
    'Nguyên lý nhân GPU',
    'Thực thi song song khái niệm, không phải sơ đồ mạch thực tế của Apple',
    'logical',
  ),
  macmemory: scale(
    'macmemory',
    'm1pro',
    'Bộ nhớ hợp nhất',
    'Vùng nhớ dùng chung cho CPU, GPU và bộ tăng tốc',
    'logical',
    'Bộ nhớ',
  ),
  macdram: scale(
    'macdram',
    'macmemory',
    'Tổ chức DRAM',
    'Bank nhớ và truy cập hàng khái niệm; không khẳng định cấu trúc die',
    'logical',
  ),
  macbank: scale(
    'macbank',
    'macdram',
    'Nguyên lý bank DRAM',
    'Ma trận ô nhớ và mạch truy cập; cấu trúc mang tính minh họa',
    'logical',
  ),
  maccell: scale(
    'maccell',
    'macbank',
    'Ô nhớ DRAM',
    'Ô lưu trữ điện tích mang tính khái niệm',
    'logical',
  ),
  macstorage: scale(
    'macstorage',
    'macboard',
    'Bộ nhớ flash MacBook',
    'Chip NAND hàn trên bo, do Apple Silicon điều khiển',
    'physical',
    'Lưu trữ',
  ),
  maccooling: scale(
    'maccooling',
    'macbook',
    'Tản nhiệt MacBook',
    'Hai quạt và cụm ống dẫn nhiệt',
    'physical',
    'Tản nhiệt',
  ),
  macbattery: scale(
    'macbattery',
    'macbook',
    'Pin MacBook',
    'Cụm pin lithium-polymer 70 Wh',
    'physical',
    'Pin',
  ),
  macdisplay: scale(
    'macdisplay',
    'macbook',
    'Màn hình Liquid Retina XDR',
    '14.2 inch LCD đèn nền mini-LED',
    'physical',
    'Màn hình',
  ),
};
