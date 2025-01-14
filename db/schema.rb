# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_02_12_211753) do

  create_table "annotations", force: :cascade do |t|
    t.string "uuid"
    t.string "source_uri"
    t.integer "playlist_item_id"
    t.text "annotation"
    t.string "type"
    t.index ["playlist_item_id"], name: "index_annotations_on_playlist_item_id"
    t.index ["type"], name: "index_annotations_on_type"
  end

  create_table "api_tokens", force: :cascade do |t|
    t.string "token", null: false
    t.string "username", null: false
    t.string "email", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["token"], name: "index_api_tokens_on_token", unique: true
    t.index ["username"], name: "index_api_tokens_on_username"
  end

  create_table "batch_entries", force: :cascade do |t|
    t.integer "batch_registries_id"
    t.text "payload", limit: 4294967295
    t.boolean "complete", default: false, null: false
    t.boolean "error", default: false, null: false
    t.string "current_status"
    t.string "error_message"
    t.string "media_object_pid"
    t.integer "position"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["batch_registries_id"], name: "index_batch_entries_on_batch_registries_id"
    t.index ["position"], name: "index_batch_entries_on_position"
  end

  create_table "batch_registries", force: :cascade do |t|
    t.string "file_name"
    t.string "replay_name"
    t.string "dir"
    t.integer "user_id"
    t.string "collection"
    t.boolean "complete", default: false, null: false
    t.boolean "processed_email_sent", default: false, null: false
    t.boolean "completed_email_sent", default: false, null: false
    t.boolean "error", default: false, null: false
    t.text "error_message"
    t.boolean "error_email_sent", default: false, null: false
    t.boolean "locked", default: false, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "bookmarks", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "user_type"
    t.string "document_id"
    t.string "document_type"
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["document_id"], name: "index_bookmarks_on_document_id"
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "courses", force: :cascade do |t|
    t.string "context_id"
    t.string "title"
    t.text "label"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "identities", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "ingest_batches", force: :cascade do |t|
    t.string "name", limit: 50
    t.string "email"
    t.text "media_object_ids"
    t.boolean "finished", default: false
    t.boolean "email_sent", default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "migration_statuses", force: :cascade do |t|
    t.string "source_class", null: false
    t.string "f3_pid", null: false
    t.string "f4_pid"
    t.string "datastream"
    t.string "checksum"
    t.string "status"
    t.text "log"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["source_class", "f3_pid", "datastream"], name: "index_migration_statuses"
  end

  create_table "minter_states", force: :cascade do |t|
    t.string "namespace", default: "default", null: false
    t.string "template", null: false
    t.text "counters"
    t.integer "seq", limit: 8, default: 0
    t.binary "rand"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["namespace"], name: "index_minter_states_on_namespace", unique: true
  end

  create_table "playlist_items", force: :cascade do |t|
    t.integer "playlist_id", null: false
    t.integer "clip_id", null: false
    t.integer "position"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["clip_id"], name: "index_playlist_items_on_clip_id"
    t.index ["playlist_id"], name: "index_playlist_items_on_playlist_id"
  end

  create_table "playlists", force: :cascade do |t|
    t.string "title"
    t.integer "user_id", null: false
    t.string "comment"
    t.string "visibility"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "access_token"
    t.string "tags"
    t.index ["user_id"], name: "index_playlists_on_user_id"
  end

  create_table "role_maps", force: :cascade do |t|
    t.string "entry"
    t.integer "parent_id"
  end

  create_table "searches", force: :cascade do |t|
    t.text "query_params"
    t.integer "user_id"
    t.string "user_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_searches_on_user_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.string "session_id", null: false
    t.text "data"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["session_id"], name: "index_sessions_on_session_id"
    t.index ["updated_at"], name: "index_sessions_on_updated_at"
  end

  create_table "stream_tokens", force: :cascade do |t|
    t.string "token"
    t.string "target"
    t.datetime "expires"
  end

  create_table "timelines", force: :cascade do |t|
    t.string "title"
    t.integer "user_id"
    t.string "visibility"
    t.text "description"
    t.string "access_token"
    t.string "tags"
    t.string "source"
    t.text "manifest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_timelines_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "provider"
    t.string "uid"
    t.string "guest"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

end
