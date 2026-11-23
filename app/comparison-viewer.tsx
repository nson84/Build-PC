'use client';
import { useState } from 'react';
import {
  comparisonItem,
  type ComparisonViewState,
} from '@/lib/comparison-state';
import { useViewerEngine } from './use-viewer-engine';

type Props = {
  state: ComparisonViewState;
};

export default function ComparisonViewer({ state }: Props) {
  const [hover, setHover] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const left = comparisonItem(state.left),
    right = comparisonItem(state.right);
  const { host, error, ready } = useViewerEngine(
    state,
    {},
    () =>
      import('@/lib/comparison-scene').then(
        ({ createComparisonViewer }) => createComparisonViewer,
      ),
    (_current, reportError) => ({
      stats: () => {},
      hover: (name, x, y) =>
        setHover((previous) =>
          name
            ? previous?.name === name && previous.x === x && previous.y === y
              ? previous
              : { name, x, y }
            : null,
        ),
      error: reportError,
    }),
    'Không thể tải trình so sánh 3D. Vui lòng tải lại trang để thử lại.',
  );

  return (
    <>
      <div
        ref={host}
        className="comparison-viewport"
        data-active-side={state.activeSide}
        aria-label={`So sánh 3D đồng bộ giữa ${left.shortName} và ${right.shortName}`}
      >
        <section
          className="comparison-pane-a11y left"
          aria-label={`Khung trái: ${left.name}`}
        />
        <section
          className="comparison-pane-a11y right"
          aria-label={`Khung phải: ${right.name}`}
        />
      </div>
      {!ready && !error && (
        <output className="comparison-loading">Đang tải cả hai mô hình…</output>
      )}
      {error && (
        <div className="comparison-error" role="alert">
          {error}
          <button onClick={() => location.reload()}>Tải lại trình xem</button>
        </div>
      )}
      {hover && (
        <div
          className="hover-label comparison-hover"
          role="tooltip"
          style={{
            left: Math.max(8, Math.min(hover.x + 16, window.innerWidth - 220)),
            top: Math.max(10, Math.min(hover.y - 48, window.innerHeight - 70)),
          }}
        >
          {hover.name}
          <span>Linh kiện đang so sánh</span>
        </div>
      )}
    </>
  );
}
