'use client';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { levels, type LevelId } from '@/lib/levels';

type Props = {
  level: LevelId;
  explode: number;
  logical: boolean;
  playing: boolean;
  onToggleAuto: () => void;
  onSetExplode: (value: number) => void;
  onReset: () => void;
  sectionLabel?: string;
  title?: string;
  sliderLabel?: string;
  valueText?: string;
};

export default function Disassembly({
  level,
  explode,
  logical,
  playing,
  onToggleAuto,
  onSetExplode,
  onReset,
  sectionLabel = 'Điều khiển tháo rời',
  title,
  sliderLabel = 'Tháo rời mô hình',
  valueText,
}: Props) {
  const phases = levels[level].phases,
    explodePercent = Math.round(explode);
  return (
    <section className="disassembly" aria-label={sectionLabel}>
      <div className="disassembly-intro">
        <button
          className={
            'play' +
            (playing ? ' running' : '') +
            (!playing && explode < 1 ? ' idle' : '')
          }
          onClick={onToggleAuto}
          aria-label={
            playing
              ? 'Tạm dừng tháo rời tự động'
              : 'Tháo rời tự động'
          }
        >
          {playing ? <Pause size={23} /> : <Play size={23} />}
          <span>{playing ? 'Tạm dừng' : 'Tự động'}</span>
        </button>
        <div className="disassembly-label">
          <div>
            <strong>{title ?? (logical ? 'Mở rộng' : 'Tháo rời')}</strong>
            <span>KÉO HOẶC CHẠY</span>
          </div>
        </div>
      </div>
      <div className="timeline">
        <div className="phase-labels">
          {phases.map(([name, value]) => (
            <button
              key={name}
              className={Math.abs(explode - Number(value)) < 13 ? 'active' : ''}
              onClick={() => onSetExplode(Number(value))}
            >
              {name}
            </button>
          ))}
        </div>
        <Slider
          value={[explode]}
          onValueChange={(value) =>
            onSetExplode(Array.isArray(value) ? value[0] : value)
          }
          aria-label={sliderLabel}
          aria-valuetext={valueText ?? `${explodePercent} phần trăm`}
        />
        <div className="ruler" aria-hidden="true">
          {Array.from({ length: 41 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
      <div className="disassembly-readout">
        <output>{explodePercent}%</output>
        <button
          className="reset"
          aria-label="Đặt lại góc nhìn và lắp ráp"
          onClick={onReset}
        >
          <RotateCcw size={18} />
          <span>Đặt lại</span>
        </button>
      </div>
    </section>
  );
}
