import type { ComparisonCategoryId } from './comparison-catalogue.ts';
import { notebookLevels, type NotebookLevel } from './notebook-levels.ts';
/**
 * The exploration tree.
 *
 * Scales used to be a single chain (card → die → GPC → TPC → SM). The machine
 * is a tree, so this is a tree: every level names its parent and the path is
 * walked rather than looked up in a table. Adding a branch means adding an
 * entry here; navigation, breadcrumbs, lighting and the disassembly phases all
 * read from it.
 */
export type LevelId =
  | NotebookLevel
  | 'pc'
  | 'motherboard'
  | 'z890'
  | 'b650m'
  | 'tomahawk'
  | 'aorus'
  | 'b850m'
  | 'ryzen'
  | 'ryzenio'
  | 'corei9'
  | 'coreio'
  | 'dimm'
  | 'dram'
  | 'banks'
  | 'bank'
  | 'cell'
  | 'ddr4'
  | 'ddr4dram'
  | 'ddr4banks'
  | 'ddr4array'
  | 'ddr4cell'
  | 'psu650'
  | 'psubronze'
  | 'psu'
  | 'psu1000'
  | 'psu1200'
  | 'fan'
  | 'cooler'
  | 'liquid'
  | 'ssd'
  | 'nvme'
  | 'card'
  | 'die'
  | 'gpc'
  | 'tpc'
  | 'sm'
  | 'rx9070'
  | 'navi48'
  | 'rxse'
  | 'rxwgp'
  | 'rxcu'
  | 'arcb580'
  | 'bmg'
  | 'xeslice'
  | 'xecore'
  | 'xve'
  | 'rtx5060ti'
  | 'rtx5060';

export interface LevelDef {
  id: LevelId;
  /** null only for the root of the machine. */
  parent: LevelId | null;
  /** Breadcrumb and navigation label. */
  name: string;
  /** Stage heading shown above the specimen when nothing is selected. */
  title: string;
  /** Caption under the stage heading. */
  caption: string;
  /** One line describing what this scale contains. */
  summary: string;
  /**
   * `physical` levels are lit like hardware, keep their real size
   * relationships in the inventory, and stage their explosion so cooling
   * leaves first. `logical` levels are diagrams and are lit flat.
   */
  kind: 'physical' | 'logical';
  /** Optional camera framing for unusually small hardware or flat diagrams. */
  camera?: {
    padding?: number;
    minimumDistance?: number;
    direction?: readonly [number, number, number];
  };
  /** The concept whose `open` leads here: the thing you drilled into. */
  concept: string;
  /** Labels along the disassembly timeline, with their slider positions. */
  phases: readonly (readonly [string, number])[];
  /** Marked false while a branch is still a placeholder. */
  detailed: boolean;
  /** Optional browser category, inherited by deeper scales in this subsystem. */
  comparisonCategory?: ComparisonCategoryId;
  /** Authored uniform physical scale; omit for diagrams or exaggerated axes. */
  millimetersPerUnit?: number;
  /**
   * Set on a subsystem root, including nested roots such as an M.2 drive. It names the subsystem menu
   * that this scale and everything beneath it are listed under, so a viewer
   * picks "GPU" and then chooses a scale, rather than tunnelling through the
   * card to reach the die.
   */
  branchLabel?: string;
  /**
   * A nested dropdown inside the subsystem menu. The GPU menu holds three
   * different cards, and each card's scales belong together: an RDNA 4 shader
   * engine is not a step inside the RTX 5090. Set on the card that starts a
   * sub-menu; every scale beneath it is listed under the same heading.
   */
  submenu?: string;
  /** One line under the sub-menu heading: who makes it and on what architecture. */
  submenuNote?: string;
  /**
   * Multiplies how far pieces travel as they come apart. A tower needs much
   * bigger gaps than a card before its subsystems stop touching.
   */
  spread?: number;
  /**
   * An alternative that is not fitted to the machine as modelled.
   *
   * Only one processor cooler can be bolted to one socket, and only one
   * processor sits in it, so the parts you can point at inside the case are
   * whichever ones this build happens to use. The others are real scales with
   * real content and they stay listed in their subsystem menu; they simply
   * have nothing to click on at the scale above. Marking that here keeps the
   * "every scale is reachable" check honest instead of forcing the machine to
   * carry two coolers and two processors at once.
   */
  alternative?: boolean;
}

const dissectionPhases = [
  ['Lắp ráp', 0],
  ['Giải phẫu', 50],
  ['Kiểm kê', 100],
] as const;

type LevelText = Pick<LevelDef, 'name' | 'title' | 'caption' | 'summary'>;

/**
 * A board the build workspace can fit instead of the one the tower carries:
 * a whole scale of its own, opened from the Motherboard menu, its catalogue
 * rooted at `<id>board`.
 */
const otherBoard = (id: LevelId, text: LevelText): LevelDef => ({
  id,
  comparisonCategory: 'boards',
  millimetersPerUnit: 22,
  parent: 'pc',
  alternative: true,
  ...text,
  kind: 'physical',
  branchLabel: 'Bo mạch chủ',
  concept: `${id}board`,
  spread: 1.7,
  phases: dissectionPhases,
  detailed: true,
});

/** The same for a supply, opened from the Power supply menu. */
const otherSupply = (
  id: LevelId,
  concept: string,
  text: LevelText,
): LevelDef => ({
  id,
  comparisonCategory: 'power',
  millimetersPerUnit: 12,
  parent: 'pc',
  alternative: true,
  ...text,
  kind: 'physical',
  branchLabel: 'Bộ nguồn',
  concept,
  spread: 1.9,
  phases: dissectionPhases,
  detailed: true,
});

export const levels: Record<LevelId, LevelDef> = {
  pc: {
    id: 'pc',
    millimetersPerUnit: 35,
    parent: null,
    name: 'PC để bàn',
    title: 'Máy tính hoàn chỉnh.',
    caption: 'THÙNG MÁY ATX',
    summary: 'Vỏ máy, bo mạch, nguồn, lưu trữ và tản nhiệt',
    kind: 'physical',
    concept: 'pc',
    spread: 2.4,
    phases: dissectionPhases,
    detailed: true,
  },
  motherboard: {
    id: 'motherboard',
    comparisonCategory: 'boards',
    millimetersPerUnit: 22,
    parent: 'pc',
    name: 'X670E · AM5',
    title: 'Bo mạch chủ.',
    caption: 'ASUS TUF GAMING X670E-PLUS WIFI',
    summary: 'ASUS · AM5 · ATX · đang lắp sẵn',
    kind: 'physical',
    branchLabel: 'Bo mạch chủ',
    concept: 'motherboard',
    spread: 1.7,
    phases: dissectionPhases,
    detailed: true,
  },
  z890: otherBoard('z890', {
    name: 'Z890 · LGA 1851',
    title: 'Bo mạch chủ Intel.',
    caption: 'ASUS TUF GAMING Z890-PLUS WIFI',
    summary: 'ASUS · LGA 1851 · ATX',
  }),
  b650m: otherBoard('b650m', {
    name: 'B650M · micro-ATX',
    title: 'Bo mạch chủ micro-ATX.',
    caption: 'ASUS TUF GAMING B650M-PLUS WIFI',
    summary: 'ASUS · AM5 · micro-ATX',
  }),
  tomahawk: otherBoard('tomahawk', {
    name: 'MSI X870 Tomahawk · AM5',
    title: 'Bo mạch chủ MSI.',
    caption: 'MSI MAG X870 TOMAHAWK WIFI',
    summary: 'MSI · AM5 · ATX',
  }),
  aorus: otherBoard('aorus', {
    name: 'AORUS Z890 Elite · LGA 1851',
    title: 'Bo mạch chủ GIGABYTE.',
    caption: 'GIGABYTE Z890 AORUS ELITE WIFI7',
    summary: 'GIGABYTE · LGA 1851 · ATX',
  }),
  b850m: otherBoard('b850m', {
    name: 'ASRock B850M Pro RS · micro-ATX',
    title: 'Bo mạch chủ ASRock.',
    caption: 'ASROCK B850M PRO RS WIFI',
    summary: 'ASRock · AM5 · micro-ATX',
  }),
  ryzen: {
    id: 'ryzen',
    comparisonCategory: 'processors',
    parent: 'motherboard',
    branchLabel: 'Vi xử lý',
    submenu: 'Ryzen 9 9950X',
    submenuNote: 'AMD · Zen 5 · đang lắp sẵn',
    name: 'Ryzen 9 9950X',
    title: '16 nhân trên ba đế chip.',
    caption: 'AMD RYZEN 9 9950X · ZEN 5',
    summary: 'Hai chiplet nhân xử lý và một chiplet I/O',
    kind: 'logical',
    concept: 'ryzenpackage',
    phases: dissectionPhases,
    detailed: true,
  },
  ryzenio: {
    id: 'ryzenio',
    parent: 'ryzen',
    name: 'Đế I/O Ryzen',
    title: 'Bên trong đế I/O Ryzen.',
    caption: 'ZEN 5 I/O DIE · TSMC 6 NM',
    summary: 'Bộ nhớ, PCIe, xuất hình và kết nối chiplet',
    kind: 'logical',
    concept: 'zeniod',
    phases: dissectionPhases,
    detailed: true,
  },
  corei9: {
    id: 'corei9',
    comparisonCategory: 'processors',
    parent: 'motherboard',
    alternative: true,
    branchLabel: 'Vi xử lý',
    submenu: 'Core Ultra 9 285K',
    submenuNote: 'Intel · Arrow Lake',
    name: 'Core Ultra 9 285K',
    title: '24 nhân trên các tile xếp tầng.',
    caption: 'INTEL CORE ULTRA 9 285K · ARROW LAKE',
    summary: 'Tile tính toán, SoC, đồ họa và I/O trên đế nền',
    kind: 'logical',
    concept: 'corepackage',
    phases: dissectionPhases,
    detailed: true,
  },
  coreio: {
    id: 'coreio',
    parent: 'corei9',
    name: 'Tile I/O Core Ultra',
    title: 'Bên trong tile mở rộng I/O.',
    caption: 'ARROW LAKE I/O EXTENDER · TSMC N6',
    summary: 'PCIe, Thunderbolt và kết nối giữa các die',
    kind: 'logical',
    concept: 'arrowio',
    phases: dissectionPhases,
    detailed: true,
  },
  dimm: {
    id: 'dimm',
    comparisonCategory: 'memory',
    millimetersPerUnit: 6,
    parent: 'motherboard',
    name: 'DDR5 · FURY Beast',
    title: 'Bên trong thanh RAM.',
    caption: 'KINGSTON FURY BEAST DDR5-6000 · 16 GB',
    summary: 'Kingston · 16 GB · DDR5-6000',
    kind: 'physical',
    branchLabel: 'Bộ nhớ',
    submenu: 'DDR5 · FURY Beast',
    submenuNote: 'Kingston · DDR5-6000 · đang lắp sẵn',
    concept: 'ram',
    spread: 1.4,
    phases: dissectionPhases,
    detailed: true,
  },
  dram: {
    id: 'dram',
    parent: 'dimm',
    name: 'Vỏ chip DRAM',
    title: 'Bên trong một chip nhớ.',
    caption: 'DDR5 · 16 GBIT X8 · 78-BALL FBGA',
    summary: 'Vỏ đúc, die, dây nối, đế mạch và chân bi',
    kind: 'physical',
    concept: 'dramchip',
    spread: 1.0,
    phases: dissectionPhases,
    detailed: true,
  },
  banks: {
    id: 'banks',
    parent: 'dram',
    name: 'Đế DRAM',
    title: 'Toàn bộ đế chip nhớ.',
    caption: 'DDR5 DIE · 32 BANK TRONG 8 NHÓM',
    summary: 'Nhóm bank, các bank nhớ và dải mạch ngoại vi giữa',
    kind: 'logical',
    concept: 'dramdie',
    phases: dissectionPhases,
    detailed: true,
  },
  bank: {
    id: 'bank',
    parent: 'banks',
    name: 'Bank nhớ',
    title: 'Một bank nhớ.',
    caption: 'DDR5 BANK · MẢNG CON VÀ MA TRẬN',
    summary: 'Ma trận ô nhớ, dải khuếch đại cảm biến, bộ giải mã và đường truyền',
    kind: 'logical',
    concept: 'drambank',
    phases: dissectionPhases,
    detailed: true,
  },
  cell: {
    id: 'cell',
    parent: 'bank',
    name: 'Ô nhớ',
    title: 'Một transistor, một tụ điện.',
    caption: 'DDR5 MAT · Ô NHỚ 1T1C',
    summary: 'Đường từ (wordline), đường bit (bitline), tụ điện và bộ khuếch đại cảm biến',
    kind: 'logical',
    concept: 'drammat',
    phases: dissectionPhases,
    detailed: true,
  },
  ddr4: {
    id: 'ddr4',
    comparisonCategory: 'memory',
    millimetersPerUnit: 6,
    parent: 'motherboard',
    alternative: true,
    name: 'DDR4 · FURY Beast',
    title: 'Thế hệ RAM tiền nhiệm.',
    caption: 'KINGSTON FURY BEAST DDR4-3200 · 16 GB',
    summary: 'Kingston · 16 GB · DDR4-3200',
    kind: 'physical',
    branchLabel: 'Bộ nhớ',
    submenu: 'DDR4 · FURY Beast',
    submenuNote: 'Kingston · DDR4-3200 · để so sánh',
    concept: 'ddr4module',
    spread: 1.4,
    phases: dissectionPhases,
    detailed: true,
  },
  ddr4dram: {
    id: 'ddr4dram',
    parent: 'ddr4',
    name: 'Vỏ chip DRAM',
    title: 'Bên trong một chip DDR4.',
    caption: 'DDR4 · 16 GBIT X8 · 78-BALL FBGA',
    summary: 'Vỏ đúc, die, dây nối, đế mạch và chân bi',
    kind: 'physical',
    concept: 'ddr4chip',
    spread: 1.0,
    phases: dissectionPhases,
    detailed: true,
  },
  ddr4banks: {
    id: 'ddr4banks',
    parent: 'ddr4dram',
    name: 'Đế DRAM',
    title: 'Toàn bộ đế chip nhớ.',
    caption: 'DDR4 DIE · 16 BANK TRONG 4 NHÓM',
    summary: 'Nhóm bank, các bank nhớ và dải mạch ngoại vi giữa',
    kind: 'logical',
    concept: 'ddr4die',
    phases: dissectionPhases,
    detailed: true,
  },
  ddr4array: {
    id: 'ddr4array',
    parent: 'ddr4banks',
    name: 'Bank nhớ',
    title: 'Một bank nhớ.',
    caption: 'DDR4 BANK · MẢNG CON VÀ MA TRẬN',
    summary: 'Số hàng gấp đôi bank DDR5, cấu trúc tương tự',
    kind: 'logical',
    concept: 'ddr4bank',
    phases: dissectionPhases,
    detailed: true,
  },
  ddr4cell: {
    id: 'ddr4cell',
    parent: 'ddr4array',
    name: 'Ô nhớ',
    title: 'Một transistor, một tụ điện.',
    caption: 'DDR4 MAT · Ô NHỚ 1T1C',
    summary: 'Cùng cấu trúc ô nhớ với DDR5, đường wordline nâng lên 2.5 V',
    kind: 'logical',
    concept: 'ddr4mat',
    phases: dissectionPhases,
    detailed: true,
  },
  psu650: otherSupply('psu650', 'tuf650psucase', {
    name: 'Cáp liền · TUF Gaming 650W Bronze',
    title: 'Bộ nguồn cáp liền công suất nhỏ hơn.',
    caption: 'ASUS TUF GAMING 650W BRONZE',
    summary: 'ASUS · 650 W · 80 PLUS Bronze',
  }),
  psubronze: otherSupply('psubronze', 'bronzepsucase', {
    name: 'Cáp liền · TUF Gaming 750W Bronze',
    title: 'Bên trong bộ nguồn cáp liền.',
    caption: 'ASUS TUF GAMING 750W BRONZE',
    summary: 'ASUS · 750 W · 80 PLUS Bronze',
  }),
  psu: otherSupply('psu', 'psucase', {
    name: 'Cáp rời · TUF Gaming 850W Gold',
    title: 'Bên trong bộ nguồn cáp rời.',
    caption: 'ASUS TUF GAMING 850W GOLD',
    summary: 'ASUS · 850 W · 80 PLUS Gold',
  }),
  psu1000: {
    id: 'psu1000',
    comparisonCategory: 'power',
    millimetersPerUnit: 12,
    parent: 'pc',
    name: 'Cáp rời · TUF Gaming 1000W Gold',
    title: 'Một nghìn watt, cáp rời hoàn toàn.',
    caption: 'ASUS TUF GAMING 1000W GOLD',
    summary: 'ASUS · 1000 W · 80 PLUS Gold · đang lắp sẵn',
    kind: 'physical',
    branchLabel: 'Bộ nguồn',
    concept: 'psu',
    spread: 1.9,
    phases: dissectionPhases,
    detailed: true,
  },
  psu1200: otherSupply('psu1200', 'tuf1200psucase', {
    name: 'Cáp rời · TUF Gaming 1200W Gold',
    title: 'Một nghìn hai trăm watt, hai dây 16-pin.',
    caption: 'ASUS TUF GAMING 1200W GOLD',
    summary: 'ASUS · 1200 W · 80 PLUS Gold',
  }),
  fan: {
    id: 'fan',
    comparisonCategory: 'cooling',
    millimetersPerUnit: 9,
    parent: 'pc',
    name: 'Quạt thùng máy',
    title: 'Bên trong một chiếc quạt.',
    caption: 'QUẠT HƯỚNG TRỤC 120 MM',
    summary: 'Khung quạt, cánh quạt, động cơ và trục quay',
    kind: 'physical',
    branchLabel: 'Tản nhiệt',
    concept: 'casefan',
    spread: 1.6,
    phases: dissectionPhases,
    detailed: true,
  },
  cooler: {
    id: 'cooler',
    comparisonCategory: 'cooling',
    millimetersPerUnit: 11,
    parent: 'pc',
    name: 'Tản nhiệt CPU',
    title: 'Bên trong tản nhiệt khí.',
    caption: 'TẢN NHIỆT KHÍ DẠNG THÁP',
    summary: 'Mặt tiếp xúc, ống đồng dẫn nhiệt và cụm lá tản',
    kind: 'physical',
    branchLabel: 'Tản nhiệt',
    concept: 'cpucooler',
    spread: 1.7,
    phases: dissectionPhases,
    detailed: true,
  },
  liquid: {
    id: 'liquid',
    comparisonCategory: 'cooling',
    millimetersPerUnit: 14,
    parent: 'pc',
    alternative: true,
    name: 'Tản nhiệt nước AIO',
    title: 'Bên trong hệ thống tản nhiệt nước.',
    caption: 'AIO 360 MM TẤT CẢ TRONG MỘT',
    summary: 'Két tản nhiệt, bơm, mặt lạnh và ống dẫn',
    kind: 'physical',
    branchLabel: 'Tản nhiệt',
    concept: 'aio',
    spread: 1.9,
    phases: dissectionPhases,
    detailed: true,
  },
  ssd: {
    id: 'ssd',
    comparisonCategory: 'storage',
    millimetersPerUnit: 8,
    parent: 'pc',
    name: 'SSD SATA',
    title: 'Bên trong ổ cứng thể rắn SATA.',
    caption: 'SSD SATA 2.5 INCH',
    summary: 'Chip NAND flash, bộ điều khiển và hai cổng SATA riêng biệt',
    kind: 'physical',
    branchLabel: 'Lưu trữ',
    concept: 'ssd',
    spread: 1.7,
    phases: dissectionPhases,
    detailed: true,
  },
  nvme: {
    id: 'nvme',
    comparisonCategory: 'storage',
    millimetersPerUnit: 8,
    parent: 'motherboard',
    name: 'SSD M.2 NVMe',
    title: 'Bên trong SSD M.2.',
    caption: 'M.2 2280 · NVMe QUA PCIe',
    summary: 'Bộ điều khiển, NAND flash, DRAM và chân tiếp xúc',
    kind: 'physical',
    branchLabel: 'Lưu trữ',
    concept: 'nvme',
    spread: 1.5,
    phases: dissectionPhases,
    detailed: true,
  },
  card: {
    id: 'card',
    comparisonCategory: 'graphics',
    millimetersPerUnit: 348 / 8.93,
    parent: 'pc',
    name: 'RTX 5090',
    title: 'Cụm card đồ họa hoàn chỉnh.',
    caption: 'RTX 5090',
    summary: 'Toàn bộ card đồ họa',
    kind: 'physical',
    branchLabel: 'GPU',
    submenu: 'RTX 5090',
    submenuNote: 'NVIDIA · Blackwell',
    concept: 'card',
    phases: dissectionPhases,
    detailed: true,
  },
  die: {
    id: 'die',
    parent: 'card',
    name: 'GB202',
    title: 'Bên trong chip xử lý đồ họa.',
    caption: 'GB202 · BLACKWELL',
    summary: 'Bên trong chip Blackwell',
    kind: 'logical',
    concept: 'silicon',
    phases: dissectionPhases,
    detailed: true,
  },
  gpc: {
    id: 'gpc',
    parent: 'die',
    name: 'GPC',
    title: 'Cụm xử lý đồ họa (GPC).',
    caption: 'GPC ĐẦY ĐỦ ĐẠI DIỆN',
    summary: 'Một cụm trong mảng tính toán',
    kind: 'logical',
    concept: 'gpc',
    phases: dissectionPhases,
    detailed: true,
  },
  tpc: {
    id: 'tpc',
    parent: 'gpc',
    name: 'TPC',
    title: 'Cụm xử lý Texture (TPC).',
    caption: 'TPC',
    summary: 'Một cặp bộ đa xử lý luồng',
    kind: 'logical',
    concept: 'tpc',
    phases: dissectionPhases,
    detailed: true,
  },
  sm: {
    id: 'sm',
    parent: 'tpc',
    name: 'SM',
    title: 'Bộ đa xử lý luồng (SM).',
    caption: 'SM · TÀI NGUYÊN THỰC THI',
    summary: 'Bên trong một bộ đa xử lý luồng',
    kind: 'logical',
    concept: 'sm',
    phases: dissectionPhases,
    detailed: true,
  },
  rx9070: {
    id: 'rx9070',
    comparisonCategory: 'graphics',
    millimetersPerUnit: 348 / 8.93,
    parent: 'pc',
    alternative: true,
    name: 'RX 9070 XT',
    title: 'Card Radeon hoàn chỉnh.',
    caption: 'SAPPHIRE NITRO+ · RX 9070 XT',
    summary: 'Toàn bộ card đồ họa',
    kind: 'physical',
    branchLabel: 'GPU',
    submenu: 'RX 9070 XT',
    submenuNote: 'AMD · RDNA 4',
    concept: 'rxcard',
    phases: dissectionPhases,
    detailed: true,
  },
  navi48: {
    id: 'navi48',
    parent: 'rx9070',
    name: 'Navi 48',
    title: 'Bên trong chip xử lý Navi 48.',
    caption: 'NAVI 48 · RDNA 4',
    summary: 'Bên trong chip RDNA 4',
    kind: 'logical',
    concept: 'rxgpu',
    phases: dissectionPhases,
    detailed: true,
  },
  rxse: {
    id: 'rxse',
    parent: 'navi48',
    name: 'Shader engine',
    title: 'Một Shader Engine.',
    caption: 'SE · MỘT TRONG BỐN',
    summary: 'Tám workgroup processor và cụm raster',
    kind: 'logical',
    concept: 'rxse',
    phases: dissectionPhases,
    detailed: true,
  },
  rxwgp: {
    id: 'rxwgp',
    parent: 'rxse',
    name: 'Workgroup processor',
    title: 'Một Workgroup Processor.',
    caption: 'WGP · CỤM COMPUTE UNIT KÉP',
    summary: 'Một cặp Compute Unit',
    kind: 'logical',
    concept: 'rxwgp',
    phases: dissectionPhases,
    detailed: true,
  },
  rxcu: {
    id: 'rxcu',
    parent: 'rxwgp',
    name: 'Compute unit',
    title: 'Một Compute Unit.',
    caption: 'CU · TÀI NGUYÊN THỰC THI',
    summary: 'Bên trong một Compute Unit RDNA 4',
    kind: 'logical',
    concept: 'rxcu',
    phases: dissectionPhases,
    detailed: true,
  },
  arcb580: {
    id: 'arcb580',
    comparisonCategory: 'graphics',
    millimetersPerUnit: 348 / 8.93,
    parent: 'pc',
    alternative: true,
    name: 'Arc B580',
    title: 'Card Intel Arc hoàn chỉnh.',
    caption: 'INTEL ARC B580 · LIMITED EDITION',
    summary: 'Toàn bộ card đồ họa',
    kind: 'physical',
    branchLabel: 'GPU',
    submenu: 'Arc B580',
    submenuNote: 'Intel · Xe2',
    concept: 'arccard',
    phases: dissectionPhases,
    detailed: true,
  },
  bmg: {
    id: 'bmg',
    parent: 'arcb580',
    name: 'BMG-G21',
    title: 'Bên trong chip Battlemage.',
    caption: 'BMG-G21 · XE2-HPG',
    summary: 'Bên trong chip Xe2',
    kind: 'logical',
    concept: 'arcgpu',
    phases: dissectionPhases,
    detailed: true,
  },
  xeslice: {
    id: 'xeslice',
    parent: 'bmg',
    name: 'Render slice',
    title: 'Một Render Slice.',
    caption: 'RENDER SLICE · MỘT TRONG NĂM',
    summary: 'Bốn Xe-core cùng phần cứng texture và pixel',
    kind: 'logical',
    concept: 'xeslice',
    phases: dissectionPhases,
    detailed: true,
  },
  xecore: {
    id: 'xecore',
    parent: 'xeslice',
    name: 'Xe-core',
    title: 'Một Xe-core.',
    caption: 'XE2 CORE',
    summary: 'Tám vector engine, đơn vị ray tracing và bộ nhớ đệm',
    kind: 'logical',
    concept: 'xecore',
    phases: dissectionPhases,
    detailed: true,
  },
  xve: {
    id: 'xve',
    parent: 'xecore',
    name: 'Vector engine',
    title: 'Một Vector Engine.',
    caption: 'XVE · TÀI NGUYÊN THỰC THI',
    summary: 'Bên trong một Vector Engine Xe2',
    kind: 'logical',
    concept: 'xve',
    phases: dissectionPhases,
    detailed: true,
  },
  rtx5060ti: {
    id: 'rtx5060ti',
    comparisonCategory: 'graphics',
    millimetersPerUnit: 348 / 8.93,
    parent: 'pc',
    alternative: true,
    name: 'RTX 5060 Ti',
    title: 'Card hai quạt nhỏ gọn.',
    caption: 'ASUS DUAL · RTX 5060 TI 16GB',
    summary: 'Toàn bộ card đồ họa',
    kind: 'physical',
    branchLabel: 'GPU',
    submenu: 'RTX 5060 Ti',
    submenuNote: 'ASUS Dual · 229 mm',
    concept: 'dualcard',
    phases: dissectionPhases,
    detailed: true,
  },
  rtx5060: {
    id: 'rtx5060',
    comparisonCategory: 'graphics',
    millimetersPerUnit: 348 / 8.93,
    parent: 'pc',
    alternative: true,
    name: 'RTX 5060',
    title: 'Card ITX một quạt.',
    caption: 'MSI INSPIRE ITX · RTX 5060 8G',
    summary: 'Toàn bộ card đồ họa',
    kind: 'physical',
    branchLabel: 'GPU',
    submenu: 'RTX 5060',
    submenuNote: 'MSI INSPIRE ITX · 145 mm',
    concept: 'itxcard',
    phases: dissectionPhases,
    detailed: true,
  },
  ...notebookLevels,
};

export const levelIds = Object.keys(levels) as LevelId[];

export const rootLevel: LevelId = 'pc';

/** Root-first path to a level. Replaces the old hand-written table. */
export function levelPath(id: LevelId): LevelId[] {
  const path: LevelId[] = [];
  // Bounded by the number of levels so a mis-authored cycle cannot hang the UI.
  for (
    let cursor: LevelId | null = id, guard = 0;
    cursor && guard <= levelIds.length;
    cursor = levels[cursor].parent, guard++
  )
    path.unshift(cursor);
  return path;
}

/** Direct children of a level, in declaration order. */
export function levelChildren(id: LevelId): LevelId[] {
  return levelIds.filter((l) => levels[l].parent === id);
}

export function isPhysical(id: LevelId) {
  return levels[id].kind === 'physical';
}

/** Legacy display names, kept so existing call sites keep working. */
export const levelNames = Object.fromEntries(
  levelIds.map((id) => [id, levels[id].name]),
) as Record<LevelId, string>;

/** The nearest ancestor (or this level) declaring a subsystem menu. */
export function branchRoot(id: LevelId): LevelId | null {
  const path = levelPath(id);
  return path.reverse().find((level) => levels[level].branchLabel) ?? null;
}

export interface Submenu {
  /** The scale that starts the sub-menu, used as its stable key. */
  root: LevelId;
  label: string;
  /** Maker and architecture, shown under the heading. */
  note: string;
  /** Every scale in the sub-menu, outermost first. */
  levels: LevelId[];
}

export interface Branch {
  /** The first scale in the menu, used as its stable key. */
  root: LevelId;
  label: string;
  /** Every scale under this heading, outermost first. */
  levels: LevelId[];
  /**
   * Nested dropdowns, when the menu holds several distinct products. Empty for
   * an ordinary menu; otherwise every scale in `levels` sits in exactly one.
   */
  submenus: Submenu[];
}

/** The nearest ancestor (or this level) that starts a nested dropdown. */
export function submenuRoot(id: LevelId): LevelId | null {
  const path = levelPath(id);
  return path.reverse().find((level) => levels[level].submenu) ?? null;
}

/**
 * The subsystem menus, grouped by label rather than one per branch: the case
 * fan and the tower cooler are both cooling, so they share a heading instead
 * of producing two menus of one entry each.
 */
export function systemRoot(id: LevelId): LevelId {
  return levelPath(id)[0];
}

export const systemRoots: LevelId[] = ['pc', 'legion', 'macbook'];

export function branches(system: LevelId = rootLevel): Branch[] {
  const grouped = new Map<string, LevelId[]>();
  for (const root of levelIds.filter(
    (id) => levels[id].branchLabel && systemRoot(id) === systemRoot(system),
  )) {
    const label = levels[root].branchLabel ?? levels[root].name;
    grouped.set(label, [
      ...(grouped.get(label) ?? []),
      ...levelIds.filter((id) => branchRoot(id) === root),
    ]);
  }
  return [...grouped].map(([label, scales]) => {
    const submenus: Submenu[] = [];
    for (const root of scales.filter((id) => levels[id].submenu))
      submenus.push({
        root,
        label: levels[root].submenu!,
        note: levels[root].submenuNote ?? '',
        levels: scales.filter((id) => submenuRoot(id) === root),
      });
    return { root: scales[0], label, levels: scales, submenus };
  });
}

/**
 * The menu a scale is listed under, which is not always its own branch root:
 * menus are grouped by label, so the case fan and the tower cooler share one
 * Cooling heading, keyed by whichever of them comes first.
 */
export function menuRoot(id: LevelId): LevelId | null {
  return (
    branches(systemRoot(id)).find((branch) => branch.levels.includes(id))
      ?.root ?? null
  );
}
