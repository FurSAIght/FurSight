create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";

create extension if not exists "timescaledb" with schema "extensions";

create extension if not exists "pgtap" with schema "extensions";

CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";

CREATE SCHEMA IF NOT EXISTS devices;

GRANT USAGE ON SCHEMA devices TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA devices TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA devices TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA devices TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA devices GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA devices GRANT ALL ON ROUTINES TO service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA devices GRANT ALL ON SEQUENCES TO service_role;
