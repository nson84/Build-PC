'use client';
import { useState, type SubmitEvent } from 'react';
import { ArrowUpRight, LoaderCircle, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { CONTACT_ENDPOINT, NEW_ISSUE } from './links';
import {
  EMPTY_DRAFT,
  KIND_LABELS,
  KINDS,
  LIMITS,
  payload,
  send,
  type Context,
  type Draft,
  type Kind,
  type Outcome,
} from './feedback';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Read at the moment of sending, so it is what the reader sees then. */
  context: () => Context;
};

type Status = 'idle' | 'sending' | Outcome;

const PROBLEMS: Partial<Record<Status, string>> = {
  invalid:
    'Thông tin biểu mẫu chưa hợp lệ. Hãy kiểm tra nội dung từ 10 đến 5000 ký tự và địa chỉ email đầy đủ.',
  rate_limited:
    'Bạn đã gửi quá nhiều tin nhắn trong thời gian ngắn. Vui lòng đợi vài phút rồi thử lại.',
  failed:
    'Không thể gửi tin nhắn. Hãy kiểm tra kết nối mạng và thử lại; nội dung bạn viết vẫn được giữ nguyên.',
};

/**
 * A message to the maintainer. The form posts to `api/contact.ts`, which holds
 * the mail credentials; nothing here knows where the message ends up.
 *
 * The dialog stays mounted once opened, so the draft survives closing it.
 * Only a sent message clears it.
 */
export default function FeedbackDialog({ open, onOpenChange, context }: Props) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [status, setStatus] = useState<Status>('idle');
  const [replyTo, setReplyTo] = useState(false);
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const change = (next: boolean) => {
    if (!next && status === 'sent') {
      setDraft(EMPTY_DRAFT);
      setStatus('idle');
    } else if (!next && status !== 'sending') {
      setStatus('idle');
    }
    onOpenChange(next);
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    const outcome = await send(CONTACT_ENDPOINT, payload(draft, context()));
    if (outcome === 'sent') {
      setReplyTo(draft.email.trim() !== '');
      setDraft(EMPTY_DRAFT);
    }
    setStatus(outcome);
  };

  const length = draft.message.trim().length;
  const problem = PROBLEMS[status];

  return (
    <Dialog open={open} onOpenChange={change} modal>
      <DialogContent className="about-dialog feedback-dialog">
        <DialogTitle>Gửi góp ý</DialogTitle>
        <DialogDescription>
          Phát hiện sai sót, có ý tưởng mới, hoặc muốn hợp tác cùng PC Anatomy?
          Hãy nhắn cho mình tại đây.
        </DialogDescription>
        {status === 'sent' ? (
          <div className="feedback-done">
            <output>
              Cảm ơn bạn, tin nhắn đã được gửi.
              {replyTo && ' Mình sẽ phản hồi qua địa chỉ email bạn đã cung cấp.'}
            </output>
            <button
              type="button"
              className="feedback-submit"
              onClick={() => setStatus('idle')}
            >
              Gửi tin nhắn khác
            </button>
          </div>
        ) : status === 'unavailable' ? (
          <div className="feedback-done" role="alert">
            <p>
              Biểu mẫu góp ý hiện không khả dụng trên bản chạy này. Bạn có thể
              mở issue trên GitHub; nội dung bạn viết vẫn được giữ lại để sao
              chép.
            </p>
            <a
              className="feedback-submit"
              href={NEW_ISSUE}
              target="_blank"
              rel="noreferrer"
            >
              Mở issue trên GitHub
              <ArrowUpRight size={15} />
            </a>
            <button
              type="button"
              className="feedback-back"
              onClick={() => setStatus('idle')}
            >
              Quay lại biểu mẫu
            </button>
          </div>
        ) : (
          <form className="feedback-form" onSubmit={submit}>
            <fieldset className="feedback-kinds">
              <legend>Nội dung về vấn đề gì?</legend>
              {KINDS.map((kind) => (
                <label key={kind}>
                  <input
                    type="radio"
                    name="kind"
                    value={kind}
                    checked={draft.kind === kind}
                    onChange={() => set('kind', kind as Kind)}
                  />
                  <span>{KIND_LABELS[kind]}</span>
                </label>
              ))}
            </fieldset>
            <div className="feedback-row">
              <label>
                <span>
                  Tên <small>không bắt buộc</small>
                </span>
                <input
                  name="name"
                  value={draft.name}
                  onChange={(e) => set('name', e.target.value)}
                  maxLength={LIMITS.name}
                  autoComplete="name"
                />
              </label>
              <label>
                <span>
                  Email <small>không bắt buộc, để nhận phản hồi</small>
                </span>
                <input
                  name="email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => set('email', e.target.value)}
                  maxLength={LIMITS.email}
                  autoComplete="email"
                />
              </label>
            </div>
            <div className="feedback-message">
              <label>
                <span>Nội dung</span>
                <textarea
                  name="message"
                  value={draft.message}
                  onChange={(e) => set('message', e.target.value)}
                  required
                  minLength={LIMITS.messageMin}
                  maxLength={LIMITS.messageMax}
                  rows={5}
                  aria-describedby="feedback-count"
                />
              </label>
              <small id="feedback-count" className="feedback-count">
                {length < LIMITS.messageMin
                  ? `Tối thiểu ${LIMITS.messageMin} ký tự`
                  : `${length} / ${LIMITS.messageMax}`}
              </small>
            </div>
            {/* Off screen and out of the tab order: people never see it, bots
                fill it in, and the server drops anything that has it set. */}
            <div className="feedback-trap" aria-hidden="true">
              <label>
                Website
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={draft.website}
                  onChange={(e) => set('website', e.target.value)}
                />
              </label>
            </div>
            <p className="feedback-note">
              Địa chỉ trang hiện tại, linh kiện bạn đang chọn và ngôn ngữ giao
              diện sẽ được gửi kèm tin nhắn. Tin nhắn được gửi qua email tới
              người duy trì PC Anatomy và chỉ dùng để phản hồi cho bạn.
            </p>
            {problem && (
              <p className="feedback-error" role="alert">
                {problem}
              </p>
            )}
            <button
              className="feedback-submit"
              type="submit"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <LoaderCircle size={15} className="feedback-spin" />
              ) : (
                <Send size={15} />
              )}
              {status === 'sending' ? 'Đang gửi…' : 'Gửi'}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
