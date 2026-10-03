from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

_url = settings.db_url
if _url.startswith("sqlite"):
    _connect_args = {"check_same_thread": False}
elif _url.startswith("postgresql"):
    # Neon's pooled endpoint (pgbouncer) + psycopg3: disable server-side prepared statements
    _connect_args = {"prepare_threshold": None}
else:
    _connect_args = {}

engine = create_engine(_url, pool_pre_ping=True, connect_args=_connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def run_light_migrations():
    """Adds columns that exist on the ORM models but not yet in the DB
    (no Alembic in this project). Safe to run on every start."""
    inspector = inspect(engine)
    with engine.begin() as conn:
        for table in Base.metadata.sorted_tables:
            if not inspector.has_table(table.name):
                continue
            existing = {c["name"] for c in inspector.get_columns(table.name)}
            for col in table.columns:
                if col.name in existing:
                    continue
                col_type = col.type.compile(engine.dialect)
                conn.execute(text(f'ALTER TABLE {table.name} ADD COLUMN {col.name} {col_type}'))
        if inspector.has_table("users"):
            conn.execute(text("UPDATE users SET role='Admin' WHERE role IS NULL"))
