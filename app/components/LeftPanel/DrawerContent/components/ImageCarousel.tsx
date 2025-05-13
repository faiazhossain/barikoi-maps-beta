import React from "react";
import Slider from "react-slick";
import { useImageUrls } from "@/app/hooks/useImageUrls";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Image as AntImage, Card } from "antd";
import ImageLoader from "@/app/components/common/LoadingPage/ImageLoader";

interface ImageCarouselProps {
  images: Array<{ key: string; url: string }>;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const { imageUrls, isLoading, error } = useImageUrls(images);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots: React.ReactNode) => (
      <div
        style={{
          position: "absolute",
          bottom: "1px",
          width: "100%",
        }}
      >
        <ul style={{ margin: "0", padding: "0" }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.5)",
          margin: "0 4px",
          transition: "all 0.3s ease",
        }}
      />
    ),
  };

  if (isLoading) {
    return (
      <div className='w-full relative aspect-[4/3] rounded-lg'>
        <ImageLoader />
      </div>
    );
  }

  // After loading, check for errors or empty images
  if (!isLoading && (error || !imageUrls || imageUrls.length === 0)) {
    return (
      <div className='relative w-full aspect-[4/3] overflow-hidden'>
        <AntImage
          src='/images/no_image_found.webp'
          alt='No image found'
          className='object-cover object-bottom h-full w-full opacity-80 filter' // Anchor to bottom
          preview={false}
        />
      </div>
    );
  }
  return (
    <div className='relative w-full h-[300px]'>
      <style jsx global>{`
        .slick-slider,
        .slick-list,
        .slick-track,
        .slick-slide,
        .slick-slide > div {
          height: 100%;
        }
        .slick-dots li.slick-active div {
          background-color: #61e294 !important;
          transform: scale(1.4);
          border: 1px solid #367d53;
        }
        .ant-card {
          height: 100%;
        }
        .ant-card-body {
          padding: 0 !important;
          height: 100%;
        }
        .full-height-image {
          height: 100%;
          width: 100%;
        }
        .full-height-image .ant-image-img {
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
        .preview-mask span {
          transition: opacity 0.3s ease;
        }
        .preview-mask:hover span {
          opacity: 1;
        }
      `}</style>
      <AntImage.PreviewGroup>
        <Slider {...settings}>
          {imageUrls.map((url, index) => (
            <div key={index} className='h-full'>
              <Card className='h-full w-full shadow-none border-none'>
                <div className='relative h-full w-full group'>
                  <AntImage
                    src={url}
                    alt={`Place image ${index + 1}`}
                    rootClassName='full-height-image'
                    preview={{
                      mask: (
                        <div className='preview-mask absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center'>
                          <span className='text-white opacity-0 group-hover:opacity-100'>
                            Click to preview
                          </span>
                        </div>
                      ),
                    }}
                  />
                  <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-2 py-1 rounded-full text-[12px] z-10'>
                    {index + 1}/{imageUrls.length}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </Slider>
      </AntImage.PreviewGroup>
    </div>
  );
};

const NextArrow = ({ className, onClick }: any) => (
  <div
    className={`${className} !right-[2px] !z-[1] !w-[30px] !h-[30px] bg-red-600`}
    onClick={onClick}
  />
);

const PrevArrow = ({ className, onClick }: any) => (
  <div
    className={`${className} !left-[8px] !z-[1] !w-[30px] !h-[30px]`}
    onClick={onClick}
  />
);

export default ImageCarousel;
