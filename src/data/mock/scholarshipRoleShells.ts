import type { Role } from '@/lib/types'

export interface ScholarshipShellKpi {
  label: string
  value: string
  helper: string
  tone: 'cyan' | 'violet' | 'mint' | 'peach'
}

export interface ScholarshipWorkflowItem {
  title: string
  description: string
  status: string
}

export interface ScholarshipRoleShellConfig {
  role: Extract<Role, 'staff' | 'admin' | 'esq' | 'provider'>
  eyebrow: string
  title: string
  description: string
  visibilityNote: string
  primaryPanelTitle: string
  primaryPanelBody: string
  kpis: ScholarshipShellKpi[]
  workflow: ScholarshipWorkflowItem[]
}

const aggregateKpis: ScholarshipShellKpi[] = [
  { label: 'ระเบียนทุน', value: '513', helper: 'ข้อมูลรวมจากระบบจำลอง', tone: 'cyan' },
  { label: 'นักศึกษา', value: '229', helper: 'แสดงแบบภาพรวมเท่านั้น', tone: 'violet' },
  { label: 'ชื่อทุน', value: '45', helper: 'กลุ่มทุนที่เปิดใช้งาน', tone: 'mint' },
  { label: 'วงเงินรวม', value: '5.45M THB', helper: 'ตัวเลขจำลองเพื่อการวางแผน', tone: 'peach' },
]

export const scholarshipRoleShells: Record<'staff' | 'admin' | 'esq', ScholarshipRoleShellConfig> = {
  staff: {
    role: 'staff',
    eyebrow: 'Staff Scholarship Operations',
    title: 'ศูนย์ปฏิบัติการทุน',
    description: 'มุมมองสำหรับเจ้าหน้าที่เพื่อติดตามภาพรวม คิวตรวจข้อมูล และคุณภาพข้อมูลทุนโดยไม่เปิดเผยข้อมูลเกินจำเป็น',
    visibilityNote: 'เห็นเฉพาะข้อมูลที่จำเป็นต่อการปฏิบัติงาน รายละเอียดส่วนบุคคลควรถูกเปิดเมื่อมีเหตุผลในการตรวจสอบเท่านั้น',
    primaryPanelTitle: 'คิวงานวันนี้',
    primaryPanelBody: 'จัดลำดับทุนที่ต้องตรวจเงื่อนไข เอกสาร และสถานะการสมัคร โดยผลแมตช์เป็นข้อมูลประกอบ ไม่ใช่ผลอนุมัติ',
    kpis: aggregateKpis,
    workflow: [
      { title: 'ตรวจเงื่อนไขบังคับ', description: 'เช็คเกณฑ์ GPA ชั้นปี เอกสาร และสถานะที่ยังรอตรวจ', status: 'พร้อมใช้งาน' },
      { title: 'คุณภาพข้อมูล', description: 'ดูรายการที่ข้อมูลขาด ไม่ชัดเจน หรือยังไม่ได้ยืนยัน', status: 'เฝ้าระวัง' },
      { title: 'ส่งต่อคณะกรรมการ', description: 'เตรียมสรุปแบบจำกัดข้อมูลส่วนบุคคลเพื่อการพิจารณา', status: 'แบบจำลอง' },
    ],
  },
  admin: {
    role: 'admin',
    eyebrow: 'System Scholarship Governance',
    title: 'ภาพรวมธรรมาภิบาลทุน',
    description: 'มุมมองผู้ดูแลระบบสำหรับติดตามโครงสร้างข้อมูล สิทธิ์การมองเห็น และความพร้อมของชุดข้อมูลทุน',
    visibilityNote: 'ผู้ดูแลระบบเห็นภาพรวมและการตั้งค่า ไม่ควรใช้หน้านี้แทนการพิจารณาทุนรายบุคคล',
    primaryPanelTitle: 'สถานะข้อมูลระบบ',
    primaryPanelBody: 'รวมสัญญาณเรื่องจำนวนระเบียน ข้อมูลที่ต้องตรวจ และขอบเขตการมองเห็นตามบทบาท',
    kpis: aggregateKpis,
    workflow: [
      { title: 'สิทธิ์และบทบาท', description: 'ตรวจว่าหน้าใหม่เปิดเฉพาะบทบาทที่เกี่ยวข้อง', status: 'ควบคุมแล้ว' },
      { title: 'ขอบเขตข้อมูล', description: 'เน้นข้อมูลรวมและข้อความเตือน PDPA ในมุมมองข้ามบทบาท', status: 'ต้องทบทวนเสมอ' },
      { title: 'ความพร้อมต้นแบบ', description: 'เช็คว่าแต่ละ route ใช้ mock data และไม่มี backend ใหม่', status: 'ต้นแบบ' },
    ],
  },
  esq: {
    role: 'esq',
    eyebrow: 'ESQ Scholarship Oversight',
    title: 'มุมมองกำกับคุณภาพทุน',
    description: 'มุมมองผู้กำกับคุณภาพสำหรับดูภาพรวมทุน ผลลัพธ์เชิงระบบ และประเด็นที่ต้องขอคำชี้แจงเพิ่มเติม',
    visibilityNote: 'แสดงข้อมูลรวมเพื่อการกำกับคุณภาพ ไม่แสดงรายละเอียดส่วนบุคคลหรือเอกสารแนบรายคน',
    primaryPanelTitle: 'สรุปสำหรับการกำกับดูแล',
    primaryPanelBody: 'ใช้ดูทิศทางการเข้าถึงทุน ความครบถ้วนของข้อมูล และความเสี่ยงเชิงกระบวนการในระดับภาพรวม',
    kpis: aggregateKpis,
    workflow: [
      { title: 'ภาพรวมการเข้าถึง', description: 'ดูจำนวนทุน นักศึกษา และมูลค่ารวมในระดับระบบ', status: 'ภาพรวม' },
      { title: 'ประเด็นคุณภาพ', description: 'เน้นจุดที่ควรให้เจ้าหน้าที่ตรวจหรืออธิบายเพิ่ม', status: 'ติดตาม' },
      { title: 'หลักการมองเห็นข้อมูล', description: 'คงข้อมูลส่วนบุคคลไว้ในหน้าที่มีเหตุผลใช้งานเฉพาะ', status: 'จำกัดข้อมูล' },
    ],
  },
}
