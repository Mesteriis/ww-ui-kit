import ts from 'typescript';

import { fileExists, readText } from './workspace.mjs';

function hasExportModifier(node) {
  return Boolean(node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword));
}

function collectBindingNames(name, exportNames) {
  if (ts.isIdentifier(name)) {
    exportNames.add(name.text);
    return;
  }

  for (const element of name.elements) {
    if (ts.isOmittedExpression(element)) {
      continue;
    }

    collectBindingNames(element.name, exportNames);
  }
}

export function splitManifestExportName(exportName) {
  return exportName
    .split(' / ')
    .map((token) => token.trim())
    .filter(Boolean);
}

export function isLikelyVisualRuntimeExport(exportName) {
  return (
    /^Ui[A-Z]/.test(exportName) || /^Primitive[A-Z]/.test(exportName) || /Widget$/.test(exportName)
  );
}

export function collectNamedRuntimeExports(relativePath) {
  if (!fileExists(relativePath)) {
    return [];
  }

  const sourceFile = ts.createSourceFile(
    relativePath,
    readText(relativePath),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
  const exportNames = new Set();

  for (const statement of sourceFile.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (statement.isTypeOnly) {
        continue;
      }

      if (!statement.exportClause) {
        continue;
      }

      if (ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          if (!element.isTypeOnly) {
            exportNames.add(element.name.text);
          }
        }
        continue;
      }

      exportNames.add(statement.exportClause.name.text);
      continue;
    }

    if (!hasExportModifier(statement)) {
      continue;
    }

    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        collectBindingNames(declaration.name, exportNames);
      }
      continue;
    }

    if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isEnumDeclaration(statement) ||
        ts.isModuleDeclaration(statement)) &&
      statement.name &&
      ts.isIdentifier(statement.name)
    ) {
      exportNames.add(statement.name.text);
    }
  }

  return [...exportNames].sort();
}

export function collectCoveredRuntimeExports(surfaceEntries) {
  const coveredExports = new Set();

  for (const entry of surfaceEntries) {
    for (const exportName of splitManifestExportName(entry.exportName)) {
      coveredExports.add(exportName);
    }

    for (const exportName of entry.coveredExports ?? []) {
      coveredExports.add(exportName);
    }
  }

  return coveredExports;
}

export function auditRuntimeExportCoverage(packageEntry, surfaceEntries) {
  const indexPath = `${packageEntry.physicalPath}/src/index.ts`;
  const runtimeExports = collectNamedRuntimeExports(indexPath);
  const coveredExports = collectCoveredRuntimeExports(surfaceEntries);
  const missingExports = runtimeExports.filter((exportName) => !coveredExports.has(exportName));
  const orphanedCoveredExports = [
    ...new Set(surfaceEntries.flatMap((entry) => entry.coveredExports ?? [])),
  ]
    .filter((exportName) => !runtimeExports.includes(exportName))
    .sort();

  return {
    indexPath,
    runtimeExports,
    coveredExports,
    missingExports,
    orphanedCoveredExports,
  };
}
