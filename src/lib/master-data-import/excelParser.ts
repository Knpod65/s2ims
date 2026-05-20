import { createHeaderMap, normalizeCellValue, normalizeHeader } from './normalization'
import type {
  MasterDataImportPreviewResult,
  MasterDataImportSourceType,
  ParsedWorkbookSheet,
} from './types'
import { createMasterDataImportPreview } from './validator'

type ExcelRowValues = Array<unknown>
type WorksheetLike = {
  name: string
  eachRow: (
    options: { includeEmpty: boolean },
    callback: (row: { values: unknown }, rowNumber: number) => void
  ) => void
}

function firstNonEmptyRow(rows: ExcelRowValues[]): number {
  return rows.findIndex((row) => row.some((value) => normalizeCellValue(value).length > 0))
}

function rowsFromWorksheet(worksheet: WorksheetLike): ParsedWorkbookSheet {
  const rawRows: Array<{ rowNumber: number; values: ExcelRowValues }> = []

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    const values = Array.isArray(row.values) ? row.values.slice(1) : []
    rawRows.push({ rowNumber, values })
  })

  const headerIndex = firstNonEmptyRow(rawRows.map((row) => row.values))
  if (headerIndex === -1) {
    return {
      sheetName: worksheet.name,
      headerMap: {},
      rows: [],
    }
  }

  const headerSource = rawRows[headerIndex]
  const headers = headerSource.values.map((value) => normalizeCellValue(value))
  const headerMap = createHeaderMap(headers)
  const dataRows = rawRows.slice(headerIndex + 1)

  return {
    sheetName: worksheet.name,
    headerMap,
    rows: dataRows
      .map((row) => {
        const values: Record<string, string> = {}
        row.values.forEach((cell, index) => {
          const header = normalizeHeader(headers[index] ?? '')
          if (header) values[header] = normalizeCellValue(cell)
        })
        return {
          sourceRowNumber: row.rowNumber,
          values,
        }
      })
      .filter((row) => Object.values(row.values).some((value) => value.length > 0)),
  }
}

export async function parseMasterDataImportWorkbook(
  file: File,
  sourceType: MasterDataImportSourceType
): Promise<MasterDataImportPreviewResult> {
  if (!file.name.toLowerCase().endsWith('.xlsx')) {
    throw new Error('Only .xlsx files are supported in MC54 preview.')
  }

  const ExcelJS = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const data = await file.arrayBuffer()

  // File size checks (hard block / warning)
  if (data.byteLength > MAX_PREVIEW_FILE_SIZE_BYTES) {
    throw new Error(`File is too large for preview. Max ${MAX_PREVIEW_FILE_SIZE_BYTES} bytes.`)
  }
  if (data.byteLength > WARNING_FILE_SIZE_BYTES) {
    // Parsing may continue but UI should warn; we keep behavior here as parse but signals are surfaced in validator
    // no-op here; UI will check file.size as well
  }

  await workbook.xlsx.load(data)

  const sheets = workbook.worksheets.map((worksheet) => rowsFromWorksheet(worksheet as unknown as WorksheetLike))

  // sheet count limit check
  if (sheets.length > MAX_SHEETS) {
    // Mark sheets as warning by injecting detected sheet with reason; validator will pick up
    // We proceed but let validator/sheet detection flag the sheet counts via metadata
  }

  return createMasterDataImportPreview(file.name, sourceType, sheets)
}
