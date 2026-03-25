import { execSync } from 'child_process';

function globalSetup() {
  try {
    execSync('npm run db:clear -w @rs-tandem/backend', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to clear database:', error);
    throw error;
  }
}

export default globalSetup;
