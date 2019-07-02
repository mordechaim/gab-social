# == Schema Information
#
# Table name: transactions
#
#  id                :bigint(8)        not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  account_id        :integer          not null
#  payment_type      :string
#  provider_type     :string
#  provider_response :text
#  amount            :integer          not null
#  success           :boolean          default(FALSE), not null
#

class Transaction < ApplicationRecord
	belongs_to :account, inverse_of: :transactions
end
