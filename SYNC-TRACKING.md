# Death Review Sync Tracking Log

## Purpose
Track death_review documents synced from CouchDB to DHIS2.

## Current Status: **IN PROGRESS - Resolving Validation Errors**

### Progress Summary
✅ Fixed event UID format issue (removed custom ID generation)  
✅ Added programStage to event payload  
⚠️ Resolving 3 validation errors:

### Current Validation Errors

#### 1. Missing `occurredAt` (E1031)
**Error**: Event OccurredAt date is missing  
**Cause**: DHIS2 requires `occurredAt` field, we're only sending `eventDate`  
**Fix**: Add `occurredAt` field to event

#### 2. Invalid Education Level Value (E1125)
**Error**: Value "post-secondary" is not valid  
**Valid Options**: None, Primary, Secondary, Higher than secondary  
**Current Value**: post-secondary  
**Fix**: Map "post-secondary" → "Higher than secondary"

#### 3. Invalid Date Format (E1302)
**Error**: DataElement `nOBOcP6XxzQ` (Date of Death) has invalid datetime format  
**Current Format**: Likely just date (YYYY-MM-DD)  
**Required Format**: ISO datetime with timezone  
**Fix**: Convert date to full ISO 8601 format

## Next Steps
1. Fix the date format for `occurredAt` and date of death
2. Fix education level mapping
3. Restart service and verify successful sync

## Service Details
- **CouchDB**: medic database at 127-0-0-1.local-ip.medicmobile.org:10444
- **DHIS2**: histracker.health.go.ke (v2.36.13.2)
- **Program**: COMMUNITY MATERNAL DEATH NOTIFICATION (gsV6ZGGQSqK)
- **Program Stage**: qUBD0Wa5x0Z

## Documents Found
- Total death_review documents in CouchDB: Multiple  
- Documents processed this session: 3
- Successfully synced: 0 (pending fixes)
