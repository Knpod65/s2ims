import { STATUS_GROUPS, type BadgeTone, type StatusConfig } from './statuses'

export type StatusDomain = keyof typeof STATUS_GROUPS

export function getStatusConfig(domain: StatusDomain, status: string): StatusConfig {
  const config = STATUS_GROUPS[domain].statuses.find((item) => item.key === status)

  if (!config) {
    throw new Error(`Unknown ${domain} status: ${status}`)
  }

  return config
}

export function getStatusLabel(domain: StatusDomain, status: string, lang: 'en' | 'th'): string {
  return getStatusConfig(domain, status).label[lang]
}

export function getStatusTone(domain: StatusDomain, status: string): BadgeTone {
  return getStatusConfig(domain, status).recommendedBadgeTone
}

export function isTerminalStatus(domain: StatusDomain, status: string): boolean {
  return getStatusConfig(domain, status).terminal
}

export function requiresAction(domain: StatusDomain, status: string): boolean {
  return getStatusConfig(domain, status).requiresAction
}
