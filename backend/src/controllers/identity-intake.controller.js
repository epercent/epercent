import {
  createMediaAsset,
  createOrganizationIntakeRecord,
  createRepositoryLink,
  getIdentityMediaOverview,
  getMediaAssetById,
  getOrganizationIntakeOverview,
  getOrganizationIntakeRecordById,
  getProfileIdentityById,
  listMediaAssets,
  listProfileIdentities,
  listRepositoryLinks,
  listStartupExperience
} from '../services/identity-intake-service.js';

export function getStartupExperience(_request, response) {
  response.status(200).json({
    capability: 'EOS-CAP-0031',
    startupExperience: listStartupExperience()
  });
}

export function getIdentityMedia(_request, response) {
  response.status(200).json(getIdentityMediaOverview());
}

export function listProfiles(_request, response) {
  const profiles = listProfileIdentities();

  response.status(200).json({
    capability: 'EOS-CAP-0031',
    count: profiles.length,
    profiles
  });
}

export function getProfile(request, response) {
  const profile = getProfileIdentityById(request.params.id);

  if (!profile) {
    return response.status(404).json({
      error: 'Profile identity not found',
      id: request.params.id
    });
  }

  return response.status(200).json(profile);
}

export function listAssets(_request, response) {
  const assets = listMediaAssets();

  response.status(200).json({
    capability: 'EOS-CAP-0031',
    count: assets.length,
    assets
  });
}

export function getAsset(request, response) {
  const asset = getMediaAssetById(request.params.id);

  if (!asset) {
    return response.status(404).json({
      error: 'Media asset not found',
      id: request.params.id
    });
  }

  return response.status(200).json(asset);
}

export function uploadMediaAsset(request, response) {
  const asset = createMediaAsset(request.body);

  response.status(201).json({
    capability: 'EOS-CAP-0031',
    asset
  });
}

export function getOrganizationIntake(_request, response) {
  response.status(200).json(getOrganizationIntakeOverview());
}

export function getOrganizationIntakeRecord(request, response) {
  const record = getOrganizationIntakeRecordById(request.params.id);

  if (!record) {
    return response.status(404).json({
      error: 'Organization intake record not found',
      id: request.params.id
    });
  }

  return response.status(200).json(record);
}

export function importOrganizationSource(request, response) {
  const record = createOrganizationIntakeRecord(request.body);

  response.status(201).json({
    capability: 'EOS-CAP-0031',
    record
  });
}

export function getRepositoryLinks(_request, response) {
  const links = listRepositoryLinks();

  response.status(200).json({
    capability: 'EOS-CAP-0031',
    count: links.length,
    links
  });
}

export function createExternalRepositoryLink(request, response) {
  const link = createRepositoryLink(request.body);

  response.status(201).json({
    capability: 'EOS-CAP-0031',
    link
  });
}
