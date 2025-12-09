/**
 * Export all API paths
 */

import { authPaths } from './auth.paths';
import { projectPaths } from './projects.paths';
import { taskPaths } from './tasks.paths';

export const paths = {
  ...authPaths,
  ...projectPaths,
  ...taskPaths
};

