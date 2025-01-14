echo "Cleaning up..."

echo "Do you wish to remove the Database and Storage? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]
then
    # Remove the Database and Storage
    echo "Stopping the Supabase service, deleting Database and Storage..."
    supabase supabase stop --no-backup
    echo "Supabase service stopped, Database and Storage deleted."
else
# Stop the Supabase service
    echo "Stopping the Supabase service..."
    supabase stop
    echo "Supabase service has stopped."
fi

# Remove .env file
echo "Removing the .env file..."
rm -f .env
echo ".env file removed."

echo "Cleanup complete."