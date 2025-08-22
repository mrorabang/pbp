import React, { useState, useRef, useEffect } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function VideoCallLayout({ children }) {
    const [openCall, setOpenCall] = useState(false);
    const meetingRef = useRef(null);
    const zegoInstance = useRef(null); // giữ lại instance để thoát room


    useEffect(() => {
        if (openCall && meetingRef.current) {
            const appID = 818840502; // AppID thật
            const serverSecret = "1c20a7f950e87c20696a51382d75e73d"; // Secret thật

            // ⚠️ TempToken chỉ dùng test
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                "public-room", // tất cả user chung 1 room
                Date.now().toString(),
                "User_" + Math.floor(Math.random() * 1000)
            );

            const zp = ZegoUIKitPrebuilt.create(kitToken);
            zegoInstance.current = zp;

            zp.joinRoom({
                container: meetingRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.GroupCall,
                },
            });
        }

        // cleanup khi unmount
        return () => {
            if (zegoInstance.current) {
                zegoInstance.current.destroy();
                zegoInstance.current = null;
            }
        };
    }, [openCall]);

    const handleLeave = () => {
        if (zegoInstance.current) {
            zegoInstance.current.destroy();
            zegoInstance.current = null;
        }
        setOpenCall(false);
    };

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            {/* Nội dung trang con */}
            {children}

            {/* Floating Button */}
            <button
                onClick={() => setOpenCall(true)}
                style={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#007bff",
                    color: "white",
                    fontSize: "24px",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                    zIndex: 999,
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width='30px' viewBox="0 0 640 640"><path d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L384 512C419.3 512 448 483.3 448 448L448 192C448 156.7 419.3 128 384 128L128 128zM496 400L569.5 458.8C573.7 462.2 578.9 464 584.3 464C597.4 464 608 453.4 608 440.3L608 199.7C608 186.6 597.4 176 584.3 176C578.9 176 573.7 177.8 569.5 181.2L496 240L496 400z" /></svg>
            </button>

            {/* Fullscreen Video Call */}
            {openCall && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "white",
                        zIndex: 1000,
                    }}
                >
                    <div
                        ref={meetingRef}
                        style={{ width: "100%", height: "100%" }}
                    />
                    <button
                        onClick={handleLeave}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "10px 15px",
                            borderRadius: "8px",
                            cursor: "pointer",
                        }}
                    >
                        Thoát
                    </button>
                </div>
            )}
        </div>
    );
}
