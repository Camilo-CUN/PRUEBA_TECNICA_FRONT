#!/usr/bin/env node
const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const targetpath = './src/environments/environments.ts';

const envFileContent = `
export const environment = {
  apiUrl: "${process.env['API_URL']}",
  apiUser: "${process.env['API_USER']}",
  apiPassword: "${process.env['API_PASSWORD']}",
  apiKeyGoogle: "${process.env['API_KEY_GOOGLE']}",
};
`;


mkdirSync('./src/environments', { recursive: true });

writeFileSync(targetpath, envFileContent);
