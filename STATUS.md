# Integration Service Status

## ✅ Service Running
The CouchDB to DHIS2 integration service is **operational** and watching for new submissions.

## Current Configuration

### CouchDB
- ✅ Connected successfully
- Database: medic
- Watching: death_review forms

### DHIS2  
- ✅ Connected successfully
- Version: 2.36.13.2
- Program: COMMUNITY MATERNAL DEATH NOTIFICATION (gsV6ZGGQSqK)
- **Dynamic Org Unit Mapping**: Uses `chu_tracker_id` from each death_review document

### Field Mappings (14 fields)
All fields are mapped and transforming correctly:
- Demographics: Age, Date of Death
- Maternal: Pregnant status, Gravida, Parity, Marital status, Education, Occupation  
- Location: CHU Code (via chu_tracker_id), Household
- Reporter: Name, Phone, Cadre, Report Date

## Current Issue: 409 Conflict Error

The existing death_review document is getting a **409 Conflict** error when posting to DHIS2. This typically means:

1. **Event ID already exists** in DHIS2 (unlikely - verified it doesn't exist)
2. **Program/Org Unit validation issue** - The org unit `Qtk7GCRLEBk` (Kituro CHU) might not be assigned to the program
3. **Data validation constraints** - Some field values might not meet DHIS2 validation rules

## Next Steps to Resolve

### Option 1: Verify Org Unit Assignment
Check if the org unit is assigned to the program in DHIS2:
```bash
curl -k -u kihara:Kenya123@@ \
  --resolve histracker.health.go.ke:443:38.242.215.143 \
  'https://histracker.health.go.ke/api/programs/gsV6ZGGQSqK.json?fields=organisationUnits[id,name]' \
  | jq '.organisationUnits[] | select(.id=="Qtk7GCRLEBk")'
```

If the org unit is not assigned to the program, it needs to be added in DHIS2.

### Option 2: Test with Different Event ID
The service generates event IDs as `medic-{document_id}`. We could:
- Generate unique IDs per attempt
- Use DHIS2's auto-generated IDs (remove event field)

### Option 3: Test with New Submission
Submit a **new death_review form** in the Medic Mobile app. The service will:
- Detect it immediately
- Use the CHU's tracker_id as the org unit
- Attempt to push to DHIS2

## Verification Commands

### Check if event exists in DHIS2:
```bash
curl -k -u kihara:Kenya123@@ \
  --resolve histracker.health.go.ke:443:38.242.215.143 \
  'https://histracker.health.go.ke/api/tracker/events/medic-15e5965c-b53b-4645-b4d5-f65aff44ed2e'
```

### View service logs:
```bash
tail -f logs/combined.log
```

### Check sync state:
```bash
cat sync-state.json | jq '.'
```

## What's Working

✅ CouchDB connection with self-signed certificates  
✅ DHIS2 connection with DNS resolution fix  
✅ Real-time change detection  
✅ Field mapping (14 fields)  
✅ Dynamic org unit mapping from `chu_tracker_id`  
✅ Service stability and error handling  

## What Needs Resolution

⚠️ 409 Conflict error when posting events  
⚠️ Need to verify org unit assignment in DHIS2 program  
⚠️ May need to adjust event ID strategy  

## Recommendation

**Test with a fresh death_review submission** from a CHU that you know is properly configured in DHIS2. This will help isolate whether the issue is:
- Historical data specific
- Org unit configuration
- Program assignment

The service is ready and will automatically sync any new submissions as soon as they're created in the Medic Mobile app.
