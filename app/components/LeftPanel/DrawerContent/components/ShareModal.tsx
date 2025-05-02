import React, { useRef } from 'react';
import { Modal, Button, Tabs, QRCode, message, Divider, Card } from 'antd';
import {
  FaQrcode,
  FaLink,
  FaSave,
  FaShareAlt,
  FaFacebookMessenger,
  FaWhatsapp,
  FaTwitter,
} from 'react-icons/fa';
import html2canvas from 'html2canvas';

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

  const handleMessengerShare = () => {
    const messengerUrl = `fb-messenger://share?link=${encodeURIComponent(
      shareUrl
    )}&app_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`;
    window.open(messengerUrl, '_blank');
  };

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
        <div className='flex items-center gap-2 p-2 sm:p-3'>
          <FaShareAlt className='text-green-500 text-xl sm:text-2xl' />
          <span className='text-lg sm:text-2xl font-semibold text-gray-800'>
            Share Location
          </span>
        </div>
      }
      footer={null}
      width='95%'
      style={{ maxWidth: '500px' }}
      className='share-modal'
      centered
    >
      <Card
        bordered={false}
        className='shadow-none'
        bodyStyle={{ padding: '16px 0 24px' }}
      >
        <Tabs
          type='card'
          className='share-tabs'
          items={[
            {
              key: '1',
              label: (
                <span className='flex items-center gap-1 sm:gap-2 px-2 py-1'>
                  <FaShareAlt className='text-green-500' />
                  <span className='font-medium text-sm sm:text-base'>
                    Share
                  </span>
                </span>
              ),
              children: (
                <div className='flex flex-col gap-4 sm:gap-6 p-3 sm:p-4'>
                  {typeof navigator.share === 'function' && (
                    <>
                      <Button
                        type='primary'
                        icon={<FaShareAlt />}
                        onClick={handleNativeShare}
                        className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                          h-10 sm:h-14 text-base sm:text-lg font-medium shadow-lg rounded-xl transition-all duration-300 
                          hover:shadow-green-200 hover:shadow-xl'
                        block
                      >
                        Share Location
                      </Button>
                      <Divider className='text-gray-400 text-sm sm:text-base'>
                        or share via
                      </Divider>
                    </>
                  )}

                  <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4'>
                    {[
                      {
                        icon: (
                          <FaWhatsapp className='text-[#25D366] text-2xl sm:text-3xl' />
                        ),
                        label: 'WhatsApp',
                        onClick: () =>
                          window.open(
                            `https://wa.me/?text=${encodeURIComponent(
                              shareText + '\n' + shareUrl
                            )}`,
                            '_blank'
                          ),
                      },
                      {
                        icon: (
                          <FaFacebookMessenger className='text-[#00B2FF] text-2xl sm:text-3xl' />
                        ),
                        label: 'Messenger',
                        onClick: handleMessengerShare,
                      },
                      {
                        icon: (
                          <FaTwitter className='text-[#1DA1F2] text-2xl sm:text-3xl' />
                        ),
                        label: 'Twitter',
                        onClick: () =>
                          window.open(
                            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                              shareText
                            )}&url=${encodeURIComponent(shareUrl)}`,
                            '_blank'
                          ),
                      },
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={item.onClick}
                        className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-white 
                          border border-gray-200 rounded-xl hover:shadow-lg hover:border-green-300 
                          transition-all duration-300 ${
                            index === 2 ? 'col-span-2 sm:col-span-1' : ''
                          }`}
                      >
                        {item.icon}
                        <span className='text-xs sm:text-sm font-medium text-gray-600'>
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <Divider className='text-gray-400 text-sm sm:text-base'>
                    or copy link
                  </Divider>

                  <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 p-2 bg-gray-50 rounded-xl'>
                    <input
                      type='text'
                      value={shareUrl}
                      readOnly
                      className='w-full flex-1 p-2 sm:p-3 border border-gray-200 rounded-lg text-xs sm:text-sm 
                        text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 
                        focus:border-transparent'
                    />
                    <Button
                      type='primary'
                      icon={<FaLink />}
                      onClick={handleCopyLink}
                      className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                        h-10 sm:h-12 px-4 sm:px-6 font-medium shadow-md rounded-lg whitespace-nowrap'
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              ),
            },
            {
              key: '2',
              label: (
                <span className='flex items-center gap-1 sm:gap-2 px-2 py-1'>
                  <FaQrcode className='text-green-500' />
                  <span className='font-medium text-sm sm:text-base'>
                    QR Code
                  </span>
                </span>
              ),
              children: (
                <div className='flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6'>
                  <div
                    ref={qrCodeRef}
                    className='p-4 sm:p-8 bg-white rounded-2xl shadow-lg border border-gray-100 
                      hover:shadow-xl transition-all duration-300 w-full max-w-[280px] sm:max-w-[320px]'
                  >
                    <QRCode
                      value={shareUrl}
                      color='#28C76F'
                      size={200}
                      bordered={false}
                      style={{
                        margin: '0 auto',
                        width: '100%',
                        height: 'auto',
                        maxWidth: '240px',
                      }}
                    />
                    <div
                      className='mt-3 sm:mt-4 text-center font-medium text-gray-700 text-sm sm:text-base 
                      break-words'
                    >
                      {placeInfo.name}
                    </div>
                  </div>
                  <Button
                    type='primary'
                    icon={<FaSave />}
                    onClick={handleDownloadQR}
                    className='bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                      h-10 sm:h-12 px-6 sm:px-8 text-base sm:text-lg font-medium shadow-lg rounded-xl 
                      hover:shadow-green-200 hover:shadow-xl transition-all duration-300'
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
