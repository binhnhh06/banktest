# Don dep repo: CHUYEN file sao luu / file cu sang thu muc _archive_backup (KHONG xoa).
# Thu muc _archive_backup nam trong .gitignore nen se khong len GitHub, nhung van con tren may ban.
# Chay tai thu muc goc du an:   .\don_dep_repo.ps1
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$dest = Join-Path $root '_archive_backup'
New-Item -ItemType Directory -Force -Path $dest | Out-Null

$files = @()
# 1) file sao luu trong dashboard/ va docs/
foreach ($d in 'dashboard','docs') {
  if (Test-Path (Join-Path $root $d)) {
    $files += Get-ChildItem -Path (Join-Path $root $d) -Recurse -File |
      Where-Object { $_.Name -match '\.backup' -or $_.Name -match '\.before_' }
  }
}
# 2) ban cu / script va loi mot lan da chay xong
foreach ($n in 'app_cu.py','dashboard\assets\app_cu.js','docs\assets\app_cu.js','apply_theme_patch.py','fix_image_detection.py','fix_svg_black.py') {
  $p = Join-Path $root $n
  if (Test-Path $p) { $files += Get-Item $p }
}

$moved = 0
foreach ($f in ($files | Sort-Object FullName -Unique)) {
  $rel = $f.FullName.Substring($root.Length).TrimStart('\','/')
  $target = Join-Path $dest $rel
  New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
  Move-Item -LiteralPath $f.FullName -Destination $target -Force
  Write-Host "Da chuyen: $rel"
  $moved++
}
Write-Host ""
Write-Host "Xong: $moved file da chuyen vao _archive_backup (van con tren may, khong len GitHub)."
Write-Host "Tiep theo:  git add -A ; git commit -m 'Don dep file sao luu' ; git push"
