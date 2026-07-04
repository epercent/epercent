import { useMemo, useRef, useState } from 'react'
import { resolveApiUrl } from '../services/api'

function formatBytes(value) {
  const bytes = Number(value)

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return 'Awaiting data'
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('File could not be read'))
    reader.readAsDataURL(file)
  })
}

function resolveMediaUrl(url) {
  if (!url) {
    return ''
  }

  if (/^https?:\/\//i.test(url)) {
    return url
  }

  return resolveApiUrl(url)
}

const fallbackFunctionalAvatars = {
  'EOS-AGENT-CODEX': { label: 'Engineering', marker: 'ENG' },
  'EOS-AGENT-ATHENA': { label: 'Research', marker: 'RES' },
  'EOS-AGENT-HERMES': { label: 'Knowledge', marker: 'KNO' },
  'EOS-AGENT-ATLAS': { label: 'Architecture', marker: 'ARC' },
  'EOS-AGENT-MERCURY': { label: 'Opportunity', marker: 'OPP' },
  'EOS-AGENT-ARGUS': { label: 'Operations', marker: 'OPS' },
  'EOS-AGENT-VULCAN': { label: 'Quality', marker: 'QA' },
  'EOS-EXEC-CHATGPT': { label: 'Systems', marker: 'SYS' }
}

function functionalAvatarFor(profile) {
  return profile.builtInAvatar ?? fallbackFunctionalAvatars[profile.ownerId] ?? {
    label: 'Function',
    marker: profile.fallbackInitials
  }
}

function ProfileIdentityCard({ onUpload, profile }) {
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState('')
  const profilePictureInputRef = useRef(null)
  const logoInputRef = useRef(null)
  const isHumanExecutive = profile.ownerType === 'Human Executive'
  const isFunctionalAgent = ['Agent', 'AI Executive Advisor'].includes(profile.ownerType)
  const isOrganizationProfile = profile.ownerType === 'Organization'
  const functionAvatar = functionalAvatarFor(profile)
  const organizationLogoId = profile.companyLogoAssetId || profile.organizationLogoAssetId || profile.logoAssetId
  const organizationLogoUrl = profile.companyLogoUrl || profile.logoUrl

  async function handleFileChange(event, usage) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setIsUploading(true)
    setMessage('')

    try {
      const dataUrl = await readFileAsDataUrl(file)
      await onUpload({
        dataUrl,
        displayName: `${profile.displayName} ${usage}`,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        ownerId: profile.ownerId,
        ownerType: profile.ownerType,
        usage
      })
      setMessage(`${usage} registered`)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <article className="identity-profile-card">
      <div className="identity-profile-summary">
        <span>{profile.ownerType}</span>
        <h3>{profile.displayName}</h3>
        <p>{profile.role}</p>
      </div>
      <div className="identity-media-stack">
        <div className="identity-media-preview">
          {isHumanExecutive ? (
            <div className="identity-profile-picture">
              {profile.profilePictureUrl ? (
                <img alt={`${profile.displayName} profile`} src={resolveMediaUrl(profile.profilePictureUrl)} />
              ) : (
                <span>Profile Picture</span>
              )}
            </div>
          ) : null}
          {isFunctionalAgent ? (
            <div className="identity-functional-avatar">
              <span>{functionAvatar.marker}</span>
              <small>{functionAvatar.label}</small>
            </div>
          ) : null}
          {isOrganizationProfile ? <div className="identity-organization-avatar">{profile.fallbackInitials}</div> : null}
        </div>
        <div className="identity-organization-logo">
          <span>Organization Logo</span>
          {organizationLogoUrl ? (
            <img alt={`${profile.displayName} organization logo`} src={resolveMediaUrl(organizationLogoUrl)} />
          ) : (
            <strong>{isOrganizationProfile ? profile.fallbackInitials : 'Logo'}</strong>
          )}
          <small>{organizationLogoId || 'Managed on organization profile'}</small>
        </div>
      </div>
      <div className="identity-upload-row">
        {isHumanExecutive ? (
          <div>
            <button disabled={isUploading} onClick={() => profilePictureInputRef.current?.click()} type="button">
              Upload Profile Picture
            </button>
            <input
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="identity-file-input"
              disabled={isUploading}
              onChange={(event) => handleFileChange(event, 'Profile Image')}
              ref={profilePictureInputRef}
              type="file"
            />
          </div>
        ) : null}
        {isOrganizationProfile ? (
          <div>
            <button disabled={isUploading} onClick={() => logoInputRef.current?.click()} type="button">
              Upload Company Logo
            </button>
            <input
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="identity-file-input"
              disabled={isUploading}
              onChange={(event) => handleFileChange(event, 'Company Logo')}
              ref={logoInputRef}
              type="file"
            />
          </div>
        ) : null}
        {!isHumanExecutive && !isOrganizationProfile ? (
          <div className="identity-readonly-note">
            Agent identity uses a built-in functional avatar. Organization logos are managed on organization profiles.
          </div>
        ) : null}
      </div>
      {message ? <small>{message}</small> : <small>{profile.liveStatus?.recommendedAction}</small>}
    </article>
  )
}

function StartupExperiencePanel({ startupData }) {
  const startup = startupData?.startupExperience

  return (
    <section className="identity-panel startup-panel">
      <div className="identity-panel-heading">
        <span>Startup Experience</span>
        <h2>{startup?.name ?? 'EOS Startup Experience'}</h2>
      </div>
      <p>
        Mission Control opens with an operating-system style boot sequence before entering{' '}
        {startup?.defaultWorkspace ?? 'enterprise-value'} / {startup?.defaultRoute ?? 'master-monitoring'}.
      </p>
      <ol className="startup-phase-list">
        {(startup?.bootPhases ?? []).map((phase, index) => (
          <li key={phase}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{phase}</strong>
          </li>
        ))}
      </ol>
    </section>
  )
}

function OrganizationImportPanel({ intakeData, onImport, onLinkRepository }) {
  const [organizationName, setOrganizationName] = useState('ePercent')
  const [externalRepositoryUrl, setExternalRepositoryUrl] = useState('')
  const [message, setMessage] = useState('')
  const maxLocalBytes = intakeData?.maxRecommendedLocalFileSizeBytes ?? 8 * 1024 * 1024

  async function handleImport(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setMessage('')

    try {
      const dataUrl = file.size <= maxLocalBytes ? await readFileAsDataUrl(file) : ''
      await onImport({
        dataUrl,
        externalRepositoryUrl,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        organizationName,
        sourceType: file.type || 'Local File'
      })
      setMessage(
        file.size > maxLocalBytes
          ? 'Large source registered. External repository link required or attached.'
          : 'Organization source imported and extracted.'
      )
    } catch (error) {
      setMessage(error.message)
    } finally {
      event.target.value = ''
    }
  }

  async function handleRepositorySubmit(event) {
    event.preventDefault()
    setMessage('')

    try {
      await onLinkRepository({
        name: `${organizationName} Source Repository`,
        provider: 'External Cloud Drive',
        url: externalRepositoryUrl
      })
      setMessage('External repository link registered')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <section className="identity-panel organization-intake-panel">
      <div className="identity-panel-heading">
        <span>Organization Intake</span>
        <h2>Import enterprise source material</h2>
      </div>
      <p>
        Supports PDF, Word, presentation, spreadsheet, text, image, audio, video, and externally linked cloud-drive
        repositories. EOS stores useful metadata, checksum, preview text where practical, and candidate repository
        signals.
      </p>
      <form className="organization-import-form" onSubmit={handleRepositorySubmit}>
        <label>
          <span>Organization</span>
          <input onChange={(event) => setOrganizationName(event.target.value)} value={organizationName} />
        </label>
        <label>
          <span>External repository link</span>
          <input
            onChange={(event) => setExternalRepositoryUrl(event.target.value)}
            placeholder="https://drive.example.com/folder"
            type="url"
            value={externalRepositoryUrl}
          />
        </label>
        <button type="submit">Register Repository Link</button>
      </form>
      <label className="organization-file-drop">
        <span>Import organization file</span>
        <input
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.csv,.json,.xml,.html,.png,.jpg,.jpeg,.webp,.svg,.mp3,.wav,.m4a,.aac,.flac,.ogg,.mp4,.mov,.webm"
          onChange={handleImport}
          type="file"
        />
        <strong>Local best-practice size: {formatBytes(maxLocalBytes)}</strong>
      </label>
      {message ? <small>{message}</small> : null}
    </section>
  )
}

function IntakeRecordsPanel({ records }) {
  return (
    <section className="identity-panel">
      <div className="identity-panel-heading">
        <span>Repository Records</span>
        <h2>Imported organization knowledge</h2>
      </div>
      <div className="intake-record-list">
        {records.map((record) => (
          <article key={record.id}>
            <span>{record.sourceType}</span>
            <h3>{record.sourceName}</h3>
            <p>{record.extractionStatus}</p>
            <dl>
              <div>
                <dt>Organization</dt>
                <dd>{record.organizationName}</dd>
              </div>
              <div>
                <dt>Repository</dt>
                <dd>{record.repositoryMode}</dd>
              </div>
              <div>
                <dt>Size</dt>
                <dd>{formatBytes(record.fileSizeBytes)}</dd>
              </div>
            </dl>
            <small>{record.extractedSignals?.length ? record.extractedSignals.join(', ') : 'Signals pending'}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

function RepositoryLinksPanel({ links }) {
  return (
    <section className="identity-panel">
      <div className="identity-panel-heading">
        <span>External Repositories</span>
        <h2>Cloud-drive link foundation</h2>
      </div>
      <div className="repository-link-list">
        {links.map((link) => (
          <article key={link.id}>
            <span>{link.provider}</span>
            <h3>{link.name}</h3>
            <p>{link.storagePolicy}</p>
            <strong>{link.url || 'Awaiting external URL'}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}

function IdentityIntakeView({
  identityMedia,
  intakeData,
  mode,
  onImportOrganizationSource,
  onLinkRepository,
  onUploadIdentityMedia,
  startupData
}) {
  const profiles = identityMedia?.profiles ?? []
  const mediaAssets = identityMedia?.mediaAssets ?? []
  const intakeRecords = intakeData?.records ?? []
  const repositoryLinks = useMemo(
    () => intakeData?.repositoryLinks ?? identityMedia?.repositoryLinks ?? [],
    [identityMedia?.repositoryLinks, intakeData?.repositoryLinks]
  )

  if (mode === 'startup-experience') {
    return <StartupExperiencePanel startupData={startupData} />
  }

  if (mode === 'organization-intake') {
    return (
      <section className="identity-intake-view">
        <OrganizationImportPanel
          intakeData={intakeData}
          onImport={onImportOrganizationSource}
          onLinkRepository={onLinkRepository}
        />
        <IntakeRecordsPanel records={intakeRecords} />
      </section>
    )
  }

  if (mode === 'repository-links') {
    return (
      <section className="identity-intake-view">
        <RepositoryLinksPanel links={repositoryLinks} />
      </section>
    )
  }

  return (
    <section className="identity-intake-view">
      <div className="identity-hero">
        <div>
          <span>Identity Media</span>
          <h2>Human profiles, agent function avatars, logos, and repositories</h2>
          <p>
            Human executives use profile pictures, agents use built-in functional avatars, and organization logos stay
            tied to the enterprise they represent. Uploads remain local unless a source should stay in a cloud drive.
          </p>
        </div>
        <dl>
          <div>
            <dt>Profiles</dt>
            <dd>{profiles.length}</dd>
          </div>
          <div>
            <dt>Media Assets</dt>
            <dd>{mediaAssets.length}</dd>
          </div>
          <div>
            <dt>Repositories</dt>
            <dd>{repositoryLinks.length}</dd>
          </div>
        </dl>
      </div>

      <div className="identity-profile-grid">
        {profiles.map((profile) => (
          <ProfileIdentityCard key={profile.id} onUpload={onUploadIdentityMedia} profile={profile} />
        ))}
      </div>

      <OrganizationImportPanel
        intakeData={intakeData}
        onImport={onImportOrganizationSource}
        onLinkRepository={onLinkRepository}
      />
      <IntakeRecordsPanel records={intakeRecords} />
      <RepositoryLinksPanel links={repositoryLinks} />
    </section>
  )
}

export default IdentityIntakeView
