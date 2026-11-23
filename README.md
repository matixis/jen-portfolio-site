# jen.thenilans.com

Portfolio site for Jennifer Nilan. Static Vite + React app on S3 behind CloudFront, managed with Terraform.

```
web/      Vite + React + TypeScript site
  src/data/content.ts      all copy (edit this to change text, metrics, links)
  src/components/          sections
  public/thinklounge/      processed Think Lounge screenshots (generated)
  public/Jennifer_Nilan_Resume.pdf
infra/    Terraform: S3 (private) + CloudFront (OAC) + ACM + Route 53 records in the existing thenilans.com zone
scripts/  process_screenshots.py (archive -> web assets), deploy.ps1 (build + apply)
source/   original PDFs the content was written from
```

## Local dev

```powershell
cd web
npm install
npm run dev
```

## Deploy

```powershell
.\scripts\deploy.ps1              # build, then terraform apply (prompts)
.\scripts\deploy.ps1 -AutoApprove
.\scripts\deploy.ps1 -Invalidate  # also bust the CloudFront cache
```

Terraform uploads everything in `web/dist`. Hashed files under `assets/` are cached for a year;
`index.html` for 5 minutes; images and the PDF for a day. A redeploy is visible within ~5 minutes
without an invalidation. State lives in `s3://matixis-tfstate/jen-portfolio/site.tfstate`.

## Regenerating screenshots

The Think Lounge captures come from `F:\thinklounge-site-archive` (full-page PNGs, 2880px wide).
`scripts/process_screenshots.py` crops the top fold, resizes, and writes WebP into `web/public/thinklounge/`.
Set `TL_ARCHIVE` to point elsewhere.

```powershell
python scripts\process_screenshots.py
```
