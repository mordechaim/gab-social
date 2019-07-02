class CreateGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :groups do |t|
      t.belongs_to :account
      t.string :title, null: false
      t.string :description, null: false
      t.attachment :cover_image, null: true
      t.boolean :is_nsfw, null: false, default: false
      t.boolean :is_featured, null: false, default: false
      t.boolean :is_archived, null: false, default: false
      
      t.timestamps
    end
  end
end
