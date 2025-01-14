@echo off
echo Cleaning up...

echo Do you wish to remove the Database and Storage? (y/n)
set /p response=

if /i "%response%"=="y" goto :yes
if /i "%response%"=="yes" goto :yes
goto :no

:yes
REM Remove the Database and Storage
echo Stopping the Supabase service, deleting Database and Storage...
supabase stop --no-backup
echo Supabase service stopped, Database and Storage deleted.
goto :cleanup

:no
REM Stop the Supabase service
echo Stopping the Supabase service...
supabase stop
echo Supabase service has stopped.
goto :cleanup

:cleanup
REM Remove .env file
echo Removing the .env file...
del /f .env
echo .env file removed.

echo Cleanup complete.
