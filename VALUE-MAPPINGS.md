# Value Mappings for DHIS2 Option Sets

## Overview
CouchDB form values are often lowercase or different from DHIS2's expected option set values. These transformations ensure compatibility.

## Applied Value Transformations

### 1. Pregnant at Death
**DHIS2 Field**: C-MDN_Was the woman pregnant at the time of death? (J6aK3hgLN2q)  
**Type**: TEXT  
**Options**: Yes, No

| CouchDB Value | DHIS2 Value |
|--------------|-------------|
| yes | **Yes** |
| no | **No** |

**Transformation**: Capitalize first letter

---

### 2. Marital Status
**DHIS2 Field**: C-MDN_Marital status? (vr9N7az7jCT)  
**Type**: TEXT  
**Options**: Married, Widowed, Single, Separated, Divorced

| CouchDB Value | DHIS2 Value |
|--------------|-------------|
| married | **Married** |
| widowed | **Widowed** |
| single | **Single** |
| separated | **Separated** |
| divorced | **Divorced** |

**Transformation**: Capitalize first letter

---

### 3. Education Level
**DHIS2 Field**: C-MDN_Education level (kdpNkAdLGwE)  
**Type**: TEXT  
**Options**: None, Primary, Secondary, Higher than secondary

| CouchDB Value | DHIS2 Value |
|--------------|-------------|
| none | **None** |
| primary | **Primary** |
| secondary | **Secondary** |
| post-secondary | **Higher than secondary** ⭐ |

**Transformation**: Custom mapping + capitalization

---

### 4. Occupation
**DHIS2 Field**: C-MDN_Occupation? (hqP4OGUgLxu)  
**Type**: TEXT  
**Options**: Employed, Self-employed, Not employed

| CouchDB Value | DHIS2 Value |
|--------------|-------------|
| employed | **Employed** |
| self-employed | **Self-employed** |
| not employed | **Not employed** |
| unemployed | **Not employed** ⭐ |

**Transformation**: Custom mapping + capitalization  
**Note**: "unemployed" is mapped to "Not employed"

---

### 5. Nationality
**DHIS2 Field**: C-MDN_Nationality (QtP5E8twVr3)  
**Type**: TEXT  
**Options**: Kenyan, Other

| CouchDB Value | DHIS2 Value |
|--------------|-------------|
| kenyan | **Kenyan** |
| other | **Other** |
| null/empty | **Kenyan** (default) ⭐ |

**Transformation**: Custom mapping with default  
**Note**: Defaults to "Kenyan" if not specified

---

## Date Format Transformations

### Date of Death (DATETIME)
**DHIS2 Field**: C-MDN_Date and time of Death (nOBOcP6XxzQ)  
**Type**: DATETIME

| CouchDB Format | DHIS2 Format |
|----------------|--------------|
| 2025-11-18 | **2025-11-18T00:00:00.000Z** |
| 2025-11-18T03:00:00.000Z | **2025-11-18T03:00:00.000Z** |

**Transformation**: Add time component if missing

### Report Date (DATE)
**DHIS2 Field**: C-MDN_Form Completed by (Date) (QGS1ZOw97zV)  
**Type**: DATE

| CouchDB Format | DHIS2 Format |
|----------------|--------------|
| 1763552339536 (timestamp) | **2025-11-19** |

**Transformation**: Convert timestamp to YYYY-MM-DD

---

## Implementation

All transformations are implemented in `/src/config/field-mapping.js` using the `transform` parameter of the `addDataValue` helper function:

```javascript
addDataValue('fieldName', dataElementId, sourceObject, (val) => {
  // Transformation logic here
  return transformedValue;
});
```

## Why These Mappings Are Necessary

1. **Case Sensitivity**: DHIS2 option sets are case-sensitive
2. **Exact Matching**: Values must match exactly with defined options
3. **Form Design**: CHT forms use lowercase for simplicity
4. **Date Standards**: DHIS2 requires ISO 8601 format
5. **Validation**: Invalid values are rejected by DHIS2 with E1125 errors

## Service Status

✅ All value mappings applied  
✅ All 3 documents successfully synced  
✅ No validation errors  
✅ Service running and monitoring for new submissions  

---

**Last Updated**: November 19, 2025 @ 16:25 EAT
