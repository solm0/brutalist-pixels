'use client'

import { useState } from "react"

export default function About() {
  const [isOpen, setIsOpen] = useState(false);

  function AboutModal() {
    return (
      <div
        className="absolute w-96 h-72 text-center break-keep text-xs font-mono z-10 bg-[#0f0525] border border-[#fff7d8] flex flex-col items-center justify-between p-12"
        onClick={() => setIsOpen(false)}
      >
        <p>모노스페이스 키릴문자 픽셀들로 구 유고슬라비아 지역 브루탈리즘 양식의 기념비들을 그렸습니다.</p>
        <p>유고슬라비아 시대, 현 세르비아 수도 베오그라드에서 활동한 신스팝 음악가 Max Vincent의 곡 Loš je dan(1986)의 가사를 넣었습니다.</p>
        <p className="opacity-40">제 18회 조형전 - 코로로 정솔미 2/2</p>
      </div>
    )
  }

  return (
    <>
      <div
        className="text-xs h-8 flex items-center px-3 bg-[#0f0525] border-b border-r hover:border-l hover:border-t hover:border-b-0 hover:border-r-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        About
      </div>
      {isOpen && <AboutModal />}
    </>
  )
}