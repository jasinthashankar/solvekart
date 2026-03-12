const { execSync } = require('child_process');
try {
  console.log("Running build...");
  const out = execSync('npx next build', { stdio: 'pipe', encoding: 'utf-8' });
  console.log("Success");
} catch (e) {
  console.log("Failed");
  require('fs').writeFileSync('build_err.txt', String(e.stdout) + '\n' + String(e.stderr));
}
