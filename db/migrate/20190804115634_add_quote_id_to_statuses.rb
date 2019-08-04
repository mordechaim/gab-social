class AddQuoteIdToStatuses < ActiveRecord::Migration[5.2]
  def change
    safety_assured { 
        add_reference :statuses, :quote_of, foreign_key: { on_delete: :nullify, to_table: :statuses }
    }
  end
end
