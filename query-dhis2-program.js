#!/usr/bin/env node
/**
 * Query DHIS2 to examine the Verbal Autopsy program structure
 */

require('dotenv').config();
const axios = require('axios');
const https = require('https');

async function queryDHIS2Program() {
  const programId = 'ahx6MVXyFZZ'; // Verbal Autopsy program
  
  const axiosConfig = {
    baseURL: process.env.DHIS2_URL,
    auth: {
      username: process.env.DHIS2_USERNAME,
      password: process.env.DHIS2_PASSWORD
    },
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Handle DNS resolution issue for histracker.health.go.ke
  if (process.env.DHIS2_IP && process.env.DHIS2_URL.includes('histracker.health.go.ke')) {
    const dns = require('dns');
    
    axiosConfig.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
      lookup: (hostname, options, callback) => {
        if (hostname === 'histracker.health.go.ke') {
          callback(null, process.env.DHIS2_IP, 4);
        } else {
          dns.lookup(hostname, options, callback);
        }
      }
    });
  }

  const client = axios.create(axiosConfig);

  try {
    console.log('\n=== Querying DHIS2 Program Structure ===');
    console.log(`Program ID: ${programId}\n`);

    // Get program details with data elements
    const response = await client.get(
      `/api/programs/${programId}?fields=id,name,displayName,programType,programStages[id,name,displayName,programStageDataElements[id,compulsory,dataElement[id,name,displayName,code,valueType,optionSet[id,name,options[id,code,name]]]]]`
    );

    const program = response.data;
    
    console.log('='.repeat(80));
    console.log(`Program: ${program.displayName}`);
    console.log(`Type: ${program.programType}`);
    console.log('='.repeat(80));

    if (program.programStages && program.programStages.length > 0) {
      program.programStages.forEach((stage, stageIndex) => {
        console.log(`\n📋 Stage ${stageIndex + 1}: ${stage.displayName} (${stage.id})`);
        console.log('-'.repeat(80));

        if (stage.programStageDataElements && stage.programStageDataElements.length > 0) {
          console.log(`\n${'Field Name'.padEnd(50)} | ${'ID'.padEnd(15)} | ${'Type'.padEnd(12)} | Required`);
          console.log('='.repeat(100));

          stage.programStageDataElements.forEach((psde) => {
            const de = psde.dataElement;
            const required = psde.compulsory ? 'Yes' : 'No';
            console.log(`${de.displayName.padEnd(50)} | ${de.id.padEnd(15)} | ${de.valueType.padEnd(12)} | ${required}`);
            
            // Show option sets if available
            if (de.optionSet && de.optionSet.options) {
              console.log(`  Options: ${de.optionSet.options.map(o => `${o.code}:${o.name}`).join(', ')}`);
            }
          });

          console.log('\n' + '='.repeat(100));
          console.log(`Total Data Elements in Stage: ${stage.programStageDataElements.length}`);
        }
      });
    }

    console.log('\n✓ Query completed successfully\n');

  } catch (error) {
    console.error('\n❌ Error querying DHIS2:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.statusText}`);
      console.error(`Data:`, error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

queryDHIS2Program();
