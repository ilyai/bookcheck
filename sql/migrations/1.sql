alter table bookmarks add column hit_count integer not null default 0;
create index bm_hit_count_idx on bookmarks (hit_count);
