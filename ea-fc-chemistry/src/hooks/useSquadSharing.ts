/**
 * React Hook for Squad Sharing
 */

import { useState, useCallback } from 'react';
import { Squad } from '../types/player';
import { generateSquadURL, encodeSquad } from '../services/squadEncoder';
import { downloadSquadImage } from '../services/squadImageGenerator';

interface UseSquadSharingReturn {
  isSharing: boolean;
  error: Error | null;
  generateURL: (squad: Squad, useQueryParam?: boolean) => string;
  copyToClipboard: (text: string) => Promise<boolean>;
  shareToSocial: (platform: SocialPlatform, squad: Squad) => void;
  downloadImage: (squad: Squad, filename?: string) => Promise<void>;
  shareNative: (squad: Squad) => Promise<void>;
}

export type SocialPlatform = 'twitter' | 'reddit' | 'discord' | 'facebook' | 'whatsapp';

export function useSquadSharing(): UseSquadSharingReturn {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateURL = useCallback((squad: Squad, useQueryParam: boolean = false): string => {
    try {
      return generateSquadURL(squad, useQueryParam);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate URL');
      setError(error);
      throw error;
    }
  }, []);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      setIsSharing(true);
      setError(null);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);

      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to copy to clipboard');
      setError(error);
      return false;
    } finally {
      setIsSharing(false);
    }
  }, []);

  const shareToSocial = useCallback((platform: SocialPlatform, squad: Squad): void => {
    try {
      const url = generateURL(squad);
      const squadName = squad.name || 'My EA FC 25 Squad';
      const rating = Math.floor(
        squad.players.filter(p => p).reduce((sum, p) => sum + (p?.overall_rating || 0), 0) /
          squad.players.filter(p => p).length
      );
      const chemistry = squad.totalChemistry || 0;

      let shareURL = '';

      switch (platform) {
        case 'twitter':
          const twitterText = `Check out my EA FC 25 squad "${squadName}"!\n\n⭐ ${rating} Rating\n🔗 ${chemistry}/33 Chemistry\n\n${url}`;
          shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
          break;

        case 'reddit':
          const redditTitle = `My EA FC 25 Squad: ${squadName} (${rating} Rating, ${chemistry} Chemistry)`;
          shareURL = `https://reddit.com/submit?title=${encodeURIComponent(redditTitle)}&url=${encodeURIComponent(url)}`;
          break;

        case 'facebook':
          shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;

        case 'whatsapp':
          const whatsappText = `Check out my EA FC 25 squad: ${squadName} (${rating} Rating, ${chemistry} Chemistry)\n${url}`;
          shareURL = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
          break;

        case 'discord':
          // Discord doesn't have a direct share URL, copy to clipboard instead
          const discordText = `**${squadName}**\n⭐ Rating: ${rating}\n🔗 Chemistry: ${chemistry}/33\n${url}`;
          copyToClipboard(discordText);
          return;

        default:
          throw new Error('Unsupported platform');
      }

      window.open(shareURL, '_blank', 'noopener,noreferrer,width=600,height=400');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to share');
      setError(error);
    }
  }, [generateURL, copyToClipboard]);

  const downloadImage = useCallback(async (squad: Squad, filename?: string): Promise<void> => {
    try {
      setIsSharing(true);
      setError(null);
      await downloadSquadImage(squad, filename);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to download image');
      setError(error);
      throw error;
    } finally {
      setIsSharing(false);
    }
  }, []);

  const shareNative = useCallback(async (squad: Squad): Promise<void> => {
    try {
      if (!navigator.share) {
        throw new Error('Native sharing not supported');
      }

      setIsSharing(true);
      setError(null);

      const url = generateURL(squad);
      const squadName = squad.name || 'My EA FC 25 Squad';

      await navigator.share({
        title: squadName,
        text: `Check out my EA FC 25 squad!`,
        url,
      });
    } catch (err) {
      // User cancelled or error occurred
      if ((err as Error).name !== 'AbortError') {
        const error = err instanceof Error ? err : new Error('Failed to share');
        setError(error);
      }
    } finally {
      setIsSharing(false);
    }
  }, [generateURL]);

  return {
    isSharing,
    error,
    generateURL,
    copyToClipboard,
    shareToSocial,
    downloadImage,
    shareNative,
  };
}

