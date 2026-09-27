# ERRORS.md - Error Tracking & Learning System

## [2026-09-25 12:37] - TypeScript Build Typing Mismatch in Educational Types

- **Type**: Syntax / Build
- **Severity**: Low
- **File**: `d:/N-help/src/types/educational.ts:1-35`
- **Agent**: Mark42 (@frontend-specialist)
- **Root Cause**: `SafetyGuideScreen.tsx` imported type `SafetyCategory` which was an inline union rather than an exported type alias, and `mythFactData.ts` contained an entry with severity `'LOW'` which was missing from the `MythFactEntry` severity union.
- **Error Message**: 
  ```
  src/components/education/SafetyGuideScreen.tsx(15,10): error TS2305: Module '"../../types/educational"' has no exported member 'SafetyCategory'.
  src/data/mythFactData.ts(107,5): error TS2322: Type '"LOW"' is not assignable to type '"HIGH" | "MEDIUM" | "CRITICAL"'.
  ```
- **Fix Applied**: Exported `type SafetyCategory = 'BEFORE' | 'DURING' | 'AFTER'` and updated `MythFactEntry` severity union to include `'LOW'`.
- **Prevention**: Centralize shared component prop and category types in dedicated type definitions before referencing them in downstream views.
- **Status**: Fixed

---
