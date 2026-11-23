# Build the site and push it with Terraform.
#   .\scripts\deploy.ps1            # build + plan + apply (prompts)
#   .\scripts\deploy.ps1 -AutoApprove
#   .\scripts\deploy.ps1 -PlanOnly
param(
  [switch]$AutoApprove,
  [switch]$PlanOnly,
  [switch]$Invalidate   # also bust the CloudFront cache for index.html + public files
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot

Push-Location "$root\web"
try {
  if (-not (Test-Path node_modules)) { npm ci }
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "vite build failed" }
} finally { Pop-Location }

Push-Location "$root\infra"
try {
  if (-not (Test-Path .terraform)) { terraform init }
  if ($PlanOnly) {
    terraform plan
  } elseif ($AutoApprove) {
    terraform apply -auto-approve
  } else {
    terraform apply
  }
  if ($LASTEXITCODE -ne 0) { throw "terraform failed" }

  if ($Invalidate -and -not $PlanOnly) {
    $dist = terraform output -raw distribution_id
    aws cloudfront create-invalidation --distribution-id $dist --paths "/*" | Out-Null
    Write-Host "Invalidation requested for $dist"
  }
  Write-Host ""
  Write-Host "Live at: $(terraform output -raw site_url)"
} finally { Pop-Location }
