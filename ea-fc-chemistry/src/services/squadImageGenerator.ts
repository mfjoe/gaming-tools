/**
 * Squad Image Generator
 * Generates shareable images of squads using canvas
 */

import { Squad, Player } from '../types/player';

// Image specifications
const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 630;
const BACKGROUND_COLOR = '#0f172a'; // Dark blue
const ACCENT_COLOR = '#3b82f6'; // Blue
const TEXT_COLOR = '#ffffff';

/**
 * Generate squad image as Blob
 * Note: Requires html2canvas library for complex rendering
 * This is a simplified canvas-based version
 */
export async function generateSquadImage(squad: Squad): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = IMAGE_WIDTH;
      canvas.height = IMAGE_HEIGHT;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Draw background
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

      // Draw gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, IMAGE_HEIGHT);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

      // Draw title
      ctx.fillStyle = TEXT_COLOR;
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(squad.name || 'My EA FC 25 Squad', IMAGE_WIDTH / 2, 80);

      // Draw formation
      ctx.font = '32px sans-serif';
      ctx.fillStyle = ACCENT_COLOR;
      ctx.fillText(squad.formation || '4-4-2', IMAGE_WIDTH / 2, 130);

      // Draw player positions (simplified)
      const players = squad.players.filter((p) => p !== null);
      const rows = 4; // GK, DEF, MID, ATT
      const playersPerRow = Math.ceil(players.length / rows);

      let yOffset = 200;
      const xSpacing = IMAGE_WIDTH / (playersPerRow + 1);
      const ySpacing = (IMAGE_HEIGHT - 250) / rows;

      players.forEach((player, index) => {
        if (!player) return;

        const row = Math.floor(index / playersPerRow);
        const col = index % playersPerRow;
        const x = xSpacing * (col + 1);
        const y = yOffset + ySpacing * row;

        // Draw player card background
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.fillRect(x - 60, y - 30, 120, 80);

        // Draw player rating
        ctx.fillStyle = '#fbbf24'; // Gold
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(player.overall_rating.toString(), x, y);

        // Draw player name
        ctx.fillStyle = TEXT_COLOR;
        ctx.font = '16px sans-serif';
        const name = player.common_name || player.last_name;
        const truncated = name.length > 12 ? name.substring(0, 12) + '...' : name;
        ctx.fillText(truncated, x, y + 25);
      });

      // Draw stats
      const avgRating = Math.floor(
        players.reduce((sum, p) => sum + (p?.overall_rating || 0), 0) / players.length
      );
      const chemistry = squad.totalChemistry || 0;

      ctx.fillStyle = TEXT_COLOR;
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Rating: ${avgRating}`, 50, IMAGE_HEIGHT - 80);
      ctx.fillText(`Chemistry: ${chemistry}/33`, 50, IMAGE_HEIGHT - 40);

      // Draw watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Created with gaming-tools.co.uk', IMAGE_WIDTH - 50, IMAGE_HEIGHT - 30);

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate image blob'));
        }
      }, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Download squad image
 */
export async function downloadSquadImage(
  squad: Squad,
  filename?: string
): Promise<void> {
  try {
    const blob = await generateSquadImage(squad);
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `squad-${squad.name || 'export'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading squad image:', error);
    throw new Error('Failed to download squad image');
  }
}

/**
 * Generate thumbnail (smaller version)
 */
export async function generateSquadThumbnail(squad: Squad): Promise<string> {
  const blob = await generateSquadImage(squad);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Advanced image generation using html2canvas
 * Uncomment when html2canvas is installed: npm install html2canvas
 */
/*
import html2canvas from 'html2canvas';

export async function generateSquadImageAdvanced(
  squadElement: HTMLElement
): Promise<Blob> {
  const canvas = await html2canvas(squadElement, {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: BACKGROUND_COLOR,
    scale: 2, // High quality
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate image'));
      }
    }, 'image/png');
  });
}
*/

/**
 * Copy image to clipboard
 */
export async function copySquadImageToClipboard(squad: Squad): Promise<void> {
  try {
    const blob = await generateSquadImage(squad);
    
    // Check if Clipboard API supports images
    if (navigator.clipboard && 'write' in navigator.clipboard) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
    } else {
      throw new Error('Clipboard API not supported');
    }
  } catch (error) {
    console.error('Error copying image to clipboard:', error);
    throw new Error('Failed to copy image to clipboard');
  }
}

