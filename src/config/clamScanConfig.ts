export const ClamScanOption = {
  removeInfected: false, // Do not delete files automatically
  quarantineInfected: '~/quarantine', // Where to move infected files
  scanLog: '~/node-clam.log', // Log file path
  debugMode: false, // Disable debug in production
  scanRecursively: true, // Scan directories recursively
  clamscan: {
    path: 'C:/Program Files/ClamAV/clamscan.exe', // Local clamscan path
    active: false, // Disable local clamscan (since using Docker)
  },
  clamdscan: {
    path: 'C:/Program Files/ClamAV/clamdscan.exe', // Path to clamdscan
    timeout: 60000, // 60 seconds timeout
    localFallback: false, // Do not fallback to local clamscan
    multiscan: true, // Use multi-threaded scan
    active: true, // Enable clamdscan
  },
  preference: 'clamdscan', // Prefer daemon scan
};
