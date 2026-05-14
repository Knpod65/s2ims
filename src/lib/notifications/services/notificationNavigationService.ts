// ---------------------------------------------------------------------------
// Notification Navigation Service — UX-N1A Runtime Skeleton
// ---------------------------------------------------------------------------
// Resolves notification targets through route registry and policy boundaries.
// It does not call router.push, mark notifications read, or mutate payloads.
// ---------------------------------------------------------------------------

import type {
  NotificationNavigationPolicyContract,
  NotificationNavigationServiceContract,
  NotificationRouteRegistryContract,
} from '../contracts/notificationNavigationContracts'
import type {
  NotificationNavigationOptions,
  NotificationNavigationPayload,
  NotificationNavigationResolution,
  NotificationNavigationTarget,
} from '../dto/notificationNavigationDto'
import { notificationRouteRegistry } from '../routes/notificationRouteRegistry'
import { notificationNavigationPolicy } from '../policies/notificationNavigationPolicy'

export class NotificationNavigationService implements NotificationNavigationServiceContract {
  constructor(
    private readonly routeRegistry: NotificationRouteRegistryContract = notificationRouteRegistry,
    private readonly policy: NotificationNavigationPolicyContract = notificationNavigationPolicy,
  ) {}

  resolve(
    payload: NotificationNavigationPayload,
    options: NotificationNavigationOptions
  ): NotificationNavigationResolution {
    const policyBlock = this.policy.explainBlockedNavigation(options.actorRole, payload)
    if (policyBlock) {
      return { allowed: false, isClickable: false, blockedReason: policyBlock }
    }

    return this.routeRegistry.resolveTarget(payload)
  }

  canNavigate(payload: NotificationNavigationPayload, options: NotificationNavigationOptions): boolean {
    return this.resolve(payload, options).allowed
  }

  getTarget(
    payload: NotificationNavigationPayload,
    options: NotificationNavigationOptions
  ): NotificationNavigationTarget | null {
    const resolution = this.resolve(payload, options)
    return resolution.allowed ? resolution.target : null
  }
}

export const notificationNavigationService = new NotificationNavigationService()
