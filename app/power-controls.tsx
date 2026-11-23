'use client';
import { useState } from 'react';
import { Zap } from 'lucide-react';
import {
  hasPowerFlow,
  powerPanelState,
  type PowerTarget,
} from '@/lib/power-flow-policy';
import type { ExplorerState } from '@/lib/explorer-state';

const targets: { id: PowerTarget; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'cpu', label: 'CPU' },
  { id: 'gpu', label: 'GPU' },
  { id: 'storage', label: 'Lưu trữ' },
];

export default function PowerControls({
  state,
  onToggle,
  onTarget,
  onInspect,
}: {
  state: ExplorerState;
  onToggle: () => void;
  onTarget: (target: PowerTarget) => void;
  onInspect: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  if (!hasPowerFlow(state.level)) return null;
  const { routes, visible, explanation, status } = powerPanelState(state);
  return (
    <>
      <button
        className={
          'airflow-toggle power-toggle' + (state.power ? ' active' : '')
        }
        aria-label={state.power ? 'Ẩn đường cấp nguồn' : 'Hiện đường cấp nguồn'}
        aria-pressed={state.power}
        aria-controls="power-flow-panel"
        title="Theo dõi đường cấp điện từ bộ nguồn đến từng linh kiện"
        onClick={onToggle}
      >
        <Zap size={15} />
        <span>Nguồn điện</span>
        <small>{state.power ? 'Bật' : 'Tắt'}</small>
      </button>
      {state.power && (
        <section
          className={'power-panel' + (expanded ? ' expanded' : '')}
          id="power-flow-panel"
          aria-label="Đường cấp nguồn"
        >
          <div className="power-heading">
            <strong>Theo dõi dòng điện</strong>
            <span>TỪ BỘ NGUỒN (PSU)</span>
            <button
              className="power-legend-toggle"
              aria-expanded={expanded}
              aria-controls="power-legend"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? 'Thu gọn' : 'Chi tiết'}
            </button>
          </div>
          <fieldset className="power-targets" aria-label="Đích cấp nguồn">
            {targets.map((target) => (
              <button
                key={target.id}
                aria-pressed={state.powerTarget === target.id}
                onClick={() => onTarget(target.id)}
              >
                {target.label}
              </button>
            ))}
          </fieldset>
          {status && <output className="power-status">{status}</output>}
          <ul className="power-legend" id="power-legend">
            {routes.map((route) => (
              <li
                key={route.id}
                className={!visible.includes(route.id) ? 'power-muted' : ''}
              >
                <i style={{ background: route.color }} aria-hidden="true" />
                <button
                  onClick={() => onInspect(route.inspect)}
                  title={route.description}
                  aria-label={`Kiểm tra ${route.destination}: ${route.label}`}
                >
                  <span>
                    <strong>{route.label}</strong>
                    <small>{route.voltage}</small>
                  </span>
                  <span className="power-destination">
                    {route.destination} →
                  </span>
                </button>
              </li>
            ))}
          </ul>
          {explanation && <p className="power-explanation">{explanation}</p>}
          <p className="power-note">
            Màu sắc phân biệt từng tuyến dây. Mũi tên chỉ hướng dòng điện, không
            biểu thị tốc độ hay công suất. Đường nét đứt: cấp điện xuyên qua bo
            mạch.
          </p>
        </section>
      )}
    </>
  );
}
