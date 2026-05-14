// ---------------------------------------------------------------------------
// Notification Navigation Presenter — UX-N1A Runtime Skeleton
// ---------------------------------------------------------------------------
// Converts payload + resolution into UI-ready data. It does not render UI and
// does not perform navigation.
// ---------------------------------------------------------------------------

import type { NotificationNavigationPresenterContract } from '../contracts/notificationNavigationContracts'
import type {
  NotificationNavigationPayload,
  NotificationNavigationPresenterOutput,
  NotificationNavigationResolution,
} from '../dto/notificationNavigationDto'
import { notificationNavigationCopy } from '../copy/notificationNavigationCopy'

export class NotificationNavigationPresenter implements NotificationNavigationPresenterContract {
  present(
    payload: NotificationNavigationPayload,
    resolution: NotificationNavigationResolution,
    options: { lang?: 'en' | 'th' } = {}
  ): NotificationNavigationPresenterOutput {
    const lang = options.lang ?? 'en'

    return {
      id: payload.id,
      title: payload.title,
      body: payload.body,
      severity: payload.severity,
      isClickable: resolution.allowed,
      href: resolution.allowed ? resolution.target.href : undefined,
      actionLabel: resolution.allowed
        ? notificationNavigationCopy.getActionLabel(payload, lang)
        : lang === 'th'
          ? 'ไม่พร้อมใช้งาน'
          : 'Not available',
      ariaLabel: notificationNavigationCopy.getAriaLabel(payload, lang),
      disabledReason: resolution.allowed
        ? undefined
        : notificationNavigationCopy.getBlockedReasonCopy(resolution.blockedReason, lang),
      targetDisplayToken: payload.targetDisplayToken,
    }
  }

  presentList(
    payloads: NotificationNavigationPayload[],
    resolutions: NotificationNavigationResolution[],
    options: { lang?: 'en' | 'th' } = {}
  ): NotificationNavigationPresenterOutput[] {
    return payloads.map((payload, index) => {
      const resolution = resolutions[index] ?? {
        allowed: false,
        isClickable: false,
        blockedReason: 'unknown_route' as const,
      }
      return this.present(payload, resolution, options)
    })
  }
}

export const notificationNavigationPresenter = new NotificationNavigationPresenter()
