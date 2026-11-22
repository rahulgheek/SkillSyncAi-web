import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { PeopleIcon } from "./AuthIcons";

interface PosterCopy {
  kicker: string;
  title: ReactNode;
  lede: string;
}

const POSTER_COPY: Record<string, PosterCopy> = {
  "/login": {
    kicker: "01 / Return to the trail",
    title: (
      <>
        Find your people.
        <br />
        {" "}
        <em>Make your mark.</em>
      </>
    ),
    lede: "Pick up where you left off. Your teams, projects, and next build are waiting just past the ridge.",
  },
  "/register": {
    kicker: "02 / Begin the climb",
    title: (
      <>
        Every summit starts
        <br />
        {" "}
        <em>with a first step.</em>
      </>
    ),
    lede: "Create a profile, get matched with complementary builders, and spend your next hackathon shipping.",
  },
  "/verify": {
    kicker: "03 / Final ascent",
    title: (
      <>
        One step from
        <br />
        {" "}
        <em>the summit.</em>
      </>
    ),
    lede: "Confirm your email to open the trail. One code, and your profile is ready for the climb.",
  },
};

const FALLBACK_COPY = POSTER_COPY["/login"];

/**
 * Decorative split-screen poster. A posterized, engraved mountain scene in the
 * warm editorial palette, distinct from the softer landing-page landscape.
 */
export function AuthPoster() {
  const { pathname } = useLocation();
  const copy = POSTER_COPY[pathname] ?? FALLBACK_COPY;

  return (
    <aside className="auth-poster" aria-label="SkillSync trail journal">
      <svg
        className="auth-scene"
        viewBox="0 0 900 1200"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="auth-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c3d2d1" />
            <stop offset="0.38" stopColor="#d9dcca" />
            <stop offset="0.68" stopColor="#eee2cc" />
            <stop offset="1" stopColor="#f4e8d4" />
          </linearGradient>
          <linearGradient id="auth-ridge-far" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b7c0ab" />
            <stop offset="1" stopColor="#a9b29d" />
          </linearGradient>
          <linearGradient id="auth-ridge-mid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#939b7e" />
            <stop offset="1" stopColor="#858d70" />
          </linearGradient>
          <linearGradient id="auth-ridge-near" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6c7459" />
            <stop offset="1" stopColor="#5f674d" />
          </linearGradient>
          <linearGradient id="auth-ridge-fore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4e5543" />
            <stop offset="1" stopColor="#414738" />
          </linearGradient>
          <radialGradient id="auth-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#f9ecd3" />
            <stop offset="0.7" stopColor="#f4e3c4" />
            <stop offset="1" stopColor="#efdcba" />
          </radialGradient>
          <pattern
            id="auth-hatch"
            width="7"
            height="7"
            patternTransform="rotate(38)"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="7"
              stroke="#f7efe2"
              strokeWidth="1"
              strokeOpacity="0.22"
            />
          </pattern>
          <pattern id="auth-dots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#f7efe2" fillOpacity="0.18" />
          </pattern>
        </defs>

        <rect width="900" height="1200" fill="url(#auth-sky)" />

        <circle cx="666" cy="286" r="148" fill="url(#auth-sun)" />
        <g fill="none" stroke="#f7efe2" strokeOpacity="0.35">
          <circle cx="666" cy="286" r="172" />
          <circle cx="666" cy="286" r="196" strokeDasharray="2 9" />
          <circle cx="666" cy="286" r="222" strokeOpacity="0.18" />
        </g>

        <g fill="#fbf6ea">
          <ellipse cx="218" cy="238" rx="186" ry="16" opacity="0.34" />
          <ellipse cx="360" cy="266" rx="120" ry="9" opacity="0.24" />
          <ellipse cx="690" cy="430" rx="190" ry="12" opacity="0.22" />
          <ellipse cx="470" cy="170" rx="150" ry="10" opacity="0.18" />
        </g>

        <path
          d="M120 370 C 240 330, 360 392, 470 350 S 660 330, 780 372"
          fill="none"
          stroke="#6d6a57"
          strokeOpacity="0.28"
          strokeWidth="1.2"
          strokeDasharray="3 7"
        />

        <path
          d="M0 590 L74 540 L143 566 L214 478 L286 540 L354 510 L438 414 L520 500 L592 468 L660 520 L738 452 L820 512 L900 470 L900 1200 L0 1200 Z"
          fill="url(#auth-ridge-far)"
        />
        <path
          d="M0 590 L74 540 L143 566 L214 478 L286 540 L354 510 L438 414 L520 500 L592 468 L660 520 L738 452 L820 512 L900 470 L900 1200 L0 1200 Z"
          fill="url(#auth-hatch)"
          opacity="0.5"
        />

        <path
          d="M0 700 L96 622 L186 676 L268 574 L352 656 L430 602 L520 690 L610 608 L706 682 L796 624 L900 700 L900 1200 L0 1200 Z"
          fill="url(#auth-ridge-mid)"
        />
        <path
          d="M0 700 L96 622 L186 676 L268 574 L352 656 L430 602 L520 690 L610 608 L706 682 L796 624 L900 700 L900 1200 L0 1200 Z"
          fill="url(#auth-hatch)"
          opacity="0.4"
        />

        <path
          d="M0 830 L120 756 L220 806 L330 700 L438 790 L540 726 L650 818 L760 752 L846 804 L900 770 L900 1200 L0 1200 Z"
          fill="url(#auth-ridge-near)"
        />
        <path
          d="M0 830 L120 756 L220 806 L330 700 L438 790 L540 726 L650 818 L760 752 L846 804 L900 770 L900 1200 L0 1200 Z"
          fill="url(#auth-hatch)"
          opacity="0.26"
        />

        <path
          d="M0 976 L128 892 L250 946 L382 856 L508 936 L626 878 L748 952 L860 902 L900 922 L900 1200 L0 1200 Z"
          fill="url(#auth-ridge-fore)"
        />
        <path
          d="M0 976 L128 892 L250 946 L382 856 L508 936 L626 878 L748 952 L860 902 L900 922 L900 1200 L0 1200 Z"
          fill="url(#auth-dots)"
          opacity="0.6"
        />

        <g fill="none" stroke="#e9ddc8" strokeWidth="1">
          <path
            d="M-20 1048 C 180 1000, 250 1092, 430 1044 S 720 1006, 920 1068"
            strokeOpacity="0.16"
          />
          <path
            d="M-20 1102 C 190 1054, 280 1140, 470 1094 S 750 1058, 920 1118"
            strokeOpacity="0.13"
          />
          <path
            d="M-20 1156 C 210 1112, 320 1184, 510 1142 S 770 1116, 920 1168"
            strokeOpacity="0.1"
          />
        </g>

        <path
          d="M712 1200 C 676 1120 640 1072 662 1018 C 684 964 660 930 618 902 C 576 874 560 842 566 812"
          fill="none"
          stroke="#eadcc4"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeDasharray="1 12"
          strokeLinecap="round"
        />

        <g className="auth-pines" fill="#3c4236">
          <path d="M742 1000 l20 -62 20 62 h-11 l14 34 h-46 l14 -34 z" />
          <path d="M790 1008 l16 -48 16 48 h-9 l11 27 h-36 l11 -27 z" fillOpacity="0.92" />
          <path d="M824 990 l23 -72 23 72 h-13 l16 40 h-52 l16 -40 z" fillOpacity="0.86" />
          <path d="M700 1010 l14 -42 14 42 h-8 l10 24 h-32 l10 -24 z" fillOpacity="0.8" />
        </g>
      </svg>

      <div className="auth-scene-grain" aria-hidden="true" />

      <header className="auth-poster-top">
        <Link to="/" className="auth-brand" aria-label="SkillSync home">
          <span className="auth-brand-mark">
            <PeopleIcon className="h-4 w-4" />
          </span>
          <span className="auth-brand-word">
            SkillSync
            <span className="auth-brand-ai">AI</span>
          </span>
        </Link>
        <span className="auth-edition">Field journal / Vol. 04</span>
      </header>

      <div className="auth-poster-copy">
        <p className="auth-poster-kicker">{copy.kicker}</p>
        <p className="auth-poster-title">{copy.title}</p>
        <p className="auth-poster-lede">{copy.lede}</p>
      </div>

      <div className="auth-poster-rail" aria-hidden="true">
        SkillSync — Trail map / 2026
      </div>

      <footer className="auth-poster-foot">
        <span>
          <span className="auth-dot" aria-hidden="true" />
          A network of student builders
        </span>
        <span>38.9 N / Open trail</span>
      </footer>
    </aside>
  );
}
