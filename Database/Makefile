# main target
all: install

install:
	ifeq ($(OS),Windows_NT)
		scripts$(SEP)install_supabase.bat
	else
		./scripts/install_supabase.sh

help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  install: install supabase and its dependencies"
	@echo "  clean: clean up generated files and virtual environment"
	@echo "  help: show this help message"
	@echo "  start: start the Supabase service"
	@echo ""
	supabase help

run:
	supabase start

stop:
	supabase stop

# clean up generated files and virtual environment
clean:
	ifeq ($(OS),Windows_NT)
		scripts\\cleanup_supabase.bat
	else
		./scripts/cleanup_supabase.sh

# ------ TESTS TARGETS ------

# ...

# ---------------------------

# PHONY targets (targets that don't represent files)
.PHONY: all venv install clean