'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { Eye, Send, Save } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function NewAnnouncementPage() {
  const { lang } = useLang()
  const [titleTh, setTitleTh] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [amount, setAmount] = useState('')
  const [numAwards, setNumAwards] = useState('')
  const [gpa, setGpa] = useState('2.5')
  const [deadline, setDeadline] = useState('')
  const [hasEssay, setHasEssay] = useState(false)
  const [hasInterview, setHasInterview] = useState(false)
  const [hasProposal, setHasProposal] = useState(false)
  const [schType, setSchType] = useState('APPLICATION')
  const [submitted, setSubmitted] = useState(false)
  const { addToast } = useToast()

  const handleSaveDraft = () => {
    addToast(
      lang === 'th' ? 'บันทึกร่างแล้ว' : 'Draft saved',
      'success'
    )
  }

  return (
    <AppShell requiredRole="staff">
      <PageHeader
        title={lang==='th'?'สร้างประกาศใหม่':'Create Announcement'}
        subtitle={lang==='th'?'กรอกข้อมูลเพื่อสร้างประกาศ TH/EN อัตโนมัติ':'Fill in the form to auto-generate TH/EN announcement'}
        actions={
          <div className="flex gap-2">
            <button onClick={handleSaveDraft} className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3">
              <Save size={13}/>{lang==='th'?'บันทึกร่าง':'Save Draft'}
            </button>
            <button
              onClick={() => setSubmitted(true)}
              className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
            >
              <Send size={13}/>{lang==='th'?'ส่งให้ ESQ อนุมัติ':'Submit to ESQ'}
            </button>
          </div>
        }
      />

      {submitted && (
        <div className="mb-4 p-3 bg-status-success/10 border border-status-success/25 rounded-xl text-status-success text-sm flex items-center gap-2">
          ✅ {lang==='th'?'ส่งให้ ESQ อนุมัติแล้ว — รอการตอบกลับ':'Submitted to ESQ for approval — awaiting response'}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'ข้อมูลพื้นฐาน':'Basic Information'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-ink-3 block mb-1">{lang==='th'?'ประเภทประกาศ':'Announcement Type'}</label>
                <select className="input-base" value={schType} onChange={e=>setSchType(e.target.value)}>
                  <option value="APPLICATION">{lang==='th'?'รับสมัคร':'Application Announcement'}</option>
                  <option value="INTERVIEW_LIST">{lang==='th'?'รายชื่อผู้สัมภาษณ์':'Interview Shortlist'}</option>
                  <option value="RESULT">{lang==='th'?'ประกาศผล':'Result Announcement'}</option>
                  <option value="POST_AWARD_DOCS">{lang==='th'?'เอกสารหลังรับทุน':'Post-Award Documents'}</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-ink-3 block mb-1">{lang==='th'?'ชื่อประกาศ (ภาษาไทย)':'Title (Thai)'}</label>
                <input className="input-base" value={titleTh} onChange={e=>setTitleTh(e.target.value)} placeholder="ประกาศรับสมัครทุน..."/>
              </div>
              <div>
                <label className="text-xs text-ink-3 block mb-1">{lang==='th'?'ชื่อประกาศ (ภาษาอังกฤษ)':'Title (English)'}</label>
                <input className="input-base" value={titleEn} onChange={e=>setTitleEn(e.target.value)} placeholder="Scholarship Application..."/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-ink-3 block mb-1">{lang==='th'?'จำนวนเงิน (บาท)':'Amount (THB)'}</label>
                  <input type="number" className="input-base" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="30000"/>
                </div>
                <div>
                  <label className="text-xs text-ink-3 block mb-1">{lang==='th'?'จำนวนทุน':'No. of Awards'}</label>
                  <input type="number" className="input-base" value={numAwards} onChange={e=>setNumAwards(e.target.value)} placeholder="10"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-ink-3 block mb-1">GPA {lang==='th'?'ขั้นต่ำ':'Minimum'}</label>
                  <input type="number" step="0.1" min="0" max="4" className="input-base" value={gpa} onChange={e=>setGpa(e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs text-ink-3 block mb-1">{lang==='th'?'กำหนดส่ง':'Deadline'}</label>
                  <input type="date" className="input-base" value={deadline} onChange={e=>setDeadline(e.target.value)}/>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'ข้อกำหนดเพิ่มเติม':'Additional Requirements'}</h3>
            <div className="space-y-2.5">
              {[
                [hasEssay, setHasEssay, lang==='th'?'ต้องมีเรียงความ':'Essay required'],
                [hasInterview, setHasInterview, lang==='th'?'มีการสัมภาษณ์':'Interview required'],
                [hasProposal, setHasProposal, lang==='th'?'ต้องมีข้อเสนอโครงการ':'Project proposal required'],
              ].map(([val, set, label], i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={val as boolean} onChange={e=>(set as (v:boolean)=>void)(e.target.checked)} className="accent-brand w-4 h-4"/>
                  <span className="text-sm text-ink-1 group-hover:text-ink-1">{label as string}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-3">{lang==='th'?'เอกสารที่ต้องใช้':'Required Documents'}</h3>
            <div className="space-y-2 text-xs text-ink-3">
              {['ใบสมัคร / Application Form','สำเนาบัตรนักศึกษา / Student ID Copy','Transcript (ใบรับรองผลการเรียน)'].map(d => (
                <div key={d} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand rounded-full flex-shrink-0"/>
                  {d}
                </div>
              ))}
              {hasEssay && <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand rounded-full flex-shrink-0"/>เรียงความ / Essay</div>}
              {hasProposal && <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand rounded-full flex-shrink-0"/>ข้อเสนอโครงการ / Project Proposal</div>}
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="card p-5 border-white/[0.12]">
          <div className="text-[10px] text-ink-3 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Eye size={11}/>{lang==='th'?'ตัวอย่างประกาศ (Live Preview)':'Announcement Preview (Live)'}
          </div>
          {titleTh || titleEn ? (
            <div className="space-y-4">
              {/* TH Preview */}
              <div>
                <div className="text-[10px] text-ink-3 mb-2">🇹🇭 ภาษาไทย</div>
                <h4 className="font-display font-bold text-base text-ink-1 mb-2">{titleTh || '(ชื่อภาษาไทย)'}</h4>
                <div className="text-xs text-ink-3 space-y-1.5">
                  {amount && <div>💰 จำนวนเงิน: {parseInt(amount).toLocaleString()} บาท{numAwards ? ` (${numAwards} ทุน)` : ''}</div>}
                  {gpa && <div>📚 เกรดเฉลี่ยขั้นต่ำ: {gpa}</div>}
                  {deadline && <div>📅 กำหนดส่ง: {new Date(deadline).toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'})}</div>}
                  {hasEssay && <div>✍️ ต้องมีเรียงความ</div>}
                  {hasInterview && <div>🎤 มีการสัมภาษณ์</div>}
                  {hasProposal && <div>📋 ต้องมีข้อเสนอโครงการ</div>}
                </div>
              </div>
              <hr className="border-white/[0.06]"/>
              {/* EN Preview */}
              <div>
                <div className="text-[10px] text-ink-3 mb-2">🇺🇸 English</div>
                <h4 className="font-display font-bold text-base text-ink-1 mb-2">{titleEn || '(English title)'}</h4>
                <div className="text-xs text-ink-3 space-y-1.5">
                  {amount && <div>💰 Amount: ฿{parseInt(amount).toLocaleString()}{numAwards ? ` (${numAwards} awards)` : ''}</div>}
                  {gpa && <div>📚 Minimum GPA: {gpa}</div>}
                  {deadline && <div>📅 Deadline: {new Date(deadline).toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'})}</div>}
                  {hasEssay && <div>✍️ Essay required</div>}
                  {hasInterview && <div>🎤 Interview required</div>}
                  {hasProposal && <div>📋 Project proposal required</div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="text-2xl mb-2 opacity-30">📄</div>
              <div className="text-xs text-ink-3">{lang==='th'?'กรอกข้อมูลทางซ้ายเพื่อดูตัวอย่าง':'Fill the form to see preview'}</div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}