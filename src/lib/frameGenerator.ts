export interface FrameOptions {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  bgColor?: string;
  frameId?: string;
}

const GOLD = '#CEB888';

interface Layout {
  W: number; H: number;
  photo: { x: number; y: number; w: number; h: number };
  bannerH: number;
  footerH: number;
}

const LAYOUTS: Record<string, Layout> = {
  instagram: {
    W: 1080, H: 1080,
    photo: { x: 50, y: 140, w: 980, h: 710 },
    bannerH: 190,
    footerH: 40,
  },
  facebook: {
    W: 1200, H: 628,
    photo: { x: 50, y: 120, w: 1100, h: 330 },
    bannerH: 130,
    footerH: 48,
  },
  circle: {
    W: 1080, H: 1080,
    photo: { x: 100, y: 100, w: 880, h: 880 },
    bannerH: 0,
    footerH: 0,
  },
};

// ── helpers ──────────────────────────────────────────────────────────────────

function getGraphemes(text: string): string[] {
  // Use modern browser Segmenter to correctly group Bengali conjuncts and diacritics
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new (Intl as any).Segmenter('bn', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text)).map((s: any) => s.segment);
  }
  return text.match(/[\u0980-\u09FF][\u09BC\u09BE-\u09D7\u09E2\u09E3]*|./g) || [];
}

function drawCurvedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  top: boolean = true
) {
  ctx.save();
  const clusters = getGraphemes(text);
  const fullWidth = ctx.measureText(text).width;
  // Reduced kerning to 1.1 for better visual density
  const totalAngle = (fullWidth * 1.1) / radius;
  
  const stepAngle = totalAngle / clusters.length;
  // If bottom text, start from the left side and decrement angle to draw left-to-right
  let currentAngle = top ? startAngle - totalAngle / 2 : startAngle + totalAngle / 2;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < clusters.length; i++) {
    const char = clusters[i];
    const angle = top ? currentAngle + stepAngle / 2 : currentAngle - stepAngle / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    if (!top) ctx.rotate(Math.PI);
    ctx.fillText(char, 0, 0);
    ctx.restore();
    
    currentAngle += top ? stepAngle : -stepAngle;
  }
  ctx.restore();
}
function drawWreath(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  const leafCount = 15;
  const scale = radius / 400;
  const leafW = 20 * scale;
  const leafH = 8 * scale;
  
  for (let side of [-1, 1]) {
    for (let i = 0; i < leafCount; i++) {
      const angle = (Math.PI / 2) + side * (0.3 + (i / leafCount) * 2.0);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + (side * Math.PI / 4.5));
      ctx.beginPath();
      ctx.ellipse(0, 0, leafW, leafH, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.restore();
}

function drawInstagramLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = 'round';
  
  const r = size * 0.3;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + size - r, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + r);
  ctx.lineTo(x + size, y + size - r);
  ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
  ctx.lineTo(x + r, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + size/2, y + size/2, size * 0.25, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size * 0.75, y + size * 0.25, size * 0.05, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawFacebookLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  
  ctx.beginPath();
  ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.9}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('f', x + size * 0.55, y + size * 0.55);
  
  ctx.restore();
}

function drawBracket(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  dx: number, dy: number,
  len: number,
) {
  ctx.beginPath();
  ctx.moveTo(cx, cy + dy * len);
  ctx.lineTo(cx, cy);
  ctx.lineTo(cx + dx * len, cy);
  ctx.stroke();
}

function textShadow(ctx: CanvasRenderingContext2D, opacity = 0.5) {
  ctx.shadowColor = `rgba(0,0,0,${opacity})`;
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
}

function clearShadow(ctx: CanvasRenderingContext2D) {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

// ── main draw routine ─────────────────────────────────────────────────────────

function draw(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  bgColor: string,
  userImg: HTMLImageElement | null,
  opts: FrameOptions,
) {
  const { W, H, photo, bannerH, footerH } = layout;
  const scale = (s: number) => Math.round(s * (W / 1080));

  // 1. Background
  ctx.fillStyle = (opts.frameId === 'circle') ? '#FFFFFF' : bgColor;
  ctx.fillRect(0, 0, W, H);

  // 2. User Photo
  ctx.save();
  ctx.beginPath();
  if (opts.frameId === 'circle') {
    const cx = W / 2, cy = H / 2;
    const r = scale(400);
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  } else {
    ctx.rect(photo.x, photo.y, photo.w, photo.h);
  }
  ctx.clip();
  ctx.fillStyle = bgColor;
  if (opts.frameId === 'circle') {
    ctx.beginPath();
    ctx.arc(W/2, H/2, scale(400), 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(photo.x, photo.y, photo.w, photo.h);
  }

  if (userImg && userImg.complete && userImg.naturalWidth !== 0) {
    const cx = photo.x + photo.w / 2, cy = photo.y + photo.h / 2;
    ctx.translate(cx + opts.position.x * (W / 400), cy + opts.position.y * (W / 400));
    ctx.rotate((opts.rotation * Math.PI) / 180);
    const ir = userImg.width / userImg.height;
    const pr = photo.w / photo.h;
    let dw, dh;
    if (ir > pr) { dh = photo.h * opts.scale; dw = dh * ir; }
    else { dw = photo.w * opts.scale; dh = dw / ir; }
    ctx.drawImage(userImg, -dw / 2, -dh / 2, dw, dh);
  } else if (opts.frameId !== 'circle') {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(photo.x, photo.y, photo.w, photo.h);
    ctx.fillStyle = GOLD;
    ctx.font = `bold ${scale(32)}px "Georgia", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('নির্বাচন করুন / SELECT PHOTO', photo.x + photo.w / 2, photo.y + photo.h / 2);
  }
  ctx.restore();

  if (opts.frameId === 'circle') {
    // 3. Circular Frame Design
    const cx = W / 2, cy = H / 2;
    const rOuter = scale(500);
    const rInner = scale(400);

    // Main Circle Background
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
    ctx.arc(cx, cy, rInner, 0, Math.PI * 2, true);
    ctx.fill();
    
    // Wreath
    drawWreath(ctx, cx, cy, rInner - scale(20), GOLD);

    // Borders
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = scale(4);
    ctx.beginPath(); ctx.arc(cx, cy, rOuter, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, rInner, 0, Math.PI * 2); ctx.stroke();
    
    ctx.lineWidth = scale(1);
    ctx.beginPath(); ctx.arc(cx, cy, rInner + scale(15), 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, rOuter - scale(15), 0, Math.PI * 2); ctx.stroke();

    // Curved Text
    ctx.fillStyle = GOLD;
    const rMid = rInner + (rOuter - rInner)/2;
    
    // Top Arc: Name
    ctx.font = `bold ${scale(42)}px "Georgia", serif`;
    drawCurvedText(ctx, 'HOLY CRESCENT SCHOOL', cx, cy, rMid, -Math.PI/2, true);

    // Bottom Arc: Bangla Tagline
    ctx.font = `bold ${scale(36)}px "Georgia", serif`;
    drawCurvedText(ctx, 'ঐতিহ্যের ২৫ বছরে,আগামীর অগ্রযাত্রায়...', cx, cy, rMid, Math.PI/2, false);

    // Stars at Left and Right sides to beautifully separate the text
    ctx.font = `${scale(52)}px serif`;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Right star (3 o'clock)
    ctx.fillText('★', rMid, 0);
    
    // Left star (9 o'clock)
    ctx.fillText('★', -rMid, 0);
    
    ctx.restore();

    ctx.restore();
    return;
  }

  // 3. Decorative Border (Rectangular)
  ctx.save();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = scale(3);
  const borderInset = scale(16);
  ctx.setLineDash([scale(12), scale(8)]);
  ctx.strokeRect(photo.x + borderInset, photo.y + borderInset, photo.w - borderInset*2, photo.h - borderInset*2);
  ctx.setLineDash([]);
  ctx.strokeStyle = GOLD;
  ctx.strokeRect(photo.x, photo.y, photo.w, photo.h);
  ctx.restore();

  // 4. Header
  const headerLayoutMid = photo.y / 2;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = GOLD;
  ctx.font = `${scale(40)}px serif`;
  ctx.fillText('★', scale(60), headerLayoutMid);
  ctx.fillText('★', W - scale(60), headerLayoutMid);
  ctx.font = `bold ${scale(56)}px "Georgia", serif`;
  ctx.fillText('HOLY CRESCENT SCHOOL', W / 2, headerLayoutMid - scale(15));
  ctx.font = `${scale(22)}px "Georgia", serif`;
  ctx.fillStyle = GOLD;
  ctx.fillText('হলি ক্রেসেন্ট স্কুল  •  রজত জয়ন্তী উৎসব ২০২৬', W / 2, headerLayoutMid + scale(32));
  ctx.restore();

  // 5. Banner
  const bannerTop = photo.y + photo.h;
  const bannerMid = bannerTop + bannerH / 2;
  ctx.save();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = scale(1);
  ctx.beginPath();
  ctx.moveTo(scale(180), bannerTop);
  ctx.lineTo(W - scale(180), bannerTop);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Badges
  const badgeR = scale(52);
  const lcx = scale(130), rcx = W - scale(130);
  ctx.strokeStyle = GOLD;
  ctx.beginPath(); ctx.arc(lcx, bannerMid, badgeR, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(rcx, bannerMid, badgeR, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.font = `bold ${scale(24)}px Arial`;
  ctx.fillText('HCS', lcx, bannerMid - scale(16));
  ctx.font = `${scale(14)}px Arial`;
  ctx.fillText('২০০১', lcx, bannerMid + scale(16));
  ctx.font = `bold ${scale(32)}px Georgia`;
  ctx.fillText('২৫', rcx, bannerMid - scale(14));
  ctx.font = `${scale(14)}px Georgia`;
  ctx.fillText('বছর পূর্তি', rcx, bannerMid + scale(18));

  // Banner Content
  ctx.font = `bold ${scale(32)}px "Georgia", serif`;
  // Shifted Bangla text down for better spacing
  ctx.fillText('ঐতিহ্যের ২৫ বছরে, আগামীর পথে অগ্রযাত্রা...', W / 2, bannerMid - scale(28));
  ctx.fillStyle = GOLD;
  ctx.font = `italic ${scale(20)}px "Georgia", serif`;
  ctx.fillText('"From Memories to Mentorship..."', W / 2, bannerMid + scale(12));
  ctx.fillStyle = GOLD;
  ctx.font = `bold ${scale(16)}px "Arial", sans-serif`;
  const alumniText = 'HOLY CRESCENT ALUMNI';
  ctx.fillText(alumniText, W / 2, bannerMid + scale(45));

  // Logo
  const logoSize = scale(32);
  const textWidth = ctx.measureText(alumniText).width;
  const logoX = W/2 - textWidth/2 - logoSize - scale(20);
  const logoY = bannerMid + scale(45) - logoSize/2;
  if (opts.frameId === 'facebook') drawFacebookLogo(ctx, logoX, logoY, logoSize, GOLD);
  if (opts.frameId === 'instagram') drawInstagramLogo(ctx, logoX, logoY, logoSize, GOLD);
  
  ctx.restore();

  // 6. Footer
  const footerY = bannerTop + bannerH;
  ctx.save();
  ctx.fillStyle = GOLD;
  ctx.font = `bold ${scale(15)}px "Arial"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ESTD. 2001  •  25TH ANNIVERSARY  •  2026', W / 2, footerY + footerH / 2);
  ctx.restore();
}

export async function generateFramedImage(
  userImageSrc: string | null,
  _frameSrc: string | null,
  options: FrameOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const layout = LAYOUTS[options.frameId || 'instagram'] || LAYOUTS.instagram;
    const { W, H } = layout;

    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject('Canvas context not found');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const userImg = new Image();
    userImg.crossOrigin = 'anonymous';

    const render = () => {
      draw(ctx, layout, options.bgColor || '#0F2169', 
        userImg.complete && userImg.naturalWidth ? userImg : null, 
        options
      );
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };

    if (userImageSrc) {
      userImg.onload = render;
      userImg.onerror = render;
      userImg.src = userImageSrc;
    } else {
      render();
    }
  });
}
