import React, { useRef } from 'react';
import { Modal, Button, Tabs, QRCode, message, Divider, Card } from 'antd';
import { FaQrcode, FaLink, FaSave, FaShareAlt } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import {
  FacebookMessengerShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookMessengerIcon,
  WhatsappIcon,
  TwitterIcon,
} from 'react-share';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  placeInfo: {
    name: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    url: string;
    uCode: string;
  };
}

const getShareUrl = (placeInfo) => {
  const baseUrl = window.location.origin;
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;

  return `${baseUrl}${currentPath}?place=${placeInfo.uCode}${currentHash}`;
};

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  placeInfo,
}) => {
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const shareUrl = getShareUrl(placeInfo);
  const shareText = `Check out ${placeInfo.name} on Barikoi Maps!`;
  const FACEBOOK_APP_ID =
    process.env.REACT_APP_FACEBOOK_APP_ID || 'YOUR_APP_ID';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      message.success('Link copied to clipboard!');
    } catch {
      message.error('Failed to copy link');
    }
  };

  const handleDownloadQR = async () => {
    if (!qrCodeRef.current) return;

    try {
      const canvas = await html2canvas(qrCodeRef.current);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `${placeInfo.name.replace(/\s+/g, '-')}-qr.png`;
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      message.success('QR code downloaded successfully!');
    } catch (error) {
      message.error('Failed to download QR code');
      console.error('QR download error:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Barikoi Maps Location',
          text: shareText,
          url: shareUrl,
        });
        message.success('Shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          message.error('Failed to share');
        }
      }
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={
        <div className='flex items-center gap-3'>
          <FaShareAlt className='text-green-500 text-xl' />
          <span className='text-xl font-semibold'>Share Location</span>
        </div>
      }
      footer={null}
      width={480}
      className='share-modal'
      centered
    >
      <Card bordered={false} className='shadow-none' bodyStyle={{ padding: 0 }}>
        <Tabs
          tabBarStyle={{ marginBottom: 24 }}
          items={[
            {
              key: '1',
              label: (
                <span className='flex items-center gap-2 font-medium'>
                  <FaShareAlt className='text-green-500' /> Share
                </span>
              ),
              children: (
                <div className='flex flex-col gap-6'>
                  {typeof navigator.share === 'function' && (
                    <>
                      <Button
                        type='primary'
                        icon={<FaShareAlt />}
                        onClick={handleNativeShare}
                        className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-12 text-lg font-medium shadow-md'
                        block
                      >
                        Share Location
                      </Button>
                      <Divider className='text-gray-400 before:border-t after:border-t'>
                        or share via
                      </Divider>
                    </>
                  )}

                  <div className='grid grid-cols-3 gap-4'>
                    <WhatsappShareButton
                      url={shareUrl}
                      title={shareText}
                      className='flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white h-12 font-medium shadow-md rounded-md overflow-hidden'
                    >
                      <WhatsappIcon size={32} round />
                      <span className='hidden sm:inline'>WhatsApp</span>
                    </WhatsappShareButton>

                    <FacebookMessengerShareButton
                      url={shareUrl}
                      appId={FACEBOOK_APP_ID}
                      className='flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white h-12 font-medium shadow-md rounded-md overflow-hidden'
                    >
                      <FacebookMessengerIcon size={32} round />
                      <span className='hidden sm:inline'>Messenger</span>
                    </FacebookMessengerShareButton>

                    <TwitterShareButton
                      url={shareUrl}
                      title={shareText}
                      className='flex items-center justify-center gap-2 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white h-12 font-medium shadow-md rounded-md overflow-hidden'
                    >
                      <TwitterIcon size={32} round />
                      <span className='hidden sm:inline'>Twitter</span>
                    </TwitterShareButton>
                  </div>

                  <Divider className='text-gray-400 before:border-t after:border-t'>
                    or copy link
                  </Divider>

                  <div className='flex items-center gap-3'>
                    <input
                      type='text'
                      value={shareUrl}
                      readOnly
                      className='flex-1 p-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    />
                    <Button
                      type='primary'
                      icon={<FaLink />}
                      onClick={handleCopyLink}
                      className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-12 px-6 font-medium shadow-md'
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ),
            },
            {
              key: '2',
              label: (
                <span className='flex items-center gap-2 font-medium'>
                  <FaQrcode className='text-green-500' /> QR Code
                </span>
              ),
              children: (
                <div className='flex flex-col items-center gap-6'>
                  <div
                    ref={qrCodeRef}
                    className='p-6 bg-white rounded-xl shadow-md border border-gray-200'
                  >
                    <QRCode
                      value={shareUrl}
                      color='#28C76F'
                      size={220}
                      bordered={false}
                      iconSize={40}
                    />
                    <div className='mt-4 text-center text-sm font-medium text-gray-600'>
                      {placeInfo.name}
                    </div>
                  </div>
                  <Button
                    type='primary'
                    icon={<FaSave />}
                    onClick={handleDownloadQR}
                    className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-12 px-8 text-lg font-medium shadow-md'
                  >
                    Download QR Code
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </Modal>
  );
};

export default ShareModal;
