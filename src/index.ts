/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import config from './content/site.json';
import { validateSiteConfig } from './recipes/immersive-website';
import { startSite } from './site/controller';
startSite(validateSiteConfig(config));
