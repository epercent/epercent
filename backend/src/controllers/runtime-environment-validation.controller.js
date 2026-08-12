import { validateRuntimeEnvironment } from '../services/runtime-environment-validation-service.js';

export function getRuntimeEnvironmentValidation(request, response) {
  const report = validateRuntimeEnvironment({
    expectedBranch: request.query.expectedBranch || 'main'
  });

  response.status(report.status === 'PASS' ? 200 : 503).json(report);
}
