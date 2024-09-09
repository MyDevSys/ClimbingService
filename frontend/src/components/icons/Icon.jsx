import React from "react";

// アイコンコンポーネント用のテンプレートコンポーネント
const IconTemplate = ({ width = "24", height = "24", className, style, children, ...props }) => (
  <svg
    width={`${width}px`}
    height={`${height}px`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 96 96"
    className={className}
    style={style}
    {...props}
  >
    {children}
  </svg>
);

// 登山の休憩ポイントのポップアップアイコン
export const RestPopup = (props) => (
  <IconTemplate {...props}>
    <path
      d="M74 32h-8v-4-.5c1.2-.7 2-2 2-3.5 0-2.2-1.8-4-4-4H16c-2.2 0-4 1.8-4 4 0 1.5.8 2.8 2 3.5V70c0 5.5 4.5 10 10 10h32c5.5 0 10-4.5 10-10v-2h8c5.5 0 10-4.5 10-10V42c0-5.5-4.5-10-10-10zM58 70c0 1.1-.9 2-2 2H24c-1.1 0-2-.9-2-2V28h36v42zm18-12c0 1.1-.9 2-2 2h-8V40h8c1.1 0 2 .9 2 2v16z"
      fill="currentColor"
    />
  </IconTemplate>
);

// 登山の走行ペースアイコン
export const PaceIcon = (props) => (
  <IconTemplate {...props}>
    <path
      d="M84 48c0-9.6-3.7-18.7-10.5-25.5-7-7-16.1-10.5-25.3-10.5H48c-9.2 0-18.3 3.5-25.3 10.5C15.7 29.3 12 38.4 12 48s3.7 18.7 10.5 25.5c.8.8 1.8 1.2 2.8 1.2 1 0 2-.4 2.8-1.2l4.7-4.7c1.6-1.6 1.6-4.1 0-5.7-1.6-1.6-4.1-1.6-5.7 0l-1.6 1.6c-2.8-3.8-4.6-8.1-5.3-12.8H24c2.2 0 4-1.8 4-4s-1.8-4-4-4h-3.7c.7-4.6 2.5-9 5.3-12.8l1.6 1.6C28 33.6 29 34 30 34c1 0 2-.4 2.8-1.2 1.6-1.6 1.6-4.1 0-5.7l-1.6-1.6c3.8-2.9 8.2-4.6 12.8-5.3V22c0 2.2 1.8 4 4 4s4-1.8 4-4v-1.7c4.5.6 8.9 2.4 12.8 5.3l-1.6 1.6c-1.6 1.6-1.6 4.1 0 5.7.8.8 1.8 1.2 2.8 1.2 1 0 2-.4 2.8-1.2l1.6-1.6c2.8 3.8 4.6 8.1 5.3 12.8H73c-2.2 0-4 1.8-4 4s1.8 4 4 4h2.7c-.7 4.6-2.5 9-5.3 12.8l-1.6-1.6c-1.6-1.6-4.1-1.6-5.7 0-1.6 1.6-1.6 4.1 0 5.7l4.7 4.7c.8.8 1.8 1.2 2.8 1.2 1 0 2-.4 2.8-1.2C80.3 66.7 84 57.6 84 48z"
      fill="currentColor"
    ></path>
    <path
      d="M55.5 34.9L44.7 43l-.1.1-.4.3-.2.2c-.1.1-.1.1-.2.1 0 0 0 .1-.1.1-.1.1-.2.2-.3.4-1.9 2.4-1.8 5.8.4 8s5.8 2.3 8.1.3l.2-.2.1-.1c.1-.1.2-.2.2-.3l.1-.1.2-.2c.1-.1.2-.2.3-.4l8-10.7c1.2-1.6 1-3.8-.4-5.2-1.3-1.4-3.5-1.6-5.1-.4z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 登山の撮影ポイントのポップアップアイコン
export const CameraPopup = (props) => (
  <IconTemplate {...props}>
    <path
      d="M48 30c-11.6 0-21 9.4-21 21s9.4 21 21 21 21-9.4 21-21-9.4-21-21-21zm0 34c-7.2 0-13-5.8-13-13s5.8-13 13-13 13 5.8 13 13-5.8 13-13 13z"
      fill="currentColor"
    ></path>
    <path
      d="M76 24h-5.9l-4.4-6.7c-2.2-3.3-6-5.3-10-5.3H40.3c-4 0-7.8 2-10 5.3L25.9 24H20c-6.6 0-12 5.4-12 12v36c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12V36c0-6.6-5.4-12-12-12zm4 48c0 2.2-1.8 4-4 4H20c-2.2 0-4-1.8-4-4V36c0-2.2 1.8-4 4-4h8c1.3 0 2.6-.7 3.3-1.8l5.6-8.4c.7-1.1 2-1.8 3.3-1.8h15.4c1.3 0 2.6.7 3.3 1.8l5.6 8.4c.7 1.1 2 1.8 3.3 1.8h8c2.2 0 4 1.8 4 4v36h.2z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 登頂した山のアイコン
export const MountainIcon = (props) => (
  <IconTemplate {...props}>
    <path
      d="M86.7 65.2L74.5 43c-2.1-3.9-6.1-6.3-10.5-6.3-1.9 0-3.7.5-5.4 1.3l-7.7-15.3C48.8 18.5 44.6 16 40 16c-4.7 0-8.9 2.6-10.9 6.8L9.4 62.3c-1.9 3.8-1.7 8.3.5 11.9 2.3 3.6 6.2 5.8 10.4 5.8H78c3.6 0 6.8-1.8 8.6-4.9 1.8-3.1 1.8-6.8.1-9.9zM20.2 72c-1.5 0-2.8-.7-3.6-2-.8-1.3-.9-2.8-.2-4.2l19.7-39.5c.7-1.5 2.2-2.4 3.8-2.4 1.6 0 3.1.9 3.8 2.3l9 17.9L37.6 72H20.2zm59.4-1c-.2.3-.7 1-1.7 1H46.7l13.8-25.2c1-1.9 2.8-2.1 3.5-2.1.7 0 2.5.2 3.5 2.1L79.6 69c.5.9.2 1.7 0 2z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 登山計画のアイコン
export const PlanIcon = (props) => (
  <IconTemplate {...props}>
    <path
      d="M32 64h20c2.2 0 4-1.8 4-4s-1.8-4-4-4H32c-2.2 0-4 1.8-4 4s1.8 4 4 4zM32 48h32c2.2 0 4-1.8 4-4s-1.8-4-4-4H32c-2.2 0-4 1.8-4 4s1.8 4 4 4z"
      fill="currentColor"
    ></path>
    <path
      d="M72 16v-4c0-2.2-1.8-4-4-4s-4 1.8-4 4v4H32v-4c0-2.2-1.8-4-4-4s-4 1.8-4 4v4c-6.6 0-12 5.4-12 12v48c0 6.6 5.4 12 12 12h48c6.6 0 12-5.4 12-12V28c0-6.6-5.4-12-12-12zm4 60c0 2.2-1.8 4-4 4H24c-2.2 0-4-1.8-4-4V32h56v44z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 登山のタグアイコン
export const TagIcon = (props) => (
  <IconTemplate {...props}>
    <path
      d="M83.1 44.9L79.3 26c-1-4.8-4.6-8.5-9.4-9.4L51 12.8c-3.9-.8-8 .4-10.8 3.3L12.1 44.2c-4.7 4.7-4.7 12.3 0 17l22.6 22.6c2.3 2.3 5.4 3.5 8.5 3.5 3.1 0 6.1-1.2 8.5-3.5l28.1-28.1c2.9-2.8 4.1-6.8 3.3-10.8zm-8.9 5.2L46.1 78.2c-1.6 1.6-4.1 1.6-5.7 0L17.8 55.6c-1.6-1.6-1.6-4.1 0-5.7l28.1-28.1c.8-.8 1.8-1.2 2.8-1.2.3 0 .5 0 .8.1l18.9 3.8c1.6.3 2.8 1.6 3.1 3.1l3.8 18.9c.2 1.3-.2 2.7-1.1 3.6z"
      fill="currentColor"
    ></path>
    <path d="M58.8 44a6.8 6.8 0 100-13.6 6.8 6.8 0 000 13.6z" fill="currentColor"></path>
  </IconTemplate>
);

// GPXファイルのアイコン
export const GPXIcon = (props) => (
  <IconTemplate {...props}>
    <path
      d="M79.4 56H16.6C11.86 56 8 59.86 8 64.6v14.8c0 4.74 3.86 8.6 8.6 8.6h62.8c4.74 0 8.6-3.86 8.6-8.6V64.6c0-4.74-3.86-8.6-8.6-8.6zM36.09 79.15c-1.96 2.73-4.99 4.17-8.76 4.17-6.77 0-11.32-4.5-11.32-11.21 0-6.71 4.63-11.44 11.52-11.44 4.18 0 7.37 1.82 9.23 5.25.09.17.11.38.04.57-.07.19-.21.34-.39.42l-3.9 1.64c-.09.04-.18.05-.27.05a.71.71 0 01-.63-.39c-.88-1.79-2.42-2.77-4.33-2.77-3.59 0-5.52 3.45-5.52 6.7s1.96 6.65 5.6 6.65c2.57 0 4.24-1.38 4.45-3.69h-3.8c-.39 0-.7-.32-.7-.7v-2.93c0-.39.32-.7.7-.7h9.53c.19 0 .37.08.51.21.13.14.2.32.2.51-.07 2.35-.3 5.07-2.15 7.67l-.01-.01zm14.48-3.57h-3.13v6.34c0 .39-.32.7-.7.7h-4.11c-.39 0-.7-.32-.7-.7V62.09c0-.39.32-.7.7-.7h7.75c4.98 0 7.72 2.48 7.72 6.98 0 4.85-2.46 7.21-7.52 7.21h-.01zm28.66 7.38h-4.14c-.32 0-.63-.17-.8-.44L70 75.82a.383.383 0 00-.64 0l-4.29 6.7c-.17.27-.48.44-.8.44h-4.14c-.61 0-.98-.69-.63-1.19l7.12-10.29c.09-.13.09-.3 0-.43L60.7 62.1a.762.762 0 01.64-1.18h4.15c.34 0 .65.18.82.47l3.03 5.24c.15.25.51.25.66 0l3.03-5.24c.17-.29.48-.47.82-.47H78c.61 0 .97.68.64 1.18l-5.92 8.95c-.09.13-.08.3 0 .43l7.12 10.29a.757.757 0 01-.63 1.19h.02z"
      fill="currentColor"
    ></path>
    <path
      d="M48.37 65.83h-.93v5.3h.93c2.4 0 3.97-.18 3.97-2.59 0-2.41-1.5-2.7-3.97-2.7v-.01zM53.1 10.1A7.14 7.14 0 0048.03 8c-1.84 0-3.67.7-5.07 2.1l-15.2 15.2a4.008 4.008 0 000 5.66 4.008 4.008 0 005.66 0l10.62-10.62.03 27.66c0 2.21 1.79 4 4 4s4-1.79 4-4l-.03-27.66 10.62 10.62a4.008 4.008 0 005.66 0 4.008 4.008 0 000-5.66l-15.2-15.2h-.02z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 登山の開始ポイントのポップアップアイコン
export const StartPopup = ({ width = "97", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} viewBox="0 0 97 96" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(9 8)">
      <circle cx="40" cy="40" fill="#0052cf" r="40" />
      <path
        d="m47.43 51.23c0-1.61-.532-2.855-1.595-3.733-1.064-.879-2.971-1.81-5.723-2.793-5.755-1.82-10.018-3.77-12.791-5.851s-4.16-5.088-4.16-9.02c0-3.828 1.653-6.924 4.957-9.288 3.305-2.363 7.5-3.545 12.588-3.545 5.045 0 9.179 1.302 12.4 3.906 3.22 2.604 4.78 5.956 4.675 10.056l-.062.188h-10.259c0-1.82-.615-3.3-1.845-4.44s-2.93-1.71-5.098-1.71c-2.126 0-3.794.471-5.004 1.413-1.209.94-1.814 2.102-1.814 3.482 0 1.339.61 2.41 1.83 3.216 1.22.805 3.508 1.815 6.865 3.028 5.17 1.548 9.064 3.451 11.68 5.71 2.618 2.261 3.926 5.365 3.926 9.319 0 4.016-1.558 7.158-4.675 9.428s-7.25 3.404-12.4 3.404c-5.17 0-9.643-1.302-13.417-3.906-3.773-2.604-5.608-6.354-5.504-11.248l.063-.188h10.289c0 2.635.709 4.518 2.126 5.647 1.418 1.13 3.565 1.695 6.443 1.695 2.189 0 3.82-.439 4.894-1.317 1.074-.879 1.61-2.03 1.61-3.452z"
        fill="#fff"
        fillRule="nonzero"
      />
    </g>
  </IconTemplate>
);

// 登山の終了ポイントのポップアップアイコン
export const EndPopup = ({ width = "97", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} viewBox="0 0 97 96" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(9 8)">
      <circle cx="40" cy="40" fill="#cf0010" r="40" />
      <path
        d="m58 56.183c-1.51 1.801-3.704 3.388-6.582 4.76-2.877 1.371-6.49 2.057-10.836 2.057-5.51 0-9.985-1.7-13.424-5.097-3.438-3.399-5.158-7.81-5.158-13.235v-9.336c0-5.384 1.679-9.785 5.036-13.204 3.357-3.418 7.678-5.128 12.964-5.128 5.735 0 10.03 1.33 12.888 3.992 2.857 2.661 4.48 6.295 4.867 10.901l-.061.184h-9.704c-.347-2.354-1.107-4.125-2.28-5.312-1.174-1.187-2.965-1.781-5.373-1.781s-4.347.957-5.817 2.871c-1.469 1.914-2.204 4.386-2.204 7.416v9.397c0 3.111.725 5.614 2.174 7.508 1.449 1.893 3.48 2.84 6.092 2.84 1.898 0 3.387-.154 4.469-.46 1.082-.308 1.939-.717 2.571-1.229v-7.063h-7.01v-6.878h17.388z"
        fill="#fff"
        fillRule="nonzero"
      />
    </g>
  </IconTemplate>
);

// 登山の宿泊ポイントのアイコン
export const StayPlaceIcon = ({ width = "30", height = "30", ...props }) => (
  <IconTemplate width={width} height={height} viewBox="0 0 30 30" {...props}>
    <g fill="none" fillRule="evenodd">
      <circle cx="15" cy="15" fill="#7f7f7f" r="14" />
      <image
        height="30"
        width="30"
        href="data:image/png;base64,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"
      />
    </g>
  </IconTemplate>
);

// DoMoポイントのアイコン
export const DoMoIcon = ({ filled, width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    {filled ? (
      <>
        <path
          d="M87.1 37.5c-2.3-6.9-8.4-11.7-15.6-12.1l-5.2-.3-1.9-4.9c-2.7-6.7-9.1-11-16.3-11h-.8c-6.9.3-13 4.6-15.5 11L29.7 25l-5.2.3c-7.4.5-13.8 5.7-15.8 12.9-1.9 6.6.4 13.8 5.7 18.3l4 3.3-1.3 5c-1.8 7.2 1.1 14.9 7.3 19 2.9 1.9 6.3 2.9 9.7 2.9 3.4 0 6.6-.9 9.4-2.7l4.4-2.8 4.4 2.8c2.8 1.8 6.1 2.7 9.4 2.7 3.9 0 7.8-1.3 10.9-3.8 5.4-4.3 7.8-11.4 6.1-18.2l-1.3-5.1 4-3.3c5.8-4.4 7.9-11.9 5.7-18.8zM66.9 53.6c-.1.9-.3 1.7-.6 2.6-1 3.1-2.5 5.7-4.6 7.9-1.7 1.7-3.7 3.1-5.9 4.2-2.3 1-4.7 1.6-7.3 1.6H35.3c-.7 0-1.3-.6-1.3-1.3V33.3c0-.7.6-1.3 1.3-1.3h13.3c2.6 0 5 .5 7.2 1.6 2.3 1 4.2 2.4 5.9 4.1 1.7 1.7 3 3.7 4 6 1.2 3.1 1.6 6.4 1.2 9.9z"
          fill="currentColor"
        ></path>
        <path
          d="M53.9 43.4c-.9-.9-2-1.7-3.4-2.2-1.3-.5-2.8-.8-4.5-.8h-2.3v21.1H46c1.7 0 3.2-.3 4.6-.8 1.3-.5 2.5-1.3 3.4-2.2.9-.9 1.6-2 2.1-3.3.5-1.3.7-2.7.7-4.2s-.3-2.9-.8-4.2c-.4-1.4-1.2-2.5-2.1-3.4z"
          fill="currentColor"
        ></path>
      </>
    ) : (
      <>
        <path
          d="M87 37.3c-2.5-7.8-9.5-13.2-17.6-13.7l-2.2-.1-.8-2C63.4 13.9 56.2 9 48 9h-.9c-7.8.4-14.7 5.2-17.5 12.4l-.8 2-2.2.1C18.2 24.2 11 30 8.7 38.1c-2.1 7.5.4 15.6 6.5 20.6l1.7 1.4-.5 2.1c-2.1 8.2 1.2 16.8 8.2 21.5 3.3 2.2 7.1 3.3 11 3.3 3.8 0 7.4-1.1 10.6-3.1l1.8-1.2 1.8 1.2c3.2 2 6.8 3.1 10.7 3.1 4.4 0 8.8-1.5 12.3-4.3 6.1-4.8 8.8-12.9 6.9-20.5l-.5-2.1 1.7-1.4c6.2-5.2 8.7-13.6 6.1-21.4zM75.7 52.5l-3.6 3c-1.2 1-1.7 2.6-1.3 4.1l1.2 4.6c1.2 4.6-.5 9.4-4.1 12.3-2.1 1.6-4.7 2.5-7.3 2.5-2.3 0-4.5-.6-6.4-1.8l-4-2.5c-.7-.5-1.5-.7-2.2-.7-.7 0-1.5.2-2.1.6l-4 2.5C40 78.3 37.8 79 35.5 79c-2.3 0-4.6-.7-6.5-2-4.2-2.8-6.2-7.9-4.9-12.8l1.2-4.5c.4-1.5-.1-3.1-1.3-4.1l-3.6-3c-3.6-3-5.1-7.9-3.9-12.3 1.4-4.8 5.6-8.3 10.6-8.6l4.7-.3c1.5-.1 2.9-1.1 3.5-2.5l1.7-4.4c1.7-4.3 5.8-7.2 10.5-7.4 5.1-.2 9.7 2.7 11.5 7.4l1.7 4.4c.6 1.4 1.9 2.4 3.5 2.5l4.7.3c4.9.3 9 3.5 10.5 8.2 1.5 4.5.1 9.6-3.7 12.6z"
          fill="currentColor"
        ></path>
        <path
          d="M61.6 37.8C60 36 58 34.7 55.7 33.6c-2.3-1-4.7-1.6-7.2-1.6H35.3c-.7 0-1.3.6-1.3 1.3v35.2c0 .7.6 1.3 1.3 1.3h13.3c2.6 0 5-.5 7.3-1.6 2.3-1 4.2-2.4 5.9-4.2 2.1-2.2 3.7-4.8 4.6-7.9.3-.8.5-1.7.6-2.6.5-3.5 0-6.8-1.3-9.8-1.1-2.2-2.4-4.2-4.1-5.9zm-5.5 17.4c-.5 1.3-1.2 2.4-2.1 3.3-.9.9-2 1.7-3.4 2.2-1.3.5-2.9.8-4.6.8h-2.3V40.4H46c1.7 0 3.2.3 4.5.8 1.3.5 2.5 1.3 3.4 2.2.9.9 1.6 2.1 2.1 3.4.5 1.3.8 2.7.8 4.2s-.2 2.9-.7 4.2z"
          fill="currentColor"
        ></path>
      </>
    )}
  </IconTemplate>
);

// コンテンツ作成ボタンのアイコン
export const CreateIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M80 44c-2.2 0-4 1.8-4 4v24c0 2.2-1.8 4-4 4H24c-2.2 0-4-1.8-4-4V24c0-2.2 1.8-4 4-4h24c2.2 0 4-1.8 4-4s-1.8-4-4-4H24c-6.6 0-12 5.4-12 12v48c0 6.6 5.4 12 12 12h48c6.6 0 12-5.4 12-12V48c0-2.2-1.8-4-4-4z"
      fill="currentColor"
    ></path>
    <path
      d="M85.7 18.8l-8.5-8.5C75.7 8.8 73.7 8 71.5 8c-2.1 0-4.1.8-5.7 2.3L39.2 37c-1.2 1.2-2.1 2.5-2.7 4L32 52.2c-1.4 3.4-.6 7.1 2 9.7 1.7 1.7 4 2.7 6.3 2.7 1.1 0 2.3-.2 3.4-.7l11.2-4.5c1.5-.6 2.9-1.5 4-2.7l26.6-26.6c1.5-1.5 2.3-3.5 2.3-5.7.2-2.1-.6-4.1-2.1-5.6zM53.4 51.1c-.4.4-.8.7-1.3.9l-11.2 4.5c-.4.2-.8.1-1.1-.2-.3-.3-.4-.7-.2-1.1L44 44c.2-.5.5-1 .9-1.3l16-16 8.5 8.5-16 15.9zm21.7-21.7l-8.5-8.5 4.9-4.9 8.5 8.5-4.9 4.9z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 通知ボタンのアイコン
export const BellIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M80.4 62.3L76 51.2V40c0-12.9-8.7-23.7-20.6-27-1.2-2.9-4.1-5-7.4-5-3.3 0-6.2 2.1-7.4 5C28.7 16.3 20 27.1 20 40v11.2l-4.4 11.1c-1.2 3.1-.9 6.6 1 9.3 1.9 2.8 5 4.4 8.3 4.4h7.7c1.8 6.9 8 12 15.5 12 7.4 0 13.7-5.1 15.5-12h7.7c3.3 0 6.4-1.6 8.3-4.4 1.7-2.7 2.1-6.2.8-9.3zM48 80c-3 0-5.5-1.6-6.9-4h13.8c-1.4 2.4-3.9 4-6.9 4zm24.8-12.9c-.2.3-.7.9-1.7.9H24.8c-.9 0-1.4-.6-1.7-.9-.2-.3-.5-1-.2-1.9l5-12.5V40c0-11 9-20 20-20s20 9 20 20v12.8l5 12.5c.4.8.1 1.5-.1 1.8z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 検索ボタンのアイコン
export const SearchIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M86.8 81.2L68.7 63c4.6-5.8 7.3-13.1 7.3-21C76 23.3 60.7 8 42 8S8 23.3 8 42s15.3 34 34 34c7.9 0 15.2-2.7 21-7.3l18.1 18.1C82 87.6 83 88 84 88s2-.4 2.8-1.2c1.6-1.5 1.6-4.1 0-5.6zM16 42c0-14.3 11.7-26 26-26s26 11.7 26 26-11.7 26-26 26-26-11.7-26-26z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 活動日記ボタンのアイコン
export const DiaryIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M68 12H20c-2.2 0-4 1.8-4 4v60c0 2.2 1.8 4 4 4h8v4c0 2.2 1.8 4 4 4s4-1.8 4-4v-4h32c6.6 0 12-5.4 12-12V24c0-6.6-5.4-12-12-12zm-44 8h32v52H24V20zm48 48c0 2.2-1.8 4-4 4h-4V20h4c2.2 0 4 1.8 4 4v44z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 写真数を表すアイコン
export const CameraIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M48 64c7.18 0 13-5.82 13-13s-5.82-13-13-13-13 5.82-13 13 5.82 13 13 13z"
      fill="currentColor"
    ></path>
    <path
      d="M76 24h-5.9l-4.4-6.7c-2.2-3.3-6-5.3-10-5.3H40.3c-4 0-7.8 2-10 5.3L25.9 24H20c-6.6 0-12 5.4-12 12v36c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12V36c0-6.6-5.4-12-12-12zM48 72c-11.6 0-21-9.4-21-21s9.4-21 21-21 21 9.4 21 21-9.4 21-21 21z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// DoMoポイントを表すアイコン
export const PointIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M87.1 37.5c-2.3-6.9-8.4-11.7-15.6-12.1l-5.2-.3-1.9-4.9c-2.7-6.7-9.1-11-16.3-11h-.8c-6.9.3-13 4.6-15.5 11L29.7 25l-5.2.3c-7.4.5-13.8 5.7-15.8 12.9-1.9 6.6.4 13.8 5.7 18.3l4 3.3-1.3 5c-1.8 7.2 1.1 14.9 7.3 19 2.9 1.9 6.3 2.9 9.7 2.9 3.4 0 6.6-.9 9.4-2.7l4.4-2.8 4.4 2.8c2.8 1.8 6.1 2.7 9.4 2.7 3.9 0 7.8-1.3 10.9-3.8 5.4-4.3 7.8-11.4 6.1-18.2l-1.3-5.1 4-3.3c5.8-4.4 7.9-11.9 5.7-18.8zM66.9 53.6c-.1.9-.3 1.7-.6 2.6-1 3.1-2.5 5.7-4.6 7.9-1.7 1.7-3.7 3.1-5.9 4.2-2.3 1-4.7 1.6-7.3 1.6H35.3c-.7 0-1.3-.6-1.3-1.3V33.3c0-.7.6-1.3 1.3-1.3h13.3c2.6 0 5 .5 7.2 1.6 2.3 1 4.2 2.4 5.9 4.1 1.7 1.7 3 3.7 4 6 1.2 3.1 1.6 6.4 1.2 9.9z"
      fill="currentColor"
    ></path>
    <path
      d="M53.9 43.4c-.9-.9-2-1.7-3.4-2.2-1.3-.5-2.8-.8-4.5-.8h-2.3v21.1H46c1.7 0 3.2-.3 4.6-.8 1.3-.5 2.5-1.3 3.4-2.2.9-.9 1.6-2 2.1-3.3.5-1.3.7-2.7.7-4.2s-.3-2.9-.8-4.2c-.4-1.4-1.2-2.5-2.1-3.4z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 登山の走行時間を表すアイコン
export const WatchIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M52 20.2V16h4c2.2 0 4-1.8 4-4s-1.8-4-4-4H40c-2.2 0-4 1.8-4 4s1.8 4 4 4h4v4.2c-16.9 2-30 16.4-30 33.8 0 18.7 15.3 34 34 34s34-15.3 34-34c0-17.4-13.1-31.8-30-33.8zM52 54c0 1.7-1.1 3.2-2.7 3.8l-15 5c-.5.1-.9.2-1.3.2-1.7 0-3.2-1.1-3.8-2.7-.7-2.1.4-4.4 2.5-5.1L44 51.1V34.7c0-2.2 1.8-4 4-4s4 1.8 4 4V54z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 登山の走行距離を表すアイコン
export const DistanceIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M70.6 60c-3 0-5.5 1.6-6.9 4H54c-5.5 0-10 4.5-10 10 0 1.1-.9 2-2 2h-9.7c-1.4-2.4-4-4-6.9-4-4.4 0-8 3.6-8 8s3.6 8 8 8c3 0 5.5-1.6 6.9-4H42c5.5 0 10-4.5 10-10 0-1.1.9-2 2-2h9.7c1.4 2.4 4 4 6.9 4 4.4 0 8-3.6 8-8s-3.6-8-8-8zM25.4 20C15.8 20 8 27.8 8 37.4v1c0 3.2.9 6.3 2.5 9l11.1 18.5c1.8 2.9 6 2.9 7.7 0l11.1-18.5c1.6-2.7 2.5-5.8 2.5-9v-1c0-9.6-7.8-17.4-17.5-17.4zm0 24.8c-4.1 0-7.4-3.3-7.4-7.4 0-4.1 3.3-7.4 7.4-7.4 4.1 0 7.4 3.3 7.4 7.4 0 4.1-3.3 7.4-7.4 7.4zM70.6 8C61 8 53.2 15.8 53.2 25.4v1c0 3.2.9 6.3 2.5 9l11.1 18.5c1.8 2.9 6 2.9 7.7 0l11.1-18.5c1.6-2.7 2.5-5.8 2.5-9v-1C88 15.8 80.2 8 70.6 8zm0 24.9c-4.1 0-7.4-3.3-7.4-7.4 0-4.1 3.3-7.4 7.4-7.4 4.1 0 7.4 3.3 7.4 7.4 0 4-3.3 7.4-7.4 7.4z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 登山の登った距離を表すアイコン
export const UpIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M82.8 25.2l-12-12c-.2-.2-.4-.4-.6-.5-.1-.1-.2-.1-.3-.2-.1-.1-.2-.1-.4-.2-.1-.1-.3-.1-.4-.1-.1 0-.2-.1-.3-.1-.5-.1-1.1-.1-1.6 0-.1 0-.2.1-.3.1-.1 0-.3.1-.4.1-.1.1-.3.1-.4.2-.1.1-.2.1-.3.2-.2.1-.4.3-.6.5l-12 12c-1.6 1.6-1.6 4.1 0 5.7 1.6 1.6 4.1 1.6 5.7 0l5.2-5.2V44c0 2.2-1.8 4-4 4h-12c-6.6 0-12 5.4-12 12v12c0 2.2-1.8 4-4 4h-16c-2.2 0-4 1.8-4 4s1.8 4 4 4h16c6.6 0 12-5.4 12-12V60c0-2.2 1.8-4 4-4h12c6.6 0 12-5.4 12-12V25.7l5.2 5.2c.8.8 1.8 1.2 2.8 1.2 1 0 2-.4 2.8-1.2 1.5-1.6 1.5-4.2-.1-5.7z"
      fill="currentColor"
    ></path>
  </IconTemplate>
);

// 左矢印(ダブル)のアイコン(カレンダーで使用)
export const DoubleLeftArrow = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} viewBox="0 -960 960 960" {...props}>
    <path d="M442-267.69 229.69-480 442-692.31 465.31-669 275.54-480l189.77 189L442-267.69Zm265 0L494.69-480 707-692.31 730.31-669 540.54-480l189.77 189L707-267.69Z" />
  </IconTemplate>
);

// 左矢印(シングル)のアイコン(カレンダーで使用)
export const LeftArrow = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} viewBox="0 -960 960 960" {...props}>
    <path d="M576-267.69 363.69-480 576-692.31 599.31-669l-189 189 189 189L576-267.69Z" />
  </IconTemplate>
);

// 右矢印(ダブル)のアイコン(カレンダーで使用)
export const DoubleRightArrow = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} viewBox="0 -960 960 960" {...props}>
    <path d="M419.46-480 229.69-669 253-692.31 465.31-480 253-267.69 229.69-291l189.77-189Zm265 0L494.69-669 518-692.31 730.31-480 518-267.69 494.69-291l189.77-189Z" />
  </IconTemplate>
);

// 右矢印(シングル)のアイコン(カレンダーで使用)
export const RightArrow = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} viewBox="0 -960 960 960" {...props}>
    <path d="m549.69-480-189-189L384-692.31 596.31-480 384-267.69 360.69-291l189-189Z" />
  </IconTemplate>
);

// プレミアムユーザーを表すアイコン
export const PremiumIcon = ({ width = "96", height = "96", ...props }) => (
  <IconTemplate width={width} height={height} {...props}>
    <path
      d="M64 0H32C14.4 0 0 14.4 0 32V64C0 81.6 14.4 96 32 96H64C81.6 96 96 81.6 96 64V32C96 14.4 81.6 0 64 0Z"
      fill="white"
    />
    <path
      d="M64 8H32C18.8 8 8 18.8 8 32V64C8 77.2 18.8 88 32 88H64C77.2 88 88 77.2 88 64V32C88 18.8 77.2 8 64 8ZM80 64C80 72.8 72.8 80 64 80H32C23.2 80 16 72.8 16 64V32C16 23.2 23.2 16 32 16H64C72.8 16 80 23.2 80 32V64Z"
      fill="black"
    />
    <path
      d="M51.1 26H33.4C32.6 26 32 26.6 32 27.4V68.5C32 69.3 32.6 69.9 33.4 69.9H42.4C43.2 69.9 43.8 69.3 43.8 68.5V55.5H51.1C60.2 55.5 65.8 49.9 65.8 40.8C65.8 31.7 60.3 26 51.1 26ZM48.7 46.5H43.9V35H48.7C52.2 35 54.4 37.2 54.4 40.7C54.4 44.3 52.3 46.5 48.7 46.5Z"
      fill="black"
    />
  </IconTemplate>
);

// 走行タイムを表すアイコン
export const TimerIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="M329-840v-111h302v111H329Zm96 468h110v-243H425v243Zm55 353q-82 0-153.51-30.89-71.5-30.89-125-84Q148-187 117-258.5 86-330 86-412t31.09-153.45q31.09-71.46 84.55-124.91 53.45-53.46 124.91-84.55Q398-806 480-806q64 0 125 20t112 59l68-68 79 79-68 68q39 51 58.5 111.5T874-412q0 82-31 153.5t-84.49 124.61q-53.5 53.11-125 84Q562-19 480-19Zm0-126q112 0 190-77.5T748-412q0-112-78-190t-190-78q-112 0-190 78t-78 190q0 112 78 189.5T480-145Zm0-267Z" />
  </IconTemplate>
);

// 走行距離を表すアイコン
export const WalkIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="m262-25 110-558-47 19v139H214v-214l222-89q17-7 34.5-7.5T505-731q17 5 31 16t24 27l42 64q24 38 68 63.5T775-535v110q-69 0-127-23t-99-61l-16 84 82 79v321H505v-249l-61-57-69 306H262Zm290-730q-40 0-67.5-28T457-851q0-40 27.5-67.5T552-946q40 0 68 27.5t28 67.5q0 40-28 68t-68 28Z" />
  </IconTemplate>
);

// 登山の登った距離を表すアイコン
export const NorthEastIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="m214-128-88-88 451-451H345v-126h446v446H665v-232L214-128Z" />
  </IconTemplate>
);

// 登山の下った距離を表すアイコン
export const SouthEastIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="M345-169v-126h232L126-746l88-88 451 451v-232h126v446H345Z" />
  </IconTemplate>
);

// 登山の消費カロリ－を表すアイコン
export const HeatIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="M266-400q0 31 8 59.5t25 54.5q6-25 18.5-46.5T349-373l131-130 132 130q19 19 31.5 40.5T661-286q16-26 24.5-54.5T694-400q0-39-13.1-75.6-13.11-36.61-37.9-65.4-20 9-41 14t-41 5q-58 0-106-33t-69-87q-29.15 27.92-51.58 57.96Q312-554 297-523.5T274-462q-8 31-8 62Zm214 74-42.75 41.8q-8.25 8.21-12.75 18.66-4.5 10.46-4.5 21.65Q420-220 437.68-203q17.67 17 42.5 17 24.82 0 42.32-17.1Q540-220.21 540-244q0-11-4.43-21.3-4.44-10.31-12.57-18.7l-43-42Zm20-546v164q0 25.5 17.7 42.75T561-648q13.59 0 25.3-6 11.7-6 20.7-17l28-35q86 49 135.5 131.5T820-400q0 142.37-98.81 241.19Q622.38-60 480-60q-142.37 0-241.19-98.81Q140-257.63 140-400q0-136 96-262t264-210Z" />
  </IconTemplate>
);

// コース定数を表すアイコン
export const HikingIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="m261-17 127-639q7-35 32-52.5t54-17.5q26 0 50 12t38 35l39 64q18 30 38.5 48t45.5 26v-73h90v597h-90v-408q-37-8-71.5-26.5T549-499l-16 83 82 78v321H505v-247l-60-57-69 304H261Zm-2-376-91-19q-25-5-39-26.5t-9-46.5l30-157q8-41 44-65.5t77-15.5l52 11-64 319Zm281-362q-39 0-67-28.5T445-851q0-39 28-67t67-28q39 0 67 28t28 67q0 39-28 67.5T540-755Z" />
  </IconTemplate>
);

// 平均ペースを表すアイコン
export const MeterIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-240q60 0 117 17.5T704-252q46-46 71-104.5T800-480q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 65 24.5 124T256-252q50-33 107-50.5T480-320Zm0 80q-41 0-80 10t-74 30q35 20 74 30t80 10q41 0 80-10t74-30q-35-20-74-30t-80-10ZM280-520q17 0 28.5-11.5T320-560q0-17-11.5-28.5T280-600q-17 0-28.5 11.5T240-560q0 17 11.5 28.5T280-520Zm120-120q17 0 28.5-11.5T440-680q0-17-11.5-28.5T400-720q-17 0-28.5 11.5T360-680q0 17 11.5 28.5T400-640Zm280 120q17 0 28.5-11.5T720-560q0-17-11.5-28.5T680-600q-17 0-28.5 11.5T640-560q0 17 11.5 28.5T680-520ZM480-400q33 0 56.5-23.5T560-480q0-13-4-25.5T544-528l54-136q7-16 .5-31.5T576-718q-15-7-30.5-.5T524-696l-54 136q-30 5-50 27.5T400-480q0 33 23.5 56.5T480-400Zm0 80Zm0-206Zm0 286Z" />
  </IconTemplate>
);

// メニューボタンのアイコン
export const MenuIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
  </IconTemplate>
);

// ログアウトボタンのアイコン
export const LogoutIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
  </IconTemplate>
);

// 閉じるボタンのアイコン
export const CloseIcon = ({ width = "24", height = "24", ...props }) => (
  <IconTemplate width={width} height={height} {...props} viewBox="0 -960 960 960">
    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
  </IconTemplate>
);
