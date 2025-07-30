# Auto-push script for Git
$repoPath = "G:\Microservices app\ai-career-guidance-platform"
$branch = "main"

# Change to repository directory
Set-Location -Path $repoPath

# Function to perform git operations
function Update-GitRepo {
    param()
    
    Write-Host "Detected changes. Updating repository..." -ForegroundColor Yellow
    
    # Stage all changes
    git add .
    
    # Check if there are any changes to commit
    $status = git status --porcelain
    
    if ($status) {
        # Commit changes
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "Auto-commit: $timestamp"
        
        # Push changes
        git push origin $branch
        Write-Host "Changes pushed to $branch at $(Get-Date)" -ForegroundColor Green
    } else {
        Write-Host "No changes to commit." -ForegroundColor Gray
    }
}

# Set up file system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $repoPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# Define the change event action
$action = {
    $changeType = $Event.SourceEventArgs.ChangeType
    $fullPath = $Event.SourceEventArgs.FullPath
    
    # Ignore .git directory and other temporary files
    if ($fullPath -match '\\.git|~\$|\.tmp$|\.swp$') {
        return
    }
    
    Write-Host "Change detected: $changeType - $fullPath" -ForegroundColor Cyan
    
    # Small delay to allow multiple changes to complete
    Start-Sleep -Seconds 2
    
    # Update repository
    Update-GitRepo
}

# Register events
Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action
Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $action
Register-ObjectEvent -InputObject $watcher -EventName Deleted -Action $action
Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $action

Write-Host "Watching for changes in $repoPath..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop monitoring..." -ForegroundColor Yellow

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    # Clean up
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
}
