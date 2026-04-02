export interface FrameOptions {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  bgColor?: string;
  frameId?: string;
}

const GOLD = '#CEB888';
const GOLD_LIGHT = '#E5D5B0';
const GOLD_DIM = 'rgba(206,184,136,0.78)';

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
    photo: { x: 50, y: 80, w: 1100, h: 320 },
    bannerH: 180,
    footerH: 48,
  },
};

// ── helpers ──────────────────────────────────────────────────────────────────

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
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, W, H);

  const grad = ctx.createRadialGradient(W/2, H/2, W/4, W/2, H/2, W);
  grad.addColorStop(0, 'rgba(255,255,255,0.02)');
  grad.addColorStop(1, 'rgba(0,0,0,0.12)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // 2. User Photo
  ctx.save();
  ctx.beginPath();
  ctx.rect(photo.x, photo.y, photo.w, photo.h);
  ctx.clip();
  ctx.fillStyle = bgColor;
  ctx.fillRect(photo.x, photo.y, photo.w, photo.h);

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
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(photo.x, photo.y, photo.w, photo.h);
    ctx.fillStyle = GOLD;
    ctx.font = `bold ${scale(32)}px "Georgia", serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('নির্বাচন করুন / SELECT PHOTO', photo.x + photo.w / 2, photo.y + photo.h / 2);
  }
  ctx.restore();

  // 3. Decorative Border
  ctx.save();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = scale(3);
  const borderInset = scale(16);
  ctx.setLineDash([scale(12), scale(8)]);
  ctx.strokeRect(photo.x + borderInset, photo.y + borderInset, photo.w - borderInset*2, photo.h - borderInset*2);
  ctx.setLineDash([]);
  ctx.strokeStyle = GOLD_DIM;
  ctx.strokeRect(photo.x, photo.y, photo.w, photo.h);
  ctx.restore();

  // 4. Header
  const headerMid = photo.y / 2;
  ctx.save();
  textShadow(ctx, 0.4);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = GOLD;
  ctx.font = `${scale(40)}px serif`;
  ctx.fillText('★', scale(60), headerMid);
  ctx.fillText('★', W - scale(60), headerMid);
  ctx.font = `bold ${scale(64)}px "Georgia", serif`;
  ctx.fillText('HOLY CRESCENT SCHOOL', W / 2, headerMid - scale(15));
  ctx.font = `${scale(26)}px "Georgia", serif`;
  ctx.fillStyle = GOLD_LIGHT;
  ctx.fillText('হলি ক্রেসেন্ট স্কুল  •  রজত জয়ন্তী উৎসব ২০২৬', W / 2, headerMid + scale(32));
  clearShadow(ctx);
  ctx.restore();

  // 5. Banner
  const bannerTop = photo.y + photo.h;
  const bannerMid = bannerTop + bannerH / 2;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0, bannerTop, W, bannerH);
  ctx.strokeStyle = GOLD_DIM;
  ctx.lineWidth = scale(1);
  ctx.beginPath();
  ctx.moveTo(scale(180), bannerTop);
  ctx.lineTo(W - scale(180), bannerTop);
  ctx.stroke();

  textShadow(ctx, 0.4);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Badges
  const badgeR = scale(52);
  const lcx = scale(130), rcx = W - scale(130);
  ctx.strokeStyle = GOLD;
  ctx.beginPath(); ctx.arc(lcx, bannerMid, badgeR, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(rcx, bannerMid, badgeR, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.font = `bold ${scale(26)}px Arial`;
  ctx.fillText('HCS', lcx, bannerMid - scale(16));
  ctx.font = `${scale(16)}px Arial`;
  ctx.fillText('২০০১', lcx, bannerMid + scale(16));
  ctx.font = `bold ${scale(36)}px Georgia`;
  ctx.fillText('২৫', rcx, bannerMid - scale(14));
  ctx.font = `${scale(16)}px Georgia`;
  ctx.fillText('বছর পূর্তি', rcx, bannerMid + scale(18));

  // Banner Content
  ctx.font = `bold ${scale(36)}px "Georgia", serif`;
  ctx.fillText('ঐতিহ্যের ২৫ বছরে, আগামীর পথে অগ্রযাত্রা...', W / 2, bannerMid - scale(42));
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `italic ${scale(24)}px "Georgia", serif`;
  ctx.fillText('"From Memories to Mentorship..."', W / 2, bannerMid);
  ctx.fillStyle = GOLD_LIGHT;
  ctx.font = `bold ${scale(18)}px "Arial", sans-serif`;
  const alumniText = 'HOLY CRESCENT ALUMNI';
  ctx.fillText(alumniText, W / 2, bannerMid + scale(42));

  // Logo
  const logoSize = scale(32);
  const textWidth = ctx.measureText(alumniText).width;
  const logoX = W/2 - textWidth/2 - logoSize - scale(20);
  const logoY = bannerMid + scale(42) - logoSize/2;
  if (opts.frameId === 'facebook') drawFacebookLogo(ctx, logoX, logoY, logoSize, GOLD);
  if (opts.frameId === 'instagram') drawInstagramLogo(ctx, logoX, logoY, logoSize, GOLD);
  
  clearShadow(ctx);
  ctx.restore();

  // 6. Footer
  const footerY = bannerTop + bannerH;
  ctx.save();
  ctx.fillStyle = GOLD_DIM;
  ctx.font = `bold ${scale(18)}px "Arial"`;
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
