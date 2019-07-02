# == Schema Information
#
# Table name: group_accounts
#
#  id                :bigint(8)        not null, primary key
#  group_id          :bigint(8)        not null
#  account_id        :bigint(8)        not null
#  write_permissions :boolean          default(FALSE), not null
#  role              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class GroupAccount < ApplicationRecord
  enum role: { admin: "admin" }

  belongs_to :group
  belongs_to :account

  validates :account_id, uniqueness: { scope: :group_id }
end
