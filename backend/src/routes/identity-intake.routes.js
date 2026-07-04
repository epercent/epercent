import { Router } from 'express';

import {
  createExternalRepositoryLink,
  getAsset,
  getIdentityMedia,
  getOrganizationIntake,
  getOrganizationIntakeRecord,
  getProfile,
  getRepositoryLinks,
  getStartupExperience,
  importOrganizationSource,
  listAssets,
  listProfiles,
  uploadMediaAsset
} from '../controllers/identity-intake.controller.js';

export const startupRouter = Router();
startupRouter.get('/', getStartupExperience);

export const identityMediaRouter = Router();
identityMediaRouter.get('/', getIdentityMedia);
identityMediaRouter.get('/profiles', listProfiles);
identityMediaRouter.get('/profiles/:id', getProfile);
identityMediaRouter.get('/assets', listAssets);
identityMediaRouter.get('/assets/:id', getAsset);
identityMediaRouter.post('/upload', uploadMediaAsset);

export const organizationIntakeRouter = Router();
organizationIntakeRouter.get('/', getOrganizationIntake);
organizationIntakeRouter.get('/:id', getOrganizationIntakeRecord);
organizationIntakeRouter.post('/import', importOrganizationSource);

export const repositoryLinksRouter = Router();
repositoryLinksRouter.get('/', getRepositoryLinks);
repositoryLinksRouter.post('/', createExternalRepositoryLink);
