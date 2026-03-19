$replacements = @{
    '[#4A3B32]' = '[var(--gm-heading)]'
    '[#877669]' = '[var(--gm-body)]'
    '[#FAD85D]' = '[var(--gm-accent)]'
    '[#FDF1B6]' = '[var(--gm-accent-light)]'
    '[#E8E398]' = '[var(--gm-accent-hover)]'
    '[#E8654D]' = '[var(--gm-coral)]'
    '[#BF726B]' = '[var(--gm-coral-hover)]'
    '[#D94C3F]' = '[var(--gm-coral-hover)]'
    '[#FDF0EC]' = '[var(--gm-coral-bg)]'
    '[#FFFFFF]' = '[var(--gm-surface)]'
    '[#FAF7F0]' = '[var(--gm-page-bg)]'
    '[#F0F1F2]' = '[var(--gm-muted-bg)]'
    '[#E8F5E9]' = '[var(--gm-success-bg)]'
}

Get-ChildItem -Path . -Include *.tsx -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $original = $content
    foreach ($key in $replacements.Keys) {
        $content = $content.Replace($key, $replacements[$key])
    }
    if ($content -ne $original) {
        Set-Content $_.FullName -Value $content -NoNewline
        Write-Host "Updated: $($_.Name)"
    }
}
