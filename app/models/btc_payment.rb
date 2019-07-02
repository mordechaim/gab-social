# == Schema Information
#
# Table name: btc_payments
#
#  id                :bigint(8)        not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  account_id        :integer          not null
#  btcpay_invoice_id :string           not null
#  plan              :string           not null
#  success           :boolean          default(FALSE), not null
#

class BtcPayment < ApplicationRecord
	belongs_to :account
end
