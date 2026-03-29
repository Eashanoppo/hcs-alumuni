export interface FrameOptions {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
}

export async function generateFramedImage(
  userImageSrc: string,
  frameSrc: string,
  options: FrameOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const size = 1080;
    
    // Main Canvas (Output)
    const mainCanvas = document.createElement('canvas');
    mainCanvas.width = size;
    mainCanvas.height = size;
    const ctx = mainCanvas.getContext('2d');
    if (!ctx) return reject('Canvas context not found');

    const frameImg = new Image();
    const userImg = new Image();

    // Fix for "Tainted canvases may not be exported" error
    frameImg.crossOrigin = "anonymous";
    userImg.crossOrigin = "anonymous";

    frameImg.onload = () => {
      userImg.onload = () => {
        // 1. Draw Background (matching frame base color: Deep Green or Blue)
        // We'll detect the top-left pixel or just use a default
        ctx.fillStyle = '#1F3D2B'; // Default HCS Green
        ctx.fillRect(0, 0, size, size);

        // 2. Draw User Photo (Behind Frame)
        ctx.save();
        const centerX = size / 2;
        const centerY = size / 2;
        
        // Define the area where the photo shows through
        const photoAreaRadius = size * 0.40; 
        
        ctx.translate(centerX + options.position.x, centerY + options.position.y);
        ctx.rotate((options.rotation * Math.PI) / 180);
        
        const imgRatio = userImg.width / userImg.height;
        let drawWidth, drawHeight;
        if (imgRatio > 1) {
          drawHeight = size * options.scale;
          drawWidth = drawHeight * imgRatio;
        } else {
          drawWidth = size * options.scale;
          drawHeight = drawWidth / imgRatio;
        }
        
        ctx.drawImage(userImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        // 3. Prepare the Frame (Overlay) on a temporary canvas
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = size;
        frameCanvas.height = size;
        const fCtx = frameCanvas.getContext('2d');
        if (!fCtx) return reject('Frame context not found');

        // Draw the frame image
        fCtx.drawImage(frameImg, 0, 0, size, size);

        // CREATE THE HOLE (Transparent Cutout)
        // We use a circular cutout, but we stop at the bottom to allow the LOGO to overlap
        fCtx.save();
        fCtx.globalCompositeOperation = 'destination-out';
        fCtx.beginPath();
        // The hole is a circle, slightly smaller than the wreath
        const holeRadius = size * 0.33; 
        fCtx.arc(centerX, centerY - 20, holeRadius, 0, Math.PI * 2);
        fCtx.fill();
        fCtx.restore();

        // 4. Draw the Frame Overlay ON TOP of the User Photo
        ctx.drawImage(frameCanvas, 0, 0);

        resolve(mainCanvas.toDataURL('image/jpeg', 0.95));
      };
      userImg.src = userImageSrc;
    };
    frameImg.src = frameSrc;
  });
}
