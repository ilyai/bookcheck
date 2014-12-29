alter table bookmarks add column is_updated boolean default false;
alter table bookmarks add column hash char(32);
