import React from 'react';

function AgentChatIllustration() {
  return (
    <div className="relative w-full aspect-[290/260] max-w-[290px]">
      <div className="absolute left-500 border-dashed border-image-none top-[3px] border-[length:1.5px] border-[#ff3c00] rounded-[50%] w-[250px] h-[250px]" />
      <div className="flex absolute top-0 items-center gap-100 border border-solid border-image-none py-200 px-250 font-brand left-[45px] [backdrop-filter:blur(17px)] border-[#191818] rounded-[7px] [background:white] w-[162px] h-[50px] text-[#191818] text-[length:10.4px] tracking-[-0.03em]">
        Make my idea come true
        <span className="inline-block border-l h-300 border-[#191818] PlatformCards-module__Z0omxa__agentChatCursor" />
      </div>
      <div className="flex absolute right-0 justify-center items-center gap-100 py-0 px-300 font-brand top-[112px] [backdrop-filter:blur(17px)] rounded-[7px] [background:#ff3c00] w-[89px] h-[38px] text-[white] text-[length:10.4px] tracking-[-0.03em]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="8" cy="8" rx="3.5" ry="7" stroke="currentColor" strokeWidth="1.2" />
          <path d="M1 8h14" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        Publish
      </div>
      <div className="flex absolute bottom-0 left-0 justify-center items-center gap-100 border border-solid border-image-none rounded-6 py-0 px-200 font-brand [backdrop-filter:blur(7px)] border-[#191818] [background:white] w-[88px] h-[41px] text-[#191818] text-[length:10.4px] tracking-[-0.03em]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        Agent
      </div>
    </div>
  );
}

function InfraIllustration() {
  return (
    <svg width="140" height="213" viewBox="0 0 140 213" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.75" y="0.75" width="138.5" height="211.5" rx="20.0376" stroke="#FF3C00" strokeWidth="1.5" />
      <mask id="path-2-inside-1_566_924" fill="white">
        <path d="M118 12.5C123.523 12.5 128 16.9772 128 22.5V46.5C128 52.0228 123.523 56.5 118 56.5H76C74.8954 56.5 74 57.3954 74 58.5C74 59.6046 74.8954 60.5 76 60.5H118C123.523 60.5 128 64.9772 128 70.5V94.5C128 100.023 123.523 104.5 118 104.5H76C74.8954 104.5 74 105.395 74 106.5C74 107.605 74.8954 108.5 76 108.5H118C123.523 108.5 128 112.977 128 118.5V142.5C128 148.023 123.523 152.5 118 152.5H76C74.8954 152.5 74 153.395 74 154.5C74 155.605 74.8954 156.5 76 156.5H118C123.523 156.5 128 160.977 128 166.5V190.5C128 196.023 123.523 200.5 118 200.5H22C16.4772 200.5 12 196.023 12 190.5V166.5C12 160.977 16.4772 156.5 22 156.5H64C65.1046 156.5 66 155.605 66 154.5C66 153.395 65.1046 152.5 64 152.5H22C16.4772 152.5 12 148.023 12 142.5V118.5C12 112.977 16.4772 108.5 22 108.5H64C65.1046 108.5 66 107.605 66 106.5C66 105.395 65.1046 104.5 64 104.5H22C16.4772 104.5 12 100.023 12 94.5V70.5C12 64.9772 16.4772 60.5 22 60.5H64C65.1046 60.5 66 59.6046 66 58.5C66 57.3954 65.1046 56.5 64 56.5H22C16.4772 56.5 12 52.0228 12 46.5V22.5C12 16.9772 16.4772 12.5 22 12.5H118Z" />
      </mask>
      <path d="M118 12.5C123.523 12.5 128 16.9772 128 22.5V46.5C128 52.0228 123.523 56.5 118 56.5H76C74.8954 56.5 74 57.3954 74 58.5C74 59.6046 74.8954 60.5 76 60.5H118C123.523 60.5 128 64.9772 128 70.5V94.5C128 100.023 123.523 104.5 118 104.5H76C74.8954 104.5 74 105.395 74 106.5C74 107.605 74.8954 108.5 76 108.5H118C123.523 108.5 128 112.977 128 118.5V142.5C128 148.023 123.523 152.5 118 152.5H76C74.8954 152.5 74 153.395 74 154.5C74 155.605 74.8954 156.5 76 156.5H118C123.523 156.5 128 160.977 128 166.5V190.5C128 196.023 123.523 200.5 118 200.5H22C16.4772 200.5 12 196.023 12 190.5V166.5C12 160.977 16.4772 156.5 22 156.5H64C65.1046 156.5 66 155.605 66 154.5C66 153.395 65.1046 152.5 64 152.5H22C16.4772 152.5 12 148.023 12 142.5V118.5C12 112.977 16.4772 108.5 22 108.5H64C65.1046 108.5 66 107.605 66 106.5C66 105.395 65.1046 104.5 64 104.5H22C16.4772 104.5 12 100.023 12 94.5V70.5C12 64.9772 16.4772 60.5 22 60.5H64C65.1046 60.5 66 59.6046 66 58.5C66 57.3954 65.1046 56.5 64 56.5H22C16.4772 56.5 12 52.0228 12 46.5V22.5C12 16.9772 16.4772 12.5 22 12.5H118Z" fill="#DBD4CF" />
      <path d="M118 12.5V11V12.5ZM128 22.5H129.5H128ZM128 46.5H129.5H128ZM118 56.5V58V56.5ZM118 60.5V59V60.5ZM128 70.5H129.5H128ZM128 94.5H129.5H128ZM118 104.5V106V104.5ZM118 108.5V107V108.5ZM128 118.5H129.5H128ZM128 142.5H129.5H128ZM118 152.5V154V152.5ZM118 156.5V155V156.5ZM128 166.5H129.5H128ZM128 190.5H129.5H128ZM118 200.5V202V200.5ZM22 200.5V202V200.5ZM12 190.5H10.5H12ZM12 166.5H10.5H12ZM22 156.5V155V156.5ZM22 152.5V154V152.5ZM12 142.5H10.5H12ZM12 118.5H10.5H12ZM22 108.5V107V108.5ZM22 104.5V106V104.5ZM12 94.5H10.5H12ZM12 70.5H10.5H12ZM22 60.5V59V60.5ZM22 56.5V58V56.5ZM12 46.5H10.5H12ZM12 22.5H10.5H12ZM22 12.5V11V12.5ZM118 12.5V14C122.694 14 126.5 17.8056 126.5 22.5H129.5C129.5 16.1487 124.351 11 118 11V12.5ZM128 22.5H126.5V46.5H129.5V22.5H128ZM128 46.5H126.5C126.5 51.1944 122.694 55 118 55V58C124.351 58 129.5 52.8513 129.5 46.5H128ZM118 56.5V55H76V58H118V56.5ZM76 60.5V62H118V59H76V60.5ZM118 60.5V62C122.694 62 126.5 65.8056 126.5 70.5H129.5C129.5 64.1487 124.351 59 118 59V60.5ZM128 70.5H126.5V94.5H129.5V70.5H128ZM128 94.5H126.5C126.5 99.1944 122.694 103 118 103V106C124.351 106 129.5 100.851 129.5 94.5H128ZM118 104.5V103H76V106H118V104.5ZM76 108.5V110H118V107H76V108.5ZM118 108.5V110C122.694 110 126.5 113.806 126.5 118.5H129.5C129.5 112.149 124.351 107 118 107V108.5ZM128 118.5H126.5V142.5H129.5V118.5H128ZM128 142.5H126.5C126.5 147.194 122.694 151 118 151V154C124.351 154 129.5 148.851 129.5 142.5H128ZM118 152.5V151H76V154H118V152.5ZM76 156.5V158H118V155H76V156.5ZM118 156.5V158C122.694 158 126.5 161.806 126.5 166.5H129.5C129.5 160.149 124.351 155 118 155V156.5ZM128 166.5H126.5V190.5H129.5V166.5H128ZM128 190.5H126.5C126.5 195.194 122.694 199 118 199V202C124.351 202 129.5 196.851 129.5 190.5H128ZM118 200.5V199H22V202H118V200.5ZM22 200.5V199C17.3056 199 13.5 195.194 13.5 190.5H10.5C10.5 196.851 15.6487 202 22 202V200.5ZM12 190.5H13.5V166.5H10.5V190.5H12ZM12 166.5H13.5C13.5 161.806 17.3056 158 22 158V155C15.6487 155 10.5 160.149 10.5 166.5H12ZM22 156.5V158H64V155H22V156.5ZM64 152.5V151H22V154H64V152.5ZM22 152.5V151C17.3056 151 13.5 147.194 13.5 142.5H10.5C10.5 148.851 15.6487 154 22 154V152.5ZM12 142.5H13.5V118.5H10.5V142.5H12ZM12 118.5H13.5C13.5 113.806 17.3056 110 22 110V107C15.6487 107 10.5 112.149 10.5 118.5H12ZM22 108.5V110H64V107H22V108.5ZM64 104.5V103H22V106H64V104.5ZM22 104.5V103C17.3056 103 13.5 99.1944 13.5 94.5H10.5C10.5 100.851 15.6487 106 22 106V104.5ZM12 94.5H13.5V70.5H10.5V94.5H12ZM12 70.5H13.5C13.5 65.8056 17.3056 62 22 62V59C15.6487 59 10.5 64.1487 10.5 70.5H12ZM22 60.5V62H64V59H22V60.5ZM64 56.5V55H22V58H64V56.5ZM22 56.5V55C17.3056 55 13.5 51.1944 13.5 46.5H10.5C10.5 52.8513 15.6487 58 22 58V56.5ZM12 46.5H13.5V22.5H10.5V46.5H12ZM12 22.5H13.5C13.5 17.8056 17.3056 14 22 14V11C15.6487 11 10.5 16.1487 10.5 22.5H12ZM22 12.5V14H118V11H22V12.5ZM74 154.5H72.5C72.5 156.433 74.067 158 76 158V155C75.7239 155 75.5 154.776 75.5 154.5H74ZM64 60.5V62C65.933 62 67.5 60.433 67.5 58.5H64.5C64.5 58.7761 64.2761 59 64 59V60.5ZM76 56.5V55C74.067 55 72.5 56.567 72.5 58.5H75.5C75.5 58.2239 75.7239 58 76 58V56.5ZM66 154.5H67.5C67.5 152.567 65.933 151 64 151V154C64.2761 154 64.5 154.224 64.5 154.5H66ZM74 58.5H72.5C72.5 60.433 74.067 62 76 62V59C75.7239 59 75.5 58.7761 75.5 58.5H74ZM66 58.5H67.5C67.5 56.567 65.933 55 64 55V58C64.2761 58 64.5 58.2239 64.5 58.5H66ZM76 152.5V151C74.067 151 72.5 152.567 72.5 154.5H75.5C75.5 154.224 75.7239 154 76 154V152.5ZM76 104.5V103C74.067 103 72.5 104.567 72.5 106.5H75.5C75.5 106.224 75.7239 106 76 106V104.5ZM66 106.5H67.5C67.5 104.567 65.933 103 64 103V106C64.2761 106 64.5 106.224 64.5 106.5H66ZM74 106.5H72.5C72.5 108.433 74.067 110 76 110V107C75.7239 107 75.5 106.776 75.5 106.5H74ZM64 108.5V110C65.933 110 67.5 108.433 67.5 106.5H64.5C64.5 106.776 64.2761 107 64 107V108.5ZM64 156.5V158C65.933 158 67.5 156.433 67.5 154.5H64.5C64.5 154.776 64.2761 155 64 155V156.5Z" fill="#191818" mask="url(#path-2-inside-1_566_924)" />
      <text fill="#191818" fontFamily="'Replit Diatype', sans-serif" fontWeight="400" fontSize="11.7" letterSpacing="-0.03em" textAnchor="middle" dominantBaseline="central">
        <tspan x="70" y="34.5">Authentication</tspan>
        <tspan x="70" y="82.5">Database</tspan>
        <tspan x="70" y="130.5">Hosting</tspan>
        <tspan x="70" y="178.5">Monitoring</tspan>
      </text>
    </svg>
  );
}

function IntegrationsIllustration() {
  return (
    <svg viewBox="0 0 362 272" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full aspect-[362/272]">
      <path d="M232.707 54.3909C232.707 42.7275 232.707 36.8959 235.953 32.9875C236.507 32.3202 237.121 31.7056 237.788 31.1515C241.697 27.906 247.529 27.906 259.192 27.906C270.855 27.906 276.687 27.906 280.595 31.1515C281.263 31.7056 281.877 32.3202 282.431 32.9875C285.677 36.8959 285.677 42.7275 285.677 54.3909C285.677 66.0543 285.677 71.8859 282.431 75.7943C281.877 76.4616 281.263 77.0762 280.595 77.6303C276.687 80.8758 270.855 80.8758 259.192 80.8758C247.529 80.8758 241.697 80.8758 237.788 77.6303C237.121 77.0762 236.507 76.4616 235.953 75.7943C232.707 71.8859 232.707 66.0543 232.707 54.3909Z" fill="#FAF6F1" />
      <g clipPath="url(#clip0_896_28043)">
        <path d="M271.336 51.8377C271.974 49.9215 271.755 47.8224 270.734 46.0795C269.198 43.4062 266.112 42.0308 263.097 42.6781C261.756 41.1673 259.829 40.3081 257.809 40.3204C254.728 40.3134 251.994 42.2973 251.046 45.2292C249.067 45.6345 247.358 46.8736 246.358 48.6297C244.811 51.296 245.164 54.657 247.23 56.9434C246.592 58.8596 246.812 60.9586 247.833 62.7016C249.368 65.3749 252.455 66.7503 255.469 66.103C256.81 67.6138 258.737 68.473 260.757 68.4598C263.84 68.4677 266.575 66.482 267.523 63.5475C269.502 63.1422 271.211 61.9031 272.211 60.147C273.756 57.4807 273.403 54.1223 271.337 51.8359L271.336 51.8377ZM260.759 66.621C259.525 66.6227 258.33 66.191 257.383 65.4004C257.426 65.3775 257.501 65.3362 257.549 65.3063L263.152 62.0702C263.439 61.9075 263.615 61.6024 263.613 61.2726V53.3731L265.981 54.7405C266.007 54.7529 266.024 54.7775 266.027 54.8056V61.3473C266.024 64.2563 263.668 66.6148 260.759 66.621ZM249.429 61.7817C248.811 60.7142 248.588 59.4628 248.8 58.2484C248.841 58.273 248.914 58.3179 248.966 58.3478L254.57 61.5839C254.854 61.7501 255.206 61.7501 255.49 61.5839L262.331 57.6337V60.3686C262.333 60.3967 262.32 60.424 262.298 60.4416L256.634 63.712C254.111 65.1647 250.889 64.3012 249.43 61.7817H249.429ZM247.954 49.5504C248.57 48.4811 249.541 47.6633 250.699 47.2385C250.699 47.2869 250.696 47.3722 250.696 47.432V53.9051C250.694 54.234 250.87 54.5392 251.156 54.7018L257.997 58.6511L255.628 60.0186C255.605 60.0344 255.575 60.0371 255.548 60.0256L249.883 56.7526C247.366 55.2945 246.502 52.0734 247.953 49.5513L247.954 49.5504ZM267.411 54.0784L260.571 50.1282L262.939 48.7616C262.963 48.7458 262.992 48.7432 263.019 48.7546L268.684 52.025C271.206 53.4821 272.07 56.7086 270.613 59.2307C269.997 60.2982 269.026 61.1161 267.869 61.5417V54.8751C267.872 54.5462 267.697 54.2419 267.412 54.0784H267.411ZM269.768 50.5309C269.727 50.5054 269.654 50.4615 269.602 50.4316L263.998 47.1954C263.714 47.0292 263.363 47.0292 263.078 47.1954L256.237 51.1456V48.4108C256.235 48.3826 256.248 48.3554 256.27 48.3378L261.935 45.07C264.457 43.6146 267.683 44.4808 269.138 47.0046C269.752 48.0704 269.975 49.3183 269.766 50.5309H269.768ZM254.95 55.4054L252.581 54.0379C252.555 54.0256 252.538 54.001 252.535 53.9728V47.4311C252.537 44.5186 254.899 42.1584 257.812 42.1601C259.044 42.1601 260.236 42.5928 261.184 43.3807C261.14 43.4036 261.067 43.4449 261.017 43.4748L255.414 46.7109C255.127 46.8736 254.951 47.1779 254.953 47.5076L254.95 55.4036V55.4054ZM256.236 52.6318L259.283 50.8721L262.33 52.6309V56.1493L259.283 57.9081L256.236 56.1493V52.6318Z" fill="#191818" />
      </g>
      <path d="M40 89.3909C40 77.7275 40 71.8959 43.2455 67.9875C43.7996 67.3202 44.4142 66.7056 45.0815 66.1515C48.9899 62.906 54.8215 62.906 66.4849 62.906C78.1483 62.906 83.9799 62.906 87.8883 66.1515C88.5556 66.7056 89.1702 67.3202 89.7243 67.9875C92.9698 71.8959 92.9698 77.7275 92.9698 89.3909C92.9698 101.054 92.9698 106.886 89.7243 110.794C89.1702 111.462 88.5556 112.076 87.8883 112.63C83.9799 115.876 78.1483 115.876 66.4849 115.876C54.8215 115.876 48.9899 115.876 45.0815 112.63C44.4142 112.076 43.7996 111.462 43.2455 110.794C40 106.886 40 101.054 40 89.3909Z" fill="#FAF6F1" />
      <path fillRule="evenodd" clipRule="evenodd" d="M65.6228 86.3543C65.6228 85.7193 66.142 85.4751 67.002 85.4751C68.2352 85.4751 69.7929 85.8496 71.0261 86.5171V82.6913C69.6793 82.154 68.3488 81.9424 67.002 81.9424C63.7081 81.9424 61.5176 83.6681 61.5176 86.5496C61.5176 91.0429 67.6835 90.3266 67.6835 92.2639C67.6835 93.0128 67.0344 93.257 66.1258 93.257C64.779 93.257 63.0591 92.7035 61.6961 91.9546V95.8292C63.2051 96.4804 64.7303 96.7572 66.1258 96.7572C69.5008 96.7572 71.8211 95.0804 71.8211 92.1662C71.8049 87.3148 65.6228 88.1776 65.6228 86.3543Z" fill="#191818" />
      <rect x="237" y="198" width="52.9698" height="52.9698" rx="14.0701" fill="#FAF6F1" />
      <g clipPath="url(#clip1_896_28043)">
        <path d="M252.612 213.176L266.809 212.128C268.553 211.978 269.001 212.079 270.098 212.876L274.629 216.069C275.377 216.618 275.626 216.767 275.626 217.365V234.874C275.626 235.972 275.227 236.621 273.832 236.72L257.346 237.718C256.299 237.768 255.801 237.618 255.252 236.92L251.915 232.58C251.316 231.781 251.068 231.184 251.068 230.485V214.921C251.068 214.024 251.467 213.276 252.612 213.176Z" fill="#FAF6F1" />
        <path fillRule="evenodd" clipRule="evenodd" d="M266.809 212.128L252.612 213.176C251.467 213.276 251.068 214.024 251.068 214.921V230.485C251.068 231.183 251.316 231.781 251.915 232.58L255.252 236.919C255.801 237.618 256.299 237.768 257.346 237.718L273.832 236.72C275.226 236.621 275.626 235.972 275.626 234.875V217.365C275.626 216.798 275.402 216.635 274.743 216.151L270.098 212.876C269.001 212.079 268.553 211.978 266.809 212.128V212.128ZM257.719 217.079C256.372 217.169 256.067 217.19 255.303 216.568L253.359 215.022C253.161 214.822 253.261 214.572 253.758 214.522L267.406 213.525C268.552 213.425 269.149 213.825 269.597 214.174L271.938 215.869C272.038 215.92 272.287 216.218 271.987 216.218L257.893 217.067L257.719 217.079ZM256.149 234.725V219.861C256.149 219.212 256.349 218.912 256.945 218.862L273.134 217.914C273.683 217.865 273.931 218.214 273.931 218.862V233.627C273.931 234.276 273.831 234.825 272.934 234.875L257.443 235.773C256.547 235.822 256.15 235.524 256.15 234.725H256.149ZM271.441 220.658C271.54 221.107 271.441 221.556 270.992 221.607L270.245 221.755V232.73C269.597 233.079 269 233.278 268.501 233.278C267.704 233.278 267.505 233.028 266.908 232.281L262.026 224.599V232.031L263.57 232.381C263.57 232.381 263.57 233.279 262.324 233.279L258.888 233.478C258.788 233.278 258.888 232.779 259.237 232.68L260.134 232.431V222.605L258.889 222.504C258.789 222.055 259.038 221.406 259.735 221.356L263.422 221.108L268.502 228.889V222.005L267.207 221.856C267.107 221.307 267.505 220.907 268.003 220.858L271.441 220.658Z" fill="#191818" />
      </g>
      <defs>
        <clipPath id="clip0_896_28043">
          <rect width="27.9643" height="28.1402" fill="white" transform="translate(245.213 40.3203)" />
        </clipPath>
        <clipPath id="clip1_896_28043">
          <rect width="25.6572" height="25.6572" fill="white" transform="translate(251.068 212.069)" />
        </clipPath>
      </defs>
    </svg>
  );
}

function EnterpriseIllustration() {
  return (
    <svg width="117" height="148" viewBox="0 0 117 148" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M95.4694 78.4476C95.4694 102.124 78.9054 113.962 59.2178 120.828C58.1869 121.178 57.067 121.161 56.047 120.781C36.3121 113.962 19.748 102.124 19.748 78.4476V45.301C19.748 44.0451 20.2467 42.8407 21.1342 41.9527C22.0217 41.0646 23.2255 40.5657 24.4806 40.5657C33.9458 40.5657 45.7773 34.8835 54.012 27.6859C55.0146 26.8288 56.29 26.3579 57.6087 26.3579C58.9274 26.3579 60.2029 26.8288 61.2055 27.6859C69.4875 34.9308 81.2717 40.5657 90.7368 40.5657C91.992 40.5657 93.1957 41.0646 94.0833 41.9527C94.9708 42.8407 95.4694 44.0451 95.4694 45.301V78.4476Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M105.821 79.7811C105.821 110.135 84.6264 125.311 59.4352 134.114C58.1161 134.562 56.6832 134.541 55.378 134.053C30.1262 125.311 8.93164 110.135 8.93164 79.7811V37.2861C8.93164 35.676 9.56964 34.1319 10.7053 32.9934C11.8409 31.855 13.3812 31.2154 14.9872 31.2154C27.0984 31.2154 42.2373 23.9305 52.7741 14.703C54.057 13.6042 55.6889 13.0005 57.3763 13.0005C59.0637 13.0005 60.6956 13.6042 61.9786 14.703C72.5758 23.9912 87.6542 31.2154 99.7654 31.2154C101.371 31.2154 102.912 31.855 104.047 32.9934C105.183 34.1319 105.821 35.676 105.821 37.2861V79.7811Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M115.296 81.0045C115.296 117.482 90.2389 135.721 60.457 146.3C58.8975 146.838 57.2034 146.813 55.6604 146.227C25.8069 135.721 0.75 117.482 0.75 81.0045V29.9355C0.75 28.0006 1.50426 26.145 2.84686 24.7768C4.18945 23.4086 6.0104 22.64 7.90911 22.64C22.2273 22.64 40.1251 13.8853 52.582 2.79604C54.0987 1.47553 56.028 0.75 58.0229 0.75C60.0178 0.75 61.9471 1.47553 63.4638 2.79604C75.9923 13.9583 93.8184 22.64 108.137 22.64C110.035 22.64 111.856 23.4086 113.199 24.7768C114.542 26.145 115.296 28.0006 115.296 29.9355V81.0045Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M43.4287 73.7181L52.8824 83.08L71.7898 64.3562" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const PlatformInfrastructure: React.FC = () => {
  return (
    <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 w-full [@media_screen_and_(width<=768px)]:px-400">
      <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 my-0 mx-auto w-full overflow-x-hidden p-800 max-w-[1380px] [@media_screen_and_(width<=768px)]:px-400">
        <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 items-center gap-1200 w-full pt-[120px]">
          {/* Section Heading */}
          <h2 className="leading-none text-center font-brand text-[#312e2e] font-[400] text-[length:48px] tracking-[-0.06em]">
            Powered by the Replit platform
          </h2>

          {/* Desktop/Tablet 4-Cards Grid */}
          <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 hidden w-full [@media_(width_>=_768px)]:block">
            <div className="box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-300 grid w-full tablet-min:grid-cols-[repeat(2,_1fr)] tablet-max:grid-cols-[repeat(4,_1fr)]">
              {/* Card 1: Replit Chat */}
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-between items-center p-600 overflow-clip font-brand bg-[white] rounded-[20px] h-[604px]">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 gap-400 items-logical-start w-full">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 grow capitalize text-[#312e2e]">
                    <p className="leading-none font-[600] text-[length:18px] tracking-[-0.04em]">Replit chat</p>
                    <p className="leading-none font-[400] text-[length:32px] tracking-[-0.04em]">
                      Describe it.<br />Publish it.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full">
                  <AgentChatIllustration />
                </div>
                <p className="w-full text-[#312e2e] font-[400] text-[length:16px] leading-[1.1] tracking-[-0.02em]">
                  Describe and publish your project. Replit writes production-ready code, evolves it, and stays out of your way.
                </p>
              </div>

              {/* Card 2: Full Stack Infrastructure */}
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-between items-center p-600 overflow-clip font-brand bg-[#dbd4cf] rounded-[20px] h-[604px]">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 gap-400 items-logical-start w-full">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 grow capitalize text-[#312e2e]">
                    <p className="leading-none font-[600] text-[length:18px] tracking-[-0.04em]">Full stack infrastructure</p>
                    <p className="leading-none font-[400] text-[length:32px] tracking-[-0.04em]">
                      Build &amp; scale your apps easily.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full">
                  <InfraIllustration />
                </div>
                <p className="w-full text-[#312e2e] font-[400] text-[length:16px] leading-[1.1] tracking-[-0.02em]">
                  Built-in services with zero setup- Authentication, Database, Hosting, and Monitoring, enabling you to build fully scalable apps easily and securely from day one.
                </p>
              </div>

              {/* Card 3: Integrations */}
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-between items-center p-600 overflow-clip font-brand bg-[#ffb199] rounded-[20px] h-[604px]">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 gap-400 items-logical-start w-full">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 grow capitalize text-[#312e2e]">
                    <p className="leading-none font-[600] text-[length:18px] tracking-[-0.04em]">Integrations</p>
                    <p className="leading-none font-[400] text-[length:32px] tracking-[-0.04em]">
                      Connect to AI &amp; services.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full">
                  <IntegrationsIllustration />
                </div>
                <p className="w-full text-[#312e2e] font-[400] text-[length:16px] leading-[1.1] tracking-[-0.02em]">
                  Enhance your apps with AI and 100+ integrations. Connect to OpenAI, Stripe, Google Workspace, and more in minutes.
                </p>
              </div>

              {/* Card 4: Enterprise Control */}
              <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col shrink-0 justify-between items-center p-600 overflow-clip font-brand bg-[#ff764d] rounded-[20px] h-[604px]">
                <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start shrink-0 gap-400 items-logical-start w-full">
                  <div className="flex box-border min-h-0 min-w-0 border-0 border-solid view-outline-none flex-col justify-logical-start items-stretch shrink-0 gap-400 grow capitalize text-[#312e2e]">
                    <p className="leading-none font-[600] text-[length:18px] tracking-[-0.04em]">Enterprise control</p>
                    <p className="leading-none font-[400] text-[length:32px] tracking-[-0.04em]">
                      Secure your apps as they scale.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 justify-center items-center w-full">
                  <EnterpriseIllustration />
                </div>
                <p className="w-full text-[#312e2e] font-[400] text-[length:16px] leading-[1.1] tracking-[-0.02em]">
                  Security controls: SSO/SAML, SOC 2, and admin controls. Screening and secure services keep apps safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
