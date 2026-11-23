'use client';
import { ArrowUpRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command';
import { byId, categoryLabels, searchConcepts } from '@/lib/manifest';
import { hueOfSystem, hueStyle } from '@/lib/palette';
import { levels } from '@/lib/levels';

/** What the palette offers before anything has been typed. */
const suggested = [
  'package',
  'gddr7',
  'gpc',
  'sm',
  'tensor',
  'rt',
  'l2',
  'vrm',
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
};

export default function SearchDialog({
  open,
  onOpenChange,
  query,
  onQueryChange,
  onSelect,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="search-dialog">
        <DialogTitle>Tìm linh kiện</DialogTitle>
        <DialogDescription>
          Đi nhanh tới bất kỳ phần cứng hoặc thành phần kiến trúc nào.
        </DialogDescription>
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={onQueryChange}
            placeholder="Thử nhập Tensor, GDDR7, L2 hoặc SM…"
          />
          <CommandList>
            <CommandEmpty>
              Không tìm thấy linh kiện phù hợp. Thử “memory” hoặc “CUDA”.
            </CommandEmpty>
            <CommandGroup
              heading={query ? 'Kết quả phù hợp' : 'Gợi ý khám phá'}
            >
              {(query
                ? searchConcepts(query)
                : suggested.map((id) => byId[id])
              ).map((c) => (
                <CommandItem
                  key={c.id}
                  value={c.id}
                  style={hueStyle(hueOfSystem(c.category))}
                  onSelect={() => onSelect(c.id)}
                >
                  <i />
                  <div>
                    {c.name}
                    <small>
                      <span>{levels[c.level].name}</span>
                      <em>
                        <b>{categoryLabels[c.category]}</b> ·{' '}
                        {c.representationType === 'logical'
                          ? 'Kiến trúc logic'
                          : 'Phần cứng vật lý'}
                      </em>
                    </small>
                  </div>
                  <ArrowUpRight size={15} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="search-hint">
          ↑ ↓ để duyệt <span>Enter để xem</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
