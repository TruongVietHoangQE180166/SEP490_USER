'use client';

import { useEffect, useRef } from 'react';
import { driver, Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { observer } from '@legendapp/state/react';

// ─── Lucide SVG helper ─────────────────────────────────────────────────────────
// driver.js renders plain HTML strings — React components cannot be used directly.
// We inline SVG paths from lucide-react as raw HTML strings instead.
const icon = (paths: string, color = 'currentColor') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    style="display:inline-block;vertical-align:-3px;margin-right:5px">${paths}</svg>`;

// SVG paths sourced from lucide.dev
const ICONS = {
  wallet:     icon('<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>'),
  trending:   icon('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>'),
  trendingDn: icon('<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>', '#ef5350'),
  trendingUp: icon('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>', '#26a69a'),
  chart:      icon('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
  candle:     icon('<path d="M9 5v4"/><rect width="4" height="6" x="7" y="9" rx="1"/><path d="M9 15v2"/><path d="M17 3v2"/><rect width="4" height="8" x="15" y="5" rx="1"/><path d="M17 13v3"/><path d="M3 3v18h18"/>'),
  clock:      icon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  book:       icon('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  cart:       icon('<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>'),
  arrows:     icon('<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>'),
  filetext:   icon('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/>'),
  tag:        icon('<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>'),
  hash:       icon('<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>'),
  sliders:    icon('<line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/><circle cx="12" cy="4" r="2"/><line x1="21" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="3" y2="12"/><circle cx="10" cy="12" r="2"/><line x1="21" y1="20" x2="16" y2="20"/><line x1="12" y1="20" x2="3" y2="20"/><circle cx="14" cy="20" r="2"/>'),
  shield:     icon('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'),
  shieldOk:   icon('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>', '#26a69a'),
  shieldX:    icon('<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>', '#ef5350'),
  rocket:     icon('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>'),
  dashboard:  icon('<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>'),
  crosshair:  icon('<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>'),
  orders:     icon('<line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-2-2-2"/>'),
  scroll:     icon('<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>'),
  history:    icon('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>'),
  party:      icon('<path d="M5.8 11.3 2 22l10.7-3.79"/><path d="M4 3h.01"/><path d="M22 8h.01"/><path d="M15 2h.01"/><path d="M22 20h.01"/><path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"/><path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17"/><path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7"/><path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2z"/>'),
  info:       icon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
  check:      icon('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
  alert:      icon('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
  pin:        icon('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>'),
};

// ─── Layout helpers ────────────────────────────────────────────────────────────
const row = (ico: string, label: string, desc: string) =>
  `<div style="display:flex;gap:8px;margin-bottom:8px;align-items:flex-start">
    <span style="margin-top:1px;flex-shrink:0">${ico}</span>
    <div><b>${label}</b>${desc ? `<br/><span style="color:#aaa;font-size:12px">${desc}</span>` : ''}</div>
  </div>`;

const tip = (text: string) =>
  `<div style="margin-top:10px;padding:8px 10px;background:rgba(255,255,255,0.05);border-left:3px solid #f0b90b;border-radius:4px;font-size:12px;color:#ccc">
    ${ICONS.info} <i>${text}</i>
  </div>`;

const warn = (text: string) =>
  `<div style="margin-top:10px;padding:8px 10px;background:rgba(239,83,80,0.08);border-left:3px solid #ef5350;border-radius:4px;font-size:12px;color:#ef9a9a">
    ${ICONS.alert} <i>${text}</i>
  </div>`;

// ─── Component ────────────────────────────────────────────────────────────────
export const TradingTutorial = observer(function TradingTutorial() {
  const isEnabled =
    typeof window !== 'undefined'
      ? localStorage.getItem('trading-tutorial-completed') !== 'true'
      : false;

  const driverRef = useRef<Driver | null>(null);

  const startTutorial = () => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      showButtons: ['next', 'previous', 'close'],
      doneBtnText: '✅ Hoàn thành',
      nextBtnText: 'Tiếp theo →',
      prevBtnText: '← Quay lại',
      progressText: 'Bước {{current}} / {{total}}',
      popoverClass: 'driverjs-theme',
      steps: [
        // ── 0: Giới thiệu ──────────────────────────────────────────────────────
        {
          popover: {
            title: `${ICONS.rocket} Chào mừng đến với Giao dịch Spot!`,
            description: `
              <p>Hướng dẫn này giúp bạn làm quen giao diện chỉ trong vài phút. Chúng ta sẽ đi qua:</p>
              <div style="margin-top:10px">
                ${row(ICONS.chart,     'Biểu đồ & Thông tin thị trường', 'Đọc giá, xu hướng và các chỉ số 24h')}
                ${row(ICONS.book,      'Sổ lệnh (Order Book)',           'Xem lực cung/cầu theo thời gian thực')}
                ${row(ICONS.cart,      'Bảng đặt lệnh Mua / Bán',       'Market, Limit và TP/SL')}
                ${row(ICONS.dashboard, 'Bảng quản lý lệnh',             'Theo dõi vị thế và lịch sử giao dịch')}
              </div>
              ${tip('Nhấn <b>Tiếp theo</b> để bắt đầu!')}
            `,
            align: 'center',
          },
        },

        // ── 1: Market header ───────────────────────────────────────────────────
        {
          element: '#tut-market-header',
          popover: {
            title: `${ICONS.pin} Thanh thông tin thị trường`,
            description: `
              <p>Tổng quan nhanh về cặp giao dịch đang xem (ví dụ: <b>XAUT/USDT</b>):</p>
              <div style="margin-top:10px">
                ${row(ICONS.tag,      'Tên cặp giao dịch', 'Biểu tượng và tên tài sản cơ sở / định giá')}
                ${row(ICONS.trending, 'Giá khớp gần nhất', 'Cập nhật liên tục theo thời gian thực')}
                ${row(ICONS.clock,    'Biến động 24h',     'Mức thay đổi % kể từ giá mở cửa hôm qua')}
              </div>
            `,
            side: 'bottom',
            align: 'start',
          },
        },

        // ── 2: Giá hiện tại ────────────────────────────────────────────────────
        {
          element: '#tut-market-price',
          popover: {
            title: `${ICONS.trending} Giá khớp lệnh hiện tại`,
            description: `
              <p>Con số lớn nhất trên màn hình — <b>giá giao dịch vừa được thực hiện</b>.</p>
              <div style="margin-top:10px">
                ${row(ICONS.trendingUp, '<span style="color:#26a69a">Màu xanh</span>', 'Giá đang tăng so với lần khớp trước')}
                ${row(ICONS.trendingDn, '<span style="color:#ef5350">Màu đỏ</span>',  'Giá đang giảm so với lần khớp trước')}
              </div>
              <p style="margin-top:8px;font-size:13px">Phần trăm bên cạnh (vd: <b style="color:#26a69a">+2.35%</b>) là mức biến động so với giá mở cửa 24h trước.</p>
            `,
            side: 'bottom',
            align: 'center',
          },
        },

        // ── 3: Chỉ số 24h ──────────────────────────────────────────────────────
        {
          element: '#tut-market-stats',
          popover: {
            title: `${ICONS.chart} Chỉ số giao dịch 24 giờ`,
            description: `
              <p>Số liệu thống kê trong <b>24 giờ qua</b>:</p>
              <div style="margin-top:10px">
                ${row(ICONS.trendingUp, 'Cao nhất (High)', 'Mức giá đỉnh trong ngày — hữu ích để đặt mục tiêu chốt lời')}
                ${row(ICONS.trendingDn, 'Thấp nhất (Low)', 'Mức giá đáy trong ngày — xác định vùng hỗ trợ')}
                ${row(ICONS.hash,       'Khối lượng (Vol)', 'Tổng XAUT giao dịch, phản ánh thanh khoản thị trường')}
              </div>
              ${tip('Khối lượng cao = thị trường sôi động, dễ vào/ra lệnh hơn.')}
            `,
            side: 'bottom',
            align: 'center',
          },
        },

        // ── 4: Biểu đồ ────────────────────────────────────────────────────────
        {
          element: '#tut-trading-chart',
          popover: {
            title: `${ICONS.candle} Biểu đồ nến (Candlestick)`,
            description: `
              <p>Công cụ phân tích kỹ thuật phổ biến nhất — mỗi nến đại diện cho một khoảng thời gian.</p>
              <div style="margin-top:10px">
                ${row(ICONS.trendingUp, 'Nến xanh', 'Giá đóng cửa <b>cao hơn</b> giá mở cửa → thị trường tăng')}
                ${row(ICONS.trendingDn, 'Nến đỏ',  'Giá đóng cửa <b>thấp hơn</b> giá mở cửa → thị trường giảm')}
                ${row(ICONS.sliders,    'Râu nến (Wick)', 'Mức giá cao nhất và thấp nhất đạt được trong kỳ')}
              </div>
              ${tip('Kéo để di chuyển biểu đồ, cuộn chuột để zoom in/out.')}
            `,
            side: 'right',
            align: 'start',
          },
        },

        // ── 5: Khung thời gian ─────────────────────────────────────────────────
        {
          element: '#tut-chart-timeframes',
          popover: {
            title: `${ICONS.clock} Khung thời gian biểu đồ`,
            description: `
              <p>Mỗi nến = một khoảng thời gian. Chọn khung phù hợp chiến lược:</p>
              <div style="margin-top:10px">
                ${row(ICONS.rocket,  '1s / 1m / 5m', 'Scalping — giao dịch siêu ngắn hạn, tốc độ cao')}
                ${row(ICONS.chart,   '15m / 1h',     'Intraday — giao dịch trong ngày')}
                ${row(ICONS.candle,  '4h / 1D',      'Swing trading — giữ lệnh vài ngày')}
                ${row(ICONS.history, '1W / 1M',      'Đầu tư dài hạn, phân tích xu hướng lớn')}
              </div>
              ${tip('Người mới nên bắt đầu với khung 1h hoặc 4h để dễ quan sát xu hướng.')}
            `,
            side: 'bottom',
            align: 'start',
          },
        },

        // ── 6: Order Book ──────────────────────────────────────────────────────
        {
          element: '#tut-order-book',
          popover: {
            title: `${ICONS.book} Sổ Lệnh (Order Book)`,
            description: `
              <p>Tất cả lệnh đang <b>chờ khớp</b> trên thị trường, cập nhật theo thời gian thực:</p>
              <div style="margin-top:10px">
                ${row(ICONS.trendingDn, '<span style="color:#ef5350">Phần trên — Asks (Bán)</span>', 'Lệnh bán đang chờ, giá thấp nhất ở phía dưới cùng')}
                ${row(ICONS.trendingUp, '<span style="color:#26a69a">Phần dưới — Bids (Mua)</span>', 'Lệnh mua đang chờ, giá cao nhất ở phía trên cùng')}
                ${row(ICONS.arrows,     'Spread',  'Khoảng chênh lệch giữa giá mua tốt nhất và giá bán tốt nhất')}
              </div>
              ${tip('Nhấp vào một mức giá trong sổ lệnh để tự động điền vào ô giá đặt lệnh.')}
            `,
            side: 'left',
            align: 'start',
          },
        },

        // ── 7: Bảng đặt lệnh ───────────────────────────────────────────────────
        {
          element: '#tut-order-panel',
          popover: {
            title: `${ICONS.cart} Bảng Đặt Lệnh`,
            description: `
              <p>Trung tâm điều khiển giao dịch — tất cả thao tác Mua / Bán đều tại đây:</p>
              <div style="margin-top:10px">
                ${row(ICONS.wallet,   'Số dư khả dụng',  'USDT và XAUT có thể dùng ngay')}
                ${row(ICONS.arrows,   'Chiều giao dịch', 'Mua hoặc Bán')}
                ${row(ICONS.filetext, 'Loại lệnh',       'Market (ngay lập tức) hay Limit (chờ giá mục tiêu)')}
                ${row(ICONS.tag,      'Giá & Số lượng',  'Mức giá và khối lượng muốn giao dịch')}
                ${row(ICONS.shield,   'TP / SL',         'Chốt lời & cắt lỗ tự động (tùy chọn)')}
              </div>
            `,
            side: 'left',
            align: 'start',
          },
        },

        // ── 8: Số dư ───────────────────────────────────────────────────────────
        {
          element: '#tut-order-wallet',
          popover: {
            title: `${ICONS.wallet} Số dư tài sản`,
            description: `
              <p>Hiển thị tài sản liên quan đến cặp giao dịch đang chọn:</p>
              <div style="margin-top:10px">
                ${row(ICONS.check,   'Khả dụng (Available)', 'Số tiền có thể dùng để đặt lệnh ngay bây giờ')}
                ${row(ICONS.shield,  'Bị khóa (Frozen)',     'Đang bị giữ bởi các lệnh Limit chưa khớp')}
              </div>
              <p style="margin-top:8px;font-size:13px">Ví dụ: Có <b>1,000 USDT</b>, đặt Limit mua 300 USDT chưa khớp → khả dụng còn <b>700 USDT</b>.</p>
              ${tip('Hủy lệnh chờ để giải phóng số dư bị khóa.')}
            `,
            side: 'left',
            align: 'start',
          },
        },

        // ── 9: Chiều giao dịch ─────────────────────────────────────────────────
        {
          element: '#tut-order-side',
          popover: {
            title: `${ICONS.arrows} Chọn chiều giao dịch`,
            description: `
              <div style="margin-top:4px">
                ${row(ICONS.trendingUp, '<span style="color:#26a69a">MUA (Buy)</span>', 'Dự đoán giá sẽ <b>tăng</b> → Mua XAUT bằng USDT, bán lại khi giá lên để kiếm lời')}
                ${row(ICONS.trendingDn, '<span style="color:#ef5350">BÁN (Sell)</span>', 'Muốn <b>chốt lời / cắt lỗ</b> → Bán XAUT lấy USDT khi giá phù hợp')}
              </div>
              ${tip('Giao dịch Spot chỉ cho phép bán tài sản bạn thực sự đang sở hữu.')}
            `,
            side: 'left',
            align: 'start',
          },
        },

        // ── 10: Loại lệnh ──────────────────────────────────────────────────────
        {
          element: '#tut-order-type',
          popover: {
            title: `${ICONS.filetext} Loại lệnh giao dịch`,
            description: `
              <div style="margin-top:4px">
                ${row(ICONS.rocket,     'Market (Thị trường)', 'Khớp <b>ngay lập tức</b> tại giá tốt nhất. Dùng khi cần vào lệnh nhanh, không quan tâm đến chênh lệch giá nhỏ.')}
                ${row(ICONS.crosshair,  'Limit (Giới hạn)',    'Đặt <b>giá cụ thể</b> muốn mua/bán. Lệnh sẽ chờ đến khi thị trường chạm đúng mức đó.')}
              </div>
              ${tip('Limit giúp bạn mua rẻ hơn hoặc bán đắt hơn giá thị trường hiện tại.')}
            `,
            side: 'left',
            align: 'start',
            onNextClick: () => {
              const limitBtn = document.querySelector('#tut-order-type button:nth-child(2)') as HTMLElement;
              if (limitBtn) limitBtn.click();
              setTimeout(() => { if (driverRef.current) driverRef.current.moveNext(); }, 50);
            },
          },
        },

        // ── 11: Giá đặt lệnh ───────────────────────────────────────────────────
        {
          element: '#tut-order-price',
          popover: {
            title: `${ICONS.tag} Giá đặt lệnh Limit`,
            description: `
              <p>Bạn đang ở chế độ <b>Limit</b> — nhập mức giá USDT bạn muốn thực hiện giao dịch.</p>
              <div style="margin-top:10px">
                ${row(ICONS.trendingUp, 'Ví dụ MUA', 'Giá hiện tại 3,200 USDT → đặt Limit Buy <b>3,150</b> để mua khi giá kéo về')}
                ${row(ICONS.trendingDn, 'Ví dụ BÁN', 'Đặt Limit Sell <b>3,400</b> để tự động bán khi giá bứt phá lên cao')}
              </div>
              ${tip('Nhấp vào mức giá trong Order Book để điền nhanh vào đây.')}
            `,
            side: 'left',
            align: 'start',
          },
        },

        // ── 12: Số lượng ───────────────────────────────────────────────────────
        {
          element: '#tut-order-amount',
          popover: {
            title: `${ICONS.hash} Số lượng giao dịch`,
            description: `
              <p>Đơn vị nhập thay đổi tùy theo chiều giao dịch:</p>
              <div style="margin-top:10px">
                ${row(ICONS.trendingUp, 'Khi MUA', 'Nhập số <b>USDT</b> bỏ ra → hệ thống tự tính lượng XAUT nhận được')}
                ${row(ICONS.trendingDn, 'Khi BÁN', 'Nhập số <b>XAUT</b> muốn bán → hệ thống tự tính USDT nhận về')}
              </div>
              ${warn('Đảm bảo số lượng không vượt quá số dư khả dụng của bạn.')}
            `,
            side: 'left',
            align: 'start',
          },
        },

        // ── 13: Thanh trượt ────────────────────────────────────────────────────
        {
          element: '#tut-order-slider',
          popover: {
            title: `${ICONS.sliders} Thanh trượt tỷ lệ %`,
            description: `
              <p>Chọn nhanh tỷ lệ tài sản muốn dùng thay vì tính thủ công:</p>
              <div style="margin-top:10px">
                ${row(ICONS.check, '25%', 'Dùng 1/4 số dư — rủi ro thấp, phù hợp thăm dò')}
                ${row(ICONS.check, '50%', 'Dùng nửa số dư — cân bằng cơ hội và rủi ro')}
                ${row(ICONS.check, '75%', 'Dùng 3/4 số dư — quyết liệt hơn, cần chắc chắn cao')}
                ${row(ICONS.check, '100%', 'Dùng toàn bộ số dư khả dụng hiện có')}
              </div>
              ${warn('Không nên all-in 100% vào một lệnh. Quản lý vốn tốt giúp bạn bền vững hơn.')}
            `,
            side: 'left',
            align: 'start',
            onNextClick: () => {
              const shortBtn = document.querySelector('#tut-order-side button:nth-child(2)') as HTMLElement;
              if (shortBtn) shortBtn.click();
              setTimeout(() => {
                const tpslBtn = document.querySelector('#tut-order-type button:nth-child(3)') as HTMLElement | null;
                if (tpslBtn) { tpslBtn.click(); } else {
                  const limitBtn = document.querySelector('#tut-order-type button:nth-child(2)') as HTMLElement;
                  if (limitBtn) limitBtn.click();
                }
                setTimeout(() => { if (driverRef.current) driverRef.current.moveNext(); }, 50);
              }, 50);
            },
          },
        },

        // ── 14: TP/SL ──────────────────────────────────────────────────────────
        {
          element: '#tut-order-tpsl',
          popover: {
            title: `${ICONS.shield} Chốt lời (TP) & Cắt lỗ (SL)`,
            description: `
              <p>Công cụ <b>quản lý rủi ro</b> quan trọng nhất — tự động đóng lệnh theo kịch bản định sẵn.</p>
              <div style="margin-top:10px">
                ${row(ICONS.shieldOk, '<span style="color:#26a69a">Take Profit (TP) — Chốt lời</span>', 'Tự động bán khi giá đạt mục tiêu. VD: Mua 3,200 → TP 3,400 (+6.25%)')}
                ${row(ICONS.shieldX,  '<span style="color:#ef5350">Stop Loss (SL) — Cắt lỗ</span>',    'Tự động bán khi giá chạm ngưỡng chịu lỗ. VD: Mua 3,200 → SL 3,100 (-3.1%)')}
              </div>
              ${warn('Luôn đặt Stop Loss để bảo vệ tài khoản — kể cả khi bạn rất tự tin vào lệnh.')}
            `,
            side: 'left',
            align: 'start',
          },
        },

        // ── 15: Nút đặt lệnh ───────────────────────────────────────────────────
        {
          element: '#tut-order-submit',
          popover: {
            title: `${ICONS.rocket} Xác nhận & Vào Lệnh`,
            description: `
              <p>Sau khi điền đủ thông tin, nhấn nút này để <b>gửi lệnh vào thị trường</b>.</p>
              <p style="margin-top:8px">Checklist trước khi nhấn:</p>
              <div style="margin-top:8px">
                ${row(ICONS.check, 'Chiều giao dịch',  'Mua hay Bán?')}
                ${row(ICONS.check, 'Loại lệnh',        'Market hay Limit?')}
                ${row(ICONS.check, 'Giá & Số lượng',   'Đã kiểm tra kỹ chưa?')}
                ${row(ICONS.check, 'TP / SL',          'Đã thiết lập chưa? (khuyến nghị)')}
              </div>
              ${warn('Lệnh Market khớp ngay và <b>không thể hủy</b>. Lệnh Limit có thể hủy khi còn đang chờ.')}
            `,
            side: 'left',
            align: 'end',
          },
        },

        // ── 16: Dashboard ──────────────────────────────────────────────────────
        {
          element: '#tut-trade-dashboard',
          popover: {
            title: `${ICONS.dashboard} Bảng Quản Lý Lệnh`,
            description: `
              <p>Phía dưới màn hình — nơi <b>theo dõi và quản lý</b> toàn bộ hoạt động giao dịch:</p>
              <div style="margin-top:10px">
                ${row(ICONS.crosshair, 'Vị thế mở',      'Lệnh đã khớp, đang giữ và theo dõi PnL')}
                ${row(ICONS.orders,    'Lệnh chờ khớp',  'Lệnh Limit/TP/SL chưa được thực thi')}
                ${row(ICONS.scroll,    'Lịch sử lệnh',   'Tất cả lệnh từ trước đến nay')}
                ${row(ICONS.history,   'Lịch sử vị thế', 'Các vị thế đã đóng và lãi/lỗ thực tế')}
              </div>
            `,
            side: 'top',
            align: 'start',
          },
        },

        // ── 17: Tab vị thế mở ──────────────────────────────────────────────────
        {
          element: '#tut-dashboard-tab-positions',
          popover: {
            title: `${ICONS.crosshair} Tab: Vị thế đang mở`,
            description: `
              <p>Liệt kê tất cả lệnh đã <b>khớp và đang giữ</b>. Với mỗi vị thế bạn có thể xem:</p>
              <div style="margin-top:10px">
                ${row(ICONS.tag,      'Giá vào (Entry)',     'Giá bạn đã mua/bán khi vào lệnh')}
                ${row(ICONS.trending, 'Giá hiện tại (Mark)', 'Giá thị trường đang giao dịch lúc này')}
                ${row(ICONS.chart,    'PnL (Lãi / Lỗ)',     'Lợi nhuận hoặc thua lỗ tạm thời (chưa hiện thực hóa)')}
                ${row(ICONS.shield,   'TP / SL đã đặt',     'Mục tiêu chốt lời & ngưỡng cắt lỗ đang áp dụng')}
              </div>
              ${tip('Nhấn nút Đóng để thoát vị thế thủ công bất kỳ lúc nào.')}
            `,
            side: 'top',
            align: 'start',
          },
        },

        // ── 18: Tab lệnh chờ ───────────────────────────────────────────────────
        {
          element: '#tut-dashboard-tab-orders',
          popover: {
            title: `${ICONS.orders} Tab: Lệnh chờ khớp`,
            description: `
              <p>Danh sách các <b>lệnh Limit / TP / SL</b> đang chờ thị trường chạm đến mức giá đặt:</p>
              <div style="margin-top:10px">
                ${row(ICONS.arrows,  'Cặp & chiều',  'Cặp giao dịch và chiều Mua/Bán')}
                ${row(ICONS.tag,     'Giá mục tiêu', 'Mức giá lệnh sẽ được thực thi')}
                ${row(ICONS.hash,    'Số lượng',     'Khối lượng đang chờ khớp')}
                ${row(ICONS.shield,  'TP / SL kèm',  'Cài đặt bảo vệ đi kèm lệnh (nếu có)')}
                ${row(ICONS.clock,   'Thời gian đặt','Mốc thời gian lệnh được gửi vào hệ thống')}
              </div>
              ${tip('Nhấn <b>Hủy</b> để rút lệnh về và giải phóng số dư đang bị khóa.')}
            `,
            side: 'top',
            align: 'start',
          },
        },

        // ── 19: Tab lịch sử lệnh ───────────────────────────────────────────────
        {
          element: '#tut-dashboard-tab-orderHistory',
          popover: {
            title: `${ICONS.scroll} Tab: Lịch sử lệnh`,
            description: `
              <p>Toàn bộ lịch sử <b>tất cả các lệnh</b> bạn từng đặt — đã khớp, đã hủy và hết hạn:</p>
              <div style="margin-top:10px">
                ${row(ICONS.check,   'Lệnh đã khớp', 'Chi tiết giá và khối lượng thực tế được thực thi')}
                ${row(ICONS.alert,   'Lệnh đã hủy',  'Lý do hủy và thời điểm hủy lệnh')}
                ${row(ICONS.clock,   'Mốc thời gian','Lịch sử sắp xếp từ gần nhất đến xa nhất')}
              </div>
              ${tip('Dùng tab này để phân tích thói quen và rút kinh nghiệm giao dịch.')}
            `,
            side: 'top',
            align: 'start',
          },
        },

        // ── 20: Tab lịch sử vị thế ─────────────────────────────────────────────
        {
          element: '#tut-dashboard-tab-positionHistory',
          popover: {
            title: `${ICONS.history} Tab: Lịch sử vị thế`,
            description: `
              <p>Các <b>vị thế đã đóng</b> — giúp thống kê hiệu quả giao dịch tổng thể:</p>
              <div style="margin-top:10px">
                ${row(ICONS.tag,     'Giá vào / đóng', 'Mức giá khi vào lệnh và khi đóng lệnh')}
                ${row(ICONS.clock,   'Thời gian giữ',  'Bao lâu bạn đã duy trì vị thế')}
                ${row(ICONS.chart,   'Realized PnL',   'Lãi/lỗ thực tế đã được hiện thực hóa')}
                ${row(ICONS.info,    'Lý do đóng',     'Thủ công, TP đã khớp, hay SL đã kích hoạt')}
              </div>
              ${tip('Thường xuyên xem lại để cải thiện tỷ lệ thắng và chiến lược quản lý vốn.')}
            `,
            side: 'top',
            align: 'start',
          },
        },

        // ── 21: Kết thúc ───────────────────────────────────────────────────────
        {
          popover: {
            title: `${ICONS.party} Bạn đã sẵn sàng giao dịch!`,
            description: `
              <p>Chúc mừng! Bạn vừa hoàn thành hướng dẫn sử dụng nền tảng Spot Trading.</p>
              <p style="margin-top:10px"><b>Tóm tắt những gì bạn đã học:</b></p>
              <div style="margin-top:8px">
                ${row(ICONS.check, 'Đọc biểu đồ & thông tin thị trường', '')}
                ${row(ICONS.check, 'Phân tích sổ lệnh Order Book', '')}
                ${row(ICONS.check, 'Đặt lệnh Market và Limit', '')}
                ${row(ICONS.check, 'Thiết lập Take Profit & Stop Loss', '')}
                ${row(ICONS.check, 'Quản lý và theo dõi lệnh hiệu quả', '')}
              </div>
              ${tip('Bạn có thể xem lại hướng dẫn bất cứ lúc nào qua menu Trợ giúp.')}
              <p style="margin-top:12px;text-align:center;font-size:15px">Chúc bạn giao dịch thành công! ${ICONS.rocket}</p>
            `,
            align: 'center',
          },
        },
      ],

      onDestroyStarted: () => {
        localStorage.setItem('trading-tutorial-completed', 'true');
        driverObj.destroy();
      },
    });

    driverRef.current = driverObj;
    driverObj.drive();
  };

  useEffect(() => {
    if (isEnabled) {
      const timer = setTimeout(() => startTutorial(), 1000);
      return () => clearTimeout(timer);
    }
  }, [isEnabled]);

  useEffect(() => {
    const handleStartTutorial = () => startTutorial();
    window.addEventListener('start-trading-tutorial', handleStartTutorial);
    return () => window.removeEventListener('start-trading-tutorial', handleStartTutorial);
  }, []);

  return null;
});