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
  { label: 'รายการทุนทั้งหมด', value: '513', helper: 'จำนวน scholarship records จากข้อมูลจำลอง', tone: 'cyan' },
  { label: 'นักศึกษาที่ได้รับการสนับสนุน', value: '229', helper: 'unique students ในภาพรวมระบบ', tone: 'violet' },
  { label: 'ชื่อทุนทั้งหมด', value: '45', helper: 'ชื่อทุนหลังจัดกลุ่มและตรวจซ้ำ', tone: 'mint' },
  { label: 'มูลค่าทุนรวม', value: '5.45M THB', helper: 'รวมเฉพาะรายการที่เป็นตัวเลข', tone: 'peach' },
]

export const scholarshipRoleShells: Record<'staff' | 'admin' | 'esq', ScholarshipRoleShellConfig> = {
  staff: {
    role: 'staff',
    eyebrow: 'Staff Scholarship Operations',
    title: 'ศูนย์ปฏิบัติการทุน',
    description: 'มุมมองสำหรับเจ้าหน้าที่เพื่อติดตามภาพรวม คิวตรวจข้อมูล และคุณภาพข้อมูลทุน โดยไม่เปิดเผยข้อมูลเกินความจำเป็น',
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
    title: 'ธรรมาภิบาลทุนการศึกษา',
    description: 'ศูนย์ควบคุมสำหรับทะเบียนนโยบายทุน สิทธิ์การมองเห็นข้อมูล มาตรฐานประเภททุน ประวัติการนำเข้า และสุขภาพข้อมูลระบบ',
    visibilityNote: 'ผู้ดูแลระบบเห็นภาพรวมและการตั้งค่า ไม่ควรใช้หน้านี้แทนการพิจารณาทุนรายบุคคล ข้อมูลส่วนบุคคลถูกซ่อนตามสิทธิ์',
    primaryPanelTitle: 'สถานะข้อมูลระบบ',
    primaryPanelBody: 'รวมสัญญาณเรื่องจำนวนระเบียน ข้อมูลที่ต้องตรวจ และขอบเขตการมองเห็นตามบทบาท',
    kpis: aggregateKpis,
    workflow: [
      { title: 'สิทธิ์และบทบาท', description: 'ตรวจว่าหน้าใหม่เปิดเฉพาะบทบาทที่เกี่ยวข้อง', status: 'ควบคุมแล้ว' },
      { title: 'ขอบเขตข้อมูล', description: 'เน้นข้อมูลรวมและข้อความเตือน PDPA ในมุมมองข้ามบทบาท', status: 'ต้องทบทวนเสมอ' },
      { title: 'ความพร้อมต้นแบบ', description: 'ทุกส่วนใช้ mock data และไม่มี backend persistence', status: 'ต้นแบบ' },
    ],
  },
  esq: {
    role: 'esq',
    eyebrow: 'ESQ Executive Oversight',
    title: 'ภาพรวมทุนการศึกษา',
    description: 'แดชบอร์ดเชิงนโยบายสำหรับผู้บริหาร แสดงแนวโน้มและคุณภาพข้อมูลในระดับภาพรวมเท่านั้น ไม่แสดงรายบุคคล',
    visibilityNote: 'ข้อมูลภาพรวมเท่านั้น ไม่แสดงรายชื่อนักศึกษา รหัสนักศึกษา เอกสารแนบ หรือหลักฐานการทำงานรายคน',
    primaryPanelTitle: 'สรุปสำหรับการตัดสินใจเชิงนโยบาย',
    primaryPanelBody: 'ใช้ดูทิศทางการเข้าถึงทุน ความครอบคลุมของประเภททุน คุณภาพข้อมูล และประเด็นที่ควรติดตามในระดับระบบ',
    kpis: aggregateKpis,
    workflow: [
      { title: 'ภาพรวมการเข้าถึง', description: 'ดูจำนวนทุน นักศึกษา และมูลค่ารวมในระดับระบบ', status: 'ภาพรวม' },
      { title: 'ประเด็นคุณภาพ', description: 'เน้นจุดที่ควรให้เจ้าหน้าที่ตรวจหรืออธิบายเพิ่ม', status: 'ติดตาม' },
      { title: 'หลักการมองเห็นข้อมูล', description: 'คงข้อมูลส่วนบุคคลไว้ในหน้าที่มีเหตุผลใช้งานเฉพาะ', status: 'จำกัดข้อมูล' },
    ],
  },
}
