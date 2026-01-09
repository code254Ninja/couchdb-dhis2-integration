/**
 * Field mapping configuration
 * Maps death_review form fields to DHIS2 data elements
 * 
 * Update the dataElement IDs to match your DHIS2 configuration
 */

module.exports = {
  // DHIS2 Program IDs
  programs: {
    deathReview: process.env.DHIS2_PROGRAM,
    verbalAutopsyMaternal: 'IOaRQKgCrPO',  // Community Maternal Death VA (age 10-49, female)
    verbalAutopsyPerinatal: 'ahx6MVXyFZZ'   // Community Perinatal Death VA (age 0-28 days)
  },

  // Program Stages
  programStages: {
    deathReview: process.env.DHIS2_PROGRAM_STAGE,
    verbalAutopsyMaternal: 'IPfyEeicVGF',
    verbalAutopsyPerinatal: 'YoEx0ooAE1t'
  },

  // DHIS2 Data Element Mappings - COMMUNITY MATERNAL DEATH NOTIFICATION (C-MDN) FORM (for death_review)
  deathReviewMappings: {
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

  // DHIS2 Data Element Mappings - VERBAL AUTOPSY FORM - MATERNAL DEATHS (for cha_verbal_autopsy, age 10-49, female)
  verbalAutopsyMaternalMappings: {
    // Patient demographics
    'patient_age_in_years': 'AQ24sebZ8xK',        // CMD_VA_Age
    'patient_sex': 'oindugucx72',                 // Sex (if available in program)
    'date_of_death': 'Y7OFyl3RzMQ',               // CMD_VA_Date of Death
    
    // Maternal death specific
    'pregnant_at_death': 'bEHudMSoYe4',           // CMD_VA_Pregnancy Status at Time of Death
    'gavida_pregnancy': 'ji8HDEVx2iJ',            // CMD_VA_Gravidity
    'parity_pregnancy': 'CRLtT68cYJT',            // CMD_VA_Parity
    'gestation_weeks': 'KiDX1FnNTS3',             // CMD_VA_Gestation in Weeks
    
    // Demographic details
    'marriage_status': 'nxvFhzPcVaa',             // CMD_VA_Marital Status
    'educational_level': 'VA8TKH5OmJK',           // CMD_VA_Education Level
    'mother_occupation': 'ftaMWMgKL6y',           // CMD_VA_Occupation
    
    // Death details
    'cause_of_death': 'uEUBjTpebqm',              // CMD_VA_Underlying Cause of Death
    'known_medical_condition': 'VK2h97Y92T0',     // CMD_VA_Pre-existing Medical Conditions
    'locality_of_death': 'heS2erZCL0u',           // CMD_VA_Locality where death occurred
    
    // ANC details
    'antenatal_care': 'POEY2X1URun',              // CMD_VA_Antenatal Care (ANC)
    'anc_visits': 'YkmbbpP35vb',                  // CMD_VA_Number of Visits
    
    // Delays and system factors
    'delay_decision': 'MEvPLYAE5QZ',              // CMD_VA_Delay 1: Delay in Decision to Seek Care
    'delay_transport': 'pcjhBNAtHel',             // CMD_VA_Delay 2: Delay in Reaching Health Facility
    'delay_care': 'x3caszCu8g8',                  // CMD_VA_Delay 3: Delay in Receiving Adequate Care
    
    // Review details
    'date_of_notification': 'Hh0stPd4efC',        // CMD_VA_Date of Notification
    'date_of_review': 'y1hk8MVEm0k',              // CMD_VA_Date of Review/Audit
    'avoidability_assessment': 'LCOg5lRok5H',     // CMD_VA_Avoidability Assessment
    'contributory_causes': 'JnK6hVpLukQ',         // CMD_VA_Contributory Causes
    'action_points': 'KAtmzRhfKEL',               // CMD_VA_Action Points
    'referral_status': 'KvNoZGhFuKJ',             // CMD_VA_Referral Status
    'responsible_officer': 'F0TLi2AZav9'          // CMD_VA_Responsible Officer
  },

  // DHIS2 Data Element Mappings - VERBAL AUTOPSY FORM - PERINATAL DEATHS (for cha_verbal_autopsy, age 0-28 days)
  verbalAutopsyPerinatalMappings: {
    // Baby demographics
    'patient_age_in_days': 'sjS6uLXOMns',         // CPD_VA_Gestational Age at Birth
    'patient_sex': 'vi2UOI0YiO5',                 // CPD_VA_Sex of the Baby
    'date_of_death': 'biB45XD1OZN',               // CPD_VA_Date and Time of Death
    'date_of_birth': 'qpxH4YGs116',               // CPD_VA_Date and Time of Birth
    
    // Birth details
    'birth_weight': 'c1yaH8qjFU0',                // CPD_VA_Birth Weight (in grams)
    'baby_outcome': 'LEEbAN0kGDG',                // CPD_VA_Baby Outcome
    'gestational_age': 'sjS6uLXOMns',             // CPD_VA_Gestational Age at Birth
    'baby_cry_at_birth': 'yw5mmmxaKBr',           // CPD_VA_If Alive, did the baby cry immediately after birth?
    
    // Perinatal death details
    'perinatal_cause_of_death': 'bGxHWTtM8zS',    // CPD_VA_Perinatal Cause of Death
    'perinatal_cause_icd': 'nIu4WVgfcJd',         // CPD_VA_Perinatal Cause of Death (ICD-PM)
    'underlying_cause': 'smpi9MUMLtg',            // CPD_VA_Underlying Cause of Death
    'period_of_death': 'C5utD785YzD',             // CPD_VA_Period of death
    
    // Maternal details
    'mother_age': 'veCDUUkhd0X',                  // CPD_VA_Mother's Age
    'parity': 'WsYtafZTZ37',                      // CPD_VA_Parity
    'maternal_conditions': 't3PFzQYeIKd',         // CPD_VA_Maternal Conditions during this Pregnancy
    'obstetric_history': 'x9uDFgDTNqm',           // CPD_VA_Obstetric History
    'medical_history': 'nJjGbYH9rFE',             // CPD_VA_Medical History
    
    // ANC details
    'anc_attendance': 'Bgd6xRgbHcX',              // CPD_VA_Antenatal Care (ANC) Attendance
    'anc_visits': 'EndFwvFZEmr',                  // CPD_VA_Number of Visits
    
    // Delays
    'delay_1': 'LUHTXgULnxq',                     // CPD_VA_Delay 1
    'delay_2': 'cAioxIHkRWw',                     // CPD_VA_Delay 2
    'delay_3': 'jXkqkrSlD3Y',                     // CPD_VA_Delay 3
    
    // Review details
    'avoidability_assessment': 'FUtdjOrL99A',     // CPD_VA_Avoidability Assessment
    'action_points': 'HjJOfoeYwLK',               // CPD_VA_Action Points
    'responsible_person': 'D6tsw78Gm8O'           // CPD_VA_Responsible Person
  },

  /**
   * Transform function to map CouchDB document to DHIS2 event
   * Routes to appropriate transformer based on form type
   * @param {Object} doc - CouchDB document
   * @param {Object} config - DHIS2 configuration
   * @returns {Object} DHIS2 event object or null
   */
  transformToTrackerEvent(doc, config) {
    if (doc.form === 'death_review') {
      return this._transformDeathReview(doc, config);
    } else if (doc.form === 'cha_verbal_autopsy') {
      return this._transformVerbalAutopsy(doc, config);
    }
    return null;
  },

  /**
   * Transform death_review document to DHIS2 event
   * @private
   */
  _transformDeathReview(doc, config) {
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
    addDataValue('patient_age_in_years', this.deathReviewMappings['patient_age_in_years']);
    // Date of death needs full ISO format
    addDataValue('date_of_death', this.deathReviewMappings['date_of_death'], fields, (val) => {
      return val.includes('T') ? val : `${val}T00:00:00.000Z`;
    });
    
    // Map maternal death specific fields from review
    // Pregnant at death - capitalize Yes/No
    addDataValue('pregnant_at_death', this.deathReviewMappings['pregnant_at_death'], reviewFields, (val) => {
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(); // yes -> Yes, no -> No
    });
    addDataValue('gavida_pregnancy', this.deathReviewMappings['gavida_pregnancy'], reviewFields);
    addDataValue('parity_pregnancy', this.deathReviewMappings['parity_pregnancy'], reviewFields);
    addDataValue('weeks_pregnant', this.deathReviewMappings['weeks_pregnant'], reviewFields);
    addDataValue('days_since_childbirth', this.deathReviewMappings['days_since_childbirth'], reviewFields);
    addDataValue('hours_days_since', this.deathReviewMappings['hours_days_since'], reviewFields);
    // Marital status - capitalize first letter
    addDataValue('marriage_status_maternal', this.deathReviewMappings['marriage_status_maternal'], reviewFields, (val) => {
      return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase(); // single -> Single, married -> Married
    });
    // Education level needs mapping: "post-secondary" → "Higher than secondary"
    addDataValue('educational_level_maternal', this.deathReviewMappings['educational_level_maternal'], reviewFields, (val) => {
      const educationMap = {
        'post-secondary': 'Higher than secondary',
        'none': 'None',
        'primary': 'Primary',
        'secondary': 'Secondary'
      };
      return educationMap[val.toLowerCase()] || val;
    });
    // Occupation - capitalize and map to DHIS2 options
    addDataValue('mother_occupation_maternal', this.deathReviewMappings['mother_occupation_maternal'], reviewFields, (val) => {
      const occupationMap = {
        'employed': 'Employed',
        'self-employed': 'Self-employed',
        'not employed': 'Not employed',
        'unemployed': 'Not employed'
      };
      return occupationMap[val.toLowerCase()] || val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    });
    // Nationality - capitalize (Kenyan, Other)
    addDataValue('nationality', this.deathReviewMappings['nationality'], reviewFields, (val) => {
      const nationalityMap = {
        'kenyan': 'Kenyan',
        'other': 'Other'
      };
      return nationalityMap[val.toLowerCase()] || 'Kenyan'; // Default to Kenyan if not specified
    });
    
    // Map location fields
    addDataValue('chu_name', this.deathReviewMappings['chu_name']);
    addDataValue('chu_code_disp', this.deathReviewMappings['chu_code_disp']);
    addDataValue('household_name', this.deathReviewMappings['household_name']);
    
    // Map reporter fields
    addDataValue('chv_name', this.deathReviewMappings['chv_name']);
    addDataValue('chv_phone', this.deathReviewMappings['chv_phone']);
    
    // Add reporter cadre (default to CHA)
    if (this.deathReviewMappings['reporter_cadre']) {
      dataValues.push({
        dataElement: this.deathReviewMappings['reporter_cadre'],
        value: 'CHA'
      });
    }
    
    // Add report date (use document reported_date) - DATE format YYYY-MM-DD
    if (this.deathReviewMappings['report_date'] && doc.reported_date) {
      const reportDate = new Date(doc.reported_date).toISOString().split('T')[0];
      dataValues.push({
        dataElement: this.deathReviewMappings['report_date'],
        value: reportDate
      });
    }

    // Extract coordinates if available
    const coordinate = doc.geolocation ? {
      latitude: doc.geolocation.latitude,
      longitude: doc.geolocation.longitude
    } : undefined;

    // Use chu_code_disp as the orgUnit code, otherwise fall back to config
    const orgUnit = fields.chu_code_disp || config.orgUnit;

    // Build DHIS2 event (don't specify event ID - let DHIS2 generate it)
    const event = {
      program: this.programs.deathReview,
      programStage: this.programStages.deathReview,
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
  },

  /**
   * Transform cha_verbal_autopsy document to DHIS2 event(s)
   * Routes to maternal or perinatal program based on age and sex
   * @private
   */
  _transformVerbalAutopsy(doc, config) {
    const fields = doc.fields || {};
    const events = [];
    
    // Extract age and sex
    const ageYears = parseInt(fields.patient_age_in_years) || 0;
    const ageMonths = parseInt(fields.patient_age_in_months) || 0;
    const ageDays = parseInt(fields.patient_age_in_days) || 0;
    const sex = (fields.patient_sex || '').toLowerCase();
    
    // Calculate total age in days
    const totalAgeDays = (ageYears * 365) + (ageMonths * 30) + ageDays;
    
    // Determine which program(s) to use
    const isMaternalAge = ageYears >= 10 && ageYears <= 49;
    const isFemale = sex === 'female' || sex === 'f';
    const isPerinatalAge = totalAgeDays <= 28;
    
    // Route to Maternal Death VA (age 10-49, female)
    if (isMaternalAge && isFemale) {
      const maternalEvent = this._transformVerbalAutopsyMaternal(doc, config);
      if (maternalEvent) {
        events.push(maternalEvent);
      }
    }
    
    // Route to Perinatal Death VA (age 0-28 days)
    if (isPerinatalAge) {
      const perinatalEvent = this._transformVerbalAutopsyPerinatal(doc, config);
      if (perinatalEvent) {
        events.push(perinatalEvent);
      }
    }
    
    // Return events or null if no criteria matched
    if (events.length === 0) {
      console.log(`Skipping verbal autopsy ${doc._id}: Does not meet criteria (Age: ${ageYears}y ${ageMonths}m ${ageDays}d, Sex: ${sex})`);
      return null;
    }
    
    // Return single event or array of events
    return events.length === 1 ? events[0] : events;
  },
  
  /**
   * Transform cha_verbal_autopsy for MATERNAL deaths (age 10-49, female)
   * @private
   */
  _transformVerbalAutopsyMaternal(doc, config) {
    const fields = doc.fields || {};
    
    // Extract event date
    const deathDate = fields.date_of_death || doc.reported_date || new Date().toISOString();
    const eventDate = deathDate.includes('T') ? deathDate : `${deathDate}T00:00:00.000Z`;
    const occurredAt = eventDate;
    
    const dataValues = [];
    
    // Helper function to add data value
    const addDataValue = (sourceField, dataElementId, sourceObject = fields, transform = null) => {
      let value = sourceObject[sourceField];
      if (value !== undefined && value !== null && value !== '') {
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
    addDataValue('patient_age_in_years', this.verbalAutopsyMaternalMappings['patient_age_in_years']);
    addDataValue('patient_sex', this.verbalAutopsyMaternalMappings['patient_sex'], fields, (val) => 
      val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : '');
    
    // Map date of death
    addDataValue('date_of_death', this.verbalAutopsyMaternalMappings['date_of_death'], fields, (val) => 
      val && val.includes('T') ? val : `${val || eventDate}T00:00:00.000Z`);
    
    // Map maternal death specific fields
    addDataValue('pregnant_at_death', this.verbalAutopsyMaternalMappings['pregnant_at_death'], fields, (val) => 
      val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : '');
    addDataValue('gavida_pregnancy', this.verbalAutopsyMaternalMappings['gavida_pregnancy']);
    addDataValue('parity_pregnancy', this.verbalAutopsyMaternalMappings['parity_pregnancy']);
    
    // Map demographic details
    addDataValue('marriage_status', this.verbalAutopsyMaternalMappings['marriage_status'], fields, (val) => 
      val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : '');
    
    addDataValue('educational_level', this.verbalAutopsyMaternalMappings['educational_level'], fields, (val) => {
      if (!val) return '';
      const educationMap = {
        'post-secondary': 'Higher than secondary',
        'none': 'None',
        'primary': 'Primary',
        'secondary': 'Secondary'
      };
      return educationMap[val.toLowerCase()] || val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    });
    
    addDataValue('mother_occupation', this.verbalAutopsyMaternalMappings['mother_occupation'], fields, (val) => {
      if (!val) return '';
      const occupationMap = {
        'employed': 'Employed',
        'self-employed': 'Self-employed',
        'not employed': 'Not employed',
        'unemployed': 'Not employed',
        'self employed': 'Self-employed'
      };
      return occupationMap[val.toLowerCase()] || 
             val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
    });
    
    // Map death details
    addDataValue('cause_of_death', this.verbalAutopsyMaternalMappings['cause_of_death']);
    addDataValue('possible_cause_of_death', this.verbalAutopsyMaternalMappings['cause_of_death']); // Use same field
    addDataValue('known_medical_condition', this.verbalAutopsyMaternalMappings['known_medical_condition']);
    
    // Add notification date (use reported_date)
    if (doc.reported_date) {
      const notificationDate = new Date(doc.reported_date).toISOString();
      dataValues.push({
        dataElement: this.verbalAutopsyMaternalMappings['date_of_notification'],
        value: notificationDate
      });
    }
    
    // Extract coordinates if available
    const coordinate = doc.geolocation && doc.geolocation.latitude ? {
      latitude: doc.geolocation.latitude,
      longitude: doc.geolocation.longitude
    } : undefined;

    // Use chu_code_disp as the orgUnit code, otherwise fall back to config
    const orgUnit = fields.chu_code_disp || config.orgUnit;

    // Build and return DHIS2 event for maternal death
    const event = {
      program: this.programs.verbalAutopsyMaternal,
      programStage: this.programStages.verbalAutopsyMaternal,
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
  },
  
  /**
   * Transform cha_verbal_autopsy for PERINATAL deaths (age 0-28 days)
   * @private
   */
  _transformVerbalAutopsyPerinatal(doc, config) {
    const fields = doc.fields || {};
    
    // Extract event date
    const deathDate = fields.date_of_death || doc.reported_date || new Date().toISOString();
    const eventDate = deathDate.includes('T') ? deathDate : `${deathDate}T00:00:00.000Z`;
    const occurredAt = eventDate;
    
    const dataValues = [];
    
    // Helper function to add data value
    const addDataValue = (sourceField, dataElementId, sourceObject = fields, transform = null) => {
      let value = sourceObject[sourceField];
      if (value !== undefined && value !== null && value !== '') {
        if (transform) {
          value = transform(value);
        }
        dataValues.push({
          dataElement: dataElementId,
          value: String(value)
        });
      }
    };

    // Map baby demographics
    addDataValue('patient_age_in_days', this.verbalAutopsyPerinatalMappings['patient_age_in_days']);
    addDataValue('patient_sex', this.verbalAutopsyPerinatalMappings['patient_sex'], fields, (val) => 
      val ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase() : '');
    
    // Map dates
    addDataValue('date_of_death', this.verbalAutopsyPerinatalMappings['date_of_death'], fields, (val) => 
      val && val.includes('T') ? val : `${val || eventDate}T00:00:00.000Z`);
    
    // Map death details
    addDataValue('cause_of_death', this.verbalAutopsyPerinatalMappings['perinatal_cause_of_death']);
    addDataValue('possible_cause_of_death', this.verbalAutopsyPerinatalMappings['perinatal_cause_of_death']);
    addDataValue('known_medical_condition', this.verbalAutopsyPerinatalMappings['medical_history']);
    
    // Map maternal details if available
    if (fields.patient_age_in_years) {
      // Use mother's age from the main patient age field if this is about the mother
      addDataValue('patient_age_in_years', this.verbalAutopsyPerinatalMappings['mother_age']);
    }
    addDataValue('parity_pregnancy', this.verbalAutopsyPerinatalMappings['parity']);
    addDataValue('gavida_pregnancy', this.verbalAutopsyPerinatalMappings['parity']); // Use parity as fallback
    
    // Extract coordinates if available
    const coordinate = doc.geolocation && doc.geolocation.latitude ? {
      latitude: doc.geolocation.latitude,
      longitude: doc.geolocation.longitude
    } : undefined;

    // Use chu_code_disp as the orgUnit code, otherwise fall back to config
    const orgUnit = fields.chu_code_disp || config.orgUnit;

    // Build and return DHIS2 event for perinatal death
    const event = {
      program: this.programs.verbalAutopsyPerinatal,
      programStage: this.programStages.verbalAutopsyPerinatal,
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
