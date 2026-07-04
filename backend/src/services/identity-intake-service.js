import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

import {
  mediaAssets,
  mediaExtractionRules,
  organizationIntakeRecords,
  organizationRepositoryLinks,
  profileIdentities,
  startupExperience
} from '../data/identity-intake.js';
import { dataDir, findRecordById, listRecords, readCollection, writeCollection } from './storage-service.js';

export const identityMediaDir = join(dataDir, 'repository', 'media');
export const organizationIntakeDir = join(dataDir, 'repository', 'organization-intake');

const maxRecommendedLocalFileSizeBytes = 8 * 1024 * 1024;
const textPreviewLimit = 1600;
const functionalAgentAvatars = {
  'EOS-AGENT-CODEX': { id: 'EOS-FUNCTION-AVATAR-CODEX', label: 'Engineering', marker: 'ENG' },
  'EOS-AGENT-ATHENA': { id: 'EOS-FUNCTION-AVATAR-ATHENA', label: 'Research', marker: 'RES' },
  'EOS-AGENT-HERMES': { id: 'EOS-FUNCTION-AVATAR-HERMES', label: 'Knowledge', marker: 'KNO' },
  'EOS-AGENT-ATLAS': { id: 'EOS-FUNCTION-AVATAR-ATLAS', label: 'Architecture', marker: 'ARC' },
  'EOS-AGENT-MERCURY': { id: 'EOS-FUNCTION-AVATAR-MERCURY', label: 'Opportunity', marker: 'OPP' },
  'EOS-AGENT-ARGUS': { id: 'EOS-FUNCTION-AVATAR-ARGUS', label: 'Operations', marker: 'OPS' },
  'EOS-AGENT-VULCAN': { id: 'EOS-FUNCTION-AVATAR-VULCAN', label: 'Quality', marker: 'QA' },
  'EOS-EXEC-CHATGPT': { id: 'EOS-FUNCTION-AVATAR-CHATGPT', label: 'Systems', marker: 'SYS' }
};

function nowIso() {
  return new Date().toISOString();
}

export function ensureIdentityRepositoryDirectories() {
  mkdirSync(identityMediaDir, { recursive: true });
  mkdirSync(organizationIntakeDir, { recursive: true });
}

function slugify(value) {
  return String(value ?? 'file')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'file';
}

function extensionFor(fileName, mimeType) {
  const extension = extname(fileName ?? '').replace('.', '').toLowerCase();

  if (extension) {
    return extension;
  }

  const mimeExtensionMap = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
    'application/json': 'json',
    'text/plain': 'txt',
    'text/markdown': 'md',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav'
  };

  return mimeExtensionMap[mimeType] ?? 'bin';
}

function classifyMedia(fileName, mimeType) {
  const extension = extensionFor(fileName, mimeType);

  if (mimeType?.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'].includes(extension)) {
    return 'Image';
  }

  if (mimeType?.startsWith('audio/') || ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'].includes(extension)) {
    return 'Audio';
  }

  if (mimeType?.startsWith('video/') || ['mp4', 'mov', 'webm', 'mkv'].includes(extension)) {
    return 'Video';
  }

  if (extension === 'pdf') {
    return 'PDF';
  }

  if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) {
    return 'Office Document';
  }

  if (['txt', 'md', 'csv', 'json', 'xml', 'html', 'log'].includes(extension) || mimeType?.startsWith('text/')) {
    return 'Text';
  }

  return 'Binary';
}

function parseDataUrl(dataUrl) {
  if (!dataUrl) {
    return null;
  }

  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64')
  };
}

function checksumFor(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function readableStringScan(buffer) {
  const decoded = buffer.toString('latin1');
  const fragments = decoded.match(/[A-Za-z0-9][A-Za-z0-9 ,.:;!?@#$%&()[\]{}'"+/_-]{5,}/g) ?? [];
  const cleaned = fragments
    .map((fragment) => fragment.replace(/\s+/g, ' ').trim())
    .filter((fragment) => fragment.length > 12 && !fragment.includes('stream'))
    .slice(0, 40);

  return cleaned.join(' ').slice(0, textPreviewLimit);
}

function textPreviewFor(buffer, fileName, mimeType) {
  const category = classifyMedia(fileName, mimeType);
  const extension = extensionFor(fileName, mimeType);

  if (category === 'Text') {
    const preview = buffer.toString('utf8').replace(/\s+/g, ' ').trim().slice(0, textPreviewLimit);
    const wordCount = preview ? preview.split(/\s+/).length : 0;

    return {
      extractionStatus: 'Extracted',
      extractionMethod: 'Plain text extraction',
      extractedTextPreview: preview,
      wordCount
    };
  }

  if (category === 'PDF') {
    const preview = readableStringScan(buffer);

    return {
      extractionStatus: preview ? 'Metadata + Readable String Scan' : 'Metadata Only',
      extractionMethod: 'PDF readable-string scan',
      extractedTextPreview: preview,
      wordCount: preview ? preview.split(/\s+/).length : 0
    };
  }

  if (category === 'Office Document') {
    const preview = readableStringScan(buffer);

    return {
      extractionStatus: preview ? 'Metadata + Office String Scan' : 'Metadata Only',
      extractionMethod: 'Office document readable-string scan',
      extractedTextPreview: preview,
      wordCount: preview ? preview.split(/\s+/).length : 0
    };
  }

  if (category === 'Audio' || category === 'Video') {
    return {
      extractionStatus: 'Media Metadata',
      extractionMethod: 'Media metadata foundation; transcription is a future capability',
      extractedTextPreview: '',
      wordCount: 0
    };
  }

  if (extension === 'bin') {
    return {
      extractionStatus: 'Metadata Only',
      extractionMethod: 'Binary metadata foundation',
      extractedTextPreview: '',
      wordCount: 0
    };
  }

  const preview = readableStringScan(buffer);

  return {
    extractionStatus: preview ? 'Metadata + Binary String Scan' : 'Metadata Only',
    extractionMethod: 'Generic readable-string scan',
    extractedTextPreview: preview,
    wordCount: preview ? preview.split(/\s+/).length : 0
  };
}

function sourceKeywords(fileName, preview) {
  const tokens = `${fileName ?? ''} ${preview ?? ''}`
    .toLowerCase()
    .match(/[a-z][a-z0-9-]{3,}/g) ?? [];
  const ignored = new Set(['file', 'document', 'organization', 'metadata', 'with', 'from', 'this', 'that']);

  return [...new Set(tokens.filter((token) => !ignored.has(token)))].slice(0, 12);
}

function appendRecord(collectionName, fallbackRecords, record, source) {
  const envelope = readCollection(collectionName, fallbackRecords, source);
  const records = [
    ...envelope.records.filter((existingRecord) => existingRecord.id !== record.id),
    record
  ];

  writeCollection(collectionName, records, `append:${collectionName}`);

  return record;
}

function normalizeProfileIdentity(profile) {
  const normalized = {
    profilePictureAssetId: '',
    profilePictureUrl: '',
    roleImageAssetId: '',
    roleImageUrl: '',
    companyLogoAssetId: profile.organizationLogoAssetId ?? profile.logoAssetId ?? '',
    companyLogoUrl: profile.logoUrl ?? '',
    builtInAvatar: null,
    ...profile
  };

  if (profile.ownerType !== 'Human Executive') {
    normalized.profilePictureAssetId = '';
    normalized.profilePictureUrl = '';
  }

  if (profile.ownerType === 'Agent' || profile.ownerType === 'AI Executive Advisor') {
    normalized.avatarAssetId = '';
    normalized.avatarUrl = '';
    normalized.roleImageAssetId = '';
    normalized.roleImageUrl = '';
    normalized.builtInAvatar = functionalAgentAvatars[profile.ownerId] ?? {
      id: `EOS-FUNCTION-AVATAR-${slugify(profile.ownerId).toUpperCase()}`,
      label: 'Function',
      marker: profile.fallbackInitials ?? 'AI'
    };
    normalized.externalRepositoryPolicy = 'Agents use built-in functional avatars. Organization logos are managed by the organization profile.';
    normalized.liveStatus = {
      ...normalized.liveStatus,
      summary: `${normalized.displayName} uses the ${normalized.builtInAvatar.label} functional avatar and references organization identity separately.`,
      recommendedAction: `Review ${normalized.displayName}'s functional avatar and manage organization logos on organization profiles.`,
      availableActions: ['Review Functional Avatar', 'Review Organization Logo', 'Link External Repository']
    };
  }

  if (profile.ownerType === 'Human Executive') {
    normalized.liveStatus = {
      ...normalized.liveStatus,
      summary: `${normalized.displayName} supports a human executive profile picture while organization logos remain organization-level identity.`,
      recommendedAction: `Upload ${normalized.displayName}'s approved profile picture when available.`,
      availableActions: ['Upload Profile Picture', 'Review Organization Logo', 'Link External Repository']
    };
  }

  return normalized;
}

function updateProfileMedia(record) {
  if (!record.ownerId || !['Avatar', 'Profile Image', 'Organization Logo', 'Company Logo', 'Role Image'].includes(record.usage)) {
    return;
  }

  const envelope = readCollection('profile-identities', profileIdentities, 'seed:profile-identities');
  const records = envelope.records.map((profile) => {
    if (profile.ownerId !== record.ownerId && profile.id !== record.ownerId) {
      return profile;
    }

    const mediaUrl = record.publicUrl || record.externalUrl || '';

    if ((record.usage === 'Avatar' || record.usage === 'Role Image') && (profile.ownerType === 'Agent' || profile.ownerType === 'AI Executive Advisor')) {
      return profile;
    }

    if (record.usage === 'Avatar') {
      return {
        ...profile,
        avatarAssetId: record.id,
        avatarUrl: mediaUrl
      };
    }

    if (record.usage === 'Profile Image') {
      if (profile.ownerType !== 'Human Executive') {
        return profile;
      }

      return {
        ...profile,
        profilePictureAssetId: record.id,
        profilePictureUrl: mediaUrl
      };
    }

    if (record.usage === 'Role Image') {
      return {
        ...profile,
        roleImageAssetId: record.id,
        roleImageUrl: mediaUrl
      };
    }

    return {
      ...profile,
      logoAssetId: record.id,
      organizationLogoAssetId: record.id,
      companyLogoAssetId: record.id,
      companyLogoUrl: mediaUrl,
      logoUrl: mediaUrl
    };
  });

  writeCollection('profile-identities', records, 'update:profile-identities');
}

function localFileRecord({ buffer, directory, fileName, mimeType, prefix }) {
  ensureIdentityRepositoryDirectories();
  const extension = extensionFor(fileName, mimeType);
  const safeName = `${prefix}_${Date.now()}_${slugify(basename(fileName ?? `upload.${extension}`))}`;
  const file = join(directory, safeName);

  writeFileSync(file, buffer);

  return {
    localPath: file.replace(`${dataDir}/`, 'data/'),
    publicUrl: directory === identityMediaDir ? `/media/${safeName}` : '',
    storedFileName: safeName
  };
}

export function listStartupExperience() {
  return listRecords('startup-experience', [startupExperience])[0] ?? startupExperience;
}

export function listProfileIdentities() {
  return listRecords('profile-identities', profileIdentities).map(normalizeProfileIdentity);
}

export function getProfileIdentityById(id) {
  const requestedId = String(id).toLowerCase();

  return (
    listProfileIdentities().find(
      (profile) => profile.id.toLowerCase() === requestedId || profile.ownerId.toLowerCase() === requestedId
    ) ?? null
  );
}

export function listMediaAssets() {
  return listRecords('media-assets', mediaAssets);
}

export function getMediaAssetById(id) {
  return findRecordById('media-assets', id, mediaAssets);
}

export function listOrganizationIntakeRecords() {
  return listRecords('organization-intake-records', organizationIntakeRecords);
}

export function getOrganizationIntakeRecordById(id) {
  return findRecordById('organization-intake-records', id, organizationIntakeRecords);
}

export function listRepositoryLinks() {
  return listRecords('organization-repository-links', organizationRepositoryLinks);
}

export function listMediaExtractionRules() {
  return listRecords('media-extraction-rules', mediaExtractionRules);
}

export function getIdentityMediaOverview() {
  return {
    capability: 'EOS-CAP-0031',
    mediaPolicy: {
      maxRecommendedLocalFileSizeBytes,
      localStorage: 'data/repository/media',
      externalRepositoryRequiredWhen:
        'Files exceed local best-practice size, must remain in a governed cloud drive, or represent large enterprise repositories.',
      supportedProfileMedia: ['PNG', 'JPEG', 'WebP', 'SVG'],
      supportedProfileUses: ['Avatar', 'Profile Image', 'Role Image', 'Company Logo', 'Organization Logo'],
      profilePicturePolicy: 'Human executives use profile pictures. Agents and AI executive advisors use built-in functional avatars. Organization logos are managed on organization profiles.',
      supportedOrganizationFiles: ['PDF', 'Word', 'PowerPoint', 'Excel', 'Text', 'CSV', 'JSON', 'Images', 'Audio', 'Video']
    },
    startupExperience: listStartupExperience(),
    profiles: listProfileIdentities(),
    mediaAssets: listMediaAssets(),
    repositoryLinks: listRepositoryLinks(),
    extractionRules: listMediaExtractionRules()
  };
}

export function createMediaAsset(payload = {}) {
  const parsedData = parseDataUrl(payload.dataUrl);
  const mimeType = payload.mimeType || parsedData?.mimeType || 'application/octet-stream';
  const fileName = payload.fileName || 'uploaded-media.bin';
  const category = classifyMedia(fileName, mimeType);
  const assetId = payload.id || `EOS-MEDIA-${randomUUID().slice(0, 8).toUpperCase()}`;
  const usage = payload.usage || 'Profile Image';
  const ownerType = payload.ownerType || 'Profile';
  const ownerId = payload.ownerId || 'EOS';
  const externalUrl = payload.externalUrl || payload.externalRepositoryUrl || '';

  let fileMetadata = {
    checksum: '',
    fileSizeBytes: 0,
    localPath: '',
    publicUrl: '',
    storageMode: externalUrl ? 'External Link' : 'Awaiting Upload',
    storedFileName: ''
  };
  let extraction = {
    extractionStatus: externalUrl ? 'External Link Metadata' : 'Pending Upload',
    extractionMethod: externalUrl ? 'External repository metadata' : 'Pending Upload',
    extractedTextPreview: '',
    wordCount: 0
  };

  if (parsedData?.buffer) {
    const fileSizeBytes = parsedData.buffer.byteLength;
    extraction = textPreviewFor(parsedData.buffer, fileName, mimeType);

    if (fileSizeBytes <= maxRecommendedLocalFileSizeBytes) {
      fileMetadata = {
        ...localFileRecord({
          buffer: parsedData.buffer,
          directory: identityMediaDir,
          fileName,
          mimeType,
          prefix: ownerId
        }),
        checksum: checksumFor(parsedData.buffer),
        fileSizeBytes,
        storageMode: 'Local EOS Repository'
      };
    } else {
      fileMetadata = {
        checksum: checksumFor(parsedData.buffer),
        fileSizeBytes,
        localPath: '',
        publicUrl: '',
        storedFileName: '',
        storageMode: externalUrl ? 'External Link' : 'External Repository Required'
      };
    }
  }

  const record = {
    id: assetId,
    ownerType,
    ownerId,
    usage,
    displayName: payload.displayName || fileName,
    originalFileName: fileName,
    mimeType,
    mediaCategory: category,
    storageMode: fileMetadata.storageMode,
    publicUrl: fileMetadata.publicUrl,
    externalUrl,
    localPath: fileMetadata.localPath,
    storedFileName: fileMetadata.storedFileName,
    checksum: fileMetadata.checksum,
    fileSizeBytes: fileMetadata.fileSizeBytes,
    extractionStatus: extraction.extractionStatus,
    extractionMethod: extraction.extractionMethod,
    extractedTextPreview: extraction.extractedTextPreview,
    usefulSignals: sourceKeywords(fileName, extraction.extractedTextPreview),
    createdAt: nowIso(),
    status: fileMetadata.storageMode === 'External Repository Required' ? 'External Repository Required' : 'Registered',
    liveStatus: {
      status: fileMetadata.storageMode === 'External Repository Required' ? 'Amber' : 'Green',
      operationalStatus: fileMetadata.storageMode === 'External Repository Required' ? 'Amber' : 'Green',
      lifecycleStatus: 'Defined',
      healthScore: fileMetadata.storageMode === 'External Repository Required' ? 72 : 90,
      progress: fileMetadata.storageMode === 'External Repository Required' ? 45 : 100,
      summary: `Media asset registered using ${fileMetadata.storageMode}.`,
      lastActivity: nowIso(),
      requiresAttention: fileMetadata.storageMode === 'External Repository Required',
      attentionLevel: fileMetadata.storageMode === 'External Repository Required' ? 'Low' : 'No Action Required',
      recommendedAction:
        fileMetadata.storageMode === 'External Repository Required'
          ? 'Add an external repository link for this media asset.'
          : 'Use this asset in approved profile or organization views.',
      availableActions: ['Open Media Asset', 'Review Extraction', 'Link To Profile']
    }
  };

  const createdRecord = appendRecord('media-assets', mediaAssets, record, 'seed:media-assets');
  updateProfileMedia(createdRecord);

  return createdRecord;
}

export function createRepositoryLink(payload = {}) {
  const record = {
    id: payload.id || `EOS-REPOSITORY-LINK-${randomUUID().slice(0, 8).toUpperCase()}`,
    name: payload.name || 'External Organization Repository',
    owner: payload.owner || 'Hermes',
    provider: payload.provider || 'External Cloud Drive',
    url: payload.url || payload.externalRepositoryUrl || '',
    status: payload.url || payload.externalRepositoryUrl ? 'Linked' : 'Pending URL',
    storagePolicy:
      payload.storagePolicy ||
      'Use this external repository when source data exceeds local storage best-practice size or must remain governed outside EOS.',
    supportedProviders: payload.supportedProviders || organizationRepositoryLinks[0].supportedProviders,
    maxRecommendedLocalFileSizeBytes,
    syncMode: 'Link Only',
    authenticationStatus: 'Not Attempted',
    lastValidated: nowIso(),
    liveStatus: {
      status: payload.url || payload.externalRepositoryUrl ? 'Blue' : 'Amber',
      operationalStatus: payload.url || payload.externalRepositoryUrl ? 'Blue' : 'Amber',
      lifecycleStatus: 'Defined',
      healthScore: payload.url || payload.externalRepositoryUrl ? 82 : 70,
      progress: payload.url || payload.externalRepositoryUrl ? 70 : 35,
      summary: 'External repository link registered for organization intake.',
      lastActivity: nowIso(),
      requiresAttention: !(payload.url || payload.externalRepositoryUrl),
      attentionLevel: payload.url || payload.externalRepositoryUrl ? 'No Action Required' : 'Low',
      recommendedAction: 'Validate repository access in a future cloud sync capability.',
      availableActions: ['Open Repository Link', 'Review Storage Policy']
    }
  };

  return appendRecord('organization-repository-links', organizationRepositoryLinks, record, 'seed:organization-repository-links');
}

export function createOrganizationIntakeRecord(payload = {}) {
  const parsedData = parseDataUrl(payload.dataUrl);
  const mimeType = payload.mimeType || parsedData?.mimeType || 'application/octet-stream';
  const fileName = payload.fileName || payload.sourceName || 'organization-source.bin';
  const externalRepositoryUrl = payload.externalRepositoryUrl || '';
  const organizationName = payload.organizationName || 'Pending Organization';
  const recordId = payload.id || `EOS-ORG-INTAKE-${randomUUID().slice(0, 8).toUpperCase()}`;
  const category = classifyMedia(fileName, mimeType);

  let localStorage = {
    checksum: '',
    fileSizeBytes: 0,
    localPath: '',
    storageMode: externalRepositoryUrl ? 'External Link' : 'Metadata Only'
  };
  let extraction = {
    extractionStatus: externalRepositoryUrl ? 'External Link Metadata' : 'Metadata Only',
    extractionMethod: externalRepositoryUrl ? 'External repository metadata' : 'No file content supplied',
    extractedTextPreview: '',
    wordCount: 0
  };

  if (parsedData?.buffer) {
    const fileSizeBytes = parsedData.buffer.byteLength;
    extraction = textPreviewFor(parsedData.buffer, fileName, mimeType);

    if (fileSizeBytes <= maxRecommendedLocalFileSizeBytes) {
      localStorage = {
        ...localFileRecord({
          buffer: parsedData.buffer,
          directory: organizationIntakeDir,
          fileName,
          mimeType,
          prefix: organizationName
        }),
        checksum: checksumFor(parsedData.buffer),
        fileSizeBytes,
        storageMode: 'Local EOS Repository'
      };
    } else {
      localStorage = {
        checksum: checksumFor(parsedData.buffer),
        fileSizeBytes,
        localPath: '',
        storageMode: externalRepositoryUrl ? 'External Link' : 'External Repository Required'
      };
    }
  }

  const linkedRepository = externalRepositoryUrl
    ? createRepositoryLink({
        name: `${organizationName} Source Repository`,
        provider: payload.externalRepositoryProvider || 'External Cloud Drive',
        url: externalRepositoryUrl,
        owner: 'Hermes'
      })
    : null;
  const usefulSignals = sourceKeywords(fileName, extraction.extractedTextPreview);

  const record = {
    id: recordId,
    organizationName,
    owner: payload.owner || 'Hermes',
    sourceType: payload.sourceType || category,
    sourceName: fileName,
    mimeType,
    fileCategory: category,
    repositoryMode: localStorage.storageMode,
    localPath: localStorage.localPath,
    externalRepositoryUrl,
    fileSizeBytes: localStorage.fileSizeBytes,
    checksum: localStorage.checksum,
    extractionStatus: extraction.extractionStatus,
    extractionMethod: extraction.extractionMethod,
    extractedTextPreview: extraction.extractedTextPreview,
    extractedSignals: usefulSignals,
    suggestedEnterpriseObjects: usefulSignals.slice(0, 5).map((signal) => `Candidate object: ${signal}`),
    suggestedKnowledgeObjects: usefulSignals.slice(0, 5).map((signal) => `Candidate knowledge asset: ${signal}`),
    linkedRepositoryId: linkedRepository?.id || payload.linkedRepositoryId || 'EOS-REPOSITORY-LINK-EXTERNAL-001',
    linkedEnterpriseObjects: payload.linkedEnterpriseObjects || ['EOS-ORGANIZATION-INTAKE', 'EOS-KIPR'],
    importedAt: nowIso(),
    status: localStorage.storageMode === 'External Repository Required' ? 'External Repository Required' : 'Imported',
    liveStatus: {
      status: localStorage.storageMode === 'External Repository Required' ? 'Amber' : 'Green',
      operationalStatus: localStorage.storageMode === 'External Repository Required' ? 'Amber' : 'Green',
      lifecycleStatus: 'Defined',
      healthScore: localStorage.storageMode === 'External Repository Required' ? 74 : 88,
      progress: localStorage.storageMode === 'External Repository Required' ? 48 : 100,
      summary: `Organization intake record created from ${category} source using ${localStorage.storageMode}.`,
      lastActivity: nowIso(),
      requiresAttention: localStorage.storageMode === 'External Repository Required',
      attentionLevel: localStorage.storageMode === 'External Repository Required' ? 'Low' : 'No Action Required',
      recommendedAction:
        localStorage.storageMode === 'External Repository Required'
          ? 'Link this source to an external cloud repository before full ingestion.'
          : 'Review extracted signals and map useful items into EOS repositories.',
      availableActions: ['Review Extracted Signals', 'Create Knowledge Object', 'Create Enterprise Object Candidate']
    }
  };

  return appendRecord(
    'organization-intake-records',
    organizationIntakeRecords,
    record,
    'seed:organization-intake-records'
  );
}

export function getOrganizationIntakeOverview() {
  const records = listOrganizationIntakeRecords();

  return {
    capability: 'EOS-CAP-0031',
    count: records.length,
    supportedFileCategories: mediaExtractionRules.map((rule) => rule.category),
    maxRecommendedLocalFileSizeBytes,
    externalRepositoryPolicy:
      'Store source files locally only when they are small and appropriate for EOS local storage. Link cloud drives for large repositories, governed source libraries, and rich media collections.',
    records,
    repositoryLinks: listRepositoryLinks(),
    extractionRules: listMediaExtractionRules()
  };
}
