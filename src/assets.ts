/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AssetType, defineAssets } from '@iwsdk/core';
import { galleryShell, portalFrame, centerpiece, exhibitThreshold, exhibitTerraces, exhibitOrbit } from './scene-assets/gallery.scene-asset';
import { signaturePortal } from './scene-assets/signature-portal.scene-asset';
import { focalSculpture } from './scene-assets/focal-sculpture.scene-asset';

const publicAssetUrl = (filePath: string): string =>
  `${import.meta.env.BASE_URL}${filePath.replace(/^\/+/u, '')}`;
const DEFAULT_STOCK_ASSET_BASE =
  'https://cdn.jsdelivr.net/npm/@iwsdk/example-assets@0.4.2/assets';
const configuredStockAssetBase =
  import.meta.env.VITE_IWSDK_EXAMPLE_ASSET_BASE_URL?.trim();
const stockAssetBase = (
  configuredStockAssetBase || DEFAULT_STOCK_ASSET_BASE
).replace(/\/+$/u, '');

function stockAssetUrl(assetId: string, fileName: string): string {
  return `${stockAssetBase}/${assetId}/${fileName}`;
}

export default defineAssets({
  'signature-portal': signaturePortal,
  'focal-sculpture': focalSculpture,
  'exhibit-threshold': exhibitThreshold,
  'exhibit-terraces': exhibitTerraces,
  'exhibit-orbit': exhibitOrbit,
  'showroom-signage': { url: publicAssetUrl('ui/showroom-signage.uikitml'), type: AssetType.UIKitML },
  'portal-preview': { url: publicAssetUrl('ui/portal-preview.uikitml'), type: AssetType.UIKitML },
  'gallery-shell': galleryShell,
  'portal-frame': portalFrame,
  centerpiece,
  'exhibit-panel': { url: publicAssetUrl('ui/exhibit.uikitml'), type: AssetType.UIKitML },
  'portal-label': { url: publicAssetUrl('ui/portal-label.uikitml'), type: AssetType.UIKitML },
  'environment-desk': {
    url: stockAssetUrl('environment-desk', 'environmentDesk.gltf'),
    type: AssetType.GLTF,
    name: 'Environment Desk',
    priority: 'lazy',
  },
  'plant-sansevieria': {
    url: stockAssetUrl('plant-sansevieria', 'plantSansevieria.gltf'),
    type: AssetType.GLTF,
    name: 'Plant Sansevieria',
    priority: 'lazy',
  },
  robot: {
    url: stockAssetUrl('robot', 'robot.gltf'),
    type: AssetType.GLTF,
    name: 'Robot',
    priority: 'lazy',
  },
  'welcome-panel': {
    url: publicAssetUrl('ui/welcome.uikitml'),
    type: AssetType.UIKitML,
    name: 'Welcome Panel',
    priority: 'lazy',
  },
  'webxr-banner': {
    url: publicAssetUrl('gltf/webxr-banner/banner.gltf'),
    type: AssetType.GLTF,
    name: 'WebXR Banner',
    priority: 'lazy',
  },
});
