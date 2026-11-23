import {
  boardOptions,
  caseRoom,
  coolerOptions,
  graphicsOptions,
  memoryFits,
  memoryOptions,
  plural,
  powerOptions,
  processorOptions,
  socketFits,
  storageOptions,
  type BoardOption,
  type BuildSlot,
  type CoolerOption,
  type DesktopBuild,
  type GraphicsOption,
  type MemoryOption,
  type PowerOption,
  type ProcessorOption,
  type StorageOption,
} from './desktop-build.ts';
import type { SourceId } from './sources.ts';

/**
 * Whether the parts of a build work together, one check at a time.
 *
 * Each check compares published figures, or measurements of the modelled
 * case, and says which kind of claim it makes: a part that cannot physically
 * fit is a failure, a supply under the maker's recommendation is a warning,
 * not a prediction that the machine will fail. Every result names the sources
 * it rests on.
 *
 * No three.js here, like `desktop-build.ts`: the workspace asks these
 * questions on every render, before the engine has loaded.
 */

/**
 * The longest card the case takes with this cooler, millimetres. A front
 * radiator stands inside the intake fans, so it takes its own thickness out
 * of the card's room.
 */
export const cardClearance = (cooler: CoolerOption) =>
  caseRoom.cardLength - (cooler.radiator?.thickness ?? 0);

export type CheckStatus = 'ok' | 'warn' | 'fail';
type CheckId =
  | 'socket'
  | 'cooler'
  | 'board'
  | 'memory'
  | 'speed'
  | 'length'
  | 'supply'
  | 'connector'
  | 'storage'
  | 'budget';
export interface BuildCheck {
  id: CheckId;
  status: CheckStatus;
  title: string;
  detail: string;
  /** Each source once. */
  sources: SourceId[];
}

/** One check's result, filed under its id with the sources it rests on. */
const checkOf =
  (id: CheckId, sources: SourceId[]) =>
  (status: CheckStatus, title: string, detail: string): BuildCheck => ({
    id,
    status,
    title,
    detail,
    sources: [...new Set(sources)],
  });

function socketCheck(cpu: ProcessorOption, board: BoardOption) {
  const result = checkOf('socket', [...cpu.sources, ...board.sources]);
  return socketFits(cpu, board)
    ? result(
        'ok',
        'CPU khớp socket bo mạch chủ',
        `${cpu.name} dùng socket ${cpu.socket}, và ${board.name} có socket ${board.socket}.`,
      )
    : result(
        'fail',
        'CPU không khớp socket bo mạch chủ',
        `${cpu.name} cần socket ${cpu.socket}. ${board.name} dùng socket ${board.socket}, nên CPU không thể lắp vào và socket vẫn đóng nắp bảo vệ.`,
      );
}

/**
 * Exported so the tests can try a cooler bigger than any on offer. An air
 * tower has to stand under the side glass; a radiator needs a row of fan
 * positions as long as it is, which this case has at the front and not under
 * the roof.
 */
export function coolerCheck(cooler: CoolerOption) {
  const result = checkOf('cooler', cooler.sources);
  const { radiator, height } = cooler;
  if (radiator) {
    const fits = radiator.fans <= caseRoom.frontFans;
    const detail = `Két tản nhiệt ${radiator.length} mm cần ${radiator.fans} quạt 120 mm. Vỏ máy có ${caseRoom.frontFans} vị trí quạt ở mặt trước và chỉ ${caseRoom.roof} mm khoảng trống phía trên bo mạch chủ, không đủ chỗ cho két tản nhiệt và quạt ở nóc.`;
    return fits
      ? result('ok', 'Két tản nhiệt lắp vừa mặt trước vỏ máy', detail)
      : result('fail', 'Két tản nhiệt quá dài so với vỏ máy', detail);
  }
  const detail = `Tháp tản nhiệt cao ${height} mm tính từ mặt bo mạch, trong khi vỏ máy có khoảng ${caseRoom.coolerHeight} mm tới mặt kính hông.`;
  return (height ?? 0) <= caseRoom.coolerHeight
    ? result('ok', 'Tản nhiệt lắp vừa dưới mặt kính hông', detail)
    : result('fail', 'Tản nhiệt quá cao so với vỏ máy', detail);
}

/**
 * Exported so the tests can try an outline the case has no standoffs for.
 * The tray takes an ATX board and the micro-ATX one, which uses a subset of
 * the same mounting holes.
 */
export function boardCheck(
  board: Pick<BoardOption, 'name' | 'formFactor' | 'size' | 'sources'>,
) {
  const result = checkOf('board', board.sources);
  const [height, depth] = board.size;
  const detail = `${board.name} là bo mạch chuẩn ${board.formFactor}, kích thước ${height} × ${depth} mm, và vỏ máy có sẵn ốc đệm cho chuẩn ${caseRoom.boards.join(' và ')}.`;
  return (caseRoom.boards as readonly string[]).includes(board.formFactor)
    ? result('ok', 'Bo mạch chủ lắp vừa vỏ máy', detail)
    : result('fail', 'Bo mạch chủ không vừa vỏ máy', detail);
}

function memoryCheck(ram: MemoryOption, board: BoardOption) {
  if (memoryFits(ram, board))
    return checkOf('memory', [...ram.sources, ...board.sources])(
      'ok',
      'RAM khớp với khe cắm',
      `${ram.modules} thanh ${ram.generation} lắp vào bốn khe ${board.memory} của bo mạch chủ.`,
    );
  // The failure rests on the key positions, which the module's own sources
  // do not describe.
  return checkOf('memory', [
    'jedecmo329',
    'ddr5architecture',
    ...board.sources,
  ])(
    'fail',
    'RAM không khớp khe cắm',
    `Rãnh định vị của thanh ${ram.generation} nằm ở vị trí khác so với khe ${board.memory}, nên không thể cắm vào. Các khe RAM vẫn để trống.`,
  );
}

/**
 * How fast the memory can run, against the processor maker's rating for that
 * many modules. A kit's XMP or EXPO speed is an overclock on top of the
 * rating, so two modules above it are normal; four, where the maker rates the
 * memory controller far lower, are worth knowing about before buying. Only
 * asked once the modules fit the board.
 */
function speedCheck(cpu: ProcessorOption, ram: MemoryOption) {
  const result = checkOf('speed', [...cpu.sources, ...ram.sources]);
  const maker = cpu.brand === 'amd' ? 'AMD' : 'Intel';
  const rated = cpu.memorySpeed[ram.modules];
  const profile = `Bộ kit đạt DDR5-${ram.speed} thông qua hồ sơ XMP hoặc EXPO, vượt mức xung mặc định công bố của CPU.`;
  if (rated === undefined)
    return result(
      'ok',
      'Tốc độ RAM nằm trong mức hỗ trợ công bố',
      `${maker} công bố ${cpu.name} hỗ trợ tối đa DDR5-${cpu.memorySpeed[2]} và không công bố thông số riêng cho ${ram.modules} thanh. ${profile}`,
    );
  const four = cpu.memorySpeed[4];
  const detail = `${maker} công bố ${cpu.name} chạy ở DDR5-${cpu.memorySpeed[2]} với 2 thanh single-rank${four ? ` và DDR5-${four} với 4 thanh` : ''}. ${profile}`;
  return ram.modules === 4 && rated < cpu.memorySpeed[2]
    ? result(
        'warn',
        'Chạy 4 thanh RAM sẽ giảm tốc độ',
        `${detail} Khi cắm kín cả 4 khe, hồ sơ ép xung khó giữ ổn định nên RAM thường chạy quanh mức DDR5-${rated}.`,
      )
    : result('ok', 'Tốc độ RAM trong ngưỡng hỗ trợ', detail);
}

/** Exported so the tests can try a card longer than any on offer. */
export function lengthCheck(
  gpu: Pick<GraphicsOption, 'length' | 'sources'>,
  cooler: CoolerOption,
) {
  const room = cardClearance(cooler);
  // The cooler only comes into it when its radiator takes some of the room.
  const result = checkOf('length', [
    ...gpu.sources,
    ...(cooler.radiator ? cooler.sources : []),
  ]);
  const radiator = cooler.radiator
    ? ` Khi gắn két tản nhiệt nước phía sau quạt trước, khoảng trống ${caseRoom.cardLength} mm bị trừ đi ${cooler.radiator.thickness} mm độ dày két.`
    : '';
  return gpu.length <= room
    ? result(
        'ok',
        'Card đồ họa lắp vừa vỏ máy',
        `Dài ${gpu.length} mm, trong khi vỏ máy hỗ trợ card dài tới khoảng ${room} mm.${radiator}`,
      )
    : result(
        'fail',
        'Card đồ họa quá dài so với vỏ máy',
        `Dài ${gpu.length} mm, nhưng vỏ máy chỉ hỗ trợ tối đa khoảng ${room} mm.${radiator}`,
      );
}

function supplyCheck(gpu: GraphicsOption, psu: PowerOption) {
  const result = checkOf('supply', [...gpu.sources, ...psu.sources]);
  const kindLabel = gpu.psuKind === 'minimum' ? 'tối thiểu' : 'khuyến nghị';
  const detail = `${gpu.psuSource} công bố mức nguồn ${kindLabel} ${gpu.psu} W cho ${gpu.name}. Bộ nguồn ${psu.name} có công suất danh định ${psu.watts} W.`;
  if (psu.watts >= gpu.psu)
    return result('ok', 'Công suất nguồn đáp ứng mức hãng card yêu cầu', detail);
  return gpu.psuKind === 'minimum'
    ? result('fail', 'Công suất nguồn thấp hơn mức tối thiểu của card', detail)
    : result('warn', 'Công suất nguồn thấp hơn mức khuyến nghị của hãng card', detail);
}

function connectorCheck(gpu: GraphicsOption, psu: PowerOption) {
  const result = checkOf('connector', [...gpu.sources, ...psu.sources]);
  const leads = `${psu.eightPin} đầu cấp nguồn PCIe 8-pin`;
  if (gpu.connector === '8-pin')
    return psu.eightPin >= 1
      ? result(
          'ok',
          'Dây nguồn khớp với card đồ họa',
          `Card dùng 1 đầu cấp nguồn PCIe 8-pin và ${psu.name} có ${leads}.`,
        )
      : result(
          'fail',
          'Không có đầu dây cấp nguồn cho card',
          `Card cần 1 đầu PCIe 8-pin nhưng ${psu.name} không có.`,
        );
  if (psu.sixteenPin)
    return result(
      'ok',
      'Dây nguồn khớp với card đồ họa',
      `Card dùng đầu 16-pin 12V-2x6 và ${psu.name} có sẵn dây này.`,
    );
  if (!gpu.adapter)
    return result(
      'warn',
      'Nguồn không có dây 16-pin cho card',
      `${psu.name} chỉ có dây PCIe 8-pin, trong khi card dùng cổng 16-pin 12V-2x6. Cần dây 12V-2x6 hoặc đầu chuyển đổi.`,
    );
  return psu.eightPin >= gpu.adapter.leads
    ? result(
        'warn',
        'Card cần dùng cáp chuyển đổi đi kèm',
        `${psu.name} không có dây 16-pin 12V-2x6. Card đi kèm cáp chuyển ${gpu.adapter.name} và bộ nguồn có ${leads} để cắm đủ.`,
      )
    : result(
        'fail',
        'Không đủ dây 8-pin cho cáp chuyển của card',
        `${psu.name} không có dây 16-pin 12V-2x6, và cáp chuyển ${gpu.adapter.name} của card cần ${gpu.adapter.leads} đầu nhưng nguồn chỉ có ${psu.eightPin}.`,
      );
}

/**
 * The M.2 drive takes its power through the slot it sits in; a SATA drive
 * needs a data cable to the board and a power lead from the supply.
 */
function storageCheck(
  drives: StorageOption,
  psu: PowerOption,
  board: BoardOption,
) {
  const m2 =
    'Ổ M.2 gắn vào khe M.2 trên bo mạch chủ và lấy điện trực tiếp qua khe này.';
  if (!drives.sata)
    return checkOf('storage', [...drives.sources, ...board.sources])(
      'ok',
      'Ổ cứng khớp với bo mạch chủ',
      `${m2} Cấu hình này không cần dây cáp ổ cứng.`,
    );
  const result = checkOf('storage', [
    ...drives.sources,
    ...board.sources,
    ...psu.sources,
  ]);
  return psu.sata >= 1
    ? result(
        'ok',
        'Cả hai ổ cứng đều được kết nối',
        `${m2} Ổ SSD SATA nối cáp dữ liệu tới cổng SATA trên bo mạch và nhận dây nguồn từ ${psu.name} (có ${psu.sata} đầu nguồn SATA).`,
      )
    : result(
        'fail',
        'Thiếu dây nguồn cho ổ SATA',
        `${m2} Ổ SSD SATA cần đầu nguồn SATA nhưng ${psu.name} không có.`,
      );
}

function budgetCheck(
  cpu: ProcessorOption,
  gpu: GraphicsOption,
  psu: PowerOption,
  board: BoardOption,
) {
  const result = checkOf('budget', [
    ...cpu.sources,
    ...gpu.sources,
    ...psu.sources,
  ]);
  const draw = cpu.watts + gpu.watts;
  // The figure is for the parts chosen, so it still answers whether this
  // supply would carry them when the processor cannot go into this board.
  const unseated = socketFits(cpu, board)
    ? ''
    : ` Vẫn tính mức tiêu thụ của ${cpu.name} dù CPU này không lắp vừa bo mạch đã chọn.`;
  const detail = `${cpu.watts} W (${cpu.wattsLabel}) cộng với ${gpu.watts} W của card là ${draw} W, so với công suất nguồn ${psu.watts} W. RAM, ổ cứng, quạt và các đỉnh tải ngắn sẽ cộng thêm vào mức này.${unseated}`;
  return draw <= psu.watts
    ? result('ok', 'Tổng công suất CPU và GPU nằm trong ngưỡng của nguồn', detail)
    : result(
        'fail',
        'Tổng công suất CPU và GPU vượt quá công suất nguồn',
        detail,
      );
}

/** Rated draw: the processor's and the card's published power figures. */
export function ratedDraw(build: DesktopBuild) {
  return (
    processorOptions[build.processor].watts +
    graphicsOptions[build.graphics].watts
  );
}

/**
 * Every check, in the order a builder would meet them. The memory speed is
 * only asked of modules that fit the board.
 */
export function checkBuild(build: DesktopBuild): BuildCheck[] {
  const cpu = processorOptions[build.processor],
    cooler = coolerOptions[build.cooler],
    board = boardOptions[build.board],
    ram = memoryOptions[build.memory],
    gpu = graphicsOptions[build.graphics],
    drives = storageOptions[build.storage],
    psu = powerOptions[build.power];
  return [
    socketCheck(cpu, board),
    coolerCheck(cooler),
    boardCheck(board),
    memoryCheck(ram, board),
    ...(memoryFits(ram, board) ? [speedCheck(cpu, ram)] : []),
    lengthCheck(gpu, cooler),
    supplyCheck(gpu, psu),
    connectorCheck(gpu, psu),
    storageCheck(drives, psu, board),
    budgetCheck(cpu, gpu, psu, board),
  ];
}

/** The checks each slot's part takes part in. */
const slotChecks: Record<BuildSlot, CheckId[]> = {
  processor: ['socket', 'speed', 'budget'],
  cooler: ['cooler', 'length'],
  board: ['socket', 'board', 'memory', 'storage'],
  memory: ['memory', 'speed'],
  storage: ['storage'],
  graphics: ['length', 'supply', 'connector', 'budget'],
  power: ['supply', 'connector', 'storage', 'budget'],
};

/** The worst result among some checks. */
export function buildStatus(checks: BuildCheck[]): CheckStatus {
  return checks.some((c) => c.status === 'fail')
    ? 'fail'
    : checks.some((c) => c.status === 'warn')
      ? 'warn'
      : 'ok';
}

/**
 * What putting this part in the slot, with the rest of the build as it is,
 * does to the checks the part is involved in: the worst of them, and the
 * first one that is not clean, so the picker can say why. A problem elsewhere
 * in the build does not mark every option in every slot.
 */
export function optionFit<S extends BuildSlot>(
  build: DesktopBuild,
  slot: S,
  part: DesktopBuild[S],
) {
  const own = checkBuild({ ...build, [slot]: part }).filter((c) =>
    slotChecks[slot].includes(c.id),
  );
  const status = buildStatus(own);
  return {
    status,
    reason: own.find((c) => c.status === status && status !== 'ok')?.title,
  };
}

/** Whether a part fails a check it is involved in, with the rest as built. */
export const conflicts = <S extends BuildSlot>(
  build: DesktopBuild,
  slot: S,
  part: DesktopBuild[S],
) => optionFit(build, slot, part).status === 'fail';

/** The worst result among the checks one slot's part takes part in. */
export const slotStatus = (checks: BuildCheck[], slot: BuildSlot) =>
  buildStatus(checks.filter((c) => slotChecks[slot].includes(c.id)));

/** The slots whose parts a check compares, in slot order. */
export const checkSlots = (id: CheckId) =>
  (Object.keys(slotChecks) as BuildSlot[]).filter((slot) =>
    slotChecks[slot].includes(id),
  );
