import { PACKAGE_CLASSIFICATION } from '../catalog/package-classification.mjs';
import { directoryExists, fileExists, readJson } from '../shared/workspace.mjs';

for (const packageEntry of PACKAGE_CLASSIFICATION) {
  if (!directoryExists(packageEntry.physicalPath)) {
    throw new Error(`Classified package path "${packageEntry.physicalPath}" does not exist.`);
  }

  const packageJsonPath = `${packageEntry.physicalPath}/package.json`;
  if (!fileExists(packageJsonPath)) {
    throw new Error(`Package "${packageEntry.packageName}" is missing ${packageJsonPath}.`);
  }

  const packageJson = readJson(packageJsonPath);
  if (packageJson.name !== packageEntry.packageName) {
    throw new Error(
      `Package "${packageEntry.packageName}" has mismatched package.json name "${packageJson.name}".`
    );
  }

  const isUnderThirdParty = packageEntry.physicalPath.startsWith('packages/third-party/');
  if (packageEntry.packageLayer === 'third-party-adapter' && !isUnderThirdParty) {
    throw new Error(
      `Third-party adapter "${packageEntry.packageName}" must live under packages/third-party/.`
    );
  }

  if (packageEntry.packageLayer !== 'third-party-adapter' && isUnderThirdParty) {
    throw new Error(
      `Package "${packageEntry.packageName}" lives under packages/third-party/ but is classified as "${packageEntry.packageLayer}".`
    );
  }
}

console.log('Package topology OK.');
