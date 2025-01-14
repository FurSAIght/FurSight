@echo off

echo Checking if Docker is installed...
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker could not be found. Please install it first.
    echo Check the README for instructions.
    exit /b
)

REM Verify if Supabase is installed
echo Checking if Supabase is installed...
where supabase >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Supabase could not be found. Please install it first.
    echo Check the README for instructions.
    exit /b
)
echo Supabase is installed.

echo Creating a .env file for Supabase...
REM Copy .env.example to .env if .env doesn't already exist
if not exist .env (
    copy .env.example .env
) else (
    echo .env file already exists. Removing it...
    del /f .env
    copy .env.example .env
)
echo .env file created.

echo Login to Supabase...
supabase login

REM Start the Supabase service
echo Starting the Supabase service...
supabase start
echo Supabase service has started.

echo Applying latest migrations...
supabase db reset
echo Local database has been updated with the latest migrations.

echo Everything is set up.
echo Remember to update the .env file in the supabase directory with your Supabase URL and API key!

timeout /t 1

start http://localhost:54323/

timeout /t 3
