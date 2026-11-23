'use client';
import { ArrowLeft, ChevronRight, MousePointerClick, X } from 'lucide-react';
import type { Concept } from '@/lib/manifest';
import { levelPath, levels, type LevelId } from '@/lib/levels';
import { hueOfLevel, hueOfSystem, hueStyle } from '@/lib/palette';

type Props = {
  level: LevelId;
  explode: number;
  logical: boolean;
  selected: Concept | null;
  /** Show the first-visit line about what clicking does. */
  hint?: boolean;
  onDismissHint?: () => void;
  onNavigate: (level: LevelId) => void;
};

/** A tap cannot right-click, so a phone is told the two-tap version. */
function hintCopy() {
  return typeof matchMedia !== 'undefined' &&
    matchMedia('(pointer: coarse)').matches
    ? 'Chạm vào linh kiện để xem thông tin và tháo rời, hoặc nhấn Tự động.'
    : 'Nhấp vào linh kiện để mở, nhấp chuột phải để kiểm tra, hoặc nhấn Tự động.';
}

export default function StageHeading({
  level,
  explode,
  logical,
  selected,
  hint = false,
  onDismissHint,
  onNavigate,
}: Props) {
  const scale = levels[level],
    path = levelPath(level);
  return (
    <section className="stage-heading">
      <div>
        <h1>
          {explode === 100
            ? 'Danh mục linh kiện'
            : explode > 0
              ? logical
                ? 'Các khối kiến trúc đã tách'
                : 'Đang tháo rời'
              : scale.title}
        </h1>
        {path.length > 1 && (
          <div className="stage-meta">
            <nav className="breadcrumbs" aria-label="Cấp độ linh kiện">
              <button
                aria-label="Quay lại một cấp"
                onClick={() => onNavigate(path[path.length - 2])}
              >
                <ArrowLeft size={14} />
              </button>
              {path.map((id, i) => (
                <span key={id} style={hueStyle(hueOfLevel(id))}>
                  {i > 0 && <ChevronRight size={12} />}
                  <button
                    aria-current={id === level ? 'page' : undefined}
                    onClick={() => onNavigate(id)}
                  >
                    {levels[id].name}
                  </button>
                </span>
              ))}
              {selected && selected.shortName !== scale.name && (
                <span style={hueStyle(hueOfSystem(selected.category))}>
                  <ChevronRight size={12} />
                  <span className="crumb-selected">{selected.shortName}</span>
                </span>
              )}
            </nav>
          </div>
        )}
        {hint && (
          <p className="first-visit-hint">
            <MousePointerClick size={15} aria-hidden="true" />
            <span>{hintCopy()}</span>
            <button aria-label="Đóng gợi ý" onClick={onDismissHint}>
              <X size={14} />
            </button>
          </p>
        )}
      </div>
    </section>
  );
}
