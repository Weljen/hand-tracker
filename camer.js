const video = document.getElementById("camera");
let cameraStream = null;

export async function startCamera() {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        video.srcObject = cameraStream;
        await video.play();
        return video;
    } catch (error) {
        console.error("Camera start failed:", error);
        throw error;
    }
}

export function getVideo() {
    return video;
}

export function stopCamera() {
    if (!cameraStream) return;
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
}
