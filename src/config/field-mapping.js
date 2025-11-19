/**
 * Field mapping configuration
 * Maps death_review form fields to DHIS2 data elements
 * 
 * Update the dataElement IDs to match your DHIS2 configuration
 */

module.exports = {
  // DHIS2 Data Element Mappings - COMMUNITY MATERNAL DEATH NOTIFICATION (C-MDN) FORM
  mappings: {
    // Patient demographics
    'patient_age_in_years': 'SjKctl9bPGk',        // C-MDN_Age(Yrs)
    'date_of_death': 'nOBOcP6XxzQ',               // C-MDN_Date and time of Death
    
    // Maternal death specific
    'pregnant_at_death': 'J6aK3hgLN2q',           // C-MDN_Was the woman pregnant at the time of death?
    'gavida_pregnancy': 'rSPuQwsFMN1',            // C-MDN_Gravida
    'parity_pregnancy': 'kzoFlZlVU18',            // C-MDN_Parity
    'marriage_status_maternal': 'vr9N7az7jCT',    // C-MDN_Marital status?
    'educational_level_maternal': 'kdpNkAdLGwE',  // C-MDN_Education level
    'mother_occupation_maternal': 'hqP4OGUgLxu',  // C-MDN_Occupation?
    'weeks_pregnant': 'PTSRgVFkCDa',              // C-MDN_How many weeks pregnant?
    'days_since_childbirth': 'S8z0bxQaNqx',       // C-MDN_If not pregnant; how many days since childbirth...
    'hours_days_since': 'MvLTyFSCPgN',            // C-MDN_Hours / days since childbirth/abortion/ectopic pregnancy
    'nationality': 'QtP5E8twVr3',                 // C-MDN_Nationality
    
    // Location
    'chu_name': 'ZZ0TDz8rqes',                    // C-MDN_CHU Name
    'chu_code_disp': 'yXRsh8aPlbs',               // C-MDN_MCUL Code
    'household_name': 'zwYtA5MEuoS',              // C-MDN_Household No
    
    // Reporter
    'chv_name': 'XuUjeqMdP1z',                    // C-MDN_Form Completed by (Name)
    'chv_phone': 'wNIB1Wfqzvy',                   // C-MDN_Form Completed by (Telephone)
    'reporter_cadre': 'AjxNcaMDxdW',              // C-MDN_Form Completed by (Cadre)
    'report_date': 'QGS1ZOw97zV',                 // C-MDN_Form Completed by (Date)
  },

  /**
   * Transform function to map CouchDB document to DHIS2 event
   * @param {Object} doc - CouchDB document
   * @param {Object} config - DHIS2 configuration
   * @returns {Object} DHIS2 event object
   */
  transformToTrackerEvent(doc, config) {
    const fields = doc.fields || {};
    const reviewFields = fields.group_review || {};
    
    // Extract event date from death report and format as ISO datetime
    const deathDate = fields.date_of_death || new Date().toISOString();
    // Ensure full ISO 8601 format with timezone
    const eventDate = deathDate.includes('T') ? deathDate : `${deathDate}T00:00:00.000Z`;
    const occurredAt = eventDate;
    
    // Map data values
    const dataValues = [];
    
    // Helper function to add data value if field exists
    const addDataValue = (sourceField, dataElementId, sourceObject = fields, transform = null) => {
      let value = sourceObject[sourceField];
      if (value !== undefined && value !== null && value !== '') {
        // Apply transformation if provided
        if (transform) {
          value = transform(value);
        }
        dataValues.push({
          dataElement: dataElementId,
          value: String(value)
        });
      }
    };

    // Map demographic fields
    addDataValue('patient_age_in_years', this.mappings['patient_age_in_years']);
    // Date of death needs full ISO format
    addDataValue('date_of_death', this.mappings['date_of_death'], fields, (val) => {
      return val.includes('T') ? val : `${val}T00:00:00.000Z`;
    });
    
    // Map maternal death specific fields from review
    // Pregnant at death - capitalize Yes/No
    addDataValue('pregnant_at_death', this.mappings['pregnant_at_death'], reviewFields, (val) => {
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(); // yes -> Yes, no -> No
    });
    addDataValue('gavida_pregnancy', this.mappings['gavida_pregnancy'], reviewFields);
    addDataValue('parity_pregnancy', this.mappings['parity_pregnancy'], reviewFields);
    addDataValue('weeks_pregnant', this.mappings['weeks_pregnant'], reviewFields);
    addDataValue('days_since_childbirth', this.mappings['days_since_childbirth'], reviewFields);
    addDataValue('hours_days_since', this.mappings['hours_days_since'], reviewFields);
    // Marital status - capitalize first letter
    addDataValue('marriage_status_maternal', this.mappings['marriage_status_maternal'], reviewFields, (val) => {
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(); // single -> Single, married -> Married
    });
    // Education level needs mapping: "post-secondary" → "Higher than secondary"
    addDataValue('educational_level_maternal', this.mappings['educational_level_maternal'], reviewFields, (val) => {
      const educationMap = {
        'post-secondary': 'Higher than secondary',
        'none': 'None',
        'primary': 'Primary',
        'secondary': 'Secondary'
      };
      return educationMap[val.toLowerCase()] || val;
    });
    // Occupation - capitalize and map to DHIS2 options
    addDataValue('mother_occupation_maternal', this.mappings['mother_occupation_maternal'], reviewFields, (val) => {
      const occupationMap = {
        'employed': 'Employed',
        'self-employed': 'Self-employed',
        'not employed': 'Not employed',
        'unemployed': 'Not employed'
      };
      return occupationMap[val.toLowerCase()] || val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    });
    // Nationality - capitalize (Kenyan, Other)
    addDataValue('nationality', this.mappings['nationality'], reviewFields, (val) => {
      const nationalityMap = {
        'kenyan': 'Kenyan',
        'other': 'Other'
      };
      return nationalityMap[val.toLowerCase()] || 'Kenyan'; // Default to Kenyan if not specified
    });
    
    // Map location fields
    addDataValue('chu_name', this.mappings['chu_name']);
    addDataValue('chu_code_disp', this.mappings['chu_code_disp']);
    addDataValue('household_name', this.mappings['household_name']);
    
    // Map reporter fields
    addDataValue('chv_name', this.mappings['chv_name']);
    addDataValue('chv_phone', this.mappings['chv_phone']);
    
    // Add reporter cadre (default to CHA)
    if (this.mappings['reporter_cadre']) {
      dataValues.push({
        dataElement: this.mappings['reporter_cadre'],
        value: 'CHA'
      });
    }
    
    // Add report date (use document reported_date) - DATE format YYYY-MM-DD
    if (this.mappings['report_date'] && doc.reported_date) {
      const reportDate = new Date(doc.reported_date).toISOString().split('T')[0];
      dataValues.push({
        dataElement: this.mappings['report_date'],
        value: reportDate
      });
    }

    // Extract coordinates if available
    const coordinate = doc.geolocation ? {
      latitude: doc.geolocation.latitude,
      longitude: doc.geolocation.longitude
    } : undefined;

    // Use chu_tracker_id as the orgUnit if available, otherwise fall back to config
    const orgUnit = fields.chu_tracker_id || config.orgUnit;

    // Build DHIS2 event (don't specify event ID - let DHIS2 generate it)
    const event = {
      program: config.program,
      programStage: config.programStage,
      orgUnit: orgUnit,
      eventDate: eventDate,
      occurredAt: occurredAt,
      status: 'COMPLETED',
      storedBy: fields.chv_name || 'medic-integration',
      dataValues: dataValues
    };

    // Add coordinates if available
    if (coordinate && coordinate.latitude && coordinate.longitude) {
      event.coordinate = coordinate;
    }

    return event;
  }
};
