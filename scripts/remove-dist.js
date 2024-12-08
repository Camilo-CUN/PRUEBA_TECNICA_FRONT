const { existsSync } = require('fs');

if (process.platform === 'win32') {
    existsSync('DashboardApiMessages') && require('child_process').execSync('rmdir /s /q dashboard-Api-Messages');
} else {
   existsSync('DashboardApiMessagesr') && require('child_process').execSync('rm -rf dashboard-Api-Messages');
}
