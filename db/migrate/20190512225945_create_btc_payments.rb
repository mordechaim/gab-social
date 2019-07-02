class CreateBtcPayments < ActiveRecord::Migration[5.2]
  def change
    create_table :btc_payments do |t|
      t.timestamps
      t.integer :account_id, null: false
      t.string :btcpay_invoice_id, null: false
      t.string :plan, null: false
      t.boolean :success, null: false, default: false
    end
  end
end
