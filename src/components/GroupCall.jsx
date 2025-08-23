import React, { useRef, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function GroupCall() {
  const meetingRef = useRef(null);

  useEffect(() => {
    if (meetingRef.current) {
      const appID = 818840502;
      const serverSecret = "1c20a7f950e87c20696a51382d75e73d";

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        "public-room", // tất cả user chung 1 phòng
        Date.now().toString(),
        "Fucker " + Math.floor(Math.random() * 1000)
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: meetingRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showPreJoinView: false, // vào luôn không hỏi trước
        onLeaveRoom: () => {
          window.location.href = "/"; // tự động về trang chủ
        },
      });
    }
  }, []);

  return (
    <div
      ref={meetingRef}
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
