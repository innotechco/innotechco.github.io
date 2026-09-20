/* The two marks the loading screens draw.

   DUPLICATED IN index.html, ON PURPOSE.

   The first-visit curtain is painted before this bundle exists, so it cannot
   import anything and carries its own copy of these paths written out by hand.
   This file is for everything that runs after the bundle has loaded - the
   curtain shown when moving between pages, and the panel React shows while a
   route's chunk arrives.

   They have to be kept in step: a change to one of these shapes is a change to
   the copy in index.html as well, or the curtain that covers a move will stop
   matching the one that covers the first paint. */

/* Four marks, so four things that can breathe one after another. The stagger
   is what makes it read as something working rather than something blinking,
   and it is only possible because each is its own path. */
export function InnotechMark({className = ""}) {
  return (
    <svg viewBox="0 0 36 37" fill="none" className={className} aria-hidden="true">
      <path
        className="brand-mark-part"
        d="M32.2465 32.7296C35.3954 30.9955 36.5206 27.0677 34.764 23.9591C33.0074 20.8505 29.0288 19.7397 25.8799 21.4738C22.731 23.2079 21.6058 27.1356 23.3624 30.2443C25.119 33.3529 29.0976 34.4637 32.2465 32.7296Z"
        fill="#37B478"
      />
      <path
        className="brand-mark-part"
        d="M18.1211 22.4445C15.5145 17.8375 9.62142 16.1913 4.95876 18.7645C0.292059 21.3377 -1.37549 27.1554 1.23107 31.7584C3.83762 36.3654 9.7307 38.0116 14.3934 35.4384C19.056 32.8652 20.7276 27.0475 18.1211 22.4445Z"
        fill="#37B478"
      />
      <path
        className="brand-mark-part"
        d="M33.8699 5.25115C32.4331 2.7139 29.187 1.80688 26.6169 3.22135C24.0468 4.63981 23.128 7.84433 24.5608 10.3816C25.9976 12.9188 29.2437 13.8258 31.8138 12.4114C34.3839 10.9969 35.3027 7.78839 33.8699 5.25115Z"
        fill="#37B478"
      />
      <path
        className="brand-mark-part"
        d="M13.5354 14.6372C17.3521 12.5315 18.7161 7.77263 16.5871 4.00472C14.4541 0.236814 9.63362 -1.10972 5.81688 0.991994C2.00014 3.09771 0.636148 7.85654 2.7651 11.6245C4.89811 15.3924 9.71862 16.7389 13.5354 14.6372Z"
        fill="#37B478"
      />
    </svg>
  );
}

/* One shape, so no stagger to carry it - it is given the gentler fade in the
   stylesheet instead, or on a white curtain it reads as flickering out. */
export function InlearnMark({className = ""}) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <path
        className="brand-mark-part is-single"
        d="M18 0C26.6687 0.000230111 33.9048 6.12862 35.6152 14.2891C31.5142 14.7571 27.5462 16.6058 24.4658 19.8174C20.2026 24.2623 18.6227 30.2967 19.6797 35.9209C19.1266 35.9721 18.5664 36 18 36C10.7326 36 4.47132 31.6928 1.62891 25.4922C6.0587 25.1364 10.3723 23.1816 13.627 19.6611C18.6847 14.1895 19.772 6.4657 17.0361 0.0253906C17.3551 0.00856787 17.6768 0 18 0ZM35.6826 21.3721C34.2267 29.0537 27.8909 35.0063 20.0205 35.8857C20.6901 32.6054 22.2623 29.4679 24.751 26.873C27.7768 23.7184 31.6591 21.8799 35.6826 21.3721ZM16.2305 0.0859375C16.5654 4.95121 14.9739 9.93909 11.4023 13.8027C8.31034 17.1472 4.2625 19.0786 0.0673828 19.5684C0.0227692 19.0515 0 18.5284 0 18C0 8.65579 7.11966 0.974687 16.2305 0.0859375Z"
        fill="#37B478"
      />
    </svg>
  );
}
