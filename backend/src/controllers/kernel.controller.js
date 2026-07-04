import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repository root:
// backend/src/controllers -> backend/src -> backend -> repository root
const repositoryRoot = path.resolve(__dirname, '..', '..', '..');

const kernelManifestPath = path.join(
  repositoryRoot,
  'kernel',
  'KERNEL-MANIFEST.json'
);

export function getKernelManifest(_request, response, next) {
  try {
    const manifest = JSON.parse(
      fs.readFileSync(kernelManifestPath, 'utf8')
    );

    response.status(200).json({
      ...manifest,
      discoveredAt: new Date().toISOString(),
      source: kernelManifestPath
    });
  } catch (error) {
    next(error);
  }
}
