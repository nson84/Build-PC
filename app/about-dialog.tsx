'use client';
import { ArrowUpRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { sources } from '@/lib/manifest';
import { GUIDE, GUIDE_ACCELERATION, REPOSITORY } from './links';

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export default function AboutDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="about-dialog">
        <DialogTitle>Từ vỏ máy đến từng nhân xử lý.</DialogTitle>
        <DialogDescription>
          PC Anatomy là trình khám phá phần cứng máy tính 3D tương tác miễn phí.
          Tìm hiểu cách một chiếc PC để bàn hoạt động bằng cách quan sát và tháo
          rời từng linh kiện.
        </DialogDescription>
        <p>
          Bắt đầu từ thùng máy ATX hoàn chỉnh, tháo rời và đi sâu hơn: vào bo
          mạch chủ, vào card đồ họa, rồi xuống qua chip xử lý GB202 tới tận một
          bộ đa xử lý luồng (SM). Mỗi cấp độ là một nhánh bạn có thể đi sâu vào
          hoặc quay trở ra.
        </p>
        <h3>Hai loại mô hình.</h3>
        <p>
          <strong>Phần cứng (Hardware)</strong> là hình học cơ khí gốc mang
          tính ước lượng. Kích thước bo mạch ATX, bước khe mở rộng và khung cổng
          I/O sau tuân theo chuẩn form factor công bố. RTX 5090, Ryzen 9 9950X
          và Core Ultra 9 285K là các mẫu được đặt tên cụ thể; các phần còn lại
          là đại diện tiêu biểu cho dòng linh kiện đó, không phải danh sách vật
          tư của một bộ máy cố định.
        </p>
        <p>
          <strong>Silicon</strong> trình bày kiến trúc logic theo tài liệu công
          bố. Vị trí bóng bán dẫn chi tiết không được công khai. Một chip GB202
          đầy đủ có 192 SM; RTX 5090 kích hoạt 170 SM. Bên trong GPC hiển thị
          một cụm đầy đủ mang tính đại diện, không vẽ lại các đơn vị bị vô hiệu
          hóa.
        </p>
        <h3>Nghiên cứu & ghi nhận</h3>
        <a className="about-source" href={GUIDE_ACCELERATION}>
          Cài đặt tăng tốc phần cứng trình duyệt <ArrowUpRight size={15} />
        </a>
        <a className="about-source" href={GUIDE}>
          Linh kiện PC: hướng dẫn minh họa cho người mới
          <ArrowUpRight size={15} />
        </a>
        {Object.entries(sources)
          .slice(0, 2)
          .map(([id, s]) => (
            <a
              className="about-source"
              key={id}
              href={s.url}
              target="_blank"
              rel="noreferrer"
            >
              {s.name}
              <ArrowUpRight size={15} />
            </a>
          ))}
        <a
          className="about-source"
          href="https://github.com/ashemag/human-atlas"
          target="_blank"
          rel="noreferrer"
        >
          Cảm hứng tương tác · Human Atlas
          <ArrowUpRight size={15} />
        </a>
        <a
          className="about-source"
          href={REPOSITORY}
          target="_blank"
          rel="noreferrer"
        >
          Mã nguồn PC Anatomy
          <ArrowUpRight size={15} />
        </a>
        <p className="about-foot">
          Không liên kết với NVIDIA, AMD hay Intel. Không sử dụng tài nguyên mô
          hình bên thứ ba. Tài liệu được rà soát tháng 9/2026.
        </p>
      </DialogContent>
    </Dialog>
  );
}
