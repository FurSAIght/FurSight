# <img src="https://assets-global.website-files.com/655b60964be1a1b36c746790/655b60964be1a1b36c746d41_646dfce3b9c4849f6e401bff_supabase-logo-icon_1.png" alt="Cat Image" width="30"/> Database <img src="https://assets-global.website-files.com/655b60964be1a1b36c746790/655b60964be1a1b36c746d41_646dfce3b9c4849f6e401bff_supabase-logo-icon_1.png" alt="Cat Image" width="30"/>

<p align="center"> This repository contains the backend infrastructure/databases of the cyberphysical system developed for the CyberPhysical Systems and the Internet of Things course. The infrastructure is developed using Supabase, a service that provides a PostgreSQL database with a REST API and real-time capabilities.
</p>

<p align="center">
  <a href="https://github.com/zmcastro/feup-sci-proj/">
    <img height="300px" src="https://media.discordapp.net/attachments/1285261825100877929/1291906895556247654/IMG_1418.png?ex=6701cd8e&is=67007c0e&hm=598bfa35303e390745ed214346c0d5e3568108daedb3bb77056bffad914ec595&=&format=webp&quality=lossless" alt="@Cat Image">
  </a>
</p>

---

## 📑 Table of Contents

- [ Database ](#-database-)
  - [📑 Table of Contents](#-table-of-contents)
  - [📚 Features](#-features)
  - [📦 Requirements](#-requirements)
  - [🛠️️️ Setup](#️️️-setup)
  - [🚀 Development](#-development)
  - [💉 Testing 💉](#-testing-)
    - [Total Coverage](#total-coverage)
  - [🧹 Cleanup](#-cleanup)

## 📚 Features

Please note that every mention to a file is within the `supabase` folder.

- **Database Schema**: The database schema is defined in the `migrations` folder, which contains the SQL scripts to create the tables and the relationships between them. Migrations are executed in order, so the scripts are named with a timestamp to ensure the correct order.
- **Edge Functions**: The edge functions are defined in the `functions` folder, which contains the SQL scripts to create the functions that will be triggered by the database events. **This won't be used for a while, so don't worry about it.**
- **Supabase CLI**: The Supabase CLI is used to manage the database and deploy the schemas and edge functions. The CLI is installed globally in the machine, and the configuration is stored in the `.env` file.

## 📦 Requirements

Before running the setup script, please ensure you have the following tools installed on your machine:

- [**Docker**](https://docs.docker.com/get-docker/)
- [**Make**](https://www.gnu.org/software/make/)
- [**Supabase**](https://supabase.com/docs/guides/cli/getting-started) (_Service that will be used to manage the database and deploy the schemas and edge functions._)

**Make** is optional as you can run the commands manually, but to aid with repetitive tasks, it is recommended to have it installed.

After having the tools installed, simply run the following command to install the Supabase CLI and to prepare the environment:

```bash
make install
```

## 🛠️️️ Setup

Be sure to be in the root directory of the project before running the following steps:

```bash
# Be sure to have docker up and running!

supabase start # Start the Supabase service, according to the configuration in the .env and config.toml file.
```

After doing so, you will be prompted with the following:

```bash
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
service_role key: ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
   S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
   S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
       S3 Region: local
```

This means that the Supabase service is up and running, and you can access the services through the URLs provided:

- **Studio URL**: The URL to access the Supabase Studio, which is a web interface to manage the database and the services.
- **API URL**: The URL to access the API. This is used on the front-end to make requests to the database, as well as on the rabbitmq service to post new data.
- **Anon Key**: The anonymous key is used to make requests to the API without the need to authenticate. This is the type of key that all users will use to access the application without having an account.
- **service_role key**: The service role key is used to make requests to the API with the service role. This overrides the permissions of the user and allows the service to make requests that the user wouldn't be able to do. **PLEASE DO NOT SHARE THIS KEY**.

At any point, if you ever forget one of these, you can run the following command to get the information again:

```bash
supabase status
```

Now bam! Supabase is up and running, and you can start developing the application. 🚀

## 🚀 Development

After setting up the project, you are ready to start developing. The following commands are available to manage the Supabase service throughout development:

- `supabase start` - Start the Supabase service if it is not running. _It may be necessary after restarting the computer_
- `supabase restart` - Restart the Supabase service.
- `supabase stop` - Stop the Supabase service if it is running.
- `supabase migration new <name>` - Create a new migration file to make changes to the schema. Creates a new file with the name and timestamp. Simply write SQL commands and when you are done, run the command below to apply the changes (**Warning**: This will delete all data in the database).
- `supabase db reset` - Apply the migration files to the database.
- `supabase db diff -f <name>` - Check if there is updates to the database schema. Creates a new file with the changes based on the name and timestamp. Useful if you prefer to use the Studio to create the schema. It is recommended to use this command often and to split between tables and relationships, else you will have a hard time understanding the changes.
- `supabase db dump --data-only --local > supabase/data/dump.sql` - Retrieve any data from the local database and save it to a file. **_Should not be used in production nor it is fully trustworthy while testing._**.

If you need further assistance, please refer to the [Supabase Documentation](https://supabase.com/docs/guides/cli/getting-started).

If you want to know how to contribute to this project, please refer to the [CONTRIBUTING.md](./.github/CONTRIBUTING.md) file.

## 💉 Testing 💉

The CI/CD pipeline will run the following tests to ensure the database schema is working as expected. You can run these tests locally to ensure the database schema is working as expected.

- **Linting the Database:**
  
  Run the linter to ensure the database schema is following the best practices.

  ```bash
  supabase db lint --schema public # Run the linter, see the results in the terminal

  supabase db lint --schema public > test/lint_results/lint.json # If you prefer to see the results in a file... 
  
  ```

- **Testing the Database:**

  Run the unit tests to ensure the database schema is working as expected.

  ```bash
  supabase db test # Run the unit tests
  ```

  You can find the unit tests in the `supabase/tests/*` directory. All the `*.sql` files in this directory are considered unit tests. They run with the [pgTAP](https://pgtap.org/documentation.html) extension, which is already installed in the Supabase service.

  The unit tests will run for every table in the database schema, ensuring the constraints are working as expected; for each trigger, verifying if it exists and if it is working as expected; and for each function, checking if it exists and if it is working as expected.

- **Tests Coverage:**

  Supabase does not provide a way to check the coverage of the tests. So you have to manually check the coverage of the tests and manually update the following tables.

  Note: Use the following emojis: < ✅|⚠️|❌ >, everything below 50% is ❌, between 50% and 80% is ⚠️, and above 80% is ✅.

### Total Coverage

| Status | Coverage          |
| ------ | ----------------- |
| ❌     | **0%** Tables (0/0) |
| ❌     | **0%** Triggers (0/0) |
| ❌     | **0%** Functions (0/0) |
| - | - |
| ❌     | **0%** Total (0/0) |

## 🧹 Cleanup

- **Cleanup:** To stop the Supabase service, remove the database volume, and remove the `.env` file:

  ```bash
  make cleanup-supabase
  ```