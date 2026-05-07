'use client'

import { useLang } from '@/lib/i18n'
import { useState } from 'react'
import { mockStaffDisclosureRequests } from '@/data/mock/staffData'
import DisclosureRequestCard from '@/components/staff/DisclosureRequestCard'
import DisclosureApprovalModal from '@/components/staff/DisclosureApprovalModal'
import DisclosureRejectionModal from '@/components/staff/DisclosureRejectionModal'
import AppShell from '@/components/layout/AppShell'

export default function DisclosureRequestsPage() {
  const { lang } = useLang()
  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean
    requestId?: string
  }>({ isOpen: false })

  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean
    requestId?: string
  }>({ isOpen: false })

  const currentRequest = mockStaffDisclosureRequests.find((r) => r.id === approvalModal.requestId || r.id === rejectionModal.requestId)

  const handleViewAndApprove = (requestId: string) => {
    setApprovalModal({ isOpen: true, requestId })
  }

  const handleReject = (requestId: string) => {
    setRejectionModal({ isOpen: true, requestId })
  }

  const handleApprove = () => {
    // Mock: just close modal after approval
    setApprovalModal({ isOpen: false })
  }

  const handleRejectSubmit = (reason: string) => {
    // Mock: just close modal after rejection
    setRejectionModal({ isOpen: false })
  }

  const pendingRequests = mockStaffDisclosureRequests.filter((r) => r.status === 'pending_staff_approval')
  const approvedRequests = mockStaffDisclosureRequests.filter((r) => r.status === 'approved')
  const rejectedRequests = mockStaffDisclosureRequests.filter((r) => r.status === 'rejected')

  return (
    <AppShell requiredRole="staff">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-ink-1 mb-2">
            {lang === 'th' ? 'คำขอเปิดเผยตัวตน' : 'Disclosure Requests'}
          </h1>
          <p className="text-sm text-ink-3">
            {lang === 'th'
              ? 'อนุมัติหรือปฏิเสธคำขอเปิดเผยตัวตนของผู้ให้โครงการให้ทุน เมื่อการเปิดเผยอনุมัติแล้ว นักเรียนจะเห็นตัวตนของผู้ให้โครงการ'
              : 'Approve or reject provider disclosure requests. When approved, students will see provider identity.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-xs text-ink-3 mb-1">
              {lang === 'th' ? 'รอตรวจสอบ' : 'Pending'}
            </p>
            <p className="text-2xl font-bold text-role-primary">{pendingRequests.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-ink-3 mb-1">
              {lang === 'th' ? 'อนุมัติ' : 'Approved'}
            </p>
            <p className="text-2xl font-bold text-status-success">{approvedRequests.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-ink-3 mb-1">
              {lang === 'th' ? 'ปฏิเสธ' : 'Rejected'}
            </p>
            <p className="text-2xl font-bold text-status-danger">{rejectedRequests.length}</p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-ink-1 mb-4">
              {lang === 'th' ? 'รอการอนุมัติ' : 'Awaiting Approval'}
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <DisclosureRequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={handleViewAndApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </div>
        )}

        {/* Approved Requests */}
        {approvedRequests.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-ink-1 mb-4">
              {lang === 'th' ? 'อนุมัติแล้ว' : 'Approved'}
            </h2>
            <div className="space-y-3">
              {approvedRequests.map((request) => (
                <DisclosureRequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        )}

        {/* Rejected Requests */}
        {rejectedRequests.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-ink-1 mb-4">
              {lang === 'th' ? 'ปฏิเสธแล้ว' : 'Rejected'}
            </h2>
            <div className="space-y-3">
              {rejectedRequests.map((request) => (
                <DisclosureRequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
        )}

        {mockStaffDisclosureRequests.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-sm text-ink-3">
              {lang === 'th'
                ? 'ไม่มีคำขอเปิดเผยตัวตน'
                : 'No disclosure requests'}
            </p>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {currentRequest && approvalModal.isOpen && (
        <DisclosureApprovalModal
          isOpen={true}
          onClose={() => setApprovalModal({ isOpen: false })}
          candidateToken={currentRequest.candidateToken}
          providerName={currentRequest.providerName}
          fieldsToDisclose={currentRequest.fieldsToDisclose}
          matchSummary={currentRequest.matchSummary}
          onApprove={handleApprove}
        />
      )}

      {/* Rejection Modal */}
      {currentRequest && rejectionModal.isOpen && (
        <DisclosureRejectionModal
          isOpen={true}
          onClose={() => setRejectionModal({ isOpen: false })}
          candidateToken={currentRequest.candidateToken}
          providerName={currentRequest.providerName}
          onReject={handleRejectSubmit}
        />
      )}
    </AppShell>
  )
}
