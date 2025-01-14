#!/bin/bash
install_docker() {
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo "Docker has been installed."
}

echo "Setting up the project..."

echo "Checking if Docker is installed..."
# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Error: Docker is not installed."
    install_docker
else
    echo "Docker is already installed."
fi

# Verify if Supabase is installed
echo "Checking if Supabase is installed..."
if ! command -v supabase &> /dev/null
then
    echo "Supabase could not be found. Please install it first."
    echo "Check the README for instructions."
    exit
fi
echo "Supabase is installed."

echo "Creating a .env file for Supabase..."
# Copy .env.example to .env if .env doesn't already exist
if [ ! -f .env ]; then
    cp .env.example .env
else
    echo ".env file already exists. Removing it..."
    rm -f .env
    cp .env.example .env
fi
echo ".env file created."

echo "Login to Supabase..."
supabase login

while true; do
    echo "Insert the Supabase project ID (available on the project URL: https://supabase.com/dashboard/project/<project-id>)"
    read -r project_id
    if [ -z "$project_id" ]; then
        echo "Ignoring Linking the Supabase project. Running only locally."
        break
    fi

    echo "Linking the Supabase project..."
    echo "(You can find the DB password in Notion)"
    if supabase link --project-ref "$project_id"; then
        echo "Supabase project linked."
        break
    else
        echo "There was an error linking the Supabase project. Please try again."
    fi
done

# Start the Supabase service
echo "Starting the Supabase service..."
supabase start
echo "Supabase service has started."

echo "Everything is set up."
echo "Remember to update the .env file in the supabase directory with your Supabase URL and API key!"

xdg-open http://localhost:54323/

sleep 3
