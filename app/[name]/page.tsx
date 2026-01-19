"use client"
import { nameConstants } from "@/constants/nameConstants"
import { notFound } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { use, useState, useEffect, useRef } from "react"

const NameDetailPage = ({ params }: { params: Promise<{ name: string }> }) => {
  const { name } = use(params)
  const [showEnvelope, setShowEnvelope] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Cấu hình start time và end time cho video (giây)
  const loopStart = 4.6 // Thay đổi theo yêu cầu
  const loopEnd = 5.8 // Thay đổi theo yêu cầu

  // Normalize: loại bỏ dấu cách, dấu gạch ngang và chuyển thành chữ thường
  const normalizedName = name.toLowerCase().replace(/[\s-]/g, '')
  const normalizedKey = nameConstants.find(item => item.key.toLowerCase().replace(/[\s-]/g, '') === normalizedName)?.key
  const nameValue = nameConstants.find(item => item.key === normalizedKey)?.value
  const [hasEnteredLoop, setHasEnteredLoop] = useState(false)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Sau 2 giây, hiển thị envelope
    const timer = setTimeout(() => {
      setShowEnvelope(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Đảm bảo video được play khi component mount
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Đảm bảo video play
    const playVideo = async () => {
      try {
        await video.play()
      } catch (error) {
        console.error('Lỗi khi play video:', error)
      }
    }

    // Play video khi đã load metadata
    if (video.readyState >= 2) {
      playVideo()
    } else {
      video.addEventListener('loadedmetadata', playVideo)
    }

    // Xử lý loop video
    const handleTimeUpdate = () => {
      // Khi video chạy tới loopStart lần đầu
      if (!hasEnteredLoop && video.currentTime >= loopStart) {
        setHasEnteredLoop(true)
      }

      // Sau khi đã vào loop → ép quay lại
      if (hasEnteredLoop && video.currentTime >= loopEnd) {
        video.currentTime = loopStart
        video.play().catch(console.error)
      }
    }

    // Xử lý khi video kết thúc
    const handleEnded = () => {
      video.currentTime = loopStart
      video.play().catch(console.error)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', (e) => {
      console.error('Lỗi video:', e)
    })

    return () => {
      video.removeEventListener('loadedmetadata', playVideo)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [hasEnteredLoop, loopStart, loopEnd])

  if (!normalizedKey) {
    return notFound()
  }

  return (
    <div className="flex h-dvh items-center bg-black justify-center flex-col gap-8 relative overflow-hidden">
      {/* Video background thay thế logo và confetti */}
      <video
        ref={videoRef}
        src="/videos/mainClip.mp4"
        autoPlay
        muted
        playsInline
        loop={false}
        preload="auto"
        style={{ height: '100%', width: '100%' }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {showEnvelope && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute top-[70%] left-1/2 -translate-x-1/2 cursor-pointer duration-150 ease-in-out transition-all z-10 flex flex-row justify-center items-center"
          style={{
            padding: '8px 24px',
            gap: '8px',
            width: '148px',
            height: '48px',
            borderRadius: '36px',
            border: '1.5px solid',
            borderImageSource: `
              linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.6) 100%),
              linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 0.72) 50%, rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 0) 100%)
            `,
            borderImageSlice: 1,
            background: isHovered ? `
              linear-gradient(180deg, rgba(255, 255, 255, 0) 31.77%, rgba(255, 255, 255, 0.1) 81.77%, rgba(255, 255, 255, 0.06) 82.29%, rgba(255, 255, 255, 0) 107.29%),
              radial-gradient(53.2% 22.92% at 49.6% 100%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%),
              radial-gradient(32.29% 32.29% at 50% 21.87%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%),
              linear-gradient(270deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 100%),
              #183538
            ` : `
              linear-gradient(180deg, rgba(255, 255, 255, 0) 31.77%, rgba(255, 255, 255, 0.1) 81.77%, rgba(255, 255, 255, 0.06) 82.29%, rgba(255, 255, 255, 0) 107.29%),
              radial-gradient(53.2% 22.92% at 49.6% 100%, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%),
              radial-gradient(32.29% 32.29% at 50% 21.87%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%),
              linear-gradient(270deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 100%),
              #46585B
            `,
            backgroundBlendMode: 'plus-lighter, overlay, overlay, soft-light, normal',
            boxSizing: 'border-box',
            isolation: 'isolate',
          }}
        >
          <span
            className="font-medium text-base leading-[19px] tracking-[-0.02em]"
            style={{
              width: '89px',
              height: '19px',
              background: `
                linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.7) 100%),
                linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)),
                #FFFFFF
              `,
              backgroundBlendMode: 'normal, normal, overlay',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              textShadow: '0px 2px 3px rgba(0, 0, 0, 0.12)',
            }}
          >
            Mở thư mời
          </span>
        </motion.button>
      )}

      {/* Popup với background bg.png khi click nút mở */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 ,ease: "easeInOut"}}
          className="fixed inset-0 flex items-center  justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
            <div className="absolute left-0 top-[5%]  lg:translate-y-0 translate-y-1/2 lg:top-0 -translate-x-1/2 w-1/3 h-auto z-20 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative w-full aspect-square"
            >
              <Image
                src="/images/bg/spinner.png"
                alt="Spinner"
                fill
                className="object-cover w-full h-full"
                priority
              />
            </motion.div>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-1/2 w-1/3 h-auto z-20 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative w-full aspect-square"
            >
              <Image
                src="/images/bg/spinner.png"
                alt="Spinner"
                fill
                className="object-cover w-full h-full"
                priority
              />
            </motion.div>
          </div>


          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{
              transformOrigin: 'center center',
            }}
            className="relative w-full h-full rounded-lg overflow-hidden"
          >
            <Image
              src="/images/bg/bg.png"
              alt="Popup Background"
              fill
              className="object-cover"
              priority
            />
            
            {/* Hình sy.png bên trái */}
            <div className="absolute left-0 top-0 h-full z-25">
              <Image
                src="/images/bg/sy.png"
                alt="Sy"
                width={400}
                height={1920}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
            
            <div className="absolute top-0 left-1/2 z-30 -translate-x-1/2 right-0 bottom-0 lg:max-w-none w-full h-full z-20 flex items-center justify-center">
              <Image
                src={isMobile ? "/images/bg/frameMobile.png" : "/images/bg/nameFrame.png"}
                alt="Name Frame"
                fill
                className="object-contain lg:object-cover w-full h-full"
                priority
                
              />
              <div 
                className="absolute  left-1/2 -translate-x-1/2 z-30 flex flex-col justify-start items-center text-center px-4"
                style={isMobile ? {
                  top: '25.55%', // 479/1873 = 25.55%
                  width: '79.8%', // 893/1119 = 79.8%
                  height: '39.03%', // 731/1873 = 39.03%
                } : {
                  top: '35.37%', // 382/1080 = 35.37%
                  width: '54.27%', // 1042/1920 = 54.27%
                  height: '35.09%', // 379/1080 = 35.09%
                }}
              >
                <div className="text-white lg:text-xl text-sm flex flex-col lg:gap-2 gap-1 text-left font-sans font-semibold lg:p-4 p-2">
                  <p className="">Công ty TNHH công nghệ BTG trân trọng kính mời</p>
                  <p className="">Anh/ chị: {nameValue}</p>
                  <p>Thời gian: 18 giờ 00, ngày 30/1/2026</p>
                  <p>Địa điểm: Sảnh 04 - Nhà hàng Văn Hoa - 68-76 Đ. Tản Đà, Phường Chợ Lớn</p>
                  <p>với nhiều trò chơi và rất nhiều phần quà vô cùng giá trị</p>
                  <p>Sự hiện diện của mọi người chính là niềm &quot;mệt mỏi hạnh phúc&quot; to lớn của Ban Tổ Chức mỗi lần trao giải.</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 flex items-start justify-center z-10 pt-16">
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/images/bg/tittle.png"
                  alt="Title"
                  width={800}
                  height={300}
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default NameDetailPage
