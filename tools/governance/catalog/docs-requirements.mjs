export const DOC_ARTIFACT_TYPES = ['readme', 'architecture-doc', 'governance-doc', 'adr', 'site-doc'];

export function getRequiredDocsArtifacts(entry) {
  return entry.requiredDocsArtifacts.length > 0 ? entry.requiredDocsArtifacts : entry.docsArtifacts;
}

