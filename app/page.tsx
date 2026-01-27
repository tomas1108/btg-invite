"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState, useEffect, useRef, Activity } from "react"

const HomePage = () => {
  const [showEnvelope, setShowEnvelope] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Cấu hình start time và end time cho video (giây)
  const loopStart = 4.6 // Thay đổi theo yêu cầu
  const loopEnd = 5.8 // Thay đổi theo yêu cầu

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

    const playVideo = async () => {
      if (!video.paused) return
      try {
        await video.play()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) { }
    }

    if (video.readyState >= 2) {
      playVideo()
    } else {
      video.addEventListener("loadedmetadata", playVideo)
    }

    const handleTimeUpdate = () => {
      // 🔴 Nếu popup mở → KHÔNG loop nữa
      if (isOpen) return

      // Chưa vào loop lần đầu
      if (!hasEnteredLoop && video.currentTime >= loopStart) {
        setHasEnteredLoop(true)
      }

      // Đã vào loop → ép quay lại
      if (hasEnteredLoop && video.currentTime >= loopEnd) {
        video.currentTime = loopStart
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("loadedmetadata", playVideo)
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [hasEnteredLoop, loopStart, loopEnd, isOpen])

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


      <Activity mode={showEnvelope ? "visible" : "hidden"}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute top-[70%] left-1/2 -translate-x-1/2 cursor-pointer z-10 flex flex-row justify-center items-center"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="btn-invite"
          >
            <span className="btn-invite-text">Mở thư mời</span>
          </button>
        </motion.div>
      </Activity>

      {/* Popup với background bg.png khi click nút mở */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
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
            className="relative w-full h-full overflow-hidden"
          >

            <Image
              src="/images/bg/bg.png"
              alt="Popup Background"
              fill
              className="object-cover"
              priority
            />



            <div className="absolute top-0 left-1/2 z-30 -translate-x-1/2 right-0 bottom-0 lg:max-w-none w-full h-full flex items-center justify-center">
              <Image
                src={isMobile ? "/images/bg/frameMobile.png" : "/images/bg/framefinal3.png"}
                alt="Name Frame"
                width={1920}
                height={1080}
                className="object-cover relative w-full h-full"
                priority

              />

              {/* Lớp shine overlay - trên khung nhưng dưới text */}
              <div className=" absolute w-[calc(1039/1920*100%)] top-[calc(404/1080*100%)] h-[calc(470/1080*100%)] left-[calc((960-20)/1920*100%)] -translate-x-1/2 z-25">
                <div className="shine-overlay rounded-xl"></div>
              </div>

              <div
                className="absolute w-[calc(1039/1920*100%)] top-[calc(404/1080*100%)] h-[calc(378/1080*100%)] left-[calc((960-20)/1920*100%)] -translate-x-1/2 z-30 font-medium flex flex-col text-white lg:text-xl 2l:text-2xl text-sm justify-evenly items-start text-left lg:pb-4 lg:pt-6 lg:pr-10 lg:pl-12 p-2"
              >

                <>
                  <p className="">Công ty TNHH công nghệ BTG trân trọng kính mời</p>
                  <p>Thời gian: 18 giờ 00, ngày 30/1/2026</p>
                  <p>Địa điểm: Sảnh 04 - Nhà hàng Văn Hoa - 68-76 Đ. Tản Đà, Phường Chợ Lớn</p>
                  <p>Với nhiều trò chơi và rất nhiều phần quà vô cùng giá trị</p>
                  <p>Sự hiện diện của mọi người chính là niềm &quot;mệt mỏi hạnh phúc&quot; to lớn của Ban Tổ Chức. Game có thưởng – tiệc có đồ ngon – đồng đội thì không thiếu.
                    Mong được gặp Anh/Chị tại buổi tiệc cuối năm để cùng khép lại 2025 thật trọn vẹn. Đến là vui, chơi là đã, về là có quà – hẹn gặp tại Year End Party BTG.</p>
                </>
              </div>
              <div className="absolute bottom-[calc(50/1080*100%)] translate-y-1/2 left-[calc(921/1920*100%)] -translate-x-1/2 z-30 font-medium text-white lg:text-xl text-sm text-center mt-2 drop-shadow-lg [text-shadow:2px_2px_4px_rgba(0,0,0,0.8)]">
                Design by My Yen
              </div>
            </div>

            <div className="absolute top-0 left-0 right-0 flex items-center justify-center z-35 pt-10">
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
                  src="/images/bg/tittle1.png"
                  alt="Title"
                  width={800}
                  height={300}
                  className="object-cover h-full"
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

export default HomePage
