'use client';
import { useCallback, useEffect, useState } from 'react';
import {
  ChevronDown,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Wind,
} from 'lucide-react';
import { byId } from '@/lib/manifest';
import { hueOfSystem, hueStyle } from '@/lib/palette';
import {
  airflowShown,
  hasAirflow,
  type AirflowMode,
} from '@/lib/airflow-policy';
import type { ExplorerState } from '@/lib/explorer-state';
import type { LevelId } from '@/lib/levels';
import type { ReactNode } from 'react';

const views = ['perspective', 'top', 'front', 'back'] as const;
const viewLabels = ['3D', 'TRÊN', 'TRƯỚC', 'SAU'];
const viewNames = ['Góc nhìn 3D', 'Nhìn từ trên', 'Nhìn từ trước', 'Nhìn từ sau'];

type Props = {
  children?: ReactNode;
  view: ExplorerState['view'];
  level: LevelId;
  explode: number;
  logical: boolean;
  airflow: AirflowMode;
  hidden: string[];
  hiddenMenuOpen: boolean;
  onToggleHiddenMenu: () => void;
  onSetView: (view: ExplorerState['view']) => void;
  onToggleAirflow: () => void;
  onUnhide: (id: string) => void;
  onClearHidden: () => void;
};

export default function StageTools({
  children,
  view,
  level,
  explode,
  logical,
  airflow,
  hidden,
  hiddenMenuOpen,
  onToggleHiddenMenu,
  onSetView,
  onToggleAirflow,
  onUnhide,
  onClearHidden,
}: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');
  const hiddenComponents = hidden.flatMap((id) => (byId[id] ? [byId[id]] : []));
  // Nothing at this scale moves air, so there is no control to offer.
  const fans = hasAirflow(level);
  const showingAirflow = airflowShown(airflow, level);
  // The claim is about an assembled machine. Once it is open the arrows have
  // already faded, so the control says so rather than appearing to do nothing.
  const assembled = explode < 9;
  // Laid out flat, every camera but the top one looks at the parts edge-on.
  const flattened = logical && explode > 85;

  useEffect(() => {
    const syncFullscreen = () => {
      setFullscreen(Boolean(document.fullscreenElement));
      if (document.fullscreenElement) setFullscreenError('');
    };
    document.addEventListener('fullscreenchange', syncFullscreen);
    syncFullscreen();
    return () =>
      document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    setFullscreenError('');
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else
        await document.documentElement.requestFullscreen({
          navigationUI: 'hide',
        });
    } catch {
      setFullscreenError(
        'Trình duyệt đang chặn chế độ toàn màn hình. Hãy nhấn F11.',
      );
    }
  }, []);

  return (
    <div className="stage-tools">
      <div className="view-controls" aria-label="Điều khiển góc nhìn">
        {views.map((option, i) => {
          const active = flattened ? option === 'top' : view === option;
          const name = viewNames[i];
          return (
            <button
              key={option}
              title={name}
              aria-label={name}
              disabled={flattened && option !== 'top'}
              aria-pressed={active}
              className={active ? 'active' : ''}
              onClick={() => onSetView(option)}
            >
              {viewLabels[i]}
            </button>
          );
        })}
        <span />
        <button
          title={fullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          aria-label={fullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          aria-pressed={fullscreen}
          className={fullscreen ? 'active' : ''}
          onClick={() => void toggleFullscreen()}
        >
          {fullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
        </button>
      </div>
      {fans && (
        <button
          className={'airflow-toggle' + (showingAirflow ? ' active' : '')}
          title={
            showingAirflow
              ? 'Ẩn đường đi của luồng khí'
              : assembled
                ? 'Hiện đường đi của luồng khí trong máy'
                : 'Hiện luồng khí — hiển thị khi máy đang lắp ráp'
          }
          aria-label={showingAirflow ? 'Ẩn luồng khí' : 'Hiện luồng khí'}
          aria-pressed={showingAirflow}
          onClick={onToggleAirflow}
        >
          <Wind size={15} />
          <span>Luồng khí</span>
          <small>{showingAirflow ? 'Bật' : 'Tắt'}</small>
        </button>
      )}
      {children}
      {hiddenComponents.length > 0 && (
        <div className="hidden-tracker">
          <button
            className="hidden-tracker-toggle"
            aria-expanded={hiddenMenuOpen}
            aria-controls="hidden-components-menu"
            onClick={onToggleHiddenMenu}
          >
            <EyeOff size={15} />
            <span>
              {hiddenComponents.length} linh kiện đang ẩn
            </span>
            <ChevronDown size={14} />
          </button>
          {hiddenMenuOpen && (
            <div className="hidden-components-menu" id="hidden-components-menu">
              <div className="hidden-menu-heading">
                <strong>Đang ẩn ở cấp độ này</strong>
                <button onClick={onClearHidden}>Hiện tất cả</button>
              </div>
              <ul>
                {hiddenComponents.map((component) => (
                  <li
                    key={component.id}
                    style={hueStyle(hueOfSystem(component.category))}
                  >
                    <i />
                    <span>{component.shortName}</span>
                    <button
                      aria-label={`Hiện ${component.name}`}
                      onClick={() => onUnhide(component.id)}
                    >
                      <Eye size={14} />
                      Hiện
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {fullscreenError && (
        <output className="fullscreen-error">{fullscreenError}</output>
      )}
    </div>
  );
}
