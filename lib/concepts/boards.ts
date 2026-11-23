import { concept, type Concept } from '../concept.ts';
import type { LevelId } from '../levels.ts';
import type { SourceId } from '../sources.ts';
import { motherboardConcepts } from './motherboard.ts';
import type { BoardChoice } from '../desktop-build.ts';

/**
 * The other boards the build workspace can fit: ASUS's TUF GAMING Z890-PLUS
 * WIFI (the same family's Intel board) and TUF GAMING B650M-PLUS WIFI (its
 * micro-ATX sibling), and three boards from other makers: MSI's MAG X870
 * TOMAHAWK WIFI, GIGABYTE's Z890 AORUS ELITE WIFI7 and ASRock's B850M Pro RS
 * WiFi.
 *
 * `mainboard.ts` builds every one from one layout, ATX or micro-ATX, so these
 * are the X670E board's parts with each board's own socket, chipset, outline
 * and slot counts written in from its maker's documents. A part a board does
 * not have is left out (`absent`). Each id carries the board's prefix
 * (`z890socket`, `tomahawkchipset`) so nothing collides with the board the
 * machine is built on.
 */

type Variant = Exclude<BoardChoice, 'motherboard'>;
type Patch = Partial<
  Pick<
    Concept,
    | 'name'
    | 'shortName'
    | 'description'
    | 'quantity'
    | 'specifications'
    | 'open'
  >
> & { sources?: SourceId[] };

interface BoardFacts {
  root: Parameters<typeof concept>[0];
  source: SourceId;
  accuracy: string;
  patches: Record<string, Patch>;
  /** Parts of the X670E board this one does not have. */
  absent?: string[];
}

/** The X670E board's rows for an ATX outline. */
const atxOutline: Patch = {
  specifications: { 'Kích thước': '305 × 244 mm (ATX)' },
};

/** A chipset under its passive heatsink. */
const chipset = (name: string): Patch => ({
  specifications: {
    Chipset: name,
    'Vai trò': 'Trung tâm điều phối I/O nền tảng',
    'Tản nhiệt': 'Tản nhiệt thụ động',
  },
});

/** An Intel board's socket, and the Core Ultra it seats and opens. */
const lga1851 = (source: SourceId): Record<'socket' | 'cpu', Patch> => ({
  socket: {
    description:
      'Socket LGA 1851 với mảng tiếp điểm lò xo, nằm dưới nắp ép thép có bản lề được cố định bằng cần gạt.',
    specifications: {
      'Loại': 'Intel LGA 1851, minh họa',
      'Cơ cấu giữ': 'Nắp ép và cần gạt',
    },
    sources: [source, 'corei9'],
  },
  cpu: {
    open: 'corei9',
    description:
      'Intel Core Ultra 9 285K trong gói đóng gói LGA 1851 hình chữ nhật, nằm dưới nắp tản nhiệt.',
    specifications: {
      'Đóng gói': 'Intel LGA 1851',
      'Nắp tản nhiệt': 'Nắp tản nhiệt tích hợp (IHS)',
    },
    sources: ['corei9', 'arrowlake'],
  },
});

const facts: Record<Variant, BoardFacts> = {
  z890: {
    source: 'tufz890',
    accuracy:
      'Dựng trên cùng bố cục với bo mạch X670E, áp dụng thông số Z890 của ASUS cho socket, chipset và số lượng khe cắm. Socket LGA 1851 và cơ cấu lắp đặt mang tính minh họa; vị trí linh kiện, đường mạch và cụm I/O sau mang tính đại diện, không phải bản sao chép chính xác bo mạch này.',
    root: {
      id: 'z890board',
      name: 'ASUS TUF GAMING Z890-PLUS WIFI',
      shortName: 'Bo mạch Z890',
      category: 'Board',
      parent: 'motherboard',
      level: 'z890',
      open: 'z890',
      description:
        'Bo mạch chủ ATX dành cho bộ xử lý Intel Core Ultra (Series 2), sử dụng socket LGA 1851 và chipset Z890.',
      purpose:
        'Gắn kết bộ xử lý Intel, bộ nhớ RAM và các card mở rộng. Bo mạch chủ quyết định cấu hình có thể dùng CPU nào: Ryzen chuẩn AM5 sẽ không lắp vừa socket này.',
      quantity: '1 bo mạch ATX',
      specifications: {
        'Kiểu dáng': 'ATX · 305 × 244 mm',
        Socket: 'Intel LGA 1851',
        Chipset: 'Intel Z890',
        'Bộ nhớ': '4 khe DDR5 DIMM · tối đa 256 GB',
        'Mở rộng': '1 × PCIe 5.0 ×16 · 1 × PCIe 4.0 ×16 (chạy ở ×4)',
        'M.2': '4 khe',
        SATA: '4 × 6 Gb/s',
      },
      representationType: 'physical',
      sources: ['tufz890', 'corei9'],
      searchTerms: [
        'z890',
        'intel',
        'lga 1851',
        'tuf',
        'asus',
        'mainboard',
        'bo mạch chủ',
      ],
    },
    patches: {
      moboboard: atxOutline,
      ...lga1851('tufz890'),
      chipset: chipset('Intel Z890'),
      pcie16: {
        specifications: {
          'Từ bộ xử lý': '1 × PCIe 5.0 ×16',
          'Từ chipset': '1 × PCIe 4.0 ×16, chạy ở ×4',
        },
      },
      pcie1: {
        specifications: {
          'Số khe': '2 × PCIe 4.0 ×1',
          'Không mô phỏng': 'Khe PCIe 4.0 ×4',
        },
      },
      m2slot: {
        quantity: 'Mô phỏng 2 trên 4 khe',
        specifications: {
          M2_1: 'PCIe 5.0 ×4 từ bộ xử lý',
          'Tổng trên bo mạch': '4 khe M.2',
        },
      },
    },
  },
  b650m: {
    source: 'tufb650m',
    accuracy:
      'Dựng trên cùng bố cục với bo mạch X670E, thu gọn xuống kích thước micro-ATX 244 × 244 mm với các khe dưới, khe ổ đĩa và chân cắm được dời lên trên, áp dụng thông số B650M của ASUS cho chipset và số lượng khe cắm. Vị trí linh kiện, đường mạch và cụm I/O sau mang tính đại diện, không phải bản sao chép chính xác bo mạch này.',
    root: {
      id: 'b650mboard',
      name: 'ASUS TUF GAMING B650M-PLUS WIFI',
      shortName: 'Bo mạch B650M',
      category: 'Board',
      parent: 'motherboard',
      level: 'b650m',
      open: 'b650m',
      description:
        'Bo mạch chủ AM5 chuẩn micro-ATX: ngắn hơn 61 mm so với ATX, giữ nguyên các lỗ ốc phía trên và có ít khe mở rộng hơn bên dưới card đồ họa.',
      purpose:
        'Hỗ trợ cùng dòng CPU Ryzen và RAM DDR5 như bo mạch AM5 ATX trong kích thước nhỏ gọn hơn, đánh đổi bằng số lượng khe mở rộng.',
      quantity: '1 bo mạch micro-ATX',
      specifications: {
        'Kiểu dáng': 'Micro-ATX · 244 × 244 mm',
        Socket: 'AMD AM5',
        Chipset: 'AMD B650',
        'Bộ nhớ': '4 khe DDR5 DIMM · tối đa 256 GB',
        'Mở rộng':
          '1 × PCIe 4.0 ×16 · 1 × PCIe 4.0 ×16 (chạy ở ×4) · 1 × PCIe 4.0 ×1',
        'M.2': '2 khe',
        SATA: '4 × 6 Gb/s',
      },
      representationType: 'physical',
      sources: ['tufb650m', 'ryzen'],
      searchTerms: [
        'b650m',
        'b650',
        'micro atx',
        'matx',
        'am5',
        'tuf',
        'asus',
        'bo mạch chủ',
      ],
    },
    patches: {
      moboboard: { specifications: { 'Kích thước': '244 × 244 mm (micro-ATX)' } },
      socket: { sources: ['tufb650m', 'ryzen'] },
      chipset: chipset('AMD B650'),
      pcie16: {
        specifications: {
          'Từ bộ xử lý': '1 × PCIe 4.0 ×16',
          'Từ chipset': '1 × PCIe 4.0 ×16, chạy ở ×4',
        },
      },
      pcie1: {
        quantity: '1 khe mô phỏng',
        specifications: { 'Số khe': '1 × PCIe 4.0 ×1' },
      },
      m2slot: {
        specifications: {
          M2_1: 'PCIe 5.0 ×4 với Ryzen 9000',
          M2_2: 'PCIe 4.0 ×4',
        },
      },
      mobofanheader: { quantity: '4 chân cắm mô phỏng' },
    },
  },
  tomahawk: {
    source: 'msix870',
    accuracy:
      'Dựng trên cùng bố cục ATX với bo mạch X670E, dùng tài liệu kỹ thuật của MSI cho chipset, ba khe dài đầy đủ và bốn khe M.2, cùng lớp giáp đen viền vàng theo ảnh sản phẩm của MSI. Vị trí linh kiện, đường mạch và cụm I/O sau mang tính đại diện, không phải bản sao chép chính xác bo mạch này.',
    root: {
      id: 'tomahawkboard',
      name: 'MSI MAG X870 TOMAHAWK WIFI',
      shortName: 'X870 Tomahawk',
      category: 'Board',
      parent: 'motherboard',
      level: 'tomahawk',
      open: 'tomahawk',
      description:
        'Bo mạch chủ AM5 chuẩn ATX của MSI dùng chipset AMD X870, trang bị ba khe mở rộng dài đầy đủ và bốn khe M.2.',
      purpose:
        'Hỗ trợ bộ xử lý Ryzen, RAM DDR5 và card mở rộng tương tự bo mạch X670E nhưng từ một nhà sản xuất khác.',
      quantity: '1 bo mạch ATX',
      specifications: {
        'Kiểu dáng': 'ATX · 305 × 244 mm',
        Socket: 'AMD AM5',
        Chipset: 'AMD X870',
        'Bộ nhớ': '4 khe DDR5 DIMM · tối đa 256 GB',
        'Mở rộng': '1 × PCIe 5.0 ×16 · 1 × PCIe 4.0 ×16 · 1 × PCIe 3.0 ×16',
        'M.2': '2 × Gen5 ×4 · 1 × Gen4 ×4 · 1 × Gen4 ×2',
        SATA: '4 × 6 Gb/s',
        'Tầng công suất': '14+2+1 × 80 A',
      },
      representationType: 'physical',
      sources: ['msix870', 'kitguru870', 'ryzen'],
      searchTerms: [
        'msi',
        'mag',
        'tomahawk',
        'x870',
        'am5',
        'mainboard',
        'bo mạch chủ',
      ],
    },
    // Every slot below the graphics card is full length.
    absent: ['pcie1'],
    patches: {
      moboboard: atxOutline,
      socket: { sources: ['msix870', 'ryzen'] },
      chipset: chipset('AMD X870'),
      pcie16: {
        name: 'Khe PCIe ×16',
        quantity: '3 khe mô phỏng',
        specifications: {
          'Từ bộ xử lý': '1 × PCIe 5.0 ×16',
          'Từ chipset': '1 × PCIe 4.0 ×16 (ở ×4) · 1 × PCIe 3.0 ×16 (ở ×1)',
        },
        sources: ['msix870', 'kitguru870', 'pcie'],
      },
      m2slot: {
        quantity: 'Mô phỏng 2 trên 4 khe',
        specifications: {
          M2_1: 'PCIe 5.0 ×4',
          'Tổng trên bo mạch': '2 × Gen5 ×4 · 1 × Gen4 ×4 · 1 × Gen4 ×2',
        },
      },
      cpuvrm: {
        specifications: {
          'Số pha': '14+2+1',
          'Tầng công suất': 'Smart power stage 80 A',
        },
        sources: ['kitguru870'],
      },
    },
  },
  aorus: {
    source: 'gbz890elite',
    accuracy:
      'Dựng trên cùng bố cục ATX với bo mạch X670E, áp dụng các khe cắm, đầu nối theo tài liệu của GIGABYTE, socket LGA 1851 của bo mạch Z890 và lớp hoàn thiện xám súng – bạc theo phong cách hãng. Vị trí linh kiện, đường mạch và cụm I/O sau mang tính đại diện, không phải bản sao chép chính xác bo mạch này.',
    root: {
      id: 'aorusboard',
      name: 'GIGABYTE Z890 AORUS ELITE WIFI7',
      shortName: 'Z890 AORUS Elite',
      category: 'Board',
      parent: 'motherboard',
      level: 'aorus',
      open: 'aorus',
      description:
        'Bo mạch chủ ATX của GIGABYTE cho bộ xử lý Intel Core Ultra (Series 2), dùng socket LGA 1851 và chipset Z890, có ba khe dài đầy đủ và bốn khe M.2.',
      purpose:
        'Gắn kết bộ xử lý Intel, bộ nhớ RAM và card mở rộng. Ryzen chuẩn AM5 không lắp vừa socket này.',
      quantity: '1 bo mạch ATX',
      specifications: {
        'Kiểu dáng': 'ATX · 305 × 244 mm',
        Socket: 'Intel LGA 1851',
        Chipset: 'Intel Z890',
        'Bộ nhớ': '4 khe DDR5 DIMM · tối đa 256 GB',
        'Mở rộng': '1 × PCIe 5.0 ×16 · 2 × PCIe 4.0 ×16 (chạy ở ×4)',
        'M.2': '4 đầu cắm Socket 3',
        SATA: '4 × 6 Gb/s',
      },
      representationType: 'physical',
      sources: ['gbz890elite', 'corei9'],
      searchTerms: [
        'gigabyte',
        'aorus',
        'elite',
        'z890',
        'intel',
        'lga 1851',
        'bo mạch chủ',
      ],
    },
    absent: ['pcie1'],
    patches: {
      moboboard: atxOutline,
      ...lga1851('gbz890elite'),
      chipset: chipset('Intel Z890 Express'),
      pcie16: {
        name: 'Khe PCIe ×16',
        quantity: '3 khe mô phỏng',
        specifications: {
          PCIEX16: 'PCIe 5.0 chạy ở ×16, từ bộ xử lý',
          'PCIEX4_1, PCIEX4_2': 'PCIe 4.0 chạy ở ×4, từ chipset',
        },
        sources: ['gbz890elite', 'pcie'],
      },
      m2slot: {
        quantity: 'Mô phỏng 2 trên 4 khe',
        specifications: {
          M2A_CPU: 'PCIe 5.0 ×4',
          M2B_CPU: 'PCIe 4.0 ×4',
          'M2Q_SB, M2M_SB': 'PCIe 4.0 ×4, từ chipset',
        },
      },
      eps8: { specifications: { 'Đầu cắm': '2 × 8-pin ATX 12 V' } },
    },
  },
  b850m: {
    source: 'asrockb850m',
    accuracy:
      'Dựng trên bố cục micro-ATX của bo mạch B650M, áp dụng tài liệu của ASRock cho chipset, các khe ×16 và ×4 cùng ba khe M.2, khối tản nhiệt chipset vuông lớn bên phải như bản vẽ hướng dẫn, và tông bạc theo phong cách hãng. ASRock công bố kiểu dáng chứ không ghi kích thước cụ thể; mô hình vẽ theo chuẩn micro-ATX 244 × 244 mm. Vị trí linh kiện, đường mạch và cụm I/O sau mang tính đại diện.',
    root: {
      id: 'b850mboard',
      name: 'ASRock B850M Pro RS WiFi',
      shortName: 'B850M Pro RS',
      category: 'Board',
      parent: 'motherboard',
      level: 'b850m',
      open: 'b850m',
      description:
        'Bo mạch chủ AM5 chuẩn micro-ATX của ASRock trên chipset AMD B850: một khe PCIe 5.0 ×16 cho card đồ họa, một khe ×4 bên dưới và ba khe M.2.',
      purpose:
        'Hỗ trợ các bộ xử lý Ryzen 9000, 8000 và 7000 cùng RAM DDR5 trong kích thước nhỏ gọn, đánh đổi bằng số lượng khe mở rộng.',
      quantity: '1 bo mạch micro-ATX',
      specifications: {
        'Kiểu dáng': 'Micro-ATX',
        Socket: 'AMD AM5',
        Chipset: 'AMD B850',
        'Bộ nhớ': '4 khe DDR5 DIMM · tối đa 256 GB',
        'Mở rộng': '1 × PCIe 5.0 ×16 · 1 × PCIe 4.0 ×4',
        'M.2': '1 × Gen5 ×4 · 2 × Gen4 ×4',
        SATA: '4 × 6 Gb/s',
      },
      representationType: 'physical',
      sources: ['asrockb850m', 'ryzen'],
      searchTerms: [
        'asrock',
        'pro rs',
        'b850m',
        'b850',
        'micro atx',
        'am5',
        'bo mạch chủ',
      ],
    },
    patches: {
      moboboard: {
        specifications: { 'Kích thước': 'Micro-ATX, vẽ ở 244 × 244 mm' },
      },
      socket: { sources: ['asrockb850m', 'ryzen'] },
      chipset: chipset('AMD B850'),
      pcie16: {
        name: 'Khe PCIe ×16',
        quantity: '1 khe mô phỏng',
        specifications: { PCIE1: 'PCIe 5.0 chạy ở ×16, từ bộ xử lý' },
        sources: ['asrockb850m', 'pcie'],
      },
      // The single short slot is a ×4 one.
      pcie1: {
        name: 'Khe PCIe ×4',
        shortName: 'PCIe ×4',
        description:
          'Khe bốn làn ngắn nằm dưới card đồ họa, dùng cho ổ SSD thứ hai qua card chuyển, card mạng hoặc card ghi hình.',
        quantity: '1 khe mô phỏng',
        specifications: { PCIE2: 'PCIe 4.0 chạy ở ×4, từ bộ xử lý' },
        sources: ['asrockb850m', 'pcie'],
      },
      m2slot: {
        quantity: 'Mô phỏng 2 trên 3 khe',
        specifications: {
          M2_1: 'PCIe 5.0 ×4, từ bộ xử lý',
          'M2_2, M2_3': 'PCIe 4.0 ×4',
        },
      },
    },
  },
};

/** One board's parts: the X670E board's, renamed and rewritten for it. */
function boardConcepts(variant: Variant): Concept[] {
  const f = facts[variant];
  const id = (name: string) => variant + name;
  return [
    concept({ ...f.root, physicalAccuracy: f.accuracy }),
    ...motherboardConcepts
      .filter((original) => !f.absent?.includes(original.id))
      .map((original) => {
        const patch = f.patches[original.id] ?? {};
        return concept({
          ...original,
          ...patch,
          id: id(original.id),
          parent:
            original.parent === 'motherboard'
              ? f.root.id
              : id(original.parent ?? ''),
          children: [],
          level: variant as LevelId,
          open: patch.open ?? original.open,
          physicalAccuracy: f.accuracy,
          // The X670E board's manual stands in for this board's own page.
          sources:
            patch.sources ??
            original.sources.map((s) =>
              s === 'mainboardmanual' ? f.source : s,
            ),
        });
      }),
  ];
}

export const z890Concepts = boardConcepts('z890');
export const b650mConcepts = boardConcepts('b650m');
export const tomahawkConcepts = boardConcepts('tomahawk');
export const aorusConcepts = boardConcepts('aorus');
export const b850mConcepts = boardConcepts('b850m');
