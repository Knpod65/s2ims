// ---------------------------------------------------------------------------
// Notification Navigation Copy — UX-N1A Runtime Skeleton
// ---------------------------------------------------------------------------
// Safe EN/TH labels for future notification navigation. No UI rendering here.
// ---------------------------------------------------------------------------

import type { NotificationNavigationCopyContract } from '../contracts/notificationNavigationContracts'
import type {
  NotificationNavigationBlockedReason,
  NotificationNavigationPayload,
} from '../dto/notificationNavigationDto'

type Lang = 'en' | 'th'

const BLOCKED_REASON_COPY: Record<NotificationNavigationBlockedReason, Record<Lang, string>> = {
  unknown_route: {
    en: 'This notification target is not available.',
    th: 'ไม่พบปลายทางของการแจ้งเตือนนี้',
  },
  missing_param: {
    en: 'This notification is missing a safe target.',
    th: 'การแจ้งเตือนนี้ไม่มีปลายทางที่ปลอดภัยครบถ้วน',
  },
  unsafe_param: {
    en: 'This notification was blocked for privacy protection.',
    th: 'การแจ้งเตือนนี้ถูกปิดกั้นเพื่อคุ้มครองข้อมูลส่วนบุคคล',
  },
  role_scope_mismatch: {
    en: 'This item is not available from your current workspace.',
    th: 'รายการนี้ไม่สามารถเปิดได้จากพื้นที่ทำงานปัจจุบัน',
  },
  permission_mismatch: {
    en: 'You may not have permission to open this item.',
    th: 'คุณอาจไม่มีสิทธิ์เปิดรายการนี้',
  },
  route_not_allowed_for_role: {
    en: 'This route is not available for your current role.',
    th: 'เส้นทางนี้ไม่พร้อมใช้งานสำหรับบทบาทปัจจุบัน',
  },
  not_clickable: {
    en: 'This notification is informational only.',
    th: 'การแจ้งเตือนนี้เป็นข้อมูลเท่านั้น',
  },
}

export class NotificationNavigationCopy implements NotificationNavigationCopyContract {
  getActionLabel(payload: NotificationNavigationPayload, lang: Lang = 'en'): string {
    if (payload.actionLabel) return payload.actionLabel
    if (payload.targetRouteName.includes('application')) {
      return lang === 'th' ? 'ตรวจสอบใบสมัคร' : 'Review application'
    }
    if (payload.targetRouteName.includes('audit')) {
      return lang === 'th' ? 'ดูรายละเอียด' : 'View details'
    }
    return lang === 'th' ? 'เปิดการแจ้งเตือน' : 'Open notification'
  }

  getBlockedReasonCopy(reason: NotificationNavigationBlockedReason, lang: Lang = 'en'): string {
    return BLOCKED_REASON_COPY[reason]?.[lang] ?? BLOCKED_REASON_COPY.unknown_route[lang]
  }

  getAriaLabel(payload: NotificationNavigationPayload, lang: Lang = 'en'): string {
    const action = this.getActionLabel(payload, lang)
    return `${action}: ${payload.title}`
  }
}

export const notificationNavigationCopy = new NotificationNavigationCopy()
