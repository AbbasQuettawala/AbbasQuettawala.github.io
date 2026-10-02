# Abbas’s Workbench

A custom, static engineering portfolio built with Astro, TypeScript and Three.js. Publication was approved by Abbas on 2 October 2026. Target website: **https://abbasquettawala.github.io**. No API keys, backend, paid services or analytics are required. The decorative robot is an original illustration, not Waddle CAD or a physical simulation.

## Run locally on Windows

Requires Node.js 22.12 or newer (the tested version is in `.nvmrc`). In PowerShell:

```powershell
cd C:\Users\abbas\Desktop\Career\Portfolio
npm ci
npm run dev
```

Open **http://localhost:4321**. Keep that terminal open while viewing; Ctrl+C stops the server. This is a website build, so opening the source or `dist/index.html` directly with `file://` is not supported.

For a production preview:

```powershell
npm run check
npm run build
npm run preview
```

The scripts disable Astro CLI telemetry without changing global preferences. Windows and WSL use different native dependencies: if switching environments, stop the server and run `npm ci` in the environment you will use. Do not run Windows and WSL installations simultaneously in this folder.

## Content and media

- `src/content/projects/`: four Markdown case studies. Frontmatter controls titles, filters, ordering, role, status, tags and media. The Markdown body is the case study.
- `src/pages/index.astro`: introduction, experience, smaller builds, about and contact.
- `src/styles/global.css`: colours, type, responsive layout and motion preferences.
- `src/scripts/robot.ts`: procedural robot and controls. No CAD or third-party model asset is imported.

Put only reviewed assets into `public/media/`. Attach them to a project’s frontmatter, for example:

```yaml
media:
  - type: image
    src: /media/waddle-assembly.webp
    alt: Abbas helping assemble the robot’s leg mechanism
    caption: Mechanical assembly with the Monash Automation team.
  - type: video
    src: /media/arms-demo.mp4
    alt: A touchscreen emote selection followed by robot-arm movement
    poster: /media/arms-demo-poster.webp
    captions: /media/arms-demo.en.vtt
    caption: Touchscreen-triggered emotes on the completed arms.
```

These are illustrative filenames, not existing files. Do not add these entries until their files exist. For speech, supply checked WebVTT captions. For silent demonstrations, use a descriptive caption. Video playback is user-initiated, with `preload="none"`. Optimise images, keep video clips short and do not commit raw camera recordings. The current project drawings intentionally remain useful without media.

The robotic-arms case study now uses five supplied project photographs and four short clips. Its optional `cover` metadata supplies the homepage thumbnail and case-study photograph; projects without a cover keep their concept drawings. Published copies live in `public/media/robotic-arms/`: metadata-stripped WebP photos and 720p/30 fps H.264 MP4 clips, with HDR converted to SDR. Clips contain no audio tracks and are labelled silent; originals remain outside this repository. The gallery supports native playback controls, inline mobile playback, descriptive captions and full-image links. Do not copy the raw staging folder into the repository.

Keep `/` and the existing `/projects/.../` routes stable when updating content: these URLs may already be in submitted job applications.

### Suggested media checklist

- Waddle: assembly photo, clearly labelled simulation clip, optional approved CAD image.
- Arms: touchscreen-to-emote clip, completed group of arms, electronics/base close-up.
- ManuMentor: approved sanitised demonstration with non-sensitive example documents.
- Hollow Knight: representative gameplay, then labelled training plots with context; no unsupported performance claim.
- About: optional portrait/workbench photo and the one-minute introduction video.

No external embeds are loaded by default. For a long hosted video, add a reviewed link rather than placing a large original file in GitHub Pages.

## Review before publishing

The resume download is the separate **public resume** authorised by Abbas on 2 October 2026. It retains his name, qualifications and professional/project experience, but removes email, phone, profile URLs, location, citizenship, internship availability and the personal-interest section. The application resume remains unchanged outside this repository. PDF text, metadata and links were checked before publication. When updating the download, use the redacted public version, never the private application copy. The HTML contact section remains as approved; this redaction applies to the downloadable resume.

All case-study text is a draft for Abbas’s review. Hardware contributions are shared; Waddle’s locomotion results are simulation-only; ManuMentor is collaborative; 200+ Hollow Knight hours are user-confirmed actual training runtime, not a performance score. No clinical accuracy, production reliability or autonomous diagnosis claims are made.

Never upload internal career records, workplace source repositories, credentials, private datasets or unapproved media. The separate portfolio folder is the repository boundary: **do not publish the parent Career folder**. Keep the existing project repositories private unless independently reviewed and approved.

## Tests

```powershell
npx playwright install chromium
npm run check
npm run build
npm test
```

Tests cover direct route loads, filters, resume download, robot controls, keyboard access, reduced motion, no JavaScript, failed WebGL, internal links, responsive overflow and axe accessibility checks. They save review screenshots under `test-results/` (ignored by Git). Playwright uses local Chromium and SwiftShader for a software-rendered WebGL test. Automated checks complement, not replace, visual review.

The local implementation was tested on 2 October 2026: all 13 browser tests passed, including real robotic-arm image loading and playback of all four clips; all five content pages passed the automated WCAG A/AA checks, and 375/768/1440px layouts were reviewed. Type checking reported zero errors/warnings/hints. The production build contains six HTML pages including the 404 page. The Windows localhost preview returned HTTP 200. Tests used an existing Chromium binary via the optional `PORTFOLIO_CHROMIUM` environment variable; ordinary setups can use the Playwright install command above.

Astro 7 can automatically background its preview when invoked by an agent. The browser-test command uses `--ignore-lock` to keep its managed server in the foreground. To stop an agent-started background preview, run `npm run preview -- stop`; a normal foreground session stops with Ctrl+C. The preview is loopback-only, not a public website.

## GitHub Pages — manual publication

The target is `https://abbasquettawala.github.io`, using the public repository `AbbasQuettawala/AbbasQuettawala.github.io`. No custom domain is needed. Initial publication was approved on 2 October 2026; subsequent deployment remains manual.

1. Review changes to text, the PDF and media permissions before making them public.
2. Upload only this folder’s source, lockfile and approved `public/` assets. Do not upload `node_modules`, build output or screenshots.
3. In repository **Settings → Pages**, choose **GitHub Actions** as the source.
4. Manually run **Publish approved portfolio** under Actions and confirm the publication checkbox. A push alone never deploys. Checks and browser tests must pass before deployment.
5. Open the published homepage and each case-study URL directly; verify resume download and email links.

The configuration deliberately targets a user-site root, not a repository subpath. To use another address or domain, update the `site` configuration, canonical URL assumptions and asset paths before deploying. For a custom domain, follow GitHub’s domain-verification/DNS instructions and enable HTTPS. Never put registry credentials in this repo.

## Design and licensing

Visual inspiration: Zach Jordan’s approachable project presentation and Shiyun Lu’s 3D-led opening. No code, copy, images or 3D assets were copied from those sites. Sumanth’s supplied recruiter route was unavailable at planning time. Illustrations and procedural geometry here are original. Dependencies retain their respective licences; project footage and logos require their owners’ permission.
