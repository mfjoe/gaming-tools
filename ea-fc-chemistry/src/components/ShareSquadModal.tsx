import React, { useState, useRef } from 'react';
import { Squad } from '../types/player';
import { useSquadSharing, SocialPlatform } from '../hooks/useSquadSharing';

interface ShareSquadModalProps {
  squad: Squad;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareSquadModal: React.FC<ShareSquadModalProps> = ({
  squad,
  isOpen,
  onClose,
}) => {
  const { generateURL, copyToClipboard, shareToSocial, downloadImage, shareNative } = useSquadSharing();
  const [copied, setCopied] = useState(false);
  const [shareMethod, setShareMethod] = useState<'url' | 'qr'>('url');
  const urlInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const squadURL = generateURL(squad);
  const rating = Math.floor(
    squad.players.filter((p) => p).reduce((sum, p) => sum + (p?.overall_rating || 0), 0) /
      squad.players.filter((p) => p).length
  );
  const chemistry = squad.totalChemistry || 0;

  const handleCopy = async () => {
    const success = await copyToClipboard(squadURL);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: SocialPlatform) => {
    shareToSocial(platform, squad);
  };

  const handleDownloadImage = async () => {
    try {
      await downloadImage(squad);
    } catch (error) {
      alert('Failed to download image');
    }
  };

  const handleNativeShare = async () => {
    try {
      await shareNative(squad);
    } catch (error) {
      // Fallback to copy
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Share Squad</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Squad Preview */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            {squad.name || 'My Squad'}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>Formation: {squad.formation}</span>
            <span>⭐ {rating} Rating</span>
            <span>🔗 {chemistry}/33 Chemistry</span>
          </div>
        </div>

        {/* Share Methods Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShareMethod('url')}
            className={`flex-1 px-4 py-3 font-medium ${
              shareMethod === 'url'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Share URL
          </button>
          <button
            onClick={() => setShareMethod('qr')}
            className={`flex-1 px-4 py-3 font-medium ${
              shareMethod === 'qr'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            QR Code
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {shareMethod === 'url' && (
            <>
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Shareable Link
                </label>
                <div className="flex gap-2">
                  <input
                    ref={urlInputRef}
                    type="text"
                    value={squadURL}
                    readOnly
                    onClick={(e) => e.currentTarget.select()}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      copied
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {copied ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </span>
                    ) : (
                      'Copy'
                    )}
                  </button>
                </div>
              </div>

              {/* Social Media Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Share to Social Media
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.25c7.55 0 11.67-6.25 11.67-11.67 0-.18 0-.35-.01-.53A8.35 8.35 0 0022 5.92a8.2 8.2 0 01-2.36.65 4.12 4.12 0 001.8-2.27 8.21 8.21 0 01-2.61 1 4.1 4.1 0 00-7 3.74A11.65 11.65 0 013.16 4.75a4.1 4.1 0 001.27 5.48 4.07 4.07 0 01-1.86-.51v.05a4.1 4.1 0 003.3 4.03 4.1 4.1 0 01-1.86.07 4.11 4.11 0 003.83 2.85A8.23 8.23 0 012 18.43a11.62 11.62 0 006.29 1.84" />
                    </svg>
                    Twitter/X
                  </button>

                  <button
                    onClick={() => handleShare('reddit')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.74c.69 0 1.26.56 1.26 1.25a1.26 1.26 0 0 1-2.52 0c0-.69.56-1.25 1.26-1.25zM2.71 12c0-1.18.96-2.14 2.14-2.14.45 0 .88.14 1.23.4A8.26 8.26 0 0 1 12 8.34l.01-.03 1.68 3.78a2.13 2.13 0 0 1 1.15-.34c1.18 0 2.14.96 2.14 2.14 0 .93-.6 1.72-1.43 2L12 17.86l-3.55-1.97a2.13 2.13 0 0 1-1.43-2c0-1.18.96-2.14 2.14-2.14.45 0 .88.14 1.23.4z" />
                    </svg>
                    Reddit
                  </button>

                  <button
                    onClick={() => handleShare('discord')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.32 4.37a19.8 19.8 0 00-4.93-1.51 13.83 13.83 0 00-.61 1.23 18.35 18.35 0 00-5.56 0A12.36 12.36 0 008.6 2.86a19.74 19.74 0 00-4.93 1.51A20.8 20.8 0 00.98 16.07 19.9 19.9 0 006.72 19a14.43 14.43 0 001.22-1.97 12.83 12.83 0 01-1.94-.92c.16-.12.32-.24.47-.36a14.12 14.12 0 0012.03 0c.15.13.3.25.47.36-.62.36-1.27.67-1.94.92.3.7.72 1.35 1.22 1.97A19.85 19.85 0 0023 16.07a20.7 20.7 0 00-2.68-11.7zM8.02 13.44c-.93 0-1.69-.84-1.69-1.87s.74-1.87 1.69-1.87c.94 0 1.7.84 1.69 1.87 0 1.03-.75 1.87-1.69 1.87zm7.96 0c-.93 0-1.69-.84-1.69-1.87s.74-1.87 1.69-1.87c.94 0 1.7.84 1.69 1.87 0 1.03-.75 1.87-1.69 1.87z" />
                    </svg>
                    Discord
                  </button>

                  <button
                    onClick={() => handleShare('facebook')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>

                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </button>

                  {navigator.share && (
                    <button
                      onClick={handleNativeShare}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      More...
                    </button>
                  )}
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Export Options
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={handleDownloadImage}
                    className="flex-1 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-semibold"
                  >
                    📸 Download as Image
                  </button>
                </div>
              </div>
            </>
          )}

          {shareMethod === 'qr' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4">
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                  Scan this QR code with your phone to open the squad
                </p>
                {/* QR Code placeholder - requires qrcode.react library */}
                <div className="w-64 h-64 bg-white p-4 rounded-lg shadow-lg flex items-center justify-center border-4 border-gray-200">
                  <div className="text-center text-gray-500">
                    <svg className="w-48 h-48 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <p className="mt-4 text-sm">QR Code</p>
                    <p className="text-xs text-gray-400 mt-2">Install qrcode.react for QR generation</p>
                  </div>
                  {/* 
                  Uncomment when qrcode.react is installed:
                  <QRCode 
                    value={squadURL}
                    size={256}
                    level="M"
                    includeMargin={true}
                  />
                  */}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

