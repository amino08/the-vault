# Supabase setup script for The Vault
# Usage:
#   1. supabase login
#   2. .\scripts\setup-supabase.ps1 -AccessToken "sbp_..." -AdminEmail "you@email.com"
#   OR with existing project:
#   .\scripts\setup-supabase.ps1 -ProjectRef "abc123" -AccessToken "sbp_..." -AdminEmail "you@email.com"

param(
  [string]$AccessToken = $env:SUPABASE_ACCESS_TOKEN,
  [string]$ProjectRef = "",
  [string]$ProjectName = "the-vault",
  [string]$AdminEmail = "",
  [string]$DbPassword = "",
  [string]$Region = "us-east-1",
  [string]$OrgId = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }

if (-not $AccessToken) {
  Write-Host "ERROR: Supabase access token required." -ForegroundColor Red
  Write-Host "Run: npx supabase login"
  Write-Host "Or: `$env:SUPABASE_ACCESS_TOKEN = 'sbp_...'"
  exit 1
}

$env:SUPABASE_ACCESS_TOKEN = $AccessToken

Write-Step "Checking Supabase CLI auth"
npx supabase projects list

if (-not $ProjectRef) {
  Write-Step "Creating Supabase project: $ProjectName"
  if (-not $OrgId) {
    $orgs = npx supabase orgs list -o json | ConvertFrom-Json
    if ($orgs.Count -eq 0) { throw "No Supabase organizations found." }
    $OrgId = $orgs[0].id
    Write-Host "Using org: $($orgs[0].name) ($OrgId)"
  }
  if (-not $DbPassword) {
    $DbPassword = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 24 | ForEach-Object { [char]$_ })
    Write-Host "Generated DB password (save this): $DbPassword"
  }
  $createJson = npx supabase projects create $ProjectName --org-id $OrgId --db-password $DbPassword --region $Region -o json | ConvertFrom-Json
  $ProjectRef = $createJson.id
  Write-Host "Created project ref: $ProjectRef"
  Write-Host "Waiting 90s for project provisioning..."
  Start-Sleep -Seconds 90
}

Write-Step "Fetching API keys for project $ProjectRef"
$keysJson = npx supabase projects api-keys --project-ref $ProjectRef -o json | ConvertFrom-Json
$anonKey = ($keysJson | Where-Object { $_.name -eq "anon" }).api_key
$serviceKey = ($keysJson | Where-Object { $_.name -eq "service_role" }).api_key
$supabaseUrl = "https://$ProjectRef.supabase.co"

if (-not $anonKey -or -not $serviceKey) {
  throw "Failed to retrieve API keys."
}

Write-Step "Writing .env.local"
$envContent = @"
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="The Vault by Enter Aevum"
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$anonKey
SUPABASE_SERVICE_ROLE_KEY=$serviceKey
VAULT_ADMIN_EMAILS=$AdminEmail
"@
Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
Write-Host ".env.local created"

Write-Step "Linking project and pushing migrations"
npx supabase link --project-ref $ProjectRef --yes
npx supabase db push --yes

Write-Step "Applying storage policies"
Get-Content "supabase\storage.sql" -Raw | npx supabase db execute --project-ref $ProjectRef

Write-Step "Configuring auth redirect URL"
npx supabase config push --project-ref $ProjectRef 2>$null
Write-Host "Set redirect URL manually if needed: http://localhost:3000/auth/callback"
Write-Host "Dashboard: $supabaseUrl/project/$ProjectRef/auth/url-configuration"

Write-Step "Done!"
Write-Host "Project URL: $supabaseUrl"
Write-Host "Run: npm run dev"
