const identityTimestamp = '2026-07-03T22:25:00.000Z';

function makeLiveStatus({
  status,
  lifecycleStatus,
  healthScore,
  progress,
  summary,
  requiresAttention,
  attentionLevel,
  recommendedAction,
  availableActions
}) {
  return {
    status,
    operationalStatus: status,
    lifecycleStatus,
    healthScore,
    progress,
    summary,
    lastActivity: identityTimestamp,
    requiresAttention,
    attentionLevel,
    recommendedAction,
    availableActions
  };
}

export const startupExperience = {
  id: 'EOS-STARTUP-EXPERIENCE',
  name: 'Welcome to EOS',
  owner: 'Codex',
  status: 'Operational Foundation',
  version: '0.23.0',
  defaultWorkspace: 'enterprise-value',
  defaultRoute: 'master-monitoring',
  theme: 'Preparing Enterprise Control',
  startupMode: 'Mission Control Boot',
  displayDurationMs: 7000,
  bootPhases: [
    'Initialize EOS Core API',
    'Load Enterprise Object Registry',
    'Load Digital Twin Asset Layer',
    'Load AI Workforce',
    'Load Knowledge Repository',
    'Open Enterprise Value'
  ],
  headlineMetrics: ['Enterprise Value', 'Digital Twin Assets', 'Platform Health', 'AI Workforce'],
  liveStatus: makeLiveStatus({
    status: 'Green',
    lifecycleStatus: 'Verified',
    healthScore: 92,
    progress: 100,
    summary: 'Mission Control startup experience is active and routes into Enterprise Value.',
    requiresAttention: false,
    attentionLevel: 'No Action Required',
    recommendedAction: 'Use startup experience as the standard EOS operating-system entry pattern.',
    availableActions: ['Open Mission Control', 'Review Startup Phases', 'Review Enterprise Value']
  })
};

export const profileIdentities = [
  {
    id: 'EOS-PROFILE-ERIC-OLO',
    ownerType: 'Human Executive',
    ownerId: 'EOS-EXEC-ERIC-OLO',
    displayName: 'Eric Olo',
    role: 'Founder, CEO & Chief Vision Architect',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EPERCENT-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EPERCENT-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'EO',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Use local media for profile images. Use external repository links for large media libraries.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 82,
      progress: 36,
      summary: 'Human executive profile supports a profile picture while organization logos remain organization-level identity.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Upload a CEO profile picture when an approved executive image is available.',
      availableActions: ['Upload Profile Picture', 'Review Organization Logo', 'Link External Repository']
    })
  },
  {
    id: 'EOS-PROFILE-CODEX',
    ownerType: 'Agent',
    ownerId: 'EOS-AGENT-CODEX',
    displayName: 'Codex',
    role: 'Chief Engineering Officer',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EOS-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EOS-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'C',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Agents use built-in functional avatars. Organization logos are managed by the organization profile.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 84,
      progress: 40,
      summary: 'Agent profile uses a built-in engineering avatar and references the current organization logo separately.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Keep Codex represented by the Engineering functional avatar and manage organization logos on organization profiles.',
      availableActions: ['Review Functional Avatar', 'Review Organization Logo', 'Link External Repository']
    })
  },
  {
    id: 'EOS-PROFILE-ATHENA',
    ownerType: 'Agent',
    ownerId: 'EOS-AGENT-ATHENA',
    displayName: 'Athena',
    role: 'Chief Research Officer',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EOS-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EOS-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'A',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Research profile media may link to external publication asset repositories.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 84,
      progress: 40,
      summary: 'Research agent profile uses a built-in research avatar and references the current organization logo separately.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Keep Athena represented by the Research functional avatar and manage publication assets through repositories.',
      availableActions: ['Review Functional Avatar', 'Review Organization Logo', 'Link Publication Repository']
    })
  },
  {
    id: 'EOS-PROFILE-HERMES',
    ownerType: 'Agent',
    ownerId: 'EOS-AGENT-HERMES',
    displayName: 'Hermes',
    role: 'Chief Knowledge Officer',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EOS-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EOS-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'H',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Knowledge profile media may link to external knowledge vault repositories.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 84,
      progress: 40,
      summary: 'Knowledge agent profile uses a built-in knowledge avatar and references the current organization logo separately.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Keep Hermes represented by the Knowledge functional avatar and manage knowledge assets through repositories.',
      availableActions: ['Review Functional Avatar', 'Review Organization Logo', 'Link Knowledge Repository']
    })
  },
  {
    id: 'EOS-PROFILE-ATLAS',
    ownerType: 'Agent',
    ownerId: 'EOS-AGENT-ATLAS',
    displayName: 'Atlas',
    role: 'Chief Enterprise Architect',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EOS-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EOS-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'A',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Architecture profile media may link to external architecture repositories.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 84,
      progress: 40,
      summary: 'Architecture agent profile uses a built-in architecture avatar and references the current organization logo separately.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Keep Atlas represented by the Architecture functional avatar and manage architecture assets through repositories.',
      availableActions: ['Review Functional Avatar', 'Review Organization Logo', 'Link Architecture Repository']
    })
  },
  {
    id: 'EOS-PROFILE-CHATGPT',
    ownerType: 'AI Executive Advisor',
    ownerId: 'EOS-EXEC-CHATGPT',
    displayName: 'ChatGPT',
    role: 'Chief Technology Officer & Chief Systems Architect',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EOS-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EOS-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'CTO',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Executive advisor profile media may link to approved brand and governance repositories.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 84,
      progress: 40,
      summary: 'CTO advisor profile uses a built-in systems avatar and references the current organization logo separately.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Keep the CTO advisor represented by the Systems functional avatar and manage governance assets through repositories.',
      availableActions: ['Review Functional Avatar', 'Review Organization Logo', 'Link Governance Repository']
    })
  },
  {
    id: 'EOS-PROFILE-MERCURY',
    ownerType: 'Agent',
    ownerId: 'EOS-AGENT-MERCURY',
    displayName: 'Mercury',
    role: 'Chief Opportunity Officer',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EOS-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EOS-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'M',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Opportunity profile media may link to market intelligence repositories.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 84,
      progress: 40,
      summary: 'Opportunity agent profile uses a built-in opportunity avatar and references the current organization logo separately.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Keep Mercury represented by the Opportunity functional avatar and manage market assets through repositories.',
      availableActions: ['Review Functional Avatar', 'Review Organization Logo', 'Link Opportunity Repository']
    })
  },
  {
    id: 'EOS-PROFILE-ARGUS',
    ownerType: 'Agent',
    ownerId: 'EOS-AGENT-ARGUS',
    displayName: 'Argus',
    role: 'Chief Operations Officer',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EOS-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EOS-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'AR',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Operations profile media may link to telemetry and platform operations repositories.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 84,
      progress: 40,
      summary: 'Operations agent profile uses a built-in operations avatar and references the current organization logo separately.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Keep Argus represented by the Operations functional avatar and manage operations assets through repositories.',
      availableActions: ['Review Functional Avatar', 'Review Organization Logo', 'Link Operations Repository']
    })
  },
  {
    id: 'EOS-PROFILE-VULCAN',
    ownerType: 'Agent',
    ownerId: 'EOS-AGENT-VULCAN',
    displayName: 'Vulcan',
    role: 'Chief Quality Officer',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EOS-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EOS-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'V',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Quality profile media may link to QA, security, performance, and compliance repositories.',
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 84,
      progress: 40,
      summary: 'Quality agent profile uses a built-in quality avatar and references the current organization logo separately.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Keep Vulcan represented by the Quality functional avatar and manage QA assets through repositories.',
      availableActions: ['Review Functional Avatar', 'Review Organization Logo', 'Link Quality Repository']
    })
  },
  {
    id: 'EOS-PROFILE-EPERCENT',
    ownerType: 'Organization',
    ownerId: 'DTA-EPERCENT-001',
    displayName: 'ePercent',
    role: 'Reference Enterprise',
    avatarAssetId: '',
    logoAssetId: 'EOS-MEDIA-EPERCENT-LOGO',
    organizationLogoAssetId: 'EOS-MEDIA-EPERCENT-LOGO',
    avatarUrl: '',
    logoUrl: '',
    fallbackInitials: 'EP',
    supportedMediaTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
    uploadEnabled: true,
    externalRepositoryPolicy: 'Large enterprise media and document libraries should be linked through external repository records.',
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'In Progress',
      healthScore: 78,
      progress: 32,
      summary: 'Organization profile supports company logo, media, and external repository links.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Add approved logo and link source organization repositories before full DTA onboarding.',
      availableActions: ['Upload Company Logo', 'Import Organization Files', 'Link External Drive']
    })
  }
];

export const mediaAssets = [
  {
    id: 'EOS-MEDIA-EOS-LOGO',
    ownerType: 'Platform',
    ownerId: 'EOS',
    usage: 'Platform Logo',
    displayName: 'EOS Platform Logo',
    originalFileName: 'Pending EOS logo upload',
    mimeType: 'image/svg+xml',
    mediaCategory: 'Image',
    storageMode: 'Awaiting Upload',
    publicUrl: '',
    externalUrl: '',
    checksum: '',
    fileSizeBytes: 0,
    extractionStatus: 'Pending Upload',
    extractedTextPreview: '',
    createdAt: identityTimestamp,
    status: 'Pending Asset',
    liveStatus: makeLiveStatus({
      status: 'Grey',
      lifecycleStatus: 'Not Started',
      healthScore: 70,
      progress: 10,
      summary: 'EOS platform logo slot is registered and ready for upload.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Upload approved EOS logo when available.',
      availableActions: ['Upload Logo', 'Link Brand Repository']
    })
  },
  {
    id: 'EOS-MEDIA-EPERCENT-LOGO',
    ownerType: 'Organization',
    ownerId: 'DTA-EPERCENT-001',
    usage: 'Organization Logo',
    displayName: 'ePercent Company Logo',
    originalFileName: 'Pending ePercent logo upload',
    mimeType: 'image/svg+xml',
    mediaCategory: 'Image',
    storageMode: 'Awaiting Upload',
    publicUrl: '',
    externalUrl: '',
    checksum: '',
    fileSizeBytes: 0,
    extractionStatus: 'Pending Upload',
    extractedTextPreview: '',
    createdAt: identityTimestamp,
    status: 'Pending Asset',
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Pending Assessment',
      healthScore: 68,
      progress: 10,
      summary: 'ePercent company logo slot is registered and ready for upload.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Upload approved ePercent logo or link an external brand repository.',
      availableActions: ['Upload Company Logo', 'Link Brand Repository']
    })
  }
];

export const organizationRepositoryLinks = [
  {
    id: 'EOS-REPOSITORY-LINK-EXTERNAL-001',
    name: 'External Cloud Repository Link',
    owner: 'Hermes',
    provider: 'External Cloud Drive',
    url: '',
    status: 'Configuration Ready',
    storagePolicy: 'Use external repository links when source data is too large for local EOS storage or must remain governed in a cloud drive.',
    supportedProviders: ['Google Drive', 'OneDrive', 'SharePoint', 'Dropbox', 'Box', 'S3-compatible storage', 'Network drive'],
    maxRecommendedLocalFileSizeBytes: 8388608,
    syncMode: 'Link Only',
    authenticationStatus: 'Not Configured',
    lastValidated: identityTimestamp,
    liveStatus: makeLiveStatus({
      status: 'Blue',
      lifecycleStatus: 'Defined',
      healthScore: 76,
      progress: 35,
      summary: 'External repository links are supported for large organization data sources.',
      requiresAttention: false,
      attentionLevel: 'No Action Required',
      recommendedAction: 'Add approved cloud repository links when importing large enterprise source libraries.',
      availableActions: ['Add Repository Link', 'Review Storage Policy']
    })
  }
];

export const mediaExtractionRules = [
  {
    id: 'EOS-EXTRACT-TEXT',
    category: 'Text',
    fileTypes: ['txt', 'md', 'csv', 'json', 'xml', 'html', 'log'],
    extractionMethod: 'Plain text extraction',
    usefulSignals: ['Text preview', 'word count', 'detected keywords', 'checksum', 'file size']
  },
  {
    id: 'EOS-EXTRACT-PDF',
    category: 'PDF',
    fileTypes: ['pdf'],
    extractionMethod: 'Metadata and readable-string scan',
    usefulSignals: ['File metadata', 'checksum', 'readable text fragments when present', 'source repository']
  },
  {
    id: 'EOS-EXTRACT-OFFICE',
    category: 'Office Document',
    fileTypes: ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'],
    extractionMethod: 'Metadata and readable-string scan until full Office parser is approved',
    usefulSignals: ['Document type', 'checksum', 'file size', 'readable text fragments when present']
  },
  {
    id: 'EOS-EXTRACT-AUDIO',
    category: 'Audio',
    fileTypes: ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'],
    extractionMethod: 'Media metadata foundation',
    usefulSignals: ['File type', 'checksum', 'file size', 'source repository', 'transcription pending']
  }
];

export const organizationIntakeRecords = [
  {
    id: 'EOS-ORG-INTAKE-EPERCENT-001',
    organizationName: 'ePercent',
    owner: 'Hermes',
    sourceType: 'Seed Record',
    sourceName: 'ePercent Reference Enterprise',
    acceptedFileTypes: [
      'PDF',
      'Word Document',
      'Presentation',
      'Spreadsheet',
      'Text',
      'Markdown',
      'JSON',
      'CSV',
      'Image',
      'Audio',
      'Video'
    ],
    repositoryMode: 'Local Metadata With External Link Support',
    extractionStatus: 'Foundation Ready',
    extractedSignals: [
      'File metadata',
      'Text preview where practical',
      'Checksum',
      'Source repository',
      'Suggested Enterprise Objects',
      'Suggested Knowledge Objects'
    ],
    linkedRepositoryId: 'EOS-REPOSITORY-LINK-EXTERNAL-001',
    linkedEnterpriseObjects: ['DTA-EPERCENT-001', 'EOS-ENTERPRISE-PROFILE', 'EOS-KIPR'],
    importedAt: identityTimestamp,
    status: 'Ready For Import',
    liveStatus: makeLiveStatus({
      status: 'Amber',
      lifecycleStatus: 'Defined',
      healthScore: 74,
      progress: 30,
      summary: 'Organization intake repository is ready for local files and external cloud-drive links.',
      requiresAttention: true,
      attentionLevel: 'Low',
      recommendedAction: 'Import initial organization documents and link large external repositories.',
      availableActions: ['Import Organization File', 'Link External Repository', 'Review Extracted Signals']
    })
  }
];
